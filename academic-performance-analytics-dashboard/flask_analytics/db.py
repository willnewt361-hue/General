"""
Database helper for the analytics blueprint.

Uses psycopg2 (already a dependency of MHS). Reads the connection string
from ANALYTICS_DATABASE_URL, then DATABASE_URL (same variable MHS uses).
"""
import os
from contextlib import contextmanager

import psycopg2
import psycopg2.extras
from psycopg2.pool import ThreadedConnectionPool

_pool = None


def _dsn():
    return (
        os.getenv("ANALYTICS_DATABASE_URL")
        or os.getenv("DATABASE_URL")
        or "postgresql://postgres:postgres@127.0.0.1:5432/app_db"
    )


def get_pool():
    global _pool
    if _pool is None:
        _pool = ThreadedConnectionPool(minconn=1, maxconn=10, dsn=_dsn())
    return _pool


@contextmanager
def connection():
    """Borrow a pooled connection and always give it back."""
    conn = get_pool().getconn()
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        get_pool().putconn(conn)


def query(sql, params=None):
    """Run a SELECT and return a list of dicts (column name -> value)."""
    with connection() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute(sql, params or {})
            return [dict(r) for r in cur.fetchall()]


def run_script(sql_text):
    """Execute a multi-statement SQL file (schema / seed)."""
    with connection() as conn:
        with conn.cursor() as cur:
            cur.execute(sql_text)
