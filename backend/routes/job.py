from flask import Blueprint, request, jsonify
from db import db
from models.job import Job
from flask_cors import CORS

job_bp = Blueprint("job_bp", __name__)
CORS(job_bp, origins="*")

# GET /api/jobs
@job_bp.route("/", methods=["GET"])
def get_jobs():
    query = Job.query

    # Filtering
    job_title = request.args.get("title")
    job_type = request.args.get("job_type")
    location = request.args.get("location")
    tag = request.args.get("tag")

    if job_title:
        query = query.filter(Job.title.ilike(f"%{job_title}%"))
    if job_type:
        query = query.filter(Job.job_type.ilike(f"%{job_type}%"))
    if location:
        query = query.filter(Job.location.ilike(f"%{location}%"))
    if tag:
        query = query.filter(Job.tags.ilike(f"%{tag}%"))

    # Sorting
    sort = request.args.get("sort")
    if sort == "posting_date_desc":
        query = query.order_by(Job.posting_date.desc())
    elif sort == "posting_date_asc":
        query = query.order_by(Job.posting_date.asc())
    else:
        query = query.order_by(Job.posting_date.desc())

    jobs = query.all()
    return jsonify([job.to_dict() for job in jobs])

# GET /api/jobs/<id>
@job_bp.route("/<int:id>", methods=["GET"])
def get_job(id):
    job = Job.query.get(id)
    if not job:
        return jsonify({"error": "Job not found"}), 404
    return jsonify(job.to_dict())

# POST /api/jobs
@job_bp.route("/", methods=["POST"])
def create_job():
    data = request.json
    required_fields = ["title", "company", "location", "job_type"]
    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({"error": f"{field} is required"}), 400

    job = Job(
        title=data["title"],
        company=data["company"],
        location=data["location"],
        job_type=data["job_type"],
        tags=",".join(data.get("tags", [])) if isinstance(data.get("tags"), list) else data.get("tags")
    )
    db.session.add(job)
    db.session.commit()
    return jsonify(job.to_dict()), 201

# PUT /api/jobs/<id>
@job_bp.route("/<int:id>", methods=["PUT"])
def update_job(id):
    job = Job.query.get(id)
    if not job:
        return jsonify({"error": "Job not found"}), 404

    data = request.json
    for field in ["title", "company", "location", "job_type", "tags"]:
        if field in data:
            if field == "tags" and isinstance(data[field], list):
                setattr(job, field, ",".join(data[field]))
            else:
                setattr(job, field, data[field])

    db.session.commit()
    return jsonify(job.to_dict())

# DELETE /api/jobs/<id>
@job_bp.route("/<int:id>", methods=["DELETE"])
def delete_job(id):
    job = Job.query.get(id)
    if not job:
        return jsonify({"error": "Job not found"}), 404

    db.session.delete(job)
    db.session.commit()
    return jsonify({"message": "Job deleted successfully"})
