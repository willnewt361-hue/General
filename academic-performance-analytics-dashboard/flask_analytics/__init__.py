"""
MHS Analytics - plug-in package for the Mengo Hub System (Flask).

Usage in flask_app.py:

    from flask_analytics import init_analytics
    init_analytics(app)                 # dashboard at /analytics/

Optional (recommended in production) - lock the dashboard to the logged-in user:

    def analytics_scope():
        # return ("head" | "teacher" | "student", user_id)
        if session.get("is_admin"):
            return "head", None
        return session.get("user_type", "student"), session.get("user_id")

    app.config["ANALYTICS_SCOPE_RESOLVER"] = analytics_scope
"""
from .routes import api_bp, page_bp


def init_analytics(app):
    """Register the API + dashboard blueprints on an existing Flask app."""
    app.register_blueprint(api_bp)
    app.register_blueprint(page_bp)
    return app


__all__ = ["init_analytics", "api_bp", "page_bp"]
