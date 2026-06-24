// ============================================================
// WEEK 18 — Data Quality with Great Expectations + dbt Tests
// Days 86–90 | 12–16 October 2026
// Phase 2: Data Engineering Foundations
// ============================================================

const WEEK18 = [

  // ============================================================
  // DAY 86 — Great Expectations Fundamentals
  // ============================================================
  {
    id: "W18D1", week: 18, day: 1, phase: 2,
    phaseTitle: "Data Engineering Foundations",
    date: "2026-10-12",
    type: "lesson",
    topic: "Great Expectations Fundamentals: Data Sources, Expectation Suites & Core Validations",
    duration: "2–3 hours",

    objectives: [
      "Categorise the main types of data quality issues a pipeline must guard against",
      "Install Great Expectations and connect it to a pandas DataFrame",
      "Build an expectation suite using common built-in expectations",
      "Run validation and interpret the resulting results object",
    ],

    introduction: `
You've been validating data informally since Week 13 — checking
for nulls, casting types with errors='coerce', deduplicating. This
week formalises that instinct into TWO deliberate, automated
layers: Great Expectations (GX), which validates RAW data before
it's loaded, and dbt tests (Week 17), which validate TRANSFORMED
models after. Today is GX specifically — the standard Python
library for this exact job across the data engineering industry.
    `,

    mentalModel: `
MENTAL MODEL — "The Receiving Inspection Before Anything Touches the Pharmacy Shelf"

Before a delivered medication batch ever reaches the pharmacy
shelf, someone checks the manifest against the actual contents —
right drug, right quantity, right expiry, nothing damaged. Great
Expectations is exactly that receiving inspection for data: a
formal, written, checkable list of expectations applied to
incoming data BEFORE it's trusted enough to load into your
warehouse — catching problems at the door, not three reports later.
    `,

    explanation: `
TYPES OF DATA QUALITY ISSUES
=================================
Nulls                : missing values where a value is required
Duplicates             : the same logical record appearing more than once
Type errors             : a column containing values of the wrong
                          type (e.g. text in a numeric column)
Outliers                  : values technically valid but implausible
                          (a dose_mg of 50,000)
Referential integrity      : a foreign key pointing to a record that
                          doesn't exist (Week 11's relationships concept)

Each category needs a slightly different expectation — GX gives
you a structured, named way to check for all of them.

INSTALLING AND SETTING UP GREAT EXPECTATIONS
==================================================
pip install great_expectations

import great_expectations as gx

context = gx.get_context()     # creates/loads a GX project context

CONNECTING TO A PANDAS DATAFRAME
=====================================
import pandas as pd

df = pd.read_csv("patient_intake.csv")

data_source = context.data_sources.add_pandas("pandas_source")
data_asset = data_source.add_dataframe_asset(name="patients")
batch_definition = data_asset.add_batch_definition_whole_dataframe("patients_batch")
batch = batch_definition.get_batch(batch_parameters={"dataframe": df})

BUILDING AN EXPECTATION SUITE
==================================
suite = context.suites.add(gx.ExpectationSuite(name="patients_suite"))

suite.add_expectation(
    gx.expectations.ExpectColumnValuesToNotBeNull(column="full_name")
)
suite.add_expectation(
    gx.expectations.ExpectColumnValuesToBeUnique(column="patient_id")
)
suite.add_expectation(
    gx.expectations.ExpectColumnValuesToBeBetween(
        column="date_of_birth", min_value="1900-01-01", max_value="2026-12-31"
    )
)
suite.add_expectation(
    gx.expectations.ExpectColumnValuesToBeInSet(
        column="department", value_set=["Cardiology", "Endocrinology", "Oncology"]
    )
)

COMMON BUILT-IN EXPECTATIONS
=================================
ExpectColumnValuesToNotBeNull        -- the column equivalent of Week 13's dropna check
ExpectColumnValuesToBeUnique           -- catches duplicates on a key column
ExpectColumnValuesToBeOfType            -- catches type errors
ExpectColumnValuesToBeBetween            -- catches outliers with a defined valid range
ExpectColumnValuesToBeInSet                -- catches invalid categorical values
ExpectTableRowCountToBeBetween               -- catches suspiciously empty or oversized loads

RUNNING VALIDATION
======================
results = batch.validate(suite)
print(results.success)        # True or False overall
for result in results.results:
    print(result["expectation_config"]["type"], "->", result["success"])

The results object tells you exactly which expectations passed
and which failed, down to specific row counts and example failing
values — far more actionable than a generic "something looks off"
hunch.
    `,

    clinicalConnection: `
ExpectColumnValuesToBeBetween on a dose_mg column is the automated
equivalent of a pharmacy's hard-stop dosage range check — flagging
an order of 50,000mg of a drug normally dosed in single-digit
milligrams BEFORE it's dispensed, not after a near-miss incident
report gets filed. GX formalises exactly this kind of guardrail
for your data pipelines.
    `,

    example: `
import pandas as pd
import great_expectations as gx

df = pd.read_csv("patient_intake.csv")

context = gx.get_context()
data_source = context.data_sources.add_pandas("pandas_source")
data_asset = data_source.add_dataframe_asset(name="patients")
batch_definition = data_asset.add_batch_definition_whole_dataframe("patients_batch")
batch = batch_definition.get_batch(batch_parameters={"dataframe": df})

suite = context.suites.add(gx.ExpectationSuite(name="patients_suite"))

suite.add_expectation(
    gx.expectations.ExpectColumnValuesToNotBeNull(column="full_name")
)
suite.add_expectation(
    gx.expectations.ExpectColumnValuesToBeUnique(column="patient_id")
)
suite.add_expectation(
    gx.expectations.ExpectColumnValuesToBeInSet(
        column="department",
        value_set=["Cardiology", "Endocrinology", "Oncology"],
    )
)
suite.add_expectation(
    gx.expectations.ExpectTableRowCountToBeBetween(min_value=1, max_value=10000)
)

results = batch.validate(suite)

print("Overall success:", results.success)
for result in results.results:
    status = "PASS" if result["success"] else "FAIL"
    print(f"{status}: {result['expectation_config']['type']}")
    `,

    commonMistakes: [
      "Writing expectations so loose they never catch real problems (e.g. an overly wide ExpectColumnValuesToBeBetween range) — expectations should reflect genuine, specific business knowledge of what's plausible.",
      "Confusing a data source, data asset, and batch — a data source is the connection, an asset is a specific table/dataframe within it, and a batch is the actual data slice being validated right now.",
      "Treating GX validation results as pass/fail only, without examining WHICH specific rows failed an expectation when debugging a real data issue.",
      "Forgetting that GX validates RAW data — running it after data has already been transformed somewhat defeats its purpose of catching problems at the door.",
    ],

    exercises: [
      "Install Great Expectations and connect it to a pandas DataFrame loaded from one of your own CSV files.",
      "Build an expectation suite with at least 4 different expectation types covering different data quality issue categories (null, duplicate, type, outlier).",
      "Run validation against intentionally messy data (reuse your Week 13 messy CSV) and confirm GX correctly flags the known problems.",
      "Modify one expectation to be deliberately too strict, re-run validation, and observe how the failure output identifies the specific violating rows.",
    ],

    resources: [
      {
        objective: "Get a working Great Expectations suite running quickly",
        items: [
          { title: "Great Expectations Official Docs — Quickstart", url: "https://docs.greatexpectations.io/docs/", type: "official documentation", note: "Start here — about 1 hour to a working expectation suite against a pandas DataFrame. Then read Core Concepts." },
          { title: "Real Python — Data Validation with Great Expectations", url: "https://realpython.com/data-validation-great-expectations/", type: "article", note: "Step-by-step tutorial covering install, expectations, validation, and HTML reports — read alongside the quickstart." },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 87 — Checkpoints & Data Docs (HTML Validation Reports)
  // ============================================================
  {
    id: "W18D2", week: 18, day: 2, phase: 2,
    phaseTitle: "Data Engineering Foundations",
    date: "2026-10-13",
    type: "lesson",
    topic: "GX Checkpoints, Data Sources for Real Pipelines & Generating Data Docs",
    duration: "2–3 hours",

    objectives: [
      "Build a checkpoint bundling a batch and a suite into a reusable validation unit",
      "Connect Great Expectations to a real CSV file source and a BigQuery table",
      "Generate and navigate the Data Docs HTML report",
      "Integrate a checkpoint run into a Week 13-style pipeline script",
    ],

    introduction: `
Yesterday you validated a DataFrame manually, step by step. Today
is about packaging that into a CHECKPOINT — a reusable, named
validation unit you can run repeatedly with one line, exactly the
kind of thing that belongs as a stage in a real pipeline (and,
next week, inside an Airflow DAG). You'll also generate Data
Docs — automatically built, shareable HTML reports of validation
results, GX's equivalent of dbt's documentation site from Week 17.
    `,

    mentalModel: `
MENTAL MODEL — "The Standing Inspection Protocol, Not a One-Off Check"

Yesterday was performing one inspection manually. A checkpoint is
writing that inspection down as a STANDING PROTOCOL — so any
shift, any day, can run "the patient intake inspection" by name
without re-deriving what to check each time. Data Docs is the
posted, readable inspection LOG anyone can review afterward,
without needing to have been present for the inspection itself.
    `,

    explanation: `
BUILDING A CHECKPOINT
=========================
checkpoint = context.checkpoints.add(
    gx.Checkpoint(
        name="patients_checkpoint",
        validation_definitions=[
            gx.ValidationDefinition(
                name="patients_validation",
                data=batch_definition,
                suite=suite,
            )
        ],
    )
)

result = checkpoint.run(batch_parameters={"dataframe": df})
print(result.success)

A checkpoint bundles WHAT to validate (the batch/data source) with
WHAT TO CHECK (the suite) into one named, re-runnable object — this
is what you'll actually invoke from a pipeline script or an Airflow
task, rather than re-assembling batches and suites by hand each time.

CONNECTING TO A REAL FILE SOURCE
=====================================
file_source = context.data_sources.add_pandas_filesystem(
    name="csv_source", base_directory="./data"
)
file_asset = file_source.add_csv_asset(
    name="patient_intake", batching_regex=r"patient_intake_(?P<date>.+)\\.csv"
)

This lets GX validate files directly off disk (or, with the right
data source type, directly against BigQuery tables), rather than
requiring you to manually load a DataFrame first every time.

CONNECTING TO BIGQUERY
===========================
pip install great_expectations[bigquery]

bq_source = context.data_sources.add_sql(
    name="bigquery_source",
    connection_string="bigquery://victoros-hospital-de/hospital_warehouse",
)
bq_asset = bq_source.add_table_asset(name="patients", table_name="patients")

This validates data DIRECTLY in BigQuery — useful for spot-
checking your Week 16-17 warehouse tables without first pulling
them into a local DataFrame.

GENERATING DATA DOCS
=========================
context.build_data_docs()
context.open_data_docs()

This builds a full, navigable HTML site showing every expectation
suite, every checkpoint run, and the pass/fail history over time —
genuinely useful both for your own debugging and as a portfolio
artifact, similar in spirit to dbt's docs site from Week 17.

INTEGRATING INTO A PIPELINE SCRIPT
========================================
# validate.py (extending Week 13's pipeline structure)
import great_expectations as gx
import logging

logger = logging.getLogger(__name__)

def validate_with_gx(df, suite_name="patients_suite") -> bool:
    context = gx.get_context()
    checkpoint = context.checkpoints.get("patients_checkpoint")
    result = checkpoint.run(batch_parameters={"dataframe": df})
    if not result.success:
        logger.error(f"GX validation failed for {suite_name}")
    return result.success

This slots directly into your Week 13 extract -> transform -> load
structure as an explicit validation gate BEFORE the load step runs
— if validate_with_gx() returns False, the pipeline should halt
rather than load unverified data.
    `,

    clinicalConnection: `
A standing checkpoint validating every incoming patient intake
batch automatically, with a navigable Data Docs history showing
exactly when and why past batches failed, is the data-pipeline
equivalent of a hospital's permanent incident log for failed
specimen collections — not just catching today's problem, but
building an auditable record any future reviewer (or regulator)
could examine.
    `,

    example: `
import great_expectations as gx
import pandas as pd
import logging

logger = logging.getLogger(__name__)


def build_patients_checkpoint(context, suite):
    return context.checkpoints.add(
        gx.Checkpoint(
            name="patients_checkpoint",
            validation_definitions=[
                gx.ValidationDefinition(
                    name="patients_validation",
                    data=context.data_sources.get("pandas_source")
                        .get_asset("patients")
                        .get_batch_definition("patients_batch"),
                    suite=suite,
                )
            ],
        )
    )


def validate_with_gx(df: pd.DataFrame) -> bool:
    '''Run the standing patients checkpoint against a new DataFrame.'''
    context = gx.get_context()
    checkpoint = context.checkpoints.get("patients_checkpoint")
    result = checkpoint.run(batch_parameters={"dataframe": df})

    if not result.success:
        logger.error("GX validation failed — halting before load")
        context.build_data_docs()     # build the report even on failure, for review
        return False

    logger.info("GX validation passed")
    return True


if __name__ == "__main__":
    df = pd.read_csv("patient_intake.csv")
    if validate_with_gx(df):
        print("Proceeding to load step...")
    else:
        print("Validation failed — check Data Docs for details")
        raise SystemExit(1)
    `,

    commonMistakes: [
      "Rebuilding a batch and suite from scratch every time instead of packaging them into a reusable checkpoint, making pipeline integration far more verbose than necessary.",
      "Forgetting to call context.build_data_docs() after a validation run, missing the chance to maintain a navigable historical record of pass/fail results.",
      "Connecting GX to a BigQuery table without the [bigquery] extra installed, causing a confusing missing-dependency error.",
      "Letting a pipeline continue to the load step even when validate_with_gx() returns False, defeating the entire purpose of the validation gate.",
    ],

    exercises: [
      "Build a checkpoint from your Day 1 suite, and run it via checkpoint.run() instead of the manual batch.validate() approach.",
      "Connect Great Expectations to a real CSV file on disk using add_pandas_filesystem(), rather than a DataFrame already in memory.",
      "Generate Data Docs and navigate the resulting HTML report, identifying where a specific failed expectation's details are shown.",
      "Write a validate_with_gx() function and wire it as an explicit gate into one of your Week 13 pipeline scripts, confirming it halts the pipeline on failure.",
    ],

    resources: [
      {
        objective: "Build reusable checkpoints and connect to real data sources",
        items: [
          { title: "Great Expectations Official Docs — Quickstart", url: "https://docs.greatexpectations.io/docs/", type: "official documentation", note: "Continue past the Quickstart into the Checkpoints and Data Sources sections today." },
          { title: "Real Python — Data Validation with Great Expectations", url: "https://realpython.com/data-validation-great-expectations/", type: "article", note: "Covers generating and interpreting Data Docs HTML reports in detail." },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 88 — dbt-expectations: Advanced dbt Testing
  // ============================================================
  {
    id: "W18D3", week: 18, day: 3, phase: 2,
    phaseTitle: "Data Engineering Foundations",
    date: "2026-10-14",
    type: "lesson",
    topic: "dbt-expectations: Porting Great Expectations-Style Tests into dbt",
    duration: "2–3 hours",

    objectives: [
      "Install and configure the dbt-expectations package",
      "Apply range, distribution, and row-count expectations to dbt models",
      "Understand the two-layer validation architecture: GX before load, dbt tests after transform",
      "Write at least 10 dbt-expectations tests across a real project",
    ],

    introduction: `
Today connects this week directly back to Week 17. dbt's 4
built-in tests (unique, not_null, accepted_values, relationships)
cover structural integrity well, but dbt-expectations brings the
same RICHNESS of checks you used in Great Expectations — ranges,
distributions, row counts — directly into your dbt YAML files,
applied to TRANSFORMED models rather than raw data. This is the
second of the two validation layers your resources file describes.
    `,

    mentalModel: `
MENTAL MODEL — "Two Checkpoints in the Supply Chain, Not One"

GX (Days 1-2) is the receiving inspection at the loading dock —
checking RAW deliveries before they enter the building. dbt-
expectations is the FINAL quality check on the finished, packaged
product right before it ships to the pharmacy shelf (your marts).
Two checkpoints, at two different stages, catch two different
categories of problems — raw data issues at the door, and
transformation-logic issues at the very end.
    `,

    explanation: `
INSTALLING dbt-expectations
================================
-- packages.yml
packages:
  - package: calogica/dbt_expectations
    version: [">=0.10.0", "<0.11.0"]

dbt deps     -- installs the package

RANGE AND DISTRIBUTION EXPECTATIONS
========================================
-- models/marts/fct_prescriptions.yml
models:
  - name: fct_prescriptions
    columns:
      - name: dose_mg
        tests:
          - dbt_expectations.expect_column_values_to_be_between:
              min_value: 0
              max_value: 5000
      - name: prescription_id
        tests:
          - dbt_expectations.expect_column_values_to_not_be_null

ROW COUNT AND TABLE-LEVEL EXPECTATIONS
============================================
models:
  - name: fct_prescriptions
    tests:
      - dbt_expectations.expect_table_row_count_to_be_between:
          min_value: 1
          max_value: 1000000

This catches a load that silently produced zero rows, or one that
ballooned far beyond a plausible size — both genuine, common
real-world pipeline failure modes that simple not_null/unique
tests wouldn't catch.

STATISTICAL EXPECTATIONS
=============================
models:
  - name: fct_lab_results
    columns:
      - name: result_value
        tests:
          - dbt_expectations.expect_column_mean_to_be_between:
              min_value: 50
              max_value: 200

A mean far outside an expected range can flag an upstream unit
conversion bug (e.g. mg/dL accidentally loaded as mmol/L) that no
single-row test would ever catch — this is genuinely valuable,
distinct test coverage beyond what dbt's built-ins offer.

REGEX AND PATTERN-MATCHING EXPECTATIONS
=============================================
models:
  - name: stg_patients
    columns:
      - name: patient_id
        tests:
          - dbt_expectations.expect_column_values_to_match_regex:
              regex: '^[0-9]+$'

TWO-LAYER VALIDATION ARCHITECTURE
=======================================
Layer 1 (Great Expectations) : validates RAW data, BEFORE loading
                                — catches bad data at the source,
                                preventing it from ever entering the
                                warehouse
Layer 2 (dbt tests + dbt-expectations) : validates TRANSFORMED
                                models, AFTER dbt run — catches
                                logic errors in your SQL
                                transformations themselves, which
                                GX (validating only raw input)
                                could never catch

Both layers matter, and they catch genuinely different failure
classes — this is not redundant, it's defence in depth.
    `,

    clinicalConnection: `
expect_column_mean_to_be_between catching a glucose results table
whose average suddenly shifted from ~100 to ~5.5 is precisely the
kind of unit-conversion bug (mg/dL vs mmol/L) that has caused real
documented clinical data errors — a single corrupted unit
assumption silently propagating through every downstream report
until someone notices numbers that "don't look right" months later.
    `,

    example: `
-- packages.yml
packages:
  - package: calogica/dbt_expectations
    version: [">=0.10.0", "<0.11.0"]

-- models/marts/fct_prescriptions.yml
version: 2

models:
  - name: fct_prescriptions
    tests:
      - dbt_expectations.expect_table_row_count_to_be_between:
          min_value: 1
          max_value: 1000000
    columns:
      - name: prescription_id
        tests:
          - unique
          - not_null
      - name: dose_mg
        tests:
          - dbt_expectations.expect_column_values_to_be_between:
              min_value: 0
              max_value: 5000
          - dbt_expectations.expect_column_values_to_not_be_null

  - name: fct_lab_results
    columns:
      - name: result_value
        tests:
          - dbt_expectations.expect_column_mean_to_be_between:
              min_value: 50
              max_value: 200
      - name: patient_key
        tests:
          - relationships:
              to: ref('dim_patients')
              field: patient_key

-- Terminal
-- dbt deps
-- dbt test
    `,

    commonMistakes: [
      "Forgetting to run dbt deps after adding dbt-expectations to packages.yml, causing dbt test to fail with an unrecognised test type error.",
      "Setting statistical expectation ranges (like expect_column_mean_to_be_between) too tightly around the CURRENT data's exact mean, making the test brittle and prone to false failures on perfectly normal variation.",
      "Treating GX and dbt-expectations as redundant and only implementing one — they validate different stages of the pipeline and catch different failure classes.",
      "Writing fewer than the brief's target test coverage because basic tests 'feel like enough' — statistical and range tests catch real bug classes simple uniqueness checks cannot.",
    ],

    exercises: [
      "Install dbt-expectations in your Week 17 dbt project and run dbt deps successfully.",
      "Add at least 4 range/between expectations to numeric columns across your mart models.",
      "Add at least 2 row-count or statistical (mean/distribution) expectations to your fact tables.",
      "Write at least 10 dbt-expectations tests total across your project, then run dbt test and confirm they execute (pass or intentionally fail for testing purposes).",
    ],

    resources: [
      {
        objective: "Master dbt's native testing capabilities as a foundation",
        items: [
          { title: "dbt Official Docs — Data Tests", url: "https://docs.getdbt.com/docs/build/data-tests", type: "reference", note: "Complete guide to built-in and custom dbt tests — review before layering dbt-expectations on top." },
        ],
      },
      {
        objective: "Install and apply dbt-expectations comprehensively",
        items: [
          { title: "dbt-expectations Package — GitHub", url: "https://github.com/calogica/dbt-expectations", type: "open source package", note: "Full catalogue of 50+ available tests — browse this to choose appropriate tests for your models today." },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 89 — Airflow Integration & Alerting Strategies
  // ============================================================
  {
    id: "W18D4", week: 18, day: 4, phase: 2,
    phaseTitle: "Data Engineering Foundations",
    date: "2026-10-15",
    type: "lesson",
    topic: "Running GX Checkpoints Inside Airflow & Designing Alerting Strategies",
    duration: "2–3 hours",

    objectives: [
      "Run a Great Expectations checkpoint as a task inside an Airflow DAG",
      "Design a DAG that halts downstream tasks when validation fails",
      "Implement basic alerting (email/Slack-style) on pipeline failure",
      "Decide appropriately what should hard-fail a pipeline versus merely warn",
    ],

    introduction: `
This week's final lesson connects everything back to Week 14:
validation isn't useful sitting in a notebook you run manually —
it needs to be a genuine GATE inside your scheduled, orchestrated
pipeline. Today wires GX checkpoints into an Airflow DAG, and
covers the alerting design decisions that turn "the pipeline
failed silently" into "the right person got notified within
minutes."
    `,

    mentalModel: `
MENTAL MODEL — "The Automatic Stop, Not a Note for Someone to Find Later"

A validation check that runs but doesn't actually STOP anything
downstream is like a smoke detector that beeps into an empty room
— technically functioning, practically useless. Wiring GX into
Airflow as a genuine upstream dependency (transform/load tasks
depend on validation passing) is the difference between a check
that's purely decorative and one that actually protects your
warehouse, the same way a real fire alarm triggers an actual
evacuation protocol, not just a log entry nobody reads.
    `,

    explanation: `
RUNNING A GX CHECKPOINT AS AN AIRFLOW TASK
================================================
from airflow.decorators import dag, task
from datetime import datetime
import great_expectations as gx
import pandas as pd

@dag(schedule_interval="@daily", start_date=datetime(2026, 10, 12), catchup=False)
def validated_intake_pipeline():

    @task
    def extract() -> str:
        df = pd.read_csv("/data/incoming/patient_intake.csv")
        df.to_parquet("/tmp/raw_intake.parquet")
        return "/tmp/raw_intake.parquet"

    @task
    def validate(parquet_path: str) -> bool:
        df = pd.read_parquet(parquet_path)
        context = gx.get_context()
        checkpoint = context.checkpoints.get("patients_checkpoint")
        result = checkpoint.run(batch_parameters={"dataframe": df})
        if not result.success:
            raise ValueError("GX validation failed — see Data Docs for details")
        return True

    @task
    def load(validated: bool):
        print("Validation passed — proceeding to load")
        # ... actual load logic ...

    path = extract()
    is_valid = validate(path)
    load(is_valid)

RAISING AN EXCEPTION = THE TASK FAILS = DOWNSTREAM TASKS DON'T RUN
========================================================================
Notice the validate task RAISES an exception on failure, rather
than just returning False silently. In Airflow, a raised exception
marks the task instance as FAILED, and by default, downstream
tasks depending on it (via >> or function calls in the TaskFlow
API) simply will not run — this is the actual "gate" mechanism,
not just a logged warning.

BASIC ALERTING ON FAILURE
==============================
from airflow.decorators import dag
from airflow.utils.email import send_email

default_args = {
    "email": ["victor@example.com"],
    "email_on_failure": True,
    "email_on_retry": False,
}

@dag(
    schedule_interval="@daily",
    start_date=datetime(2026, 10, 12),
    catchup=False,
    default_args=default_args,
)
def validated_intake_pipeline():
    ...

Setting email_on_failure=True in default_args means Airflow
automatically emails the configured address whenever ANY task in
the DAG fails — including your validation task. For Slack-style
alerts, Airflow supports callback functions (on_failure_callback)
that can post to any webhook, following the same principle.

DECIDING: HARD-FAIL VS WARN
================================
Hard-fail (raise an exception, halt the pipeline) when:
  - The data quality issue could corrupt downstream reports or
    decisions if loaded
  - There's no safe, well-justified way to partially proceed

Warn only (log, but continue) when:
  - The issue affects a small, well-understood subset of rows that
    can be safely excluded or flagged without invalidating the rest
  - You're still calibrating an expectation's threshold and don't
    yet trust it enough to halt production runs over it

This mirrors dbt's severity: warn vs error distinction from Week
17 exactly — the judgment is the same, just applied at the
orchestration layer instead of the transformation layer.
    `,

    clinicalConnection: `
Configuring email_on_failure so the right person is alerted within
minutes of a validation failure is the pipeline equivalent of a
critical lab value triggering an immediate page to the ordering
physician rather than just being quietly filed in the chart for
someone to notice on their next routine review — the speed and
certainty of the alert is often as important as the check itself.
    `,

    example: `
from airflow.decorators import dag, task
from datetime import datetime
import great_expectations as gx
import pandas as pd
import logging

logger = logging.getLogger(__name__)

default_args = {
    "email": ["victor@example.com"],
    "email_on_failure": True,
    "email_on_retry": False,
}


@dag(
    dag_id="validated_hospital_intake",
    schedule_interval="0 6 * * 1-5",
    start_date=datetime(2026, 10, 12),
    catchup=False,
    default_args=default_args,
    tags=["hospital", "etl", "data-quality"],
)
def validated_intake_pipeline():

    @task
    def extract() -> str:
        df = pd.read_csv("/data/incoming/patient_intake.csv")
        path = "/tmp/raw_intake.parquet"
        df.to_parquet(path)
        logger.info(f"Extracted {len(df)} rows")
        return path

    @task
    def validate(parquet_path: str) -> str:
        df = pd.read_parquet(parquet_path)
        context = gx.get_context()
        checkpoint = context.checkpoints.get("patients_checkpoint")
        result = checkpoint.run(batch_parameters={"dataframe": df})
        context.build_data_docs()

        if not result.success:
            logger.error("GX validation failed — halting pipeline")
            raise ValueError("Data quality validation failed. Check Data Docs.")

        logger.info("GX validation passed")
        return parquet_path

    @task
    def load(parquet_path: str):
        df = pd.read_parquet(parquet_path)
        logger.info(f"Loading {len(df)} validated rows to warehouse")
        # ... actual load logic from Week 12-15 ...

    raw_path = extract()
    validated_path = validate(raw_path)
    load(validated_path)


validated_intake_pipeline()
    `,

    commonMistakes: [
      "Having a validation task that logs a failure but returns normally instead of raising, allowing Airflow to mark it as 'success' and proceed to load bad data anyway.",
      "Setting email_on_failure on every single DAG indiscriminately, leading to alert fatigue where genuine critical failures get lost among routine, low-stakes notification noise.",
      "Never testing the actual failure path — building a validation gate but never confirming it genuinely halts downstream tasks when triggered.",
      "Treating every validation failure as hard-fail by default without considering whether a warn-and-continue approach is more appropriate for that specific, lower-stakes check.",
    ],

    exercises: [
      "Build an Airflow DAG with extract, validate, and load tasks, where validate runs a GX checkpoint and raises on failure.",
      "Deliberately feed in data that fails validation, confirm the validate task fails in the Airflow UI, and confirm the load task never runs.",
      "Configure email_on_failure (or research and implement a Slack webhook callback) and document how you verified it actually fires.",
      "Write a short decision document (4-5 bullet points) listing which of your project's checks should hard-fail versus warn, with justification for each.",
    ],

    resources: [
      {
        objective: "Integrate Great Expectations checkpoints into Airflow",
        items: [
          { title: "Great Expectations Official Docs — Quickstart", url: "https://docs.greatexpectations.io/docs/", type: "official documentation", note: "Review the checkpoint API once more in the context of calling it from within a Python callable/task." },
          { title: "Apache Airflow Official Documentation — Tutorial", url: "https://airflow.apache.org/docs/apache-airflow/stable/tutorial/index.html", type: "official tutorial", note: "Re-reference task failure and dependency behaviour from Week 14 as you build the validation gate." },
        ],
      },
      {
        objective: "Configure alerting on pipeline failure",
        items: [
          { title: "Astronomer — DAG Best Practices (Official Guide)", url: "https://docs.astronomer.io/learn/dag-best-practices", type: "article", note: "Covers alerting configuration patterns alongside the idempotency principles from Week 14." },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 90 — Week 18 Project: Data Quality Test Suite
  // ============================================================
  {
    id: "W18D5", week: 18, day: 5, phase: 2,
    phaseTitle: "Data Engineering Foundations",
    date: "2026-10-16",
    type: "project",
    topic: "Project: Data Quality Test Suite",
    duration: "3–4 hours",

    objectives: [
      "Build a complete two-layer data quality system across an existing pipeline",
      "Combine Great Expectations (raw layer) and dbt-expectations (transformed layer)",
      "Wire validation as a genuine gate inside an Airflow DAG with alerting",
      "Produce a documented, portfolio-ready data quality deliverable",
    ],

    introduction: `
This week's project is the capstone of your data quality skills:
a complete, two-layer validation system protecting your hospital
pipeline from both raw data problems and transformation-logic
errors, wired into the orchestration layer with real alerting.
This is exactly the kind of "boring but essential" engineering
work that separates production-grade pipelines from tutorials.
    `,

    mentalModel: `
MENTAL MODEL — "Building the Hospital's Full Quality Assurance Program, Not Just One Checklist"

A single checklist catches one category of problem. A genuine
quality assurance PROGRAM has multiple, deliberately layered
checks at different stages, clear escalation procedures when a
check fails, and a navigable record of what's been checked and
when. This project builds exactly that — for your data pipeline —
as a complete system, not an isolated exercise.
    `,

    explanation: `
PROJECT BRIEF
================
Build "Hospital Data Quality Suite" with these components:

1. LAYER 1 — GREAT EXPECTATIONS (RAW DATA)
   - An expectation suite covering your patient intake CSV with
     at least 6 expectations spanning null checks, uniqueness,
     valid sets, and range checks
   - A checkpoint bundling the suite, runnable with one call
   - Data Docs generated and screenshotted

2. LAYER 2 — DBT-EXPECTATIONS (TRANSFORMED MODELS)
   - At least 10 dbt-expectations tests across your Week 17 mart
     models, covering range, row-count, and at least 1 statistical
     expectation
   - All tests passing (or clearly documented, justified
     severity: warn exceptions)

3. AIRFLOW INTEGRATION
   - A DAG (extending Week 14's pipeline) with an explicit GX
     validation task that gates the load task
   - email_on_failure configured (or a documented alternative
     alerting approach)
   - Proof of the gate actually working: a deliberately-failed
     run where load did NOT execute

4. DECISION DOCUMENTATION
   - A clear written list of which checks are hard-fail vs warn,
     with justification for each

5. VERIFICATION
   - Run the full pipeline successfully end to end with clean data
   - Run it again with deliberately corrupted data and confirm
     BOTH layers would have caught it (even if only one layer
     actually runs first in practice)

DELIVERABLE
==============
1. The GX suite/checkpoint code and a Data Docs screenshot
2. The dbt-expectations test YAML additions to your Week 17 project
3. The updated Airflow DAG with the validation gate
4. DECISIONS.md documenting hard-fail vs warn choices
5. README.md tying all three components together as one coherent
   quality system, pushed to GitHub
    `,

    clinicalConnection: `
This complete two-layer system mirrors a hospital's full quality
assurance program: incoming specimen/sample checks (Layer 1, at
the door), final result verification before a report reaches a
clinician (Layer 2, at the end), clear escalation protocols when
either check fails, and a documented audit trail of what was
checked, when, and why — exactly the kind of comprehensive,
defence-in-depth thinking real healthcare data systems require.
    `,

    example: `
-- Example DECISIONS.md content (not code, illustrative structure)

# Hard-Fail vs Warn Decisions

## Hard-fail (halts the pipeline)
- patient_id uniqueness violation — duplicate patient IDs could
  corrupt every downstream join in the warehouse
- full_name null values — a core required field with no safe default
- dose_mg outside [0, 5000] range — a plausible sign of a unit
  conversion or data entry error with real safety implications

## Warn only (logs but continues)
- department value outside the known set — new departments may
  legitimately be added over time; flagging without halting allows
  manual review without blocking the whole day's pipeline run
- result_value statistical mean drift — useful as an early warning
  signal, but a single day's natural variation shouldn't halt
  production while the threshold is still being calibrated

# Example Python snippet tying Layer 1 into the pipeline gate
def run_quality_gate(df) -> bool:
    context = gx.get_context()
    checkpoint = context.checkpoints.get("patients_checkpoint")
    result = checkpoint.run(batch_parameters={"dataframe": df})
    return result.success
    `,

    commonMistakes: [
      "Building both validation layers but never actually connecting Layer 1 to the Airflow gate, leaving GX as an isolated script disconnected from the real pipeline.",
      "Skipping the deliberate-failure verification step, missing the chance to PROVE the gate works rather than just assuming it does.",
      "Writing DECISIONS.md with no real justification, just labels — the reasoning behind each hard-fail/warn choice is the actually valuable part of this deliverable.",
      "Treating this as redundant with Week 17's testing work instead of clearly demonstrating the distinct value each layer adds.",
    ],

    exercises: [
      "Build the complete Layer 1 GX suite and checkpoint, and generate a Data Docs screenshot.",
      "Add the required dbt-expectations tests to your Week 17 project and confirm dbt test passes.",
      "Wire the GX checkpoint into your Airflow DAG as a genuine gate, and prove it halts the pipeline on a deliberately failed run.",
      "Write DECISIONS.md and README.md, then push the complete, tied-together project to GitHub.",
    ],

    resources: [
      {
        objective: "Reference the complete two-layer validation architecture",
        items: [
          { title: "Great Expectations Official Docs — Quickstart", url: "https://docs.greatexpectations.io/docs/", type: "official documentation", note: "Final reference check for your Layer 1 suite and checkpoint configuration." },
          { title: "dbt-expectations Package — GitHub", url: "https://github.com/calogica/dbt-expectations", type: "open source package", note: "Final reference for selecting your Layer 2 test coverage." },
        ],
      },
      {
        objective: "Document the project clearly for portfolio review",
        items: [
          { title: "Make a README — README guide and templates", url: "https://www.makeareadme.com/", type: "article", note: "Use this structure, tying the GX layer, dbt layer, and Airflow gate together as one system." },
        ],
      },
    ],
  },

];

if (typeof module !== "undefined") {
  module.exports = { WEEK18 };
}
