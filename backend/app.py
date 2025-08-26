from flask import Flask
from flask_cors import CORS
from db import db
from config import Config
from routes.job import job_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Enable CORS for your specific frontend
    CORS(app, origins=["http://localhost:5174"])

    # Or enable CORS for all origins (less secure but works for development):
    # CORS(app)

    # Initialize SQLAlchemy
    db.init_app(app)

    # Create tables
    with app.app_context():
        db.create_all()

    # Register blueprints
    app.register_blueprint(job_bp, url_prefix="/api/jobs")

    # Optional root route
    @app.route("/")
    def home():
        return {"message": "JobFinder API is running"}

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)