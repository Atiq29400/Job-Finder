import os

class Config:
    # Update with your PostgreSQL credentials
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        "postgresql://postgres:Atiq1234@localhost:5432/jobfinder"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
