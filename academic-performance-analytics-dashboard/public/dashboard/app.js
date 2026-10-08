/* =====================================================================
   MHS Analytics – dashboard logic (vanilla JS + Chart.js)
   ---------------------------------------------------------------------
   Sections
     1. State & config          8. KPI cards
     2. Small helpers           9. Charts
     3. API                    10. Lists, insights, heatmap
     4. Theme & colours        11. Data table
     5. Filters                12. Student profile modal
     6. Roles (who is viewing) 13. Navigation, shortcuts, live refresh
     7. Load + render          14. Start-up
   ===================================================================== */
(function () {
  "use strict";

  /* ---------------- 1. State & config ---------------- */
  var CFG = Object.assign({ apiBase: "/api/analytics", liveRefreshMs: 30000, role: null, personId: null, lockRole: false },
    window.MHS_ANALYTICS_CONFIG || {});
  var STORE_KEY = "mhs-analytics-state";
  var VIEW_TITLES = { overview: "Overview", academics: "Academics", attendance: "Attendance & Assignments", students: "Students", insights: "Insights & Alerts" };

  var state = {
    view: "overview",
    role: "head",
    personId: null,
    preset: "90",
    filters: { start: "", end: "", class: "all", stream: "all", subject: "all", gender: "all", exam_type: "all" },
    meta: null,
    data: null,
    table: { kind: "students", columns: [], rows: [], sortKey: "rank", sortDir: 1, search: "", status: "all", grade: "all", page: 1, pageSize: 15 },
  };
  var charts = {};
  var liveTimer = null;
  var loadSeq = 0;
  var kpiMemory = {};

  /* ---------------- 2. Small helpers ---------------- */
  var $ = function (sel) { return document.querySelector(sel); };
  var $$ = function (sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); };
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function localToday() { var d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 10); }
  function addDays(iso, n) { var d = new Date(iso + "T00:00:00Z"); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); }
  function daysBetween(a, b) { return Math.round((Date.parse(b) - Date.parse(a)) / 864e5) + 1; }
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  function fmtDate(iso, withYear) { var p = iso.split("-"); return +p[2] + " " + MONTHS[+p[1] - 1] + (withYear ? " " + p[0] : ""); }
  function fmtBucket(iso, unit) {
    var p = iso.split("-");
    if (unit === "month") return MONTHS[+p[1] - 1] + " " + p[0].slice(2);
    return +p[2] + " " + MONTHS[+p[1] - 1];
  }
  function fmt(v, unit) { if (v === null || v === undefined) return "–"; return unit === "%" ? v.toFixed(1) + "%" : String(v); }
  function initials(name) { return String(name).split(" ").map(function (w) { return w[0]; }).slice(0, 2).join("").toUpperCase(); }
  function hueOf(str) { var h = 0; for (var i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 360; return h; }
  function avatar(name) { return '<span class="avatar" style="--avatar:hsl(' + hueOf(name) + ',55%,52%)">' + esc(initials(name)) + "</span>"; }
  function slug(s) { return String(s).toLowerCase().replace(/\s+/g, "-"); }
  /** Run one render step; a failure in one widget never blanks the rest. */
  function safe(name, fn) { try { fn(); } catch (err) { console.error("[render:" + name + "]", err); } }
  function debounce(fn, ms) { var t; return function () { clearTimeout(t); t = setTimeout(fn, ms); }; }
  function toast(msg) { var t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(t._h); t._h = setTimeout(function () { t.classList.remove("show"); }, 2600); }
  function isMerged(o) { return o && typeof o === "object" && !Array.isArray(o) && typeof o !== "function"; }
  function merge(a, b) {
    var out = Object.assign({}, a);
    Object.keys(b || {}).forEach(function (k) { out[k] = isMerged(a[k]) && isMerged(b[k]) ? merge(a[k], b[k]) : b[k]; });
    return out;
  }

  /* ---------------- 3. API ---------------- */
  function api(path) {
    return fetch(CFG.apiBase + path, { headers: { Accept: "application/json" }, credentials: "same-origin" }).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    });
  }
  function queryString() {
    var f = state.filters;
    var p = new URLSearchParams({ start: f.start, end: f.end, role: state.role });
    ["class", "stream", "subject", "gender", "exam_type"].forEach(function (k) { if (f[k] && f[k] !== "all") p.set(k, f[k]); });
    if (state.role === "teacher" && state.personId) p.set("teacher_id", state.personId);
    if (state.role === "student" && state.personId) p.set("student_id", state.personId);
    return p.toString();
  }

  /* ---------------- 4. Theme & colours ---------------- */
  function cssVar(n) { return getComputedStyle(document.documentElement).getPropertyValue(n).trim(); }
  function colors() {
    return {
      primary: cssVar("--primary"), accent: cssVar("--accent"), good: cssVar("--good"), bad: cssVar("--bad"),
      warn: cssVar("--warn"), info: cssVar("--info"), muted: cssVar("--muted"), border: cssVar("--border"),
      text: cssVar("--text"), surface: cssVar("--surface"),
    };
  }
  var GRADE_COLORS = { A: "#10b981", B: "#14b8a6", C: "#0ea5e9", D: "#f59e0b", E: "#f97316", F: "#f43f5e" };
  function rgba(hex, a) {
    var h = hex.replace("#", ""); if (h.length === 3) h = h.split("").map(function (c) { return c + c; }).join("");
    var n = parseInt(h, 16); return "rgba(" + (n >> 16) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + a + ")";
  }
  function scoreColor(v) { var c = colors(); if (v === null) return c.muted; return v >= 70 ? c.good : v >= 50 ? c.info : c.bad; }
  function gradeOf(v) {
    if (v === null || v === undefined) return null;
    var bands = (state.meta && state.meta.gradeBands) || [{ grade: "A", min: 80 }, { grade: "B", min: 70 }, { grade: "C", min: 60 }, { grade: "D", min: 50 }, { grade: "E", min: 40 }, { grade: "F", min: 0 }];
    for (var i = 0; i < bands.length; i++) if (v >= bands[i].min) return bands[i].grade;
    return "F";
  }
  function gradeBadge(g) { return g ? '<span class="grade" style="background:' + GRADE_COLORS[g] + '">' + g + "</span>" : "–"; }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("mhs-theme", theme);
    var c = colors();
    Chart.defaults.color = c.muted;
    Chart.defaults.borderColor = c.border;
    if (state.data) renderCharts(state.data);
  }
  function toggleTheme() { applyTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark"); }

  /* ---------------- 5. Filters ---------------- */
  function presetRange(p) {
    var end = localToday();
    var y = +end.slice(0, 4), m = +end.slice(5, 7);
    if (p === "ytd") return { start: y + "-01-01", end: end };
    if (p === "term") {
      // Ugandan school calendar: Term 1 Feb–Apr, Term 2 May–Aug, Term 3 Sep–Dec
      var start = m >= 9 ? y + "-09-01" : m >= 5 ? y + "-05-01" : m >= 2 ? y + "-02-01" : (y - 1) + "-09-01";
      return { start: start, end: end };
    }
    return { start: addDays(end, -(+p - 1)), end: end };
  }
  function fillSelect(el, items, allLabel, valueKey, labelFn) {
    var keep = el.value;
    el.innerHTML = '<option value="all">' + allLabel + "</option>" + items.map(function (it) {
      var v = valueKey ? it[valueKey] : it;
      return '<option value="' + esc(v) + '">' + esc(labelFn ? labelFn(it) : v) + "</option>";
    }).join("");
    if (keep) el.value = keep;
    if (!el.value) el.value = "all";
  }
  function populateFilters() {
    var m = state.meta;
    fillSelect($("#fClass"), m.classes, "All classes");
    fillSelect($("#fStream"), m.streams, "All streams", null, function (s) { return "Stream " + s; });
    fillSelect($("#fSubject"), m.subjects, "All subjects");
    fillSelect($("#fExam"), m.examTypes, "All assessments");
    fillSelect($("#gradeFilter"), m.gradeBands, "All grades", "grade", function (b) { return "Grade " + b.grade; });
  }
  function syncFilterInputs() {
    var f = state.filters;
    $("#startDate").value = f.start; $("#endDate").value = f.end;
    $("#fClass").value = f.class; $("#fStream").value = f.stream; $("#fSubject").value = f.subject;
    $("#fGender").value = f.gender; $("#fExam").value = f.exam_type;
    $$("#presets button").forEach(function (b) { b.classList.toggle("active", b.dataset.preset === state.preset); });
    var active = ["class", "stream", "subject", "gender", "exam_type"].filter(function (k) { return f[k] !== "all"; }).length;
    $("#filterCount").hidden = !active; $("#filterCount").textContent = active;
  }
  function setPreset(p) {
    state.preset = p;
    var r = presetRange(p);
    state.filters.start = r.start; state.filters.end = r.end;
    syncFilterInputs(); reload();
  }
  function bindFilters() {
    $$("#presets button").forEach(function (b) { b.addEventListener("click", function () { setPreset(b.dataset.preset); }); });
    ["#startDate", "#endDate"].forEach(function (sel) {
      $(sel).addEventListener("change", function () {
        var s = $("#startDate").value, e = $("#endDate").value;
        if (!s || !e) return;
        if (s > e) { var t = s; s = e; e = t; }
        state.filters.start = s; state.filters.end = e; state.preset = "custom";
        syncFilterInputs(); reload();
      });
    });
    [["#fClass", "class"], ["#fStream", "stream"], ["#fSubject", "subject"], ["#fGender", "gender"], ["#fExam", "exam_type"]].forEach(function (pair) {
      $(pair[0]).addEventListener("change", function (e) { state.filters[pair[1]] = e.target.value; syncFilterInputs(); reload(); });
    });
    $("#resetBtn").addEventListener("click", function () {
      var lockedClass = state.role !== "head";
      state.filters = Object.assign(state.filters, { subject: "all", gender: "all", exam_type: "all" });
      if (!lockedClass) { state.filters.class = "all"; state.filters.stream = "all"; }
      setPreset("90");
      toast("Filters reset");
    });
    $("#filtersToggle").addEventListener("click", function () { $(".filters").classList.toggle("open"); });
  }

  /* ---------------- 6. Roles (who is viewing) ---------------- */
  function populatePeople() {
    var sel = $("#personSelect"), m = state.meta;
    if (state.role === "head") { sel.hidden = true; return; }
    sel.hidden = CFG.lockRole;
    if (state.role === "teacher") {
      sel.innerHTML = m.teachers.map(function (t) {
        return '<option value="' + esc(t.id) + '">' + esc(t.name) + " · " + esc(t.class + " " + t.stream) + "</option>";
      }).join("");
    } else {
      var groups = {};
      m.students.forEach(function (s) { var k = s.class + " " + s.stream; (groups[k] = groups[k] || []).push(s); });
      sel.innerHTML = Object.keys(groups).sort().map(function (g) {
        return '<optgroup label="' + esc(g) + '">' + groups[g].map(function (s) {
          return '<option value="' + esc(s.id) + '">' + esc(s.name) + "</option>";
        }).join("") + "</optgroup>";
      }).join("");
    }
    var list = state.role === "teacher" ? m.teachers : m.students;
    if (!list.some(function (x) { return x.id === state.personId; })) state.personId = list.length ? list[0].id : null;
    sel.value = state.personId;
  }
  function applyRoleUI() {
    var r = state.role, m = state.meta;
    $("#roleSelect").value = r;
    populatePeople();
    // Lock filters that the role is not allowed to change.
    var person = r === "teacher" ? m.teachers.find(function (t) { return t.id === state.personId; })
      : r === "student" ? m.students.find(function (s) { return s.id === state.personId; }) : null;
    if (person) { state.filters.class = person.class; state.filters.stream = person.stream; }
    $("#fClass").disabled = $("#fStream").disabled = r !== "head";
    $("#fGender").disabled = r === "student";
    if (r === "student") state.filters.gender = "all";
    // Show only the cards meant for this role.
    var group = r === "student" ? "student" : r;
    $$("[data-roles]").forEach(function (el) { el.hidden = el.dataset.roles.split(" ").indexOf(group) === -1; });
    var navLabel = $("[data-label-student]");
    navLabel.textContent = r === "student" ? navLabel.dataset.labelStudent : "Students";
    VIEW_TITLES.students = r === "student" ? "My Subjects" : "Students";
    $("#viewTitle").textContent = VIEW_TITLES[state.view];
    $("#subjectSub").textContent = r === "head" ? "Average vs previous period" : r === "teacher" ? "Class average vs school average" : "My average vs class average";
    if (CFG.lockRole) $("#roleSelect").hidden = true;
    syncFilterInputs();
  }
  function bindRoles() {
    $("#roleSelect").addEventListener("change", function (e) {
      var wasHead = state.role === "head";
      state.role = e.target.value; state.personId = null;
      if (state.role === "head" && !wasHead) { state.filters.class = "all"; state.filters.stream = "all"; }
      state.table.sortKey = state.role === "student" ? "subject" : "rank"; state.table.sortDir = 1;
      state.table.status = "all"; state.table.page = 1;
      applyRoleUI(); reload();
    });
    $("#personSelect").addEventListener("change", function (e) { state.personId = e.target.value; applyRoleUI(); reload(); });
  }

  /* ---------------- 7. Load + render ---------------- */
  function saveState() {
    localStorage.setItem(STORE_KEY, JSON.stringify({ view: state.view, role: state.role, personId: state.personId, preset: state.preset, filters: state.filters }));
  }
  function load() {
    var seq = ++loadSeq;
    $("#content").classList.add("loading");
    var qs = queryString();
    return Promise.all([api("/dashboard?" + qs), api("/table?" + qs)]).then(function (res) {
      if (seq !== loadSeq) return; // a newer request already started
      state.data = res[0];
      safe("table", function () { setTableData(res[1]); });
      renderDashboard(res[0]);
      $("#lastUpdated").textContent = "Updated " + new Date().toLocaleTimeString();
      saveState();
    }).catch(function (err) {
      console.error(err); toast("Could not load data – " + err.message);
    }).then(function () { if (seq === loadSeq) $("#content").classList.remove("loading"); });
  }
  var reload = debounce(load, 120);

  function renderDashboard(d) {
    var days = daysBetween(d.scope.start, d.scope.end);
    $("#scopeLabel").textContent = d.scope.label + " · " + fmtDate(d.scope.start, true) + " – " + fmtDate(d.scope.end, true) + " · compared with previous " + days + " days";
    safe("kpis", function () { renderKpis(d.kpis); });
    safe("charts", function () { renderCharts(d); });
    safe("insights", function () { renderInsights(d.insights); });
    safe("lists", function () { renderLists(d); });
    safe("heatmap", function () { renderHeatmap(d.heatmap); });
    var badge = $("#riskBadge"), risk = d.kpis.find(function (k) { return k.key === "risk"; });
    badge.hidden = !risk || !risk.value; if (risk) badge.textContent = risk.value;
  }

  /* ---------------- 8. KPI cards ---------------- */
  var KPI_COLORS = { avg: "--primary", pass: "--info", att: "--accent", asg: "--warn", risk: "--bad", rank: "--primary", dist: "--good" };
  function renderKpis(kpis) {
    $("#kpis").innerHTML = kpis.map(function (k) {
      var d = k.value !== null && k.prev !== null ? k.value - k.prev : null;
      var cls = "flat", txt = "no previous data";
      if (d !== null) {
        var improved = k.higherIsBetter ? d > 0 : d < 0;
        cls = Math.abs(d) < 0.05 ? "flat" : improved ? "good" : "bad";
        var arrow = Math.abs(d) < 0.05 ? "■" : d > 0 ? "▲" : "▼";
        txt = arrow + " " + (k.unit === "%" ? Math.abs(d).toFixed(1) + " pts" : Math.abs(d));
      }
      var bar = k.unit === "%" ? k.value : k.key === "rank" && k.value ? 100 * (1 - (k.value - 1) / Math.max(1, (+(k.label.split("/")[1]) || 1))) : null;
      var unitSuffix = k.unit === "%" ? "<small>%</small>" : k.unit === "#" ? "" : "";
      return '<article class="card kpi" style="--kpi-color:var(' + KPI_COLORS[k.key] + ')">' +
        '<div class="label"><span>' + esc(k.label) + '</span><span class="info-dot" title="' + esc(k.hint) + '">i</span></div>' +
        '<div class="value"><span data-kpi="' + k.key + '" data-decimals="' + (k.unit === "%" ? 1 : 0) + '" data-to="' + (k.value === null ? "" : k.value) + '">' +
        (k.key === "rank" && k.value ? "#" : "") + '<b style="font-weight:inherit">0</b></span>' + (k.value === null ? "" : unitSuffix) + "</div>" +
        '<div class="meta"><span class="delta ' + cls + '">' + txt + "</span>" + (d !== null ? "<span>vs prev.</span>" : "") + "</div>" +
        (bar !== null ? '<div class="bar"><i data-w="' + Math.max(0, Math.min(100, bar)) + '"></i></div>' : "") +
        "</article>";
    }).join("");
    // count-up animation + bar grow
    $$("[data-kpi]").forEach(function (el) {
      var target = el.dataset.to === "" ? null : +el.dataset.to, dec = +el.dataset.decimals, b = el.querySelector("b");
      if (target === null) { b.textContent = "–"; return; }
      var from = kpiMemory[el.dataset.kpi] || 0, t0 = performance.now();
      kpiMemory[el.dataset.kpi] = target;
      (function step(t) {
        var k = Math.min(1, (t - t0) / 700), e = 1 - Math.pow(1 - k, 3);
        b.textContent = (from + (target - from) * e).toFixed(dec);
        if (k < 1) requestAnimationFrame(step);
      })(t0);
    });
    requestAnimationFrame(function () { $$(".kpi .bar i").forEach(function (i) { i.style.width = i.dataset.w + "%"; }); });
  }

  /* ---------------- 9. Charts ---------------- */
  // Draws a big number in the middle of doughnut charts.
  Chart.register({
    id: "centerText",
    afterDraw: function (chart, _args, opts) {
      if (!opts || !opts.text) return;
      var a = chart.chartArea, ctx = chart.ctx, x = (a.left + a.right) / 2, y = (a.top + a.bottom) / 2;
      ctx.save(); ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillStyle = colors().text; ctx.font = "750 22px Inter, system-ui, sans-serif"; ctx.fillText(opts.text, x, y - 6);
      ctx.fillStyle = colors().muted; ctx.font = "500 11px Inter, system-ui, sans-serif"; ctx.fillText(opts.label || "", x, y + 14);
      ctx.restore();
    },
  });

  function baseOptions(extra) {
    var c = colors();
    return merge({
      responsive: true, maintainAspectRatio: false,
      animation: { duration: 750, easing: "easeOutQuart" },
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { position: "bottom", labels: { usePointStyle: true, pointStyle: "circle", boxWidth: 7, boxHeight: 7, padding: 14, color: c.muted, font: { size: 12 } } },
        tooltip: {
          backgroundColor: c.surface, titleColor: c.text, bodyColor: c.text, borderColor: c.border, borderWidth: 1,
          padding: 10, cornerRadius: 10, boxPadding: 5, usePointStyle: true, titleFont: { weight: "700" },
        },
        centerText: {},
      },
    }, extra || {});
  }
  function axis(extra) {
    var c = colors();
    return merge({ grid: { color: rgba(c.border.length > 3 ? c.border : "#cccccc", 0.7), drawTicks: false }, border: { display: false }, ticks: { color: c.muted, padding: 8, font: { size: 11 } } }, extra || {});
  }
  function pctTicks(extra) { return axis(merge({ ticks: { callback: function (v) { return v + "%"; } } }, extra || {})); }
  function gradientFill(hex) {
    return function (ctx) {
      var ch = ctx.chart, area = ch.chartArea;
      if (!area) return rgba(hex, 0.15);
      var g = ch.ctx.createLinearGradient(0, area.top, 0, area.bottom);
      g.addColorStop(0, rgba(hex, 0.28)); g.addColorStop(1, rgba(hex, 0));
      return g;
    };
  }
  /** Create a chart once, then update it in place so Chart.js animates the change. */
  function upsert(id, type, data, options) {
    try { return upsertChart(id, type, data, options); }
    catch (err) { console.error("[chart:" + id + "]", err); return null; }
  }
  function upsertChart(id, type, data, options) {
    var existing = charts[id];
    if (existing && existing.config.type === type) {
      existing.data.labels = data.labels;
      data.datasets.forEach(function (ds, i) {
        if (existing.data.datasets[i]) Object.assign(existing.data.datasets[i], ds);
        else existing.data.datasets.push(ds);
      });
      existing.data.datasets.length = data.datasets.length;
      existing.options = options;
      existing.update();
      return existing;
    }
    if (existing) existing.destroy();
    var canvas = document.getElementById(id);
    if (!canvas) return null;
    charts[id] = new Chart(canvas, { type: type, data: data, options: options });
    return charts[id];
  }
  var pctLabel = function (ctx) { return " " + ctx.dataset.label + ": " + (ctx.parsed.y ?? ctx.parsed.x ?? ctx.parsed).toFixed(1) + "%"; };

  function renderCharts(d) {
    var c = colors(), unit = d.scope.unit, labels = d.trend.buckets.map(function (b) { return fmtBucket(b, unit); });
    var youLabel = d.scope.role === "student" ? "My average" : d.scope.role === "teacher" ? "Class average" : "Average score";

    // Overview: performance trend (line, two axes)
    var trendSets = [
      { label: youLabel, data: d.trend.score, borderColor: c.primary, backgroundColor: gradientFill(c.primary), fill: true, tension: 0.35, borderWidth: 2.5, pointRadius: 0, pointHoverRadius: 5, spanGaps: true, yAxisID: "y" },
      { label: "Attendance", data: d.trend.attendance, borderColor: c.accent, backgroundColor: c.accent, tension: 0.35, borderWidth: 2, pointRadius: 0, pointHoverRadius: 5, spanGaps: true, yAxisID: "y1" },
    ];
    if (d.peerLabel) trendSets.push({ label: d.peerLabel, data: d.trend.peer, borderColor: c.muted, backgroundColor: c.muted, borderDash: [6, 5], tension: 0.35, borderWidth: 1.8, pointRadius: 0, spanGaps: true, yAxisID: "y" });
    upsert("trendChart", "line", { labels: labels, datasets: trendSets }, baseOptions({
      plugins: { tooltip: { callbacks: { label: function (ctx) { return ctx.parsed.y === null ? null : " " + ctx.dataset.label + ": " + ctx.parsed.y.toFixed(1) + "%"; } } } },
      scales: { x: axis({ grid: { display: false }, ticks: { maxTicksLimit: 10, maxRotation: 0 } }), y: pctTicks({ title: { display: true, text: "Score", color: c.muted } }), y1: pctTicks({ position: "right", grid: { display: false }, title: { display: true, text: "Attendance", color: c.muted } }) },
    }));

    // Overview: grade distribution (donut)
    var totalMarks = d.grades.reduce(function (s, g) { return s + g.n; }, 0);
    upsert("gradeChart", "doughnut", {
      labels: d.grades.map(function (g) { return "Grade " + g.grade + " (" + g.min + "+)"; }),
      datasets: [{ data: d.grades.map(function (g) { return g.n; }), backgroundColor: d.grades.map(function (g) { return GRADE_COLORS[g.grade]; }), borderColor: c.surface, borderWidth: 3, hoverOffset: 10 }],
    }, baseOptions({
      cutout: "68%", interaction: { mode: "nearest", intersect: true },
      plugins: { legend: { position: "bottom" }, centerText: { text: totalMarks.toLocaleString(), label: "marks" },
        tooltip: { callbacks: { label: function (ctx) { return " " + ctx.raw.toLocaleString() + " marks (" + (totalMarks ? (100 * ctx.raw / totalMarks).toFixed(1) : 0) + "%)"; } } } },
    }));

    // Academics: subject performance (horizontal bars)
    var subj = d.subjects;
    var compare = d.scope.role === "head"
      ? { label: "Previous period", data: subj.map(function (s) { return s.prev_avg; }) }
      : { label: d.peerLabel, data: subj.map(function (s) { return s.peer_avg; }) };
    upsert("subjectChart", "bar", {
      labels: subj.map(function (s) { return s.label; }),
      datasets: [
        { label: youLabel, data: subj.map(function (s) { return s.avg; }), backgroundColor: subj.map(function (s) { return rgba(scoreColor(s.avg), 0.85); }), borderRadius: 6, barPercentage: 0.8, categoryPercentage: 0.7 },
        { label: compare.label, data: compare.data, backgroundColor: rgba(c.muted, 0.3), borderRadius: 6, barPercentage: 0.8, categoryPercentage: 0.7 },
      ],
    }, baseOptions({
      indexAxis: "y",
      plugins: { tooltip: { callbacks: { label: function (ctx) { return ctx.parsed.x === null ? null : " " + ctx.dataset.label + ": " + ctx.parsed.x.toFixed(1) + "%"; },
        afterBody: function (items) { var s = subj[items[0].dataIndex]; return s ? ["Pass rate: " + s.pass_rate + "%", "Marks: " + s.n.toLocaleString()] : []; } } } },
      scales: { x: pctTicks({ min: 0, max: 100 }), y: axis({ grid: { display: false } }) },
    }));

    // Academics: histogram
    var binLabels = d.histogram.map(function (_n, i) { return i * 10 + "–" + (i === 9 ? 100 : i * 10 + 9); });
    upsert("histChart", "bar", {
      labels: binLabels,
      datasets: [{ label: "Marks", data: d.histogram, backgroundColor: d.histogram.map(function (_n, i) { return rgba(GRADE_COLORS[gradeOf(i * 10 + 5)], 0.85); }), borderRadius: 6, barPercentage: 0.92, categoryPercentage: 0.95 }],
    }, baseOptions({
      plugins: { legend: { display: false }, tooltip: { callbacks: { title: function (it) { return "Score " + it[0].label + "%  ·  Grade " + gradeOf(it[0].dataIndex * 10 + 5); } } } },
      scales: { x: axis({ grid: { display: false } }), y: axis({ beginAtZero: true }) },
    }));

    // Academics: exam type (bar + line mix)
    upsert("examChart", "bar", {
      labels: d.examTypes.map(function (e) { return e.label; }),
      datasets: [
        { type: "bar", label: "Average", data: d.examTypes.map(function (e) { return e.avg; }), backgroundColor: rgba(c.primary, 0.8), borderRadius: 8, maxBarThickness: 56, yAxisID: "y", order: 2 },
        { type: "line", label: "Pass rate", data: d.examTypes.map(function (e) { return e.pass_rate; }), borderColor: c.warn, backgroundColor: c.warn, pointRadius: 5, pointHoverRadius: 7, tension: 0.3, yAxisID: "y", order: 1 },
      ],
    }, baseOptions({
      plugins: { tooltip: { callbacks: { label: pctLabel } } },
      scales: { x: axis({ grid: { display: false } }), y: pctTicks({ min: 0, max: 100 }) },
    }));

    // Attendance: trend with 90% target
    upsert("attTrendChart", "line", {
      labels: labels,
      datasets: [
        { label: "Attendance", data: d.trend.attendance, borderColor: c.accent, backgroundColor: gradientFill(c.accent), fill: true, tension: 0.35, borderWidth: 2.5, pointRadius: 0, pointHoverRadius: 5, spanGaps: true },
        { label: "Target 90%", data: labels.map(function () { return 90; }), borderColor: c.bad, borderDash: [5, 5], borderWidth: 1.5, pointRadius: 0, fill: false },
      ],
    }, baseOptions({
      plugins: { tooltip: { callbacks: { label: pctLabel } } },
      scales: { x: axis({ grid: { display: false }, ticks: { maxTicksLimit: 10, maxRotation: 0 } }), y: pctTicks({ suggestedMin: 80, max: 100 }) },
    }));

    // Attendance: status donut
    var st = d.attendance.status, stTotal = st.present + st.late + st.absent + st.excused;
    var attRate = stTotal ? (100 * (st.present + st.late) / stTotal).toFixed(1) + "%" : "–";
    upsert("attStatusChart", "doughnut", {
      labels: ["Present", "Late", "Absent", "Excused"],
      datasets: [{ data: [st.present, st.late, st.absent, st.excused], backgroundColor: [c.good, c.warn, c.bad, c.info], borderColor: c.surface, borderWidth: 3, hoverOffset: 10 }],
    }, baseOptions({
      cutout: "68%", interaction: { mode: "nearest", intersect: true },
      plugins: { centerText: { text: attRate, label: "attendance" },
        tooltip: { callbacks: { label: function (ctx) { return " " + ctx.raw.toLocaleString() + " student-days (" + (stTotal ? (100 * ctx.raw / stTotal).toFixed(1) : 0) + "%)"; } } } },
    }));

    // Attendance: weekday bar (lowest day highlighted)
    var rates = d.attendance.weekday.map(function (w) { return w.rate; });
    var minRate = Math.min.apply(null, rates.filter(function (r) { return r !== null; }));
    upsert("weekdayChart", "bar", {
      labels: d.attendance.weekday.map(function (w) { return w.day; }),
      datasets: [{ label: "Attendance", data: rates, backgroundColor: rates.map(function (r) { return r === minRate ? rgba(c.bad, 0.85) : rgba(c.accent, 0.8); }), borderRadius: 8, maxBarThickness: 48 }],
    }, baseOptions({
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: pctLabel } } },
      scales: { x: axis({ grid: { display: false } }), y: pctTicks({ suggestedMin: 80, max: 100 }) },
    }));

    // Assignments donut
    var a = d.assignments, aTotal = a.on_time + a.late + a.missing;
    upsert("asgChart", "doughnut", {
      labels: ["On time", "Late", "Missing"],
      datasets: [{ data: [a.on_time, a.late, a.missing], backgroundColor: [c.good, c.warn, c.bad], borderColor: c.surface, borderWidth: 3, hoverOffset: 10 }],
    }, baseOptions({
      cutout: "68%", interaction: { mode: "nearest", intersect: true },
      plugins: { centerText: { text: aTotal ? (100 * (a.on_time + a.late) / aTotal).toFixed(1) + "%" : "–", label: "submitted" },
        tooltip: { callbacks: { label: function (ctx) { return " " + ctx.raw.toLocaleString() + " (" + (aTotal ? (100 * ctx.raw / aTotal).toFixed(1) : 0) + "%)"; } } } },
    }));

    // Insights: class ranking (head / teacher)
    if (d.classes.length) {
      var cls = d.classes.slice().sort(function (x, y) { return (y.avg || 0) - (x.avg || 0); });
      upsert("classChart", "bar", {
        labels: cls.map(function (x) { return x.label; }),
        datasets: [{ label: "Average", data: cls.map(function (x) { return x.avg; }), backgroundColor: cls.map(function (_x, i) { return i === 0 ? rgba(c.good, 0.9) : i === cls.length - 1 && cls.length > 1 ? rgba(c.bad, 0.85) : rgba(c.primary, 0.75); }), borderRadius: 6 }],
      }, baseOptions({
        indexAxis: "y",
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: function (ctx) { return " Average: " + ctx.parsed.x.toFixed(1) + "%"; }, afterLabel: function (ctx) { return " Pass rate: " + cls[ctx.dataIndex].pass_rate + "%"; } } } },
        scales: { x: pctTicks({ suggestedMin: 40, max: 100 }), y: axis({ grid: { display: false } }) },
      }));
    }

    // Insights: me vs class radar (student)
    if (d.scope.role === "student") {
      upsert("radarChart", "radar", {
        labels: subj.map(function (s) { return s.label; }),
        datasets: [
          { label: "Me", data: subj.map(function (s) { return s.avg; }), borderColor: c.primary, backgroundColor: rgba(c.primary, 0.2), pointBackgroundColor: c.primary, borderWidth: 2 },
          { label: "Class average", data: subj.map(function (s) { return s.peer_avg; }), borderColor: c.muted, backgroundColor: rgba(c.muted, 0.08), borderDash: [5, 4], pointRadius: 2, borderWidth: 1.5 },
        ],
      }, baseOptions({
        interaction: { mode: "index", intersect: false },
        plugins: { tooltip: { callbacks: { label: function (ctx) { return " " + ctx.dataset.label + ": " + (ctx.raw === null ? "–" : ctx.raw.toFixed(1) + "%"); } } } },
        scales: { r: { suggestedMin: 30, max: 100, angleLines: { color: c.border }, grid: { color: c.border }, pointLabels: { color: c.muted, font: { size: 11 } }, ticks: { display: false, stepSize: 20 } } },
      }));
    }
  }

  /* ---------------- 10. Lists, insights, heatmap ---------------- */
  var INSIGHT_ICONS = { good: "✅", bad: "⚠️", info: "💡" };
  function insightItem(i) { return '<li class="' + i.tone + '"><span class="ico">' + INSIGHT_ICONS[i.tone] + "</span><span>" + esc(i.text) + "</span></li>"; }
  function renderInsights(list) {
    $("#insightList").innerHTML = list.length ? list.map(insightItem).join("") : '<li class="info">No data for this selection.</li>';
    // Overview strip: the three most actionable findings
    var pick = list.filter(function (i) { return i.tone === "bad"; }).concat(list.filter(function (i) { return i.tone !== "bad"; })).slice(0, 3);
    $("#insightStrip").innerHTML = pick.map(insightItem).join("");
  }
  function studentItem(s, right) {
    return '<li class="clickable" data-student="' + esc(s.id) + '">' + avatar(s.name) +
      '<div class="grow"><div class="name">' + esc(s.name) + '</div><div class="sub">' + esc(s.class + " " + s.stream) + " · attendance " + fmt(s.attendance, "%") + "</div></div>" + right + "</li>";
  }
  function renderLists(d) {
    $("#riskList").innerHTML = d.atRisk.length ? d.atRisk.map(function (s) {
      var reason = s.avg_score !== null && s.avg_score < 50 ? "Low marks" : "Low attendance";
      return studentItem(s, '<div style="text-align:right"><div class="score-num" style="color:' + scoreColor(s.avg_score) + '">' + fmt(s.avg_score, "%") + '</div><span class="pill at-risk">' + reason + "</span></div>");
    }).join("") : '<li class="empty">🎉 No students at risk for this selection.</li>';
    $("#topList").innerHTML = d.top.length ? d.top.map(function (s, i) {
      var medal = ["🥇", "🥈", "🥉"][i] || "#" + (i + 1);
      return studentItem(s, '<div style="text-align:right"><div class="score-num">' + fmt(s.avg_score, "%") + "</div><span>" + medal + "</span></div>");
    }).join("") : '<li class="empty">No data.</li>';
    $("#recentList").innerHTML = d.recent.length ? d.recent.map(function (m) {
      var g = gradeOf(m.score);
      return "<li>" + gradeBadge(g) + '<div class="grow"><div class="name">' + esc(m.subject) + '</div><div class="sub">' + esc(m.exam_type) + " · " + fmtDate(m.date, true) + '</div></div><span class="score-num" style="color:' + scoreColor(m.score) + '">' + m.score.toFixed(1) + "%</span></li>";
    }).join("") : '<li class="empty">No marks in this period.</li>';
    // Grade goals: how many points to the next grade band per subject
    var bands = state.meta.gradeBands;
    var goals = d.subjects.filter(function (s) { return s.avg !== null && s.avg < 80; }).map(function (s) {
      var next = bands.slice().reverse().find(function (b) { return b.min > s.avg; });
      return { s: s, next: next, gap: next.min - s.avg };
    }).sort(function (x, y) { return x.gap - y.gap; });
    $("#goalList").innerHTML = goals.length ? goals.map(function (g) {
      return "<li>" + gradeBadge(gradeOf(g.s.avg)) + '<div class="grow"><div class="name">' + esc(g.s.label) + '</div><div class="sub">' + g.s.avg.toFixed(1) + "% now → " + g.next.min + "% for grade " + g.next.grade +
        '</div></div><span class="pill on-track">+' + g.gap.toFixed(1) + " pts</span></li>";
    }).join("") : '<li class="empty">🌟 Grade A in every subject!</li>';
  }
  function heatColor(v) { var h = Math.max(0, Math.min(1, (v - 40) / 40)) * 130; return "hsl(" + h + ",70%,72%)"; }
  function renderHeatmap(cells) {
    var el = $("#heatmap");
    if (!cells.length) { el.innerHTML = '<p class="empty">No data.</p>'; return; }
    var rows = [], cols = [], map = {};
    cells.forEach(function (c) { if (rows.indexOf(c.row) < 0) rows.push(c.row); if (cols.indexOf(c.col) < 0) cols.push(c.col); map[c.row + "|" + c.col] = c.value; });
    var short = function (s) { return s.length > 9 ? s.split(" ").map(function (w) { return w.slice(0, 4); }).join(" ") : s; };
    el.innerHTML = '<table class="heatmap"><thead><tr><th></th>' + cols.map(function (c) { return '<th title="' + esc(c) + '">' + esc(short(c)) + "</th>"; }).join("") + "</tr></thead><tbody>" +
      rows.map(function (r) {
        return '<tr><th class="row">' + esc(r) + "</th>" + cols.map(function (c) {
          var v = map[r + "|" + c];
          return v === undefined ? "<td>–</td>" : '<td style="background:' + heatColor(v) + '" title="' + esc(r + " · " + c + ": " + v + "%") + '">' + Math.round(v) + "</td>";
        }).join("") + "</tr>";
      }).join("") + "</tbody></table>";
  }

  /* ---------------- 11. Data table ---------------- */
  var STATUSES = ["At risk", "Watch", "On track", "Excellent"];
  function setTableData(t) {
    var s = state.table;
    s.kind = t.kind; s.columns = t.columns; s.rows = t.rows;
    if (!t.columns.some(function (c) { return c.key === s.sortKey; })) { s.sortKey = t.columns[0].key; s.sortDir = 1; }
    renderChips(); renderTable();
  }
  function renderChips() {
    var s = state.table, el = $("#statusChips");
    if (s.kind !== "students") { el.innerHTML = ""; return; }
    var counts = {}; s.rows.forEach(function (r) { counts[r.status] = (counts[r.status] || 0) + 1; });
    el.innerHTML = ["all"].concat(STATUSES).map(function (st) {
      var n = st === "all" ? s.rows.length : counts[st] || 0;
      return '<button class="chip' + (s.status === st ? " active" : "") + '" data-status="' + st + '">' + (st === "all" ? "All" : st) + "<b>" + n + "</b></button>";
    }).join("");
  }
  function visibleRows() {
    var s = state.table, q = s.search.trim().toLowerCase();
    var textCols = s.columns.filter(function (c) { return c.type === "text"; }).map(function (c) { return c.key; });
    var rows = s.rows.filter(function (r) {
      if (s.status !== "all" && r.status !== s.status) return false;
      if (s.grade !== "all" && r.grade !== s.grade) return false;
      if (q && !textCols.some(function (k) { return String(r[k] || "").toLowerCase().indexOf(q) >= 0; })) return false;
      return true;
    });
    var k = s.sortKey, dir = s.sortDir;
    return rows.sort(function (a, b) {
      var x = a[k], y = b[k];
      if (x === null || x === undefined) return 1;
      if (y === null || y === undefined) return -1;
      return (typeof x === "number" ? x - y : String(x).localeCompare(String(y))) * dir;
    });
  }
  function cell(col, v) {
    switch (col.type) {
      case "pct":
        if (v === null || v === undefined) return "–";
        return '<div class="cell-pct"><span class="score-num">' + v.toFixed(1) + '%</span><span class="mini-bar"><i style="width:' + Math.min(100, v) + "%;background:" + scoreColor(v) + '"></i></span></div>';
      case "delta":
        if (v === null || v === undefined) return "–";
        return v > 0 ? '<span class="up">▲ ' + v.toFixed(1) + "</span>" : v < 0 ? '<span class="down">▼ ' + Math.abs(v).toFixed(1) + "</span>" : "0.0";
      case "grade": return gradeBadge(v);
      case "status": return '<span class="pill ' + slug(v) + '">' + esc(v) + "</span>";
      default: return esc(v == null ? "–" : v);
    }
  }
  function renderTable() {
    var s = state.table, rows = visibleRows();
    var pages = Math.max(1, Math.ceil(rows.length / s.pageSize));
    s.page = Math.min(s.page, pages);
    var pageRows = rows.slice((s.page - 1) * s.pageSize, s.page * s.pageSize);
    $("#dataTable thead").innerHTML = "<tr>" + s.columns.map(function (c) {
      var sorted = c.key === s.sortKey;
      return '<th data-key="' + c.key + '" class="' + (sorted ? "sorted" : "") + '" aria-sort="' + (sorted ? (s.sortDir > 0 ? "ascending" : "descending") : "none") + '">' + esc(c.label) +
        '<span class="arrow">' + (sorted ? (s.sortDir > 0 ? "▲" : "▼") : "↕") + "</span></th>";
    }).join("") + "</tr>";
    $("#dataTable tbody").innerHTML = pageRows.length ? pageRows.map(function (r, i) {
      return '<tr style="animation-delay:' + i * 12 + 'ms"' + (s.kind === "students" ? ' class="clickable" data-student="' + esc(r.id) + '" title="Open profile"' : "") + ">" +
        s.columns.map(function (c) { return "<td>" + (c.key === "name" ? '<div style="display:flex;align-items:center;gap:8px">' + avatar(r.name) + esc(r.name) + "</div>" : cell(c, r[c.key])) + "</td>"; }).join("") + "</tr>";
    }).join("") : '<tr><td colspan="' + s.columns.length + '" class="empty">No rows match your filters.</td></tr>';
    $("#tableCount").textContent = rows.length + " of " + s.rows.length + (s.kind === "students" ? " students" : " subjects");
    $("#pageInfo").textContent = s.page + " / " + pages;
    $("#prevPage").disabled = s.page <= 1; $("#nextPage").disabled = s.page >= pages;
  }
  function bindTable() {
    var s = state.table;
    $("#dataTable thead").addEventListener("click", function (e) {
      var th = e.target.closest("th"); if (!th) return;
      if (s.sortKey === th.dataset.key) s.sortDir *= -1; else { s.sortKey = th.dataset.key; s.sortDir = th.dataset.key === "name" || th.dataset.key === "rank" || th.dataset.key === "subject" ? 1 : -1; }
      renderTable();
    });
    $("#tableSearch").addEventListener("input", debounce(function () { s.search = $("#tableSearch").value; s.page = 1; renderTable(); }, 120));
    $("#statusChips").addEventListener("click", function (e) { var b = e.target.closest(".chip"); if (!b) return; s.status = b.dataset.status; s.page = 1; renderChips(); renderTable(); });
    $("#gradeFilter").addEventListener("change", function (e) { s.grade = e.target.value; s.page = 1; renderTable(); });
    $("#pageSize").addEventListener("change", function (e) { s.pageSize = +e.target.value; s.page = 1; renderTable(); });
    $("#prevPage").addEventListener("click", function () { s.page--; renderTable(); });
    $("#nextPage").addEventListener("click", function () { s.page++; renderTable(); });
  }
  function exportCsv() {
    var s = state.table, rows = visibleRows();
    var head = s.columns.map(function (c) { return c.label; });
    var lines = [head].concat(rows.map(function (r) { return s.columns.map(function (c) { return r[c.key] == null ? "" : r[c.key]; }); }));
    var csv = lines.map(function (l) { return l.map(function (v) { v = String(v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }).join(","); }).join("\n");
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "mhs-" + s.kind + "-" + state.filters.start + "_to_" + state.filters.end + ".csv";
    a.click(); URL.revokeObjectURL(a.href);
    toast("Exported " + rows.length + " rows");
  }

  /* ---------------- 12. Student profile modal ---------------- */
  function openStudent(id) {
    var modal = $("#studentModal");
    modal.hidden = false; document.body.style.overflow = "hidden";
    $("#mName").textContent = "Loading…"; $("#mMeta").textContent = ""; $("#mKpis").innerHTML = ""; $("#mRecent").innerHTML = "";
    api("/student/" + encodeURIComponent(id) + "?" + queryString()).then(function (d) {
      var s = d.student, sm = d.summary, c = colors();
      $("#mAvatar").textContent = initials(s.name); $("#mAvatar").style.setProperty("--avatar", "hsl(" + hueOf(s.name) + ",55%,52%)");
      $("#mName").textContent = s.name;
      $("#mMeta").innerHTML = esc(s.id + " · " + s.class + " " + s.stream + " · position " + (s.rank || "–") + " of " + s.classSize + " ") + '<span class="pill ' + slug(s.status) + '">' + esc(s.status) + "</span>";
      $("#mKpis").innerHTML = [["Average", fmt(sm.avg, "%")], ["Grade", sm.grade || "–"], ["Pass rate", fmt(sm.pass, "%")], ["Attendance", fmt(sm.attendance, "%") + " <small>(" + sm.absences + " absent)</small>"], ["Assignments", fmt(sm.completion, "%")]]
        .map(function (k) { return "<div><span>" + k[0] + "</span><strong>" + k[1] + "</strong></div>"; }).join("");
      var labels = d.trend.buckets.map(function (b) { return fmtBucket(b, state.data ? state.data.scope.unit : "week"); });
      upsert("mTrendChart", "line", { labels: labels, datasets: [
        { label: "Student", data: d.trend.score, borderColor: c.primary, backgroundColor: gradientFill(c.primary), fill: true, tension: 0.35, pointRadius: 2, spanGaps: true },
        { label: "Class average", data: d.trend.peer, borderColor: c.muted, borderDash: [5, 4], tension: 0.35, pointRadius: 0, spanGaps: true },
      ] }, baseOptions({ plugins: { tooltip: { callbacks: { label: function (ctx) { return ctx.parsed.y === null ? null : " " + ctx.dataset.label + ": " + ctx.parsed.y.toFixed(1) + "%"; } } } },
        scales: { x: axis({ grid: { display: false }, ticks: { maxTicksLimit: 6, maxRotation: 0 } }), y: pctTicks({ suggestedMin: 30, max: 100 }) } }));
      upsert("mSubjectChart", "bar", { labels: d.subjects.map(function (x) { return x.label; }), datasets: [
        { label: "Student", data: d.subjects.map(function (x) { return x.avg; }), backgroundColor: d.subjects.map(function (x) { return rgba(scoreColor(x.avg), 0.85); }), borderRadius: 5 },
        { label: "Class", data: d.subjects.map(function (x) { return x.peer_avg; }), backgroundColor: rgba(c.muted, 0.3), borderRadius: 5 },
      ] }, baseOptions({ indexAxis: "y", plugins: { tooltip: { callbacks: { label: function (ctx) { return " " + ctx.dataset.label + ": " + ctx.parsed.x.toFixed(1) + "%"; } } } },
        scales: { x: pctTicks({ min: 0, max: 100 }), y: axis({ grid: { display: false }, ticks: { font: { size: 10 } } }) } }));
      $("#mRecent").innerHTML = d.recent.length ? d.recent.map(function (m) {
        return "<li>" + gradeBadge(gradeOf(m.score)) + '<div class="grow"><div class="name">' + esc(m.subject) + '</div><div class="sub">' + esc(m.exam_type) + " · " + fmtDate(m.date, true) + '</div></div><span class="score-num">' + m.score.toFixed(1) + "%</span></li>";
      }).join("") : '<li class="empty">No marks in this period.</li>';
    }).catch(function () { $("#mName").textContent = "Could not load student"; });
  }
  function closeModal() { $("#studentModal").hidden = true; document.body.style.overflow = ""; }

  /* ---------------- 13. Navigation, shortcuts, live refresh ---------------- */
  function showView(v) {
    if (!VIEW_TITLES[v]) v = "overview";
    state.view = v;
    $$(".nav-item").forEach(function (b) { b.classList.toggle("active", b.dataset.view === v); });
    $$(".view").forEach(function (s) { s.classList.toggle("active", s.id === "view-" + v); });
    $("#viewTitle").textContent = VIEW_TITLES[v];
    $("#sidebar").classList.remove("open"); $("#scrim").classList.remove("show");
    requestAnimationFrame(function () { Object.keys(charts).forEach(function (k) { charts[k].resize(); }); });
    saveState();
  }
  function setLive(on) {
    clearInterval(liveTimer);
    document.querySelector(".sidebar-foot").classList.toggle("live", on);
    if (on) { liveTimer = setInterval(load, CFG.liveRefreshMs); toast("Live refresh on"); }
  }
  function bindShell() {
    $$(".nav-item").forEach(function (b) { b.addEventListener("click", function () { showView(b.dataset.view); }); });
    $("#menuBtn").addEventListener("click", function () { $("#sidebar").classList.add("open"); $("#scrim").classList.add("show"); });
    $("#scrim").addEventListener("click", function () { $("#sidebar").classList.remove("open"); $("#scrim").classList.remove("show"); });
    $("#themeBtn").addEventListener("click", toggleTheme);
    $("#exportBtn").addEventListener("click", exportCsv);
    $("#printBtn").addEventListener("click", function () { window.print(); });
    $("#liveToggle").addEventListener("change", function (e) { setLive(e.target.checked); });
    $("#modalClose").addEventListener("click", closeModal);
    $("#studentModal").addEventListener("click", function (e) { if (e.target.id === "studentModal") closeModal(); });
    document.addEventListener("click", function (e) {
      var row = e.target.closest("[data-student]");
      if (row && !e.target.closest(".modal")) openStudent(row.dataset.student);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") return closeModal();
      if (/INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName) || e.ctrlKey || e.metaKey || e.altKey) return;
      var views = ["overview", "academics", "attendance", "students", "insights"];
      if (e.key >= "1" && e.key <= "5") showView(views[+e.key - 1]);
      else if (e.key.toLowerCase() === "d") toggleTheme();
      else if (e.key === "/") { e.preventDefault(); showView("students"); $("#tableSearch").focus(); }
    });
    var mq = window.matchMedia("print");
    if (mq.addEventListener) mq.addEventListener("change", function () { Object.keys(charts).forEach(function (k) { charts[k].resize(); }); });
  }

  /* ---------------- 14. Start-up ---------------- */
  function restore() {
    try {
      var saved = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
      if (saved) {
        state.view = saved.view || state.view; state.role = saved.role || state.role; state.personId = saved.personId || null;
        state.preset = saved.preset || state.preset; Object.assign(state.filters, saved.filters || {});
      }
    } catch (_e) { /* ignore corrupt storage */ }
    if (CFG.role) { state.role = CFG.role; state.personId = CFG.personId; }
    if (state.preset !== "custom" || !state.filters.start) {
      if (state.preset === "custom") state.preset = "90";
      var r = presetRange(state.preset); state.filters.start = r.start; state.filters.end = r.end;
    }
    state.table.sortKey = state.role === "student" ? "subject" : "rank";
  }
  function init() {
    applyTheme(document.documentElement.getAttribute("data-theme") || "light");
    restore();
    bindShell(); bindFilters(); bindRoles(); bindTable();
    api("/meta").then(function (meta) {
      state.meta = meta;
      populateFilters();
      applyRoleUI();
      showView(state.view);
      return load();
    }).catch(function (err) {
      console.error(err);
      $("#lastUpdated").textContent = "Offline";
      toast("Could not reach the analytics API");
    });
  }
  document.addEventListener("DOMContentLoaded", init);
})();
