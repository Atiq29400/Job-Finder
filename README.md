# Job Listing Web Application

A full-stack web application for browsing actuarial job listings with web scraping capabilities. Built with Flask, React, and Selenium for automated data collection from ActuaryList.com.

## 🏗️ Architecture Overview

- **Backend**: Flask REST API with SQLAlchemy ORM and PostgreSQL database
- **Frontend**: React.js single-page application with responsive design
- **Scraper**: Selenium-based web scraper for automated job data collection
- **Data Flow**: Scraper → Database → API → Frontend

## 📁 Project Structure

```
Job-Finder/
├── backend/
│   ├── app.py                 # Flask application entry point
│   ├── models.py
│   │   └ job.py               # SQLAlchemy database models
│   ├── routes.py
│   │   └ job.py               # API route definitions
│   ├── config.py              # Database configuration
│   └── requirements.txt       # Python dependencies
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── AddEditJob.tsx
│   │   │   ├── DeleteJob.tsx
│   │   │   ├── FilterSortJob.tsx
│   │   │   └── ListJob.tsx
│   │   ├── api.tsx          # API service functions
│   │   ├── App.js             # Main React component
│   │   └── index.js           # React entry point
│   ├── package.json           # Node.js dependencies
│   └── tailwind.config.js     # Tailwind CSS configuration
├── Scraper/
│   ├── scraper.py             # Main Selenium scraper
│   └── requirements.txt       # Scraper dependencies
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher
- PostgreSQL or MySQL database
- Chrome/Firefox browser (for scraping)
- ChromeDriver or GeckoDriver

### 1. Clone the Repository

```bash
git clone https://github.com/Atiq29400/Job-Finder.git
cd Job-Finder
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Edit postgres database URL in config.py file
SQLALCHEMY_DATABASE_URI = os.getenv(
   "DATABASE_URL",
   "postgresql://postgres:password@localhost:5432/jobfinder"
)

# Start Flask development server
python app.py
```

The backend API will be available at `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from root)
cd frontend

# Install dependencies
npm install

# Start React development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 4. Scraper Setup

```bash
# Navigate to scraper directory (from root)
cd scrap

# Install dependencies (if not using same venv as backend)
pip install -r requirements.txt

# On Ubuntu:
sudo apt-get install chromium-chromedriver

# To run Scraper
python scraper.py
```

## 🔧 API Endpoints

### Jobs

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| GET | `/jobs` | Get all jobs | `?job_type=`, `?location=`, `?tag=`, `?sort=` |
| GET | `/jobs/<id>` | Get specific job | - |
| POST | `/jobs` | Create new job | JSON body with job data |
| PUT | `/jobs/<id>` | Update job | JSON body with updated data |
| DELETE | `/jobs/<id>` | Delete job | - |
| POST | `/scrape` | Trigger scraper | Optional: `{"limit": 50}` |

### Example API Usage

#### Get Jobs with Filters
```bash
# Get all full-time jobs
curl "http://localhost:5000/jobs?job_type=Full-time"

# Get jobs sorted by date (newest first)
curl "http://localhost:5000/jobs?sort=posting_date_desc"

# Get jobs with specific tag
curl "http://localhost:5000/jobs?tag=Python"
```

#### Create a Job
```bash
curl -X POST http://localhost:5000/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Senior Actuary",
    "company": "Insurance Corp",
    "location": "New York, NY",
    "job_type": "Full-time",
    "tags": "Life, Pricing, Python",
    "posting_date": "2024-01-15"
  }'
```

### Manual Scraping

To run the scraper manually and populate your database:

```bash
cd scrap
python scraper.py
```

## 📈 Performance Optimization

- Database indexing on frequently queried fields
- API pagination for large job lists
- Frontend state management with React hooks
- Lazy loading of job details
- Caching strategies for frequently accessed data

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify DATABASE_URL in .env file
   - Ensure database server is running
   - Check database credentials and permissions

2. **Scraper Not Working**
   - Verify ChromeDriver installation and PATH
   - Check if target website structure has changed
   - Increase wait times for slow-loading pages

3. **CORS Issues**
   - Ensure Flask-CORS is configured properly
   - Check frontend API base URL configuration

4. **Frontend Not Loading Data**
   - Verify backend API is running on correct port
   - Check browser console for network errors
   - Confirm API endpoint URLs match

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- ActuaryList.com for providing job listing data
- Flask and React communities for excellent documentation
- Selenium team for web automation tools