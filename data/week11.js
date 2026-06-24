// ============================================================
// WEEK 11 — SQL for Analytics: Aggregations, Subqueries, EXPLAIN
// Days 51–55 | 24–28 August 2026
// Phase 2: Data Engineering Foundations
// ============================================================

const WEEK11 = [

  // ============================================================
  // DAY 51 — Aggregations Deep Dive
  // ============================================================
  {
    id: "W11D1", week: 11, day: 1, phase: 2,
    phaseTitle: "Data Engineering Foundations",
    date: "2026-08-24",
    type: "lesson",
    topic: "Aggregations Deep Dive: GROUP BY, HAVING & Multi-Level Grouping",
    duration: "2–3 hours",

    objectives: [
      "Use GROUP BY with multiple columns and all standard aggregate functions",
      "Correctly distinguish WHERE (filters rows before grouping) from HAVING (filters groups after)",
      "Use GROUPING SETS and ROLLUP for multi-level aggregate reports",
      "Avoid the classic 'non-aggregated column' GROUP BY error",
    ],

    introduction: `
You've used basic GROUP BY since Phase 1. This week sharpens it
into a genuine analytics tool — multi-column grouping, the
WHERE-vs-HAVING distinction that trips up almost everyone at
first, and the multi-level reporting techniques (GROUPING SETS,
ROLLUP) that real BI dashboards and the BigQuery work ahead in
Week 16 depend on constantly.
    `,

    mentalModel: `
MENTAL MODEL — "Sorting the Mail Before vs After Bundling"

WHERE filters individual letters BEFORE they get bundled into
groups — "only consider letters addressed to this city." HAVING
filters AFTER bundling — "only show me cities where the bundle
has more than 50 letters." You can't ask "show cities with more
than 50 letters" before bundling, because that property
(the count) doesn't exist until the bundle is formed — which is
exactly why HAVING exists as a separate clause from WHERE.
    `,

    explanation: `
GROUP BY WITH MULTIPLE COLUMNS
===================================
SELECT department_id, test_name, COUNT(*) AS result_count,
       AVG(result_value) AS avg_value
FROM lab_results
JOIN patients USING (patient_id)
GROUP BY department_id, test_name
ORDER BY department_id, test_name;

Every column in the GROUP BY together defines what makes a
"group" — here, every unique combination of department AND test
type gets its own row in the result.

THE GROUP BY RULE — EVERY SELECTED COLUMN MUST BE AGGREGATED OR GROUPED
===========================================================================
-- WRONG — PostgreSQL will reject this:
SELECT patient_id, full_name, COUNT(*)
FROM prescriptions
GROUP BY patient_id;
-- ERROR: column "full_name" must appear in the GROUP BY clause
-- or be used in an aggregate function

-- RIGHT — either group by it too, or aggregate it:
SELECT patient_id, full_name, COUNT(*)
FROM prescriptions
GROUP BY patient_id, full_name;

WHERE vs HAVING
==================
SELECT department_id, COUNT(*) AS patient_count
FROM patients
WHERE date_of_birth > '2000-01-01'   -- filters INDIVIDUAL rows first
GROUP BY department_id
HAVING COUNT(*) > 10;                 -- filters GROUPS after aggregation

WHERE cannot reference an aggregate function (COUNT, SUM, etc.)
— that value doesn't exist yet at the row-filtering stage. HAVING
exists specifically to filter on aggregate results.

GROUPING SETS — MULTIPLE GROUPING LEVELS IN ONE QUERY
==========================================================
SELECT department_id, test_name, COUNT(*) AS result_count
FROM lab_results
JOIN patients USING (patient_id)
GROUP BY GROUPING SETS (
    (department_id, test_name),   -- detail level
    (department_id),               -- department subtotal
    ()                              -- grand total
);

This produces, in ONE query, the same result you'd otherwise need
3 separate queries (or a UNION) to assemble: per-department-per-
test detail rows, department subtotals, and an overall grand
total — exactly the structure of a typical pivot-table report.

ROLLUP — A COMMON SHORTHAND FOR HIERARCHICAL SUBTOTALS
============================================================
SELECT department_id, test_name, COUNT(*) AS result_count
FROM lab_results
JOIN patients USING (patient_id)
GROUP BY ROLLUP (department_id, test_name);

ROLLUP(a, b) is shorthand for GROUPING SETS ((a,b), (a), ()) —
it assumes a natural hierarchy (department contains test types)
and produces subtotals at each level automatically.

FILTER CLAUSE — CONDITIONAL AGGREGATES
==========================================
SELECT
    department_id,
    COUNT(*) AS total_results,
    COUNT(*) FILTER (WHERE result_value > 126) AS high_glucose_count
FROM lab_results
JOIN patients USING (patient_id)
WHERE test_name = 'Glucose'
GROUP BY department_id;

FILTER lets you compute multiple DIFFERENT conditional counts/sums
in a single GROUP BY pass, instead of writing separate queries or
verbose CASE WHEN expressions inside SUM().
    `,

    clinicalConnection: `
A hospital quality report showing "total lab tests per department,
broken down by test type, with department subtotals and a grand
total" is the exact shape GROUPING SETS or ROLLUP produces
natively — this is precisely the kind of report quality
improvement teams request regularly, and knowing this technique
means building it in one clean query instead of stitching
together multiple exports by hand.
    `,

    example: `
-- Using the hospital schema

-- 1. Multi-column grouping
SELECT
    d.name AS department,
    pr.drug_name,
    COUNT(*) AS prescription_count,
    AVG(pr.dose_mg) AS avg_dose
FROM prescriptions pr
JOIN patients p ON pr.patient_id = p.patient_id
JOIN departments d ON p.department_id = d.department_id
GROUP BY d.name, pr.drug_name
ORDER BY d.name, prescription_count DESC;

-- 2. WHERE vs HAVING together
SELECT d.name AS department, COUNT(*) AS prescription_count
FROM prescriptions pr
JOIN patients p ON pr.patient_id = p.patient_id
JOIN departments d ON p.department_id = d.department_id
WHERE pr.prescribed_date >= '2026-01-01'   -- row-level filter
GROUP BY d.name
HAVING COUNT(*) > 5;                         -- group-level filter

-- 3. ROLLUP for a department + drug subtotal report
SELECT
    d.name AS department,
    pr.drug_name,
    COUNT(*) AS prescription_count
FROM prescriptions pr
JOIN patients p ON pr.patient_id = p.patient_id
JOIN departments d ON p.department_id = d.department_id
GROUP BY ROLLUP (d.name, pr.drug_name)
ORDER BY d.name, pr.drug_name;

-- 4. FILTER for conditional counts in one pass
SELECT
    d.name AS department,
    COUNT(*) AS total_prescriptions,
    COUNT(*) FILTER (WHERE pr.dose_mg > 500) AS high_dose_count
FROM prescriptions pr
JOIN patients p ON pr.patient_id = p.patient_id
JOIN departments d ON p.department_id = d.department_id
GROUP BY d.name;
    `,

    commonMistakes: [
      "Trying to filter on an aggregate function (e.g. WHERE COUNT(*) > 5) instead of using HAVING — WHERE runs before aggregation exists, so this always errors.",
      "Selecting a non-aggregated, non-grouped column and being confused by the resulting database error — every selected column must be either in GROUP BY or wrapped in an aggregate function.",
      "Using GROUPING SETS or ROLLUP without realising the NULL values that appear in subtotal rows represent 'all values' for that column, not missing data — this can be misread if not understood.",
      "Writing separate queries for conditional counts (e.g. one query per condition) when a single query with multiple FILTER clauses would be cleaner and more efficient.",
    ],

    exercises: [
      "Write a GROUP BY query with at least 2 grouping columns and 3 different aggregate functions against your hospital schema.",
      "Write a query that correctly uses both WHERE and HAVING together, and explain in a comment exactly what each clause is filtering.",
      "Use ROLLUP to produce a department + drug subtotal report, and identify which rows in the output represent subtotals (hint: look for NULLs).",
      "Rewrite a query that would otherwise need 2 separate conditional COUNT queries into one query using 2 FILTER clauses instead.",
    ],

    resources: [
      {
        objective: "Master GROUP BY, HAVING, and multi-level aggregation",
        items: [
          { title: "PostgreSQL official docs — GROUPING SETS, CUBE, and ROLLUP", url: "https://www.postgresql.org/docs/current/queries-table-expressions.html#QUERIES-GROUPING-SETS", type: "reference", note: "Official syntax and behaviour reference for advanced grouping." },
          { title: "Mode Analytics SQL Tutorial — Aggregations", url: "https://mode.com/sql-tutorial/", type: "interactive tutorial", note: "Browser-based practice with GROUP BY and HAVING on real data." },
        ],
      },
      {
        objective: "Practice aggregation-heavy analytics questions",
        items: [
          { title: "DataLemur — SQL Practice Problems", url: "https://datalemur.com/questions", type: "interactive exercises", note: "Continue daily practice, focusing on aggregation questions today." },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 52 — Subqueries: Correlated, Non-Correlated, EXISTS
  // ============================================================
  {
    id: "W11D2", week: 11, day: 2, phase: 2,
    phaseTitle: "Data Engineering Foundations",
    date: "2026-08-25",
    type: "lesson",
    topic: "Subqueries: Correlated vs Non-Correlated, EXISTS, IN & Scalar Subqueries",
    duration: "2–3 hours",

    objectives: [
      "Distinguish correlated from non-correlated subqueries and know the performance implications",
      "Use EXISTS and NOT EXISTS for set-membership questions",
      "Choose correctly between IN, EXISTS, and a JOIN for the same logical question",
      "Use scalar subqueries safely, handling cases where zero or multiple rows could return",
    ],

    introduction: `
Subqueries are queries nested inside other queries — and while
CTEs (Week 10) are often the more READABLE choice for complex
logic, subqueries remain essential for specific patterns like
EXISTS checks and scalar lookups. Today is about knowing exactly
which tool fits which situation, since IN, EXISTS, and JOIN can
often produce the same RESULT but with very different performance
characteristics at scale.
    `,

    mentalModel: `
MENTAL MODEL — "Asking About Each Patient One at a Time vs Once for Everyone"

A NON-correlated subquery is computed ONCE, independently, then
used by the outer query — like checking a single reference list
("what's today's date?") once and applying it everywhere. A
CORRELATED subquery re-runs ONCE PER ROW of the outer query,
referencing that row's specific value each time — like asking
"does THIS patient, specifically, have any allergy on file?"
separately for every single patient. Correlated subqueries are
more flexible but can be far slower, because the inner query
potentially executes once per outer row.
    `,

    explanation: `
NON-CORRELATED SUBQUERIES
=============================
-- The inner query runs once, independent of the outer query
SELECT full_name, date_of_birth
FROM patients
WHERE department_id = (
    SELECT department_id FROM departments WHERE name = 'Cardiology'
);

-- A subquery returning multiple values, used with IN
SELECT full_name
FROM patients
WHERE patient_id IN (
    SELECT patient_id FROM prescriptions WHERE drug_name = 'Metformin'
);

CORRELATED SUBQUERIES
=========================
-- The inner query references the OUTER query's current row
-- (p.patient_id) and re-evaluates for every row
SELECT p.full_name
FROM patients p
WHERE EXISTS (
    SELECT 1 FROM patient_allergies a
    WHERE a.patient_id = p.patient_id
);
-- "For each patient, does at least one matching allergy row exist?"

EXISTS / NOT EXISTS
=======================
EXISTS only cares WHETHER any row matches — not what the row
contains — which makes it efficient: the database can stop
checking the moment it finds one match, rather than counting all
matches.

-- Patients who have NO allergies on file
SELECT p.full_name
FROM patients p
WHERE NOT EXISTS (
    SELECT 1 FROM patient_allergies a
    WHERE a.patient_id = p.patient_id
);

IN vs EXISTS vs JOIN — CHOOSING CORRECTLY
==============================================
All three can sometimes produce the same logical result:

-- Using IN
SELECT full_name FROM patients
WHERE patient_id IN (SELECT patient_id FROM prescriptions);

-- Using EXISTS
SELECT full_name FROM patients p
WHERE EXISTS (SELECT 1 FROM prescriptions pr WHERE pr.patient_id = p.patient_id);

-- Using JOIN with DISTINCT
SELECT DISTINCT p.full_name FROM patients p
JOIN prescriptions pr ON p.patient_id = pr.patient_id;

General guidance: EXISTS is usually most efficient for "does at
least one match exist" questions on large tables, because it can
short-circuit. IN is fine for smaller, simple lists. JOIN is best
when you also need columns FROM the related table in your output
— if you only need a yes/no membership check, EXISTS or IN avoid
the need for DISTINCT and any row-multiplication risk a JOIN
could introduce.

SCALAR SUBQUERIES — HANDLE THE "MULTIPLE ROWS" RISK
=========================================================
SELECT
    full_name,
    (SELECT MAX(result_date) FROM lab_results lr
     WHERE lr.patient_id = p.patient_id) AS most_recent_test
FROM patients p;

A scalar subquery MUST return exactly one value per outer row.
Using MAX() here guarantees that, even if a patient has many lab
results — without an aggregate, a scalar subquery returning more
than one row raises a runtime error.
    `,

    clinicalConnection: `
"Which patients have NO allergy documented" (NOT EXISTS) is a
genuinely important clinical data quality check — missing allergy
documentation, not necessarily an absence of allergies, is itself
a patient safety gap worth flagging. This is a great example of
how a purely technical SQL pattern maps directly onto a real
clinical governance question.
    `,

    example: `
-- 1. Correlated EXISTS: patients with at least one high-dose prescription
SELECT p.full_name
FROM patients p
WHERE EXISTS (
    SELECT 1 FROM prescriptions pr
    WHERE pr.patient_id = p.patient_id AND pr.dose_mg > 500
);

-- 2. NOT EXISTS: data quality check — patients with no allergy on file
SELECT p.full_name
FROM patients p
WHERE NOT EXISTS (
    SELECT 1 FROM patient_allergies a
    WHERE a.patient_id = p.patient_id
);

-- 3. Non-correlated subquery with IN
SELECT full_name
FROM patients
WHERE department_id IN (
    SELECT department_id FROM departments
    WHERE name IN ('Cardiology', 'Endocrinology')
);

-- 4. Scalar subquery: each patient's most recent lab test date
SELECT
    p.full_name,
    (SELECT MAX(lr.result_date) FROM lab_results lr
     WHERE lr.patient_id = p.patient_id) AS most_recent_test_date
FROM patients p
ORDER BY most_recent_test_date DESC NULLS LAST;

-- 5. The same "has a prescription" question, 3 ways — compare with EXPLAIN ANALYZE
EXPLAIN ANALYZE
SELECT full_name FROM patients
WHERE patient_id IN (SELECT patient_id FROM prescriptions);

EXPLAIN ANALYZE
SELECT full_name FROM patients p
WHERE EXISTS (SELECT 1 FROM prescriptions pr WHERE pr.patient_id = p.patient_id);
    `,

    commonMistakes: [
      "Using a scalar subquery (one expected to return a single value) without an aggregate function, causing a runtime error the moment more than one matching row exists.",
      "Defaulting to correlated subqueries for everything out of habit, even when a simple JOIN or non-correlated subquery would be clearer and faster.",
      "Forgetting that EXISTS doesn't care about the SELECTed columns inside it — writing SELECT * vs SELECT 1 inside an EXISTS makes no performance difference, so SELECT 1 is conventional and clearer about intent.",
      "Using NOT IN with a subquery that could contain NULL values — NOT IN behaves unexpectedly (returns no rows at all) if the subquery's result set contains any NULL, a well-known SQL trap. NOT EXISTS does not have this problem.",
    ],

    exercises: [
      "Write a correlated EXISTS query identifying patients who have at least one lab result above a threshold value you choose.",
      "Write the corresponding NOT EXISTS query for the same condition, and confirm the two results are complementary (together cover all patients).",
      "Write the same logical question 3 ways (IN, EXISTS, JOIN) and run EXPLAIN ANALYZE on each — note any differences in the query plan.",
      "Write a scalar subquery that returns, for each patient, their total number of prescriptions as a single computed column.",
    ],

    resources: [
      {
        objective: "Understand subquery types and their performance implications",
        items: [
          { title: "Mode Analytics SQL Tutorial — Subqueries", url: "https://mode.com/sql-tutorial/", type: "interactive tutorial", note: "Browser-based practice covering correlated and non-correlated subqueries." },
          { title: "PostgreSQL official docs — Subquery Expressions", url: "https://www.postgresql.org/docs/current/functions-subquery.html", type: "reference", note: "Official reference for EXISTS, IN, ANY, ALL, and scalar subqueries." },
        ],
      },
      {
        objective: "Practice choosing between IN, EXISTS, and JOIN",
        items: [
          { title: "DataLemur — SQL Practice Problems", url: "https://datalemur.com/questions", type: "interactive exercises", note: "Many interview questions specifically test subquery vs JOIN tradeoffs." },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 53 — Set Operations & Conditional Logic
  // ============================================================
  {
    id: "W11D3", week: 11, day: 3, phase: 2,
    phaseTitle: "Data Engineering Foundations",
    date: "2026-08-26",
    type: "lesson",
    topic: "Set Operations (UNION, INTERSECT, EXCEPT) & Conditional Logic (CASE, COALESCE)",
    duration: "2–3 hours",

    objectives: [
      "Combine result sets using UNION, UNION ALL, INTERSECT, and EXCEPT",
      "Know when UNION ALL is correct instead of UNION, and why it's often faster",
      "Use CASE WHEN for conditional logic inside SELECT statements",
      "Use COALESCE and NULLIF to handle NULL values cleanly",
    ],

    introduction: `
Today rounds out your core analytical SQL toolkit with two
distinct but equally useful skill sets: combining entirely
separate result sets (set operations) and handling conditional
logic and NULLs gracefully within a single query. Both come up
constantly once you start building the ETL pipelines and reports
in the weeks ahead.
    `,

    mentalModel: `
MENTAL MODEL — "Combining Two Separate Patient Lists"

UNION is like merging two separate patient lists from two
different clinics into one combined roster, removing anyone who
appears on both. UNION ALL keeps every entry from both lists,
duplicates included — much faster, since no de-duplication check
is needed. INTERSECT gives you only the patients who appear on
BOTH lists. EXCEPT gives you patients on the first list who are
NOT on the second — useful for "who's missing" questions.
    `,

    explanation: `
UNION vs UNION ALL
======================
SELECT full_name FROM patients WHERE department_id = 1
UNION
SELECT full_name FROM patients WHERE department_id = 2;
-- Combines both result sets, removing any exact duplicate rows.
-- The de-duplication check has a real performance cost.

SELECT full_name FROM patients WHERE department_id = 1
UNION ALL
SELECT full_name FROM patients WHERE department_id = 2;
-- Combines both result sets, KEEPING duplicates. Faster, because
-- no de-duplication pass is needed. Use this whenever you know
-- duplicates either can't occur or don't matter.

Both queries being combined must have the SAME NUMBER of columns,
with compatible data types in the same order.

INTERSECT — ROWS IN BOTH RESULT SETS
=========================================
SELECT patient_id FROM prescriptions WHERE drug_name = 'Metformin'
INTERSECT
SELECT patient_id FROM prescriptions WHERE drug_name = 'Lisinopril';
-- Patients prescribed BOTH drugs.

EXCEPT — ROWS IN THE FIRST SET, NOT IN THE SECOND
=======================================================
SELECT patient_id FROM patients
EXCEPT
SELECT patient_id FROM prescriptions;
-- Patients with NO prescriptions at all — note this produces the
-- same logical result as the NOT EXISTS / LEFT JOIN + IS NULL
-- patterns from earlier this week and last week. Multiple valid
-- ways to ask the same question is normal in SQL.

CASE WHEN — CONDITIONAL LOGIC IN A QUERY
=============================================
SELECT
    full_name,
    result_value,
    CASE
        WHEN result_value >= 126 THEN 'Diabetic range'
        WHEN result_value >= 100 THEN 'Prediabetic range'
        ELSE 'Normal'
    END AS glucose_category
FROM lab_results
JOIN patients USING (patient_id)
WHERE test_name = 'Glucose';

CASE WHEN can also power conditional aggregation:
SELECT
    department_id,
    SUM(CASE WHEN result_value >= 126 THEN 1 ELSE 0 END) AS diabetic_range_count
FROM lab_results
JOIN patients USING (patient_id)
GROUP BY department_id;
-- (Though the FILTER clause from Day 1 is often cleaner for this
-- exact pattern in PostgreSQL specifically.)

COALESCE AND NULLIF
=======================
COALESCE(a, b, c) returns the first NON-NULL value among its
arguments — extremely useful for providing fallback/default
values:

SELECT
    full_name,
    COALESCE(middle_name, '(none on file)') AS middle_name_display
FROM patients;

NULLIF(a, b) returns NULL if a equals b, otherwise returns a —
useful for converting placeholder "empty" values into true NULLs,
or avoiding division-by-zero errors:

SELECT
    drug_name,
    total_revenue / NULLIF(units_sold, 0) AS revenue_per_unit
FROM sales_summary;
-- Returns NULL instead of crashing when units_sold is 0,
-- rather than raising a division-by-zero error.
    `,

    clinicalConnection: `
CASE WHEN building a glucose_category column ('Diabetic range',
'Prediabetic range', 'Normal') directly from raw numeric values
is exactly how clinical decision-support flagging logic gets
implemented in real systems — translating a continuous lab value
into clinically meaningful categories that a busy clinician can
scan instantly, rather than mentally re-deriving the threshold
every time.
    `,

    example: `
-- 1. UNION ALL: combine two separate alert lists, duplicates allowed
SELECT patient_id, 'high_glucose' AS alert_type
FROM lab_results WHERE test_name = 'Glucose' AND result_value > 126
UNION ALL
SELECT patient_id, 'high_dose' AS alert_type
FROM prescriptions WHERE dose_mg > 1000;

-- 2. INTERSECT: patients on both Metformin AND Lisinopril
SELECT patient_id FROM prescriptions WHERE drug_name = 'Metformin'
INTERSECT
SELECT patient_id FROM prescriptions WHERE drug_name = 'Lisinopril';

-- 3. EXCEPT: patients with prescriptions but no allergy documented
SELECT patient_id FROM prescriptions
EXCEPT
SELECT patient_id FROM patient_allergies;

-- 4. CASE WHEN categorisation
SELECT
    p.full_name,
    lr.result_value,
    CASE
        WHEN lr.result_value >= 126 THEN 'Diabetic range'
        WHEN lr.result_value >= 100 THEN 'Prediabetic range'
        ELSE 'Normal'
    END AS category
FROM lab_results lr
JOIN patients p ON lr.patient_id = p.patient_id
WHERE lr.test_name = 'Glucose'
ORDER BY lr.result_value DESC;

-- 5. COALESCE and NULLIF together
SELECT
    drug_name,
    COALESCE(dose_mg, 0) AS dose_mg_safe,
    total_cost / NULLIF(quantity, 0) AS cost_per_unit
FROM prescriptions;
    `,

    commonMistakes: [
      "Using UNION when UNION ALL would be correct and meaningfully faster — only pay the de-duplication cost when duplicates are actually possible and actually unwanted.",
      "Combining result sets with mismatched column counts or incompatible types in UNION/INTERSECT/EXCEPT, causing an immediate query error.",
      "Forgetting the ELSE clause in CASE WHEN, which results in NULL for any row that doesn't match any WHEN condition — sometimes intended, often a silent bug.",
      "Reaching for division without NULLIF protection against zero denominators, causing a runtime error in production instead of a clean NULL result.",
    ],

    exercises: [
      "Write a query using EXCEPT to find patients who have lab results but no prescriptions, and a separate query using NOT EXISTS for the same question — confirm they match.",
      "Write a CASE WHEN query that categorises lab results into at least 3 named categories based on value thresholds.",
      "Use COALESCE to provide a default display value for any nullable column in your schema.",
      "Write a query using NULLIF to safely compute a per-unit value, avoiding a division-by-zero scenario you construct deliberately to test it.",
    ],

    resources: [
      {
        objective: "Master set operations and their performance characteristics",
        items: [
          { title: "PostgreSQL official docs — Combining Queries (UNION/INTERSECT/EXCEPT)", url: "https://www.postgresql.org/docs/current/queries-union.html", type: "reference", note: "Official reference for set operation syntax and behaviour." },
        ],
      },
      {
        objective: "Practice conditional logic and NULL handling",
        items: [
          { title: "Mode Analytics SQL Tutorial — CASE statements", url: "https://mode.com/sql-tutorial/", type: "interactive tutorial", note: "Browser-based practice with CASE WHEN on real datasets." },
          { title: "W3Schools PostgreSQL Tutorial", url: "https://www.w3schools.com/postgresql/", type: "interactive reference", note: "Quick syntax lookup for COALESCE, NULLIF, and CASE." },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 54 — EXPLAIN Deep Dive for Analytics Queries
  // ============================================================
  {
    id: "W11D4", week: 11, day: 4, phase: 2,
    phaseTitle: "Data Engineering Foundations",
    date: "2026-08-27",
    type: "lesson",
    topic: "EXPLAIN Deep Dive: Optimising Aggregation, Subquery & CTE-Heavy Analytics Queries",
    duration: "2–3 hours",

    objectives: [
      "Read more advanced EXPLAIN ANALYZE output: hash joins, sort nodes, and aggregate nodes",
      "Diagnose why a CTE-heavy or subquery-heavy query is slow",
      "Apply targeted indexes to aggregation and JOIN-heavy analytics queries",
      "Use materialised views for genuinely expensive, frequently-repeated analytical queries",
    ],

    introduction: `
Week 10 covered the basics of EXPLAIN and indexing for simple
filters. Today goes further: analytics queries combine GROUP BY,
JOINs, subqueries, and CTEs all at once, and the execution plans
get correspondingly more complex. Building real comfort reading
these plans is what separates someone who can WRITE correct SQL
from someone who can write FAST, production-grade SQL — a
meaningfully more valuable and rarer skill.
    `,

    mentalModel: `
MENTAL MODEL — "Reading the Full Lab Workflow, Not Just One Step"

Last week you learned to recognise one diagnostic test result
(Seq Scan vs Index Scan) in isolation. Today is like reviewing
the ENTIRE workflow of a complex multi-step lab process — sample
prep, multiple assay stages, final compilation — and identifying
exactly WHICH stage is the bottleneck slowing the whole pipeline
down, rather than just checking a single step.
    `,

    explanation: `
READING MORE COMPLEX EXPLAIN OUTPUT
========================================
EXPLAIN ANALYZE
SELECT d.name, COUNT(*) AS prescription_count
FROM prescriptions pr
JOIN patients p ON pr.patient_id = p.patient_id
JOIN departments d ON p.department_id = d.department_id
GROUP BY d.name;

Typical nodes you'll see, read from the INSIDE OUT (innermost
operations happen first):

Seq Scan / Index Scan   -- how each table is initially read
Hash Join / Nested Loop / Merge Join  -- how two row sets get combined
HashAggregate / GroupAggregate         -- how GROUP BY is computed
Sort                                     -- explicit sorting step

Hash Join is generally efficient for joining large tables on
equality conditions. Nested Loop is efficient ONLY when one side
is small — if you see Nested Loop on two LARGE tables, that's
often a red flag worth investigating.

IDENTIFYING THE ACTUAL BOTTLENECK
======================================
EXPLAIN ANALYZE reports both ESTIMATED cost and ACTUAL time per
node. Look for the node with by far the largest "actual time" —
that's your bottleneck, not necessarily the outermost or most
visually prominent part of the plan.

(cost=120.00..450.00 rows=500 width=64) (actual time=2.1..89.4 rows=480 loops=1)

The actual time range (2.1..89.4 ms here) tells you how long THIS
specific step took. A query with one node taking 89ms out of a
total 92ms query time has a clear, singular bottleneck worth
targeting — fixing other parts of the plan would barely matter.

INDEXING FOR JOIN-HEAVY ANALYTICS QUERIES
==============================================
Index the FOREIGN KEY columns used in JOIN conditions — these are
not automatically indexed by PostgreSQL just because they're
foreign keys (only the PRIMARY KEY side gets an automatic index):

CREATE INDEX idx_prescriptions_patient_id ON prescriptions (patient_id);
CREATE INDEX idx_patients_department_id ON patients (department_id);

This is one of the most common, highest-impact optimisations in
real analytics databases — foreign key columns used constantly in
JOINs, left unindexed.

MATERIALISED VIEWS — CACHING EXPENSIVE RESULTS
====================================================
For a genuinely expensive query that's run repeatedly but doesn't
need up-to-the-second freshness (e.g. a daily summary dashboard):

CREATE MATERIALIZED VIEW department_prescription_summary AS
SELECT d.name, COUNT(*) AS prescription_count, AVG(pr.dose_mg) AS avg_dose
FROM prescriptions pr
JOIN patients p ON pr.patient_id = p.patient_id
JOIN departments d ON p.department_id = d.department_id
GROUP BY d.name;

-- Querying it afterward is instant, like querying a normal table:
SELECT * FROM department_prescription_summary;

-- Refresh it periodically (e.g. via a scheduled job — exactly
-- what Airflow, covered in Week 14, is built for):
REFRESH MATERIALIZED VIEW department_prescription_summary;

A materialised view trades data freshness for massive read speed
— the underlying query only actually runs when you REFRESH it,
not every time someone reads the view.
    `,

    clinicalConnection: `
A hospital's daily "department utilisation dashboard" that
hundreds of staff check every morning is a perfect materialised
view candidate — the underlying numbers don't need to update
every second, but the dashboard gets read constantly throughout
the day. Refreshing it once overnight and serving instant reads
all day is dramatically more efficient than recomputing the full
aggregation on every single page load.
    `,

    example: `
-- Diagnosing and fixing a slow analytics query end to end

-- 1. Run the query and check the plan
EXPLAIN ANALYZE
SELECT d.name, COUNT(*) AS prescription_count, AVG(pr.dose_mg) AS avg_dose
FROM prescriptions pr
JOIN patients p ON pr.patient_id = p.patient_id
JOIN departments d ON p.department_id = d.department_id
GROUP BY d.name;
-- Suppose this shows Seq Scans on prescriptions and patients,
-- with most of the actual time spent there

-- 2. Add indexes on the join columns
CREATE INDEX idx_prescriptions_patient_id ON prescriptions (patient_id);
CREATE INDEX idx_patients_department_id ON patients (department_id);

-- 3. Re-run and confirm improvement
EXPLAIN ANALYZE
SELECT d.name, COUNT(*) AS prescription_count, AVG(pr.dose_mg) AS avg_dose
FROM prescriptions pr
JOIN patients p ON pr.patient_id = p.patient_id
JOIN departments d ON p.department_id = d.department_id
GROUP BY d.name;
-- Should now show Index Scans and a faster total actual time

-- 4. If this report is run constantly and doesn't need live data,
-- convert it to a materialised view
CREATE MATERIALIZED VIEW department_prescription_summary AS
SELECT d.name, COUNT(*) AS prescription_count, AVG(pr.dose_mg) AS avg_dose
FROM prescriptions pr
JOIN patients p ON pr.patient_id = p.patient_id
JOIN departments d ON p.department_id = d.department_id
GROUP BY d.name;

SELECT * FROM department_prescription_summary;   -- instant from now on
    `,

    commonMistakes: [
      "Reading EXPLAIN output top-to-bottom literally instead of inside-out, misidentifying which step actually happens first and which is the true bottleneck.",
      "Indexing primary keys (already automatically indexed) instead of the foreign key columns actually used in JOIN conditions, which are NOT automatically indexed.",
      "Treating a materialised view as if it auto-updates — forgetting that REFRESH MATERIALIZED VIEW must be run explicitly (or scheduled) for the data to reflect new changes.",
      "Optimising the part of a query plan that looks most complex visually, rather than the part EXPLAIN ANALYZE's actual timing data shows is the genuine bottleneck.",
    ],

    exercises: [
      "Run EXPLAIN ANALYZE on a 3-table JOIN with a GROUP BY against your hospital schema, and identify the single largest actual-time contributor in the plan.",
      "Add indexes on the foreign key columns involved, re-run EXPLAIN ANALYZE, and document the measured improvement.",
      "Create a materialised view for one of your Week 10 analytics report queries, and confirm querying the view is faster than re-running the original query.",
      "Write 2-3 sentences explaining, in your own words, when a materialised view is the right tool versus just adding an index.",
    ],

    resources: [
      {
        objective: "Read complex, multi-node EXPLAIN ANALYZE output confidently",
        items: [
          { title: "PostgreSQL official docs — Using EXPLAIN", url: "https://www.postgresql.org/docs/current/using-explain.html", type: "reference", note: "Official guide — review the Hash Join and Aggregate sections specifically today." },
          { title: "Use the Index, Luke — The Join Operation", url: "https://use-the-index-luke.com/", type: "free online book", note: "Re-read the Join Operation chapter with this week's more complex examples in mind." },
        ],
      },
      {
        objective: "Use materialised views for expensive, repeated queries",
        items: [
          { title: "PostgreSQL official docs — Materialized Views", url: "https://www.postgresql.org/docs/current/rules-materializedviews.html", type: "reference", note: "Official reference for creating, querying, and refreshing materialised views." },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 55 — Week 11 Project: SQL Query Optimisation Challenge
  // ============================================================
  {
    id: "W11D5", week: 11, day: 5, phase: 2,
    phaseTitle: "Data Engineering Foundations",
    date: "2026-08-28",
    type: "project",
    topic: "Project: SQL Query Optimisation Challenge",
    duration: "3–4 hours",

    objectives: [
      "Diagnose and fix multiple genuinely slow analytical queries",
      "Document measurable before/after performance improvements with evidence",
      "Apply the full range of Phase 2 SQL skills so far in a single deliverable",
      "Practice the real-world skill of optimising existing queries rather than just writing new ones",
    ],

    introduction: `
This week's project flips the usual script: instead of writing
new queries from scratch, you're handed (by yourself, deliberately)
a set of working-but-slow queries and challenged to make them
fast, while keeping their results identical. This mirrors the
actual day-to-day work of a data engineer or analytics engineer
far more closely than greenfield query writing — most real SQL
work is maintaining and improving existing systems.
    `,

    mentalModel: `
MENTAL MODEL — "Quality Improvement Audit, Not a New Protocol"

Writing a brand-new clinical protocol from scratch is rare; far
more common is auditing an EXISTING workflow and finding where
it's slow, redundant, or error-prone, then improving it without
changing the outcome it's supposed to produce. Today's project is
exactly that kind of audit — applied to SQL instead of a clinical
process, with EXPLAIN ANALYZE as your audit tool.
    `,

    explanation: `
PROJECT BRIEF
================
Step 1 — Create the "before" state:
Deliberately write 4 working but UNOPTIMISED queries against your
hospital schema. Make them realistically slow by:
  - Using correlated subqueries where a JOIN or EXISTS would be
    more efficient
  - Querying without any supporting indexes on JOIN/WHERE columns
  - Using SELECT * unnecessarily on wide result sets
  - Combining multiple aggregations inefficiently (e.g. running 3
    separate full-table queries instead of 1 query with FILTER)

Step 2 — Diagnose each one:
Run EXPLAIN ANALYZE on each "before" query. Identify the specific
bottleneck node and actual time for each.

Step 3 — Optimise:
Rewrite and/or add indexes to fix each one. Techniques to apply
across the 4 queries (use a different primary technique for each,
to demonstrate range):
  1. Convert a correlated subquery to EXISTS or a JOIN
  2. Add a targeted index on a JOIN/WHERE column
  3. Replace multiple separate aggregate queries with one
     FILTER-based or GROUPING SETS query
  4. Convert a frequently-repeated expensive query into a
     materialised view

Step 4 — Measure and document:
Run EXPLAIN ANALYZE again on each optimised version. Record the
before/after actual time and the change in query plan (e.g.
Seq Scan -> Index Scan, Nested Loop -> Hash Join) for every query.

DELIVERABLE
==============
1. before_queries.sql — the 4 original unoptimised queries
2. after_queries.sql — the 4 optimised versions
3. optimisation_report.md — for each of the 4 queries: the
   before/after EXPLAIN ANALYZE output, the actual time
   improvement (with percentage if meaningful), and a short
   written explanation of WHY the fix worked
4. README.md summarising the overall exercise and key lessons
5. Push to GitHub, ideally alongside or linked from your Week 9-10
   hospital project repo
    `,

    clinicalConnection: `
This mirrors exactly how real healthcare data teams operate: an
existing reporting query that used to run fine on a small dataset
starts taking minutes as patient volume grows, and someone has to
diagnose and fix it without changing what the report shows
clinicians or administrators. The discipline of measuring before
touching anything, then measuring again after, is what separates
a credible fix from a guess that happened to work.
    `,

    example: `
-- Example "before" query (Technique 1 target: correlated subquery)
SELECT p.full_name
FROM patients p
WHERE (
    SELECT COUNT(*) FROM prescriptions pr
    WHERE pr.patient_id = p.patient_id
) > 3;

-- Example "after" query (rewritten using a JOIN + GROUP BY + HAVING,
-- generally more efficient than a per-row correlated subquery)
SELECT p.full_name
FROM patients p
JOIN prescriptions pr ON p.patient_id = pr.patient_id
GROUP BY p.full_name
HAVING COUNT(*) > 3;

-- optimisation_report.md entry for this query (written, not SQL):
-- BEFORE: EXPLAIN ANALYZE showed the correlated subquery re-running
-- once per patient row (SubPlan node, actual time=42.118 ms total).
-- AFTER: EXPLAIN ANALYZE showed a single HashAggregate after one
-- Hash Join pass (actual time=3.402 ms total) — approximately 12x
-- faster on this dataset size.
-- WHY: the correlated version repeated the prescription count
-- lookup once per patient; the JOIN + GROUP BY version computes
-- all counts in a single aggregation pass.
    `,

    commonMistakes: [
      "Making the 'before' queries unrealistically slow in ways that wouldn't actually occur in real code, undermining the exercise's value as practice for real-world optimisation.",
      "Changing what a query RETURNS while 'optimising' it — the optimised version must produce identical results to the original, only faster.",
      "Reporting only the after EXPLAIN ANALYZE output, without the before, leaving no evidence of actual improvement.",
      "Applying the same single technique (e.g. just adding an index) to all 4 queries instead of demonstrating the range of techniques specified in the brief.",
    ],

    exercises: [
      "Write and verify all 4 'before' queries run correctly (if slowly) against your hospital schema.",
      "Run and record EXPLAIN ANALYZE output for all 4 before-state queries.",
      "Apply the 4 distinct optimisation techniques specified in the brief, one per query, and verify each optimised query returns identical results to its original.",
      "Write the complete optimisation_report.md with all before/after evidence and explanations, then push the full project to GitHub.",
    ],

    resources: [
      {
        objective: "Reference optimisation techniques covered this week",
        items: [
          { title: "Use the Index, Luke — SQL Indexing and Tuning (Free Book)", url: "https://use-the-index-luke.com/", type: "free online book", note: "Review relevant chapters as you diagnose each of your 4 queries." },
          { title: "PostgreSQL official docs — Materialized Views", url: "https://www.postgresql.org/docs/current/rules-materializedviews.html", type: "reference", note: "Reference for the materialised view conversion technique." },
        ],
      },
      {
        objective: "See real interview-style query optimisation discussions",
        items: [
          { title: "DataLemur — SQL Practice Problems", url: "https://datalemur.com/questions", type: "interactive exercises", note: "Continue daily practice — many discussion threads cover optimisation tradeoffs." },
        ],
      },
    ],
  },

];

if (typeof module !== "undefined") {
  module.exports = { WEEK11 };
}
