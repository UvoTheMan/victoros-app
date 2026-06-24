// ============================================================
// WEEK 10 — Advanced SQL: Window Functions, CTEs, Optimisation
// Days 46–50 | 17–21 August 2026
// Phase 2: Data Engineering Foundations
// ============================================================

const WEEK10 = [

  // ============================================================
  // DAY 46 — Window Functions: ROW_NUMBER, RANK, DENSE_RANK
  // ============================================================
  {
    id: "W10D1", week: 10, day: 1, phase: 2,
    phaseTitle: "Data Engineering Foundations",
    date: "2026-08-17",
    type: "lesson",
    topic: "Window Functions: ROW_NUMBER, RANK, DENSE_RANK & PARTITION BY",
    duration: "2–3 hours",

    objectives: [
      "Explain how window functions differ from GROUP BY aggregation",
      "Use ROW_NUMBER, RANK, and DENSE_RANK correctly and know when each applies",
      "Apply PARTITION BY to compute rankings within groups",
      "Combine ORDER BY inside the OVER clause to control ranking order",
    ],

    introduction: `
This week is where SQL stops feeling like a query language and
starts feeling like a genuine analytical tool. Window functions
are the single biggest jump in SQL capability most learners
experience — they let you compute rankings, running totals, and
row-to-row comparisons WITHOUT collapsing your result set the way
GROUP BY does. This is also a heavily tested interview topic, so
today's fluency pays off directly in your job search later.
    `,

    mentalModel: `
MENTAL MODEL — "The Ward Round, Not the Discharge Summary"

GROUP BY is like a discharge summary — it collapses an entire
patient stay into one summary row per patient, losing the
individual day-by-day detail. A window function is like a ward
round — you still see EVERY individual day's entry, but each one
now also shows you something computed relative to the whole stay
(e.g. "this is reading #3 of 7 for this patient," "this is the
highest reading so far"). Nothing gets collapsed; every row is
annotated with group-level context.
    `,

    explanation: `
THE OVER CLAUSE — WHAT MAKES IT A "WINDOW"
================================================
Any aggregate-like function followed by OVER (...) becomes a
window function — it computes across a "window" of related rows
without collapsing them into one output row.

SELECT
    patient_id,
    test_name,
    result_date,
    ROW_NUMBER() OVER (ORDER BY result_date) AS row_num
FROM lab_results;
-- Every row keeps its own identity, but now has a sequential
-- number attached, ordered by result_date.

ROW_NUMBER vs RANK vs DENSE_RANK
=====================================
Given tied values, these three behave differently — this is the
single most common interview question on this topic.

SELECT
    patient_id,
    result_value,
    ROW_NUMBER() OVER (ORDER BY result_value DESC) AS row_num,
    RANK()       OVER (ORDER BY result_value DESC) AS rank_num,
    DENSE_RANK() OVER (ORDER BY result_value DESC) AS dense_rank_num
FROM lab_results;

Example with values [95, 90, 90, 85]:
ROW_NUMBER:  1, 2, 3, 4     -- always unique, ties broken arbitrarily
RANK:        1, 2, 2, 4     -- ties share rank, but a GAP follows
DENSE_RANK:  1, 2, 2, 3     -- ties share rank, NO gap follows

Use ROW_NUMBER when you need a guaranteed unique sequence (e.g.
"give me exactly one row per patient, the most recent"). Use RANK
when gaps reflecting true competitive position matter (like exam
rankings). Use DENSE_RANK when you want consecutive rank numbers
with no gaps, regardless of ties.

PARTITION BY — RESETTING THE WINDOW PER GROUP
===================================================
SELECT
    patient_id,
    department_id,
    result_value,
    RANK() OVER (
        PARTITION BY department_id
        ORDER BY result_value DESC
    ) AS rank_within_department
FROM lab_results
JOIN patients USING (patient_id);

PARTITION BY restarts the ranking calculation separately for
EACH department — patient_id 12 might be #1 in Cardiology while
patient_id 45 is also #1, but in Oncology. Without PARTITION BY,
ranking happens across the entire table as one window.

A REAL PATTERN: "MOST RECENT RECORD PER PATIENT"
=====================================================
This is one of the most common real-world window function uses
— getting exactly the latest row per group:

WITH ranked AS (
    SELECT *,
        ROW_NUMBER() OVER (
            PARTITION BY patient_id
            ORDER BY result_date DESC
        ) AS rn
    FROM lab_results
)
SELECT * FROM ranked WHERE rn = 1;
-- Exactly one row per patient: their single most recent result.
    `,

    clinicalConnection: `
Ranking lab results within each department using PARTITION BY is
exactly the analytical question "who has the highest glucose
reading in Endocrinology this month, separately from who has the
highest in Cardiology" — a single global RANK() without
PARTITION BY would incorrectly compare patients across completely
different clinical contexts. PARTITION BY is what makes the
comparison meaningful by keeping it within the right group.
    `,

    example: `
-- Using the lab_results / patients schema from Week 9

-- 1. Rank lab results by value, globally
SELECT
    patient_id,
    test_name,
    result_value,
    RANK() OVER (ORDER BY result_value DESC) AS overall_rank
FROM lab_results
WHERE test_name = 'Glucose';

-- 2. Rank within each patient's own results (their highest reading first)
SELECT
    patient_id,
    test_name,
    result_value,
    result_date,
    ROW_NUMBER() OVER (
        PARTITION BY patient_id
        ORDER BY result_value DESC
    ) AS rank_for_this_patient
FROM lab_results;

-- 3. The "most recent record per patient" pattern
WITH ranked_results AS (
    SELECT *,
        ROW_NUMBER() OVER (
            PARTITION BY patient_id
            ORDER BY result_date DESC
        ) AS rn
    FROM lab_results
)
SELECT patient_id, test_name, result_value, result_date
FROM ranked_results
WHERE rn = 1
ORDER BY patient_id;

-- 4. Demonstrating the RANK vs DENSE_RANK gap difference directly
SELECT
    result_value,
    RANK()       OVER (ORDER BY result_value DESC) AS rnk,
    DENSE_RANK() OVER (ORDER BY result_value DESC) AS dense_rnk
FROM lab_results
WHERE test_name = 'Glucose';
    `,

    commonMistakes: [
      "Using GROUP BY when a window function was actually needed — GROUP BY collapses rows; if you need to keep every row AND add a computed rank/position, you need a window function instead.",
      "Forgetting PARTITION BY when the ranking should genuinely restart per group, producing one global ranking instead of per-group rankings.",
      "Confusing RANK and DENSE_RANK and being surprised when downstream logic that expects consecutive numbers (e.g. 'top 3') breaks because RANK leaves gaps after ties.",
      "Trying to use a window function result directly in a WHERE clause in the same query level — window function results can only be filtered in an outer query or CTE, not the same SELECT's WHERE clause.",
    ],

    exercises: [
      "Using your hospital schema, rank patients within each department by their most recent lab result value using PARTITION BY department_id.",
      "Write a query demonstrating the exact difference between RANK and DENSE_RANK on a column with at least 2 tied values, and explain the difference in a comment.",
      "Write the 'most recent record per patient' pattern from the explanation, adapted to find each patient's MOST RECENT prescription instead of lab result.",
      "Complete at least 5 window function exercises on pgexercises.com or DataLemur today.",
    ],

    resources: [
      {
        objective: "Build a strong foundation in window function syntax and behaviour",
        items: [
          { title: "TechTFQ YouTube — SQL Window Functions Playlist", url: "https://www.youtube.com/c/techTFQ/playlists", type: "video", note: "The best free playlist for window functions — start here today." },
          { title: "Mode Analytics SQL Tutorial — Advanced Section", url: "https://mode.com/sql-tutorial/", type: "interactive tutorial", note: "Work through the window functions section in the browser, no setup needed." },
        ],
      },
      {
        objective: "Practice window functions on realistic problems",
        items: [
          { title: "sql-practice.online — CTE and Window Functions Exercises", url: "https://www.sql-practice.online/scenario/ctes-window", type: "interactive exercises", note: "60+ free problems specifically on window functions, no signup required." },
          { title: "DataLemur — SQL Practice Problems", url: "https://datalemur.com/questions", type: "interactive exercises", note: "Real interview questions — many use window functions specifically." },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 47 — More Window Functions: LAG, LEAD, Running Totals
  // ============================================================
  {
    id: "W10D2", week: 10, day: 2, phase: 2,
    phaseTitle: "Data Engineering Foundations",
    date: "2026-08-18",
    type: "lesson",
    topic: "Window Functions Continued: LAG, LEAD, Running Totals & Frame Clauses",
    duration: "2–3 hours",

    objectives: [
      "Use LAG and LEAD to compare a row to the previous or next row",
      "Compute running totals and moving averages using window frames",
      "Use NTILE to bucket rows into equal groups",
      "Use FIRST_VALUE and LAST_VALUE within a window",
    ],

    introduction: `
Yesterday was about ranking rows. Today is about comparing rows
to their NEIGHBOURS and accumulating values across an ordered
sequence — the foundation of trend analysis, period-over-period
comparisons, and running totals you'll see constantly in real
analytics work and in the BigQuery dashboards you'll build later
in this phase.
    `,

    mentalModel: `
MENTAL MODEL — "Comparing Today's Vitals to Yesterday's"

LAG and LEAD are exactly the clinical instinct to compare a
patient's current reading to their PREVIOUS one ("is this
glucose reading higher or lower than yesterday's?") or their NEXT
one in a sequence. A running total is the cumulative fluid intake
chart nurses track hour by hour — each new entry adds to
everything that came before, without losing the individual
hourly entries.
    `,

    explanation: `
LAG AND LEAD — LOOKING AT NEIGHBOURING ROWS
================================================
SELECT
    patient_id,
    result_date,
    result_value,
    LAG(result_value) OVER (
        PARTITION BY patient_id ORDER BY result_date
    ) AS previous_value,
    LEAD(result_value) OVER (
        PARTITION BY patient_id ORDER BY result_date
    ) AS next_value
FROM lab_results
WHERE test_name = 'Glucose';

LAG looks BACKWARD (the previous row); LEAD looks FORWARD (the
next row). Both return NULL when there's no such row (e.g. LAG
on the very first row in a partition).

A common derived pattern — change since last reading:
SELECT
    patient_id,
    result_date,
    result_value,
    result_value - LAG(result_value) OVER (
        PARTITION BY patient_id ORDER BY result_date
    ) AS change_from_previous
FROM lab_results;

RUNNING TOTALS WITH WINDOW FRAMES
=====================================
SELECT
    result_date,
    result_value,
    SUM(result_value) OVER (
        ORDER BY result_date
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS running_total
FROM lab_results
WHERE patient_id = 12;

ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW means "every row
from the very start up through this row" — that's what makes it
a TRUE running total rather than a single grand total.

MOVING AVERAGES
==================
SELECT
    result_date,
    result_value,
    AVG(result_value) OVER (
        ORDER BY result_date
        ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
    ) AS moving_avg_3day
FROM lab_results
WHERE patient_id = 12;

ROWS BETWEEN 2 PRECEDING AND CURRENT ROW creates a sliding window
of exactly 3 rows (the current one plus the 2 before it) — a
classic 3-period moving average, smoothing out noisy day-to-day
fluctuations.

NTILE — BUCKETING ROWS INTO EQUAL GROUPS
=============================================
SELECT
    patient_id,
    result_value,
    NTILE(4) OVER (ORDER BY result_value) AS quartile
FROM lab_results
WHERE test_name = 'Glucose';
-- Splits all rows into 4 roughly equal-sized buckets (quartiles)
-- based on result_value — bucket 1 is the lowest quarter, 4 the highest.

FIRST_VALUE AND LAST_VALUE
==============================
SELECT
    patient_id,
    result_date,
    result_value,
    FIRST_VALUE(result_value) OVER (
        PARTITION BY patient_id ORDER BY result_date
    ) AS first_reading
FROM lab_results;
-- Attaches each patient's VERY FIRST reading to every one of
-- their rows — useful for "change from baseline" calculations.
    `,

    clinicalConnection: `
LAG-based "change from previous reading" is precisely how
clinical trend monitoring works in practice — a single glucose
value means little in isolation, but "20 points higher than this
patient's reading 6 hours ago" is immediately actionable. A
3-reading moving average smooths exactly the kind of noisy,
naturally fluctuating vitals data (like blood pressure) where a
single outlier reading shouldn't trigger unnecessary alarm.
    `,

    example: `
-- Using lab_results for a single patient over several visits

SELECT
    result_date,
    result_value,
    LAG(result_value) OVER (ORDER BY result_date) AS previous_reading,
    result_value - LAG(result_value) OVER (ORDER BY result_date)
        AS change_from_previous,
    AVG(result_value) OVER (
        ORDER BY result_date
        ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
    ) AS moving_avg_3_readings,
    SUM(result_value) OVER (
        ORDER BY result_date
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS cumulative_total,
    FIRST_VALUE(result_value) OVER (ORDER BY result_date)
        AS baseline_reading
FROM lab_results
WHERE patient_id = 12 AND test_name = 'Glucose'
ORDER BY result_date;

-- Bucketing all glucose readings into quartiles to find the
-- highest-risk 25% of readings across the whole dataset
SELECT
    patient_id,
    result_value,
    NTILE(4) OVER (ORDER BY result_value) AS quartile
FROM lab_results
WHERE test_name = 'Glucose'
ORDER BY result_value DESC;
    `,

    commonMistakes: [
      "Forgetting that LAG/LEAD return NULL at the boundaries (first/last row of a partition) and not handling that NULL in downstream calculations like subtraction.",
      "Omitting the ROWS BETWEEN frame clause and assuming a running total will work correctly by default — the default frame behaviour with ORDER BY already produces a running calculation for aggregates, but being explicit avoids confusion and is considered better practice.",
      "Confusing NTILE with simple percentile calculations — NTILE creates equal-COUNT buckets, not equal-VALUE-RANGE buckets, which can surprise you with skewed data.",
      "Using LAST_VALUE without the correct frame clause and getting unexpected results — by default LAST_VALUE often returns the CURRENT row, not the true last row of the partition, unless the frame is widened explicitly.",
    ],

    exercises: [
      "Write a query using LAG to compute the change in a lab value between each patient's consecutive readings.",
      "Compute a 3-reading moving average for one test type using the ROWS BETWEEN frame syntax.",
      "Use NTILE(4) to split all patients' most recent lab results into quartiles, then write a follow-up query showing only the top quartile.",
      "Write a running total of prescriptions issued per day across the whole hospital, ordered by prescribed_date.",
    ],

    resources: [
      {
        objective: "Master LAG, LEAD, and frame-based window calculations",
        items: [
          { title: "TechTFQ YouTube — SQL Window Functions Playlist", url: "https://www.youtube.com/c/techTFQ/playlists", type: "video", note: "Continue this playlist — covers LAG/LEAD and running totals in depth." },
          { title: "PostgreSQL official docs — Window Functions", url: "https://www.postgresql.org/docs/current/tutorial-window.html", type: "reference", note: "Official tutorial with precise frame clause syntax and behaviour." },
        ],
      },
      {
        objective: "Practice running totals and moving averages",
        items: [
          { title: "sql-practice.online — CTE and Window Functions Exercises", url: "https://www.sql-practice.online/scenario/ctes-window", type: "interactive exercises", note: "Continue working through problems — focus on running total / moving average style questions today." },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 48 — CTEs: WITH Clause, Chaining, Recursive CTEs
  // ============================================================
  {
    id: "W10D3", week: 10, day: 3, phase: 2,
    phaseTitle: "Data Engineering Foundations",
    date: "2026-08-19",
    type: "lesson",
    topic: "CTEs: the WITH Clause, Chained CTEs & Recursive CTEs",
    duration: "2–3 hours",

    objectives: [
      "Rewrite nested subqueries as readable CTEs using the WITH clause",
      "Chain multiple CTEs together to build multi-step analytical queries",
      "Write a recursive CTE to traverse hierarchical data",
      "Know when a CTE is preferable to a subquery or temporary table",
    ],

    introduction: `
CTEs (Common Table Expressions) are how professional SQL stays
readable as queries grow complex. Today connects directly to
everything from this week — you'll often build a window function
result inside a CTE, then filter or join it cleanly in the
main query, exactly like the "most recent record per patient"
pattern from Day 1.
    `,

    mentalModel: `
MENTAL MODEL — "Naming Your Intermediate Lab Steps"

A nested subquery is like describing a multi-step lab procedure
in a single dense run-on sentence — technically complete, but
exhausting to follow. A CTE is the same procedure broken into
clearly labelled, named steps: "Step 1: centrifuge sample (call
this 'separated_plasma'). Step 2: using separated_plasma, run the
assay." Each step has a name you can refer back to, making the
whole procedure dramatically easier to read, debug, and modify.
    `,

    explanation: `
BASIC WITH CLAUSE SYNTAX
============================
WITH high_glucose_patients AS (
    SELECT patient_id, result_value
    FROM lab_results
    WHERE test_name = 'Glucose' AND result_value > 126
)
SELECT p.full_name, h.result_value
FROM high_glucose_patients h
JOIN patients p ON h.patient_id = p.patient_id;

The CTE (high_glucose_patients) is defined once, then referenced
in the main query just like a real table — but it only exists for
the duration of this single query.

CHAINING MULTIPLE CTEs
=========================
WITH recent_results AS (
    SELECT *,
        ROW_NUMBER() OVER (
            PARTITION BY patient_id ORDER BY result_date DESC
        ) AS rn
    FROM lab_results
),
latest_only AS (
    SELECT * FROM recent_results WHERE rn = 1
),
flagged AS (
    SELECT *,
        CASE WHEN result_value > 126 THEN 'High' ELSE 'Normal' END AS flag
    FROM latest_only
    WHERE test_name = 'Glucose'
)
SELECT patient_id, result_value, flag
FROM flagged
WHERE flag = 'High';

Each CTE can reference the ones defined before it, building a
clear, step-by-step analytical pipeline that reads top to bottom
— this is dramatically easier to debug than the equivalent deeply
nested subquery, because you can run each CTE individually to
check its output.

CTE vs SUBQUERY vs TEMP TABLE
=================================
Subquery:    fine for one simple, single-use filter
CTE:         best for multi-step logic, especially when the same
             intermediate result is referenced more than once, or
             when readability matters (almost always, in real work)
Temp table:  best when the intermediate result is large and will
             be reused across MULTIPLE separate queries, not just
             within one query

RECURSIVE CTEs — TRAVERSING HIERARCHIES
============================================
Useful for organisational charts, category trees, or any
"parent references parent" structure.

-- Example: a staff table with a supervisor_id self-reference
WITH RECURSIVE staff_chain AS (
    -- Base case: start with a specific staff member
    SELECT staff_id, name, supervisor_id, 1 AS level
    FROM staff
    WHERE staff_id = 5

    UNION ALL

    -- Recursive case: find their supervisor, then THEIR
    -- supervisor, and so on
    SELECT s.staff_id, s.name, s.supervisor_id, sc.level + 1
    FROM staff s
    JOIN staff_chain sc ON s.staff_id = sc.supervisor_id
)
SELECT * FROM staff_chain;
-- Walks UP the management chain from staff_id 5 to the top,
-- one level per recursive iteration, until no supervisor remains.

The UNION ALL combines the base case (where the recursion starts)
with the recursive case (which references the CTE's own name —
staff_chain — to repeatedly climb the hierarchy).
    `,

    clinicalConnection: `
A recursive CTE walking up a staff supervisor chain is
structurally identical to tracing a referral chain in a hospital
system — "this patient was referred by Dr. A, who reports up
through Department Head B, who reports to the Chief Medical
Officer." Any hierarchical structure — org charts, category
trees, bill-of-materials — uses this exact recursive pattern.
    `,

    example: `
-- Multi-step CTE pipeline: flag patients with rapidly worsening
-- glucose trends (this builds directly on Day 1-2 window functions)

WITH ordered_readings AS (
    SELECT
        patient_id,
        result_date,
        result_value,
        LAG(result_value) OVER (
            PARTITION BY patient_id ORDER BY result_date
        ) AS previous_value
    FROM lab_results
    WHERE test_name = 'Glucose'
),
changes AS (
    SELECT
        patient_id,
        result_date,
        result_value,
        result_value - previous_value AS change
    FROM ordered_readings
    WHERE previous_value IS NOT NULL
),
worsening AS (
    SELECT patient_id, result_date, change
    FROM changes
    WHERE change > 20    -- arbitrary threshold for "rapid worsening"
)
SELECT p.full_name, w.result_date, w.change
FROM worsening w
JOIN patients p ON w.patient_id = p.patient_id
ORDER BY w.change DESC;

-- Recursive CTE: full supervisor chain for every staff member
WITH RECURSIVE full_chain AS (
    SELECT staff_id, name, supervisor_id, name AS chain_path
    FROM staff
    WHERE supervisor_id IS NULL    -- top of the hierarchy

    UNION ALL

    SELECT s.staff_id, s.name, s.supervisor_id,
           fc.chain_path || ' -> ' || s.name
    FROM staff s
    JOIN full_chain fc ON s.supervisor_id = fc.staff_id
)
SELECT * FROM full_chain ORDER BY chain_path;
    `,

    commonMistakes: [
      "Writing a recursive CTE without a clear terminating condition (the base case), risking infinite recursion on cyclic or malformed data.",
      "Using a CTE when the logic only needs a single simple WHERE filter — sometimes a plain subquery or even a direct WHERE clause is genuinely simpler and a CTE just adds ceremony.",
      "Forgetting UNION ALL (not UNION) in recursive CTEs — UNION's automatic de-duplication can silently break recursive traversal logic in subtle ways.",
      "Assuming a CTE's result is cached/reused efficiently if referenced multiple times in the same query — PostgreSQL's behaviour here has evolved across versions, so don't rely on this for performance without checking your specific version's behaviour via EXPLAIN.",
    ],

    exercises: [
      "Rewrite a nested subquery you wrote earlier this week as a clean, named CTE instead.",
      "Build the 3-step chained CTE pipeline from the explanation (recent_results -> latest_only -> flagged), adapted to your own hospital schema's data.",
      "Write a recursive CTE that walks DOWN a hierarchy instead of up (e.g. find all staff who report, directly or indirectly, to a given manager).",
      "Complete at least 5 CTE-focused exercises on sql-practice.online or pgexercises.com today.",
    ],

    resources: [
      {
        objective: "Understand CTEs and when to use them over subqueries",
        items: [
          { title: "PostgreSQL official docs — WITH Queries (CTEs)", url: "https://www.postgresql.org/docs/current/queries-with.html", type: "reference", note: "Official, thorough reference including recursive CTE syntax and caveats." },
          { title: "Mode Analytics SQL Tutorial — Advanced Section (CTEs)", url: "https://mode.com/sql-tutorial/", type: "interactive tutorial", note: "Practical, browser-based CTE practice with real datasets." },
        ],
      },
      {
        objective: "Practice recursive CTEs on hierarchical data",
        items: [
          { title: "sql-practice.online — CTE and Window Functions Exercises", url: "https://www.sql-practice.online/scenario/ctes-window", type: "interactive exercises", note: "Includes recursive CTE problems — work through these today specifically." },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 49 — Query Optimisation: Indexes & EXPLAIN ANALYZE
  // ============================================================
  {
    id: "W10D4", week: 10, day: 4, phase: 2,
    phaseTitle: "Data Engineering Foundations",
    date: "2026-08-20",
    type: "lesson",
    topic: "Query Optimisation: B-Tree Indexes, Composite Indexes & EXPLAIN ANALYZE",
    duration: "2–3 hours",

    objectives: [
      "Read and interpret EXPLAIN and EXPLAIN ANALYZE output",
      "Create single-column and composite indexes appropriately",
      "Recognise when a query is doing a slow sequential scan versus a fast index scan",
      "Avoid common patterns that prevent PostgreSQL from using an existing index",
    ],

    introduction: `
Every query you've written this week has worked correctly on a
small practice dataset. In production, with millions of rows, the
SAME query can take milliseconds or minutes depending entirely on
whether PostgreSQL can use an index. Today is about understanding
WHY, so you can diagnose and fix slow queries rather than just
hoping they get faster on their own.
    `,

    mentalModel: `
MENTAL MODEL — "The Hospital's Patient Index Card System"

Without an index, finding a specific patient's chart means
checking every single file in the records room in order — a
SEQUENTIAL SCAN. An index is the alphabetised card catalogue at
the front desk: look up the patient's name once, get pointed
directly to the right file, skip everything else. Building that
catalogue (the index) takes some upfront effort and a little
extra storage — but it turns a search that scales with the WHOLE
hospital's records into one that's nearly instant.
    `,

    explanation: `
EXPLAIN AND EXPLAIN ANALYZE
================================
EXPLAIN SELECT * FROM lab_results WHERE patient_id = 42;
-- Shows the PLANNED execution strategy WITHOUT actually running
-- the query — useful for a quick check.

EXPLAIN ANALYZE SELECT * FROM lab_results WHERE patient_id = 42;
-- ACTUALLY RUNS the query and shows real timing alongside the
-- plan — this is what you'll use most often when diagnosing
-- a genuinely slow query.

Reading the output — the two patterns that matter most:
Seq Scan on lab_results  (cost=0.00..450.00 rows=1 width=64)
-- SEQUENTIAL SCAN: checks every row in the table. Slow at scale.

Index Scan using lab_results_patient_id_idx on lab_results
  (cost=0.29..8.31 rows=1 width=64)
-- INDEX SCAN: jumps directly to matching rows. Fast at scale.

CREATING INDEXES
====================
CREATE INDEX idx_lab_results_patient_id
ON lab_results (patient_id);

After this, the earlier query's EXPLAIN ANALYZE should switch
from Seq Scan to Index Scan — confirm this yourself by running
EXPLAIN ANALYZE both before and after creating the index.

COMPOSITE (MULTI-COLUMN) INDEXES
=====================================
CREATE INDEX idx_lab_results_patient_test
ON lab_results (patient_id, test_name);

This helps queries filtering on BOTH columns together, or on just
the FIRST column alone (patient_id) — but it does NOT efficiently
help a query that filters ONLY on test_name, because composite
indexes are only useful left-to-right from their leading column.

WHEN INDEXES DON'T HELP (OR ACTIVELY HURT)
================================================
1. Small tables: PostgreSQL's query planner may correctly decide
   a sequential scan is actually FASTER than using an index for a
   tiny table — this is correct behaviour, not a bug.
2. Low-selectivity columns: an index on a boolean column with
   roughly 50/50 true/false values rarely helps, because half the
   table still needs scanning either way.
3. Functions wrapping the indexed column in the WHERE clause
   (e.g. WHERE UPPER(drug_name) = 'METFORMIN') prevent the index
   from being used UNLESS you create a matching functional index.
4. Every index adds overhead to INSERT/UPDATE/DELETE operations,
   since the index must be maintained alongside the table — don't
   index columns that are never actually queried.

A REALISTIC OPTIMISATION WORKFLOW
=====================================
1. Identify a genuinely slow query (not a hypothetical one)
2. Run EXPLAIN ANALYZE on it — look for Seq Scan on a large table
3. Check which columns are in the WHERE/JOIN/ORDER BY clauses
4. Create an index covering those columns
5. Re-run EXPLAIN ANALYZE to CONFIRM the plan changed and timing improved
6. Never skip step 5 — assuming an index helped without verifying
   is a common, avoidable mistake
    `,

    clinicalConnection: `
Searching an unindexed lab_results table for one patient's
history among millions of rows is the database equivalent of a
records clerk physically searching every file cabinet in the
building because the alphabetical card catalogue was never built.
The cost of NOT indexing scales with the size of the entire
hospital's data — which is exactly why this matters far more once
you're working with real production-scale healthcare data rather
than a small practice dataset.
    `,

    example: `
-- Demonstrating the before/after of adding an index

-- 1. Check current performance without an index
EXPLAIN ANALYZE
SELECT * FROM lab_results WHERE patient_id = 42;
-- Look for "Seq Scan" in the output, note the execution time

-- 2. Create an index on the filtered column
CREATE INDEX idx_lab_results_patient_id
ON lab_results (patient_id);

-- 3. Re-run the exact same query
EXPLAIN ANALYZE
SELECT * FROM lab_results WHERE patient_id = 42;
-- Should now show "Index Scan", typically with much lower
-- execution time, especially as table size grows

-- 4. Composite index example — helps queries filtering on both
--    columns, or just the leading one
CREATE INDEX idx_lab_results_patient_test
ON lab_results (patient_id, test_name);

EXPLAIN ANALYZE
SELECT * FROM lab_results
WHERE patient_id = 42 AND test_name = 'Glucose';
-- Should use the composite index efficiently

EXPLAIN ANALYZE
SELECT * FROM lab_results
WHERE test_name = 'Glucose';
-- This will likely NOT use the composite index efficiently,
-- since test_name is not the leading column — demonstrating
-- the left-to-right rule directly
    `,

    commonMistakes: [
      "Creating an index and assuming it helped without ever re-running EXPLAIN ANALYZE to confirm the query plan actually changed.",
      "Wrapping an indexed column in a function in the WHERE clause (e.g. LOWER(drug_name) = ...) without a matching functional index, silently preventing index use.",
      "Indexing every column 'just in case,' adding unnecessary write overhead to a table that gets updated frequently, for indexes that are rarely or never actually used by real queries.",
      "Assuming a composite index on (a, b) helps a query filtering only on b — it doesn't, due to the left-to-right rule, unless a separate index on b alone exists.",
    ],

    exercises: [
      "Run EXPLAIN ANALYZE on a query against your hospital schema's largest table, before creating any new index. Note whether it's a Seq Scan.",
      "Create an appropriate index based on that query's WHERE clause, then re-run EXPLAIN ANALYZE and document the before/after difference.",
      "Create a composite index on two columns, then write two queries — one that benefits from it, one that doesn't (due to the left-to-right rule) — and confirm with EXPLAIN ANALYZE.",
      "Read the first 2 chapters of 'Use the Index, Luke' and write 3 sentences summarising the single most useful thing you learned.",
    ],

    resources: [
      {
        objective: "Understand indexing and query performance deeply",
        items: [
          { title: "Use the Index, Luke — SQL Indexing and Tuning (Free Book)", url: "https://use-the-index-luke.com/", type: "free online book", note: "Read Chapters 1-4 this week — the best free resource on this topic, period." },
          { title: "PostgreSQL official docs — Indexes", url: "https://www.postgresql.org/docs/current/indexes.html", type: "reference", note: "Official reference covering B-tree and other index types in PostgreSQL." },
        ],
      },
      {
        objective: "Practice reading EXPLAIN ANALYZE output",
        items: [
          { title: "PostgreSQL official docs — Using EXPLAIN", url: "https://www.postgresql.org/docs/current/using-explain.html", type: "reference", note: "Official guide to interpreting EXPLAIN output, with worked examples." },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 50 — Week 10 Project: Advanced SQL Analytics Report
  // ============================================================
  {
    id: "W10D5", week: 10, day: 5, phase: 2,
    phaseTitle: "Data Engineering Foundations",
    date: "2026-08-21",
    type: "project",
    topic: "Project: Advanced SQL Analytics Report",
    duration: "3–4 hours",

    objectives: [
      "Combine window functions, CTEs, and optimisation into one analytical deliverable",
      "Answer realistic, multi-step business/clinical questions using advanced SQL",
      "Demonstrate measurable query optimisation with before/after EXPLAIN ANALYZE evidence",
      "Produce a polished, documented analytics report suitable for a portfolio",
    ],

    introduction: `
This week's project is your chance to show, in one deliverable,
that you can move from raw normalised tables to genuinely
sophisticated analysis — the kind of report a real data analyst
or data engineer would be asked to produce. Build on the hospital
schema from Week 9; you're now answering much harder questions
against the same data using this week's new tools.
    `,

    mentalModel: `
MENTAL MODEL — "The Clinical Quality Report"

A hospital quality improvement report doesn't just list raw data
— it answers specific, often hierarchical and trend-based
questions: "which department had the most rapid patient
deterioration this quarter," "how does this month compare to
last," "who are the top-prescribing physicians and is that
appropriate." Today's project produces exactly that kind of
report — multi-step, trend-aware, and properly performant — using
the hospital schema you've already built.
    `,

    explanation: `
PROJECT BRIEF
================
Using your Week 9 hospital database, write and document AT LEAST
6 advanced analytical queries, each saved in an analytics_report.sql
file with a comment explaining the business/clinical question
being answered:

1. RANKING: Rank patients within each department by their total
   number of prescriptions, using RANK() or DENSE_RANK() with
   PARTITION BY.

2. TREND: For one test type (e.g. Glucose), compute each
   patient's change from their previous reading using LAG(), and
   identify the 3 patients with the largest single increase.

3. RUNNING TOTAL: Compute a running total of prescriptions issued
   per day across the entire hospital, ordered chronologically.

4. MULTI-STEP CTE: Using at least 2 chained CTEs, identify
   patients who have BOTH an allergy on file AND a prescription
   for a drug that could plausibly interact with that allergy
   category (a simplified, illustrative check — not real clinical
   decision support).

5. RECURSIVE CTE: If your schema has any hierarchical structure
   (e.g. staff supervisor chains), write a recursive query
   traversing it. If not, add a supervisor_id column to staff
   first, populate it with sample data, then write the query.

6. OPTIMISED QUERY: Take your SLOWEST query from this set, run
   EXPLAIN ANALYZE on it, create an appropriate index, re-run
   EXPLAIN ANALYZE, and document the before/after timing and
   plan change.

DELIVERABLE
==============
1. analytics_report.sql — all 6 queries, each with a comment
   explaining the question being answered
2. optimisation_notes.md — the EXPLAIN ANALYZE before/after
   evidence from query #6, with a short written explanation
3. README.md summarising the report's purpose and key findings
   (a few sentences per query, written as if presenting to a
   non-technical stakeholder)
4. Push to GitHub, either as a new repo or as an addition to your
   Week 9 hospital-db-schema repo
    `,

    clinicalConnection: `
This report mirrors exactly the kind of clinical analytics work
done by hospital quality and informatics teams — ranking
providers, tracking patient trends over time, and flagging
potential safety concerns (like the allergy/prescription overlap
check) using exactly this combination of SQL tools. The
optimisation step matters in real healthcare systems specifically
because these reports often run against millions of records and
need to complete within operational time constraints.
    `,

    example: `
-- Example for analytics_report.sql, Question 1: Rank patients
-- within department by total prescriptions

-- Q1: Which patients have the most prescriptions within their
-- own department? (Helps identify potential over-prescription
-- patterns worth a clinical review.)
WITH prescription_counts AS (
    SELECT patient_id, COUNT(*) AS total_prescriptions
    FROM prescriptions
    GROUP BY patient_id
)
SELECT
    p.full_name,
    d.name AS department,
    pc.total_prescriptions,
    RANK() OVER (
        PARTITION BY p.department_id
        ORDER BY pc.total_prescriptions DESC
    ) AS rank_in_department
FROM patients p
JOIN departments d ON p.department_id = d.department_id
JOIN prescription_counts pc ON p.patient_id = pc.patient_id
ORDER BY d.name, rank_in_department;

-- Example for optimisation_notes.md content (written, not SQL):
-- BEFORE: EXPLAIN ANALYZE showed a Seq Scan on prescriptions
-- (cost=0.00..620.00, actual time=14.221 ms) for the
-- prescription_counts CTE's underlying GROUP BY.
-- ACTION: Created CREATE INDEX idx_prescriptions_patient_id
-- ON prescriptions (patient_id);
-- AFTER: EXPLAIN ANALYZE showed an Index Scan
-- (cost=0.29..8.31, actual time=0.041 ms) — roughly 300x faster
-- on this dataset size, with the improvement expected to grow
-- substantially as the table scales.
    `,

    commonMistakes: [
      "Writing technically correct queries that don't actually answer a clearly stated business/clinical question — always start from the question, not the SQL feature you want to showcase.",
      "Skipping the 'before' EXPLAIN ANALYZE and only capturing the 'after' — without both, there's no evidence the optimisation actually mattered.",
      "Making the allergy/interaction check query (Q4) sound like real clinical decision support rather than a simplified illustrative exercise — be careful with the framing in your README.",
      "Submitting raw SQL with no written interpretation — a real analytics report always explains what the numbers MEAN, not just what query produced them.",
    ],

    exercises: [
      "Write and test all 6 required queries against your hospital database, confirming each runs correctly and produces sensible results.",
      "Complete the optimisation exercise (Q6) with full before/after EXPLAIN ANALYZE evidence captured in optimisation_notes.md.",
      "Write the README.md summarising findings in plain language suitable for a non-technical reader.",
      "Push the complete project to GitHub and add the link to your personal project tracker.",
    ],

    resources: [
      {
        objective: "See examples of real analytical SQL reports",
        items: [
          { title: "Mode Analytics SQL Tutorial — Advanced Section", url: "https://mode.com/sql-tutorial/", type: "interactive tutorial", note: "Review the advanced analytics examples for report-style query patterns." },
        ],
      },
      {
        objective: "Document optimisation evidence clearly",
        items: [
          { title: "PostgreSQL official docs — Using EXPLAIN", url: "https://www.postgresql.org/docs/current/using-explain.html", type: "reference", note: "Reference for correctly reading and reporting EXPLAIN ANALYZE output." },
        ],
      },
      {
        objective: "Practice additional advanced SQL interview-style questions",
        items: [
          { title: "DataLemur — SQL Practice Problems", url: "https://datalemur.com/questions", type: "interactive exercises", note: "Continue daily practice — aim for window function and CTE problems today." },
        ],
      },
    ],
  },

];

if (typeof module !== "undefined") {
  module.exports = { WEEK10 };
}
