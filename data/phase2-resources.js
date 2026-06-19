// ============================================================
// PHASE 2 RESOURCES — Data Engineering
// Weeks 9–20 | Aug–Oct 2026
// 100% FREE — No paid resources required
// Every gap filled with a genuine free equivalent
// ============================================================

const PHASE2_RESOURCES = {

  // ============================================================
  // HOW TO USE THESE RESOURCES
  // ============================================================
  howToUse: `
Every resource in this file is completely free.
No subscriptions, no one-time purchases, no credit card.

The learning strategy:
  1. The Data Engineering Zoomcamp is your PRIMARY COURSE.
     It runs parallel to Weeks 9–20 and covers the same stack.
     Watch the Zoomcamp lectures as your main video content.

  2. VictorOS gives you daily structure, exercises, and projects.
     The Zoomcamp gives you the video lectures.
     Together they replace any paid bootcamp.

  3. For each domain, read the articles FIRST to build the
     mental model. Then watch the videos. Then practice with
     the interactive tools. Then build the project.

  4. SQL practice is daily — not just in Weeks 9–11.
     Do at least 2 DataLemur or pgexercises problems every day
     throughout Phase 2.

  5. Join the DataTalks.Club Slack immediately.
     It is the best free data engineering community on earth.
  `,

  // ============================================================
  // ANCHOR COURSE — Do This First, Run It Parallel to Weeks 9–20
  // ============================================================
  anchorCourse: {
    title:    "Data Engineering Zoomcamp — DataTalks.Club",
    url:      "https://github.com/DataTalksClub/data-engineering-zoomcamp",
    youtube:  "https://www.youtube.com/playlist?list=PL3MmuxUbc_hJed7dXYoJw8DoCuVHhGEQb",
    cost:     "FREE — all videos on YouTube, all materials on GitHub",
    certificate: "Free certificate if you join the January live cohort",
    duration: "9 weeks of content, self-paced anytime",

    whatItCovers: [
      "Week 1: Docker + PostgreSQL + Terraform (infrastructure)",
      "Week 2: Workflow orchestration with Airflow/Kestra",
      "Week 3: Data warehousing with BigQuery",
      "Week 4: Analytics engineering with dbt",
      "Week 5: Batch processing with Apache Spark",
      "Week 6: Stream processing with Apache Kafka",
      "Weeks 7–9: Capstone project — end-to-end pipeline",
    ],

    whyItIsEnough: `
The Zoomcamp covers Docker, PostgreSQL, Airflow, BigQuery, dbt,
Spark, and Kafka — every tool in Phase 2 — for free.
It is built by practitioners, updated yearly, and used by
thousands of people who have landed data engineering jobs.
The capstone project alone is a portfolio piece that hiring
managers recognise and respect.

This single free course is equivalent to a $2,000–5,000 bootcamp.
    `,

    howToJoin: `
Self-paced: go to the GitHub repo, watch YouTube videos in order,
do the homework in the repo. Free anytime.

Live cohort: starts January each year. Join for deadlines,
peer review, a leaderboard, and a free certificate.
Register at: https://datatalks.club/blog/data-engineering-zoomcamp.html
    `,
  },

  // ============================================================
  // DOMAIN 1 — PostgreSQL & Database Design
  // Weeks 9–11
  // ============================================================
  postgresql: {
    domain:   "PostgreSQL & Database Design",
    weeks:    "9–11",

    whyItMatters: `
PostgreSQL is the industry-standard open-source relational database.
It is what you run locally for development, and its SQL dialect
transfers directly to BigQuery. Every query pattern you master
in PostgreSQL applies in the cloud.

Database design — how you structure tables — is a skill that
lasts your entire career. A well-designed schema makes queries
fast, data consistent, and systems maintainable. A badly designed
one causes slow queries, data corruption, and rewrites years later.
Get this right at the foundation and everything after is easier.
    `,

    conceptsToMaster: [
      "OLTP vs OLAP — what each is optimised for and why they differ",
      "Primary keys, foreign keys, constraints",
      "Normalisation: 1NF, 2NF, 3NF — and when to intentionally denormalise",
      "PostgreSQL data types: int, numeric, text, varchar, date, timestamp, boolean, jsonb",
      "Creating tables with CREATE TABLE, ALTER TABLE, DROP TABLE",
      "CRUD: INSERT, UPDATE, DELETE, SELECT",
      "JOINs in depth: INNER, LEFT, RIGHT, FULL OUTER, CROSS, SELF JOIN",
      "Aggregations: GROUP BY, HAVING, COUNT, SUM, AVG, MIN, MAX",
      "Subqueries: correlated and non-correlated",
      "CTEs: WITH clause, chained CTEs, recursive CTEs",
      "Window functions: ROW_NUMBER, RANK, DENSE_RANK, NTILE, LAG, LEAD, FIRST_VALUE",
      "PARTITION BY and ORDER BY inside window functions",
      "Indexes: B-tree, when to create, composite indexes",
      "EXPLAIN and EXPLAIN ANALYZE for query performance",
      "Transactions: BEGIN, COMMIT, ROLLBACK, ACID properties",
      "Views and materialised views",
      "PostgreSQL-specific: JSONB queries, array types, COALESCE, NULLIF",
    ],

    resources: [
      {
        title:    "PostgreSQL Official Tutorial",
        url:      "https://www.postgresql.org/docs/current/tutorial.html",
        type:     "documentation",
        cost:     "Free",
        when:     "Week 9, Day 1",
        note: `
The authoritative source. Always start here.
Read Part I (The SQL Language) and Part II (Advanced Features) fully.
Bookmark the full docs at https://www.postgresql.org/docs/current/
and treat it as your permanent reference throughout Phase 2.
        `,
      },
      {
        title:    "freeCodeCamp — PostgreSQL Full Course for Beginners (Video)",
        url:      "https://www.youtube.com/watch?v=qw--VYLpxG4",
        type:     "video",
        duration: "~4 hrs",
        cost:     "Free",
        when:     "Week 9, Days 1–2",
        note: `
The most-watched free PostgreSQL video. Covers installation,
table creation, queries, joins, and more from absolute scratch.
Watch this as your first introduction before reading the docs.
Take notes and type every query along with the instructor.
        `,
      },
      {
        title:    "W3Schools PostgreSQL Tutorial (Interactive)",
        url:      "https://www.w3schools.com/postgresql/",
        type:     "interactive reference",
        cost:     "Free",
        when:     "Weeks 9–11, daily reference",
        note: `
Use as a quick syntax reference throughout Weeks 9–11.
Every concept has a live editor where you can test immediately.
Do not read it front to back — use it as a lookup when you
need a quick reminder of syntax during exercises.
        `,
      },
      {
        title:    "pgexercises.com — PostgreSQL Interactive Exercises",
        url:      "https://pgexercises.com/",
        type:     "interactive exercises",
        cost:     "Free",
        when:     "Weeks 9–11, daily practice",
        note: `
The best free SQL practice site specifically for PostgreSQL.
Built on a single realistic dataset (a DVD rental club).
Exercises progress from basic SELECT to complex window functions.

Target: complete ALL 80+ exercises by end of Week 11.
Do at least 5 exercises per day during Weeks 9–11.
Do not look at the answer until you have genuinely tried.
When you get it wrong, read the explanation carefully.
This site alone will take your SQL from intermediate to strong.
        `,
      },
      {
        title:    "Mode Analytics SQL Tutorial",
        url:      "https://mode.com/sql-tutorial/",
        type:     "interactive tutorial",
        cost:     "Free",
        when:     "Week 10",
        note: `
Excellent free interactive tutorial. You write SQL against
real datasets in the browser. No installation needed.
Covers: basic SQL, intermediate (joins, aggregations),
and advanced (window functions, performance tuning).
The Advanced SQL section is the free replacement for
paid window functions courses — it is thorough and practical.
Work through the Advanced section fully in Week 10.
        `,
      },
      {
        title:    "TechTFQ YouTube — SQL Window Functions Playlist",
        url:      "https://www.youtube.com/c/techTFQ/playlists",
        type:     "video",
        cost:     "Free",
        when:     "Week 10",
        note: `
The best free YouTube channel for advanced SQL.
Watch the Window Functions playlist (10+ videos) in Week 10.
TechTFQ explains PARTITION BY, ORDER BY, ROW_NUMBER, RANK,
LAG/LEAD, and running totals better than most paid courses.
Each video is 15–25 minutes with worked examples.
        `,
      },
      {
        title:    "sql-practice.online — CTE and Window Functions Exercises",
        url:      "https://www.sql-practice.online/scenario/ctes-window",
        type:     "interactive exercises",
        cost:     "Free — no signup required",
        when:     "Weeks 10–11",
        note: `
Free browser-based SQL exercises specifically for CTEs and
window functions. No account needed. 60+ problems.
Use these to drill window functions until they feel automatic.
Target: 20+ problems from this site by end of Week 11.
        `,
      },
      {
        title:    "DataLemur — SQL Practice Problems",
        url:      "https://datalemur.com/questions",
        type:     "interactive exercises",
        cost:     "Free",
        when:     "Weeks 9–20, daily (at least 2 problems/day)",
        note: `
Real SQL interview questions from Google, Meta, Amazon,
Microsoft, Uber, and other top companies.
Start at Easy, move to Medium when comfortable.
These are the actual questions you will face in data
engineering interviews. Doing 2 per day throughout Phase 2
gives you 240+ problems by the end — more than enough
to be interview-ready.
        `,
      },
      {
        title:    "Use the Index, Luke — SQL Indexing and Tuning (Free Book)",
        url:      "https://use-the-index-luke.com/",
        type:     "free online book",
        cost:     "Free",
        when:     "Week 11",
        note: `
The best free resource for understanding database performance.
Read the first 4 chapters in Week 11:
  Chapter 1: Anatomy of an Index
  Chapter 2: The Where Clause
  Chapter 3: Performance and Scalability
  Chapter 4: The Join Operation
After reading this, EXPLAIN ANALYZE output will make sense
and you will know why your queries are slow.
        `,
      },
      {
        title:    "DataTalks.Club Zoomcamp — Module 1: Docker + PostgreSQL",
        url:      "https://github.com/DataTalksClub/data-engineering-zoomcamp/tree/main/01-docker-terraform",
        type:     "video + hands-on lab",
        cost:     "Free",
        when:     "Week 9",
        note: `
The Zoomcamp's first module covers running PostgreSQL inside
Docker — which is exactly how you will use it throughout Phase 2.
Watch these videos to set up your local PostgreSQL environment
on Day 1 of Week 9. Follow along exactly.
        `,
      },
    ],

    practiceDatasets: [
      {
        name: "Pagila — DVD Rental Database",
        url:  "https://github.com/devrimgunduz/pagila",
        note: `
The standard PostgreSQL practice database.
15 tables with realistic relationships: customers, films,
actors, rentals, payments, staff, stores.
Install this on Day 1 of Week 9. Use it for all Week 9–10 exercises.
Every pgexercises.com problem uses this dataset.
        `,
      },
      {
        name: "Northwind Database (PostgreSQL port)",
        url:  "https://github.com/pthom/northwind_psql",
        note: `
Classic business database: orders, products, employees,
customers, suppliers. Good for practising complex JOINs
across many tables and writing business-style reports.
Use in Week 10 when you are comfortable with Pagila.
        `,
      },
    ],
  },

  // ============================================================
  // DOMAIN 2 — ETL/ELT Pipelines with Python
  // Weeks 12–13
  // ============================================================
  etl: {
    domain: "ETL/ELT Pipelines with Python",
    weeks:  "12–13",

    whyItMatters: `
ETL is the core daily work of a data engineer.
Every piece of data your organisation analyses went through
a pipeline that extracted it from somewhere, transformed it
into a usable shape, and loaded it into a destination.

Extract   → pull data from source (CSV, API, database, S3)
Transform → clean, validate, restructure, enrich the data
Load      → write to destination (data warehouse, database)

ELT is the modern variant used with cloud warehouses:
load raw data first, then transform it inside the warehouse
using SQL. This is what dbt does — you build ELT in Week 17.

Python is the dominant language for writing pipelines.
Key tools: pandas (transform), SQLAlchemy (load to DB),
requests (extract from APIs), psycopg2 (direct PostgreSQL).
    `,

    conceptsToMaster: [
      "ETL vs ELT — what each means and when to use each",
      "Idempotency — pipelines safe to re-run without side effects",
      "Incremental loading vs full refresh — tradeoffs",
      "Extracting from CSV files with pandas",
      "Extracting from REST APIs with requests",
      "Extracting from PostgreSQL with SQLAlchemy",
      "Transformation patterns: cleaning nulls, normalising strings, type casting",
      "Deduplication: removing duplicate records before loading",
      "Loading to PostgreSQL with df.to_sql() and SQLAlchemy",
      "Loading to BigQuery with pandas-gbq",
      "Error handling in pipelines: logging failures, partial loads",
      "Writing modular, testable pipeline code",
      "Pipeline project structure: extract.py, transform.py, load.py, main.py",
    ],

    resources: [
      {
        title:    "Airbyte — How to Build an ETL Pipeline in Python",
        url:      "https://airbyte.com/data-engineering-resources/python-etl",
        type:     "article",
        cost:     "Free",
        when:     "Week 12, Day 1",
        note: `
The most comprehensive free guide to building Python ETL pipelines.
Covers the full stack: pandas, SQLAlchemy, Airflow integration,
and scaling beyond pandas to tools like Polars and Spark.
Read this fully before writing any pipeline code in Week 12.
        `,
      },
      {
        title:    "freeCodeCamp — ETL Pipeline Tutorial (Video)",
        url:      "https://www.youtube.com/watch?v=OVcBZg4ZNOQ",
        type:     "video",
        duration: "~2 hrs",
        cost:     "Free",
        when:     "Week 12, Day 1",
        note: `
Build a real ETL pipeline from scratch in this hands-on video.
Watch this on the same day as the Airbyte article —
one gives you the mental model, the other shows you the code.
Type every line along with the instructor.
        `,
      },
      {
        title:    "Real Python — Python + SQLAlchemy Tutorial",
        url:      "https://realpython.com/python-sqlalchemy/",
        type:     "article",
        cost:     "Free",
        when:     "Week 12, Day 2",
        note: `
SQLAlchemy is the standard Python library for database connections.
This thorough Real Python article covers create_engine(),
executing queries, and using pandas df.to_sql() to load data.
Read this before writing your first pipeline's Load step.
        `,
      },
      {
        title:    "SQLAlchemy Official Docs — Engine Configuration",
        url:      "https://docs.sqlalchemy.org/en/20/core/engines.html",
        type:     "reference",
        cost:     "Free",
        when:     "Weeks 12–13, reference",
        note: `
Bookmark this. When your database connection string breaks or
you need to configure connection pooling, this is where you look.
Focus on: create_engine(), connection strings, and the
pandas df.to_sql() integration notes.
        `,
      },
      {
        title:    "Medium — Beginner-Friendly ETL Pipeline Guide (Python)",
        url:      "https://medium.com/@simranduggal75/beginner-friendly-etl-pipeline-guide-with-python-7968ec8289a4",
        type:     "article",
        cost:     "Free",
        when:     "Week 12, Day 2",
        note: `
Short, practical guide with complete working code.
Shows the exact pattern you will use most often:
read CSV with pandas → clean and transform → load to PostgreSQL.
The code is production-ready and well commented.
        `,
      },
      {
        title:    "Medium — The Python ETL Playbook: A Beginner's Guide",
        url:      "https://medium.com/@someshbgd3/the-python-etl-playbook-a-beginners-guide-to-etl-with-python-56bc4fe6f9d7",
        type:     "article",
        cost:     "Free",
        when:     "Week 13",
        note: `
A full project walkthrough: download Kaggle dataset → clean
with pandas → load to SQLite. Shows professional project
structure: separate files for extraction, transformation,
loading, and a main orchestrator. Use this as the template
for your Week 13 project.
        `,
      },
      {
        title:    "ProjectPro — How to Build an ETL Pipeline in Python",
        url:      "https://www.projectpro.io/article/how-to-build-an-etl-pipeline-in-python/1131",
        type:     "article",
        cost:     "Free",
        when:     "Week 13",
        note: `
Covers the full pipeline lifecycle including when to move
from pandas to larger tools like Dask or Spark.
Explains idempotency, incremental loading, and error
handling patterns that separate production pipelines
from student projects.
        `,
      },
      {
        title:    "Mage AI Blog — ETL Pipeline Architecture 101",
        url:      "https://www.mage.ai/blog/etl-pipeline-architecture-101-building-scalable-data-pipelines-with-python-sql-cloud",
        type:     "article",
        cost:     "Free",
        when:     "Week 13",
        note: `
Covers pipeline architecture decisions with honest commentary
about tradeoffs between tools. Includes complete code examples
for a pandas ETL pipeline with SQLAlchemy loading.
Good for understanding how to structure real pipeline projects.
        `,
      },
    ],
  },

  // ============================================================
  // DOMAIN 3 — Docker: Containerisation
  // Week 9 (Day 1, then used throughout)
  // ============================================================
  docker: {
    domain: "Docker",
    weeks:  "Week 9 Day 1 — then used throughout Phase 2",

    whyItMatters: `
Docker is how you run PostgreSQL, Airflow, Kafka, and every
other tool in this phase on your laptop without complex installation.

A Docker container packages your application and everything it
needs into a single portable unit. It runs identically on your
laptop, a teammate's machine, and a GCP cloud server.

In data engineering specifically:
  Run PostgreSQL locally:  docker run postgres
  Run Airflow locally:     docker compose up
  Package your pipeline:   docker build + docker run
  Deploy to GCP Cloud Run: push the Docker image

You cannot avoid Docker in data engineering.
Learn it on Day 1 of Week 9 — it will be used every week after.
    `,

    conceptsToMaster: [
      "Containers vs virtual machines — the key differences",
      "Images: read-only templates used to create containers",
      "Containers: running instances of an image",
      "Dockerfile: FROM, RUN, COPY, WORKDIR, CMD, EXPOSE instructions",
      "Building images: docker build -t my-image .",
      "Running containers: docker run, -p (ports), -v (volumes), -e (env vars)",
      "Docker Compose: defining multi-container apps in docker-compose.yml",
      "Volumes: persisting data outside the container lifecycle",
      "Networks: how containers communicate with each other",
      "Docker Hub: pulling public images (postgres, python, airflow)",
      "Running PostgreSQL with Docker: the exact commands you will use daily",
      "Running Airflow with Docker Compose: the standard local setup",
    ],

    resources: [
      {
        title:    "Docker Official Docs — Get Started Tutorial",
        url:      "https://docs.docker.com/get-started/",
        type:     "official tutorial",
        cost:     "Free",
        when:     "Week 9, Day 1",
        note: `
Do all 8 parts of the official Docker tutorial on Day 1 of Week 9.
It takes about 3 hours and covers everything you need:
containerise an app, build an image, use volumes, Docker Compose.
This is the most authoritative and well-maintained Docker resource.
Do not skip this — Docker underpins everything else in Phase 2.
        `,
      },
      {
        title:    "freeCodeCamp — Docker Tutorial for Beginners (Video)",
        url:      "https://www.youtube.com/watch?v=fqMOX6JJhGo",
        type:     "video",
        duration: "~2 hrs",
        cost:     "Free",
        when:     "Week 9, Day 1",
        note: `
The most-watched free Docker tutorial video. Covers installation,
images, containers, volumes, and Docker Compose with clear
explanations and visual demos. Watch this before the official docs
to build the mental model first.
        `,
      },
      {
        title:    "DataTalks.Club Zoomcamp — Module 1: Docker + PostgreSQL",
        url:      "https://github.com/DataTalksClub/data-engineering-zoomcamp/tree/main/01-docker-terraform",
        type:     "video + hands-on",
        cost:     "Free",
        when:     "Week 9, Days 1–2",
        note: `
The Zoomcamp's Docker module is specifically tailored for
data engineering use: running PostgreSQL in Docker, connecting
it to Python, and setting up pgAdmin in Docker Compose.
This is exactly the setup you will use throughout Phase 2.
Follow along precisely and keep the docker-compose.yml file
you create — it becomes your local development environment.
        `,
      },
      {
        title:    "Play with Docker — Free Browser-Based Lab",
        url:      "https://labs.play-with-docker.com/",
        type:     "interactive lab",
        cost:     "Free",
        when:     "Week 9, when you need a safe space to experiment",
        note: `
A full Docker environment in your browser — no installation needed.
Use this if you want to experiment with Docker commands without
risking breaking your local setup. Sessions last 4 hours.
Good for testing Dockerfiles before running them locally.
        `,
      },
      {
        title:    "KDnuggets — 5 Fun Docker Projects for Absolute Beginners",
        url:      "https://www.kdnuggets.com/5-fun-docker-projects-for-absolute-beginners",
        type:     "hands-on projects",
        cost:     "Free",
        when:     "Week 9, Days 3–4",
        note: `
Five progressive Docker projects, each teaching one core skill.
Do all 5 in order:
  1. Containerise a web server (learn Dockerfile basics)
  2. Multi-container app (learn Docker Compose)
  3. Persistent data (learn volumes)
  4. Environment variables (learn -e flag)
  5. Push to Docker Hub (learn image sharing)
By the end you will be comfortable with Docker in practice.
        `,
      },
    ],
  },

  // ============================================================
  // DOMAIN 4 — Apache Airflow: Pipeline Orchestration
  // Week 14
  // ============================================================
  airflow: {
    domain: "Apache Airflow",
    weeks:  "14",

    whyItMatters: `
A pipeline that only runs when you manually trigger it is not
a pipeline — it is a script. Airflow is what turns your scripts
into automated, monitored, scheduled workflows.

Airflow lets you define pipelines as DAGs (Directed Acyclic Graphs)
written in Python. Each node is a task. The edges define the order.

Airflow handles:
  Scheduling   → run at 6am every day
  Retries      → if a task fails, retry 3 times before alerting
  Logging      → see exactly what happened in every task run
  Dependencies → task B only runs after task A succeeds
  Monitoring   → a UI that shows you the status of every run

It is the most widely used pipeline orchestrator in the industry.
Every data engineering job description mentions Airflow.
Learning it in Week 14 immediately makes your CV stronger.
    `,

    conceptsToMaster: [
      "What a DAG is — Directed Acyclic Graph — and why acyclic matters",
      "Operators: PythonOperator, BashOperator, PostgresOperator, BigQueryOperator",
      "Task dependencies: >> and << operators, set_upstream/set_downstream",
      "Scheduling: cron syntax (0 6 * * 1-5 = 6am weekdays), preset schedules",
      "XComs: passing small values between tasks",
      "Airflow Variables: storing config values in the UI",
      "Airflow Connections: storing credentials for databases and APIs",
      "Sensors: FileSensor, HttpSensor — wait for external events",
      "Running Airflow locally with Docker Compose",
      "The Airflow UI: Gantt view, Graph view, Tree view, Logs",
      "Backfilling: running a DAG for historical dates",
      "Best practices: idempotent tasks, atomic tasks, small focused DAGs",
    ],

    resources: [
      {
        title:    "Apache Airflow Official Documentation — Tutorial",
        url:      "https://airflow.apache.org/docs/apache-airflow/stable/tutorial/index.html",
        type:     "official tutorial",
        cost:     "Free",
        when:     "Week 14, Day 1",
        note: `
Read the Fundamental Concepts page first:
https://airflow.apache.org/docs/apache-airflow/stable/core-concepts/index.html
Then do the official Tutorial (pipeline tutorial + taskflow tutorial).
Takes about 3 hours. This gives you the correct mental model
before watching any videos.
        `,
      },
      {
        title:    "freeCodeCamp — Apache Airflow Full Course (Video)",
        url:      "https://www.youtube.com/watch?v=K9AnJ9_ZAXE",
        type:     "video",
        duration: "~2.5 hrs",
        cost:     "Free",
        when:     "Week 14, Day 1",
        note: `
Covers email operators, Docker Compose integration, DAG structure,
REST API triggering, and ETL workflows with Airflow. Good hands-on
video to watch alongside the official docs. Type along with
every DAG the instructor writes.
        `,
      },
      {
        title:    "Airflow Tutorial For Beginners 2026 — Full Course (Video)",
        url:      "https://www.youtube.com/watch?v=IiczxlbQb8s",
        type:     "video",
        duration: "~3 hrs",
        cost:     "Free",
        when:     "Week 14, Day 2",
        note: `
Published February 2026 — the most current free Airflow tutorial.
Covers the latest Airflow features, Docker setup, and best practices
current for 2026. Watch this after the freeCodeCamp video for a
second perspective on the same concepts.
        `,
      },
      {
        title:    "DataTalks.Club Zoomcamp — Module 2: Workflow Orchestration",
        url:      "https://github.com/DataTalksClub/data-engineering-zoomcamp/tree/main/02-workflow-orchestration",
        type:     "video + hands-on lab",
        cost:     "Free",
        when:     "Week 14, Days 2–5",
        note: `
The Zoomcamp's orchestration module specifically covers
Airflow (or Kestra in newer cohorts) with GCP integration.
This is the most practical resource for Week 14 because it
shows you Airflow in the context of a real data pipeline
that loads to BigQuery — which is exactly what you will build.
Follow every step and keep your DAG file for your portfolio.
        `,
      },
      {
        title:    "Astronomer — DAG Best Practices (Official Guide)",
        url:      "https://docs.astronomer.io/learn/dag-best-practices",
        type:     "article",
        cost:     "Free",
        when:     "Week 14, Day 4",
        note: `
Astronomer is the company built around Apache Airflow.
Their documentation is the most authoritative source for
Airflow best practices after the official docs.
Read this after you have written your first 2–3 DAGs.
It will make you immediately write better pipelines.
        `,
      },
    ],
  },

  // ============================================================
  // DOMAIN 5 — GCP & BigQuery
  // Weeks 15–16
  // ============================================================
  gcpBigquery: {
    domain: "GCP & BigQuery",
    weeks:  "15–16",

    whyItMatters: `
BigQuery is Google Cloud's fully managed, serverless data warehouse.
It is one of the most important tools in modern data engineering.

Key properties that make BigQuery special:
  Serverless      → no infrastructure to manage or scale
  Columnar storage → analytic queries 10–100x faster than row stores
  Auto-scaling    → from 1 row to 1 trillion rows, same experience
  SQL-native      → everything you learned in PostgreSQL applies here
  Generous free tier:
    1 TB of queries per month — free forever
    10 GB of storage — free forever
    Public datasets — terabytes of real data to practice on

This means you can do everything in Weeks 15–16 at zero cost.
BigQuery is the destination for your ETL pipelines.
It is where your data warehouse lives.

GCP skills are in growing demand across Africa.
Google Cloud has active data centre regions in Johannesburg
and Nairobi, making it the natural cloud for African teams.
    `,

    conceptsToMaster: [
      "GCP console navigation and project setup",
      "IAM: roles, permissions, service accounts",
      "Cloud Storage (GCS): buckets, objects, lifecycle policies",
      "BigQuery: projects, datasets, tables, views",
      "Loading data into BigQuery: from GCS, from local CSV, from Python",
      "BigQuery SQL: standard SQL dialect differences from PostgreSQL",
      "Partitioning tables: partition by DATE for cost and performance",
      "Clustering: physical sort order for faster filtered queries",
      "Understanding costs: bytes processed, bytes billed",
      "Materialised views in BigQuery",
      "BigQuery from Python: using pandas-gbq and google-cloud-bigquery",
      "Looker Studio (free): connecting BigQuery and building dashboards",
      "Service accounts: authenticating Python scripts to GCP",
    ],

    resources: [
      {
        title:    "Google Cloud — BigQuery Official Documentation",
        url:      "https://cloud.google.com/bigquery/docs",
        type:     "official documentation",
        cost:     "Free",
        when:     "Weeks 15–16, permanent reference",
        note: `
Bookmark this. The official docs are excellent.
Start with: https://cloud.google.com/bigquery/docs/quickstarts/query-public-dataset-console
This gets you querying a public dataset in BigQuery within 5 minutes.
Then read: Loading Data, Partitioned Tables, and Clustered Tables sections.
        `,
      },
      {
        title:    "DataCamp — BigQuery Tutorial for Beginners (Free Article)",
        url:      "https://www.datacamp.com/tutorial/beginners-guide-to-bigquery",
        type:     "article",
        cost:     "Free",
        when:     "Week 15, Day 1",
        note: `
Written by a data engineer with 10+ years of BigQuery experience
who built a 10+ petabyte BigQuery data warehouse.
Covers: setup, free sandbox, SQL querying of public datasets,
partitioning, clustering, and cost management.
Read this first on Day 1 of Week 15 before touching the console.
        `,
      },
      {
        title:    "Google Cloud Skills Boost — BigQuery for Data Analysts (Quest)",
        url:      "https://www.cloudskillsboost.google/paths/1",
        type:     "interactive labs",
        cost:     "Free (with free credits Google provides to new accounts)",
        when:     "Week 15, Days 2–4",
        note: `
Google's own hands-on lab platform. New GCP accounts get free credits.
Complete the BigQuery for Data Analysts quest (5 labs).
These labs run in a real GCP environment — not a simulation.
You query real public datasets, load CSV data, and build views.
This is the best free hands-on BigQuery practice available.
        `,
      },
      {
        title:    "Coursera — Introduction to Data Engineering on Google Cloud (Free Audit)",
        url:      "https://www.coursera.org/learn/introduction-to-data-engineering-on-google-cloud",
        type:     "course (free to audit)",
        duration: "~10 hrs",
        cost:     "Free to audit — click 'Audit' not 'Enrol'",
        when:     "Weeks 15–16",
        note: `
Official Google course on Coursera. Covers BigQuery, GCS, ELT
architecture, and Dataform. The certificate costs money but
auditing the course (watching all videos) is completely free.
Click 'Audit' when prompted. Watch the lectures for Weeks 15–16.
        `,
      },
      {
        title:    "DataTalks.Club Zoomcamp — Module 3: Data Warehouse (BigQuery)",
        url:      "https://github.com/DataTalksClub/data-engineering-zoomcamp/tree/main/03-data-warehouse",
        type:     "video + hands-on lab",
        cost:     "Free",
        when:     "Week 16",
        note: `
The Zoomcamp's BigQuery module. Covers partitioning, clustering,
BigQuery ML, and cost management in detail with hands-on exercises.
This is your primary resource for Week 16. Follow every step
and replicate every query in your own BigQuery project.
        `,
      },
      {
        title:    "Dev.to — Ultimate Guide to Data Engineering on Google Cloud 2026",
        url:      "https://dev.to/tech_croc_f32fbb6ea8ed4/the-ultimate-guide-to-data-engineering-on-google-cloud-2026-30a7",
        type:     "article",
        cost:     "Free",
        when:     "Week 15, Day 1 (read alongside the DataCamp article)",
        note: `
Excellent 2026 overview of the full GCP data engineering stack:
BigQuery, Cloud Storage, Dataflow, Pub/Sub. Explains the
serverless-first philosophy of GCP that makes it different
from AWS. Read this for the big picture on Day 1 of Week 15.
        `,
      },
      {
        title:    "Medium — Introduction to Data Engineering in GCP",
        url:      "https://medium.com/@bijil.subhash/an-introduction-to-data-engineering-in-google-cloud-platform-35817b15c29e",
        type:     "article",
        cost:     "Free",
        when:     "Week 15",
        note: `
Clear explanation of every GCP data service and how they connect:
Cloud Storage → BigQuery → Dataflow → Pub/Sub → Vertex AI.
Read this to understand the full GCP data engineering ecosystem
beyond just BigQuery.
        `,
      },
    ],
  },

  // ============================================================
  // DOMAIN 6 — Data Modelling & Star Schema
  // Week 16 (alongside BigQuery)
  // ============================================================
  dataModelling: {
    domain: "Data Modelling & Star Schema",
    weeks:  "16",

    whyItMatters: `
Data modelling is how you design the structure of your warehouse.
The difference between a good and bad data model is the difference
between a query that takes 2 seconds and one that takes 2 minutes.

The Kimball Method (dimensional modelling / star schema) is the
dominant approach for analytics data warehouses in 2026.

Fact tables    → store measurable events (orders, transactions, visits)
Dimension tables → store descriptive context (customers, products, dates)

A star schema lets analysts write intuitive SQL, query performance
is fast, and the model is maintainable as the business evolves.
Every dbt project you build will implement a star schema.
Understanding this concept before Week 17 (dbt) is essential.
    `,

    conceptsToMaster: [
      "OLTP (transactional) vs OLAP (analytical) schema design",
      "Normalisation vs denormalisation: when each is appropriate",
      "Star schema: one fact table, multiple dimension tables",
      "Snowflake schema: normalised dimensions — when to use it",
      "Fact table types: transaction, periodic snapshot, accumulating snapshot",
      "Dimension table design: surrogate keys vs natural keys",
      "The date dimension: why every warehouse needs one",
      "Grain: precisely defining what one row in a fact table represents",
      "Slowly Changing Dimensions (SCD): Type 1, Type 2, Type 3",
      "Conformed dimensions: sharing dimensions across multiple fact tables",
      "Galaxy schema (fact constellation): multiple fact tables",
      "How star schema maps to dbt: stg_ → int_ → fct_ + dim_",
    ],

    resources: [
      {
        title:    "Datadef.io — Dimensional Modeling: The Definitive Guide (2026)",
        url:      "https://datadef.io/guides/en/dimensional-modeling",
        type:     "article",
        cost:     "Free",
        when:     "Week 16, Day 1",
        note: `
The most complete free guide to dimensional modelling in 2026.
Covers star schema, fact tables, dimension tables, SCD types,
and practical SQL examples throughout. Read this fully on
Day 1 of Week 16 before touching BigQuery or dbt.
Takes about 90 minutes to read carefully.
        `,
      },
      {
        title:    "YouTube — BI Data Modeling: Star Schema, Snowflake & Galaxy Explained",
        url:      "https://www.youtube.com/watch?v=TtxfKIe0HuQ",
        type:     "video",
        duration: "~30 mins",
        cost:     "Free",
        when:     "Week 16, Day 1 (watch before reading the articles)",
        note: `
Visual explanation using hand-drawn sketches.
Watch this first — it builds the visual mental model of
star schema in a way that text cannot. The sketch of a
fact table connected to dimension tables makes every article
about dimensional modelling immediately clear.
        `,
      },
      {
        title:    "MotherDuck — Star Schema Guide: Data Warehouse Modeling Explained",
        url:      "https://motherduck.com/learn/star-schema-data-warehouse-guide/",
        type:     "article",
        cost:     "Free",
        when:     "Week 16, Day 2",
        note: `
Practical guide with SQL examples showing exactly how to
create fact and dimension tables. Explains why star schema
outperforms 3NF in columnar databases like BigQuery.
The SQL examples map directly to what you will write in dbt.
        `,
      },
      {
        title:    "edudatasci.net — A Practical Introduction to Star Schema",
        url:      "https://edudatasci.net/2025/09/03/a-practical-introduction-to-star-schema-data-architecture/",
        type:     "article",
        cost:     "Free",
        when:     "Week 16, Day 2",
        note: `
Covers star schema, snowflake schema, and galaxy schema
(multiple fact tables) in a single readable article.
Includes guidance on when to use each approach and the
tradeoffs involved. Good for understanding the full design
decision space.
        `,
      },
      {
        title:    "Kimball Group — Dimensional Modelling Techniques",
        url:      "https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/",
        type:     "reference",
        cost:     "Free",
        when:     "Week 16, Days 3–4 (reference)",
        note: `
Ralph Kimball invented dimensional modelling. His technique
pages are the original canonical reference.
Read: Dimensional Modelling Techniques, SCD types, and
Fact Table Fundamentals. These are short focused pages —
each takes 10–15 minutes but teaches something essential.
        `,
      },
      {
        title:    "OWOX — Dimensional Data Modeling: 2025 Guide",
        url:      "https://www.owox.com/blog/articles/dimensional-data-modeling",
        type:     "article",
        cost:     "Free",
        when:     "Week 16, Day 3",
        note: `
Modern guide that bridges classical Kimball theory with
how dimensional modelling is implemented in cloud warehouses
like BigQuery in 2025–2026. Good for seeing how the theory
maps to actual modern practice.
        `,
      },
    ],
  },

  // ============================================================
  // DOMAIN 7 — dbt: Analytics Engineering
  // Week 17
  // ============================================================
  dbt: {
    domain: "dbt (Data Build Tool)",
    weeks:  "17",

    whyItMatters: `
dbt solved a problem that had plagued data teams for years:
SQL transformations were scattered, untested, undocumented,
and impossible to trust.

Before dbt: a SQL script in a folder no one could find,
modified by three people, with no tests, no documentation,
and nobody knowing what the numbers actually represented.

After dbt: SQL transformations are version-controlled in Git,
tested automatically (no nulls, no duplicates), documented with
a generated site, and deployed like software — with CI/CD.

dbt sits between raw data (in BigQuery) and your analytics layer.
It transforms raw tables into clean, tested, documented models.

The dbt + BigQuery combination is the standard modern data
stack in 2026. It is in the majority of data engineering and
analytics engineering job descriptions.

The good news: dbt's official free courses are genuinely
excellent. You do not need a paid course to master it.
    `,

    conceptsToMaster: [
      "What dbt solves and where it fits in the data stack",
      "dbt Core (free, CLI) vs dbt Cloud (hosted UI, free tier available)",
      "Project structure: dbt_project.yml, models/, seeds/, tests/, macros/",
      "Model naming: stg_ (staging), int_ (intermediate), fct_ + dim_ (marts)",
      "Materialisations: view, table, incremental, ephemeral",
      "Sources: declaring raw BigQuery tables in sources.yml",
      "ref() function: referencing other models, auto-managing dependencies",
      "The lineage DAG: dbt docs generate to visualise model dependencies",
      "Built-in tests: not_null, unique, accepted_values, relationships",
      "dbt-expectations package: 50+ additional tests",
      "Documentation: description fields in YAML, dbt docs serve",
      "Macros and Jinja: writing reusable SQL logic",
      "Incremental models: loading only new/changed records",
      "dbt Cloud: connecting to GitHub, scheduling runs",
      "dbt project with BigQuery: the exact workflow you will use",
    ],

    resources: [
      {
        title:    "dbt Learn — dbt Fundamentals (Official Free Course)",
        url:      "https://learn.getdbt.com/courses/dbt-fundamentals",
        type:     "official free course",
        duration: "~5 hrs",
        cost:     "Free — no payment required",
        when:     "Week 17, Days 1–3 (primary resource)",
        note: `
The official dbt free fundamentals course built by the dbt team.
Covers everything you need: project setup, models, sources,
tests, documentation, and deployment. Hands-on exercises
throughout. This is your PRIMARY resource for Week 17.
Complete this fully before moving to any other resource.
It is genuinely as comprehensive as any paid dbt course.
        `,
      },
      {
        title:    "dbt Official Docs — Quickstart for BigQuery",
        url:      "https://docs.getdbt.com/quickstarts/bigquery",
        type:     "official tutorial",
        cost:     "Free",
        when:     "Week 17, Day 1",
        note: `
Do this on Day 1 of Week 17 before starting the free course.
It connects dbt to your BigQuery project and runs your first
model in under 2 hours. This gives you a working project
to build on throughout the week.
        `,
      },
      {
        title:    "dbt Learn — Advanced dbt (Official Free Course)",
        url:      "https://learn.getdbt.com/",
        type:     "official free course",
        cost:     "Free",
        when:     "Week 17, Days 4–5",
        note: `
After completing dbt Fundamentals, take the Advanced course.
Covers: advanced testing, macros, incremental models,
materialisation strategies, and dbt Cloud CI/CD.
This is the content that paid Udemy courses charge for —
available free directly from dbt.
        `,
      },
      {
        title:    "DataTalks.Club Zoomcamp — Module 4: Analytics Engineering (dbt)",
        url:      "https://github.com/DataTalksClub/data-engineering-zoomcamp/tree/main/04-analytics-engineering",
        type:     "video + hands-on lab",
        cost:     "Free",
        when:     "Week 17, Days 2–4",
        note: `
The Zoomcamp's dbt module specifically covers dbt with BigQuery
in a complete data pipeline context. Videos are on YouTube.
This shows you dbt in the context of a real end-to-end pipeline
rather than in isolation — which is how you will actually use it.
        `,
      },
      {
        title:    "dbt Official Documentation",
        url:      "https://docs.getdbt.com/docs/introduction",
        type:     "permanent reference",
        cost:     "Free",
        when:     "Week 17 onwards — bookmark and use throughout",
        note: `
The most complete dbt reference. Every feature is documented here.
Key sections to read in Week 17:
  - Models: https://docs.getdbt.com/docs/build/models
  - Tests: https://docs.getdbt.com/docs/build/data-tests
  - Sources: https://docs.getdbt.com/docs/build/sources
  - Jinja/Macros: https://docs.getdbt.com/docs/build/jinja-macros
        `,
      },
      {
        title:    "dbt Discourse — Community Forum",
        url:      "https://discourse.getdbt.com/",
        type:     "community",
        cost:     "Free",
        when:     "Week 17 onwards — search before asking elsewhere",
        note: `
When you get stuck on a dbt problem, search here first.
The dbt core team and experienced practitioners answer questions.
Most issues you will face have already been asked and answered.
        `,
      },
    ],
  },

  // ============================================================
  // DOMAIN 8 — Data Quality with Great Expectations + dbt Tests
  // Week 18
  // ============================================================
  dataQuality: {
    domain: "Data Quality & Validation",
    weeks:  "18",

    whyItMatters: `
A single corrupt record can silently propagate errors through
your entire warehouse. Without automated checks, you only find
out something is wrong when a stakeholder notices wrong numbers.

Great Expectations (GX) is the standard Python data validation
library. You define what you expect from your data and run those
expectations automatically as part of your pipeline.

Combined with dbt tests, you get two layers of validation:
  Layer 1: dbt tests — validate transformed models in BigQuery
  Layer 2: Great Expectations — validate raw data before loading

Together they make your pipelines robust and your data trustworthy.
    `,

    conceptsToMaster: [
      "Why data quality matters in automated pipelines",
      "Types of quality issues: nulls, duplicates, type errors, outliers, referential integrity",
      "Great Expectations: data sources, expectation suites, checkpoints",
      "Common expectations: expect_column_to_not_be_null, expect_column_values_to_be_unique",
      "Running GX checkpoints inside an Airflow DAG",
      "dbt built-in tests: not_null, unique, accepted_values, relationships",
      "dbt-expectations package for advanced testing",
      "Data quality reporting: generating HTML validation reports",
      "Alerting: what to do when a quality check fails",
    ],

    resources: [
      {
        title:    "Great Expectations Official Docs — Quickstart",
        url:      "https://docs.greatexpectations.io/docs/",
        type:     "official documentation",
        cost:     "Free",
        when:     "Week 18, Day 1",
        note: `
Start with the Quickstart guide. It takes about 1 hour to get
a basic expectation suite running against a pandas DataFrame.
Then read the Core Concepts section to understand how
expectations, suites, checkpoints, and data sources connect.
        `,
      },
      {
        title:    "Real Python — Data Validation with Great Expectations",
        url:      "https://realpython.com/data-validation-great-expectations/",
        type:     "article",
        cost:     "Free",
        when:     "Week 18, Day 1",
        note: `
Step-by-step tutorial integrating Great Expectations with a
Python data pipeline. Covers: installing GX, creating expectations,
running validation, and generating HTML reports.
Read this alongside the official quickstart for Week 18.
        `,
      },
      {
        title:    "dbt Official Docs — Data Tests",
        url:      "https://docs.getdbt.com/docs/build/data-tests",
        type:     "reference",
        cost:     "Free",
        when:     "Week 18, Days 2–3",
        note: `
Complete guide to dbt testing. Covers built-in tests and how
to write custom singular and generic tests in SQL.
After reading this you will understand how to make your dbt
models self-validating — a skill that immediately distinguishes
your work from junior data engineers.
        `,
      },
      {
        title:    "dbt-expectations Package — GitHub",
        url:      "https://github.com/calogica/dbt-expectations",
        type:     "open source package",
        cost:     "Free",
        when:     "Week 18, Day 3",
        note: `
50+ Great Expectations-style tests ported into dbt.
Adds tests like: expect_column_values_to_be_between,
expect_table_row_count_to_be_between, expect_column_mean_to_be_between.
Install this in your dbt project and write at least 10 tests
using dbt-expectations during Week 18.
        `,
      },
    ],
  },

  // ============================================================
  // DOMAIN 9 — Apache Kafka: Streaming Data Fundamentals
  // Week 19
  // ============================================================
  kafka: {
    domain: "Apache Kafka: Streaming Fundamentals",
    weeks:  "19",

    whyItMatters: `
Everything you have built so far is BATCH processing:
your pipelines run on a schedule and process chunks of data.

Streaming is fundamentally different: data is processed
continuously, event by event, in real time. The difference
between checking your email once a day vs receiving
notifications the instant a message arrives.

Kafka is the dominant streaming platform in the industry.
It handles hundreds of billions of messages per day at
LinkedIn (where it was built), Netflix, Uber, and Airbnb.

For data engineering, Kafka enables:
  Real-time pipelines: events arrive in BigQuery within seconds
  Change Data Capture: stream database changes to the warehouse
  Event-driven systems: services that react to events instantly
  Real-time analytics: dashboards that update by the second

Week 19 covers fundamentals only. You do not need to master
Kafka internals at this stage — you need the concepts and
the ability to build basic producers and consumers.
The Zoomcamp module covers exactly the right depth.
    `,

    conceptsToMaster: [
      "Batch vs streaming: the fundamental architectural difference",
      "Kafka architecture: brokers, topics, partitions, offsets, replicas",
      "Producers: applications that publish events to Kafka topics",
      "Consumers: applications that subscribe and read events",
      "Consumer groups: parallelising consumption across instances",
      "Message retention: how long Kafka keeps messages",
      "Writing a Python Kafka producer with confluent-kafka library",
      "Writing a Python Kafka consumer with confluent-kafka library",
      "Kafka Connect: moving data between Kafka and external systems",
      "GCP Pub/Sub: Google's managed Kafka-equivalent service",
      "When to use streaming vs batch: the decision framework",
    ],

    resources: [
      {
        title:    "Confluent — Apache Kafka 101 (Free Official Course)",
        url:      "https://developer.confluent.io/courses/apache-kafka/events/",
        type:     "official free course",
        duration: "~3 hrs",
        cost:     "Free — Confluent is the company behind Kafka",
        when:     "Week 19, Days 1–2 (primary resource)",
        note: `
Built by Confluent, the company that maintains Apache Kafka.
This is the best free Kafka fundamentals course available.
Covers producers, consumers, topics, partitions, and consumer
groups with interactive exercises throughout.
Complete this fully before touching any code.
        `,
      },
      {
        title:    "Confluent — Kafka for Python Developers (Free Course)",
        url:      "https://developer.confluent.io/courses/kafka-python/intro/",
        type:     "official free course",
        duration: "~2 hrs",
        cost:     "Free",
        when:     "Week 19, Day 3",
        note: `
After the Kafka 101 course, this Python-specific course shows you
exactly how to write producers and consumers in Python using
the confluent-kafka library — which is what you will use in
your Week 19 project.
        `,
      },
      {
        title:    "DataTalks.Club Zoomcamp — Module 6: Stream Processing (Kafka)",
        url:      "https://github.com/DataTalksClub/data-engineering-zoomcamp/tree/main/06-streaming",
        type:     "video + hands-on lab",
        cost:     "Free",
        when:     "Week 19, Days 2–5",
        note: `
The Zoomcamp's Kafka module covers Kafka with Python and GCP
integration in a data engineering context. This is your
primary hands-on resource for Week 19. The exercises build
a producer and consumer pipeline that feeds into BigQuery.
Follow every step precisely.
        `,
      },
      {
        title:    "Apache Kafka Official Docs — Introduction",
        url:      "https://kafka.apache.org/documentation/#introduction",
        type:     "official documentation",
        cost:     "Free",
        when:     "Week 19, Day 1 (read before the courses)",
        note: `
Read the Introduction and the section on Use Cases.
Then read the Design section summary.
This gives you the correct mental model of why Kafka is
designed the way it is before you start writing code.
Takes about 45 minutes.
        `,
      },
      {
        title:    "DataCamp — Kafka Streams Tutorial",
        url:      "https://www.datacamp.com/tutorial/kafka-streams-tutorial",
        type:     "article",
        cost:     "Free",
        when:     "Week 19, Day 4",
        note: `
Covers Kafka Streams concepts and Python implementation.
Good supplement to the Confluent courses for understanding
stream processing patterns beyond basic producers/consumers.
        `,
      },
      {
        title:    "Medium — How to Use Kafka to Transform a Batch Pipeline into Real-Time",
        url:      "https://medium.com/@stephane.maarek/how-to-use-apache-kafka-to-transform-a-batch-pipeline-into-a-real-time-one-831b48a6ad85",
        type:     "article",
        cost:     "Free",
        when:     "Week 19, Day 5",
        note: `
By Stephane Maarek — one of the world's top Kafka educators.
This article shows how to convert a batch ETL pipeline into a
real-time streaming pipeline using Kafka. Directly relevant
to your Week 19 project. Read this before building the project.
        `,
      },
    ],
  },

  // ============================================================
  // DOMAIN 10 — Modern Data Stack & Phase 2 Capstone
  // Week 20
  // ============================================================
  modernDataStack: {
    domain: "Modern Data Stack & Capstone",
    weeks:  "20",

    whyItMatters: `
By Week 20 you have learned each tool individually.
This week is about seeing the complete picture.

The modern data stack is the connected system of tools that
most data teams use in 2026. Understanding how they fit together
is what lets you design systems rather than just use tools.

A typical modern stack looks like this:
  Sources → Ingestion (Airbyte/Fivetran) → Raw Storage (GCS)
  → Warehouse (BigQuery) → Transform (dbt) → BI (Looker Studio)
  + Orchestration (Airflow) + Quality (Great Expectations + dbt tests)
  + Streaming (Kafka/Pub/Sub)

Your capstone project this week connects as many of these
components as possible into a single end-to-end pipeline.
This is what future employers will look at and immediately recognise.
    `,

    resources: [
      {
        title:    "a16z — The Modern Data Stack: Past, Present, and Future",
        url:      "https://a16z.com/the-modern-data-stack/",
        type:     "article",
        cost:     "Free",
        when:     "Week 20, Day 1",
        note: `
The most-cited overview of the modern data stack.
Explains why the stack evolved, what each layer does, and
where it is heading. Read this in Week 20 to understand
the ecosystem you have built skills in.
        `,
      },
      {
        title:    "Airbyte — What is the Modern Data Stack?",
        url:      "https://airbyte.com/blog/modern-data-stack",
        type:     "article",
        cost:     "Free",
        when:     "Week 20, Day 1",
        note: `
Practical breakdown of each layer of the stack with tool options.
Good for understanding the alternatives to the tools you have
learned — knowing that Airflow can be replaced by Prefect or
Dagster, that BigQuery can be replaced by Snowflake or Redshift.
        `,
      },
      {
        title:    "DataQuest — The Data Engineering Roadmap for Beginners (2026)",
        url:      "https://www.dataquest.io/blog/the-data-engineer-roadmap-for-beginners/",
        type:     "article",
        cost:     "Free",
        when:     "Week 20 (review and reflection)",
        note: `
Read this at the end of Week 20 to review your journey.
It will now read very differently than if you had read it
in Week 9. Everything it describes you will have built.
This is a useful reflection exercise before starting Phase 3.
        `,
      },
    ],
  },

  // ============================================================
  // PRACTICE PLATFORMS — Use Throughout Phase 2
  // ============================================================
  practicePlatforms: [
    {
      name: "pgexercises.com",
      url:  "https://pgexercises.com/",
      cost: "Free",
      note: "80+ PostgreSQL exercises. Do ALL of them by end of Week 11.",
    },
    {
      name: "DataLemur — SQL Practice",
      url:  "https://datalemur.com/questions",
      cost: "Free",
      note: "Real company SQL interview questions. Do 2 per day throughout Phase 2.",
    },
    {
      name: "Mode Analytics SQL Tutorial",
      url:  "https://mode.com/sql-tutorial/",
      cost: "Free",
      note: "Interactive SQL with real data in the browser. Do the Advanced section fully in Week 10.",
    },
    {
      name: "sql-practice.online",
      url:  "https://www.sql-practice.online/",
      cost: "Free — no signup",
      note: "60+ SQL exercises including CTEs and window functions. Good daily supplement.",
    },
    {
      name: "LeetCode — Database Section",
      url:  "https://leetcode.com/problemset/database/",
      cost: "Free",
      note: "250+ SQL problems. Focus on Medium. Good for window functions and CTEs.",
    },
    {
      name: "StrataScratch",
      url:  "https://www.stratascratch.com/",
      cost: "Free tier available",
      note: "SQL and Python problems from real company interviews. Good window function practice.",
    },
    {
      name: "Google Cloud Skills Boost",
      url:  "https://www.cloudskillsboost.google/",
      cost: "Free credits for new accounts",
      note: "Real GCP labs. Complete the BigQuery and Data Engineering paths.",
    },
    {
      name: "Kaggle Datasets",
      url:  "https://www.kaggle.com/datasets",
      cost: "Free",
      note: "Source of real datasets for your ETL and analysis projects.",
    },
    {
      name: "Play with Docker",
      url:  "https://labs.play-with-docker.com/",
      cost: "Free",
      note: "Full Docker environment in your browser. 4-hour sessions.",
    },
  ],

  // ============================================================
  // YOUTUBE CHANNELS — Subscribe on Day 1 of Week 9
  // ============================================================
  youtubeChannels: [
    {
      name: "DataTalks.Club",
      url:  "https://www.youtube.com/@DataTalksClub",
      note: "All Zoomcamp lectures are here. Primary video resource for Phase 2.",
    },
    {
      name: "Seattle Data Guy",
      url:  "https://www.youtube.com/@SeattleDataGuy",
      note: "Best data engineering YouTube channel. Practical, no hype, no ads.",
    },
    {
      name: "Andreas Kretz — Learn Data Engineering",
      url:  "https://www.youtube.com/@andreaskayy",
      note: "Pipeline architecture, tool deep dives, career advice.",
    },
    {
      name: "TechTFQ",
      url:  "https://www.youtube.com/c/techTFQ",
      note: "Best channel for advanced SQL. Window functions explained better than any course.",
    },
    {
      name: "freeCodeCamp",
      url:  "https://www.youtube.com/@freecodecamp",
      note: "Full free courses on Docker, PostgreSQL, Airflow. Search by tool name.",
    },
  ],

  // ============================================================
  // COMMUNITIES — Join These Immediately
  // ============================================================
  communities: [
    {
      name: "DataTalks.Club Slack",
      url:  "https://datatalks.club/slack",
      cost: "Free",
      note: `
Join immediately on Day 1 of Week 9.
Join channels: #course-data-engineering, #general-data-engineering.
When you get stuck on a tool or concept, ask here.
Thousands of practitioners including course authors answer questions.
This community is worth more than any paid forum.
      `,
    },
    {
      name: "dbt Community Slack",
      url:  "https://www.getdbt.com/community/join-the-community",
      cost: "Free",
      note: "Join when you start Week 17. Active dbt community with fast, expert answers.",
    },
    {
      name: "r/dataengineering",
      url:  "https://www.reddit.com/r/dataengineering/",
      cost: "Free",
      note: "Read daily. Tool comparisons, career questions, staying current with the field.",
    },
    {
      name: "Data Engineering Weekly Newsletter",
      url:  "https://www.dataengineeringweekly.com/",
      cost: "Free",
      note: "Subscribe now. Best newsletter for staying current on tools and the industry.",
    },
    {
      name: "dbt Blog",
      url:  "https://www.getdbt.com/blog/",
      cost: "Free",
      note: "Best source for analytics engineering and modern data stack updates. Subscribe.",
    },
  ],

  // ============================================================
  // FREE BOOKS & LONG-FORM READING
  // ============================================================
  freeReading: [
    {
      title: "Use the Index, Luke — SQL Indexing (Free Online Book)",
      url:   "https://use-the-index-luke.com/",
      note:  "Read Chapters 1–4 in Week 11. Makes query performance immediately understandable.",
    },
    {
      title: "DataQuest — Data Engineering Roadmap for Beginners 2026",
      url:   "https://www.dataquest.io/blog/the-data-engineer-roadmap-for-beginners/",
      note:  "Read at the start of Week 9 and again at the end of Week 20.",
    },
    {
      title: "Scaler — Ultimate AI Data Engineer Roadmap 2026",
      url:   "https://www.scaler.com/blog/data-engineer-roadmap/",
      note:  "Broad overview of the data engineering landscape. Read in Week 9.",
    },
    {
      title: "Datavidhya — Data Engineering Roadmap 2026",
      url:   "https://datavidhya.com/blog/data-engineering-roadmap-2026/",
      note:  "Covers tools, projects, and career path with 16 project ideas.",
    },
    {
      title: "Mage AI — ETL Pipeline Architecture 101",
      url:   "https://www.mage.ai/blog/etl-pipeline-architecture-101-building-scalable-data-pipelines-with-python-sql-cloud",
      note:  "Covers pipeline architecture decisions. Read in Week 13.",
    },
  ],

  // ============================================================
  // COST SUMMARY — Everything Is Free
  // ============================================================
  costSummary: {
    totalCost: "₦0 — $0 — Free",
    breakdown: `
Every resource in this file is completely free.

The learning path is:
  DataTalks.Club Zoomcamp → your primary curriculum (free)
  Official documentation → your permanent reference (free)
  pgexercises + DataLemur → your daily SQL practice (free)
  freeCodeCamp videos → your video supplements (free)
  Google Cloud free tier → your cloud environment (free)
  dbt Learn courses → your dbt training (free)
  Confluent free courses → your Kafka training (free)
  DataTalks.Club Slack → your expert community (free)

The only resource you may want to pay for eventually:
  GCP Professional Data Engineer certification exam (~$200)
  But pursue this AFTER Phase 2 and only if sponsored by an employer.
  Your portfolio projects will matter far more than the certificate.
    `,
    whatCostsMoney: `
Nothing in Phase 2 requires payment.

Certificates cost money. Skills do not.
Your GitHub portfolio of 12 projects is your certificate.
A live GCP deployment with a URL is more impressive
to a technical interviewer than a Coursera badge.

Build the projects. Ship them. Document them.
That is the free path to mastery.
    `,
  },

};

if (typeof module !== "undefined") {
  module.exports = { PHASE2_RESOURCES };
}
