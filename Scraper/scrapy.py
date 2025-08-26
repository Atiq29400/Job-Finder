import requests
from bs4 import BeautifulSoup
import psycopg2
from datetime import datetime, timedelta
import time
import re

# -------------------------
# Database configuration
# -------------------------
DB_CONFIG = {
    'host': 'localhost',
    'database': 'jobfinder',
    'user': 'postgres',
    'password': 'Atiq1234'
}

BASE_URL = "https://www.actuarylist.com"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
}

# -------------------------
# Connect to PostgreSQL
# -------------------------
def connect_db():
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        print("[DB] Connection successful")
        return conn
    except Exception as e:
        print(f"[DB] Connection failed: {e}")
        return None

# -------------------------
# Parse "2d ago", "5h ago" format to actual date
# -------------------------
def parse_posting_date(posted_text):
    posted_text = posted_text.strip().lower()
    if 'd' in posted_text:
        days = int(re.search(r'(\d+)d', posted_text).group(1))
        return datetime.now() - timedelta(days=days)
    elif 'h' in posted_text:
        hours = int(re.search(r'(\d+)h', posted_text).group(1))
        return datetime.now() - timedelta(hours=hours)
    else:
        return datetime.now()

# -------------------------
# Extract jobs from a page
# -------------------------
def extract_jobs(page_url):
    print(f"[Scraping] Fetching {page_url}")
    response = requests.get(page_url, headers=HEADERS)
    if response.status_code != 200:
        print(f"[Scraping] Failed to fetch page, status code {response.status_code}")
        return []

    soup = BeautifulSoup(response.text, "html.parser")
    jobs = []

    job_cards = soup.find_all("div", class_="Job_job-card__YgDAV")
    print(f"[Scraping] Found {len(job_cards)} jobs on this page")

    for job in job_cards:
        try:
            title = job.find("p", class_="Job_job-card__position__ic1rc").text.strip()
            company = job.find("p", class_="Job_job-card__company__7T9qY").text.strip()
            
            location_links = job.find("div", class_="Job_job-card__locations__x1exr").find_all("a")
            location = ", ".join([loc.text.strip() for loc in location_links])
            
            tags_links = job.find("div", class_="Job_job-card__tags__zfriA").find_all("a")
            tags = ", ".join([tag.text.strip() for tag in tags_links])
            
            posting_date_text = job.find("p", class_="Job_job-card__posted-on__NCZaJ").text.strip()
            posting_date = parse_posting_date(posting_date_text)
            
            # Job type could be inferred from tags (e.g., Actuary (Fellow))
            job_type = tags_links[0].text.strip() if tags_links else "N/A"

            job_data = {
                "title": title,
                "company": company,
                "location": location,
                "posting_date": posting_date,
                "job_type": job_type,
                "tags": tags
            }

            print(f"[Scraping] Parsed job: {title} at {company}")
            jobs.append(job_data)
        except Exception as e:
            print(f"[Scraping] Error parsing a job: {e}")

    return jobs

# -------------------------
# Load jobs into database
# -------------------------
def load_jobs(jobs):
    conn = connect_db()
    if not conn:
        return
    cursor = conn.cursor()
    for job in jobs:
        try:
            cursor.execute("""
                INSERT INTO job (title, company, location, posting_date, job_type, tags)
                VALUES (%s, %s, %s, %s, %s, %s)
                ON CONFLICT DO NOTHING
            """, (
                job["title"], job["company"], job["location"],
                job["posting_date"], job["job_type"], job["tags"]
            ))
            print(f"[DB] Inserted: {job['title']} at {job['company']}")
        except Exception as e:
            print(f"[DB] Failed to insert job {job['title']}: {e}")

    conn.commit()
    cursor.close()
    conn.close()
    print("[DB] All jobs committed and connection closed")

# -------------------------
# Main ETL pipeline
# -------------------------
def run_pipeline(pages=1, delay=2):
    for page in range(1, pages + 1):
        page_url = f"{BASE_URL}?page={page}"
        jobs = extract_jobs(page_url)
        if jobs:
            load_jobs(jobs)
        else:
            print("[Pipeline] No jobs found on this page")
        print(f"[Pipeline] Sleeping for {delay}s to be polite...")
        time.sleep(delay)

if __name__ == "__main__":
    run_pipeline(pages=3, delay=3)
