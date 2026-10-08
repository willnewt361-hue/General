"""
Flask Blueprint: JSON API + the static dashboard (HTML/CSS/JS).

    /analytics/                    -> dashboard page
    /api/analytics/meta            -> dropdown options
    /api/analytics/dashboard       -> KPIs, charts, insights
    /api/analytics/table           -> table rows + column definitions
    /api/analytics/student/<id>    -> student profile pop-up

SECURITY: by default anyone can pick any role in the dashboard (demo mode).
In production set app.config["ANALYTICS_SCOPE_RESOLVER"] to a function that
returns ("head" | "teacher" | "student", person_id) for the logged-in user.
The API will then IGNORE role/ids sent by the browser.
"""
import logging
import os
from dataclasses import replace
from datetime import date, datetime
from decimal import Decimal

from flask import Blueprint, abort, current_app, jsonify, request, send_from_directory

from . import service
from .bootstrap import ensure_ready
from .filters import apply_role_scope, parse_filters

log = logging.getLogger(__name__)

api_bp = Blueprint("analytics_api", __name__, url_prefix="/api/analytics")
page_bp = Blueprint("analytics_page", __name__, url_prefix="/analytics")


def _static_dir():
    """Folder with index.html, app.js, styles.css, config.js, vendor/."""
    configured = current_app.config.get("ANALYTICS_STATIC_DIR")
    if configured:
        return configured
    here = os.path.dirname(os.path.abspath(__file__))
    bundled = os.path.join(here, "static")
    if os.path.isdir(bundled):
        return bundled
    return os.path.join(here, "..", "public", "dashboard")  # this repo's layout


def _json_safe(value):
    if isinstance(value, Decimal):
        return float(value)
    if isinstance(value, (date, datetime)):
        return value.isoformat()
    if isinstance(value, dict):
        return {k: _json_safe(v) for k, v in value.items()}
    if isinstance(value, list):
        return [_json_safe(v) for v in value]
    return value


def _current_filters():
    f = parse_filters(request.args)
    resolver = current_app.config.get("ANALYTICS_SCOPE_RESOLVER")
    if resolver:
        role, person_id = resolver()  # trust the server session, not the browser
        f = replace(
            f,
            role=role,
            teacher_id=person_id if role == "teacher" else None,
            student_id=person_id if role == "student" else None,
        )
    return apply_role_scope(f)


def _respond(fn):
    try:
        ensure_ready()
        data = fn()
        if data is None:
            return jsonify({"error": "Not found"}), 404
        resp = jsonify(_json_safe(data))
        resp.headers["Cache-Control"] = "no-store"
        return resp
    except Exception:  # keep the dashboard alive, log the real error
        log.exception("analytics query failed")
        return jsonify({"error": "Analytics query failed"}), 500


# ------------------------------------------------------------------ API

@api_bp.get("/meta")
def meta():
    return _respond(service.get_meta)


@api_bp.get("/dashboard")
def dashboard():
    return _respond(lambda: service.get_dashboard(_current_filters()))


@api_bp.get("/table")
def table():
    return _respond(lambda: service.get_table(_current_filters()))


@api_bp.get("/student/<student_id>")
def student(student_id):
    def work():
        f = _current_filters()
        # Students may only open their own profile.
        if f.role == "student" and f.student_id != student_id:
            abort(403)
        return service.get_student_detail(student_id, f)
    return _respond(work)


# ------------------------------------------------------------------ Page

@page_bp.get("/")
def page_index():
    return send_from_directory(_static_dir(), "index.html")


@page_bp.get("/<path:filename>")
def page_assets(filename):
    return send_from_directory(_static_dir(), filename)
