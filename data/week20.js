// ============================================================
// WEEK 20 — Modern Data Stack + Phase 2 Capstone
// Days 96–100 | 26–30 October 2026
// Phase 2: Data Engineering Foundations — Final Week
// ============================================================

const WEEK20 = [

  // ============================================================
  // DAY 96 — The Modern Data Stack: Seeing the Whole Picture
  // ============================================================
  {
    id: "W20D1", week: 20, day: 1, phase: 2,
    phaseTitle: "Data Engineering Foundations",
    date: "2026-10-26",
    type: "lesson",
    topic: "The Modern Data Stack: How Every Tool You've Learned Fits Together",
    duration: "2–3 hours",

    objectives: [
      "Map every Phase 2 tool onto the standard modern data stack layers",
      "Explain what each layer's job is, independent of any specific tool",
      "Identify common alternative tools at each layer",
      "Scope your Phase 2 capstone project before building anything",
    ],

    introduction: `
For eleven weeks you've learned tools one at a time: PostgreSQL,
then Airflow, then GCS, then BigQuery, then dbt, then Great
Expectations, then Kafka. Today is the week where it all becomes
one coherent SYSTEM in your head rather than a list of separate
skills — and where you scope the capstone project that will prove
you can connect them yourself.
    `,

    mentalModel: `
MENTAL MODEL — "The Hospital's Full Patient Journey, Not Just One Department"

You've spent weeks mastering individual departments in isolation —
intake, the lab, pharmacy, records. The modern data stack is the
patient's FULL JOURNEY through all of them in the right order:
admission (ingestion) -> initial holding (raw storage) ->
specialist review (warehouse + transform) -> discharge summary
(BI/dashboard) -> with quality checks and scheduling coordinating
every step. You've built every department; this week is about
seeing — and building — the whole hospital.
    `,

    explanation: `
THE STANDARD MODERN DATA STACK, LAYER BY LAYER
====================================================
SOURCES
  Where data originates: application databases, APIs, files,
  event streams. (Your Week 9 PostgreSQL hospital DB, Week 13's
  CSV sources, Week 19's Kafka streams.)

INGESTION
  Moving data FROM sources INTO the platform. (Your Week 13
  extract.py scripts, Week 19's Kafka producers — at scale, tools
  like Airbyte or Fivetran automate this layer entirely.)

RAW STORAGE / DATA LAKE
  Cheap, durable storage for data in its original form before
  heavy processing. (Your Week 15 GCS raw/ zone.)

WAREHOUSE
  Structured, queryable storage optimised for analytics at scale.
  (Your Week 16 BigQuery warehouse.)

TRANSFORM
  Turning raw/loaded data into clean, modelled, analysis-ready
  tables. (Your Week 17 dbt staging/intermediate/marts layers.)

BI / VISUALISATION
  Where humans actually consume the final output. (Your Week 16
  Looker Studio dashboard.)

ORCHESTRATION (cuts across every layer)
  Scheduling and sequencing everything above so it runs reliably,
  unattended. (Your Week 14 Airflow DAGs.)

DATA QUALITY (cuts across every layer)
  Validating data at multiple points so problems are caught early
  and loudly. (Your Week 18 Great Expectations + dbt tests.)

STREAMING (an alternative ingestion/processing path)
  For the subset of use cases needing real-time reaction instead
  of scheduled batches. (Your Week 19 Kafka work.)

COMMON ALTERNATIVES AT EACH LAYER
======================================
Ingestion    : Airbyte, Fivetran, Stitch (instead of hand-written
               extract scripts)
Warehouse     : Snowflake, Redshift, Databricks (instead of BigQuery)
Orchestration  : Prefect, Dagster (instead of Airflow)
Transform       : SQLMesh (a newer dbt alternative)
BI               : Tableau, Power BI, Metabase (instead of Looker Studio)

The SKILLS transfer almost entirely across these alternatives —
you understand orchestration as a CONCEPT now, not just "how to
use Airflow specifically." This is precisely why employers value
fundamentals over any single tool: tools change, the underlying
architecture and judgment don't.

SCOPING YOUR CAPSTONE
==========================
Today, before writing any code, decide:
1. What's the END-TO-END story? (e.g. "raw hospital CSV data flows
   automatically, daily, through validation, storage, warehousing,
   transformation, and into a live dashboard, with one failure
   alerting you")
2. Which layers will you ACTUALLY connect this week? (Realistically:
   ingestion -> raw storage -> warehouse -> transform -> BI, with
   orchestration and quality wired through — streaming is optional
   given the time available)
3. What's your SUCCESS CRITERION? (e.g. "running one Airflow DAG
   trigger takes raw data all the way to an updated dashboard, with
   zero manual steps in between")

Write this down before Day 2 — a clear, written scope is what
prevents this capstone from sprawling into an unfinishable mess.
    `,

    clinicalConnection: `
Seeing the modern data stack as one connected system, rather than
separate department skills, mirrors exactly the shift from a junior
clinician who knows individual protocols well to a senior clinician
who understands how admission, diagnostics, treatment, and discharge
planning all depend on and inform each other — the same underlying
knowledge, but now integrated into genuine systems-level judgment.
    `,

    example: `
# Today's deliverable is a written scope document, not code.
# Example CAPSTONE_SCOPE.md structure:

# Hospital Data Platform — Capstone Scope

## End-to-end story
Raw daily patient intake and lab result CSVs are validated,
landed in a GCS data lake, loaded into BigQuery, transformed via
dbt into a star schema, and surfaced in a Looker Studio dashboard
— the entire flow triggered and scheduled by a single Airflow DAG,
with Great Expectations gating the load step.

## Layers connected
- Ingestion: Python extract scripts (Week 13)
- Raw storage: GCS raw/ zone (Week 15)
- Warehouse: BigQuery (Week 16)
- Transform: dbt staging -> intermediate -> marts (Week 17)
- Quality: GX on raw data + dbt-expectations on marts (Week 18)
- Orchestration: one Airflow DAG coordinating every step (Week 14)
- BI: Looker Studio dashboard reading from marts (Week 16)
- Streaming: NOT included this week — explicitly descoped to keep
  the capstone finishable; documented as a "future extension"

## Success criterion
Triggering the Airflow DAG once, with no manual intervention,
results in the Looker Studio dashboard reflecting newly arrived
data — end to end, in under 10 minutes, with a deliberately
corrupted input file correctly halting the pipeline before reaching
the dashboard.
    `,

    commonMistakes: [
      "Trying to include every single Phase 2 tool (including streaming) in the capstone, resulting in an unfinishable scope given the time available — explicit descoping is a sign of good judgment, not a shortcut.",
      "Treating this as 11 separate weeks of work to redo from scratch rather than CONNECTING and reusing what you've already built in Weeks 9-19.",
      "Skipping the written scope document and just starting to code, leading to scope creep or an unclear definition of 'done' by Friday.",
      "Choosing tool alternatives (Snowflake, Prefect, etc.) for the capstone itself when you have zero hands-on experience with them — the goal this week is integration of what you know, not learning yet another new tool under time pressure.",
    ],

    exercises: [
      "Draw the modern data stack diagram from memory, then check it against today's lesson and fill in any layer you missed.",
      "List 2 alternative tools for 3 different layers, and write one sentence on what's genuinely different about each alternative versus the tool you used in Phase 2.",
      "Write your CAPSTONE_SCOPE.md following the example structure, being explicit about what's IN scope and what's deliberately OUT of scope.",
      "Identify which of your Weeks 9-19 projects/repos you'll reuse and connect this week, rather than rebuild from scratch.",
    ],

    resources: [
      {
        objective: "See the modern data stack from an industry-wide perspective",
        items: [
          { title: "a16z — The Modern Data Stack: Past, Present, and Future", url: "https://a16z.com/the-modern-data-stack/", type: "article", note: "The most-cited overview of the modern data stack — read this to understand the ecosystem you've now built real skills in." },
          { title: "Airbyte — What is the Modern Data Stack?", url: "https://airbyte.com/blog/modern-data-stack", type: "article", note: "Practical breakdown of each layer with tool alternatives — read alongside the a16z piece." },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 97 — Capstone Architecture & Pipeline Wiring (Ingestion → Warehouse)
  // ============================================================
  {
    id: "W20D2", week: 20, day: 2, phase: 2,
    phaseTitle: "Data Engineering Foundations",
    date: "2026-10-27",
    type: "lesson",
    topic: "Capstone Build Day 1: Wiring Ingestion → Raw Storage → Warehouse Under One Orchestrator",
    duration: "3–4 hours",

    objectives: [
      "Connect your Week 13 extraction logic to your Week 15 GCS raw zone",
      "Connect GCS loading into your Week 16 BigQuery warehouse",
      "Wrap both steps as Airflow tasks in a single DAG",
      "Verify each connection point independently before moving to the next",
    ],

    introduction: `
Today and tomorrow are pure build days. Today's half of the
pipeline: getting data from source through to a queryable BigQuery
table, fully automated. The discipline that matters most today is
verifying each CONNECTION POINT independently — confirming extract
works, THEN confirming the GCS write works, THEN confirming the
BigQuery load works — rather than wiring everything at once and
debugging a tangle of simultaneous failures.
    `,

    mentalModel: `
MENTAL MODEL — "Testing Each Handoff Point in the Chain of Custody"

A multi-step chain of custody (sample collected -> transported ->
received -> logged) is only trustworthy if EACH handoff is verified
independently — confirming the sample left the ward doesn't tell
you it arrived at the lab. Today's build mirrors that discipline:
verify extract produces correct output, THEN verify that output
lands correctly in GCS, THEN verify the GCS file loads correctly
into BigQuery — three separate, independently confirmed handoffs.
    `,

    explanation: `
STEP 1 — VERIFY EXTRACTION INDEPENDENTLY
==============================================
Before touching Airflow, run your Week 13 extract function
directly and confirm its output is correct:

from extract import extract_from_csv
df = extract_from_csv("patient_intake.csv")
assert len(df) > 0
print(df.head())

Do not proceed to Step 2 until this is confirmed working in
isolation.

STEP 2 — VERIFY THE GCS WRITE INDEPENDENTLY
==================================================
Using Week 15's upload pattern, write the extracted (and Week 13
transformed/cleaned) data to your raw/processed GCS zones, then
INDEPENDENTLY confirm via gcloud storage ls or the console that
the file actually landed correctly before moving on.

STEP 3 — VERIFY THE BIGQUERY LOAD INDEPENDENTLY
======================================================
Using Week 16's load pattern, load the GCS file into your
warehouse, then run a simple SELECT COUNT(*) query directly in
BigQuery to independently confirm the row count matches expectations
— don't just trust that the load command "completed without error."

STEP 4 — NOW WRAP ALL THREE AS AIRFLOW TASKS
==================================================
from airflow.decorators import dag, task
from datetime import datetime

@dag(schedule_interval="@daily", start_date=datetime(2026, 10, 26), catchup=False)
def capstone_pipeline():

    @task
    def extract_and_clean() -> str:
        from extract import extract_from_csv
        from transform import transform_patients
        df = extract_from_csv("/data/incoming/patient_intake.csv")
        clean_df = transform_patients(df)
        local_path = "/tmp/clean_patients.parquet"
        clean_df.to_parquet(local_path)
        return local_path

    @task
    def load_to_gcs(local_path: str) -> str:
        from google.cloud import storage
        client = storage.Client()
        bucket = client.bucket("victoros-hospital-raw-data")
        blob_name = "processed/patients/{{ ds }}/clean_patients.parquet"
        bucket.blob(blob_name).upload_from_filename(local_path)
        return f"gs://victoros-hospital-raw-data/{blob_name}"

    @task
    def load_to_bigquery(gcs_uri: str):
        from google.cloud import bigquery
        client = bigquery.Client(project="victoros-hospital-de")
        job_config = bigquery.LoadJobConfig(
            source_format=bigquery.SourceFormat.PARQUET,
            write_disposition="WRITE_APPEND",
        )
        job = client.load_table_from_uri(
            gcs_uri, "victoros-hospital-de.hospital_warehouse.patients",
            job_config=job_config,
        )
        job.result()

    local_path = extract_and_clean()
    gcs_uri = load_to_gcs(local_path)
    load_to_bigquery(gcs_uri)

capstone_pipeline()

ONLY ONCE THIS RUNS SUCCESSFULLY SHOULD YOU MOVE TO DAY 3'S WORK
======================================================================
Resist the urge to wire dbt and the dashboard before this half is
solid — a half-working foundation makes every subsequent layer's
bugs much harder to diagnose.
    `,

    clinicalConnection: `
Verifying each handoff point independently before trusting the
full chain mirrors exactly the discipline behind a hospital's
specimen chain-of-custody protocol — you don't simply assume a
multi-step transfer worked because no one reported a problem;
you confirm each step explicitly, because a silent failure at any
single point invalidates everything downstream of it.
    `,

    example: `
# Verification checklist to run through today, in order:

# 1. Extract verification (run directly, not via Airflow)
python -c "
from extract import extract_from_csv
df = extract_from_csv('patient_intake.csv')
print(f'Extracted {len(df)} rows')
assert len(df) > 0
"

# 2. GCS write verification
python -c "
# ... your upload code ...
"
gcloud storage ls gs://victoros-hospital-raw-data/processed/patients/ --recursive

# 3. BigQuery load verification
bq query --use_legacy_sql=false \\
'SELECT COUNT(*) as row_count FROM \`victoros-hospital-de.hospital_warehouse.patients\`'

# 4. Only now: wire all three into the Airflow DAG and trigger
# a full run, watching the Graph view for each task going green
# in sequence
    `,

    commonMistakes: [
      "Wiring all three steps into Airflow before verifying any of them independently, then spending hours debugging which of the three is actually broken.",
      "Forgetting that {{ ds }} (Airflow's execution date templating) needs to be used correctly inside task code if you want date-partitioned GCS paths.",
      "Not re-confirming row counts in BigQuery after the full DAG run, trusting the Airflow UI's green checkmark alone as proof of correctness.",
      "Skipping ahead to dbt/dashboard work before this foundational half is genuinely solid and independently verified.",
    ],

    exercises: [
      "Verify your extract function in isolation, confirming row count and a sample of the output.",
      "Verify the GCS write in isolation, confirming the file actually exists at the expected path via gcloud or the console.",
      "Verify the BigQuery load in isolation, confirming the row count via a direct SQL query.",
      "Wire all three into one Airflow DAG, trigger a full run, and confirm every task goes green in the Graph view.",
    ],

    resources: [
      {
        objective: "Reference each individual layer's pattern as you wire them together",
        items: [
          { title: "DataTalks.Club Zoomcamp — Full Course Repository", url: "https://github.com/DataTalksClub/data-engineering-zoomcamp", type: "video + hands-on lab", note: "Use the repository's module index to quickly re-reference any earlier week's pattern (extract, GCS, BigQuery) as needed today." },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 98 — Capstone Build Day 2: Transform, Quality & Dashboard
  // ============================================================
  {
    id: "W20D3", week: 20, day: 3, phase: 2,
    phaseTitle: "Data Engineering Foundations",
    date: "2026-10-28",
    type: "lesson",
    topic: "Capstone Build Day 2: Wiring dbt Transform, Quality Gates & the Dashboard",
    duration: "3–4 hours",

    objectives: [
      "Trigger a dbt run as an Airflow task following the warehouse load",
      "Wire a Great Expectations checkpoint as a genuine gate before the load step",
      "Connect the finished marts to a live Looker Studio dashboard",
      "Verify the full, connected pipeline end to end",
    ],

    introduction: `
Yesterday got data into the warehouse. Today completes the
pipeline: transforming it with dbt, gating the process with quality
checks, and surfacing the result in a live dashboard — the same
verify-each-connection-point discipline applies today as it did
yesterday.
    `,

    mentalModel: `
MENTAL MODEL — "Completing the Discharge Process, Not Just the Admission"

Yesterday was admission and initial workup (getting the patient/
data into the system correctly). Today is the rest of the stay:
treatment (transformation), safety checks at each stage (quality
gates), and a clear, readable discharge summary (the dashboard)
that someone who wasn't involved in the day-to-day care can still
understand and act on immediately.
    `,

    explanation: `
RUNNING DBT FROM AIRFLOW
=============================
from airflow.operators.bash import BashOperator

run_dbt = BashOperator(
    task_id="run_dbt_transform",
    bash_command="cd /path/to/hospital_analytics && dbt run",
)

test_dbt = BashOperator(
    task_id="test_dbt_models",
    bash_command="cd /path/to/hospital_analytics && dbt test",
)

run_dbt >> test_dbt

For a cleaner production setup, the Cosmos package (astronomer-
cosmos) renders an entire dbt project as native Airflow tasks
automatically, but a BashOperator calling dbt run/dbt test directly
is a perfectly legitimate, simpler approach for a capstone at this
stage.

WIRING THE GX QUALITY GATE BEFORE THE LOAD STEP
======================================================
@task
def validate_before_load(parquet_path: str) -> str:
    import great_expectations as gx
    import pandas as pd
    df = pd.read_parquet(parquet_path)
    context = gx.get_context()
    checkpoint = context.checkpoints.get("patients_checkpoint")
    result = checkpoint.run(batch_parameters={"dataframe": df})
    if not result.success:
        raise ValueError("Data quality validation failed")
    return parquet_path

This task (from Week 18) slots in BETWEEN yesterday's
extract_and_clean and load_to_gcs tasks — the complete dependency
chain becomes:

extract_and_clean >> validate_before_load >> load_to_gcs >>
load_to_bigquery >> run_dbt >> test_dbt

CONNECTING LOOKER STUDIO TO THE FINISHED MARTS
====================================================
1. Go to lookerstudio.google.com -> Create -> Data Source
2. Select BigQuery, choose your project, hospital_warehouse_marts
   dataset (or wherever your dbt marts materialised), and a
   specific mart table (e.g. fct_prescriptions joined to dims, or
   a pre-built summary view)
3. Build at least 3 visualisations reusing Week 16's guidance:
   one trend over time, one categorical breakdown, one scorecard
4. Set sharing to "Anyone with the link can view"

VERIFYING THE FULL CONNECTED PIPELINE
===========================================
Trigger the complete DAG from scratch. Watch every task go green
in sequence: extract -> validate -> GCS -> BigQuery -> dbt run ->
dbt test. Then refresh your Looker Studio dashboard and confirm it
reflects the newly processed data — this is your actual, end-to-end
success criterion from Day 1's scope document.

THE DELIBERATE-FAILURE TEST (DON'T SKIP THIS)
===================================================
Feed in deliberately corrupted data (missing required fields, a
malformed date) and trigger the DAG again. Confirm the
validate_before_load task fails LOUDLY, and that load_to_gcs,
load_to_bigquery, run_dbt, and test_dbt never execute as a result
— this is the proof that your quality gate genuinely protects the
warehouse, not just a checkbox exercise.
    `,

    clinicalConnection: `
The deliberate-failure test — proving a corrupted input genuinely
halts the pipeline before reaching the dashboard — is the data
engineering equivalent of a hospital's mock drill for a critical
safety protocol: you don't wait for a real incident to discover
your safeguard doesn't actually work; you deliberately trigger the
failure condition in a controlled way and confirm the safeguard
responds correctly.
    `,

    example: `
from airflow.decorators import dag, task
from airflow.operators.bash import BashOperator
from datetime import datetime

@dag(schedule_interval="@daily", start_date=datetime(2026, 10, 26), catchup=False)
def capstone_pipeline_complete():

    @task
    def extract_and_clean() -> str:
        from extract import extract_from_csv
        from transform import transform_patients
        df = extract_from_csv("/data/incoming/patient_intake.csv")
        clean_df = transform_patients(df)
        path = "/tmp/clean_patients.parquet"
        clean_df.to_parquet(path)
        return path

    @task
    def validate_before_load(parquet_path: str) -> str:
        import great_expectations as gx
        import pandas as pd
        df = pd.read_parquet(parquet_path)
        context = gx.get_context()
        checkpoint = context.checkpoints.get("patients_checkpoint")
        result = checkpoint.run(batch_parameters={"dataframe": df})
        if not result.success:
            raise ValueError("GX validation failed — halting before load")
        return parquet_path

    @task
    def load_to_gcs(parquet_path: str) -> str:
        from google.cloud import storage
        client = storage.Client()
        bucket = client.bucket("victoros-hospital-raw-data")
        blob_name = "processed/patients/{{ ds }}/clean_patients.parquet"
        bucket.blob(blob_name).upload_from_filename(parquet_path)
        return f"gs://victoros-hospital-raw-data/{blob_name}"

    @task
    def load_to_bigquery(gcs_uri: str):
        from google.cloud import bigquery
        client = bigquery.Client(project="victoros-hospital-de")
        job_config = bigquery.LoadJobConfig(
            source_format=bigquery.SourceFormat.PARQUET,
            write_disposition="WRITE_APPEND",
        )
        client.load_table_from_uri(
            gcs_uri, "victoros-hospital-de.hospital_warehouse.patients",
            job_config=job_config,
        ).result()

    run_dbt = BashOperator(
        task_id="run_dbt_transform",
        bash_command="cd /path/to/hospital_analytics && dbt run",
    )
    test_dbt = BashOperator(
        task_id="test_dbt_models",
        bash_command="cd /path/to/hospital_analytics && dbt test",
    )

    path = extract_and_clean()
    validated_path = validate_before_load(path)
    gcs_uri = load_to_gcs(validated_path)
    bq_load = load_to_bigquery(gcs_uri)
    bq_load >> run_dbt >> test_dbt

capstone_pipeline_complete()
    `,

    commonMistakes: [
      "Forgetting to actually wire the GX task as an upstream DEPENDENCY of the load step (not just running it alongside), which means it doesn't function as a real gate.",
      "Setting Looker Studio sharing to private/restricted by accident, making the 'live dashboard' deliverable inaccessible to anyone reviewing the capstone.",
      "Skipping the deliberate-failure test because the happy path already works, missing the most convincing piece of evidence that the system is genuinely robust.",
      "Building the dbt run/test steps as Airflow tasks but never confirming dbt test actually catches a deliberately introduced bad value end to end through the full pipeline.",
    ],

    exercises: [
      "Add the dbt run and dbt test BashOperator tasks to your DAG, positioned correctly after the BigQuery load.",
      "Add the GX validation task as a genuine upstream dependency of the load step, not a side check.",
      "Connect Looker Studio to your finished marts and build the 3 required visualisations with link-sharing enabled.",
      "Run the full pipeline successfully once, then run the deliberate-failure test and confirm the gate works as designed.",
    ],

    resources: [
      {
        objective: "Reference dbt-in-Airflow integration patterns",
        items: [
          { title: "DataTalks.Club Zoomcamp — Module 4: Analytics Engineering (dbt)", url: "https://github.com/DataTalksClub/data-engineering-zoomcamp/tree/main/04-analytics-engineering", type: "video + hands-on lab", note: "Re-reference for dbt command structure as you wrap it in BashOperator tasks." },
        ],
      },
      {
        objective: "Build the final dashboard layer",
        items: [
          { title: "Looker Studio — Official Help Center", url: "https://support.google.com/looker-studio/", type: "reference", note: "Reference for connecting to BigQuery marts and configuring link-based sharing." },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 99 — Capstone Polish, Documentation & Failure Testing
  // ============================================================
  {
    id: "W20D4", week: 20, day: 4, phase: 2,
    phaseTitle: "Data Engineering Foundations",
    date: "2026-10-29",
    type: "lesson",
    topic: "Capstone Polish: Documentation, Architecture Diagram & Comprehensive Failure Testing",
    duration: "2–3 hours",

    objectives: [
      "Produce a clear architecture diagram of the complete capstone pipeline",
      "Write documentation a stranger could use to understand and run the project",
      "Systematically test failure handling at every stage, not just one",
      "Identify and fix any rough edges before final submission day",
    ],

    introduction: `
The pipeline works — today is about making sure anyone (an
interviewer, a hiring manager, future-you in six months) can
understand it without you standing next to them explaining it
verbally. This is the unglamorous but genuinely high-value work
that separates "I have a pipeline" from "I have a documented,
defensible, professional project."
    `,

    mentalModel: `
MENTAL MODEL — "The Discharge Summary a New Physician Could Pick Up Cold"

A good discharge summary is written so any new physician, who
never met the patient, could pick it up and immediately understand
the full course of care without calling anyone for clarification.
Your capstone documentation needs that exact same quality — written
for a stranger, not for someone who already has the whole project
in their head the way you do right now.
    `,

    explanation: `
THE ARCHITECTURE DIAGRAM
=============================
A simple diagram (hand-drawn and photographed, or built in any
free tool like draw.io or Excalidraw) showing:

[CSV Source] -> [Extract/Clean] -> [GX Validation] -> [GCS Raw Zone]
  -> [BigQuery Load] -> [dbt Transform] -> [dbt Tests] -> [Looker Studio]
       ^
       |
[Airflow DAG orchestrating every box above, on a daily schedule]

This single image often communicates more, faster, to a reviewer
than several paragraphs of text — invest the 20 minutes this takes.

WRITING FOR A STRANGER
===========================
README.md should answer, in order, without requiring the reader to
already know anything about your project:
1. What does this do? (1-2 sentences)
2. What's the architecture? (the diagram + a short walkthrough)
3. How do I run it? (exact setup steps, in order, assuming nothing)
4. What design decisions did I make, and why? (incremental vs full
   refresh, hard-fail vs warn, partition/cluster choices — your
   actual engineering judgment, not just a feature list)
5. What would I improve with more time? (shows self-awareness and
   genuine engineering maturity — this question gets asked in
   almost every real interview)

COMPREHENSIVE FAILURE TESTING — BEYOND THE ONE TEST FROM DAY 3
====================================================================
Systematically test failure at EVERY stage, not just the GX gate:
1. What happens if the source CSV file is simply missing?
2. What happens if GCS is temporarily unreachable (simulate by
   revoking a permission briefly, then restoring it)?
3. What happens if the BigQuery load receives a schema mismatch?
4. What happens if a dbt test fails — does it actually halt
   anything downstream, or just report a warning?

Document each test: what you did, what happened, and whether the
failure behaviour matches what you'd actually want in production.
This is the engineering judgment piece, not just "does it crash."

FIXING ROUGH EDGES
=======================
Common rough edges worth checking today:
- Hardcoded paths/credentials that only work on your specific machine
- Missing requirements.txt or unclear dependency versions
- A README that assumes context only you have
- Dashboard sharing permissions not actually set to link-viewable
  (verify this from an incognito browser window, logged out)
    `,

    clinicalConnection: `
Testing what happens when GCS is "temporarily unreachable" mirrors
exactly the kind of downtime drill a hospital IT team runs for its
critical systems — not waiting for an actual outage to discover
whether the failure mode is graceful or catastrophic, but
deliberately simulating it under controlled conditions first.
    `,

    example: `
# Example failure-testing log entry (for your documentation)

## Test: Missing source file
Action: Renamed patient_intake.csv temporarily, triggered the DAG.
Result: extract_and_clean task failed with a clear FileNotFoundError
in the logs. Downstream tasks correctly did not run.
Assessment: Acceptable — a missing source file should halt the
pipeline loudly, which it does.

## Test: Schema mismatch on BigQuery load
Action: Added an unexpected extra column to the source CSV,
triggered the DAG.
Result: load_to_bigquery failed with a schema mismatch error from
the BigQuery API. Downstream dbt tasks correctly did not run.
Assessment: Acceptable for now — a future improvement would be an
explicit schema validation step earlier in the pipeline (in GX)
to catch this with a clearer error message before reaching BigQuery.

## Test: dbt test failure
Action: Manually inserted a row violating a not_null constraint
directly into the warehouse table, then ran dbt test independently.
Result: dbt test correctly reported a failure for that specific test.
Assessment: Currently this would NOT halt a live pipeline run if
dbt test were a non-blocking task — documented as a known
limitation and listed under "what I'd improve with more time."
    `,

    commonMistakes: [
      "Only testing the one failure scenario already covered on Day 3, missing other realistic failure modes (missing files, schema mismatches, permission issues).",
      "Writing documentation assuming the reader already knows your specific GCP project names, file paths, or prior context.",
      "Skipping the architecture diagram because the system feels 'obvious' once you've built it — it is not obvious to a first-time reader.",
      "Not verifying dashboard sharing permissions from a genuinely logged-out/incognito browser session, leading to a broken 'public' link nobody can actually access.",
    ],

    exercises: [
      "Create a simple architecture diagram of your complete capstone pipeline.",
      "Write the full README.md following the 5-point structure above, written as if for a stranger.",
      "Run at least 3 distinct failure tests beyond the GX gate test, and document each one's action, result, and assessment.",
      "Verify your Looker Studio dashboard link works from a logged-out/incognito browser session.",
    ],

    resources: [
      {
        objective: "Write strong technical documentation",
        items: [
          { title: "Make a README — README guide and templates", url: "https://www.makeareadme.com/", type: "article", note: "Use this structure as the backbone of your final README." },
        ],
      },
      {
        objective: "Build a simple, clear architecture diagram",
        items: [
          { title: "Excalidraw — Free Online Diagramming Tool", url: "https://excalidraw.com/", type: "free tool", note: "No signup required — quick way to sketch your pipeline architecture cleanly." },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 100 — Phase 2 Capstone: End-to-End Data Pipeline (Final Submission)
  // ============================================================
  {
    id: "W20D5", week: 20, day: 5, phase: 2,
    phaseTitle: "Data Engineering Foundations",
    date: "2026-10-30",
    type: "project",
    topic: "Project: Phase 2 Capstone — End-to-End Data Pipeline (Final Submission + Phase Reflection)",
    duration: "4–6 hours",

    objectives: [
      "Finalise and submit the complete, connected, documented capstone pipeline",
      "Verify the full success criterion from Day 1's scope document is genuinely met",
      "Reflect critically on the full Phase 2 journey from Week 9 to today",
      "Set clear, specific goals for Phase 3",
    ],

    introduction: `
Day 100. Sixty days ago you set up your first PostgreSQL Docker
container. Today you finalise a complete, automated, tested,
documented pipeline spanning ingestion, storage, warehousing,
transformation, quality, and visualisation — and you take real
stock of how far that journey has actually gone, deliberately,
before starting Phase 3.
    `,

    mentalModel: `
MENTAL MODEL — "Final Rounds Before Discharge, Then the Discharge Summary Itself"

Today is the final rounds — a last, careful check of everything
before the patient (your capstone) is formally discharged
(submitted) — followed by writing the discharge summary itself:
not just "what happened" but a genuine reflective assessment of
the whole course of care, which is exactly what today's Phase 2
reflection is for.
    `,

    explanation: `
FINAL SUBMISSION CHECKLIST
================================
1. The complete pipeline runs successfully end to end with a
   single trigger, with no manual steps in between stages
2. The deliberate-failure test(s) from Days 3-4 are documented
   with evidence
3. The Looker Studio dashboard is live, link-shareable, and
   verified from a logged-out session
4. README.md, CAPSTONE_SCOPE.md (from Day 1), and the failure-
   testing log are all complete and accurate
5. The architecture diagram is included
6. Everything is pushed to a clean, well-organised GitHub repo

VERIFY YOUR DAY 1 SUCCESS CRITERION, LITERALLY
====================================================
Go back and re-read exactly what you wrote in CAPSTONE_SCOPE.md on
Day 1. Does the finished project ACTUALLY meet that specific
criterion, word for word? If you scoped it as "running one Airflow
DAG trigger takes raw data all the way to an updated dashboard, in
under 10 minutes, with a corrupted file correctly halting the
pipeline" — prove each clause of that sentence is true, today,
with evidence.

THE PHASE 2 REFLECTION
===========================
Write a genuine reflection (not a list of tools used) addressing:

1. What's the SINGLE most valuable thing you learned in Phase 2 —
   not a tool name, but a genuine shift in how you think about data?
2. Which week was hardest, and why — was it the concept itself, or
   something about how you were learning it?
3. Look back at the DataQuest Data Engineering Roadmap article you
   first encountered around Week 9 — read it again now. What reads
   completely differently to you now versus then?
4. What's the ONE thing from Phase 2 you're least confident about,
   that you'd want to revisit or strengthen before relying on it in
   a real job?

SETTING PHASE 3 GOALS
==========================
Based on that honest reflection, write 3 specific, concrete goals
for Phase 3 — not "learn machine learning" (too vague) but
something like "be able to explain bias-variance tradeoff well
enough to teach it to someone else" or "build one ML model end to
end using the same rigor (testing, documentation) as this capstone."

UPDATING YOUR PORTFOLIO AND PROGRESS LOG
==============================================
Push your final reflection and goals to your
UvoTheMan/ds-ai-roadmap-progress repository, exactly as you've
been tracking progress throughout. This capstone, and the 12
projects across Phase 2, are now genuinely interview-ready
portfolio pieces — update your CV/portfolio links accordingly.
    `,

    clinicalConnection: `
The Phase 2 reflection exercise mirrors a genuinely valuable
clinical practice: the structured debrief after a complex case —
not just "what happened" but "what would I do differently, what am
I still uncertain about, what do I need to study before the next
similar case." This habit of honest, structured self-assessment is
exactly what turns repeated experience into genuine expertise,
in clinical practice or in data engineering.
    `,

    example: `
-- Final verification queries to run against your finished warehouse

SELECT COUNT(*) FROM \`victoros-hospital-de.hospital_warehouse.patients\`;

SELECT * FROM \`victoros-hospital-de.hospital_warehouse_marts.fct_prescriptions\`
LIMIT 10;

-- Example reflection excerpt (REFLECTION.md)
-- "The single most valuable shift in how I think about data: I no
-- longer see 'the data is wrong' as a single category of problem.
-- I now distinguish between a RAW data quality issue (Week 18,
-- Layer 1), a TRANSFORMATION logic bug (Week 17/18, Layer 2), and
-- an ORCHESTRATION failure (Week 14) — and I know which tool and
-- which layer is responsible for catching each one. That precision
-- is genuinely new since Week 9."

-- Example Phase 3 goal
-- "Goal: Be able to explain, from memory and without notes, why
-- a model that performs well on training data can perform poorly
-- on new data — and demonstrate this with a deliberately overfit
-- model I build myself in the first 2 weeks of Phase 3."
    `,

    commonMistakes: [
      "Submitting without literally re-checking the Day 1 success criterion word for word, potentially missing that the finished project subtly doesn't meet what was originally scoped.",
      "Writing a reflection that's really just a list of tools/weeks rather than genuine insight about how your thinking has changed.",
      "Setting vague Phase 3 goals that can't be objectively verified later (e.g. 'get better at ML' instead of a specific, checkable target).",
      "Treating Day 100 as just another build day instead of also genuinely pausing to do the reflection — both the artifact AND the reflection are real deliverables this week.",
    ],

    exercises: [
      "Run the complete capstone pipeline one final time and verify, item by item, every point on the Final Submission Checklist above.",
      "Re-read your Day 1 CAPSTONE_SCOPE.md and write a short verification note confirming (or honestly noting any gap from) each stated success criterion.",
      "Write the full Phase 2 REFLECTION.md addressing all 4 reflection questions genuinely and specifically.",
      "Write 3 specific, verifiable Phase 3 goals and push everything — code, documentation, reflection — to GitHub.",
    ],

    resources: [
      {
        objective: "Reflect on the full Phase 2 journey with fresh perspective",
        items: [
          { title: "DataQuest — The Data Engineering Roadmap for Beginners (2026)", url: "https://www.dataquest.io/blog/the-data-engineer-roadmap-for-beginners/", type: "article", note: "Read this again today — it will read completely differently than when you first encountered it around Week 9. Use it as a structured prompt for your reflection." },
        ],
      },
      {
        objective: "Finalise documentation to a professional standard",
        items: [
          { title: "Make a README — README guide and templates", url: "https://www.makeareadme.com/", type: "article", note: "Final check against this structure before considering the capstone submission complete." },
        ],
      },
    ],
  },

];

if (typeof module !== "undefined") {
  module.exports = { WEEK20 };
}
