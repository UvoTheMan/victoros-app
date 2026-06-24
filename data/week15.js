// ============================================================
// WEEK 15 — GCP Fundamentals + Cloud Storage (GCS)
// Days 71–75 | 21–25 September 2026
// Phase 2: Data Engineering Foundations
// ============================================================

const WEEK15 = [

  // ============================================================
  // DAY 71 — GCP Console, Projects & IAM Basics
  // ============================================================
  {
    id: "W15D1", week: 15, day: 1, phase: 2,
    phaseTitle: "Data Engineering Foundations",
    date: "2026-09-21",
    type: "lesson",
    topic: "GCP Console Navigation, Projects & IAM Fundamentals",
    duration: "2–3 hours",

    objectives: [
      "Create and navigate a GCP project from the console",
      "Explain IAM's core model: who can do what on which resource",
      "Create and assign roles to a service account",
      "Understand why least-privilege access matters in cloud environments",
    ],

    introduction: `
Everything has run on your laptop and Docker containers so far.
Starting today, you move into the actual cloud infrastructure
real data engineering teams use daily — Google Cloud Platform.
GCP has a generous free tier specifically built for learning (1TB
of BigQuery queries/month free, forever), and active data centres
in Johannesburg and Nairobi, making it a genuinely relevant
platform for African data teams, not just an abstract exercise.
    `,

    mentalModel: `
MENTAL MODEL — "Hospital Department Access Badges"

IAM (Identity and Access Management) is exactly like a hospital's
badge access system: not every staff member can enter every room
or pull every record. A badge (identity) gets specific PERMISSIONS
(roles) to specific AREAS (resources) — a pharmacist's badge opens
the pharmacy and lets them view medication records, but doesn't
grant access to HR's payroll system. GCP's IAM model works
identically: identities, roles, and resources, with access granted
deliberately rather than assumed.
    `,

    explanation: `
CREATING A GCP PROJECT
===========================
1. Go to console.cloud.google.com and sign in (new accounts get
   free trial credits)
2. Click the project dropdown -> "New Project"
3. Name it something clear, e.g. "victoros-hospital-de"
4. Note the auto-generated PROJECT ID — this is what you'll
   reference in code and CLI commands, distinct from the display
   name

EVERYTHING IN GCP LIVES INSIDE A PROJECT
=============================================
A project is the top-level container for billing, APIs enabled,
IAM permissions, and all resources (storage buckets, BigQuery
datasets, etc.) you create. Keeping learning/practice work in its
own dedicated project (rather than mixed into a "real" project)
is standard practice — it keeps costs, permissions, and cleanup
simple and contained.

THE IAM MODEL — WHO, WHAT, WHERE
=====================================
WHO    : a "principal" — a human user, a Google Group, or a
         SERVICE ACCOUNT (an identity for code/applications, not people)
WHAT   : a "role" — a named bundle of permissions (e.g. "BigQuery
         Data Viewer" bundles together several specific permissions)
WHERE  : the "resource" — a specific project, bucket, dataset, or
         table the role applies to

A "role binding" connects all three: "this service account" (who)
has "BigQuery Data Editor" (what) on "this specific dataset" (where).

SERVICE ACCOUNTS — IDENTITIES FOR CODE
============================================
A service account is how your Python scripts (today's loaders,
tomorrow's BigQuery pipelines) authenticate to GCP — never your
own personal Google login. Create one via:

IAM & Admin -> Service Accounts -> Create Service Account

Give it a clear name (e.g. "hospital-etl-pipeline"), then assign
ONLY the roles it actually needs — for example "Storage Object
Admin" if it needs to read/write GCS buckets, nothing broader.

LEAST PRIVILEGE — A CORE CLOUD SECURITY PRINCIPLE
=======================================================
Always grant the MINIMUM permissions actually required, never
broad roles like "Owner" or "Editor" out of convenience. A
pipeline that only reads from one bucket and writes to one
BigQuery dataset should have permissions scoped to exactly that —
not blanket project-wide access. If credentials are ever
compromised, narrow scoping limits the damage dramatically.

DOWNLOADING A SERVICE ACCOUNT KEY
=======================================
Service Accounts -> [your account] -> Keys -> Add Key -> Create
new key -> JSON

This downloads a JSON credentials file. NEVER commit this file to
GitHub — add it to .gitignore immediately. Treat it with the same
seriousness as a database password, because it functionally is one.
    `,

    clinicalConnection: `
Least-privilege IAM design is the digital equivalent of role-based
clinical access — a nursing student's badge shouldn't have the
same chart-editing permissions as an attending physician, even
though both legitimately need SOME access. Scoping a service
account's permissions tightly to only what a specific pipeline
needs follows that exact same principle, applied to cloud
infrastructure instead of a hospital building.
    `,

    example: `
# Using the gcloud CLI (install from cloud.google.com/sdk) as an
# alternative/complement to the console for these same tasks

# 1. Authenticate and set your active project
gcloud auth login
gcloud config set project victoros-hospital-de

# 2. Create a service account
gcloud iam service-accounts create hospital-etl-pipeline \\
    --display-name="Hospital ETL Pipeline"

# 3. Grant it a narrowly-scoped role (Storage Object Admin only,
#    not a broad Editor/Owner role)
gcloud projects add-iam-policy-binding victoros-hospital-de \\
    --member="serviceAccount:hospital-etl-pipeline@victoros-hospital-de.iam.gserviceaccount.com" \\
    --role="roles/storage.objectAdmin"

# 4. Generate and download a key for use in Python scripts
gcloud iam service-accounts keys create key.json \\
    --iam-account=hospital-etl-pipeline@victoros-hospital-de.iam.gserviceaccount.com

# 5. List current IAM bindings to verify what was granted
gcloud projects get-iam-policy victoros-hospital-de
    `,

    commonMistakes: [
      "Granting 'Owner' or 'Editor' roles to a service account out of convenience instead of scoping permissions to exactly what the pipeline needs.",
      "Committing a downloaded service account JSON key file to a GitHub repository — this is a serious credential leak, equivalent to publishing a password.",
      "Confusing the project display name with the project ID — CLI commands and code require the ID, which is often different from the friendly name you typed.",
      "Creating a brand-new service account for every small script instead of organising service accounts sensibly by purpose (e.g. one per pipeline or one per environment).",
    ],

    exercises: [
      "Create a new GCP project dedicated to this learning track, and note its project ID.",
      "Create a service account with a clear, descriptive name and grant it exactly one narrowly-scoped role using either the console or gcloud CLI.",
      "Download a JSON key for that service account, and immediately add it to a .gitignore file in a test repository to confirm it would never be accidentally committed.",
      "Write 2-3 sentences in your own words explaining what would go wrong, practically, if a service account were given the 'Owner' role instead of a narrowly scoped one.",
    ],

    resources: [
      {
        objective: "Set up your first GCP project and understand IAM",
        items: [
          { title: "Google Cloud — IAM Overview (Official Docs)", url: "https://cloud.google.com/iam/docs/overview", type: "reference", note: "Official explanation of the principal/role/resource model — read this before creating anything." },
          { title: "DataCamp — BigQuery Tutorial for Beginners (Free Article)", url: "https://www.datacamp.com/tutorial/beginners-guide-to-bigquery", type: "article", note: "Covers initial GCP/BigQuery setup and the free sandbox option — read the setup section today." },
        ],
      },
      {
        objective: "Practice hands-on with real GCP labs",
        items: [
          { title: "Google Cloud Skills Boost — BigQuery for Data Analysts (Quest)", url: "https://www.cloudskillsboost.google/paths/1", type: "interactive labs", note: "Start this quest — new accounts receive free credits, and these run in a real GCP environment." },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 72 — Cloud Storage (GCS): Buckets, Objects, Lifecycle Policies
  // ============================================================
  {
    id: "W15D2", week: 15, day: 2, phase: 2,
    phaseTitle: "Data Engineering Foundations",
    date: "2026-09-22",
    type: "lesson",
    topic: "Cloud Storage (GCS): Buckets, Objects & Lifecycle Policies",
    duration: "2–3 hours",

    objectives: [
      "Create and configure a GCS bucket with appropriate settings",
      "Upload, download, and organise objects using gsutil and the console",
      "Apply storage classes appropriately based on access frequency",
      "Configure lifecycle policies to automate data retention and cost management",
    ],

    introduction: `
Google Cloud Storage (GCS) is where raw, unstructured, or
semi-structured data lives before (and often after) it's processed
— the cloud equivalent of a vast, organised filing system. It's
the standard landing zone for raw CSVs, JSON exports, and files
arriving from external systems, before they get loaded into
BigQuery. Today is about using GCS the way real data engineering
teams do, not just as generic file storage.
    `,

    mentalModel: `
MENTAL MODEL — "The Hospital's Records Warehouse, Not the Active Filing Cabinet"

GCS is like an enormous, secure off-site records warehouse — built
for storing huge volumes of files cheaply and durably, rather than
for fast day-to-day transactional access (that's what PostgreSQL
and BigQuery are for). Storage classes are like choosing between
"easily retrievable archive shelving" (Standard) versus "deep
long-term storage requiring advance notice to retrieve" (Archive)
— same warehouse, different cost/access tradeoffs depending on how
often you'll actually need that data back.
    `,

    explanation: `
CREATING A BUCKET
=====================
Bucket names must be GLOBALLY UNIQUE across all of GCS (not just
your project) — a common beginner surprise.

gcloud storage buckets create gs://victoros-hospital-raw-data \\
    --location=us-central1 \\
    --default-storage-class=STANDARD

Or via the console: Cloud Storage -> Buckets -> Create.

UPLOADING AND ORGANISING OBJECTS
=====================================
gcloud storage cp patient_intake.csv gs://victoros-hospital-raw-data/incoming/

gcloud storage cp -r ./local_folder gs://victoros-hospital-raw-data/archive/

GCS has no TRUE folder structure — object names like
"incoming/patient_intake.csv" just contain a "/" character, but
the console and tools display this AS IF it were a folder
hierarchy, which is a useful and standard convention to follow
even though it's technically just naming.

STORAGE CLASSES — MATCHING COST TO ACCESS PATTERN
=======================================================
STANDARD   : frequently accessed data, highest cost per GB, no
             retrieval fees, lowest latency
NEARLINE   : accessed roughly once a month or less, lower storage
             cost, small retrieval fee
COLDLINE   : accessed roughly once a quarter or less, lower still,
             higher retrieval fee
ARCHIVE    : accessed less than once a year, cheapest storage,
             highest retrieval fee and longer retrieval time

Choosing the WRONG class for your access pattern costs real money
either way — Standard for rarely-accessed archives wastes storage
spend; Archive for frequently-accessed data incurs surprising
retrieval fees.

LIFECYCLE POLICIES — AUTOMATING RETENTION
===============================================
A lifecycle policy automatically transitions or deletes objects
based on age or other conditions, without manual intervention:

# lifecycle.json
{
  "rule": [
    {
      "action": {"type": "SetStorageClass", "storageClass": "NEARLINE"},
      "condition": {"age": 30}
    },
    {
      "action": {"type": "Delete"},
      "condition": {"age": 365}
    }
  ]
}

gcloud storage buckets update gs://victoros-hospital-raw-data \\
    --lifecycle-file=lifecycle.json

This policy automatically moves objects to NEARLINE after 30 days
(since they're accessed less often by then), and deletes them
entirely after a year — exactly the kind of automated data
retention policy a real compliance-conscious organisation needs,
implemented without anyone manually managing it.

BUCKET-LEVEL PERMISSIONS
============================
Grant access at the bucket level using IAM, consistent with
yesterday's least-privilege principle:

gcloud storage buckets add-iam-policy-binding gs://victoros-hospital-raw-data \\
    --member="serviceAccount:hospital-etl-pipeline@victoros-hospital-de.iam.gserviceaccount.com" \\
    --role="roles/storage.objectAdmin"
    `,

    clinicalConnection: `
Lifecycle policies mirror real healthcare data retention
requirements directly — many jurisdictions mandate specific
retention periods for patient records, after which data must be
archived (cheaper, slower access) and eventually, by policy,
deleted. Automating this with a lifecycle policy removes the risk
of a compliance violation from someone simply forgetting to
manually archive or purge old records on schedule.
    `,

    example: `
# Full GCS workflow: create bucket, organise uploads, set lifecycle

# 1. Create the bucket
gcloud storage buckets create gs://victoros-hospital-raw-data \\
    --location=us-central1 \\
    --default-storage-class=STANDARD

# 2. Upload raw intake files into a clearly organised structure
gcloud storage cp patient_intake_2026-09-22.csv \\
    gs://victoros-hospital-raw-data/incoming/patients/

gcloud storage cp lab_results_2026-09-22.csv \\
    gs://victoros-hospital-raw-data/incoming/lab_results/

# 3. List what's in the bucket, confirming structure
gcloud storage ls gs://victoros-hospital-raw-data/incoming/ --recursive

# 4. Apply a lifecycle policy: move to NEARLINE after 30 days,
#    delete after 1 year
cat > lifecycle.json << 'EOF'
{
  "rule": [
    {"action": {"type": "SetStorageClass", "storageClass": "NEARLINE"},
     "condition": {"age": 30}},
    {"action": {"type": "Delete"}, "condition": {"age": 365}}
  ]
}
EOF

gcloud storage buckets update gs://victoros-hospital-raw-data \\
    --lifecycle-file=lifecycle.json

# 5. Verify the policy is attached
gcloud storage buckets describe gs://victoros-hospital-raw-data \\
    --format="default(lifecycle)"
    `,

    commonMistakes: [
      "Trying to create a bucket name already taken by ANYONE globally, not realising bucket names must be unique across all of GCS, not just your project.",
      "Choosing Standard storage for data accessed once a year, or Archive for data accessed daily — mismatching storage class to actual access pattern wastes money in both directions.",
      "Forgetting that GCS 'folders' are purely a naming convention (slashes in object names), not a true filesystem hierarchy — this matters when scripting against the API directly.",
      "Granting overly broad bucket permissions (e.g. project-wide Storage Admin) when a single bucket-scoped role would have been sufficient.",
    ],

    exercises: [
      "Create a GCS bucket with a clear, descriptive name and appropriate region setting.",
      "Upload at least 3 files into an organised folder-like structure (e.g. incoming/patients/, incoming/lab_results/) and list them recursively.",
      "Write a lifecycle policy that transitions objects to NEARLINE after 14 days and deletes them after 180 days, and apply it to your bucket.",
      "Grant your Day 1 service account a bucket-scoped (not project-wide) role on this specific bucket, and verify the binding with gcloud storage buckets get-iam-policy.",
    ],

    resources: [
      {
        objective: "Master GCS bucket creation and management",
        items: [
          { title: "Google Cloud — Cloud Storage Documentation", url: "https://cloud.google.com/storage/docs", type: "reference", note: "Official documentation — start with the Quickstart and Buckets sections." },
          { title: "DataTalks.Club Zoomcamp — Module 1: Docker + Terraform (GCS section)", url: "https://github.com/DataTalksClub/data-engineering-zoomcamp/tree/main/01-docker-terraform", type: "video + hands-on lab", note: "Covers initial GCS bucket setup as part of the broader infrastructure module." },
        ],
      },
      {
        objective: "Understand storage classes and lifecycle policies",
        items: [
          { title: "Google Cloud — Storage Classes (Official Docs)", url: "https://cloud.google.com/storage/docs/storage-classes", type: "reference", note: "Official comparison of Standard, Nearline, Coldline, and Archive with pricing implications." },
          { title: "Google Cloud — Object Lifecycle Management (Official Docs)", url: "https://cloud.google.com/storage/docs/lifecycle", type: "reference", note: "Official reference for writing and applying lifecycle policy rules." },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 73 — Python + GCS: Building a Data Lake Loader
  // ============================================================
  {
    id: "W15D3", week: 15, day: 3, phase: 2,
    phaseTitle: "Data Engineering Foundations",
    date: "2026-09-23",
    type: "lesson",
    topic: "Python + GCS: google-cloud-storage Client Library & Data Lake Concepts",
    duration: "2–3 hours",

    objectives: [
      "Authenticate Python scripts to GCS using a service account",
      "Upload, download, and list objects programmatically",
      "Explain the data lake concept and how it differs from a data warehouse",
      "Design a sensible raw/processed zone structure within a bucket",
    ],

    introduction: `
Yesterday was CLI and console. Today is the same operations, but
from Python — exactly how your Week 13-14 pipelines will actually
interact with GCS in production. You'll also formalise a concept
you've been implicitly building toward: the DATA LAKE, GCS's role
as the landing zone for raw data before it's structured into
BigQuery (your warehouse, starting next week).
    `,

    mentalModel: `
MENTAL MODEL — "The Receiving Dock vs the Organised Pharmacy Shelves"

A data lake (GCS) is like a hospital's receiving dock — everything
arrives here first, in whatever form it comes (boxes, varying
formats, sometimes messy), stored cheaply and durably, accepting
ANY file type without requiring a predefined structure. A data
warehouse (BigQuery, next week) is like the pharmacy's organised,
labelled shelving — highly structured, schema-enforced, optimised
for fast retrieval of SPECIFIC items. Data flows from the
receiving dock into organised shelving, not the other way around.
    `,

    explanation: `
AUTHENTICATING PYTHON TO GCS
=================================
pip install google-cloud-storage

import os
from google.cloud import storage

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "key.json"
client = storage.Client()

Setting GOOGLE_APPLICATION_CREDENTIALS to your downloaded service
account key file is the standard authentication pattern — the
client library automatically picks it up, the same way psycopg2
read environment variables for database credentials in Week 12.

UPLOADING FILES
===================
def upload_to_gcs(bucket_name: str, source_path: str, dest_blob_name: str) -> None:
    '''Upload a local file to a GCS bucket.'''
    client = storage.Client()
    bucket = client.bucket(bucket_name)
    blob = bucket.blob(dest_blob_name)
    blob.upload_from_filename(source_path)
    print(f"Uploaded {source_path} to gs://{bucket_name}/{dest_blob_name}")

upload_to_gcs(
    "victoros-hospital-raw-data",
    "patient_intake.csv",
    "incoming/patients/patient_intake_2026-09-23.csv",
)

DOWNLOADING FILES
=====================
def download_from_gcs(bucket_name: str, blob_name: str, dest_path: str) -> None:
    '''Download a GCS object to a local file.'''
    client = storage.Client()
    bucket = client.bucket(bucket_name)
    blob = bucket.blob(blob_name)
    blob.download_to_filename(dest_path)
    print(f"Downloaded gs://{bucket_name}/{blob_name} to {dest_path}")

LISTING OBJECTS
===================
def list_gcs_objects(bucket_name: str, prefix: str = "") -> list[str]:
    '''List all object names in a bucket, optionally filtered by prefix.'''
    client = storage.Client()
    blobs = client.list_blobs(bucket_name, prefix=prefix)
    return [blob.name for blob in blobs]

incoming_files = list_gcs_objects("victoros-hospital-raw-data", prefix="incoming/patients/")

READING DIRECTLY INTO PANDAS
================================
import pandas as pd

def read_csv_from_gcs(bucket_name: str, blob_name: str) -> pd.DataFrame:
    '''Read a CSV directly from GCS into a DataFrame, no local file needed.'''
    gcs_path = f"gs://{bucket_name}/{blob_name}"
    return pd.read_csv(gcs_path)

df = read_csv_from_gcs("victoros-hospital-raw-data", "incoming/patients/patient_intake.csv")
# pandas can read gs:// paths directly when gcsfs is installed
# (pip install gcsfs) — no manual download step required

DESIGNING A RAW/PROCESSED ZONE STRUCTURE
==============================================
A common, sensible data lake organisation pattern:

gs://victoros-hospital-raw-data/
├── raw/
│   ├── patients/2026-09-23/patient_intake.csv
│   └── lab_results/2026-09-23/lab_results.csv
├── processed/
│   ├── patients/2026-09-23/clean_patients.parquet
│   └── lab_results/2026-09-23/clean_lab_results.parquet
└── archive/
    └── ...older files moved here by lifecycle policy...

Keeping RAW data completely untouched, separate from PROCESSED
(cleaned) data, is a core data lake principle — it means you can
always re-run transformations from the original source if a bug
is found in your cleaning logic, without needing to re-extract
from the original system.
    `,

    clinicalConnection: `
Keeping raw, unmodified intake data permanently separate from
cleaned/processed data mirrors a hospital never overwriting the
original referral letter or lab requisition once it's been
transcribed into the chart — the original source document remains
available for reference or correction, exactly the same reasoning
behind preserving an immutable raw zone in a data lake.
    `,

    example: `
import os
import pandas as pd
from google.cloud import storage

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "key.json"

BUCKET_NAME = "victoros-hospital-raw-data"


def upload_to_gcs(source_path: str, dest_blob_name: str) -> None:
    client = storage.Client()
    bucket = client.bucket(BUCKET_NAME)
    blob = bucket.blob(dest_blob_name)
    blob.upload_from_filename(source_path)
    print(f"Uploaded to gs://{BUCKET_NAME}/{dest_blob_name}")


def list_raw_files(date_str: str) -> list[str]:
    client = storage.Client()
    blobs = client.list_blobs(BUCKET_NAME, prefix=f"raw/patients/{date_str}/")
    return [blob.name for blob in blobs]


def process_and_upload(date_str: str) -> None:
    '''Read a raw file, clean it, and upload the processed version
    to a separate processed/ zone, leaving the raw file untouched.'''
    raw_path = f"gs://{BUCKET_NAME}/raw/patients/{date_str}/patient_intake.csv"
    df = pd.read_csv(raw_path)     # requires gcsfs installed

    df["full_name"] = df["full_name"].str.strip().str.title()
    df = df.drop_duplicates(subset=["full_name", "date_of_birth"])

    local_temp = "/tmp/clean_patients.parquet"
    df.to_parquet(local_temp)
    upload_to_gcs(local_temp, f"processed/patients/{date_str}/clean_patients.parquet")


if __name__ == "__main__":
    today = "2026-09-23"
    upload_to_gcs("patient_intake.csv", f"raw/patients/{today}/patient_intake.csv")
    print("Raw files present:", list_raw_files(today))
    process_and_upload(today)
    `,

    commonMistakes: [
      "Overwriting or deleting raw data after processing it, losing the ability to re-run transformations from the original source if a bug is later discovered.",
      "Hardcoding the service account key file path directly rather than using the standard GOOGLE_APPLICATION_CREDENTIALS environment variable convention.",
      "Forgetting to install gcsfs when trying to read gs:// paths directly with pandas, causing a confusing error about an unsupported protocol.",
      "Mixing raw and processed data in the same prefix/folder, making it hard to tell at a glance what's safe to treat as a definitive source versus a derived, reproducible artifact.",
    ],

    exercises: [
      "Write upload_to_gcs() and download_from_gcs() functions and test them with a real file against your bucket from Day 2.",
      "Write list_gcs_objects() with a prefix filter, and use it to confirm files landed in the correct folder-like location.",
      "Set up a raw/ and processed/ structure in your bucket, write a process_and_upload() function that reads from raw, cleans, and writes to processed without touching the raw file.",
      "Write 2-3 sentences explaining, in your own words, why keeping raw data immutable and separate from processed data matters for a real pipeline.",
    ],

    resources: [
      {
        objective: "Use the Python GCS client library effectively",
        items: [
          { title: "Google Cloud — Cloud Storage Client Libraries (Python)", url: "https://cloud.google.com/storage/docs/reference/libraries", type: "reference", note: "Official reference for google-cloud-storage, including authentication setup." },
          { title: "DataTalks.Club Zoomcamp — Module 1 (GCS + Python integration)", url: "https://github.com/DataTalksClub/data-engineering-zoomcamp/tree/main/01-docker-terraform", type: "video + hands-on lab", note: "Shows Python-to-GCS integration in the context of a real pipeline." },
        ],
      },
      {
        objective: "Understand data lake architecture and zone design",
        items: [
          { title: "Coursera — Introduction to Data Engineering on Google Cloud (Free Audit)", url: "https://www.coursera.org/learn/introduction-to-data-engineering-on-google-cloud", type: "course (free to audit)", note: "Click 'Audit' to watch the lectures on data lake vs warehouse architecture for free." },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 74 — Authentication Patterns & Cloud Security Basics
  // ============================================================
  {
    id: "W15D4", week: 15, day: 4, phase: 2,
    phaseTitle: "Data Engineering Foundations",
    date: "2026-09-24",
    type: "lesson",
    topic: "Authentication Patterns: Service Accounts, Application Default Credentials & Security Hygiene",
    duration: "2–3 hours",

    objectives: [
      "Use Application Default Credentials (ADC) for local development",
      "Understand the credential precedence order GCP client libraries follow",
      "Apply secure secret management practices for cloud credentials",
      "Recognise and avoid the most common cloud credential leak patterns",
    ],

    introduction: `
You've been using a downloaded JSON key file directly so far —
functional, but not how most real teams authenticate day to day.
Today rounds out your GCP fundamentals with the authentication
patterns and security hygiene that separate "it works on my
machine" from genuinely safe, professional cloud practice — the
kind of judgment that matters enormously once real credentials
and real patient-adjacent data are involved.
    `,

    mentalModel: `
MENTAL MODEL — "The Master Key vs the Daily Sign-In Sheet"

A downloaded service account JSON key is like a physical master
key — powerful, dangerous if lost, and something you'd want to
minimise copies of. Application Default Credentials are more like
a daily sign-in sheet at a secure facility: your IDENTITY (already
verified once via gcloud auth login) is checked fresh each
session, without a literal physical key changing hands or sitting
around in a drawer (or, worse, a GitHub repository) waiting to be
found.
    `,

    explanation: `
APPLICATION DEFAULT CREDENTIALS (ADC)
==========================================
gcloud auth application-default login

This authenticates your LOCAL machine's gcloud CLI identity, and
client libraries automatically discover and use it — no JSON key
file needs to exist on disk for local development:

from google.cloud import storage
client = storage.Client()     # automatically uses ADC, no key file needed

CREDENTIAL PRECEDENCE ORDER
================================
GCP client libraries check, in order:
1. GOOGLE_APPLICATION_CREDENTIALS environment variable (a key file path)
2. Application Default Credentials (gcloud auth application-default login)
3. The metadata server (automatic, when running ON a GCP compute
   resource like Cloud Run or Compute Engine — no credentials file
   needed at all in that case)

Understanding this order explains why code that works locally
with a key file should generally ALSO work unmodified once
deployed to actual GCP infrastructure — the same client library
code adapts to whichever credential source is available.

SECRET MANAGEMENT — BEYOND JUST .gitignore
================================================
.gitignore prevents ACCIDENTAL commits, but a more robust pattern
for real projects is Google Secret Manager — storing sensitive
values (API keys, database passwords) in a dedicated, access-
controlled service rather than as files or environment variables
scattered across machines:

from google.cloud import secretmanager

def get_secret(project_id: str, secret_id: str, version: str = "latest") -> str:
    client = secretmanager.SecretManagerServiceClient()
    name = f"projects/{project_id}/secrets/{secret_id}/versions/{version}"
    response = client.access_secret_version(request={"name": name})
    return response.payload.data.decode("UTF-8")

db_password = get_secret("victoros-hospital-de", "hospital-db-password")

This is the production-grade evolution of the environment-variable
pattern from Phase 1 — centrally managed, access-controlled, and
auditable (you can see exactly who/what accessed a secret and when).

COMMON CREDENTIAL LEAK PATTERNS TO AVOID
==============================================
1. Committing a JSON key file to GitHub (even in a private repo —
   private repos can still be misconfigured or later made public)
2. Hardcoding API keys directly in source code "temporarily" and
   forgetting to remove them before committing
3. Printing credentials to logs for debugging and forgetting to
   remove the print statement
4. Sharing a .env file via chat/email instead of a proper secret
   management channel

KEY ROTATION
===============
Service account keys should be rotated (replaced) periodically,
and OLD keys explicitly deleted once no longer needed:

gcloud iam service-accounts keys list \\
    --iam-account=hospital-etl-pipeline@victoros-hospital-de.iam.gserviceaccount.com

gcloud iam service-accounts keys delete OLD_KEY_ID \\
    --iam-account=hospital-etl-pipeline@victoros-hospital-de.iam.gserviceaccount.com

A key that's been sitting unused and unrotated for months is a
larger, quieter risk than most teams realise — treat key rotation
as a routine maintenance task, not an emergency-only response.
    `,

    clinicalConnection: `
Rotating service account keys periodically is the cloud-security
equivalent of changing access codes after staff turnover at a
hospital — an old, never-revoked key (or door code) sitting around
indefinitely is exactly the kind of overlooked vulnerability that
turns a minor oversight into a real incident months later.
    `,

    example: `
# Local development setup using ADC instead of a key file

# 1. One-time setup
gcloud auth application-default login

# 2. Python code needs zero changes — same client library calls
#    automatically discover and use ADC
from google.cloud import storage

client = storage.Client()     # no GOOGLE_APPLICATION_CREDENTIALS needed
buckets = list(client.list_buckets())
for bucket in buckets:
    print(bucket.name)

# 3. Using Secret Manager for a database password instead of an
#    environment variable or hardcoded value
from google.cloud import secretmanager

def get_secret(project_id: str, secret_id: str) -> str:
    client = secretmanager.SecretManagerServiceClient()
    name = f"projects/{project_id}/secrets/{secret_id}/versions/latest"
    response = client.access_secret_version(request={"name": name})
    return response.payload.data.decode("UTF-8")

db_password = get_secret("victoros-hospital-de", "hospital-db-password")
# db_password is now available in memory only, never written to
# disk, an env file, or source code

# 4. Auditing and rotating an old key
# List existing keys for a service account
# gcloud iam service-accounts keys list --iam-account=...
# Delete a specific old key by its ID once confirmed unused
# gcloud iam service-accounts keys delete KEY_ID --iam-account=...
    `,

    commonMistakes: [
      "Using a downloaded JSON key file for local development indefinitely instead of switching to Application Default Credentials, leaving an unnecessary physical key file sitting on disk.",
      "Treating .gitignore as sufficient secret protection on its own, without considering more robust options like Secret Manager for genuinely sensitive production credentials.",
      "Never rotating or auditing old service account keys, leaving forgotten, unused keys as a long-term latent security risk.",
      "Printing credential values to logs or console output 'just to debug,' then forgetting to remove that line before the code is considered finished.",
    ],

    exercises: [
      "Set up Application Default Credentials locally and confirm a Python script using google-cloud-storage works without referencing a key file at all.",
      "Create a secret in Google Secret Manager and write a Python function that retrieves it, comparing this pattern to the environment-variable approach from Phase 1.",
      "List all keys for one of your service accounts using gcloud iam service-accounts keys list, and identify whether any are old enough to warrant rotation.",
      "Write a short security checklist (5-6 items) you'll personally follow before pushing any project involving cloud credentials to GitHub from now on.",
    ],

    resources: [
      {
        objective: "Understand GCP authentication patterns thoroughly",
        items: [
          { title: "Google Cloud — Authentication Methods Overview", url: "https://cloud.google.com/docs/authentication", type: "reference", note: "Official explanation of ADC, service account keys, and the credential precedence order." },
        ],
      },
      {
        objective: "Practice secure secret management",
        items: [
          { title: "Google Cloud — Secret Manager Documentation", url: "https://cloud.google.com/secret-manager/docs", type: "reference", note: "Official reference for creating, accessing, and rotating secrets." },
        ],
      },
      {
        objective: "Learn from real-world cloud credential leak incidents",
        items: [
          { title: "OWASP — Secrets Management Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html", type: "reference", note: "Authoritative, vendor-neutral guidance on secret management best practices." },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 75 — Week 15 Project: GCP Setup + Data Lake on GCS
  // ============================================================
  {
    id: "W15D5", week: 15, day: 5, phase: 2,
    phaseTitle: "Data Engineering Foundations",
    date: "2026-09-25",
    type: "project",
    topic: "Project: GCP Setup + Data Lake on GCS",
    duration: "3–4 hours",

    objectives: [
      "Set up a complete, properly secured GCP project from scratch",
      "Build a working raw/processed data lake structure in GCS",
      "Migrate part of your existing pipeline to read from and write to GCS",
      "Document IAM and security decisions clearly for portfolio review",
    ],

    introduction: `
This week's project consolidates everything from Monday through
Thursday into one deliverable: a properly configured GCP project
with least-privilege IAM, a sensibly organised data lake in GCS,
and a Python script that actually moves real data through it. This
also sets up next week's BigQuery work directly — the processed
zone you build today becomes BigQuery's primary load source.
    `,

    mentalModel: `
MENTAL MODEL — "Setting Up the New Wing Properly From Day One"

Setting up cloud infrastructure correctly from the start —
sensible naming, scoped permissions, clear raw/processed
separation — is like properly commissioning a new hospital wing
before patients arrive: get the access controls, storage layout,
and protocols right at the outset, rather than retrofitting
security and organisation onto a system that's already messy and
in active use. Today is commissioning your data lake correctly,
once.
    `,

    explanation: `
PROJECT BRIEF
================
Build "Hospital Data Lake Setup" with these components:

1. GCP PROJECT
   - A dedicated project with a clear name
   - At least 2 APIs enabled (Cloud Storage, BigQuery — enable
     BigQuery now even though you'll use it heavily next week)

2. IAM
   - One service account, named clearly for its purpose
   - Exactly the roles it needs (Storage Object Admin on your
     bucket specifically, not project-wide) — no broader roles
   - A downloaded key used ONLY for initial testing, then
     switched to Application Default Credentials for ongoing
     local development (document this transition in your README)

3. GCS BUCKET STRUCTURE
   - One bucket, sensibly named
   - raw/ and processed/ zones, each with at least 2 sub-categories
     (e.g. raw/patients/, raw/lab_results/)
   - A lifecycle policy: transition to NEARLINE after 30 days,
     delete after 1 year (or your own justified alternative
     thresholds, documented)

4. PYTHON MIGRATION
   - Take your Week 13-14 pipeline's extract step and modify it to
     read source CSVs from a GCS raw/ location instead of a local
     file path
   - Take the transform step's output and write it to a GCS
     processed/ location as Parquet (instead of, or in addition
     to, loading directly to PostgreSQL)
   - Use proper authentication (ADC for local dev) throughout

5. VERIFICATION
   - Upload at least 2 different raw datasets, run your modified
     pipeline, and confirm clean, processed Parquet files appear
     in the correct processed/ location
   - List bucket contents programmatically (not just via console)
     as part of your verification

DELIVERABLE
==============
1. setup.md documenting the GCP project, IAM bindings, and bucket
   structure decisions, including the ADC transition
2. The modified pipeline code (updated extract/transform functions)
3. README.md explaining the data lake design and how to reproduce
   the setup from scratch
4. Push to GitHub, ideally extending your Week 13-14 pipeline repo
    `,

    clinicalConnection: `
This project mirrors exactly the kind of foundational data
infrastructure decision a hospital's IT team makes when
commissioning a new records system — choosing sensible storage
zones, scoped access controls, and retention policies BEFORE real
patient data starts flowing through it, because retrofitting
proper security and organisation onto an already-active system is
always harder and riskier than designing it correctly from the
start.
    `,

    example: `
# Skeleton for the modified extract function, reading from GCS
# instead of a local file path

import os
import pandas as pd
from google.cloud import storage

BUCKET_NAME = "victoros-hospital-raw-data"


def extract_from_gcs_raw(date_str: str, dataset: str) -> pd.DataFrame:
    '''Extract raw data for a given date from the GCS raw/ zone.'''
    gcs_path = f"gs://{BUCKET_NAME}/raw/{dataset}/{date_str}/{dataset}.csv"
    df = pd.read_csv(gcs_path)     # requires gcsfs installed
    print(f"Extracted {len(df)} rows from {gcs_path}")
    return df


def write_to_gcs_processed(df: pd.DataFrame, date_str: str, dataset: str) -> None:
    '''Write cleaned data to the GCS processed/ zone as Parquet.'''
    local_temp = f"/tmp/clean_{dataset}.parquet"
    df.to_parquet(local_temp)

    client = storage.Client()
    bucket = client.bucket(BUCKET_NAME)
    blob_name = f"processed/{dataset}/{date_str}/clean_{dataset}.parquet"
    bucket.blob(blob_name).upload_from_filename(local_temp)
    print(f"Wrote {len(df)} clean rows to gs://{BUCKET_NAME}/{blob_name}")


if __name__ == "__main__":
    today = "2026-09-25"
    raw_patients = extract_from_gcs_raw(today, "patients")

    clean_patients = raw_patients.copy()
    clean_patients["full_name"] = clean_patients["full_name"].str.strip().str.title()
    clean_patients = clean_patients.drop_duplicates(subset=["full_name", "date_of_birth"])

    write_to_gcs_processed(clean_patients, today, "patients")
    `,

    commonMistakes: [
      "Continuing to use a downloaded key file for all local work instead of demonstrating the ADC transition specified in the brief.",
      "Designing the raw/processed structure but never actually proving it works end to end with a real pipeline run and real files.",
      "Granting the service account broader permissions than the bucket-scoped role actually required for this project's pipeline.",
      "Skipping the lifecycle policy entirely, missing the chance to demonstrate automated retention management as part of the deliverable.",
    ],

    exercises: [
      "Set up the complete GCP project, service account, and bucket structure exactly as specified in the brief.",
      "Migrate your pipeline's extract and transform-output steps to read from and write to the GCS raw/processed zones.",
      "Run the full migrated flow end to end with at least 2 different datasets, and verify the processed Parquet files programmatically.",
      "Write setup.md and README.md documenting every decision, then push the complete project to GitHub.",
    ],

    resources: [
      {
        objective: "Reference the complete GCP setup workflow",
        items: [
          { title: "DataTalks.Club Zoomcamp — Module 1: Docker + Terraform", url: "https://github.com/DataTalksClub/data-engineering-zoomcamp/tree/main/01-docker-terraform", type: "video + hands-on lab", note: "Covers GCP project setup, service accounts, and GCS together in one practical module." },
        ],
      },
      {
        objective: "Validate your IAM and security decisions",
        items: [
          { title: "Google Cloud — IAM Overview (Official Docs)", url: "https://cloud.google.com/iam/docs/overview", type: "reference", note: "Re-check your role bindings against least-privilege guidance before finalising." },
        ],
      },
      {
        objective: "Document the project clearly for portfolio review",
        items: [
          { title: "Make a README — README guide and templates", url: "https://www.makeareadme.com/", type: "article", note: "Use this structure for setup.md and README.md." },
        ],
      },
    ],
  },

];

if (typeof module !== "undefined") {
  module.exports = { WEEK15 };
}
