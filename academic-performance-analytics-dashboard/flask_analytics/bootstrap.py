"""
Creates missing analytics tables/columns and (optionally) loads sample data.
Uses the same SQL files as the Next.js version: analytics_sql/schema.sql + seed.sql
"""
import os
import threading

from .db import query, run_script

_lock = threading.Lock()
_done = False


def _sql_dir():
    here = os.path.dirname(os.path.abspath(__file__))
    for candidate in (os.path.join(here, "sql"), os.path.join(here, "..", "analytics_sql")):
        if os.path.isdir(candidate):
            return candidate
    raise FileNotFoundError("analytics SQL folder not found (expected flask_analytics/sql or analytics_sql)")


def _read(name):
    with open(os.path.join(_sql_dir(), name), encoding="utf-8") as fh:
        return fh.read()


def ensure_ready(seed_if_empty=None):
    """
    Run once per process. Set ANALYTICS_SEED_SAMPLE_DATA=0 in production so your
    real (empty) tables are never filled with demo data.
    """
    global _done
    if _done:
        return
    with _lock:
        if _done:
            return
        run_script(_read("schema.sql"))
        if seed_if_empty is None:
            seed_if_empty = os.getenv("ANALYTICS_SEED_SAMPLE_DATA", "1") == "1"
        if seed_if_empty and query("SELECT count(*)::int AS n FROM students")[0]["n"] == 0:
            run_script(_read("seed.sql"))
        _done = True
