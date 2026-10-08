/*
 * Dashboard configuration – the only file you may need to edit when
 * moving the dashboard into Flask (or any other backend).
 */
window.MHS_ANALYTICS_CONFIG = {
  // Where the JSON API lives. Flask blueprint uses the same prefix by default.
  apiBase: "/api/analytics",

  // Auto-refresh interval when "Live refresh" is switched on (milliseconds).
  liveRefreshMs: 30000,

  // If your Flask app already knows who is logged in, set these from the
  // template, e.g. role: "{{ session.role }}", personId: "{{ session.user_id }}"
  // and set lockRole: true so users cannot switch to other views.
  role: null,       // "head" | "teacher" | "student"
  personId: null,   // teacher id or student id
  lockRole: false,
};
