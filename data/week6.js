// ============================================================
// WEEK 6 — APIs, HTTP Requests, Secrets, Testing & Git
// Days 26–30 | 20–24 July 2026
// Phase 1: Python Mastery
// ============================================================

const WEEK6 = [

  // ============================================================
  // DAY 26 — HTTP & APIs
  // ============================================================
  {
    id: "W6D1", week: 6, day: 1, phase: 1,
    phaseTitle: "Python Mastery",
    date: "2026-07-20",
    type: "lesson",
    topic: "HTTP & APIs: requests Library, REST, Authentication",
    duration: "2–3 hours",

    objectives: [
      "Understand HTTP methods: GET, POST, PUT, DELETE",
      "Use the requests library to call real APIs from Python",
      "Handle API authentication using API keys and Bearer tokens",
      "Process API responses correctly and handle request errors",
    ],

    introduction: `
APIs are how virtually all modern software communicates. Your
future AI health agent calls the Claude API. Your payment flow
calls the Paystack API. Your Web3 work calls the Circle API.
Every meaningful integration in this entire roadmap depends on
being completely comfortable with this one skill.

This is one of the highest-leverage things you will learn in
Phase 1. It unlocks real-time data, AI services, payments,
blockchain interactions, and public health databases — all
through the same fundamental pattern you learn today.
    `,

    mentalModel: `
MENTAL MODEL — "Calling the Reference Lab"

Calling an API is exactly like phoning a reference laboratory
to request a result. You specify what you want (the URL and
parameters), you identify yourself so they know you're
authorised (the API key), and they send back a structured
report (the JSON response) which you then read and act on.

GET is "send me information." POST is "here is new information,
please record it." The lab doesn't care what you do with the
report once you have it — that part is entirely up to your
own code.
    `,

    explanation: `
HTTP METHODS
================
GET     → retrieve data (read-only, no side effects)
POST    → send data to create something new
PUT     → update an existing resource (replace it)
PATCH   → partially update an existing resource
DELETE  → remove a resource

THE requests LIBRARY
=======================
import requests

# GET request
response = requests.get(url, params={...}, headers={...})

# POST request
response = requests.post(url, json={...}, headers={...})

# Key parts of the response object
response.status_code   → 200 (OK), 404 (Not Found), 401 (Unauthorized)
response.json()        → parses the response body as JSON
response.text          → the raw text of the response
response.headers       → the response's HTTP headers

AUTHENTICATION PATTERNS
==========================
API key in a header:   headers = {"X-API-Key": "your_key"}
Bearer token:           headers = {"Authorization": "Bearer your_token"}
Basic auth:             requests.get(url, auth=("user", "password"))
    `,

    clinicalConnection: `
CLINICAL CONNECTION

When your AI health advisor (built starting in Phase 5, but
prototyped already in Week 6's project) needs to answer a
patient's question, it will send a POST request to the Claude
API containing the patient's question, and receive back a JSON
response containing Claude's clinically-informed answer.

Today's skill — constructing the request correctly, attaching
authentication, and safely parsing the response — is the exact
mechanism underneath that entire feature. Every "AI-powered"
claim you will ever make about software you build reduces to
this pattern at its core.
    `,

    example: `
# ── Day 26 Complete Example ──────────────────────────────
# pip install requests

import requests
import json

# --- GET: a free public API, no key required ---
def get_nigeria_health_stats():
    """Fetches Nigeria's COVID stats from the disease.sh API."""
    url = "https://disease.sh/v3/covid-19/countries/Nigeria"
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()   # raises an exception for 4xx/5xx responses

        data = response.json()
        print("=== Nigeria Health Stats ===")
        print(f"  Total Cases    : {data['cases']:,}")
        print(f"  Total Deaths   : {data['deaths']:,}")
        print(f"  Active Cases   : {data['active']:,}")
        return data

    except requests.exceptions.ConnectionError:
        print("No internet connection")
    except requests.exceptions.Timeout:
        print("Request timed out")
    except requests.exceptions.HTTPError as e:
        print(f"HTTP error: {e}")

get_nigeria_health_stats()

# --- GET with query parameters: OpenFDA drug database ---
def search_drug(drug_name, limit=3):
    """Searches the FDA drug label database for information."""
    url = "https://api.fda.gov/drug/label.json"
    params = {
        "search": f"openfda.generic_name:{drug_name}",
        "limit": limit
    }
    response = requests.get(url, params=params, timeout=10)

    if response.status_code == 200:
        results = response.json().get("results", [])
        print(f"\\n=== {drug_name.title()} Drug Info (OpenFDA) ===")
        for r in results:
            brand   = r.get("openfda", {}).get("brand_name", ["Unknown"])[0]
            purpose = r.get("purpose", ["Not listed"])[0][:120]
            print(f"  Brand: {brand}")
            print(f"  Purpose: {purpose}...\\n")
    elif response.status_code == 404:
        print(f"Drug '{drug_name}' not found")
    else:
        print(f"Error: {response.status_code}")

search_drug("metformin")

# --- POST: template for calling the Claude API ---
def call_ai_health_advisor(patient_query, api_key="YOUR_KEY_HERE"):
    """
    Template for calling the Claude API.
    This is exactly how your health advice agent will work later.
    """
    url = "https://api.anthropic.com/v1/messages"
    headers = {
        "x-api-key": api_key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
    }
    body = {
        "model": "claude-sonnet-4-6",
        "max_tokens": 1024,
        "messages": [
            {"role": "user", "content": f"As a clinical pharmacist, please advise: {patient_query}"}
        ]
    }
    # In a real call you would do:
    # response = requests.post(url, json=body, headers=headers)
    # return response.json()["content"][0]["text"]

    print("Claude API call template ready!")
    print("Body:", json.dumps(body, indent=2))

call_ai_health_advisor("Can a diabetic patient take ibuprofen safely?")

# --- Handling pagination across multiple pages of results ---
def get_all_results(base_url, params, max_pages=5):
    """Fetches multiple pages of an API's paginated results."""
    all_results = []
    params["skip"]  = 0
    params["limit"] = 100

    for page in range(max_pages):
        response = requests.get(base_url, params=params, timeout=10)
        if response.status_code != 200:
            break
        results = response.json().get("results", [])
        if not results:
            break
        all_results.extend(results)
        params["skip"] += 100
        print(f"Fetched page {page + 1}: {len(results)} results")

    return all_results
    `,

    commonMistakes: [
      {
        mistake: "Not handling network failures or timeouts",
        wrong:   "response = requests.get(url)   # crashes the whole program on timeout or no internet",
        right:   "try:\n    response = requests.get(url, timeout=10)\n    response.raise_for_status()\nexcept requests.exceptions.RequestException as e:\n    print(f'Request failed: {e}')",
        explanation: "Networks are inherently unreliable. Every real API call should be wrapped in error handling with an explicit timeout, or one slow/failed request can hang or crash your entire program.",
      },
      {
        mistake: "Hardcoding API keys directly in source code",
        wrong:   "api_key = 'sk-ant-abc123...'   # sitting in your .py file",
        right:   "import os\napi_key = os.environ.get('ANTHROPIC_API_KEY')",
        explanation: "Keys hardcoded in source code get exposed the moment that code is pushed to GitHub. Always load secrets from environment variables — covered in full tomorrow.",
      },
    ],

    exercises: [
      "Build a function that fetches the current USD/NGN exchange rate from a free API and uses it to convert a list of drug prices between currencies.",
      "Build a simple drug interaction checker that queries the OpenFDA API for two different drugs and displays their warning sections side by side.",
      "Set your Claude API key as an environment variable (preview of tomorrow's lesson) and make your very first successful real call to the Claude API from Python.",
    ],

    resources: [
      {
        objective: "Understand HTTP methods: GET, POST, PUT, DELETE",
        items: [
          { title: "Mozilla MDN — HTTP Request Methods", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods", type: "reference", note: "The clearest official reference for what each HTTP method means and when to use it." },
        ],
      },
      {
        objective: "Use the requests library to call real APIs from Python",
        items: [
          { title: "Real Python — Python's Requests Library (Guide)", url: "https://realpython.com/python-requests/", type: "article", note: "The most comprehensive free guide to the requests library, covering every concept in today's lesson." },
        ],
      },
      {
        objective: "Handle API authentication using API keys and Bearer tokens",
        items: [
          { title: "Anthropic API Documentation — Getting Started", url: "https://docs.anthropic.com/en/api/getting-started", type: "reference", note: "Your primary reference for authenticating with the Claude API specifically, which you will use for the rest of this roadmap." },
        ],
      },
      {
        objective: "Process API responses correctly and handle request errors",
        items: [
          { title: "OpenFDA API Documentation", url: "https://open.fda.gov/apis/drug/", type: "reference", note: "Free drug data API used throughout today's examples — no API key required for basic use." },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 27 — Environment Variables & Secrets Management
  // ============================================================
  {
    id: "W6D2", week: 6, day: 2, phase: 1,
    phaseTitle: "Python Mastery",
    date: "2026-07-21",
    type: "lesson",
    topic: "Environment Variables, .env Files & Secrets Management",
    duration: "1.5–2 hours",

    objectives: [
      "Store API keys and secrets safely using .env files",
      "Use python-dotenv to load environment variables into Python",
      "Configure .gitignore correctly so secrets never reach GitHub",
      "Validate that all required secrets are present at program startup",
    ],

    introduction: `
This is a short lesson but one of the most consequential in
the entire roadmap. Exposed API keys and database credentials
in public GitHub repositories have caused real security
breaches and unexpected financial bills for developers
worldwide — this is not a theoretical risk.

Your Claude API key, your Paystack secret key, your Circle API
key — none of these may ever appear directly in your source
code. You have already pushed several projects to GitHub.
Learning this properly now, before any of those projects touch
a real paid API, protects you completely going forward.
    `,

    mentalModel: `
MENTAL MODEL — "The Locked Drug Safe, Not the Open Shelf"

Your source code is the open shelf — visible to anyone who
walks past, including everyone who ever views your public
GitHub repository. Your API keys are controlled substances:
they belong in a separate, locked safe (the .env file) that
never leaves the premises (your .gitignore ensures it is never
copied into the public-facing shelf).

Your code asks the safe for the key at the moment it needs it,
uses it, and never writes it down anywhere visible.
    `,

    explanation: `
THE RULE
===========
Never put secrets directly in code. Always use environment variables.

.env FILE
============
A .env file stores key-value pairs in your project root:
  ANTHROPIC_API_KEY=sk-ant-xxxxx
  PAYSTACK_SECRET=sk_live_xxxxx
  DATABASE_URL=postgresql://...

This file lives in your project folder but is NEVER committed to Git.

python-dotenv
================
pip install python-dotenv

from dotenv import load_dotenv
import os

load_dotenv()                          # loads .env into the environment
api_key = os.getenv("ANTHROPIC_API_KEY")

.gitignore
=============
Create a .gitignore file in your project root containing at least:
  .env
  __pycache__/
  *.pyc
  venv/
  .DS_Store
    `,

    clinicalConnection: `
CLINICAL CONNECTION

Think of .env the way you think of a hospital's restricted drug
cabinet key: every authorised member of staff knows the
PROCEDURE to access it (load_dotenv() + os.getenv()), but the
key itself is never written on a sticky note taped to the
cabinet door (hardcoded in your source code) for anyone walking
past to see.

This habit matters even more once your projects start handling
real patient data or real payments — both of which begin
appearing from Phase 5 onward in your AI health advisor and
Web3 payment integration.
    `,

    example: `
# ── Day 27 Complete Example ──────────────────────────────

# Step 1: Create a .env file (NEVER commit this file to Git)
env_content = """
# Pharmacy App — Environment Variables
# NEVER commit this file to version control

ANTHROPIC_API_KEY=sk-ant-your-key-here
PAYSTACK_SECRET_KEY=sk_live_your-key-here
CIRCLE_API_KEY=your-circle-key-here
DATABASE_URL=postgresql://user:pass@localhost/pharmacy_db
PHARMACY_NAME=Victor's Community Pharmacy
DEBUG=False
"""
with open(".env", "w") as f:
    f.write(env_content)

# Step 2: Create a .gitignore
gitignore = """
# Secrets
.env
.env.local
*.env

# Python
__pycache__/
*.pyc
*.pyo
venv/
.venv/
*.egg-info/

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
"""
with open(".gitignore", "w") as f:
    f.write(gitignore)

# Step 3: Load and use the secrets
from dotenv import load_dotenv
import os

load_dotenv()   # reads .env and loads its contents into the environment

api_key       = os.getenv("ANTHROPIC_API_KEY")
pharmacy_name = os.getenv("PHARMACY_NAME", "Default Pharmacy")   # with a fallback
debug         = os.getenv("DEBUG", "False").lower() == "true"

print(f"Pharmacy: {pharmacy_name}")
print(f"Debug mode: {debug}")
print(f"API key loaded: {'Yes' if api_key else 'Missing!'}")

# Step 4: Validate all required secrets at startup
REQUIRED_ENV_VARS = ["ANTHROPIC_API_KEY", "PAYSTACK_SECRET_KEY"]

def validate_environment():
    """Checks that every required environment variable is set."""
    missing = [var for var in REQUIRED_ENV_VARS if not os.getenv(var)]
    if missing:
        raise EnvironmentError(
            f"Missing required environment variables: {', '.join(missing)}\\n"
            f"Create a .env file with these values before running this app."
        )
    print("✅ All required environment variables loaded.")

validate_environment()
    `,

    commonMistakes: [
      {
        mistake: "Accidentally committing .env to GitHub",
        wrong:   "git add .   # if .gitignore wasn't set up first, .env gets included",
        right:   "Create .gitignore BEFORE your first commit. Always run 'git status' before committing to double-check.",
        explanation: "Once an API key has been committed to a public repository — even briefly — treat it as permanently compromised and rotate it immediately, since bots actively scan GitHub for exposed keys within minutes.",
      },
    ],

    exercises: [
      "Set up your real Anthropic API key in a .env file, load it with python-dotenv, and make a successful test call to the Claude API using it.",
      "Write a startup validation function for a multi-service app (Claude API + Paystack + database) that checks all required environment variables exist and prints a clear, helpful error message naming exactly which ones are missing.",
    ],

    resources: [
      {
        objective: "Store API keys and secrets safely using .env files",
        items: [
          { title: "python-dotenv — PyPI Page", url: "https://pypi.org/project/python-dotenv/", type: "reference", note: "Official package page with installation instructions and basic usage examples." },
        ],
      },
      {
        objective: "Use python-dotenv to load environment variables into Python",
        items: [
          { title: "Real Python — Using python-dotenv for Configuration", url: "https://realpython.com/python-environment-variables/", type: "article", note: "Practical guide covering environment variables and .env files together with real examples." },
        ],
      },
      {
        objective: "Configure .gitignore correctly so secrets never reach GitHub",
        items: [
          { title: "GitHub Docs — Ignoring Files", url: "https://docs.github.com/en/get-started/getting-started-with-git/ignoring-files", type: "reference", note: "Official guide to .gitignore syntax and behaviour." },
          { title: "GitHub Docs — Removing Sensitive Data from a Repository", url: "https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository", type: "reference", note: "What to do if a secret has already been accidentally committed — read this even if you never expect to need it." },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 28 — Testing with pytest
  // ============================================================
  {
    id: "W6D3", week: 6, day: 3, phase: 1,
    phaseTitle: "Python Mastery",
    date: "2026-07-22",
    type: "lesson",
    topic: "Testing Your Code: unittest & pytest",
    duration: "2–3 hours",

    objectives: [
      "Understand why automated tests are essential, not optional",
      "Write test functions using pytest",
      "Use assertions and pytest.raises() effectively",
      "Test edge cases and error conditions deliberately, not just the happy path",
    ],

    introduction: `
Tests are what separate code that merely works today from code
that can be trusted to keep working as it changes. Every major
library you rely on — pandas, numpy, scikit-learn — ships with
an extensive test suite. This is not incidental; it is how
serious software is built.

In a health-adjacent context specifically, untested code is
genuinely dangerous, not just inconvenient. A dose calculation
with an off-by-one error, a drug interaction check that misses
a case, an AI agent that occasionally returns dangerously wrong
advice — these are not abstract bugs, they are patient safety
issues. Build the testing habit now, from the very start of
your career, rather than retrofitting it later.
    `,

    mentalModel: `
MENTAL MODEL — "Quality Control Before Dispensing"

No batch of compounded medication leaves a pharmacy without
quality control checks confirming it matches the intended
formulation. Tests are the equivalent quality control step
for code: before you trust a function with real data, you
verify it produces the correct output for known inputs —
including the tricky edge cases that are easy to get subtly
wrong (zero, negative numbers, missing data, boundary values).
    `,

    explanation: `
pytest
=========
pytest is the most widely used Python testing framework.
pip install pytest

Test functions must be named starting with test_
Run all tests in a file:  pytest filename.py
Run every test in the project:  pytest

ASSERTIONS
=============
assert condition, "message shown if it fails"
assert result == expected
assert result is not None
assert isinstance(result, list)

TESTING STRATEGY
===================
1. Test the HAPPY PATH first (normal input, expected output)
2. Test EDGE CASES (empty input, zero, boundary values)
3. Test ERROR CASES (invalid input should raise the right exception)

pytest.raises(ExceptionType) is used to assert that a specific
exception IS correctly raised by the code under test.
    `,

    clinicalConnection: `
CLINICAL CONNECTION

A function calculate_dose(age, weight, drug_name) for
pediatric weight-based dosing must be tested far beyond just
"does it give a sensible number for a typical 8-year-old."
You must also test: age = 0, age = 200, negative weight, an
unknown drug name, and the boundary exactly at age 12 (where
your logic switches from pediatric to adult dosing). These
edge cases are precisely where dosing errors hide, and a good
test suite catches them before any patient — real or simulated
— is ever affected.
    `,

    example: `
# ── Day 28 Complete Example ──────────────────────────────

# pharmacytools.py — the code under test
def calculate_dose(age, weight_kg, drug_name):
    """Calculates a pediatric dose using weight-based dosing."""
    dosing = {
        "Paracetamol":  15,   # mg per kg
        "Amoxicillin":  25,
        "Ibuprofen":    10,
    }
    if age < 0 or age > 120:
        raise ValueError(f"Invalid age: {age}")
    if weight_kg <= 0:
        raise ValueError(f"Invalid weight: {weight_kg}kg")
    if drug_name not in dosing:
        raise KeyError(f"Drug not in database: {drug_name}")

    if age >= 12:
        return None   # adults use a different dosing rule entirely

    return dosing[drug_name] * weight_kg


def clean_drug_name(name):
    """Standardises a drug name's formatting."""
    if not name or not isinstance(name, str):
        raise ValueError("Drug name must be a non-empty string")
    return name.strip().title()


# ============================================================
# test_pharmacytools.py — the test file
# ============================================================
import pytest

# --- Tests for calculate_dose ---
def test_calculate_dose_paracetamol_child():
    """Normal case: an 8-year-old, 25kg, given Paracetamol."""
    assert calculate_dose(8, 25, "Paracetamol") == 375   # 15 * 25

def test_calculate_dose_amoxicillin():
    assert calculate_dose(5, 20, "Amoxicillin") == 500    # 25 * 20

def test_calculate_dose_adult_returns_none():
    """Adults (12+) should return None — a different dosing rule applies."""
    assert calculate_dose(30, 70, "Paracetamol") is None

def test_calculate_dose_invalid_age_negative():
    with pytest.raises(ValueError, match="Invalid age"):
        calculate_dose(-1, 20, "Paracetamol")

def test_calculate_dose_invalid_age_too_high():
    with pytest.raises(ValueError):
        calculate_dose(200, 70, "Paracetamol")

def test_calculate_dose_invalid_weight():
    with pytest.raises(ValueError, match="Invalid weight"):
        calculate_dose(8, -5, "Paracetamol")

def test_calculate_dose_unknown_drug():
    with pytest.raises(KeyError):
        calculate_dose(8, 25, "UnknownDrug")

def test_calculate_dose_boundary_age_12():
    """Age exactly 12 should already use the adult rule (None)."""
    assert calculate_dose(12, 40, "Paracetamol") is None

def test_calculate_dose_boundary_age_11():
    """Age 11 (just under the boundary) should still use pediatric dosing."""
    assert calculate_dose(11, 35, "Paracetamol") == 525   # 15 * 35

# --- Tests for clean_drug_name ---
def test_clean_drug_name_strips_spaces():
    assert clean_drug_name("  metformin  ") == "Metformin"

def test_clean_drug_name_title_case():
    assert clean_drug_name("ASPIRIN") == "Aspirin"

def test_clean_drug_name_empty_raises():
    with pytest.raises(ValueError):
        clean_drug_name("")

def test_clean_drug_name_none_raises():
    with pytest.raises(ValueError):
        clean_drug_name(None)

# Run with: pytest test_pharmacytools.py -v
    `,

    commonMistakes: [
      {
        mistake: "Only testing the happy path",
        wrong:   "Just testing age=30, normal weight, a known drug name",
        right:   "Also test: age=0, age=120, age=-1, weight=0, an unknown drug, and the exact boundary (age=12 vs age=11)",
        explanation: "Bugs overwhelmingly hide in boundary values and invalid inputs. A test suite that only checks the obvious case provides very little real protection.",
      },
      {
        mistake: "Writing tests only after a bug is discovered in production",
        wrong:   "Write code → find a bug → fix it → move on without adding a test",
        right:   "Write code → write tests covering normal, boundary, and error cases → tests catch regressions automatically in future",
        explanation: "Tests written after the fact only protect against that one specific bug. Tests written proactively, covering a wide range of cases, protect against an entire category of future mistakes.",
      },
    ],

    exercises: [
      "Write a full test suite (at least 15 test functions) for your Week 2 inventory management system, covering normal operation, edge cases, and every custom exception it can raise.",
      "Practice Test-Driven Development: write the tests FIRST for a new function dose_range_checker(drug, dose), then write the function itself until every test passes.",
      "Add pytest to one of your existing GitHub projects and write at least 10 meaningful tests for its core functions.",
    ],

    resources: [
      {
        objective: "Understand why automated tests are essential, not optional",
        items: [
          { title: "CS50P — Week 5: Unit Tests", url: "https://cs50.harvard.edu/python/2022/weeks/5/", type: "video", duration: "~2 hrs", note: "Harvard's introduction to why and how to test Python code, building the concept from first principles." },
        ],
      },
      {
        objective: "Write test functions using pytest",
        items: [
          { title: "pytest Official Documentation", url: "https://docs.pytest.org/en/stable/", type: "reference", note: "The authoritative reference for pytest, including fixtures, parametrization, and configuration." },
          { title: "Real Python — Getting Started With Testing in Python", url: "https://realpython.com/python-testing/", type: "article", note: "Comprehensive introduction to testing in Python, including both unittest and pytest." },
        ],
      },
      {
        objective: "Use assertions and pytest.raises() effectively",
        items: [
          { title: "pytest Docs — Assertions About Expected Exceptions", url: "https://docs.pytest.org/en/stable/how-to/assert.html#assertions-about-expected-exceptions", type: "reference", note: "Official documentation specifically on testing that exceptions are correctly raised." },
        ],
      },
      {
        objective: "Test edge cases and error conditions deliberately, not just the happy path",
        items: [
          { title: "Real Python — Effective Python Testing With pytest", url: "https://realpython.com/pytest-python-testing/", type: "article", note: "Covers test organisation strategy, including how to systematically think through edge cases." },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 29 — Git & GitHub Deep Dive
  // ============================================================
  {
    id: "W6D4", week: 6, day: 4, phase: 1,
    phaseTitle: "Python Mastery",
    date: "2026-07-23",
    type: "lesson",
    topic: "Git & GitHub: Version Control for Data Scientists",
    duration: "2–3 hours",

    objectives: [
      "Master the core Git workflow: add, commit, push, pull",
      "Use branching for organised feature development",
      "Write clear, professional commit messages",
      "Push files to GitHub programmatically using the GitHub API",
    ],

    introduction: `
You already have a GitHub account and have been pushing
projects regularly. Today goes deeper: branching, the
professional commit workflow, and — directly relevant to
VictorOS itself — pushing files to a repository programmatically
through the GitHub API, which is exactly the mechanism behind
this very app's GitHub sync feature.

For a data scientist specifically, Git is essential for
tracking which exact version of your code produced which
results, rolling back safely when an analysis breaks, and
presenting a clean, professional history to anyone reviewing
your portfolio. The GitHub portfolio you are building right
now effectively functions as your CV's most important section.
    `,

    mentalModel: `
MENTAL MODEL — "The Hospital Audit Trail"

Git is an audit trail for your code, just like the audit trail
a hospital's EMR keeps for every chart edit: who changed what,
when, and why. A branch is a working draft of a patient's care
plan you are revising before formally adding it to their
official record — you can experiment freely on the branch, and
only merge it into the main record once you are confident it
is correct.
    `,

    explanation: `
CORE WORKFLOW
================
git init                → initialise a brand-new repository
git add file.py         → stage a specific file
git add .               → stage every changed file
git commit -m "message" → commit the staged changes
git push origin main    → push your commits to GitHub
git pull origin main    → fetch and merge the latest from GitHub

BRANCHING
============
git branch feature-name          → create a new branch
git checkout feature-name        → switch to that branch
git checkout -b feature-name     → create AND switch in one step
git merge feature-name           → merge that branch into the current one

PROFESSIONAL COMMIT MESSAGES
===============================
Bad:  "fixed stuff"
Bad:  "update"
Good: "Add dose validation to calculate_dose function"
Good: "Fix KeyError in formulary lookup when drug not found"
Good: "Refactor Drug class to use __slots__ for memory efficiency"

Format: <verb> <what changed> [optionally: why]
Common verbs: Add, Fix, Update, Remove, Refactor, Test, Document

THE GITHUB API — pushing files programmatically
==================================================
Beyond the command-line git tool, GitHub also exposes a full
REST API that lets your OWN code create and update files in a
repository directly over HTTP. This is exactly how VictorOS's
"Push to GitHub" button works: it builds a request, encodes
your content, and sends it to GitHub's API using exactly the
requests skills from Day 26.
    `,

    clinicalConnection: `
CLINICAL CONNECTION

Every week of this roadmap that you complete should result in
a commit — a permanent, timestamped record of exactly what you
built and when, in your own words. Six months from now, your
GitHub history becomes the most credible evidence of your
pivot from pharmacy into data science: not a claim on a CV, but
a verifiable timeline of real, working code, written
consistently over many months.
    `,

    example: `
# ── Day 29 — Git Commands Reference & GitHub API ──────────

# --- Initial one-time setup ---
# git config --global user.name "Victor Okolie"
# git config --global user.email "your@email.com"

# --- Starting a brand-new project ---
# mkdir my-project && cd my-project
# git init
# (create .gitignore FIRST, before anything else)
# git add .gitignore
# git commit -m "Initial commit: add .gitignore"

# --- Standard daily workflow ---
# git pull origin main                          # get the latest first
# git checkout -b week6-api-integration          # create a feature branch
# git add pharmacy_api.py
# git commit -m "Add OpenFDA drug search integration"
# git add tests/test_api.py
# git commit -m "Add 15 test cases for OpenFDA search function"
# git push origin week6-api-integration
# (then open a Pull Request on GitHub and merge to main)

# --- Useful everyday commands ---
# git status            → see exactly what has changed
# git log --oneline     → view a compact commit history
# git diff               → see the exact line-by-line changes
# git stash              → temporarily shelve uncommitted changes

# --- Standard .gitignore for data science projects ---
gitignore_ds = """
# Environment
.env
venv/
.venv/

# Data files (often too large or sensitive for GitHub)
*.csv
*.xlsx
data/raw/
data/processed/

# Jupyter
.ipynb_checkpoints/

# Python
__pycache__/
*.pyc
*.egg-info/

# Models
*.pkl
*.joblib
*.h5

# System
.DS_Store
Thumbs.db
"""
print(gitignore_ds)

# --- Pushing a file to GitHub programmatically via the API ---
import requests
import base64
import os

def push_to_github(filename, content, repo="UvoTheMan/ds-ai-roadmap-progress",
                    token=None, commit_message=None):
    """
    Pushes a file to a GitHub repository via the REST API.
    This is exactly the mechanism behind VictorOS's GitHub sync.
    """
    if not token:
        token = os.getenv("GITHUB_TOKEN")

    url = f"https://api.github.com/repos/{repo}/contents/{filename}"
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github.v3+json"
    }

    # Check if the file already exists (its SHA is required to update it)
    existing = requests.get(url, headers=headers)
    sha = existing.json().get("sha") if existing.status_code == 200 else None

    encoded = base64.b64encode(content.encode()).decode()

    body = {
        "message": commit_message or f"Update {filename}",
        "content": encoded,
    }
    if sha:
        body["sha"] = sha   # required when updating an existing file

    response = requests.put(url, json=body, headers=headers)

    if response.status_code in (200, 201):
        print(f"✅ Pushed {filename} to GitHub")
        return True
    else:
        print(f"❌ Failed: {response.json().get('message')}")
        return False

# Example usage:
# push_to_github(
#     "progress/week6/project-log.md",
#     "# Week 6 Project\\n\\n## What I built today...",
#     commit_message="Week 6 project log: API integration"
# )
    `,

    commonMistakes: [
      {
        mistake: "Vague, uninformative commit messages",
        wrong:   '"fixed stuff" / "update" / "asdf"',
        right:   '"Fix KeyError in formulary lookup when drug not found"',
        explanation: "Six months from now, your commit history is the only record of why a change was made. Vague messages turn that history into useless noise.",
      },
      {
        mistake: "Forgetting to pull before starting new work",
        wrong:   "Starting to edit files without first running git pull",
        right:   "Always git pull origin main first, especially when working across multiple devices",
        explanation: "Skipping this step risks working on outdated code and creating painful merge conflicts later.",
      },
    ],

    exercises: [
      "Revisit your 3 earliest GitHub projects from Weeks 1–3 and improve their READMEs: add a clear description, setup instructions, usage examples, and a sample output screenshot.",
      "Create the 'ds-ai-roadmap-progress' repository on GitHub if you haven't already, and manually push your first progress log entry to it.",
      "Practice the full feature-branch workflow end to end: create a branch, make a small change, push the branch, and merge it via a Pull Request on GitHub.",
    ],

    resources: [
      {
        objective: "Master the core Git workflow: add, commit, push, pull",
        items: [
          { title: "GitHub's Git Handbook", url: "https://guides.github.com/introduction/git-handbook/", type: "article", note: "Concise, official introduction to the core Git workflow." },
        ],
      },
      {
        objective: "Use branching for organised feature development",
        items: [
          { title: "Atlassian — Git Branching Tutorial", url: "https://www.atlassian.com/git/tutorials/using-branches", type: "article", note: "Clear, visual explanation of branching and merging strategy." },
        ],
      },
      {
        objective: "Write clear, professional commit messages",
        items: [
          { title: "Conventional Commits Specification", url: "https://www.conventionalcommits.org/en/v1.0.0/", type: "reference", note: "A widely adopted standard for structuring commit messages professionally." },
        ],
      },
      {
        objective: "Push files to GitHub programmatically using the GitHub API",
        items: [
          { title: "GitHub REST API — Repository Contents", url: "https://docs.github.com/en/rest/repos/contents", type: "reference", note: "Official documentation for the exact API endpoint used in today's push_to_github() example." },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 30 — PROJECT: AI Health Advice API Client
  // ============================================================
  {
    id: "W6D5", week: 6, day: 5, phase: 1,
    phaseTitle: "Python Mastery",
    date: "2026-07-24",
    type: "project",
    topic: "PROJECT: AI Health Advice API Client",
    duration: "4–5 hours",

    objectives: [
      "Build a working Python client for the Claude API",
      "Implement proper error handling and basic retry logic",
      "Persist conversation history to a file",
      "Handle API keys securely using everything learned this week",
    ],

    introduction: `
This project is the direct seed of your eventual flagship AI
health advice agent, which you will build in full in Phase 5.
Today's version is intentionally a command-line tool — simple,
but built with genuinely correct foundations: secure key
handling, real error handling, and a system prompt that
establishes the assistant's role clearly.

Treat this project with real care. The architectural decisions
you make today — how you structure the conversation history,
how you separate concerns into files — will influence how
smoothly this evolves into a full web API in Phase 4 and then
a complete product in Phase 5.
    `,

    mentalModel: `
MENTAL MODEL — "The Locum Pharmacist on Call"

Think of this AI client as a locum pharmacist taking phone
queries: each call (each user message) needs context from
the conversation so far, a clear scope of what it can safely
advise on, and a written record afterward for accountability.
Your conversation history file is that written record.
    `,

    projectBrief: `
BUILD: A command-line AI health advice client using the Claude API.

REQUIRED FEATURES:
1. Multi-turn conversation — the agent remembers earlier
   messages in the same session (maintain a messages list and
   send the full history with every request)
2. A system prompt establishing the assistant as a Pharm.D-level
   clinical advisor, with appropriate scope and safety caveats
3. A simple rate limit: cap the session at 10 queries maximum
4. Basic cost tracking: estimate and display total tokens used
   (the API response includes usage data — read it and sum it)
5. Save the full conversation history to a JSON file at the
   end of the session (Day 18 skills)
6. Graceful error handling for: missing API key, network
   timeout, rate limit errors, and authentication errors

TECHNICAL REQUIREMENTS:
- Use python-dotenv to load the API key (Day 27)
- Use requests for the HTTP calls (Day 26)
- Write pytest tests for every function that does NOT require
  a live API call (Day 28) — for example, the conversation
  history formatter and the token cost calculator
- Use at least one decorator for logging or timing API calls (Week 5)

PUSH TO GITHUB:
Repository name: python-week6-health-advisor-cli
This is a serious portfolio piece — document the architecture
clearly in your README, including a note that this is the
foundation for a future full-stack AI health advisor product.

ARCHITECTURE NOTE FOR YOUR README:
This CLI tool will later become a FastAPI web service (Phase 4),
which will then be wrapped in a proper frontend (Phase 5).
Mention this evolution explicitly — it shows you are thinking
about your projects as an evolving system, not disconnected
one-off exercises.
    `,

    example: `
# ── Project Starter Scaffold ────────────────────────────

import os
import json
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY     = os.getenv("ANTHROPIC_API_KEY")
API_URL     = "https://api.anthropic.com/v1/messages"
MAX_QUERIES = 10

SYSTEM_PROMPT = (
    "You are a clinical pharmacist assistant. Provide clear, "
    "evidence-informed guidance, always note when a question "
    "requires in-person clinical assessment, and never provide "
    "a definitive diagnosis."
)

class HealthAdvisorSession:
    def __init__(self):
        self.messages       = []
        self.query_count    = 0
        self.total_tokens   = 0

    def ask(self, user_query):
        if self.query_count >= MAX_QUERIES:
            return "Session limit reached. Please start a new session."

        self.messages.append({"role": "user", "content": user_query})

        headers = {
            "x-api-key": API_KEY,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json"
        }
        body = {
            "model": "claude-sonnet-4-6",
            "max_tokens": 1024,
            "system": SYSTEM_PROMPT,
            "messages": self.messages,
        }

        try:
            response = requests.post(API_URL, json=body, headers=headers, timeout=30)
            response.raise_for_status()
        except requests.exceptions.RequestException as e:
            return f"Request failed: {e}"

        data = response.json()
        answer = data["content"][0]["text"]

        self.messages.append({"role": "assistant", "content": answer})
        self.query_count  += 1
        self.total_tokens += data.get("usage", {}).get("output_tokens", 0)

        return answer

    def save_history(self, filepath="conversation_history.json"):
        with open(filepath, "w") as f:
            json.dump({
                "messages": self.messages,
                "query_count": self.query_count,
                "total_tokens": self.total_tokens,
            }, f, indent=2)


# Build the rest: the main interactive loop, decorator-based
# logging of each call, and the test file for the non-API
# functions (history saving/loading, token summing, etc.)

if __name__ == "__main__":
    session = HealthAdvisorSession()
    print("AI Health Advisor — type 'exit' to quit\\n")
    while True:
        query = input("You: ")
        if query.lower() == "exit":
            break
        print(f"\\nAdvisor: {session.ask(query)}\\n")
    session.save_history()
    `,

    commonMistakes: [],
    exercises: [],

    resources: [
      {
        objective: "Build a working Python client for the Claude API",
        items: [
          { title: "Anthropic API Documentation — Messages", url: "https://docs.anthropic.com/en/api/messages", type: "reference", note: "Complete reference for the Messages API endpoint, including the system prompt parameter and usage tracking fields." },
        ],
      },
      {
        objective: "Implement proper error handling and basic retry logic",
        items: [
          { title: "Real Python — Python's requests Library: Handling Errors", url: "https://realpython.com/python-requests/#exceptions", type: "article", note: "Section specifically on the exception types requests can raise and how to handle each." },
        ],
      },
    ],
  },

];

if (typeof module !== "undefined") {
  module.exports = { WEEK6 };
}
