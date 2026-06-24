// ============================================================
// WEEK 9 — PostgreSQL Fundamentals & Database Design
// Days 41–45 | 10–14 August 2026
// Phase 2: Data Engineering Foundations
// ============================================================

const WEEK9 = [

  // ============================================================
  // DAY 41 — Docker + PostgreSQL Setup, Relational DB Fundamentals
  // ============================================================
  {
    id: "W9D1", week: 9, day: 1, phase: 2,
    phaseTitle: "Data Engineering Foundations",
    date: "2026-08-10",
    type: "lesson",
    topic: "Docker + PostgreSQL Setup; OLTP vs OLAP & Relational Database Fundamentals",
    duration: "2–3 hours",

    objectives: [
      "Install Docker and run a PostgreSQL container locally",
      "Connect to PostgreSQL using psql and a GUI client",
      "Explain the difference between OLTP and OLAP systems",
      "Load the Pagila practice dataset and run a first exploratory query",
    ],

    introduction: `
Welcome to Phase 2. Everything from here through Week 20 builds
toward one goal: moving, storing, and serving data reliably at
scale — the actual job title "Data Engineer" describes. Today
you set up the two tools you'll use every single day for the
next three weeks: Docker (to run PostgreSQL in an isolated,
reproducible container) and PostgreSQL itself (the production-
grade relational database the DataTalks.Club Data Engineering
Zoomcamp — your anchor course for this phase — is built around).
    `,

    mentalModel: `
MENTAL MODEL — "The Sealed, Single-Use Exam Room"

Installing PostgreSQL directly onto your laptop is like
permanently converting a room in your house into a hospital exam
room — it works, but it's messy, hard to undo, and conflicts with
anything else that wants to use that space. Docker is a sealed,
single-use exam room you can summon instantly, use exactly as
needed, and tear down completely when done — with zero residue
left on your actual machine. Every data engineer uses Docker
constantly for exactly this reason: reproducible, disposable
environments.
    `,

    explanation: `
INSTALLING DOCKER
====================
Download Docker Desktop from docker.com for your OS, install it,
and confirm it's running:

docker --version
docker run hello-world

RUNNING POSTGRESQL IN DOCKER
================================
docker run -d \\
  --name pg-practice \\
  -e POSTGRES_USER=victor \\
  -e POSTGRES_PASSWORD=practice123 \\
  -e POSTGRES_DB=hospital_practice \\
  -p 5432:5432 \\
  postgres:16

-d            run in the background (detached)
--name        a friendly name to refer to the container
-e            environment variables PostgreSQL reads on startup
-p 5432:5432  map container port 5432 to your machine's port 5432
postgres:16   the official PostgreSQL image, version 16

Check it's running:
docker ps

Stop / start it later without losing data:
docker stop pg-practice
docker start pg-practice

CONNECTING TO POSTGRESQL
============================
Via command line (psql), straight into the running container:
docker exec -it pg-practice psql -U victor -d hospital_practice

Or install a lightweight GUI client like DBeaver or pgAdmin
(both free) and connect using:
  Host: localhost   Port: 5432
  User: victor       Password: practice123   Database: hospital_practice

OLTP vs OLAP
===============
OLTP (Online Transaction Processing): optimised for many small,
fast read/write operations — think "register a new patient,"
"update one prescription." Rows are added/changed constantly.
PostgreSQL, MySQL are classic OLTP systems.

OLAP (Online Analytical Processing): optimised for large, complex
queries scanning millions of rows for analysis — think "average
length of hospital stay across the last 5 years by department."
BigQuery (Week 16) and Snowflake are classic OLAP systems.

The same data often lives in BOTH forms in a real company: OLTP
for the live application, OLAP (a data warehouse) for analytics
— and a huge part of data engineering is building the pipeline
that moves data from one to the other.

LOADING A PRACTICE DATASET
==============================
Once connected, load the Pagila sample database (a realistic
DVD-rental schema used throughout pgexercises.com):

git clone https://github.com/devrimgunduz/pagila.git
cd pagila
docker exec -i pg-practice psql -U victor -d hospital_practice < pagila-schema.sql
docker exec -i pg-practice psql -U victor -d hospital_practice < pagila-data.sql

Then your first real query:
SELECT * FROM customer LIMIT 5;
    `,

    clinicalConnection: `
OLTP vs OLAP maps directly onto something you already know from
pharmacy systems: the dispensing software that records each
individual prescription fill in real time is OLTP — fast,
transactional, one record at a time. The hospital's quarterly
report on "average prescriptions per patient per department" is
an OLAP-style query — scanning huge volumes of historical records
to extract a pattern. Same underlying data, fundamentally
different access pattern and performance needs.
    `,

    example: `
# Terminal session — setting up and taking the first look around

# 1. Start the container (one-time setup)
docker run -d --name pg-practice \\
  -e POSTGRES_USER=victor \\
  -e POSTGRES_PASSWORD=practice123 \\
  -e POSTGRES_DB=hospital_practice \\
  -p 5432:5432 \\
  postgres:16

# 2. Confirm it's running
docker ps
# CONTAINER ID   IMAGE          ...   NAMES
# a1b2c3d4e5f6   postgres:16    ...   pg-practice

# 3. Connect with psql
docker exec -it pg-practice psql -U victor -d hospital_practice

-- 4. Inside psql, explore what's available
\\l              -- list all databases
\\dt              -- list all tables in current database
\\d customer      -- describe the structure of the customer table

-- 5. A first exploratory query (after loading Pagila)
SELECT customer_id, first_name, last_name, email
FROM customer
ORDER BY last_name
LIMIT 10;

-- 6. Exit psql
\\q
    `,

    commonMistakes: [
      "Forgetting -p 5432:5432, which means your GUI client or local psql can't reach the container at all even though it's running.",
      "Using docker rm on a container without first checking if you need the data inside it — this permanently deletes the container's data unless a volume was mounted.",
      "Confusing 'stop' and 'rm' — stop pauses the container (data preserved, can restart), rm deletes it entirely.",
      "Not realising OLTP and OLAP describe USAGE PATTERNS, not specific products — PostgreSQL itself can technically run either type of workload, it's just optimised for OLTP.",
    ],

    exercises: [
      "Set up the PostgreSQL Docker container exactly as shown, confirm it's running with docker ps, and connect successfully with psql.",
      "Install DBeaver or pgAdmin and connect to the same container using the GUI — confirm you can see the same tables both ways.",
      "Load the Pagila dataset and run \\dt to list all tables. Write down (as a comment) what you think 3 of the tables represent based on their names alone.",
      "Write a 3-sentence explanation, in your own words, of OLTP vs OLAP using a hospital example different from the one in this lesson.",
    ],

    resources: [
      {
        objective: "Set up Docker and run PostgreSQL in a container",
        items: [
          { title: "DataTalks.Club Zoomcamp — Module 1: Docker + PostgreSQL", url: "https://github.com/DataTalksClub/data-engineering-zoomcamp/tree/main/01-docker-terraform", type: "video + hands-on lab", note: "Your anchor course's official module — follow this exactly for Docker + Postgres setup." },
          { title: "Docker official — Get Started", url: "https://docs.docker.com/get-started/", type: "article", note: "Official Docker installation and fundamentals walkthrough." },
        ],
      },
      {
        objective: "Understand PostgreSQL and relational database basics",
        items: [
          { title: "freeCodeCamp — PostgreSQL Full Course for Beginners", url: "https://www.youtube.com/watch?v=qw--VYLpxG4", type: "video", note: "~4 hour full course — watch the first hour today covering installation and core concepts." },
          { title: "PostgreSQL Official Tutorial", url: "https://www.postgresql.org/docs/current/tutorial.html", type: "reference", note: "Bookmark this — your permanent reference throughout Phase 2." },
        ],
      },
      {
        objective: "Load and explore a realistic practice dataset",
        items: [
          { title: "Pagila — DVD Rental Sample Database", url: "https://github.com/devrimgunduz/pagila", type: "interactive", note: "The standard PostgreSQL practice dataset used by pgexercises.com — load it today." },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 42 — Database Design: Normalization, Keys, Data Types
  // ============================================================
  {
    id: "W9D2", week: 9, day: 2, phase: 2,
    phaseTitle: "Data Engineering Foundations",
    date: "2026-08-11",
    type: "lesson",
    topic: "Database Design: Normalization (1NF–3NF), Keys & PostgreSQL Data Types",
    duration: "2–3 hours",

    objectives: [
      "Apply 1NF, 2NF, and 3NF to identify and fix poorly structured tables",
      "Distinguish primary keys, foreign keys, and constraints",
      "Choose appropriate PostgreSQL data types for different kinds of data",
      "Recognise when intentional denormalisation is the right tradeoff",
    ],

    introduction: `
Yesterday you got PostgreSQL running. Today is about the single
most important skill separating a database that scales gracefully
from one that becomes an unmaintainable mess: good schema design.
This is foundational not just for SQL, but for everything ahead —
Airflow pipelines, dbt models, even ML feature tables all assume
you can design clean, well-normalised structures from the start.
    `,

    mentalModel: `
MENTAL MODEL — "One Fact, One Place in the Patient Chart"

Normalisation is the database version of a core clinical
documentation principle: each fact about a patient should live in
exactly ONE place in the chart, referenced from elsewhere, not
copy-pasted everywhere it's relevant. If a patient's allergy is
recorded in 5 different notes and one gets updated without the
others, you now have contradictory, dangerous information. A
normalised database eliminates that risk structurally — update
one row, and every reference to it is automatically consistent.
    `,

    explanation: `
NORMAL FORMS — THE PRACTICAL VERSION
========================================
1NF (First Normal Form): every column holds a single, atomic
value — no comma-separated lists crammed into one field.

BAD:  patient_id | medications
      1          | "Metformin, Lisinopril, Atorvastatin"

GOOD: a separate patient_medications table with one row per
      patient-medication pair.

2NF: built on 1NF, plus every non-key column must depend on the
WHOLE primary key, not just part of it (relevant for composite
keys). Avoids partial dependency.

3NF: built on 2NF, plus no non-key column should depend on
ANOTHER non-key column (no transitive dependency).

BAD:  order_id | customer_id | customer_city
(customer_city depends on customer_id, not on order_id directly
 — it should live in a separate customers table)

GOOD: orders table has customer_id only; a separate customers
table holds customer_city, joined when needed.

PRIMARY KEYS & FOREIGN KEYS
===============================
CREATE TABLE patients (
    patient_id SERIAL PRIMARY KEY,
    full_name  VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL
);

CREATE TABLE prescriptions (
    prescription_id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(patient_id),
    drug_name VARCHAR(100) NOT NULL,
    prescribed_date DATE DEFAULT CURRENT_DATE
);

PRIMARY KEY uniquely identifies each row in a table.
FOREIGN KEY (REFERENCES) enforces that prescriptions.patient_id
must match an existing patients.patient_id — PostgreSQL will
reject an insert that violates this, protecting data integrity
at the database level rather than relying on application code.

CONSTRAINTS
=============
NOT NULL        -- value is required
UNIQUE          -- no duplicate values allowed in this column
CHECK (age >= 0) -- custom validation rule enforced by the database
DEFAULT CURRENT_DATE -- auto-fill a value if none provided

KEY POSTGRESQL DATA TYPES
=============================
INTEGER / BIGINT      whole numbers
NUMERIC(10,2)          exact decimals (use for money — never FLOAT)
TEXT / VARCHAR(n)      strings, with or without a length limit
DATE / TIMESTAMP        calendar dates, dates with time
BOOLEAN                  true/false
JSONB                     structured JSON, queryable and indexable
SERIAL                    auto-incrementing integer (common for IDs)

Use NUMERIC, never FLOAT/REAL, for any monetary or dosage value —
floating point types introduce small rounding errors that are
unacceptable when precision matters.

WHEN TO DENORMALISE ON PURPOSE
==================================
Strict normalisation can hurt read performance when a query needs
to join many tables repeatedly for a common report. In analytics-
heavy systems (which you'll build in Weeks 15–20 with BigQuery and
dbt), intentionally duplicating some data into wide, denormalised
tables is a deliberate, accepted tradeoff — speed of reads over
strict non-duplication. The skill is choosing this consciously,
not stumbling into it from poor planning.
    `,

    clinicalConnection: `
A patients table with a comma-separated allergies column is
the database equivalent of writing "Penicillin, Sulfa" as one
scribbled line in a chart instead of using the structured allergy
list most EHR systems require — the moment a new allergy needs
adding or one needs removing, free text invites errors. A proper
patient_allergies table, one row per allergy, referenced by
patient_id, is exactly the structured, auditable approach real
clinical systems require for patient safety.
    `,

    example: `
-- A small, properly normalised hospital schema

CREATE TABLE departments (
    department_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE patients (
    patient_id SERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    date_of_birth DATE NOT NULL,
    department_id INTEGER REFERENCES departments(department_id)
);

CREATE TABLE patient_allergies (
    allergy_id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES patients(patient_id),
    allergen VARCHAR(100) NOT NULL,
    severity VARCHAR(20) CHECK (severity IN ('mild', 'moderate', 'severe'))
);

CREATE TABLE prescriptions (
    prescription_id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES patients(patient_id),
    drug_name VARCHAR(100) NOT NULL,
    dose_mg NUMERIC(8,2) NOT NULL CHECK (dose_mg > 0),
    prescribed_date DATE NOT NULL DEFAULT CURRENT_DATE
);

-- Try inserting a prescription for a patient that doesn't exist —
-- PostgreSQL will reject it because of the foreign key constraint:
INSERT INTO prescriptions (patient_id, drug_name, dose_mg)
VALUES (9999, 'Metformin', 500);
-- ERROR: insert or update on table "prescriptions" violates
-- foreign key constraint
    `,

    commonMistakes: [
      "Storing comma-separated values in a single column (e.g. allergies, medications) instead of a proper related table — this violates 1NF and makes querying individual values painful.",
      "Using FLOAT or REAL for money or precise dosage values, introducing rounding errors that NUMERIC avoids entirely.",
      "Forgetting NOT NULL on columns that should always have a value, allowing silent data quality problems to creep in over time.",
      "Over-normalising every single table to 3NF in an analytics-heavy system where a few deliberately denormalised, wide tables would serve reporting needs far better.",
    ],

    exercises: [
      "Take a single flat table with columns patient_id, patient_name, medication_1, medication_2, medication_3 and redesign it into a properly normalised 2-table structure.",
      "Create the 4-table hospital schema from the example above in your own PostgreSQL container, then attempt to insert a row that violates a CHECK constraint and observe the error.",
      "Write a CREATE TABLE statement for a 'lab_results' table with appropriate data types for: result value (precise decimal), test name, result date, and a foreign key to patients.",
      "Identify one place in any past dataset you've worked with that violated 1NF, and describe (in writing) how you would fix it.",
    ],

    resources: [
      {
        objective: "Understand normalization deeply, with examples",
        items: [
          { title: "freeCodeCamp — Database Normalization (Article)", url: "https://www.freecodecamp.org/news/database-normalization-1nf-2nf-3nf-table-examples/", type: "article", note: "Clear, example-driven walkthrough of 1NF through 3NF with before/after tables." },
          { title: "W3Schools PostgreSQL Tutorial", url: "https://www.w3schools.com/postgresql/", type: "interactive reference", note: "Use as a quick syntax lookup throughout this week and next." },
        ],
      },
      {
        objective: "Practice schema design and constraints hands-on",
        items: [
          { title: "pgexercises.com", url: "https://pgexercises.com/", type: "interactive exercises", note: "Start working through the basic exercises today — target 5+ per day through Week 11." },
        ],
      },
      {
        objective: "Choose correct PostgreSQL data types",
        items: [
          { title: "PostgreSQL official docs — Data Types", url: "https://www.postgresql.org/docs/current/datatype.html", type: "reference", note: "Official reference for every PostgreSQL data type, including precision/storage notes." },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 43 — DDL & DML: CREATE TABLE through full CRUD
  // ============================================================
  {
    id: "W9D3", week: 9, day: 3, phase: 2,
    phaseTitle: "Data Engineering Foundations",
    date: "2026-08-12",
    type: "lesson",
    topic: "DDL & DML: CREATE/ALTER/DROP TABLE and Full CRUD (INSERT, SELECT, UPDATE, DELETE)",
    duration: "2–3 hours",

    objectives: [
      "Use DDL commands to create, modify, and remove tables safely",
      "Perform all 4 CRUD operations confidently and correctly",
      "Use WHERE clauses precisely to target the right rows for UPDATE/DELETE",
      "Use transactions to safely test risky operations before committing",
    ],

    introduction: `
Yesterday was design. Today is the muscle memory of actually
operating on a database day to day — the commands you'll type
hundreds of times over the coming weeks. DDL (Data Definition
Language) shapes the structure; DML (Data Manipulation Language)
moves the data within that structure. Getting fluent and, more
importantly, CAREFUL with DELETE and UPDATE today prevents a
mistake that has taken down real production systems: a WHERE-less
DELETE.
    `,

    mentalModel: `
MENTAL MODEL — "Sign Before You Administer"

In a clinical setting, you don't administer a medication without
confirming the order, the patient, and the dose first — there's a
verification step before the irreversible action. UPDATE and
DELETE in SQL are exactly that irreversible action. Today's
discipline — always SELECT first with the same WHERE clause to
see exactly what you're about to affect, then run the UPDATE/
DELETE — is your verification step. Skipping it is how real
companies have lost entire customer tables in production.
    `,

    explanation: `
DDL — SHAPING THE STRUCTURE
===============================
CREATE TABLE staff (
    staff_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(50)
);

ALTER TABLE staff ADD COLUMN hire_date DATE;
ALTER TABLE staff ALTER COLUMN role SET NOT NULL;
ALTER TABLE staff DROP COLUMN hire_date;

DROP TABLE staff;             -- removes the table entirely, permanently
DROP TABLE IF EXISTS staff;   -- safe version, no error if it doesn't exist

DML — MANIPULATING THE DATA
===============================
-- CREATE (Insert)
INSERT INTO staff (name, role) VALUES ('Amaka Obi', 'Nurse');
INSERT INTO staff (name, role) VALUES
    ('Tunde Bello', 'Pharmacist'),
    ('Chidi Eze', 'Physician');     -- multi-row insert

-- READ (Select)
SELECT * FROM staff;
SELECT name, role FROM staff WHERE role = 'Pharmacist';
SELECT * FROM staff ORDER BY name ASC LIMIT 5;

-- UPDATE
UPDATE staff
SET role = 'Senior Pharmacist'
WHERE name = 'Tunde Bello';

-- DELETE
DELETE FROM staff
WHERE staff_id = 3;

THE GOLDEN RULE: SELECT BEFORE UPDATE/DELETE
================================================
-- Step 1: See exactly what will be affected
SELECT * FROM staff WHERE role = 'Nurse';

-- Step 2: Only once you've confirmed the rows look right,
-- run the same WHERE clause with UPDATE or DELETE
UPDATE staff SET role = 'Senior Nurse' WHERE role = 'Nurse';

A bare UPDATE or DELETE with NO WHERE clause affects EVERY ROW
in the table. This is one of the most common, most damaging
mistakes in all of SQL — always double-check before running.

TRANSACTIONS — A SAFETY NET
===============================
BEGIN;

DELETE FROM staff WHERE role = 'Nurse';
SELECT * FROM staff;     -- check the result while still inside the transaction

-- If it looks wrong:
ROLLBACK;     -- undoes everything since BEGIN, as if it never happened

-- If it looks right:
COMMIT;       -- makes the changes permanent

Wrapping risky operations in BEGIN ... ROLLBACK/COMMIT gives you
a genuine undo button while you verify — use this habitually for
any UPDATE or DELETE you're not 100% certain about.
    `,

    clinicalConnection: `
A DELETE FROM patients with no WHERE clause is the database
equivalent of "discharge every patient on the ward" instead of
the one patient you meant to discharge — both are catastrophic,
both stem from skipping a specificity check before an irreversible
action. The transaction pattern (BEGIN, verify, COMMIT or
ROLLBACK) is your built-in "are you sure?" confirmation step,
exactly like a second signature required before administering a
high-risk medication.
    `,

    example: `
-- Using the staff table from the explanation above

BEGIN;

-- Give every Nurse a title update
UPDATE staff
SET role = 'Senior Nurse'
WHERE role = 'Nurse';

-- Verify before committing
SELECT staff_id, name, role FROM staff WHERE role = 'Senior Nurse';

-- Looks correct -> make it permanent
COMMIT;

-- Now safely remove a specific staff member by ID (not by name,
-- which could match more than one person)
BEGIN;

SELECT * FROM staff WHERE staff_id = 5;   -- confirm this is the right person

DELETE FROM staff WHERE staff_id = 5;

SELECT * FROM staff;                       -- confirm the result

COMMIT;
    `,

    commonMistakes: [
      "Running DELETE FROM table_name; or UPDATE table_name SET col = value; with no WHERE clause at all — this affects every single row, often catastrophically.",
      "Using a non-unique column (like a name) in the WHERE clause for DELETE/UPDATE, accidentally affecting multiple rows that share that value.",
      "Forgetting to COMMIT after a transaction, leaving changes uncommitted and invisible to other connections (and lost if the session closes).",
      "DROP TABLE-ing the wrong table by typo without IF EXISTS or a backup, with no way to undo it once committed.",
    ],

    exercises: [
      "Create a 'medications' table with at least 4 columns and appropriate types, then insert 5 rows using both single-row and multi-row INSERT syntax.",
      "Practice the SELECT-before-UPDATE discipline: write a SELECT that targets exactly 2 specific rows, confirm the output, then write the matching UPDATE.",
      "Deliberately wrap a DELETE in a transaction, verify the result with SELECT, and ROLLBACK instead of committing — confirm the data is still there afterward.",
      "Use ALTER TABLE to add a new column to an existing table, set a NOT NULL constraint on an existing column (after first ensuring no NULLs exist), and document each step.",
    ],

    resources: [
      {
        objective: "Master core SQL CRUD syntax",
        items: [
          { title: "W3Schools PostgreSQL Tutorial", url: "https://www.w3schools.com/postgresql/", type: "interactive reference", note: "Use the live editor to practice INSERT, UPDATE, DELETE, and SELECT today." },
          { title: "freeCodeCamp — PostgreSQL Full Course for Beginners", url: "https://www.youtube.com/watch?v=qw--VYLpxG4", type: "video", note: "Continue from where you left off Day 1 — covers CRUD operations in depth." },
        ],
      },
      {
        objective: "Practice CRUD operations on a realistic dataset",
        items: [
          { title: "pgexercises.com", url: "https://pgexercises.com/", type: "interactive exercises", note: "Continue daily practice — target 5+ exercises today focused on basic queries." },
          { title: "DataLemur — SQL Practice Problems", url: "https://datalemur.com/questions", type: "interactive exercises", note: "Real interview SQL questions — do at least 2 today, and 2/day for the rest of Phase 2." },
        ],
      },
      {
        objective: "Understand transactions and safe data modification",
        items: [
          { title: "PostgreSQL official docs — Transactions", url: "https://www.postgresql.org/docs/current/tutorial-transactions.html", type: "reference", note: "Official explanation of BEGIN/COMMIT/ROLLBACK and ACID properties." },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 44 — JOINs Deep Dive
  // ============================================================
  {
    id: "W9D4", week: 9, day: 4, phase: 2,
    phaseTitle: "Data Engineering Foundations",
    date: "2026-08-13",
    type: "lesson",
    topic: "JOINs Deep Dive: INNER, LEFT, RIGHT, FULL OUTER, CROSS & SELF JOIN",
    duration: "2–3 hours",

    objectives: [
      "Write INNER, LEFT, RIGHT, and FULL OUTER JOINs correctly",
      "Explain when each JOIN type produces different results on the same data",
      "Use SELF JOINs to compare rows within the same table",
      "Recognise and avoid the accidental row-multiplication ('fan-out') JOIN bug",
    ],

    introduction: `
JOINs are the single most-used SQL skill in real data work — and
the one place beginners most often produce subtly wrong numbers
without realising it. Today is about building precise intuition
for each JOIN type, using the normalised hospital schema you
designed on Day 2, so by the end you can predict exactly which
rows a JOIN will produce before you even run it.
    `,

    mentalModel: `
MENTAL MODEL — "The Multidisciplinary Team Meeting"

Picture INNER JOIN as a meeting that only includes patients who
have BOTH a pharmacist AND a physician currently assigned — anyone
missing either gets left out entirely. LEFT JOIN is a meeting that
includes EVERY patient regardless of whether they have an assigned
physician — if they don't, that seat just shows empty (NULL)
instead of excluding the patient. RIGHT JOIN is the mirror image,
anchored on the other table. FULL OUTER JOIN includes everyone
from both sides, gaps and all — nobody gets excluded just because
their counterpart record doesn't exist.
    `,

    explanation: `
SETUP — TWO RELATED TABLES
==============================
patients: patient_id, full_name
prescriptions: prescription_id, patient_id, drug_name

INNER JOIN — only matching rows from both sides
===================================================
SELECT p.full_name, pr.drug_name
FROM patients p
INNER JOIN prescriptions pr ON p.patient_id = pr.patient_id;
-- Only patients who HAVE at least one prescription appear.
-- Patients with zero prescriptions are excluded entirely.

LEFT JOIN — all rows from the left table, matched or not
=============================================================
SELECT p.full_name, pr.drug_name
FROM patients p
LEFT JOIN prescriptions pr ON p.patient_id = pr.patient_id;
-- Every patient appears at least once, even with zero
-- prescriptions — drug_name shows as NULL for those patients.
-- This is the most commonly used JOIN in real reporting, because
-- you usually don't want to silently drop rows with no match.

RIGHT JOIN — all rows from the right table, matched or not
===============================================================
SELECT p.full_name, pr.drug_name
FROM patients p
RIGHT JOIN prescriptions pr ON p.patient_id = pr.patient_id;
-- Rarely used in practice — almost always rewritten as a LEFT
-- JOIN with the table order swapped, for readability.

FULL OUTER JOIN — everything from both sides
================================================
SELECT p.full_name, pr.drug_name
FROM patients p
FULL OUTER JOIN prescriptions pr ON p.patient_id = pr.patient_id;
-- Includes patients with no prescriptions AND (hypothetically)
-- prescriptions with no matching patient — useful for finding
-- data integrity gaps on either side.

CROSS JOIN — every combination of both tables
==================================================
SELECT d.name, s.shift_time
FROM departments d
CROSS JOIN shift_times s;
-- Produces every possible department/shift combination — useful
-- for generating a full scheduling grid, rare otherwise.

SELF JOIN — comparing a table to itself
===========================================
-- Find pairs of staff in the same department
SELECT s1.name AS staff_1, s2.name AS staff_2, s1.department_id
FROM staff s1
JOIN staff s2 ON s1.department_id = s2.department_id
               AND s1.staff_id < s2.staff_id;
-- The s1.staff_id < s2.staff_id condition prevents both
-- duplicate pairs (A,B and B,A) and self-pairing (A,A).

THE "FAN-OUT" BUG — A SILENT NUMBER KILLER
===============================================
If a patient has 3 prescriptions, joining patients to
prescriptions produces 3 ROWS for that one patient — correct for
listing prescriptions, but DISASTROUS if you then try to SUM a
column from the patients table (like an admission_fee), because
that fee now gets counted 3 times instead of once. Always check:
does this JOIN multiply rows in a way that breaks my aggregation?
If so, aggregate BEFORE joining, or use a subquery/CTE instead.
    `,

    clinicalConnection: `
The "fan-out" bug is exactly the trap of joining a patients table
to a prescriptions table and then summing a per-patient field like
total_admission_cost — every extra prescription a patient has
multiplies that cost incorrectly, producing a wildly inflated
total. This is a real, common analytics bug in healthcare
reporting, and the fix (aggregate prescriptions per patient first,
THEN join) is exactly the discipline this lesson is building.
    `,

    example: `
-- Hospital schema from earlier in the week

-- 1. INNER JOIN: patients who have prescriptions, with drug names
SELECT p.full_name, pr.drug_name, pr.dose_mg
FROM patients p
INNER JOIN prescriptions pr ON p.patient_id = pr.patient_id
ORDER BY p.full_name;

-- 2. LEFT JOIN: ALL patients, including those with zero prescriptions
SELECT p.full_name, pr.drug_name
FROM patients p
LEFT JOIN prescriptions pr ON p.patient_id = pr.patient_id
ORDER BY p.full_name;
-- Patients with no prescriptions show drug_name as NULL

-- 3. Finding patients with NO prescriptions at all (a common,
--    very useful LEFT JOIN pattern)
SELECT p.full_name
FROM patients p
LEFT JOIN prescriptions pr ON p.patient_id = pr.patient_id
WHERE pr.prescription_id IS NULL;

-- 4. The fan-out trap, demonstrated and then fixed
-- WRONG: if a patient has 3 prescriptions, this triples their count
SELECT p.full_name, COUNT(*) AS row_count
FROM patients p
JOIN prescriptions pr ON p.patient_id = pr.patient_id
GROUP BY p.full_name;

-- RIGHT: aggregate prescriptions first, then join if other
-- patient columns are needed
SELECT p.full_name, pres_summary.prescription_count
FROM patients p
JOIN (
    SELECT patient_id, COUNT(*) AS prescription_count
    FROM prescriptions
    GROUP BY patient_id
) pres_summary ON p.patient_id = pres_summary.patient_id;
    `,

    commonMistakes: [
      "Using INNER JOIN when LEFT JOIN was needed, silently dropping rows that have no match — this is the single most common JOIN mistake and often goes unnoticed because the query still 'runs fine,' just with wrong, incomplete results.",
      "Summing or averaging a column from the 'one' side of a one-to-many JOIN without first aggregating the 'many' side — the classic fan-out bug.",
      "Forgetting the ON condition entirely, accidentally producing a CROSS JOIN (every row matched with every other row) instead of the intended JOIN.",
      "Using RIGHT JOIN out of habit when a LEFT JOIN with swapped table order would be clearer and more consistent with how most SQL codebases are written.",
    ],

    exercises: [
      "Using your hospital schema, write a query that lists every patient and their prescriptions using LEFT JOIN, ensuring patients with zero prescriptions still appear.",
      "Write a query to find all patients who have NEVER been prescribed a specific drug (hint: LEFT JOIN + WHERE ... IS NULL, filtered by drug_name).",
      "Deliberately reproduce the fan-out bug: join patients to prescriptions and SUM a hypothetical fee column, then fix it using a subquery that aggregates first.",
      "Write a SELF JOIN query on the staff table to find every pair of staff members who work in the same department.",
    ],

    resources: [
      {
        objective: "Build precise intuition for every JOIN type",
        items: [
          { title: "Mode Analytics SQL Tutorial — Joins", url: "https://mode.com/sql-tutorial/", type: "interactive tutorial", note: "Excellent visual, browser-based JOIN practice with real datasets — no installation needed." },
          { title: "TechTFQ YouTube — SQL Joins Explained", url: "https://www.youtube.com/c/techTFQ/playlists", type: "video", note: "Clear visual explanations of each JOIN type with worked examples." },
        ],
      },
      {
        objective: "Practice JOINs on a realistic multi-table dataset",
        items: [
          { title: "pgexercises.com — Joins section", url: "https://pgexercises.com/", type: "interactive exercises", note: "Work through the JOINs section specifically today — at least 8 exercises." },
        ],
      },
      {
        objective: "Avoid common JOIN pitfalls in real analytics",
        items: [
          { title: "Use the Index, Luke — The Join Operation", url: "https://use-the-index-luke.com/", type: "free online book", note: "Read the Join Operation chapter for a deeper understanding of how JOINs actually execute." },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 45 — Week 9 Project: Hospital Database Schema Design
  // ============================================================
  {
    id: "W9D5", week: 9, day: 5, phase: 2,
    phaseTitle: "Data Engineering Foundations",
    date: "2026-08-14",
    type: "project",
    topic: "Project: Hospital Database Schema Design (PostgreSQL)",
    duration: "3–4 hours",

    objectives: [
      "Design a complete, properly normalised multi-table hospital database schema",
      "Implement the schema in PostgreSQL with correct keys, constraints, and data types",
      "Populate it with realistic sample data",
      "Write and document a set of JOIN-based queries that answer real reporting questions",
    ],

    introduction: `
This week's project brings together Docker/PostgreSQL setup,
normalisation, CRUD, and JOINs into one cohesive deliverable: a
realistic hospital database schema, designed the way you'd
actually design one for a real client or employer. Lean directly
on your Pharm.D background here — you understand this domain
better than almost anyone building a portfolio project like this,
and that's exactly the differentiator worth showcasing.
    `,

    mentalModel: `
MENTAL MODEL — "The Hospital's Information Architecture"

A hospital's medical records department doesn't just store
papers in one giant pile — it organises information into
distinct, cross-referenced categories (patient charts, lab
results, medication orders, staff rosters) precisely so any
authorised person can find exactly what they need without sifting
through everything. Your schema today IS that information
architecture, built in SQL instead of filing cabinets.
    `,

    explanation: `
PROJECT BRIEF
================
Design and build a PostgreSQL database for a small hospital with
AT LEAST these 6 tables, properly normalised (3NF) and connected
with foreign keys:

1. departments       (department_id, name, ...)
2. staff              (staff_id, name, role, department_id FK, ...)
3. patients           (patient_id, full_name, date_of_birth,
                        department_id FK, ...)
4. patient_allergies  (allergy_id, patient_id FK, allergen,
                        severity, ...)
5. prescriptions      (prescription_id, patient_id FK,
                        prescribing_staff_id FK, drug_name,
                        dose_mg NUMERIC, prescribed_date, ...)
6. lab_results        (result_id, patient_id FK, test_name,
                        result_value NUMERIC, result_date, ...)

REQUIREMENTS
==============
1. Every table must have a PRIMARY KEY.
2. Every relationship must use a proper FOREIGN KEY constraint.
3. Use at least 2 CHECK constraints (e.g. dose_mg > 0, severity
   IN (...)).
4. Use NUMERIC (never FLOAT) for any dosage or measurement value.
5. Populate each table with at least 8-10 realistic rows (you can
   write these by hand or generate them — just make them
   plausible).
6. Write and save AT LEAST 6 queries answering real questions:
   - All patients with no allergies on file (LEFT JOIN + IS NULL)
   - All prescriptions for a specific drug, with patient names
     (INNER JOIN)
   - Every patient and the staff member who prescribed their most
     recent medication
   - Patients with more than 2 prescriptions (aggregate-then-join
     pattern from Day 4, to avoid the fan-out bug)
   - All staff in a given department alongside how many patients
     are assigned there
   - One query of your own choosing answering a question YOU find
     genuinely interesting about this data

DELIVERABLE
==============
1. A schema.sql file with all CREATE TABLE statements
2. A seed_data.sql file with all INSERT statements
3. A queries.sql file with all 6+ queries, each preceded by a
   comment explaining what question it answers
4. A README.md with an ER-diagram-style description of the
   tables and relationships (a simple text/markdown description
   is fine — a visual diagram is a nice bonus, not required)
5. Push the whole project to GitHub
    `,

    clinicalConnection: `
This project is, in miniature, exactly the kind of system that
underlies real hospital information systems (HIS) and electronic
health records platforms — the same entities (patients, staff,
prescriptions, lab results, allergies) just simplified. Building
it yourself, with your clinical background informing which
columns and constraints actually matter (why severity needs to be
constrained, why dose_mg must be precise), is a genuinely
differentiated portfolio piece most data engineering bootcamp
graduates can't produce with the same domain credibility.
    `,

    example: `
-- Skeleton showing the shape of schema.sql — extend this to all
-- 6 required tables with full constraints.

CREATE TABLE departments (
    department_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE staff (
    staff_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    role VARCHAR(50) NOT NULL,
    department_id INTEGER REFERENCES departments(department_id)
);

CREATE TABLE patients (
    patient_id SERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    date_of_birth DATE NOT NULL,
    department_id INTEGER REFERENCES departments(department_id)
);

CREATE TABLE patient_allergies (
    allergy_id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES patients(patient_id),
    allergen VARCHAR(100) NOT NULL,
    severity VARCHAR(20) NOT NULL
        CHECK (severity IN ('mild', 'moderate', 'severe'))
);

CREATE TABLE prescriptions (
    prescription_id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES patients(patient_id),
    prescribing_staff_id INTEGER REFERENCES staff(staff_id),
    drug_name VARCHAR(100) NOT NULL,
    dose_mg NUMERIC(8,2) NOT NULL CHECK (dose_mg > 0),
    prescribed_date DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE lab_results (
    result_id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES patients(patient_id),
    test_name VARCHAR(100) NOT NULL,
    result_value NUMERIC(10,2),
    result_date DATE NOT NULL DEFAULT CURRENT_DATE
);

-- Example query for queries.sql:
-- Q: Which patients have more than 2 prescriptions on file?
SELECT p.full_name, pres_count.total
FROM patients p
JOIN (
    SELECT patient_id, COUNT(*) AS total
    FROM prescriptions
    GROUP BY patient_id
    HAVING COUNT(*) > 2
) pres_count ON p.patient_id = pres_count.patient_id;
    `,

    commonMistakes: [
      "Skipping foreign key constraints to 'save time,' which removes the database-level safety net that catches orphaned or invalid references.",
      "Writing the 6 required queries without the fan-out-avoiding aggregate-then-join pattern where needed, producing subtly wrong counts.",
      "Generating obviously fake/lazy sample data (e.g. all patients named 'Test Patient 1', 'Test Patient 2') instead of plausible realistic names and values — this matters for portfolio credibility.",
      "Forgetting to actually push the project to GitHub, leaving the week's work invisible to anyone reviewing your portfolio.",
    ],

    exercises: [
      "Build the complete 6-table schema with all constraints specified in the brief, in your own schema.sql file.",
      "Write seed_data.sql with realistic sample data for every table, then load both files into your Docker PostgreSQL container and confirm everything loads without error.",
      "Write all 6 required queries in queries.sql, run each one, and confirm the results genuinely answer the stated question.",
      "Write the README.md describing your schema and relationships, then push the complete project to a new GitHub repo (e.g. UvoTheMan/hospital-db-schema).",
    ],

    resources: [
      {
        objective: "See real-world schema design patterns for reference",
        items: [
          { title: "Pagila — DVD Rental Sample Database (schema reference)", url: "https://github.com/devrimgunduz/pagila", type: "reference", note: "Study how Pagila structures its own relationships as a model for your hospital schema." },
        ],
      },
      {
        objective: "Validate constraint and data type choices",
        items: [
          { title: "PostgreSQL official docs — Data Types", url: "https://www.postgresql.org/docs/current/datatype.html", type: "reference", note: "Double-check your column type choices against the official reference before finalising schema.sql." },
        ],
      },
      {
        objective: "Write a clear project README",
        items: [
          { title: "Make a README — README guide and templates", url: "https://www.makeareadme.com/", type: "article", note: "Use this structure for documenting your schema and relationships clearly." },
        ],
      },
    ],
  },

];

if (typeof module !== "undefined") {
  module.exports = { WEEK9 };
}
