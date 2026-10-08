-- =====================================================================
--  MHS Analytics Dashboard - realistic SAMPLE data
-- ---------------------------------------------------------------------
--  Only for demos / testing. Run it on EMPTY tables.
--  Dates are relative to CURRENT_DATE so the dashboard always looks "live".
--
--  Trick used below: abs(hashtext(x)) % 1000 / 1000.0 gives a stable
--  pseudo-random number 0..1 for a key, so each student keeps the SAME
--  ability / subject strengths across every generated record.
-- =====================================================================

SELECT setseed(0.2026);

-- ---------- Teachers: one class teacher per class + stream ----------
INSERT INTO teachers (id, username, password, fullname, email, subjects, class, stream, role)
SELECT
    'TCH' || lpad(rn::text, 3, '0'),
    'teacher' || rn,
    '',
    (ARRAY['Mr. Okello James','Ms. Nakato Sarah','Mr. Ssemwanga Peter','Mrs. Achieng Grace',
           'Mr. Mugisha Brian','Ms. Namutebi Joan','Mr. Kato Daniel','Mrs. Auma Esther',
           'Mr. Tumusiime Paul','Ms. Nabirye Ruth','Mr. Lubega Moses','Mrs. Kyomuhendo Faith'])[rn],
    'teacher' || rn || '@mengo.school',
    (ARRAY['Mathematics','English','Biology','Chemistry','Physics','History',
           'Geography','Computer Studies','Mathematics','English','Biology','Physics'])[rn],
    'S' || c,
    st,
    'Class Teacher'
FROM (
    SELECT c, st, row_number() OVER (ORDER BY c, st) AS rn
    FROM generate_series(1, 6) AS c, unnest(ARRAY['A', 'B']) AS st
) x;

-- ---------- Students: 300 (50 per class, 25 per stream) ----------
INSERT INTO students (id, username, password, fullname, email, gender, class, stream)
SELECT
    'STU' || lpad(n::text, 4, '0'),
    'stu' || n,
    '',
    CASE WHEN n % 2 = 0
        THEN (ARRAY['Sarah','Grace','Joan','Faith','Ruth','Esther','Mercy','Patience','Doreen','Brenda',
                    'Irene','Sharon','Florence','Agnes','Winnie','Martha','Rebecca','Lydia','Prossy','Angella'])[1 + floor(random() * 20)::int]
        ELSE (ARRAY['James','Peter','Brian','Daniel','Moses','Paul','Isaac','Joseph','Ivan','Samuel',
                    'Ronald','Denis','Allan','Emmanuel','Henry','Solomon','Timothy','Collins','Edgar','Mark'])[1 + floor(random() * 20)::int]
    END || ' ' ||
    (ARRAY['Okello','Nakato','Ssemwanga','Achieng','Mugisha','Namutebi','Kato','Auma','Tumusiime','Nabirye',
           'Lubega','Kyomuhendo','Opio','Nansubuga','Wasswa','Babirye','Kizza','Atim','Byaruhanga','Nalwoga',
           'Ochieng','Nambi','Sserwadda','Akello','Mukasa','Kemigisha','Ouma','Nassali','Kiggundu','Ainomugisha'])[1 + floor(random() * 30)::int],
    'stu' || n || '@mengo.school',
    CASE WHEN n % 2 = 0 THEN 'F' ELSE 'M' END,
    'S' || (1 + (n - 1) / 50),
    CASE WHEN ((n - 1) % 50) < 25 THEN 'A' ELSE 'B' END
FROM generate_series(1, 300) AS n;

-- ---------- Marks: 8 subjects x 23 assessments (every 2 weeks) ----------
INSERT INTO student_performance (student_id, subject, score, exam_type, created_at)
SELECT
    s.id,
    sub.name,
    GREATEST(6, LEAST(99, round((
          60
        + (abs(hashtext(s.id)) % 1000 / 1000.0 - 0.5) * 38                       -- student ability  (+/-19)
        + (abs(hashtext(s.id || sub.name)) % 1000 / 1000.0 - 0.5) * 18           -- subject strength (+/-9)
        + (abs(hashtext(s.class || s.stream)) % 1000 / 1000.0 - 0.5) * 8         -- class/stream effect
        + sub.difficulty                                                         -- harder subjects
        + (abs(hashtext(s.id || 'trend')) % 1000 / 1000.0 - 0.42) * 18 * (k / 22.0) -- improving / declining over the year
        + CASE WHEN k % 7 = 6 THEN -4 WHEN k % 7 = 3 THEN -2 ELSE 0 END          -- exams are tougher than quizzes
        + (random() - 0.5) * 20                                                  -- day-to-day noise
    )::numeric, 1))),
    CASE WHEN k % 7 = 6 THEN 'End of Term'
         WHEN k % 7 = 3 THEN 'Mid-Term'
         WHEN k % 2 = 0 THEN 'Quiz'
         ELSE 'Test' END,
    (CURRENT_DATE - 330 + k * 14 + (abs(hashtext(s.id || sub.name || k::text)) % 14))::timestamp
        + interval '8 hours' + (random() * interval '8 hours')
FROM students s
CROSS JOIN (VALUES ('Mathematics', -7), ('English', 4), ('Biology', 0), ('Chemistry', -5),
                   ('Physics', -8), ('History', 3), ('Geography', 2), ('Computer Studies', 6)) AS sub(name, difficulty)
CROSS JOIN generate_series(0, 22) AS k;

-- ---------- Attendance: every weekday for ~11 months ----------
INSERT INTO attendance (student_id, date, status)
SELECT
    s.id,
    d::date,
    CASE WHEN x.r < x.p_absent                 THEN 'absent'
         WHEN x.r < x.p_absent + 0.045         THEN 'late'
         WHEN x.r < x.p_absent + 0.060         THEN 'excused'
         ELSE 'present' END
FROM students s
CROSS JOIN generate_series(CURRENT_DATE - 330, CURRENT_DATE - 1, interval '1 day') AS d
CROSS JOIN LATERAL (
    SELECT
        random() + 0 * length(s.id) + 0 * extract(day FROM d) AS r,
        0.015
        + (1 - abs(hashtext(s.id)) % 1000 / 1000.0) * 0.075                        -- weaker students miss more
        + CASE WHEN extract(dow FROM d) IN (1, 5) THEN 0.025 ELSE 0 END            -- Mondays / Fridays
        + CASE WHEN extract(month FROM d) IN (4, 8) THEN 0.02 ELSE 0 END           -- rainy season
        AS p_absent
) x
WHERE extract(dow FROM d) BETWEEN 1 AND 5;

-- ---------- Assignments: each subject every 2 weeks ----------
INSERT INTO assignment_submissions (student_id, subject, due_date, status)
SELECT
    s.id,
    sub,
    CURRENT_DATE - 326 + k * 14 + (abs(hashtext(sub)) % 10),
    CASE WHEN x.r < x.p_missing        THEN 'missing'
         WHEN x.r < x.p_missing + 0.12 THEN 'late'
         ELSE 'on_time' END
FROM students s
CROSS JOIN unnest(ARRAY['Mathematics','English','Biology','Chemistry','Physics',
                        'History','Geography','Computer Studies']) AS sub
CROSS JOIN generate_series(0, 22) AS k
CROSS JOIN LATERAL (
    SELECT
        random() + 0 * length(s.id || sub) + 0 * k AS r,
        0.02 + (1 - abs(hashtext(s.id)) % 1000 / 1000.0) * 0.16 AS p_missing
) x
WHERE CURRENT_DATE - 326 + k * 14 + (abs(hashtext(sub)) % 10) < CURRENT_DATE;
