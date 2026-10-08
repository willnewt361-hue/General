"""
Run the analytics dashboard on its own (for testing):

    pip install -r flask_analytics/requirements.txt
    export DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/app_db
    python -m flask_analytics.example_app
    # open http://127.0.0.1:5000/analytics/
"""
from flask import Flask, redirect

from flask_analytics import init_analytics

app = Flask(__name__)
init_analytics(app)


@app.get("/")
def home():
    return redirect("/analytics/")


if __name__ == "__main__":
    app.run(debug=True, port=5000)
