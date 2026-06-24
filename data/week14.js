// ============================================================
// WEEK 14 — Apache Airflow: Pipeline Orchestration
// Days 66–70 | 14–18 September 2026
// Phase 2: Data Engineering Foundations
// ============================================================

const WEEK14 = [

  // ============================================================
  // DAY 66 — DAGs, Operators & Task Dependencies
  // ============================================================
  {
    id: "W14D1", week: 14, day: 1, phase: 2,
    phaseTitle: "Data Engineering Foundations",
    date: "2026-09-14",
    type: "lesson",
    topic: "DAGs, Operators & Task Dependencies: Your First Airflow Pipeline",
    duration: "2–3 hours",

    objectives: [
      "Explain what a DAG is and why pipelines must be acyclic",
      "Write a basic DAG using PythonOperator and BashOperator",
      "Define task dependencies using >> and <<",
      "Run a DAG locally and confirm it executes in the correct order",
    ],

    introduction: `
Everything you built in Week 13 — a working ETL pipeline — has
one glaring gap: it only runs when YOU manually type a command.
A pipeline nobody scheduled, monitored, or retries automatically
isn't really a production pipeline yet, it's a script. Airflow is
the industry-standard tool that turns scripts into real, scheduled,
monitored pipelines — and it shows up in nearly every data
engineering job posting you'll see. Today is your first DAG.
    `,

    mentalModel: `
MENTAL MODEL — "The Surgical Checklist, Not a To-Do List"

A to-do list lets you do things in any order. A surgical
checklist enforces a strict sequence — you cannot close the
incision before confirming the instrument count, no matter how
the list is displayed. A DAG (Directed Acyclic Graph) is exactly
this: DIRECTED means each step has an enforced order, ACYCLIC
means you can never loop back to a previous step (a checklist
that referenced itself would be nonsensical) — together, this
guarantees Airflow always knows precisely what can run next.
    `,

    explanation: `
WHAT IS A DAG?
==================
A DAG is a collection of TASKS with defined DEPENDENCIES between
them, and no cycles — task A can lead to task B, B can lead to C,
but C can never lead back to A. This structure lets Airflow
calculate exactly what's safe to run, in what order, automatically.

INSTALLING AND RUNNING AIRFLOW LOCALLY
===========================================
The simplest path is Docker Compose (you already know Docker from
Week 9):

curl -LfO 'https://airflow.apache.org/docs/apache-airflow/stable/docker-compose.yaml'
docker compose up airflow-init
docker compose up

Then visit http://localhost:8080 (default login: airflow/airflow)
to see the Airflow UI.

YOUR FIRST DAG
=================
from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.operators.bash import BashOperator
from datetime import datetime

def extract_task():
    print("Extracting data...")
    return "extracted"

def transform_task():
    print("Transforming data...")

with DAG(
    dag_id="hospital_etl_dag",
    start_date=datetime(2026, 9, 14),
    schedule_interval="@daily",
    catchup=False,
) as dag:

    extract = PythonOperator(
        task_id="extract",
        python_callable=extract_task,
    )

    transform = PythonOperator(
        task_id="transform",
        python_callable=transform_task,
    )

    notify = BashOperator(
        task_id="notify",
        bash_command="echo 'Pipeline finished successfully'",
    )

    extract >> transform >> notify

KEY DAG PARAMETERS
======================
dag_id            unique identifier for this DAG
start_date         the earliest date Airflow considers this DAG "active"
schedule_interval  how often it runs (cron string or preset like @daily)
catchup            whether Airflow should backfill all missed runs since
                    start_date the first time it sees the DAG (False is
                    the safer default while developing)

OPERATORS — WHAT KINDS OF TASKS EXIST
==========================================
PythonOperator    runs any Python function
BashOperator      runs any shell command
PostgresOperator  runs a SQL statement against a PostgreSQL connection
                  (you'll use this directly with your Week 9-13 database)

Every operator becomes one TASK NODE in the DAG once instantiated.

TASK DEPENDENCIES: >> AND <<
=================================
extract >> transform >> notify
-- Reads naturally left to right: extract, THEN transform, THEN notify.

-- Equivalent, using set_downstream/set_upstream explicitly:
extract.set_downstream(transform)
transform.set_downstream(notify)

-- Branching: one task feeding multiple parallel tasks
extract >> [transform, validate]
-- Both transform and validate run after extract, but don't
-- depend on each other — they can run in parallel.

RUNNING AND VIEWING YOUR DAG
=================================
Place your DAG file in the dags/ folder Airflow watches. It
appears in the UI within about 30 seconds. Toggle it "on," then
trigger a manual run to test before relying on the schedule.
    `,

    clinicalConnection: `
A hospital's discharge checklist — confirm medication
reconciliation, THEN schedule follow-up, THEN print discharge
instructions — is a real-world DAG: a fixed, enforced order with
no step allowed to reference back to an earlier one. Airflow
formalises exactly this kind of dependency logic for data
pipelines, the same way a clinical checklist formalises it for
patient safety.
    `,

    example: `
from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.operators.bash import BashOperator
from datetime import datetime


def extract_patients():
    print("Extracting patient records from source CSV...")


def transform_patients():
    print("Cleaning and standardising patient records...")


def load_patients():
    print("Loading clean records into PostgreSQL...")


with DAG(
    dag_id="hospital_intake_pipeline",
    start_date=datetime(2026, 9, 14),
    schedule_interval="@daily",
    catchup=False,
    tags=["hospital", "etl"],
) as dag:

    extract = PythonOperator(task_id="extract", python_callable=extract_patients)
    transform = PythonOperator(task_id="transform", python_callable=transform_patients)
    load = PythonOperator(task_id="load", python_callable=load_patients)
    notify = BashOperator(
        task_id="notify_success",
        bash_command="echo 'Hospital intake pipeline completed successfully'",
    )

    extract >> transform >> load >> notify
    `,

    commonMistakes: [
      "Forgetting catchup=False while developing, causing Airflow to immediately try to backfill every missed run since start_date the moment the DAG is turned on.",
      "Writing a DAG with a cyclic dependency (task A depends on B, which depends on A), which Airflow will reject outright — DAGs must be acyclic by definition.",
      "Putting heavy, slow logic directly inside the DAG file's top-level code (outside of task functions) — this code runs every time Airflow parses the file (every ~30 seconds), not just when the DAG executes.",
      "Confusing the DAG's start_date with 'when it will first run' — combined with schedule_interval, the first actual run typically happens at the END of the first scheduled interval after start_date, which surprises many beginners.",
    ],

    exercises: [
      "Set up Airflow locally using Docker Compose and confirm you can log into the UI at localhost:8080.",
      "Write a DAG with 3 PythonOperator tasks and 1 BashOperator task, chained with >> in a single linear sequence.",
      "Modify your DAG to have one task branch into two parallel tasks before a final task that depends on both (hint: research how to make a task depend on a list).",
      "Trigger your DAG manually from the UI and review the Graph view to confirm the execution order matches what you defined in code.",
    ],

    resources: [
      {
        objective: "Build the correct mental model of DAGs and core concepts",
        items: [
          { title: "Apache Airflow Official Documentation — Tutorial", url: "https://airflow.apache.org/docs/apache-airflow/stable/tutorial/index.html", type: "official tutorial", note: "Read the Core Concepts page first, then work through the Tutorial — about 3 hours, and the most important resource this week." },
          { title: "freeCodeCamp — Apache Airflow Full Course (Video)", url: "https://www.youtube.com/watch?v=K9AnJ9_ZAXE", type: "video", note: "~2.5 hours covering DAG structure and operators — type along with every DAG the instructor writes." },
        ],
      },
      {
        objective: "Run Airflow locally with Docker Compose",
        items: [
          { title: "Apache Airflow — Running Airflow in Docker", url: "https://airflow.apache.org/docs/apache-airflow/stable/howto/docker-compose/index.html", type: "reference", note: "Official setup guide for the docker-compose.yaml approach used in this lesson." },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 67 — Scheduling, Variables & Connections
  // ============================================================
  {
    id: "W14D2", week: 14, day: 2, phase: 2,
    phaseTitle: "Data Engineering Foundations",
    date: "2026-09-15",
    type: "lesson",
    topic: "Scheduling with Cron, Airflow Variables & Connections",
    duration: "2–3 hours",

    objectives: [
      "Write cron expressions to schedule DAGs at specific times and frequencies",
      "Use Airflow Variables to store configuration outside of code",
      "Use Airflow Connections to securely store database/API credentials",
      "Use PostgresOperator to run SQL directly against your hospital database",
    ],

    introduction: `
Yesterday's DAG ran "@daily" — a convenient preset, but real
pipelines often need precise timing: "every weekday at 6am,"
"every 15 minutes," "the first day of each month." Today also
covers how to keep credentials and configuration OUT of your DAG
code entirely — a real security and maintainability requirement,
not just tidiness.
    `,

    mentalModel: `
MENTAL MODEL — "The Shift Schedule, Not Just 'Every Day'"

A hospital doesn't just say "staff work every day" — it specifies
exact shift patterns: 6am-2pm weekdays, different coverage
weekends, holiday exceptions. Cron syntax gives you that same
precision for pipelines. Airflow Connections are like the
hospital's secure credential vault — staff don't memorise or
hardcode each other's access codes; they're stored centrally and
referenced by role, not duplicated everywhere they're needed.
    `,

    explanation: `
CRON SYNTAX
==============
A cron string has 5 fields: minute hour day-of-month month day-of-week

0 6 * * *       -- every day at 6:00 AM
0 6 * * 1-5     -- every WEEKDAY at 6:00 AM (1=Monday ... 5=Friday)
*/15 * * * *    -- every 15 minutes
0 0 1 * *       -- midnight on the 1st of every month

with DAG(
    dag_id="weekday_morning_pipeline",
    schedule_interval="0 6 * * 1-5",
    start_date=datetime(2026, 9, 14),
    catchup=False,
) as dag:
    ...

PRESET SCHEDULES (SHORTHAND)
=================================
@daily      -- equivalent to "0 0 * * *" (midnight every day)
@hourly     -- equivalent to "0 * * * *"
@weekly     -- equivalent to "0 0 * * 0" (midnight every Sunday)
None        -- DAG only runs when manually triggered, never on a schedule

AIRFLOW VARIABLES — CONFIG OUTSIDE OF CODE
===============================================
Set via the UI (Admin -> Variables) or CLI, then read in any DAG:

from airflow.models import Variable

source_path = Variable.get("hospital_csv_path", default_var="/data/intake.csv")
batch_size = int(Variable.get("batch_size", default_var="500"))

Storing values like file paths or batch sizes as Variables means
you can change pipeline behaviour WITHOUT editing or redeploying
code — just update the value in the UI.

AIRFLOW CONNECTIONS — SECURE CREDENTIAL STORAGE
=====================================================
Set up via the UI (Admin -> Connections): give it a Connection ID
(e.g. "hospital_postgres"), connection type (Postgres), host, login,
password, schema. Airflow encrypts and stores this centrally.

from airflow.providers.postgres.hooks.postgres import PostgresHook

def query_patients():
    hook = PostgresHook(postgres_conn_id="hospital_postgres")
    df = hook.get_pandas_df("SELECT * FROM patients LIMIT 10;")
    print(df)

Your DAG code never contains a password or connection string
directly — it just references the Connection ID, exactly the same
principle as environment variables from Phase 1, but managed
centrally for an entire Airflow deployment.

POSTGRESOPERATOR — RUNNING SQL DIRECTLY
=============================================
from airflow.providers.postgres.operators.postgres import PostgresOperator

refresh_view = PostgresOperator(
    task_id="refresh_summary_view",
    postgres_conn_id="hospital_postgres",
    sql="REFRESH MATERIALIZED VIEW department_prescription_summary;",
)

This runs SQL directly as an Airflow task — perfect for refreshing
materialised views (Week 11) or running maintenance SQL as part of
a scheduled pipeline, with zero custom Python needed.
    `,

    clinicalConnection: `
Storing database credentials as an Airflow Connection rather than
hardcoded in a DAG file is the same discipline as a hospital
storing medication administration codes in a secured system
rather than writing them on a sticky note at the nursing station —
centralising sensitive access reduces the number of places a
leak or mistake could occur.
    `,

    example: `
from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.providers.postgres.operators.postgres import PostgresOperator
from airflow.providers.postgres.hooks.postgres import PostgresHook
from airflow.models import Variable
from datetime import datetime


def extract_and_report():
    hook = PostgresHook(postgres_conn_id="hospital_postgres")
    batch_size = int(Variable.get("batch_size", default_var="100"))
    df = hook.get_pandas_df(f"SELECT * FROM patients LIMIT {batch_size};")
    print(f"Extracted {len(df)} rows (batch_size={batch_size})")


with DAG(
    dag_id="weekday_morning_hospital_report",
    schedule_interval="0 6 * * 1-5",     # 6am every weekday
    start_date=datetime(2026, 9, 14),
    catchup=False,
) as dag:

    extract = PythonOperator(
        task_id="extract_and_report",
        python_callable=extract_and_report,
    )

    refresh_summary = PostgresOperator(
        task_id="refresh_summary_view",
        postgres_conn_id="hospital_postgres",
        sql="REFRESH MATERIALIZED VIEW department_prescription_summary;",
    )

    extract >> refresh_summary
    `,

    commonMistakes: [
      "Writing schedule_interval='@daily' when '0 6 * * 1-5' (specific weekday timing) was actually intended — preset schedules are convenient but limited.",
      "Hardcoding a database connection string directly in a DAG file instead of creating and referencing an Airflow Connection.",
      "Forgetting to provide a default_var when reading an Airflow Variable, causing a hard failure if the variable hasn't been set yet in a fresh environment.",
      "Confusing day-of-week numbering in cron (0 or 7 = Sunday in most implementations, 1 = Monday) and scheduling for the wrong days.",
    ],

    exercises: [
      "Write 3 different cron expressions: one for 'every weekday at 7:30 AM', one for 'every Sunday at midnight', one for 'every 30 minutes'.",
      "Create an Airflow Variable called batch_size via the UI, then read it in a DAG with an appropriate default_var fallback.",
      "Create an Airflow Connection for your hospital PostgreSQL database, then write a PythonOperator task using PostgresHook to query it.",
      "Write a PostgresOperator task that refreshes a materialised view from your Week 11 project, scheduled to run nightly.",
    ],

    resources: [
      {
        objective: "Master cron scheduling syntax",
        items: [
          { title: "crontab.guru — Interactive Cron Schedule Editor", url: "https://crontab.guru/", type: "interactive tool", note: "Type any cron expression and get an instant plain-English explanation — invaluable while learning." },
          { title: "Airflow Tutorial For Beginners 2026 — Full Course (Video)", url: "https://www.youtube.com/watch?v=IiczxlbQb8s", type: "video", note: "Continue this course — covers scheduling, Variables, and Connections in depth." },
        ],
      },
      {
        objective: "Use Airflow Connections and Hooks with PostgreSQL",
        items: [
          { title: "Apache Airflow — Postgres Provider Documentation", url: "https://airflow.apache.org/docs/apache-airflow-providers-postgres/stable/index.html", type: "reference", note: "Official reference for PostgresOperator and PostgresHook." },
        ],
      },
      {
        objective: "Follow the Zoomcamp's hands-on orchestration module",
        items: [
          { title: "DataTalks.Club Zoomcamp — Module 2: Workflow Orchestration", url: "https://github.com/DataTalksClub/data-engineering-zoomcamp/tree/main/02-workflow-orchestration", type: "video + hands-on lab", note: "Practical, real-pipeline-context orchestration module — your primary hands-on resource through Friday." },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 68 — XComs, Sensors & Multi-Task Coordination
  // ============================================================
  {
    id: "W14D3", week: 14, day: 3, phase: 2,
    phaseTitle: "Data Engineering Foundations",
    date: "2026-09-16",
    type: "lesson",
    topic: "XComs, Sensors & Multi-Task Coordination",
    duration: "2–3 hours",

    objectives: [
      "Pass small values between tasks using XComs",
      "Use Sensors (FileSensor, HttpSensor) to wait for external conditions",
      "Coordinate tasks that depend on data produced by earlier tasks",
      "Know the size and use-case limits of XComs versus proper external storage",
    ],

    introduction: `
So far, your tasks have been independent — each does its own
job with no data passed between them. Real pipelines often need
one task's OUTPUT to inform another task's behaviour: "how many
rows did extract find?" feeding into "should transform even run?"
Today covers XComs (cross-communication) for that, plus Sensors,
which let a DAG wait patiently for an external event rather than
assuming data is always immediately ready.
    `,

    mentalModel: `
MENTAL MODEL — "The Handoff Note, Not the Whole Chart"

XComs are like the brief handoff note a nurse passes to the next
shift — "patient in bed 4 is stable, vitals checked at 2pm" — a
small, specific piece of information, NOT the entire patient
chart. Trying to pass huge amounts of data through XComs is like
trying to staple an entire chart to a sticky note — it technically
might fit, but it's the wrong tool; large data belongs in the
actual record (a database or file), referenced by a small pointer
in the handoff note instead.
    `,

    explanation: `
XCOMS — PASSING SMALL VALUES BETWEEN TASKS
================================================
from airflow.operators.python import PythonOperator

def extract_task(**kwargs):
    row_count = 1500
    kwargs['ti'].xcom_push(key='row_count', value=row_count)

def transform_task(**kwargs):
    row_count = kwargs['ti'].xcom_pull(key='row_count', task_ids='extract')
    print(f"Transform received row_count={row_count} from extract")

extract = PythonOperator(task_id='extract', python_callable=extract_task)
transform = PythonOperator(task_id='transform', python_callable=transform_task)
extract >> transform

Using the TaskFlow API (a more modern, cleaner syntax), XComs
happen automatically via return values:

from airflow.decorators import dag, task
from datetime import datetime

@dag(schedule_interval="@daily", start_date=datetime(2026, 9, 14), catchup=False)
def hospital_pipeline():

    @task
    def extract():
        return 1500     # automatically becomes an XCom value

    @task
    def transform(row_count: int):
        print(f"Transforming {row_count} rows")

    transform(extract())

hospital_pipeline()

The TaskFlow API (@dag, @task decorators) is the modern,
recommended way to write Airflow pipelines — XComs happen
implicitly through normal-looking Python function calls and
return values, rather than manual xcom_push/xcom_pull calls.

XCOM SIZE LIMITS — WHAT THEY'RE FOR (AND NOT FOR)
=======================================================
XComs are meant for SMALL values — counts, flags, short strings,
small dicts. They're stored in Airflow's own metadata database,
which is NOT designed for large data. Never push an entire
DataFrame or large file content through an XCom — instead, write
the data to a database or file, and pass just the PATH or a
row-count summary through the XCom.

SENSORS — WAITING FOR EXTERNAL CONDITIONS
===============================================
from airflow.sensors.filesystem import FileSensor

wait_for_file = FileSensor(
    task_id='wait_for_intake_file',
    filepath='/data/incoming/patient_intake.csv',
    poke_interval=30,      # check every 30 seconds
    timeout=600,            # give up after 10 minutes
)

wait_for_file >> extract

A FileSensor pauses the DAG until a specific file appears,
instead of assuming it's already there. An HttpSensor works
similarly for waiting on an API endpoint to become available or
return a specific condition. Sensors prevent a pipeline from
failing simply because an upstream system was a few minutes late
— a realistic, frequent situation in production.

COORDINATING MULTI-TASK DEPENDENCIES
==========================================
extract_csv = PythonOperator(task_id='extract_csv', python_callable=...)
extract_api = PythonOperator(task_id='extract_api', python_callable=...)
merge = PythonOperator(task_id='merge', python_callable=...)

[extract_csv, extract_api] >> merge
-- merge only runs after BOTH extract_csv AND extract_api succeed —
-- a common real pattern when combining multiple data sources
-- before a single transform/load step.
    `,

    clinicalConnection: `
A FileSensor waiting for a lab results file to arrive before
proceeding mirrors exactly how a clinical workflow shouldn't
proceed to "review results with patient" before the lab has
actually finished and transmitted them — patiently waiting for a
real external event, with a sensible timeout (escalate if results
are taking unusually long), rather than assuming a fixed delay
will always be enough.
    `,

    example: `
from airflow.decorators import dag, task
from airflow.sensors.filesystem import FileSensor
from datetime import datetime


@dag(schedule_interval="@daily", start_date=datetime(2026, 9, 14), catchup=False)
def hospital_intake_pipeline():

    wait_for_file = FileSensor(
        task_id="wait_for_intake_file",
        filepath="/data/incoming/patient_intake.csv",
        poke_interval=30,
        timeout=600,
    )

    @task
    def extract():
        import pandas as pd
        df = pd.read_csv("/data/incoming/patient_intake.csv")
        return len(df)     # small value, safe for an XCom

    @task
    def transform(row_count: int):
        print(f"Transforming {row_count} extracted rows")
        # ... real transform logic would load and clean the actual
        # DataFrame here, re-reading from the file/database rather
        # than passing the DataFrame itself through XCom ...
        return row_count

    @task
    def load(row_count: int):
        print(f"Loading {row_count} clean rows into the database")

    row_count = extract()
    transformed_count = transform(row_count)
    load(transformed_count)
    wait_for_file >> row_count


hospital_intake_pipeline()
    `,

    commonMistakes: [
      "Pushing an entire DataFrame or large file content through an XCom — this can silently degrade Airflow's metadata database performance and isn't what XComs are designed for.",
      "Forgetting a timeout on a Sensor, causing a DAG to wait indefinitely if the expected file or condition genuinely never arrives.",
      "Using the older manual xcom_push/xcom_pull pattern when the cleaner TaskFlow API (@task decorators with return values) would be simpler and less error-prone for new pipelines.",
      "Assuming [task_a, task_b] >> task_c means task_c waits for EITHER task — it actually requires BOTH to succeed by default.",
    ],

    exercises: [
      "Rewrite one of your existing DAGs using the TaskFlow API (@dag and @task decorators) instead of manually instantiating PythonOperator.",
      "Write a DAG where one task returns a row count, and a downstream task receives and prints that count via an automatic XCom.",
      "Set up a FileSensor that waits for a file to exist before proceeding, and test both the success case (file present) and the timeout case (file missing, short timeout).",
      "Write a DAG with two independent extract tasks that both feed into a single merge task, confirming via the Graph view that merge waits for both.",
    ],

    resources: [
      {
        objective: "Learn the modern TaskFlow API for cleaner DAGs",
        items: [
          { title: "Apache Airflow Official Documentation — Tutorial (TaskFlow)", url: "https://airflow.apache.org/docs/apache-airflow/stable/tutorial/taskflow.html", type: "official tutorial", note: "Official introduction to the @dag/@task decorator style, the modern recommended approach." },
        ],
      },
      {
        objective: "Understand XComs and their proper use cases",
        items: [
          { title: "Astronomer — DAG Best Practices (Official Guide)", url: "https://docs.astronomer.io/learn/dag-best-practices", type: "article", note: "Covers XCom size limits and sensible patterns directly from the company built around Airflow." },
        ],
      },
      {
        objective: "Practice Sensors for real-world event waiting",
        items: [
          { title: "Airflow Tutorial For Beginners 2026 — Full Course (Video)", url: "https://www.youtube.com/watch?v=IiczxlbQb8s", type: "video", note: "Continue this course for Sensor patterns and additional hands-on examples." },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 69 — Best Practices, Backfilling & the Airflow UI
  // ============================================================
  {
    id: "W14D4", week: 14, day: 4, phase: 2,
    phaseTitle: "Data Engineering Foundations",
    date: "2026-09-17",
    type: "lesson",
    topic: "Airflow Best Practices, Backfilling & Reading the Airflow UI",
    duration: "2–3 hours",

    objectives: [
      "Apply idempotent and atomic task design principles",
      "Understand and safely use backfilling for historical date ranges",
      "Navigate and interpret the Airflow UI: Graph, Gantt, Tree views, and Logs",
      "Diagnose a failed DAG run using the UI and logs systematically",
    ],

    introduction: `
You now know the mechanics of building DAGs. Today is about the
judgment that separates a DAG that merely runs from one that's
genuinely production-worthy: idempotent design (Week 13's concept,
now applied at the orchestration level), safe backfilling, and
fluent use of the UI to actually diagnose problems when (not if)
something eventually fails.
    `,

    mentalModel: `
MENTAL MODEL — "Re-Running Yesterday's Shift Without Double-Dosing Anyone"

Backfilling is like asking "what if we'd run this protocol for
every day we missed over the past 2 weeks?" — genuinely useful for
catching up after an outage, but DANGEROUS if the underlying task
isn't idempotent: re-running a medication administration task for
already-completed days could double-dose patients in the data, the
same way a non-idempotent pipeline re-run can double-insert
records. Idempotency is what makes backfilling SAFE rather than
destructive.
    `,

    explanation: `
IDEMPOTENT TASK DESIGN (REVISITED FOR AIRFLOW)
====================================================
A task is idempotent if running it multiple times for the SAME
execution date produces the same end result as running it once.
Combine Week 12-13's upsert patterns with Airflow's execution date:

from airflow.decorators import task

@task
def load_daily_data(execution_date=None, **context):
    # Delete any existing rows for this exact date first, then insert —
    # this makes re-running the task for the same date completely safe
    delete_query = "DELETE FROM daily_summary WHERE summary_date = %s"
    insert_query = "INSERT INTO daily_summary (...) VALUES (...)"
    # ... execute delete_query then insert_query using execution_date ...

This "delete-then-insert for this specific date" pattern is one of
the most common idempotent loading strategies in real Airflow
pipelines — far simpler than a full upsert when the granularity is
naturally date-based.

ATOMIC TASK DESIGN
=======================
Each task should do ONE clear thing and either fully succeed or
fully fail — avoid tasks that partially complete in an ambiguous
state. Prefer many small, focused tasks over one giant task doing
extract+transform+load all at once; if it fails partway, small
tasks make it obvious exactly what succeeded and what didn't.

BACKFILLING
==============
If catchup=True (or you manually trigger backfill), Airflow will
run the DAG once for every scheduled interval between start_date
and now that hasn't run yet:

airflow dags backfill -s 2026-09-01 -e 2026-09-14 hospital_intake_pipeline

This is genuinely useful — e.g., recovering from a multi-day
outage — but ONLY safe if your tasks are idempotent. Always test
backfilling in a non-production environment first.

READING THE AIRFLOW UI
===========================
Graph view: shows the DAG's structure and dependencies visually,
with colour-coded task status (green=success, red=failed,
yellow=running, etc.) for the selected run.

Tree view (Grid view in newer versions): shows STATUS HISTORY
across many runs at once — useful for spotting patterns like "this
task has failed the last 3 Mondays."

Gantt view: shows how long each task actually took, helping
identify which task is the bottleneck in a slow pipeline — directly
analogous to the EXPLAIN ANALYZE timing analysis from Week 10-11,
but at the pipeline level instead of the query level.

Logs: click any individual task instance to see its full execution
log — this is your first stop when diagnosing ANY failure.

DIAGNOSING A FAILED RUN — A SYSTEMATIC APPROACH
=====================================================
1. Open Graph view for the failed run, identify the red (failed) task
2. Click that task, open its Logs
3. Read the actual Python traceback or error message — don't guess
4. Check: did an upstream task actually succeed, or silently produce
   bad data that this task choked on?
5. Fix the root cause, then use "Clear" on the failed task to retry
   just that task (and its downstream tasks) without re-running the
   entire DAG from scratch
    `,

    clinicalConnection: `
The "delete rows for this date, then re-insert" idempotent pattern
is exactly how a hospital would safely correct a single day's
billing or scheduling record without touching any other day's
data — a clean, scoped correction rather than a risky full
historical reprocessing every time one day's data needs fixing.
    `,

    example: `
from airflow.decorators import dag, task
from airflow.providers.postgres.hooks.postgres import PostgresHook
from datetime import datetime


@dag(schedule_interval="@daily", start_date=datetime(2026, 9, 1), catchup=False)
def idempotent_daily_summary():

    @task
    def build_summary(**context):
        execution_date = context["ds"]     # e.g. "2026-09-14"
        hook = PostgresHook(postgres_conn_id="hospital_postgres")

        # Idempotent pattern: delete this date's rows first, then re-insert
        hook.run(
            "DELETE FROM daily_prescription_summary WHERE summary_date = %s",
            parameters=(execution_date,),
        )
        hook.run(
            """
            INSERT INTO daily_prescription_summary (summary_date, total_prescriptions)
            SELECT %s, COUNT(*)
            FROM prescriptions
            WHERE prescribed_date = %s;
            """,
            parameters=(execution_date, execution_date),
        )
        print(f"Summary rebuilt for {execution_date} — safe to re-run anytime")

    build_summary()


idempotent_daily_summary()

# To safely backfill the last 2 weeks after confirming idempotency:
# airflow dags backfill -s 2026-09-01 -e 2026-09-14 idempotent_daily_summary
    `,

    commonMistakes: [
      "Backfilling a non-idempotent DAG, silently creating duplicate or incorrect data for every re-run of an already-completed date.",
      "Building one giant task that does extract+transform+load together, making it impossible to tell exactly which part failed when something breaks.",
      "Re-running a failed DAG from the very beginning (clearing the whole DAG) instead of clearing just the failed task and its downstream dependents, wasting time re-doing already-successful work.",
      "Ignoring the Gantt view entirely and never identifying which specific task is the actual bottleneck in a slow-running pipeline.",
    ],

    exercises: [
      "Rewrite one of your DAGs' load tasks to use the delete-then-insert idempotent pattern scoped to the execution date.",
      "Deliberately run the same idempotent task twice for the same execution date and confirm no duplicate data results.",
      "Trigger a DAG, let one task fail on purpose (e.g. a deliberate bug), then use the Logs view to find the exact error, fix it, and use Clear to retry just that task.",
      "Open the Gantt view for a DAG with at least 3 tasks and identify which task took the longest — write a sentence explaining what you'd investigate next.",
    ],

    resources: [
      {
        objective: "Learn Airflow best practices from the authoritative source",
        items: [
          { title: "Astronomer — DAG Best Practices (Official Guide)", url: "https://docs.astronomer.io/learn/dag-best-practices", type: "article", note: "The single best resource for idempotent, atomic task design — read this in full today." },
        ],
      },
      {
        objective: "Master reading the Airflow UI for diagnosis",
        items: [
          { title: "Apache Airflow Official Documentation — UI / Screenshots", url: "https://airflow.apache.org/docs/apache-airflow/stable/ui.html", type: "reference", note: "Official walkthrough of every view in the Airflow UI." },
          { title: "DataTalks.Club Zoomcamp — Module 2: Workflow Orchestration", url: "https://github.com/DataTalksClub/data-engineering-zoomcamp/tree/main/02-workflow-orchestration", type: "video + hands-on lab", note: "Continue working through this — directly relevant to tomorrow's project." },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 70 — Week 14 Project: Airflow DAG — Automated Daily Pipeline
  // ============================================================
  {
    id: "W14D5", week: 14, day: 5, phase: 2,
    phaseTitle: "Data Engineering Foundations",
    date: "2026-09-18",
    type: "project",
    topic: "Project: Airflow DAG — Automated Daily Data Pipeline",
    duration: "3–4 hours",

    objectives: [
      "Convert your Week 13 ETL pipeline into a fully orchestrated Airflow DAG",
      "Apply idempotent task design, Connections, and Variables together",
      "Schedule the pipeline realistically and verify it via backfilling",
      "Produce a portfolio-ready, genuinely production-style orchestrated pipeline",
    ],

    introduction: `
This week's project takes your Week 13 ETL pipeline — extract,
transform, load, all working manually — and gives it the missing
piece: real automation. This is the single most valuable upgrade
you can make to that project for your portfolio, since Airflow
fluency is one of the most consistently requested skills in actual
data engineering job postings.
    `,

    mentalModel: `
MENTAL MODEL — "From Manual Rounds to a Scheduled Care Protocol"

A nurse manually remembering to check on each patient is fragile —
easy to forget, hard to audit, dependent on one person's memory. A
scheduled care protocol (vitals every 4 hours, automatically
logged, automatically flagged if missed) is reliable infrastructure
that doesn't depend on anyone remembering. Today converts your
pipeline from "a script I remember to run" into exactly that kind
of dependable infrastructure.
    `,

    explanation: `
PROJECT BRIEF
================
Convert your Week 13 "Hospital Intake Pipeline" into an Airflow
DAG, "hospital_intake_pipeline," meeting these requirements:

1. STRUCTURE
   - Use the TaskFlow API (@dag, @task decorators)
   - At least 4 distinct tasks: extract, transform, load, and a
     final notify/summary task
   - A FileSensor waiting for the source CSV before extraction
     begins

2. CONFIGURATION
   - Database credentials stored as an Airflow Connection, never
     hardcoded
   - At least one configurable value (e.g. source file path or
     batch size) stored as an Airflow Variable

3. SCHEDULING
   - schedule_interval set to a realistic cron expression (e.g.
     weekday mornings), not just @daily, with a clear justification
     in your README for why you chose that timing

4. IDEMPOTENCY
   - The load task must be safely re-runnable for the same
     execution date without creating duplicates — using either the
     delete-then-insert pattern (Day 4) or the upsert pattern
     (Week 12-13)

5. VERIFICATION
   - Trigger the DAG manually and confirm successful completion
     via the Graph view
   - Deliberately introduce a failure in one task, confirm the
     Logs clearly show the error, fix it, and use Clear to
     successfully re-run just that task
   - Backfill at least 3 historical days and confirm via SQL query
     that no duplicate data resulted

DELIVERABLE
==============
1. The complete DAG file (hospital_intake_pipeline.py)
2. A SCREENSHOTS.md or embedded images showing: the Graph view of
   a successful run, the Logs of the deliberately-induced failure,
   and the Gantt view
3. README.md: pipeline purpose, scheduling rationale, idempotency
   approach, and how to set up the required Connection/Variable
4. Push to GitHub, ideally extending your Week 13 ETL repo
    `,

    clinicalConnection: `
This project is the difference between a hospital's quality team
manually remembering to pull a report every morning and that same
report being automatically generated, logged, and flagged if it
fails to run — exactly the kind of dependable, auditable
automation real healthcare data operations rely on rather than
trusting any individual's memory or availability.
    `,

    example: `
from airflow.decorators import dag, task
from airflow.sensors.filesystem import FileSensor
from airflow.providers.postgres.hooks.postgres import PostgresHook
from airflow.models import Variable
from datetime import datetime
import pandas as pd


@dag(
    dag_id="hospital_intake_pipeline",
    schedule_interval="0 6 * * 1-5",     # 6am every weekday
    start_date=datetime(2026, 9, 1),
    catchup=False,
    tags=["hospital", "etl", "phase2-week14"],
)
def hospital_intake_pipeline():

    csv_path = Variable.get("hospital_csv_path", default_var="/data/incoming/patient_intake.csv")

    wait_for_file = FileSensor(
        task_id="wait_for_intake_file",
        filepath=csv_path,
        poke_interval=30,
        timeout=600,
    )

    @task
    def extract() -> int:
        df = pd.read_csv(csv_path)
        df.to_parquet("/tmp/raw_intake.parquet")   # hand off via file, not XCom
        return len(df)

    @task
    def transform(row_count: int) -> int:
        df = pd.read_parquet("/tmp/raw_intake.parquet")
        df["full_name"] = df["full_name"].str.strip().str.title()
        df["date_of_birth"] = pd.to_datetime(df["date_of_birth"], errors="coerce")
        df = df.dropna(subset=["full_name", "date_of_birth"])
        df = df.drop_duplicates(subset=["full_name", "date_of_birth"])
        df.to_parquet("/tmp/clean_intake.parquet")
        return len(df)

    @task
    def load(clean_count: int, **context):
        execution_date = context["ds"]
        df = pd.read_parquet("/tmp/clean_intake.parquet")
        hook = PostgresHook(postgres_conn_id="hospital_postgres")
        # Idempotent: clear this date's batch before reloading
        hook.run(
            "DELETE FROM patients_staging_log WHERE load_date = %s",
            parameters=(execution_date,),
        )
        engine = hook.get_sqlalchemy_engine()
        df.to_sql("patients", engine, if_exists="append", index=False)
        return clean_count

    @task
    def notify(final_count: int):
        print(f"Pipeline completed: {final_count} clean rows loaded")

    extracted = extract()
    transformed = transform(extracted)
    loaded = load(transformed)
    notify(loaded)
    wait_for_file >> extracted


hospital_intake_pipeline()
    `,

    commonMistakes: [
      "Passing entire DataFrames through XComs between tasks instead of handing off via a file path or database, violating the XCom size guidance from Day 3.",
      "Choosing @daily without considering whether the actual business need is weekday-only or a specific time, then not justifying the choice in the README.",
      "Skipping the deliberate-failure test, missing the chance to prove (and demonstrate to a reviewer) that your error handling and logs actually work as intended.",
      "Forgetting to verify backfill results with an independent SQL query, relying only on the Airflow UI showing green checkmarks as 'proof' the data is correct.",
    ],

    exercises: [
      "Convert your Week 13 pipeline into the Airflow DAG structure specified in the brief, using the TaskFlow API throughout.",
      "Set up the required Connection and Variable, then trigger a successful manual run end to end.",
      "Deliberately break one task, capture the Logs output showing the failure, fix it, and use Clear to re-run successfully — document this in SCREENSHOTS.md.",
      "Backfill 3 historical days, then run a SQL query against your patients table to independently confirm no duplicates were introduced.",
    ],

    resources: [
      {
        objective: "Reference the complete orchestration patterns from this week",
        items: [
          { title: "DataTalks.Club Zoomcamp — Module 2: Workflow Orchestration", url: "https://github.com/DataTalksClub/data-engineering-zoomcamp/tree/main/02-workflow-orchestration", type: "video + hands-on lab", note: "Your most directly applicable reference — follow its real pipeline example closely." },
          { title: "Astronomer — DAG Best Practices (Official Guide)", url: "https://docs.astronomer.io/learn/dag-best-practices", type: "article", note: "Review once more before finalising your DAG for the idempotency and task-sizing guidance." },
        ],
      },
      {
        objective: "Document the project clearly for portfolio review",
        items: [
          { title: "Make a README — README guide and templates", url: "https://www.makeareadme.com/", type: "article", note: "Use this structure, with a dedicated section explaining your scheduling and idempotency decisions." },
        ],
      },
    ],
  },

];

if (typeof module !== "undefined") {
  module.exports = { WEEK14 };
}
