// ============================================================
// WEEK 12 — Python + Databases: SQLAlchemy, psycopg2, ORMs
// Days 56–60 | 31 August – 4 September 2026
// Phase 2: Data Engineering Foundations
// ============================================================

const WEEK12 = [

  // ============================================================
  // DAY 56 — psycopg2: Direct PostgreSQL Connections from Python
  // ============================================================
  {
    id: "W12D1", week: 12, day: 1, phase: 2,
    phaseTitle: "Data Engineering Foundations",
    date: "2026-08-31",
    type: "lesson",
    topic: "psycopg2: Direct PostgreSQL Connections, Cursors & Parameterised Queries",
    duration: "2–3 hours",

    objectives: [
      "Connect to PostgreSQL from Python using psycopg2",
      "Execute queries safely using cursors and parameterised queries",
      "Correctly commit, rollback, and close connections",
      "Recognise and prevent SQL injection by always parameterising user input",
    ],

    introduction: `
You've spent three weeks getting fluent inside psql directly.
Starting today, Python becomes the layer that ORCHESTRATES your
database work — every ETL pipeline, every Airflow DAG, every
FastAPI backend ahead of you talks to PostgreSQL through Python
code, not a human typing at a terminal. psycopg2 is the most
direct, lowest-level way to do this, and understanding it first
makes SQLAlchemy (starting tomorrow) much easier to reason about,
since SQLAlchemy is ultimately built on top of drivers like this.
    `,

    mentalModel: `
MENTAL MODEL — "The Direct Phone Line vs the Hospital Switchboard"

psycopg2 is a direct phone line straight to the database — you
dial the exact number (connection string), say exactly what you
want in the database's own language (raw SQL strings), and get a
raw response back. SQLAlchemy, which you'll learn tomorrow, is
more like a hospital switchboard operator who can translate your
request into different department languages, manage multiple
ongoing calls (connection pooling) for you, and let you describe
what you want in friendlier, structured terms. Both reach the
same destination — today is about understanding the direct line
first.
    `,

    explanation: `
INSTALLING AND CONNECTING
==============================
pip install psycopg2-binary

import psycopg2

conn = psycopg2.connect(
    host="localhost",
    port=5432,
    dbname="hospital_practice",
    user="victor",
    password="practice123"
)

Never hardcode credentials directly in source code — load them
from environment variables, exactly as you did with the Claude
API key in Phase 1:

import os
conn = psycopg2.connect(
    host=os.environ.get("DB_HOST", "localhost"),
    port=os.environ.get("DB_PORT", 5432),
    dbname=os.environ.get("DB_NAME"),
    user=os.environ.get("DB_USER"),
    password=os.environ.get("DB_PASSWORD"),
)

CURSORS — EXECUTING QUERIES
================================
cur = conn.cursor()

cur.execute("SELECT patient_id, full_name FROM patients LIMIT 5;")
rows = cur.fetchall()      # returns a list of tuples
for row in rows:
    print(row)

cur.fetchone()    # returns just the next single row, or None
cur.fetchmany(3)  # returns up to 3 rows at a time

cur.close()
conn.close()

PARAMETERISED QUERIES — THE SQL INJECTION DEFENCE
======================================================
-- NEVER do this — building SQL with string formatting is a
-- serious security vulnerability:
patient_name = "Bello"
cur.execute(f"SELECT * FROM patients WHERE full_name = '{patient_name}'")
# If patient_name came from user input, someone could inject:
# Bello'; DROP TABLE patients; --

-- ALWAYS do this instead — let psycopg2 safely substitute values:
cur.execute(
    "SELECT * FROM patients WHERE full_name = %s",
    (patient_name,)
)

The %s placeholder and the tuple of values let psycopg2 properly
escape the input, making injection structurally impossible rather
than just "unlikely." This is non-negotiable in any real
application accepting external input.

INSERT, COMMIT, AND ROLLBACK
=================================
cur.execute(
    "INSERT INTO patients (full_name, date_of_birth) VALUES (%s, %s)",
    ("Amaka Obi", "1990-05-14")
)
conn.commit()     # makes the INSERT permanent

If something goes wrong before commit:
conn.rollback()    # undoes everything since the last commit

USING A CONTEXT MANAGER (THE SAFER PATTERN)
================================================
with psycopg2.connect(...) as conn:
    with conn.cursor() as cur:
        cur.execute("SELECT * FROM patients LIMIT 5;")
        rows = cur.fetchall()
# Connection and cursor are automatically closed, and the
# transaction is automatically committed if no exception occurred
# (or rolled back if one did) — this is the recommended pattern
# for real code rather than manual commit()/close() calls.
    `,

    clinicalConnection: `
SQL injection via unparameterised queries is the technical
equivalent of letting a patient's free-text intake form directly
alter the hospital's medication formulary just by typing
something unexpected into the "reason for visit" field — input
meant to be DATA must never be allowed to become EXECUTABLE
INSTRUCTIONS. Parameterised queries enforce that separation at
the database driver level, the same way structured form fields
prevent free text from corrupting structured clinical data.
    `,

    example: `
import os
import psycopg2

def get_connection():
    '''Create and return a new PostgreSQL connection using env vars.'''
    return psycopg2.connect(
        host=os.environ.get("DB_HOST", "localhost"),
        port=os.environ.get("DB_PORT", 5432),
        dbname=os.environ.get("DB_NAME", "hospital_practice"),
        user=os.environ.get("DB_USER", "victor"),
        password=os.environ.get("DB_PASSWORD", "practice123"),
    )


def find_patients_by_department(department_name: str) -> list[tuple]:
    '''Return all patients in a given department, safely parameterised.'''
    query = """
        SELECT p.full_name, p.date_of_birth
        FROM patients p
        JOIN departments d ON p.department_id = d.department_id
        WHERE d.name = %s
        ORDER BY p.full_name;
    """
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(query, (department_name,))
            return cur.fetchall()


def add_patient(full_name: str, date_of_birth: str, department_id: int) -> None:
    '''Insert a new patient record, committing only if successful.'''
    query = """
        INSERT INTO patients (full_name, date_of_birth, department_id)
        VALUES (%s, %s, %s);
    """
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(query, (full_name, date_of_birth, department_id))
        conn.commit()


if __name__ == "__main__":
    patients = find_patients_by_department("Cardiology")
    for name, dob in patients:
        print(f"{name} (DOB: {dob})")
    `,

    commonMistakes: [
      "Building SQL queries with f-strings or % string formatting instead of parameterised %s placeholders — this is a genuine, serious SQL injection vulnerability, not just bad style.",
      "Forgetting conn.commit() after an INSERT/UPDATE/DELETE, leaving changes invisible to other connections and lost when the connection closes.",
      "Hardcoding database credentials directly in source code instead of loading them from environment variables.",
      "Not closing connections/cursors explicitly (or using the context manager pattern), leading to connection leaks in longer-running applications.",
    ],

    exercises: [
      "Write a function using psycopg2 that connects to your hospital database and returns all prescriptions for a given drug name, using a parameterised query.",
      "Write a function that inserts a new lab result, using parameterised values, and properly commits the transaction.",
      "Deliberately write an UNSAFE query using f-string formatting with a value like \"Bello'; DROP TABLE patients; --\" in a SAFE test environment, observe what happens conceptually (do not actually run the DROP), then rewrite it safely with parameterisation.",
      "Refactor all your database connection code to use the context manager (with) pattern instead of manual open/close/commit calls.",
    ],

    resources: [
      {
        objective: "Connect to PostgreSQL from Python and execute queries safely",
        items: [
          { title: "psycopg2 official documentation", url: "https://www.psycopg.org/docs/", type: "reference", note: "Official reference for connections, cursors, and parameter handling." },
          { title: "Real Python — PostgreSQL and Python: A Practical Introduction", url: "https://realpython.com/python-postgresql/", type: "article", note: "Hands-on introduction to psycopg2 with realistic examples." },
        ],
      },
      {
        objective: "Understand and prevent SQL injection",
        items: [
          { title: "OWASP — SQL Injection Prevention Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html", type: "reference", note: "Authoritative security reference on parameterised queries and injection prevention." },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 57 — SQLAlchemy Core: Engines, Connections, Queries
  // ============================================================
  {
    id: "W12D2", week: 12, day: 2, phase: 2,
    phaseTitle: "Data Engineering Foundations",
    date: "2026-09-01",
    type: "lesson",
    topic: "SQLAlchemy Core: create_engine, Connections & Executing Queries",
    duration: "2–3 hours",

    objectives: [
      "Create and configure a SQLAlchemy engine with a proper connection string",
      "Execute raw and SQLAlchemy-constructed queries through an engine",
      "Understand connection pooling and why it matters at scale",
      "Use SQLAlchemy alongside pandas for quick data loading",
    ],

    introduction: `
SQLAlchemy is the standard Python library for working with
relational databases — used constantly throughout this phase and
into Phase 2's pandas-heavy pipelines ahead. Today covers
SQLAlchemy Core: the lower-level, SQL-expression-oriented layer.
Tomorrow you'll layer the ORM on top. Most real pipeline and
ETL code (today's topic) uses Core directly; the ORM (tomorrow)
shines more for application-style code with complex object
relationships.
    `,

    mentalModel: `
MENTAL MODEL — "The Universal Adapter, Not Just One Brand's Charger"

psycopg2 only speaks PostgreSQL. SQLAlchemy is a universal
adapter — the same code patterns work whether the database behind
it is PostgreSQL, MySQL, SQLite, or others, because SQLAlchemy
abstracts away the database-specific details behind a consistent
interface. It also manages a POOL of ready, reusable connections
behind the scenes — like a hospital keeping several phone lines
already open and ready, rather than dialling a brand-new call for
every single request.
    `,

    explanation: `
INSTALLING AND CREATING AN ENGINE
======================================
pip install sqlalchemy psycopg2-binary

from sqlalchemy import create_engine

engine = create_engine(
    "postgresql+psycopg2://victor:practice123@localhost:5432/hospital_practice"
)

Connection string format:
dialect+driver://username:password@host:port/database

Load credentials from environment variables in real code:
import os
from sqlalchemy import create_engine

db_url = (
    f"postgresql+psycopg2://{os.environ['DB_USER']}:"
    f"{os.environ['DB_PASSWORD']}@{os.environ['DB_HOST']}:"
    f"{os.environ.get('DB_PORT', 5432)}/{os.environ['DB_NAME']}"
)
engine = create_engine(db_url)

EXECUTING QUERIES WITH THE ENGINE
======================================
from sqlalchemy import text

with engine.connect() as conn:
    result = conn.execute(
        text("SELECT full_name FROM patients WHERE department_id = :dept_id"),
        {"dept_id": 2}
    )
    for row in result:
        print(row.full_name)

text() wraps a raw SQL string, and named parameters (:dept_id)
work the same protective way %s placeholders did in psycopg2 —
SQLAlchemy handles the safe substitution.

CONNECTION POOLING
======================
engine = create_engine(db_url, pool_size=5, max_overflow=10)

pool_size: how many connections to keep open and ready
max_overflow: how many EXTRA temporary connections are allowed
              during traffic spikes beyond pool_size

You rarely need to tune these manually as a beginner — the
defaults are sensible — but understanding that the engine manages
a POOL (not a single connection) explains why SQLAlchemy code
performs well even under many simultaneous requests, which matters
once you build the FastAPI services in Phase 5.

SQLALCHEMY + PANDAS — THE COMBINATION YOU'LL USE CONSTANTLY
==================================================================
import pandas as pd

# Reading data straight into a DataFrame
df = pd.read_sql("SELECT * FROM patients", engine)

# Writing a DataFrame to a new or existing table
df.to_sql("patients_backup", engine, if_exists="replace", index=False)

if_exists options:
  "fail"     -- raise an error if the table already exists
  "replace"  -- drop and recreate the table (careful in production!)
  "append"   -- add rows to an existing table without dropping it

This pandas + SQLAlchemy combination is the exact pattern you'll
use constantly starting next week's ETL pipelines: extract with
pandas, transform with pandas, load with df.to_sql().
    `,

    clinicalConnection: `
Connection pooling is conceptually similar to a busy hospital
intake desk keeping several staff members on standby rather than
hiring and training a brand-new clerk for every single new
patient that walks in — the overhead of "ramping up" a fresh
resource for every request is wasteful when you can keep a
reasonable number ready and reuse them as patients (or, here,
queries) come and go.
    `,

    example: `
import os
import pandas as pd
from sqlalchemy import create_engine, text

db_url = (
    f"postgresql+psycopg2://{os.environ.get('DB_USER', 'victor')}:"
    f"{os.environ.get('DB_PASSWORD', 'practice123')}@"
    f"{os.environ.get('DB_HOST', 'localhost')}:5432/hospital_practice"
)
engine = create_engine(db_url)

# 1. Raw query via the engine, with named parameters
with engine.connect() as conn:
    result = conn.execute(
        text("""
            SELECT full_name, date_of_birth
            FROM patients
            WHERE department_id = :dept_id
        """),
        {"dept_id": 2}
    )
    for row in result:
        print(row.full_name, row.date_of_birth)

# 2. Reading directly into a pandas DataFrame
patients_df = pd.read_sql("SELECT * FROM patients", engine)
print(patients_df.head())
print(f"Loaded {len(patients_df)} patients")

# 3. A quick transformation, then writing back to a new table
recent_df = patients_df[patients_df["date_of_birth"] > "1990-01-01"]
recent_df.to_sql("recent_patients", engine, if_exists="replace", index=False)
print(f"Wrote {len(recent_df)} rows to recent_patients table")
    `,

    commonMistakes: [
      "Hardcoding the full connection string with real credentials directly in source code, rather than building it from environment variables.",
      "Using if_exists='replace' on a production table without realising it DROPS the existing table entirely before recreating it — devastating if used carelessly.",
      "Forgetting that text() queries need named parameters (:name) in a dictionary, not positional %s placeholders like psycopg2 used yesterday — mixing the two styles causes errors.",
      "Opening a new engine (create_engine call) repeatedly inside a loop or function instead of creating it once and reusing it — engines are meant to be created once and shared.",
    ],

    exercises: [
      "Create a SQLAlchemy engine connected to your hospital database, and run a raw text() query with at least one named parameter.",
      "Use pd.read_sql() to load an entire table into a DataFrame, then print its shape and dtypes.",
      "Perform a simple pandas transformation on that DataFrame, then write the result to a new table using df.to_sql() with if_exists='replace'.",
      "Write a short comment explaining, in your own words, what connection pooling is and why it matters for an application serving many users.",
    ],

    resources: [
      {
        objective: "Learn SQLAlchemy Core fundamentals",
        items: [
          { title: "Real Python — Python + SQLAlchemy Tutorial", url: "https://realpython.com/python-sqlalchemy/", type: "article", note: "Thorough coverage of create_engine(), executing queries, and pandas integration." },
          { title: "SQLAlchemy Official Docs — Engine Configuration", url: "https://docs.sqlalchemy.org/en/20/core/engines.html", type: "reference", note: "Bookmark this — your reference for connection strings and pooling configuration." },
        ],
      },
      {
        objective: "Combine SQLAlchemy with pandas for data loading",
        items: [
          { title: "Medium — Beginner-Friendly ETL Pipeline Guide (Python)", url: "https://medium.com/@simranduggal75/beginner-friendly-etl-pipeline-guide-with-python-7968ec8289a4", type: "article", note: "Shows the exact pandas + SQLAlchemy load pattern you'll use throughout Phase 2." },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 58 — SQLAlchemy ORM: Models, Sessions & Relationships
  // ============================================================
  {
    id: "W12D3", week: 12, day: 3, phase: 2,
    phaseTitle: "Data Engineering Foundations",
    date: "2026-09-02",
    type: "lesson",
    topic: "SQLAlchemy ORM: Declarative Models, Sessions & Relationships",
    duration: "2–3 hours",

    objectives: [
      "Define database tables as Python classes using the SQLAlchemy ORM",
      "Use a Session to query, add, and commit ORM objects",
      "Define relationships between models and navigate them in Python",
      "Decide when the ORM is the right tool versus SQLAlchemy Core or raw SQL",
    ],

    introduction: `
The ORM (Object-Relational Mapper) lets you work with database
rows as if they were ordinary Python objects — a Patient class
instance instead of a raw tuple of values. This is the dominant
pattern in Python web frameworks and application code (you'll see
this again in Phase 5 with FastAPI). Today builds directly on
your Week 3 OOP skills from Phase 1 — classes, attributes, and
now, relationships between them backed by real database tables.
    `,

    mentalModel: `
MENTAL MODEL — "The Patient Object IS the Patient Record"

With raw SQL or Core, a patient is just a row — a tuple of values
you manually unpack. With the ORM, a patient becomes a genuine
Python object: patient.full_name, patient.prescriptions (a list
of related Prescription objects), patient.department.name —
navigable, attribute-based access that mirrors how you'd naturally
think about a patient's chart, rather than how the data happens
to be stored in tables.
    `,

    explanation: `
DEFINING MODELS (DECLARATIVE STYLE)
========================================
from sqlalchemy import create_engine, Column, Integer, String, Date, ForeignKey, Numeric
from sqlalchemy.orm import declarative_base, relationship, Session

Base = declarative_base()

class Department(Base):
    __tablename__ = "departments"
    department_id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False, unique=True)
    patients = relationship("Patient", back_populates="department")


class Patient(Base):
    __tablename__ = "patients"
    patient_id = Column(Integer, primary_key=True)
    full_name = Column(String(150), nullable=False)
    date_of_birth = Column(Date, nullable=False)
    department_id = Column(Integer, ForeignKey("departments.department_id"))
    department = relationship("Department", back_populates="patients")
    prescriptions = relationship("Prescription", back_populates="patient")


class Prescription(Base):
    __tablename__ = "prescriptions"
    prescription_id = Column(Integer, primary_key=True)
    patient_id = Column(Integer, ForeignKey("patients.patient_id"))
    drug_name = Column(String(100), nullable=False)
    dose_mg = Column(Numeric(8, 2), nullable=False)
    patient = relationship("Patient", back_populates="prescriptions")

This maps directly onto the CREATE TABLE statements you wrote by
hand in Week 9 — but now exists as Python classes you can import
and use throughout your codebase.

CREATING TABLES FROM MODELS
================================
engine = create_engine("postgresql+psycopg2://victor:practice123@localhost:5432/hospital_practice")
Base.metadata.create_all(engine)
-- Creates all tables defined above that don't already exist.
-- Does NOT alter existing tables — for schema changes on
-- existing tables, a migration tool like Alembic is the real
-- production answer (beyond this week's scope, but worth knowing
-- by name).

USING A SESSION — QUERYING AND MODIFYING DATA
===================================================
session = Session(engine)

# Query all patients in a department
cardiology_patients = (
    session.query(Patient)
    .join(Department)
    .filter(Department.name == "Cardiology")
    .all()
)
for p in cardiology_patients:
    print(p.full_name, p.department.name)

# Add a new patient
new_patient = Patient(
    full_name="Chidi Eze",
    date_of_birth="1985-03-22",
    department_id=1,
)
session.add(new_patient)
session.commit()

# Navigate relationships naturally, as Python attributes
patient = session.query(Patient).filter_by(full_name="Chidi Eze").first()
for prescription in patient.prescriptions:
    print(prescription.drug_name, prescription.dose_mg)

session.close()

ORM vs CORE vs RAW SQL — WHEN TO USE EACH
================================================
Raw SQL / psycopg2: maximum control, best for highly tuned,
performance-critical queries, or when you're more comfortable
thinking directly in SQL.

SQLAlchemy Core: a middle ground — SQL-expression-oriented but
database-agnostic; the dominant choice for ETL pipelines and data
engineering scripts (yesterday's lesson).

SQLAlchemy ORM: best for application code with rich object
relationships you'll navigate repeatedly (e.g. a web backend) —
less common in pure data engineering pipeline code, but essential
to know since most Python web frameworks lean on it heavily.
    `,

    clinicalConnection: `
patient.prescriptions returning a navigable list of Prescription
objects mirrors exactly how a clinician thinks about a chart —
"show me THIS patient's medications" — rather than the
database's actual underlying structure of separate tables joined
by a foreign key. The ORM's whole value proposition is letting
your code read the way a clinician (or any domain expert) already
thinks about the data.
    `,

    example: `
from sqlalchemy import create_engine, Column, Integer, String, Date, ForeignKey, Numeric
from sqlalchemy.orm import declarative_base, relationship, Session

Base = declarative_base()


class Department(Base):
    __tablename__ = "departments"
    department_id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False, unique=True)
    patients = relationship("Patient", back_populates="department")


class Patient(Base):
    __tablename__ = "patients"
    patient_id = Column(Integer, primary_key=True)
    full_name = Column(String(150), nullable=False)
    date_of_birth = Column(Date, nullable=False)
    department_id = Column(Integer, ForeignKey("departments.department_id"))
    department = relationship("Department", back_populates="patients")
    prescriptions = relationship("Prescription", back_populates="patient")


class Prescription(Base):
    __tablename__ = "prescriptions"
    prescription_id = Column(Integer, primary_key=True)
    patient_id = Column(Integer, ForeignKey("patients.patient_id"))
    drug_name = Column(String(100), nullable=False)
    dose_mg = Column(Numeric(8, 2), nullable=False)
    patient = relationship("Patient", back_populates="prescriptions")


engine = create_engine(
    "postgresql+psycopg2://victor:practice123@localhost:5432/hospital_practice"
)
Base.metadata.create_all(engine)

session = Session(engine)

# Add a department and a patient with a prescription, all as objects
cardiology = Department(name="Cardiology")
session.add(cardiology)
session.commit()

patient = Patient(
    full_name="Ngozi Adeyemi",
    date_of_birth="1978-11-02",
    department_id=cardiology.department_id,
)
session.add(patient)
session.commit()

prescription = Prescription(
    patient_id=patient.patient_id,
    drug_name="Lisinopril",
    dose_mg=10.00,
)
session.add(prescription)
session.commit()

# Now navigate the relationships naturally
loaded_patient = session.query(Patient).filter_by(full_name="Ngozi Adeyemi").first()
print(f"{loaded_patient.full_name} is in {loaded_patient.department.name}")
for rx in loaded_patient.prescriptions:
    print(f"  - {rx.drug_name}: {rx.dose_mg}mg")

session.close()
    `,

    commonMistakes: [
      "Forgetting back_populates on both sides of a relationship, breaking the bidirectional navigation between related models.",
      "Calling Base.metadata.create_all() expecting it to ALTER existing tables to match model changes — it only creates tables that don't already exist; real schema changes need a migration tool like Alembic.",
      "Not closing or properly scoping sessions, leading to stale data being read or connections being held open longer than necessary.",
      "Reaching for the ORM for a heavy bulk-loading ETL task where SQLAlchemy Core or pandas df.to_sql() would be dramatically more efficient — the ORM's per-object overhead matters at scale.",
    ],

    exercises: [
      "Define the Department, Patient, and Prescription ORM models exactly as shown, and run Base.metadata.create_all() against a fresh test database.",
      "Add at least 2 departments, 3 patients, and 4 prescriptions using ORM objects and session.add()/commit().",
      "Write a query using session.query() with a JOIN and filter to find all patients in a specific department, then print each patient's prescriptions by navigating the relationship.",
      "Write 2-3 sentences explaining, in your own words, when you'd choose the ORM versus SQLAlchemy Core for a given task.",
    ],

    resources: [
      {
        objective: "Learn the SQLAlchemy ORM from the ground up",
        items: [
          { title: "SQLAlchemy Official Docs — ORM Quick Start", url: "https://docs.sqlalchemy.org/en/20/orm/quickstart.html", type: "reference", note: "Official, concise introduction to declarative models and sessions in modern SQLAlchemy (2.0 style)." },
          { title: "Real Python — Python + SQLAlchemy Tutorial", url: "https://realpython.com/python-sqlalchemy/", type: "article", note: "Covers both Core and ORM approaches with clear comparisons." },
        ],
      },
      {
        objective: "Understand when to use the ORM versus Core/raw SQL",
        items: [
          { title: "Airbyte — How to Build an ETL Pipeline in Python", url: "https://airbyte.com/data-engineering-resources/python-etl", type: "article", note: "Discusses tool tradeoffs including where the ORM fits (or doesn't) in pipeline code." },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 59 — pandas + SQLAlchemy: Bulk Loading Patterns
  // ============================================================
  {
    id: "W12D4", week: 12, day: 4, phase: 2,
    phaseTitle: "Data Engineering Foundations",
    date: "2026-09-03",
    type: "lesson",
    topic: "pandas + SQLAlchemy: Bulk Loading Patterns, Chunking & Upserts",
    duration: "2–3 hours",

    objectives: [
      "Load large datasets efficiently using chunked df.to_sql() calls",
      "Choose appropriate if_exists strategies for different loading scenarios",
      "Implement a basic upsert pattern (insert-or-update) in PostgreSQL",
      "Validate data before loading to catch problems early",
    ],

    introduction: `
Yesterday's ORM example added a handful of rows one at a time —
fine for application code, completely impractical for loading
10,000 rows of CSV data. Today is about the actual bulk-loading
patterns real data engineering pipelines use, directly setting up
next week's ETL project. This is where pandas, SQLAlchemy, and
PostgreSQL come together into the pattern you'll repeat
constantly for the rest of Phase 2.
    `,

    mentalModel: `
MENTAL MODEL — "Batch Processing the Lab Queue, Not One Sample at a Time"

Processing 10,000 lab samples one at a time, fully resetting
equipment between each, would be absurd — real labs batch process
in efficient groups. Chunked bulk loading is the same idea: instead
of 10,000 individual INSERT statements (each with its own network
round-trip overhead), you send the data in efficient batches —
dramatically faster, and far less likely to overwhelm the database
connection.
    `,

    explanation: `
BASIC BULK LOAD WITH to_sql()
==================================
import pandas as pd
from sqlalchemy import create_engine

engine = create_engine("postgresql+psycopg2://victor:practice123@localhost:5432/hospital_practice")

df = pd.read_csv("new_patients.csv")
df.to_sql("patients", engine, if_exists="append", index=False)

For small-to-medium datasets (tens of thousands of rows), this
single line is often good enough. For genuinely large datasets,
chunking matters.

CHUNKED LOADING FOR LARGE DATASETS
========================================
df.to_sql(
    "patients",
    engine,
    if_exists="append",
    index=False,
    chunksize=1000,        # send 1000 rows per batch
    method="multi",         # batches multiple rows per INSERT statement
)

chunksize controls how many rows are sent per round-trip.
method="multi" batches multiple rows into a single INSERT
statement instead of one INSERT per row — this can be dramatically
faster for large loads, though the ideal chunksize varies by
dataset and database configuration.

VALIDATING DATA BEFORE LOADING
===================================
Always validate before writing to the database — catching bad
data here is far cheaper than catching it after it's already
corrupted a production table:

def validate_patients_df(df: pd.DataFrame) -> None:
    '''Raise an error if the DataFrame fails basic sanity checks.'''
    if df["full_name"].isnull().any():
        raise ValueError("Found null full_name values — cannot load")
    if (df["date_of_birth"] > pd.Timestamp.now()).any():
        raise ValueError("Found future date_of_birth values — likely bad data")
    if df.duplicated(subset=["full_name", "date_of_birth"]).any():
        raise ValueError("Found duplicate patient records")

df = pd.read_csv("new_patients.csv")
validate_patients_df(df)     # raises before any database write happens
df.to_sql("patients", engine, if_exists="append", index=False)

UPSERT PATTERN — INSERT OR UPDATE
======================================
pandas' to_sql() does not natively support upserts (insert if new,
update if existing) — for that, you typically load into a TEMPORARY
staging table, then use PostgreSQL's native ON CONFLICT clause:

-- 1. Load into a staging table first
df.to_sql("patients_staging", engine, if_exists="replace", index=False)

-- 2. Then merge into the real table using raw SQL
from sqlalchemy import text

upsert_query = text("""
    INSERT INTO patients (patient_id, full_name, date_of_birth, department_id)
    SELECT patient_id, full_name, date_of_birth, department_id
    FROM patients_staging
    ON CONFLICT (patient_id)
    DO UPDATE SET
        full_name = EXCLUDED.full_name,
        date_of_birth = EXCLUDED.date_of_birth,
        department_id = EXCLUDED.department_id;
""")

with engine.connect() as conn:
    conn.execute(upsert_query)
    conn.commit()

ON CONFLICT (patient_id) DO UPDATE is PostgreSQL's native upsert
mechanism — if a row with that primary key already exists, it
updates instead of erroring; otherwise it inserts normally.
EXCLUDED refers to the row that WOULD have been inserted.

IDEMPOTENCY — A CORE DATA ENGINEERING PRINCIPLE
=====================================================
A pipeline is "idempotent" if running it multiple times produces
the same end result as running it once — critical for pipelines
that might be re-run after a failure. The upsert pattern above is
naturally idempotent: re-running it with the same data doesn't
create duplicates, it just updates existing rows to the same
values. A naive repeated append (if_exists="append") is NOT
idempotent — running it twice doubles your data.
    `,

    clinicalConnection: `
The upsert pattern mirrors exactly how a hospital's patient master
index should behave when reconciling records from multiple
sources — if a patient record already exists, you update it with
the newest information rather than creating a duplicate "ghost"
patient record, a real and serious problem in healthcare data
systems (duplicate patient records can cause genuinely dangerous
care fragmentation).
    `,

    example: `
import pandas as pd
from sqlalchemy import create_engine, text

engine = create_engine(
    "postgresql+psycopg2://victor:practice123@localhost:5432/hospital_practice"
)


def validate_lab_results_df(df: pd.DataFrame) -> None:
    '''Basic sanity checks before loading lab results.'''
    if df["patient_id"].isnull().any():
        raise ValueError("Found null patient_id — cannot load")
    if (df["result_value"] < 0).any():
        raise ValueError("Found negative result_value — likely bad data")


def load_lab_results(csv_path: str) -> None:
    '''Validate, then bulk-load lab results from a CSV into PostgreSQL.'''
    df = pd.read_csv(csv_path)
    validate_lab_results_df(df)

    df.to_sql(
        "lab_results",
        engine,
        if_exists="append",
        index=False,
        chunksize=500,
        method="multi",
    )
    print(f"Loaded {len(df)} lab results successfully")


def upsert_patients(csv_path: str) -> None:
    '''Idempotent insert-or-update of patient records from a CSV.'''
    df = pd.read_csv(csv_path)
    df.to_sql("patients_staging", engine, if_exists="replace", index=False)

    upsert_query = text("""
        INSERT INTO patients (patient_id, full_name, date_of_birth, department_id)
        SELECT patient_id, full_name, date_of_birth, department_id
        FROM patients_staging
        ON CONFLICT (patient_id)
        DO UPDATE SET
            full_name = EXCLUDED.full_name,
            date_of_birth = EXCLUDED.date_of_birth,
            department_id = EXCLUDED.department_id;
    """)
    with engine.connect() as conn:
        conn.execute(upsert_query)
        conn.commit()
    print("Upsert completed successfully")


if __name__ == "__main__":
    load_lab_results("new_lab_results.csv")
    upsert_patients("patient_updates.csv")
    `,

    commonMistakes: [
      "Loading large datasets with the default to_sql() settings (no chunksize/method) and being surprised by how slow it is — these defaults are fine for small data, not for tens of thousands of rows.",
      "Re-running an if_exists='append' load without any deduplication or upsert logic, silently doubling (or worse) the data on every re-run — not idempotent.",
      "Skipping validation before loading, allowing bad data (nulls, future dates, negative values) to corrupt a production table.",
      "Forgetting that ON CONFLICT requires the conflicting column to actually have a UNIQUE or PRIMARY KEY constraint — without one, PostgreSQL has nothing to detect the conflict against.",
    ],

    exercises: [
      "Generate a CSV of 1,000+ synthetic lab results (using numpy/pandas, similar to Week 7) and bulk-load it using chunked to_sql() with method='multi'. Time the load.",
      "Write a validate_*_df() function for one of your hospital tables with at least 3 distinct checks, and demonstrate it raising an error on deliberately bad sample data.",
      "Implement the staging-table + ON CONFLICT upsert pattern for your patients table, and prove it's idempotent by running it twice with the same data and confirming no duplicates result.",
      "Write 2-3 sentences explaining, in your own words, why idempotency matters for a pipeline that might fail partway through and need to be re-run.",
    ],

    resources: [
      {
        objective: "Master efficient bulk loading with pandas and SQLAlchemy",
        items: [
          { title: "pandas official docs — to_sql()", url: "https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.to_sql.html", type: "reference", note: "Official reference covering chunksize, method, and if_exists options in detail." },
          { title: "Airbyte — How to Build an ETL Pipeline in Python", url: "https://airbyte.com/data-engineering-resources/python-etl", type: "article", note: "Covers loading patterns and scaling considerations beyond basic to_sql() calls." },
        ],
      },
      {
        objective: "Implement upsert patterns in PostgreSQL",
        items: [
          { title: "PostgreSQL official docs — INSERT ... ON CONFLICT", url: "https://www.postgresql.org/docs/current/sql-insert.html#SQL-ON-CONFLICT", type: "reference", note: "Official syntax reference for PostgreSQL's native upsert mechanism." },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 60 — Week 12 Project: Python → PostgreSQL Data Loader
  // ============================================================
  {
    id: "W12D5", week: 12, day: 5, phase: 2,
    phaseTitle: "Data Engineering Foundations",
    date: "2026-09-04",
    type: "project",
    topic: "Project: Python → PostgreSQL Data Loader",
    duration: "3–4 hours",

    objectives: [
      "Build a complete, reusable, idempotent CSV-to-PostgreSQL loader tool",
      "Combine psycopg2, SQLAlchemy, and pandas appropriately for different parts of the tool",
      "Implement validation, chunked loading, and upsert logic together",
      "Produce a well-documented, portfolio-ready data engineering tool",
    ],

    introduction: `
This week's project is your first genuine data engineering TOOL —
not a one-off script, but a reusable loader other people (or
future-you, on a different dataset) could actually run against
new CSV files. This directly sets up next week's full ETL
pipeline project, where this loader becomes the "Load" step of a
complete Extract-Transform-Load system.
    `,

    mentalModel: `
MENTAL MODEL — "The Hospital's Standard Intake Protocol"

A good hospital intake protocol doesn't change every time a new
patient walks in — it's a standardised, repeatable process that
validates information, checks for existing records, and updates
the system consistently regardless of who's running it that day.
Your data loader today should have that same quality: a
consistent, validated, repeatable protocol for getting new data
into the database safely, usable by anyone, not a one-off script
tailored to today's specific dataset.
    `,

    explanation: `
PROJECT BRIEF
================
Build a command-line Python tool, "PG Data Loader," with this
structure:

1. CONFIGURATION (config.py)
   - Database connection details loaded from environment variables
   - A SQLAlchemy engine created once and reused

2. VALIDATION (validate.py)
   - A validate_dataframe() function accepting a DataFrame and a
     list of validation rules (e.g. required columns, no nulls in
     specified columns, value ranges)
   - Raises clear, specific errors describing exactly what failed

3. LOADING (load.py)
   - A load_csv_to_table() function that:
     a. Reads a CSV into a DataFrame
     b. Validates it using validate.py
     c. Loads it using chunked df.to_sql() for new data, OR
     d. Performs an upsert (staging table + ON CONFLICT) if a
        primary key column is specified
   - Logs (using Python's logging module, not print statements)
     how many rows were loaded/updated and how long it took

4. CLI ENTRY POINT (main.py)
   - Accepts command-line arguments: CSV path, target table name,
     and an optional --upsert flag with a key column
   - Example usage:
     python main.py --csv new_patients.csv --table patients --upsert patient_id

5. ERROR HANDLING
   - If validation fails, the tool should exit cleanly with a
     clear error message — NOT a raw Python traceback dumped on
     a user
   - If the database connection fails, the same applies

6. TESTING
   - At least 4 pytest tests: one for validation success, one for
     validation failure, one for a successful load (against a
     test database or table), and one for the upsert logic

DELIVERABLE
==============
1. The complete tool (config.py, validate.py, load.py, main.py)
2. A tests/ folder with your pytest tests
3. A README.md explaining what the tool does, how to run it, and
   example usage with sample output
4. Push to GitHub as a clean, standalone repository
    `,

    clinicalConnection: `
This loader mirrors exactly the kind of integration tooling
hospital IT and informatics teams build to reconcile data feeds
from different systems — lab equipment exports, pharmacy system
updates, admissions records — into a central database, with
validation gates specifically designed to catch the kind of bad
data that, in a clinical context, could otherwise propagate into
systems clinicians rely on for real decisions.
    `,

    example: `
# Project skeleton — extend this to the full required structure.

# ── config.py ──
import os
from sqlalchemy import create_engine

def get_engine():
    db_url = (
        f"postgresql+psycopg2://{os.environ['DB_USER']}:"
        f"{os.environ['DB_PASSWORD']}@{os.environ.get('DB_HOST', 'localhost')}:"
        f"{os.environ.get('DB_PORT', 5432)}/{os.environ['DB_NAME']}"
    )
    return create_engine(db_url)


# ── validate.py ──
import pandas as pd

class ValidationError(Exception):
    pass

def validate_dataframe(df: pd.DataFrame, required_columns: list[str],
                        no_null_columns: list[str]) -> None:
    missing = set(required_columns) - set(df.columns)
    if missing:
        raise ValidationError(f"Missing required columns: {missing}")
    for col in no_null_columns:
        if df[col].isnull().any():
            raise ValidationError(f"Column '{col}' contains null values")


# ── load.py ──
import time
import logging
import pandas as pd
from validate import validate_dataframe, ValidationError

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def load_csv_to_table(engine, csv_path: str, table_name: str,
                        required_columns: list[str],
                        no_null_columns: list[str],
                        upsert_key: str = None) -> None:
    start = time.time()
    df = pd.read_csv(csv_path)
    validate_dataframe(df, required_columns, no_null_columns)

    if upsert_key:
        # ... staging table + ON CONFLICT logic from Day 4 ...
        pass
    else:
        df.to_sql(table_name, engine, if_exists="append",
                  index=False, chunksize=500, method="multi")

    elapsed = time.time() - start
    logger.info(f"Loaded {len(df)} rows into {table_name} in {elapsed:.2f}s")


# ── main.py ──
import argparse
from config import get_engine
from load import load_csv_to_table
from validate import ValidationError

def main():
    parser = argparse.ArgumentParser(description="PG Data Loader")
    parser.add_argument("--csv", required=True)
    parser.add_argument("--table", required=True)
    parser.add_argument("--upsert", default=None)
    args = parser.parse_args()

    engine = get_engine()
    try:
        load_csv_to_table(
            engine, args.csv, args.table,
            required_columns=["full_name", "date_of_birth"],
            no_null_columns=["full_name"],
            upsert_key=args.upsert,
        )
    except ValidationError as e:
        print(f"Validation failed: {e}")
        raise SystemExit(1)

if __name__ == "__main__":
    main()
    `,

    commonMistakes: [
      "Letting raw Python tracebacks reach the end user on validation or connection failures, instead of catching exceptions and printing clear, actionable error messages.",
      "Hardcoding the required_columns / no_null_columns rules inside load.py instead of making them configurable parameters, reducing the tool's reusability for different datasets.",
      "Building the upsert logic without a genuine primary/unique key constraint on the target table, which makes ON CONFLICT impossible to use correctly.",
      "Skipping tests entirely or only testing the 'happy path' (successful load) without testing the validation failure case, which is just as important to verify.",
    ],

    exercises: [
      "Build the complete PG Data Loader tool per the brief above, with all 4 modules.",
      "Write and pass at least 4 pytest tests covering validation success, validation failure, a basic load, and the upsert path.",
      "Run the tool from the command line against a real CSV and your hospital database, confirming both the plain-append and --upsert modes work correctly.",
      "Write the README.md with clear usage instructions and example output, then push the complete project to GitHub.",
    ],

    resources: [
      {
        objective: "Structure a reusable CLI data tool properly",
        items: [
          { title: "Real Python — Python Application Layouts: A Reference", url: "https://realpython.com/python-application-layouts/", type: "article", note: "Reference for organising config/validate/load/main into a clean structure." },
        ],
      },
      {
        objective: "Use Python's logging module instead of print statements",
        items: [
          { title: "Real Python — Logging in Python", url: "https://realpython.com/python-logging/", type: "article", note: "Practical guide to replacing print() with proper logging in real tools." },
        ],
      },
      {
        objective: "Reference loading and upsert patterns from this week",
        items: [
          { title: "PostgreSQL official docs — INSERT ... ON CONFLICT", url: "https://www.postgresql.org/docs/current/sql-insert.html#SQL-ON-CONFLICT", type: "reference", note: "Reference for the upsert mechanism your --upsert flag will rely on." },
        ],
      },
    ],
  },

];

if (typeof module !== "undefined") {
  module.exports = { WEEK12 };
}
