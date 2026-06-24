// ============================================================
// WEEK 13 — ETL Fundamentals: Extract, Transform, Load with Python
// Days 61–65 | 7–11 September 2026
// Phase 2: Data Engineering Foundations
// ============================================================

const WEEK13 = [

  // ============================================================
  // DAY 61 — ETL Architecture & the Extract Step
  // ============================================================
  {
    id: "W13D1", week: 13, day: 1, phase: 2,
    phaseTitle: "Data Engineering Foundations",
    date: "2026-09-07",
    type: "lesson",
    topic: "ETL Architecture; the Extract Step: CSV, APIs & Databases",
    duration: "2–3 hours",

    objectives: [
      "Explain the ETL pipeline pattern and how it differs from ELT",
      "Extract data from CSV files, REST APIs, and a database source",
      "Design a modular extract.py that separates extraction from transformation",
      "Handle extraction failures gracefully without crashing the whole pipeline",
    ],

    introduction: `
Everything in Phase 2 so far — PostgreSQL, advanced SQL,
SQLAlchemy — has been building toward this week: assembling those
skills into an actual ETL pipeline, the core daily work product of
a data engineer. Today is the Extract step specifically: getting
raw data OUT of wherever it lives and into your pipeline, reliably
and from multiple possible source types.
    `,

    mentalModel: `
MENTAL MODEL — "Specimen Collection Before the Lab Workflow"

Extract is specimen collection: drawing blood, swabbing, or
receiving a referred sample — BEFORE any analysis happens. A good
collection protocol handles different collection methods (venous
draw, fingerstick, courier delivery from another facility)
consistently, and crucially, never lets a single failed collection
attempt halt the rest of the day's collections. Your extract step
needs that same resilience: one bad API call or malformed CSV row
shouldn't crash an entire pipeline run.
    `,

    explanation: `
ETL vs ELT
=============
ETL (Extract, Transform, Load): transform happens in your Python
pipeline BEFORE loading into the destination. Best when the
destination is a traditional database or when transformations are
complex enough to need Python's flexibility.

ELT (Extract, Load, Transform): raw data loads into the
destination FIRST, then transformation happens INSIDE the
warehouse using SQL. This is the modern pattern for cloud data
warehouses like BigQuery — and exactly what dbt (Week 17) is built
for. Loading raw data fast, then transforming with the warehouse's
own compute power, often scales better than transforming in
Python first.

This week is hands-on ETL; Week 17's dbt work will be your hands-
on ELT experience, completing the comparison.

EXTRACTING FROM CSV
========================
import pandas as pd

def extract_from_csv(filepath: str) -> pd.DataFrame:
    '''Extract raw data from a CSV file into a DataFrame.'''
    return pd.read_csv(filepath)

EXTRACTING FROM A REST API
================================
import requests

def extract_from_api(url: str, params: dict = None) -> list[dict]:
    '''Extract raw JSON records from a REST API endpoint.'''
    response = requests.get(url, params=params, timeout=10)
    response.raise_for_status()     # raises an exception on 4xx/5xx
    return response.json()

raise_for_status() is essential — without it, a failed request
(404, 500, etc.) silently returns an error page as "successful"
data, which then corrupts everything downstream.

EXTRACTING FROM A DATABASE
================================
import pandas as pd
from sqlalchemy import create_engine

def extract_from_database(engine, query: str) -> pd.DataFrame:
    '''Extract data from a source database via a SQL query.'''
    return pd.read_sql(query, engine)

DESIGNING A MODULAR extract.py
===================================
# extract.py
import logging
import pandas as pd
import requests

logger = logging.getLogger(__name__)

def extract_from_csv(filepath: str) -> pd.DataFrame:
    try:
        df = pd.read_csv(filepath)
        logger.info(f"Extracted {len(df)} rows from {filepath}")
        return df
    except FileNotFoundError:
        logger.error(f"CSV file not found: {filepath}")
        raise
    except pd.errors.EmptyDataError:
        logger.error(f"CSV file is empty: {filepath}")
        raise

def extract_from_api(url: str, params: dict = None) -> list[dict]:
    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        logger.info(f"Extracted {len(data)} records from {url}")
        return data
    except requests.exceptions.RequestException as e:
        logger.error(f"API extraction failed for {url}: {e}")
        raise

Each function does exactly ONE extraction job, logs what it did,
and raises clear exceptions on failure rather than silently
returning bad or partial data. The CALLER (your main pipeline
script) decides whether to retry, skip, or halt — extract.py's
job is just to extract correctly or fail loudly.

HANDLING PARTIAL EXTRACTION FAILURES
=========================================
def extract_multiple_sources(sources: list[dict]) -> list[pd.DataFrame]:
    '''Extract from multiple sources, continuing past individual failures.'''
    results = []
    for source in sources:
        try:
            df = extract_from_csv(source["path"])
            results.append(df)
        except Exception as e:
            logger.warning(f"Skipping source {source['path']}: {e}")
            continue     # one bad source doesn't stop the others
    return results
    `,

    clinicalConnection: `
raise_for_status() on an API call is the data engineering
equivalent of checking a specimen's chain-of-custody label before
trusting the result that comes back from the lab — if the sample
was mishandled or the request failed, you need to know
IMMEDIATELY and loudly, not silently proceed as if a corrupted or
missing result were valid data feeding into a patient's chart.
    `,

    example: `
import logging
import pandas as pd
import requests
from sqlalchemy import create_engine

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def extract_from_csv(filepath: str) -> pd.DataFrame:
    '''Extract patient records from a CSV export.'''
    try:
        df = pd.read_csv(filepath)
        logger.info(f"Extracted {len(df)} rows from {filepath}")
        return df
    except FileNotFoundError:
        logger.error(f"File not found: {filepath}")
        raise


def extract_from_api(base_url: str, endpoint: str) -> list[dict]:
    '''Extract drug interaction data from a public health API.'''
    url = f"{base_url}/{endpoint}"
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        data = response.json()
        logger.info(f"Extracted {len(data)} records from {url}")
        return data
    except requests.exceptions.RequestException as e:
        logger.error(f"API extraction failed: {e}")
        raise


def extract_from_database(engine, table_name: str) -> pd.DataFrame:
    '''Extract existing patient data from PostgreSQL for comparison/upsert.'''
    query = f"SELECT * FROM {table_name};"
    df = pd.read_sql(query, engine)
    logger.info(f"Extracted {len(df)} existing rows from {table_name}")
    return df


if __name__ == "__main__":
    engine = create_engine(
        "postgresql+psycopg2://victor:practice123@localhost:5432/hospital_practice"
    )
    new_patients = extract_from_csv("incoming_patients.csv")
    existing_patients = extract_from_database(engine, "patients")
    print(f"New: {len(new_patients)}, Existing: {len(existing_patients)}")
    `,

    commonMistakes: [
      "Forgetting response.raise_for_status() on API calls, allowing failed requests to silently flow downstream as if they succeeded.",
      "Letting one failed source in a multi-source extraction halt the entire pipeline, instead of logging and continuing past recoverable failures.",
      "Mixing extraction logic and transformation logic in the same function, making the code harder to test and reuse independently.",
      "Using bare except: clauses that catch and hide ALL errors, including genuine bugs, instead of catching specific expected exception types.",
    ],

    exercises: [
      "Write an extract_from_csv() function with proper error handling for both FileNotFoundError and empty-file cases.",
      "Write an extract_from_api() function against any free public API (e.g. a public health or weather API), including raise_for_status() and exception handling.",
      "Write extract_multiple_sources() that processes a list of CSV paths, logging and skipping any that fail, and returning only the successfully extracted DataFrames.",
      "Deliberately break one source (point to a non-existent file or bad URL) and confirm your pipeline logs the failure and continues rather than crashing entirely.",
    ],

    resources: [
      {
        objective: "Understand ETL architecture and the ETL vs ELT distinction",
        items: [
          { title: "Airbyte — How to Build an ETL Pipeline in Python", url: "https://airbyte.com/data-engineering-resources/python-etl", type: "article", note: "The most comprehensive free guide — read this fully before writing pipeline code this week." },
          { title: "freeCodeCamp — ETL Pipeline Tutorial (Video)", url: "https://www.youtube.com/watch?v=OVcBZg4ZNOQ", type: "video", note: "~2 hour hands-on build of a real ETL pipeline — type along with the instructor." },
        ],
      },
      {
        objective: "Practice robust extraction from multiple source types",
        items: [
          { title: "Real Python — Python's requests Library (Guide)", url: "https://realpython.com/python-requests/", type: "article", note: "Thorough reference for API extraction, error handling, and timeouts." },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 62 — The Transform Step: Cleaning, Normalising, Deduplicating
  // ============================================================
  {
    id: "W13D2", week: 13, day: 2, phase: 2,
    phaseTitle: "Data Engineering Foundations",
    date: "2026-09-08",
    type: "lesson",
    topic: "The Transform Step: Cleaning Nulls, Normalising Strings, Type Casting & Deduplication",
    duration: "2–3 hours",

    objectives: [
      "Identify and handle missing/null values appropriately for different columns",
      "Normalise inconsistent string data (casing, whitespace, formatting)",
      "Cast columns to correct, consistent data types",
      "Detect and remove duplicate records using appropriate keys",
    ],

    introduction: `
Raw extracted data is almost never clean — inconsistent casing,
stray whitespace, missing values, wrong types, and outright
duplicates are the norm, not the exception, especially when
combining data from multiple sources. The Transform step is where
you systematically fix all of this, and today's patterns are ones
you'll reuse in literally every pipeline you build from here
forward.
    `,

    mentalModel: `
MENTAL MODEL — "Triage Before Treatment"

You wouldn't begin treating a patient based on an unverified,
inconsistent intake form — you triage first: confirm vitals are
recorded in consistent units, flag missing required fields, catch
duplicate registrations of the same person under slightly
different name spellings. Transform is exactly this triage step
for your data — getting it into a consistent, trustworthy state
BEFORE it's used for anything downstream.
    `,

    explanation: `
HANDLING MISSING VALUES
============================
import pandas as pd

df.isnull().sum()              # count nulls per column — always start here

-- Different strategies for different situations:
df["middle_name"] = df["middle_name"].fillna("")         # blank is fine
df["dose_mg"] = df["dose_mg"].fillna(df["dose_mg"].median())  # impute
df = df.dropna(subset=["patient_id", "full_name"])         # drop if truly required

There's no single "correct" strategy — the right choice depends on
whether the column is required, whether a sensible default exists,
and whether imputing a value (like a median) could be misleading
for that specific field. Never impute silently for high-stakes
fields like dosage without a clear, documented justification.

NORMALISING STRINGS
=======================
df["full_name"] = df["full_name"].str.strip()             # remove stray whitespace
df["full_name"] = df["full_name"].str.title()              # consistent casing
df["department"] = df["department"].str.upper().str.strip()

-- Standardising inconsistent category values:
department_mapping = {
    "CARDIO": "Cardiology",
    "cardiology dept": "Cardiology",
    "Cardiology ": "Cardiology",
}
df["department"] = df["department"].str.strip().replace(department_mapping)

Real-world data frequently has the SAME logical value spelled
multiple inconsistent ways — building an explicit mapping dict, as
above, is a common and necessary transform pattern.

TYPE CASTING
===============
df["date_of_birth"] = pd.to_datetime(df["date_of_birth"], errors="coerce")
df["dose_mg"] = pd.to_numeric(df["dose_mg"], errors="coerce")
df["patient_id"] = df["patient_id"].astype(int)

errors="coerce" converts unparseable values to NaT/NaN instead of
raising an exception — letting you load most good data while
flagging the rest for review, rather than failing the entire batch
over a handful of bad rows.

-- After coercing, always check what got nulled out:
bad_dates = df[df["date_of_birth"].isnull()]
print(f"Found {len(bad_dates)} unparseable date_of_birth values")

DEDUPLICATION
================
df.duplicated().sum()                          # exact full-row duplicates
df = df.drop_duplicates()                       # remove exact duplicates

-- Duplicates based on a SUBSET of columns (more common in practice):
df.duplicated(subset=["full_name", "date_of_birth"]).sum()
df = df.drop_duplicates(subset=["full_name", "date_of_birth"], keep="first")

keep="first" keeps the first occurrence and drops later ones;
keep="last" does the reverse. Choosing which to keep matters when
duplicate rows have slightly different values — you want the most
trustworthy/recent one to survive.

A REUSABLE transform.py PATTERN
====================================
def transform_patients(df: pd.DataFrame) -> pd.DataFrame:
    '''Clean and standardise raw patient data.'''
    df = df.copy()
    df["full_name"] = df["full_name"].str.strip().str.title()
    df["date_of_birth"] = pd.to_datetime(df["date_of_birth"], errors="coerce")
    df = df.dropna(subset=["full_name", "date_of_birth"])
    df = df.drop_duplicates(subset=["full_name", "date_of_birth"], keep="first")
    return df

Using df.copy() at the start avoids accidentally mutating the
original DataFrame the caller still holds a reference to — a
subtle but common pandas bug.
    `,

    clinicalConnection: `
Standardising "CARDIO", "cardiology dept", and "Cardiology " into
one consistent "Cardiology" value mirrors exactly the real-world
mess of department names entered inconsistently across different
hospital systems over the years — and deduplicating patients by
name + date of birth (rather than relying on a possibly
inconsistent ID field) is precisely the kind of patient-matching
logic real hospital master patient index systems must get right
to avoid dangerous duplicate or fragmented records.
    `,

    example: `
import pandas as pd
import logging

logger = logging.getLogger(__name__)


def transform_patients(df: pd.DataFrame) -> pd.DataFrame:
    '''Clean and standardise raw patient data extracted from a CSV.'''
    df = df.copy()
    initial_count = len(df)

    # Normalise strings
    df["full_name"] = df["full_name"].str.strip().str.title()

    department_mapping = {
        "CARDIO": "Cardiology",
        "cardiology dept": "Cardiology",
        "Cardiology ": "Cardiology",
        "ENDO": "Endocrinology",
    }
    df["department"] = df["department"].str.strip().replace(department_mapping)

    # Type casting with safe coercion
    df["date_of_birth"] = pd.to_datetime(df["date_of_birth"], errors="coerce")

    # Drop rows missing truly required fields
    before_drop = len(df)
    df = df.dropna(subset=["full_name", "date_of_birth"])
    dropped = before_drop - len(df)
    if dropped:
        logger.warning(f"Dropped {dropped} rows with missing required fields")

    # Deduplicate
    before_dedup = len(df)
    df = df.drop_duplicates(subset=["full_name", "date_of_birth"], keep="first")
    deduped = before_dedup - len(df)
    if deduped:
        logger.warning(f"Removed {deduped} duplicate patient records")

    logger.info(f"Transformed {initial_count} -> {len(df)} clean rows")
    return df


if __name__ == "__main__":
    raw_df = pd.read_csv("incoming_patients.csv")
    clean_df = transform_patients(raw_df)
    print(clean_df.head())
    `,

    commonMistakes: [
      "Imputing missing values for high-stakes fields (like dosage) without clear justification, silently introducing potentially misleading data.",
      "Forgetting errors='coerce' on type conversions and having the entire pipeline crash because of one malformed value in one row.",
      "Deduplicating on the full row when a meaningful SUBSET of columns (like name + date of birth) would catch near-duplicates that differ only in a less important field.",
      "Mutating the original DataFrame in place inside a transform function without df.copy(), causing confusing bugs when the caller still references the original.",
    ],

    exercises: [
      "Write a transform function that normalises string casing and whitespace for at least 2 columns in a dataset of your choice.",
      "Build a mapping dictionary to standardise at least 4 inconsistent category values into their correct canonical form, and apply it with .replace().",
      "Cast a date column and a numeric column using errors='coerce', then write code to report exactly how many values were nulled out by the coercion.",
      "Deduplicate a DataFrame on a meaningful subset of columns (not the full row) and report how many duplicates were removed.",
    ],

    resources: [
      {
        objective: "Master pandas data cleaning patterns",
        items: [
          { title: "Medium — Beginner-Friendly ETL Pipeline Guide (Python)", url: "https://medium.com/@simranduggal75/beginner-friendly-etl-pipeline-guide-with-python-7968ec8289a4", type: "article", note: "Shows the exact clean-and-transform pattern with complete working code." },
          { title: "pandas official docs — Working with missing data", url: "https://pandas.pydata.org/docs/user_guide/missing_data.html", type: "reference", note: "Official reference for fillna, dropna, and missing-value handling strategies." },
        ],
      },
      {
        objective: "Practice deduplication and type casting",
        items: [
          { title: "pandas official docs — drop_duplicates()", url: "https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.drop_duplicates.html", type: "reference", note: "Official reference covering subset and keep parameters in detail." },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 63 — The Load Step: Idempotent Loading Patterns
  // ============================================================
  {
    id: "W13D3", week: 13, day: 3, phase: 2,
    phaseTitle: "Data Engineering Foundations",
    date: "2026-09-09",
    type: "lesson",
    topic: "The Load Step: Idempotent Loading, Incremental vs Full Refresh",
    duration: "2–3 hours",

    objectives: [
      "Implement a clean load.py module building on Week 12's loading patterns",
      "Choose between full refresh and incremental loading appropriately",
      "Design loads to be safely re-runnable (idempotent) by default",
      "Log load results clearly for monitoring and debugging",
    ],

    introduction: `
You built loading patterns in Week 12. Today is about making
Load the third, properly separated module in a real pipeline —
and thinking carefully about a decision every data engineer faces
constantly: do you reload everything every time (full refresh), or
only the new/changed data (incremental)? Getting this wrong either
wastes enormous compute or, worse, silently misses data.
    `,

    mentalModel: `
MENTAL MODEL — "Re-Auditing the Whole Chart vs Just Today's Entries"

A full refresh load is like re-reviewing a patient's ENTIRE chart
from admission to today, every single day, just to check for
updates — thorough, but wasteful once the chart grows large.
Incremental loading is reviewing only TODAY's new entries since
your last review — far more efficient, but it depends entirely on
reliably knowing exactly where "last time" left off, the same way
a nurse depends on an accurate handoff note from the previous
shift.
    `,

    explanation: `
FULL REFRESH — SIMPLE, BUT EXPENSIVE AT SCALE
==================================================
def full_refresh_load(df: pd.DataFrame, table_name: str, engine) -> None:
    '''Replace the entire table contents with the new dataset.'''
    df.to_sql(table_name, engine, if_exists="replace", index=False)

Simple and always correct, but re-processes EVERYTHING every run —
fine for small reference tables, wasteful (and slow) for large,
frequently-updated tables like transactional records.

INCREMENTAL LOADING — ONLY NEW/CHANGED DATA
================================================
Requires a reliable way to identify "what's new since last time" —
usually a timestamp column or an auto-incrementing ID.

def incremental_load(engine, table_name: str, source_df: pd.DataFrame,
                       timestamp_col: str) -> pd.DataFrame:
    '''Load only rows newer than the latest timestamp already in the table.'''
    query = f"SELECT MAX({timestamp_col}) AS last_loaded FROM {table_name};"
    result = pd.read_sql(query, engine)
    last_loaded = result["last_loaded"].iloc[0]

    if last_loaded is not None:
        new_rows = source_df[source_df[timestamp_col] > last_loaded]
    else:
        new_rows = source_df     # table is empty, load everything

    if len(new_rows) > 0:
        new_rows.to_sql(table_name, engine, if_exists="append", index=False)
    return new_rows

This pattern checks the DESTINATION table for the latest already-
loaded timestamp, then only loads source rows newer than that —
dramatically more efficient for large, continuously growing
tables like lab_results or prescriptions.

IDEMPOTENT LOADING — SAFE TO RE-RUN
========================================
Combine incremental loading with the upsert pattern from Week 12
for genuine idempotency — re-running the exact same pipeline run
twice should never create duplicates or corrupt data:

from sqlalchemy import text

def idempotent_upsert_load(engine, df: pd.DataFrame, table_name: str,
                              key_column: str) -> None:
    staging_table = f"{table_name}_staging"
    df.to_sql(staging_table, engine, if_exists="replace", index=False)

    columns = ", ".join(df.columns)
    update_clause = ", ".join(
        f"{col} = EXCLUDED.{col}" for col in df.columns if col != key_column
    )
    upsert_sql = text(f"""
        INSERT INTO {table_name} ({columns})
        SELECT {columns} FROM {staging_table}
        ON CONFLICT ({key_column})
        DO UPDATE SET {update_clause};
    """)
    with engine.connect() as conn:
        conn.execute(upsert_sql)
        conn.commit()

LOGGING LOAD RESULTS
========================
import logging
import time

logger = logging.getLogger(__name__)

def load_with_logging(df, table_name, engine) -> None:
    start = time.time()
    row_count_before = pd.read_sql(f"SELECT COUNT(*) FROM {table_name}", engine).iloc[0, 0]

    df.to_sql(table_name, engine, if_exists="append", index=False)

    row_count_after = pd.read_sql(f"SELECT COUNT(*) FROM {table_name}", engine).iloc[0, 0]
    elapsed = time.time() - start
    logger.info(
        f"Loaded {row_count_after - row_count_before} new rows into "
        f"{table_name} in {elapsed:.2f}s (total now: {row_count_after})"
    )

Logging before/after row counts and elapsed time gives you (and
anyone monitoring the pipeline later) real visibility into whether
a run actually did what it was supposed to.
    `,

    clinicalConnection: `
Incremental loading using a timestamp watermark is exactly how a
hospital's overnight batch sync between its lab system and central
records database should work — pulling only RESULTS FINALISED
since the last sync, rather than re-transmitting the entire
historical lab record every single night, which would be both
wasteful and risk introducing duplicate entries into the patient's
chart.
    `,

    example: `
import logging
import time
import pandas as pd
from sqlalchemy import text

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def get_last_loaded_timestamp(engine, table_name: str, timestamp_col: str):
    '''Return the most recent timestamp already present in the table, or None.'''
    query = f"SELECT MAX({timestamp_col}) AS last_loaded FROM {table_name};"
    result = pd.read_sql(query, engine)
    return result["last_loaded"].iloc[0]


def incremental_load(engine, table_name: str, source_df: pd.DataFrame,
                       timestamp_col: str) -> int:
    '''Load only rows newer than what's already in the destination table.'''
    last_loaded = get_last_loaded_timestamp(engine, table_name, timestamp_col)

    if last_loaded is not None:
        new_rows = source_df[source_df[timestamp_col] > last_loaded]
    else:
        new_rows = source_df

    if len(new_rows) == 0:
        logger.info(f"No new rows to load into {table_name}")
        return 0

    start = time.time()
    new_rows.to_sql(table_name, engine, if_exists="append", index=False)
    elapsed = time.time() - start
    logger.info(f"Loaded {len(new_rows)} new rows into {table_name} in {elapsed:.2f}s")
    return len(new_rows)


if __name__ == "__main__":
    from sqlalchemy import create_engine
    engine = create_engine(
        "postgresql+psycopg2://victor:practice123@localhost:5432/hospital_practice"
    )
    source_df = pd.read_csv("new_lab_results.csv")
    source_df["result_date"] = pd.to_datetime(source_df["result_date"])
    rows_loaded = incremental_load(engine, "lab_results", source_df, "result_date")
    print(f"Pipeline run complete: {rows_loaded} new rows loaded")
    `,

    commonMistakes: [
      "Using full refresh on a large, frequently-growing table out of simplicity, without realising the load time will keep increasing as the table grows.",
      "Building incremental loading on an unreliable timestamp column (e.g. one that can be backdated or is sometimes null), causing rows to be silently missed.",
      "Forgetting that incremental loading alone is NOT automatically idempotent — re-running with overlapping date ranges can still create duplicates unless combined with an upsert or a precise watermark boundary.",
      "Not logging row counts or timing, leaving no way to detect a 'silently loaded zero rows' failure that completed without raising any error.",
    ],

    exercises: [
      "Implement get_last_loaded_timestamp() and incremental_load() against your lab_results table, and test it with a CSV containing both old and new dates.",
      "Run your incremental load TWICE in a row with the same source data, and confirm the second run loads zero new rows (proving the watermark logic works).",
      "Add logging to report row counts before/after and elapsed time for any load function you've written this week.",
      "Write 2-3 sentences explaining, in your own words, when full refresh is actually the BETTER choice despite being less efficient at scale.",
    ],

    resources: [
      {
        objective: "Understand incremental vs full refresh loading strategies",
        items: [
          { title: "ProjectPro — How to Build an ETL Pipeline in Python", url: "https://www.projectpro.io/article/how-to-build-an-etl-pipeline-in-python/1131", type: "article", note: "Explains idempotency, incremental loading, and error handling patterns in depth." },
          { title: "Mage AI Blog — ETL Pipeline Architecture 101", url: "https://www.mage.ai/blog/etl-pipeline-architecture-101-building-scalable-data-pipelines-with-python-sql-cloud", type: "article", note: "Covers architecture tradeoffs including loading strategy decisions." },
        ],
      },
      {
        objective: "Practice logging and monitoring pipeline runs",
        items: [
          { title: "Real Python — Logging in Python", url: "https://realpython.com/python-logging/", type: "article", note: "Reference for structuring informative pipeline logs." },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 64 — Assembling the Full Pipeline & Error Handling
  // ============================================================
  {
    id: "W13D4", week: 13, day: 4, phase: 2,
    phaseTitle: "Data Engineering Foundations",
    date: "2026-09-10",
    type: "lesson",
    topic: "Assembling the Full Pipeline: main.py Orchestration & Robust Error Handling",
    duration: "2–3 hours",

    objectives: [
      "Assemble extract.py, transform.py, and load.py into one orchestrated pipeline",
      "Design a main.py that handles failures at each stage gracefully",
      "Add structured logging across the entire pipeline run",
      "Write a pipeline that's genuinely testable, with each stage independently verifiable",
    ],

    introduction: `
This is the day everything from Monday through Wednesday gets
wired together into one real, runnable pipeline. The structure —
extract.py, transform.py, load.py, main.py — is the standard
shape of professional Python ETL code, and tomorrow's project
depends entirely on getting this orchestration right today.
    `,

    mentalModel: `
MENTAL MODEL — "The Attending Physician Coordinating Specialists"

Each module (extract, transform, load) is like a specialist doing
one job well, in isolation. main.py is the attending physician
coordinating the overall case: deciding the order of operations,
catching it immediately if one specialist's step fails, deciding
whether to proceed, retry, or halt the whole case — and
documenting exactly what happened at each step for the record.
    `,

    explanation: `
THE STANDARD PIPELINE PROJECT STRUCTURE
=============================================
hospital_etl/
├── extract.py      # pulls raw data from sources
├── transform.py    # cleans and reshapes the data
├── load.py         # writes clean data to the destination
├── config.py       # connection strings, file paths, settings
├── main.py         # orchestrates the full run
└── tests/
    ├── test_extract.py
    ├── test_transform.py
    └── test_load.py

ORCHESTRATING main.py
=========================
import logging
from config import get_engine
from extract import extract_from_csv
from transform import transform_patients
from load import incremental_load

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def run_pipeline(csv_path: str) -> None:
    '''Run the full extract -> transform -> load pipeline.'''
    engine = get_engine()

    logger.info("Starting pipeline run")

    try:
        raw_df = extract_from_csv(csv_path)
    except Exception as e:
        logger.error(f"Extraction failed, aborting pipeline: {e}")
        raise SystemExit(1)

    try:
        clean_df = transform_patients(raw_df)
    except Exception as e:
        logger.error(f"Transformation failed, aborting pipeline: {e}")
        raise SystemExit(1)

    if len(clean_df) == 0:
        logger.warning("No valid rows remained after transformation — nothing to load")
        return

    try:
        rows_loaded = incremental_load(engine, "patients", clean_df, "date_of_birth")
        logger.info(f"Pipeline completed successfully: {rows_loaded} rows loaded")
    except Exception as e:
        logger.error(f"Load failed: {e}")
        raise SystemExit(1)


if __name__ == "__main__":
    import sys
    csv_path = sys.argv[1] if len(sys.argv) > 1 else "incoming_patients.csv"
    run_pipeline(csv_path)

Notice each stage is wrapped in its OWN try/except — this gives
precise, stage-specific error messages ("extraction failed" vs
"load failed") rather than one generic catch-all that obscures
where in the pipeline something actually went wrong.

DESIGNING FOR TESTABILITY
==============================
Each function (extract_from_csv, transform_patients,
incremental_load) can be tested INDEPENDENTLY, with fake/sample
inputs, without needing a real database or real CSV file for every
test:

# test_transform.py
import pandas as pd
from transform import transform_patients

def test_transform_removes_duplicates():
    raw = pd.DataFrame({
        "full_name": ["Amaka Obi", "amaka obi", "Chidi Eze"],
        "date_of_birth": ["1990-01-01", "1990-01-01", "1985-05-05"],
        "department": ["Cardiology", "CARDIO", "Endocrinology"],
    })
    result = transform_patients(raw)
    assert len(result) == 2     # the duplicate should have been removed

def test_transform_drops_missing_required_fields():
    raw = pd.DataFrame({
        "full_name": ["Amaka Obi", None],
        "date_of_birth": ["1990-01-01", "1985-05-05"],
        "department": ["Cardiology", "Endocrinology"],
    })
    result = transform_patients(raw)
    assert len(result) == 1

This is exactly why separating extract/transform/load into
distinct, focused functions matters — a monolithic script doing
everything in one giant function is nearly impossible to test this
cleanly.

PARTIAL FAILURE STRATEGY — DECIDE DELIBERATELY
====================================================
Should a pipeline halt completely on any error, or skip the bad
part and continue? There's no universal right answer — but you
must decide DELIBERATELY for each pipeline, not by accident:

- Halt entirely: when downstream systems assume complete, fully
  loaded data (e.g. a financial reconciliation report)
- Skip and continue, logging clearly: when partial data is still
  valuable and one bad source/row shouldn't block everything else
  (e.g. one malformed CSV row among thousands of good ones)
    `,

    clinicalConnection: `
The stage-specific error handling pattern mirrors a hospital's
incident reporting protocol — when something goes wrong, you need
to know EXACTLY which step in the care process failed (medication
ordering vs dispensing vs administration), not just "something bad
happened somewhere." Precise, stage-attributed error messages are
what make a pipeline (or a clinical incident) actually fixable
rather than just alarming.
    `,

    example: `
# Full pipeline example bringing together Days 1-3 of this week

# extract.py, transform.py, load.py assumed to contain the
# functions built earlier this week.

# ── main.py ──
import logging
import sys
from sqlalchemy import create_engine
from extract import extract_from_csv
from transform import transform_patients
from load import incremental_load

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


def get_engine():
    return create_engine(
        "postgresql+psycopg2://victor:practice123@localhost:5432/hospital_practice"
    )


def run_pipeline(csv_path: str) -> dict:
    '''Run the full pipeline and return a summary dict for logging/testing.'''
    summary = {"extracted": 0, "transformed": 0, "loaded": 0, "status": "failed"}
    engine = get_engine()

    try:
        raw_df = extract_from_csv(csv_path)
        summary["extracted"] = len(raw_df)
    except Exception as e:
        logger.error(f"Extraction stage failed: {e}")
        return summary

    try:
        clean_df = transform_patients(raw_df)
        summary["transformed"] = len(clean_df)
    except Exception as e:
        logger.error(f"Transformation stage failed: {e}")
        return summary

    if len(clean_df) == 0:
        logger.warning("Nothing to load after transformation")
        summary["status"] = "completed_empty"
        return summary

    try:
        rows_loaded = incremental_load(engine, "patients", clean_df, "date_of_birth")
        summary["loaded"] = rows_loaded
        summary["status"] = "success"
    except Exception as e:
        logger.error(f"Load stage failed: {e}")
        return summary

    logger.info(f"Pipeline run summary: {summary}")
    return summary


if __name__ == "__main__":
    path = sys.argv[1] if len(sys.argv) > 1 else "incoming_patients.csv"
    result = run_pipeline(path)
    sys.exit(0 if result["status"] == "success" else 1)
    `,

    commonMistakes: [
      "Wrapping the ENTIRE pipeline in one giant try/except, losing the ability to tell which specific stage failed.",
      "Writing extract/transform/load functions that are tightly coupled to specific file paths or table names hardcoded inside them, making independent testing difficult.",
      "Not deciding deliberately on a partial-failure strategy, ending up with inconsistent behaviour (sometimes halting, sometimes silently continuing) across different parts of the same pipeline.",
      "Returning nothing useful from a pipeline run (no summary, no clear success/failure signal), making it impossible for a calling script or scheduler to know whether the run actually succeeded.",
    ],

    exercises: [
      "Assemble your own extract.py, transform.py, and load.py from this week into a working main.py that orchestrates all three stages.",
      "Add stage-specific try/except blocks with clear, distinct log messages for extraction, transformation, and load failures.",
      "Write at least 3 pytest tests for your transform.py functions using small, hand-crafted sample DataFrames (no real database or file needed).",
      "Run your full pipeline end to end against real sample data, then deliberately introduce a failure at each of the 3 stages (one at a time) and confirm the correct stage-specific error message appears.",
    ],

    resources: [
      {
        objective: "See a complete, well-structured pipeline project for reference",
        items: [
          { title: "Medium — The Python ETL Playbook: A Beginner's Guide", url: "https://medium.com/@someshbgd3/the-python-etl-playbook-a-beginners-guide-to-etl-with-python-56bc4fe6f9d7", type: "article", note: "Full project walkthrough with proper extract/transform/load/main file separation — use as a structural template." },
        ],
      },
      {
        objective: "Write effective tests for pipeline stages",
        items: [
          { title: "Real Python — Effective Python Testing With pytest", url: "https://realpython.com/pytest-python-testing/", type: "article", note: "Refresher on pytest fundamentals, applied to testing pipeline functions independently." },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 65 — Week 13 Project: ETL Pipeline (Raw CSV → Clean Database)
  // ============================================================
  {
    id: "W13D5", week: 13, day: 5, phase: 2,
    phaseTitle: "Data Engineering Foundations",
    date: "2026-09-11",
    type: "project",
    topic: "Project: ETL Pipeline — Raw CSV → Clean Database",
    duration: "4–6 hours",

    objectives: [
      "Build a complete, production-structured ETL pipeline from scratch",
      "Apply extraction, cleaning, validation, and idempotent loading together",
      "Write a meaningful test suite covering each pipeline stage independently",
      "Produce a portfolio-ready project demonstrating real data engineering practice",
    ],

    introduction: `
This week's project is the synthesis of everything since Week 9:
schema design, SQL, Python-database integration, and now full ETL
architecture. Build a genuinely complete pipeline that takes messy
raw CSV data and reliably produces clean, loaded, query-ready
database tables — exactly the kind of deliverable that
demonstrates real data engineering competence to anyone reviewing
your portfolio.
    `,

    mentalModel: `
MENTAL MODEL — "From Raw Intake Form to Verified Chart Entry"

This project's full arc — messy raw CSV in, clean verified
database rows out — mirrors a patient's entire intake journey:
raw, sometimes inconsistent intake paperwork (Extract), nursing
triage and verification (Transform), and final, trusted entry into
the official chart (Load). Each step adds rigor; nothing reaches
the "chart" (your database) without passing through verification
first.
    `,

    explanation: `
PROJECT BRIEF
================
Build a complete ETL pipeline, "Hospital Intake Pipeline," with
this structure:

1. SOURCE DATA
   - Create a deliberately messy raw_patient_intake.csv with AT
     LEAST 50 rows, including realistic problems: inconsistent
     casing, extra whitespace, a few missing required fields, at
     least 3 duplicate patients (slightly different formatting),
     at least 2 malformed dates, and inconsistent department names
     needing a mapping table to standardise

2. EXTRACT (extract.py)
   - Reads the CSV with proper error handling
   - Logs row count extracted

3. TRANSFORM (transform.py)
   - Normalises names and department values (with a mapping dict)
   - Casts and validates date_of_birth (errors='coerce' + reporting)
   - Drops rows missing truly required fields, logging how many
   - Deduplicates on a meaningful column subset, logging how many
   - Returns a fully clean DataFrame ready for loading

4. LOAD (load.py)
   - Loads into your existing patients table from Week 9-12
   - Implements EITHER incremental loading OR an idempotent upsert
     (your choice — document which and why in the README)
   - Logs rows loaded and total elapsed time

5. ORCHESTRATION (main.py)
   - Runs all 3 stages with stage-specific error handling
   - Returns/logs a clear run summary (extracted/transformed/
     loaded counts, success/failure status)
   - Accepts the CSV path as a command-line argument

6. TESTING (tests/)
   - At least 6 pytest tests total, covering: a transform success
     case, a transform edge case (e.g. all-duplicate input), an
     extract failure case (missing file), and at least 3 more
     covering your own judgment of what's important to verify

7. RUNNING IT FOR REAL
   - Actually run the complete pipeline against your messy CSV
   - Confirm the patients table ends up clean, deduplicated, and
     correctly populated — verify this with a SQL query, not just
     by trusting the pipeline's own logs

DELIVERABLE
==============
1. The complete project (raw_patient_intake.csv, extract.py,
   transform.py, load.py, config.py, main.py, tests/)
2. README.md: what the pipeline does, how to run it, the
   incremental-vs-upsert decision and why, and example output
3. A short "before and after" section in the README showing a
   sample of the raw messy data next to the clean loaded result
4. Push the complete project to GitHub
    `,

    clinicalConnection: `
This pipeline is a simplified but structurally honest version of
the kind of intake reconciliation system that prevents duplicate
or fragmented patient records when data arrives from multiple
sources (referrals, walk-ins, transfers) with inconsistent
formatting — a real and important patient safety concern in
healthcare data systems, not just a software engineering exercise.
    `,

    example: `
-- Sample of what raw_patient_intake.csv might contain (messy, on purpose)
full_name,date_of_birth,department
Amaka Obi,1990-01-15,CARDIO
amaka obi ,1990-01-15,cardiology dept
Chidi Eze,1985-05-05,Endocrinology
Ngozi Adeyemi,not_a_date,ENDO
Tunde Bello,1978-11-02,Cardiology

# Skeleton for transform.py's core function, building on Day 2's patterns
import pandas as pd
import logging

logger = logging.getLogger(__name__)

DEPARTMENT_MAPPING = {
    "CARDIO": "Cardiology",
    "cardiology dept": "Cardiology",
    "ENDO": "Endocrinology",
}

def transform_patients(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    initial = len(df)

    df["full_name"] = df["full_name"].str.strip().str.title()
    df["department"] = df["department"].str.strip().replace(DEPARTMENT_MAPPING)
    df["date_of_birth"] = pd.to_datetime(df["date_of_birth"], errors="coerce")

    before_drop = len(df)
    df = df.dropna(subset=["full_name", "date_of_birth"])
    logger.warning(f"Dropped {before_drop - len(df)} rows with missing required fields")

    before_dedup = len(df)
    df = df.drop_duplicates(subset=["full_name", "date_of_birth"], keep="first")
    logger.warning(f"Removed {before_dedup - len(df)} duplicate records")

    logger.info(f"Transformed {initial} -> {len(df)} clean rows")
    return df

-- Verification query to run AFTER the pipeline completes
SELECT full_name, date_of_birth, department
FROM patients
ORDER BY full_name;
-- Confirm: no duplicates, no inconsistent department spellings,
-- no malformed dates remain
    `,

    commonMistakes: [
      "Building a raw CSV that isn't actually messy enough to meaningfully exercise the transform logic — the messiness is the point of this project, not an afterthought.",
      "Skipping the final SQL verification step and trusting the pipeline's own log output as proof it worked — always independently confirm against the actual database.",
      "Writing tests that only cover the happy path, missing the edge cases (all duplicates, all missing fields, totally malformed dates) that are exactly where real bugs hide.",
      "Forgetting to document the incremental-vs-upsert choice and reasoning in the README, leaving reviewers unable to evaluate whether the design decision was sound.",
    ],

    exercises: [
      "Build the deliberately messy raw_patient_intake.csv with all the specified problem patterns included.",
      "Build the complete pipeline (extract/transform/load/main) and run it successfully end to end against that CSV.",
      "Write and pass at least 6 pytest tests covering both happy-path and edge-case scenarios.",
      "Run the verification SQL query against your patients table and confirm the loaded data is genuinely clean, then write the README's before/after section.",
    ],

    resources: [
      {
        objective: "Reference a complete project structure for this capstone",
        items: [
          { title: "Medium — The Python ETL Playbook: A Beginner's Guide", url: "https://medium.com/@someshbgd3/the-python-etl-playbook-a-beginners-guide-to-etl-with-python-56bc4fe6f9d7", type: "article", note: "Full project walkthrough with the exact file structure this project follows." },
          { title: "Mage AI Blog — ETL Pipeline Architecture 101", url: "https://www.mage.ai/blog/etl-pipeline-architecture-101-building-scalable-data-pipelines-with-python-sql-cloud", type: "article", note: "Complete code examples for a pandas + SQLAlchemy pipeline similar to this project's shape." },
        ],
      },
      {
        objective: "Write a strong, evidence-based project README",
        items: [
          { title: "Make a README — README guide and templates", url: "https://www.makeareadme.com/", type: "article", note: "Use this structure for documenting your pipeline's design decisions and results." },
        ],
      },
    ],
  },

];

if (typeof module !== "undefined") {
  module.exports = { WEEK13 };
}
