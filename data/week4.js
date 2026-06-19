// ============================================================
// WEEK 4 — File I/O, CSV, JSON, Modules & Virtual Environments
// Days 16–20 | 6–10 July 2026
// Phase 1: Python Mastery
// ============================================================

const WEEK4 = [

  // ============================================================
  // DAY 16 — File I/O: Reading & Writing Text Files
  // ============================================================
  {
    id: "W4D1", week: 4, day: 1, phase: 1,
    phaseTitle: "Python Mastery",
    date: "2026-07-06",
    type: "lesson",
    topic: "File I/O: Reading & Writing Text Files",
    duration: "2–3 hours",

    objectives: [
      "Open, read, write, and append to files using open() and the with statement",
      "Read files efficiently line by line for memory safety",
      "Understand file modes: r, w, a, r+ and when to use each",
      "Handle file paths safely across operating systems",
    ],

    introduction: `
Every dataset you will ever analyse starts as a file on disk.
Before pandas can read a CSV in one line, Python itself must
open the file, read its bytes, decode them as text, and stream
them into memory. Understanding this layer means you understand
exactly what is happening when pd.read_csv() appears to work
like magic — it is not magic, it is file I/O wrapped in a
convenient interface.

File I/O is also the foundation of building data pipelines from
scratch: scrape data → clean it → write to file → process it
again tomorrow. That loop is the essence of data engineering,
which you will study in depth starting Week 9.
    `,

    mentalModel: `
MENTAL MODEL — "The Patient Chart"

A file is a patient chart sitting in a filing cabinet.

open() is the act of pulling the chart out of the cabinet.
The MODE you specify is your intention:
  'r' → you only want to READ the chart, not write in it
  'w' → you are starting a FRESH chart, discarding the old one
  'a' → you are ADDING a new entry to the existing chart
        without disturbing what's already there

The with statement is your professional habit of always
returning the chart to the cabinet when you are done —
even if something interrupts you mid-review. Skipping this
is like leaving a patient's chart open on the desk: messy,
risky, and eventually something goes wrong.
    `,

    explanation: `
FILE MODES
==========
'r'   → read only (file MUST already exist, or FileNotFoundError)
'w'   → write (creates new file, OVERWRITES if it already exists)
'a'   → append (adds to the end, creates file if it doesn't exist)
'r+'  → read AND write (file must exist)
'rb'  → read binary (for images, PDFs, non-text files)
'wb'  → write binary

THE SAFE PATTERN — always use 'with'
=====================================
with open('filename.txt', 'r') as f:
    content = f.read()
# file is automatically closed here, even if an error occurred

Without 'with', you must remember f.close() yourself.
Forgetting it can corrupt data or leak file handles.
There is no good reason to skip 'with' in 2026 Python.

READING METHODS
================
f.read()        → entire file as one single string
f.readline()    → reads just one line
f.readlines()   → all lines as a list of strings
for line in f:  → MOST memory-efficient — streams one line at a time

For a 50MB CSV, f.read() loads all 50MB into memory at once.
"for line in f" only holds one line in memory at any moment.
This difference matters enormously once you work with real
datasets that can be gigabytes in size.

WRITING METHODS
================
f.write("text")     → writes a string (no automatic newline added)
f.writelines(list)  → writes a list of strings

FILE PATHS
==========
Always use os.path.join() or pathlib.Path to build paths —
never hardcode '/' or '\\\\' directly, since Windows and
Mac/Linux use different separators.
    `,

    clinicalConnection: `
CLINICAL CONNECTION

Every dispensing log, every patient intake form, every
inventory count sheet you have ever filled out by hand has
a digital equivalent: a text file being appended to, line
by line, throughout the day.

  with open("dispense_log.txt", "a") as f:
      f.write(f"{timestamp} | {drug} | {qty} | {patient}\\n")

This single pattern — open in append mode, write a line,
close automatically — is the foundation of every audit trail
in pharmacy software. NAFDAC compliance logging, controlled
substance registers, and adverse event reports all reduce to
this exact mechanic at the lowest level.
    `,

    example: `
# ── Day 16 Complete Example ──────────────────────────────

import os
import datetime

# --- Writing a file ---
formulary_text = """Metformin,500,200,Antidiabetic
Aspirin,325,150,Analgesic
Amoxicillin,500,80,Antibiotic
Lisinopril,10,120,Antihypertensive
"""

with open("formulary.txt", "w") as f:
    f.write(formulary_text)
print("File written: formulary.txt")

# --- Reading the entire file ---
with open("formulary.txt", "r") as f:
    content = f.read()
print("\\n--- Full content ---")
print(content)

# --- Reading line by line (memory efficient) ---
print("--- Line by line ---")
with open("formulary.txt", "r") as f:
    for line in f:
        line = line.strip()              # remove trailing \\n
        if not line:
            continue
        name, dose, stock, category = line.split(",")
        print(f"  {name}: {dose}mg | Stock: {stock} | {category}")

# --- Appending to an existing file ---
with open("formulary.txt", "a") as f:
    f.write("Omeprazole,20,90,Proton Pump Inhibitor\\n")
print("\\nDrug appended.")

# --- Safe path construction ---
data_dir = "data"
os.makedirs(data_dir, exist_ok=True)   # exist_ok avoids error if it exists
file_path = os.path.join(data_dir, "formulary.txt")
print(f"\\nSafe path: {file_path}")

# --- Checking file existence and size ---
if os.path.exists("formulary.txt"):
    size = os.path.getsize("formulary.txt")
    print(f"File exists, size: {size} bytes")

# --- A realistic dispensing log writer ---
def log_dispense(drug_name, qty, patient, pharmacist="Victor Okolie"):
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    entry = f"{timestamp} | {pharmacist} | {patient} | {drug_name} x{qty}\\n"
    with open("dispense_log.txt", "a") as f:
        f.write(entry)
    print(f"Logged: {entry.strip()}")

log_dispense("Metformin", 60, "Amaka Obi")
log_dispense("Aspirin", 30, "Chidi Eze")

print("\\n=== Today's Dispensing Log ===")
with open("dispense_log.txt", "r") as f:
    print(f.read())
    `,

    commonMistakes: [
      {
        mistake: "Not using the with statement",
        wrong:   "f = open('file.txt', 'r')\ndata = f.read()\n# forgot f.close() — file stays open",
        right:   "with open('file.txt', 'r') as f:\n    data = f.read()\n# automatically closed",
        explanation: "Leaving files open can cause data loss, memory leaks, and 'too many open files' errors in larger programs. with eliminates this entire category of bugs.",
      },
      {
        mistake: "Using 'w' mode when you meant to append",
        wrong:   "open('log.txt', 'w')   # WIPES all previous log entries",
        right:   "open('log.txt', 'a')   # adds to the existing log",
        explanation: "'w' mode deletes the file's existing content immediately when opened, even before you write anything. This is a destructive, irreversible mistake for log files.",
      },
      {
        mistake: "Forgetting that lines from a file include the trailing newline",
        wrong:   "for line in f:\n    print(line)   # creates double-spaced output",
        right:   "for line in f:\n    print(line.strip())   # removes the \\n",
        explanation: "Each line read from a text file includes the newline character at the end. Always .strip() before processing unless you specifically need it.",
      },
    ],

    exercises: [
      "Write a program that reads formulary.txt, parses each drug line, and writes a new file low_stock.txt containing only drugs with stock below 100.",
      "Build a daily dispensing report generator: read dispense_log.txt, count how many times each drug was dispensed using a dictionary, and write a summary report to daily_report.txt.",
      "Write a function backup_file(filename) that copies a file's content into a new file with today's date in the filename, e.g. formulary_2026-07-06.txt.",
      "Write a function safe_append(filename, line) that appends a line to a file only if that exact line does not already exist anywhere in the file (read first to check, then append).",
    ],

    resources: [
      {
        objective: "Open, read, write, and append to files using open() and the with statement",
        items: [
          { title: "Real Python — Reading and Writing Files in Python", url: "https://realpython.com/read-write-files-python/", type: "article", note: "The most thorough free guide to Python file I/O. Covers every mode and the with statement in depth." },
          { title: "CS50P — Week 6: File I/O", url: "https://cs50.harvard.edu/python/2022/weeks/6/", type: "video", duration: "~2 hrs", note: "Harvard's treatment of file I/O builds the concept from first principles." },
        ],
      },
      {
        objective: "Read files efficiently line by line for memory safety",
        items: [
          { title: "Automate the Boring Stuff — Chapter 9: Reading and Writing Files", url: "https://automatetheboringstuff.com/2e/chapter9/", type: "article", note: "Practical chapter with real automation examples using file reading patterns." },
        ],
      },
      {
        objective: "Understand file modes: r, w, a, r+ and when to use each",
        items: [
          { title: "Python Docs — Reading and Writing Files (Tutorial)", url: "https://docs.python.org/3/tutorial/inputoutput.html#reading-and-writing-files", type: "reference", note: "Official documentation listing every file mode precisely." },
        ],
      },
      {
        objective: "Handle file paths safely across operating systems",
        items: [
          { title: "Real Python — Python's pathlib Module", url: "https://realpython.com/python-pathlib/", type: "article", note: "Covers both os.path and the more modern pathlib approach to safe path handling." },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 17 — CSV Files: Reading, Writing & Processing
  // ============================================================
  {
    id: "W4D2", week: 4, day: 2, phase: 1,
    phaseTitle: "Python Mastery",
    date: "2026-07-07",
    type: "lesson",
    topic: "CSV Files: Reading, Writing & Processing Tabular Data",
    duration: "2–3 hours",

    objectives: [
      "Read CSV files using Python's built-in csv module",
      "Write CSV files from lists and dictionaries",
      "Use csv.DictReader and csv.DictWriter for maintainable code",
      "Handle common CSV edge cases: encoding, delimiters, embedded commas",
    ],

    introduction: `
CSV is the universal language of tabular data. Every hospital
patient export, every pharmacy stock list, every government
health dataset you will download from data.gov or a Nigerian
ministry — if it is tabular, it is very likely CSV.

Understanding how to process CSVs manually with Python's csv
module is the bridge between "I can read a text file" and
"I can process a real dataset." In fact, the very first thing
pandas does internally when you call pd.read_csv() is
essentially what you will learn today — with vastly more
error handling and optimisation layered on top.
    `,

    mentalModel: `
MENTAL MODEL — "The Spreadsheet Without the Software"

A CSV file is a spreadsheet stripped down to its plainest
possible form — just commas separating values, one row per line,
no formatting, no formulas, no colours.

csv.reader gives you each row as a LIST: row[0], row[1], row[2].
This is like reading a spreadsheet by column LETTER — functional
but easy to lose track of which column means what.

csv.DictReader gives you each row as a DICTIONARY: row['name'],
row['dose']. This is like reading a spreadsheet by column HEADER
— always clear, self-documenting, and far less fragile when
columns get reordered.

Always prefer DictReader and DictWriter in real code.
    `,

    explanation: `
THE csv MODULE
================
Python's built-in csv module correctly handles the tricky
realities of CSV files that naive .split(",") cannot:
  - Commas INSIDE quoted text fields
  - Different delimiters (tabs, semicolons)
  - Headers
  - Different line endings between Windows and Mac/Linux

csv.reader(file)      → reads rows as LISTS
csv.DictReader(file)  → reads rows as DICTIONARIES (preferred)

csv.writer(file)      → writes rows from LISTS
csv.DictWriter(file)  → writes rows from DICTIONARIES (preferred)

WHY DictReader/DictWriter ARE PREFERRED
=========================================
With csv.reader:     row[0], row[1], row[2]   ← fragile, unclear
With csv.DictReader: row['drug_name'], row['dose']  ← clear, robust

If someone reorders the columns in the source file, code using
DictReader still works correctly. Code using plain reader breaks
silently — it will read the wrong column without any error.

KEY DictWriter SETUP
======================
import csv
fieldnames = ["name", "dose_mg", "stock"]
with open("out.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()       # writes the column header row
    writer.writerows(list_of_dicts)
    `,

    clinicalConnection: `
CLINICAL CONNECTION

Imagine a Nigerian hospital exports its monthly drug
dispensing report as a CSV with columns: drug_name, dose_mg,
quantity_dispensed, unit_price_ngn, dispensing_date.

Every analysis you will eventually run in pandas — total
revenue, most prescribed drug, monthly trends — starts with
correctly reading this CSV. Today's csv.DictReader skill is
the manual version of pd.read_csv(). Understanding it deeply
means that when pandas does something unexpected with your
real hospital data later, you will know exactly what is
happening underneath and how to debug it.
    `,

    example: `
# ── Day 17 Complete Example ──────────────────────────────

import csv

# --- Sample data to write ---
drugs = [
    {"name": "Metformin",     "dose_mg": 500, "stock": 200, "price_ngn": 1500, "category": "Antidiabetic"},
    {"name": "Aspirin",       "dose_mg": 325, "stock": 150, "price_ngn": 800,  "category": "Analgesic"},
    {"name": "Amoxicillin",   "dose_mg": 500, "stock": 80,  "price_ngn": 2200, "category": "Antibiotic"},
    {"name": "Lisinopril",    "dose_mg": 10,  "stock": 120, "price_ngn": 1800, "category": "Antihypertensive"},
    {"name": "Metronidazole", "dose_mg": 400, "stock": 60,  "price_ngn": 950,  "category": "Antibiotic"},
    {"name": "Atorvastatin",  "dose_mg": 20,  "stock": 95,  "price_ngn": 3200, "category": "Statin"},
]

# --- Writing CSV with DictWriter ---
fieldnames = ["name", "dose_mg", "stock", "price_ngn", "category"]

with open("formulary.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(drugs)
print("CSV written: formulary.csv")

# --- Reading CSV with DictReader ---
print("\\n=== Formulary ===")
with open("formulary.csv", "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(f"  {row['name']} | {row['dose_mg']}mg | "
              f"₦{row['price_ngn']} | Stock: {row['stock']}")

# --- Processing: a complete analysis function ---
def analyze_formulary(filepath):
    """
    Reads a drug CSV and returns total inventory value,
    low stock alerts, and drugs grouped by category.
    """
    total_value  = 0
    low_stock    = []
    by_category  = {}

    with open(filepath, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            # CSV always reads values as STRINGS — must cast
            stock    = int(row["stock"])
            price    = float(row["price_ngn"])
            name     = row["name"]
            category = row["category"]

            total_value += stock * price

            if stock < 100:
                low_stock.append((name, stock))

            by_category.setdefault(category, []).append(name)

    return total_value, low_stock, by_category

total, alerts, categories = analyze_formulary("formulary.csv")

print(f"\\nTotal Inventory Value: ₦{total:,.2f}")
print("\\nLow Stock Alerts:")
for drug, qty in alerts:
    print(f"  ⚠️  {drug}: only {qty} remaining")

print("\\nDrugs by Category:")
for cat, drug_list in categories.items():
    print(f"  {cat}: {', '.join(drug_list)}")

# --- Writing a filtered output file ---
with open("formulary.csv", "r", encoding="utf-8") as infile, \\
     open("low_stock.csv", "w", newline="", encoding="utf-8") as outfile:

    reader = csv.DictReader(infile)
    writer = csv.DictWriter(outfile, fieldnames=reader.fieldnames)
    writer.writeheader()

    for row in reader:
        if int(row["stock"]) < 100:
            writer.writerow(row)

print("\\nLow stock report written to low_stock.csv")
    `,

    commonMistakes: [
      {
        mistake: "Forgetting newline='' when writing CSV files",
        wrong:   "open('file.csv', 'w')   # extra blank lines appear on Windows",
        right:   "open('file.csv', 'w', newline='')   # always include this for CSV writing",
        explanation: "Without newline='', Python's own newline translation combines with the csv module's own line endings, producing doubled blank lines on Windows specifically.",
      },
      {
        mistake: "Treating CSV numeric values as numbers without converting",
        wrong:   "if row['stock'] < 100:   # TypeError — comparing string to int",
        right:   "if int(row['stock']) < 100:   # convert first",
        explanation: "csv.DictReader reads every value as a string, regardless of what it looks like. You must explicitly cast to int or float before doing any arithmetic or numeric comparison.",
      },
      {
        mistake: "Using plain .split(',') instead of the csv module",
        wrong:   "line.split(',')   # breaks if any field contains a comma",
        right:   "Use csv.reader or csv.DictReader — they handle quoted commas correctly",
        explanation: "A field like 'Aspirin, Extra Strength' contains a comma inside quotes. Naive splitting breaks this into the wrong number of columns. The csv module handles this correctly.",
      },
    ],

    exercises: [
      "Download or create a small CSV dataset (8–10 rows, at least 4 columns). Use csv.DictReader to compute the average of a numeric column.",
      "Write a function merge_csv_files(file1, file2, output_file) that combines two CSV files with identical columns into one, removing any duplicate drug names.",
      "Build a CSV-based patient register: write functions add_patient(filepath, patient_dict), search_patient(filepath, name), and update_patient(filepath, name, updates) that read and rewrite the CSV appropriately.",
      "Write a function csv_to_dict_of_dicts(filepath, key_column) that reads a CSV and returns a dictionary keyed by one column's value, where each value is the full row as a dictionary.",
    ],

    resources: [
      {
        objective: "Read CSV files using Python's built-in csv module",
        items: [
          { title: "Real Python — Reading and Writing CSV Files in Python", url: "https://realpython.com/python-csv/", type: "article", note: "The definitive free guide to Python's csv module, covering reader, writer, and edge cases thoroughly." },
          { title: "CS50P — Week 6 (CSV section)", url: "https://cs50.harvard.edu/python/2022/weeks/6/", type: "video", duration: "~1 hr", note: "Covers CSV reading and writing directly after the file I/O section." },
        ],
      },
      {
        objective: "Write CSV files from lists and dictionaries",
        items: [
          { title: "Python Docs — csv: CSV File Reading and Writing", url: "https://docs.python.org/3/library/csv.html", type: "reference", note: "Official complete reference for every csv module function and parameter." },
        ],
      },
      {
        objective: "Use csv.DictReader and csv.DictWriter for maintainable code",
        items: [
          { title: "Real Python — DictReader and DictWriter Section", url: "https://realpython.com/python-csv/#reading-csv-files-into-a-dictionary-with-python", type: "article", note: "Specific section showing why DictReader/DictWriter are preferred in production code." },
        ],
      },
      {
        objective: "Handle common CSV edge cases: encoding, delimiters, embedded commas",
        items: [
          { title: "Python Docs — csv Dialects and Formatting Parameters", url: "https://docs.python.org/3/library/csv.html#dialects-and-formatting-parameters", type: "reference", note: "Covers custom delimiters, quoting rules, and encoding considerations." },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 18 — JSON: Working with APIs & Structured Data
  // ============================================================
  {
    id: "W4D3", week: 4, day: 3, phase: 1,
    phaseTitle: "Python Mastery",
    date: "2026-07-08",
    type: "lesson",
    topic: "JSON: Working with APIs & Structured Data",
    duration: "2–3 hours",

    objectives: [
      "Read and write JSON files with Python's json module",
      "Convert between Python dictionaries/lists and JSON strings",
      "Navigate nested JSON structures confidently",
      "Fetch real JSON data from a public API",
    ],

    introduction: `
JSON (JavaScript Object Notation) is the language of the modern
internet. Every API you will call in this entire roadmap — the
Claude API, the Circle/USDC API, the GitHub API, public health
data APIs — communicates using JSON.

Your AI health agent will receive Claude's responses as JSON.
Your Circle developer wallet integration sends and receives
JSON. Your brand content engine likely stores post data as
JSON in Supabase right now. JSON is unavoidable.

The good news: JSON maps almost perfectly onto Python dicts
and lists, which you already know deeply from Week 2.
Today is mostly about learning the conversion mechanics
between the two.
    `,

    mentalModel: `
MENTAL MODEL — "The API's Universal Prescription Format"

Imagine every hospital in the world agreed on one universal
format for writing prescriptions electronically — regardless
of which country, which EMR system, or which language.
That universal format is JSON.

When your AI health agent asks Claude a question, the request
travels as JSON. When Claude responds, the response arrives as
JSON. JSON is the agreed-upon "prescription pad" format that
lets completely different systems — built by different
companies, in different countries — exchange structured
information without confusion.
    `,

    explanation: `
JSON ↔ PYTHON TYPE MAPPING
============================
JSON           |  Python
---------------|----------------
object {}      |  dict {}
array []       |  list []
string ""      |  str ""
number         |  int or float
true / false   |  True / False
null           |  None

THE json MODULE
==================
json.dumps(obj)         → Python object → JSON STRING
json.loads(string)      → JSON STRING → Python object
json.dump(obj, file)    → Python object → JSON FILE
json.load(file)         → JSON FILE → Python object

Remember: the 's' suffix (dumps/loads) means STRING.
No 's' (dump/load) means FILE.

PRETTY PRINTING
=================
json.dumps(obj, indent=2)   → nicely formatted, human-readable JSON
This is invaluable for debugging API responses.

NAVIGATING NESTED JSON
========================
data["patient"]["medications"][0]["name"]
Just chain dictionary keys and list indices exactly as you
would with regular Python dicts and lists — because after
json.loads(), that is literally what it is.
    `,

    clinicalConnection: `
CLINICAL CONNECTION

When your AI health agent calls the Claude API with a patient's
question, the request body looks like this:

{
  "model": "claude-sonnet-4-6",
  "messages": [
    {"role": "user", "content": "Can a diabetic patient take ibuprofen?"}
  ]
}

And the response comes back as JSON containing Claude's answer.
Your Python code will use json.loads() (or the requests
library's built-in .json() method) to turn that response into
a Python dict, then pull out response["content"][0]["text"]
to get the actual answer text to show the patient.

Every single AI-powered feature you build for the rest of this
roadmap depends on being completely comfortable with this
pattern.
    `,

    example: `
# ── Day 18 Complete Example ──────────────────────────────

import json
import urllib.request

# --- Python dict → JSON ---
patient = {
    "id": "PAT-001",
    "name": "Victor Okolie",
    "age": 28,
    "conditions": ["Hypertension", "Type 2 Diabetes"],
    "medications": [
        {"name": "Metformin", "dose_mg": 500, "frequency": "twice daily"},
        {"name": "Lisinopril", "dose_mg": 10, "frequency": "once daily"}
    ],
    "last_visit": "2026-06-15",
    "allergies": None
}

# Convert to a JSON string (pretty printed)
json_string = json.dumps(patient, indent=2)
print(json_string)

# --- Write JSON to a file ---
with open("patient_001.json", "w") as f:
    json.dump(patient, f, indent=2)
print("\\nSaved to patient_001.json")

# --- Read JSON from a file ---
with open("patient_001.json", "r") as f:
    loaded = json.load(f)

print(f"\\nPatient: {loaded['name']}")
print(f"Conditions: {', '.join(loaded['conditions'])}")
for med in loaded["medications"]:
    print(f"  → {med['name']} {med['dose_mg']}mg — {med['frequency']}")

# --- JSON string → Python dict ---
api_response_string = '''
{
  "status": "success",
  "drug": "Metformin",
  "interactions": [
    {"drug": "Alcohol", "severity": "moderate", "effect": "lactic acidosis risk"},
    {"drug": "Contrast dye", "severity": "major", "effect": "acute kidney injury"}
  ]
}
'''
data = json.loads(api_response_string)
print(f"\\nDrug: {data['drug']}")
for interaction in data["interactions"]:
    print(f"  ⚠️  {interaction['drug']} — "
          f"{interaction['severity'].upper()}: {interaction['effect']}")

# --- Fetching real JSON from a public API (no key needed) ---
def get_nigeria_covid_stats():
    """Fetch Nigeria's stats from a free public health API."""
    url = "https://disease.sh/v3/covid-19/countries/Nigeria"
    try:
        with urllib.request.urlopen(url, timeout=5) as response:
            data = json.loads(response.read())
            print(f"\\n=== Nigeria Health Stats ===")
            print(f"  Total Cases    : {data['cases']:,}")
            print(f"  Total Deaths   : {data['deaths']:,}")
            print(f"  Active Cases   : {data['active']:,}")
    except Exception as e:
        print(f"API error: {e}")

get_nigeria_covid_stats()

# --- Building a simple JSON 'database' for patients ---
def load_db(filename="patients.json"):
    try:
        with open(filename, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        return []

def save_db(data, filename="patients.json"):
    with open(filename, "w") as f:
        json.dump(data, f, indent=2)

def add_patient(name, age, condition):
    patients = load_db()
    patients.append({"name": name, "age": age, "condition": condition, "id": len(patients) + 1})
    save_db(patients)
    print(f"Added patient: {name}")

add_patient("Amaka Obi", 45, "Type 2 Diabetes")
add_patient("Chidi Eze", 61, "Hypertension")

print("\\nAll patients:")
print(json.dumps(load_db(), indent=2))
    `,

    commonMistakes: [
      {
        mistake: "Confusing json.dumps/loads (strings) with json.dump/load (files)",
        wrong:   "json.dumps(obj, my_file)   # dumps doesn't take a file argument",
        right:   "json.dump(obj, my_file)    # file version\njson.dumps(obj)            # string version",
        explanation: "dumps/loads operate on STRINGS. dump/load operate on FILE OBJECTS. Mixing them up causes a TypeError.",
      },
      {
        mistake: "Using non-string keys in a dict you plan to serialise",
        wrong:   "{1: 'one', 2: 'two'}   # integer keys",
        right:   "{'1': 'one', '2': 'two'}   # JSON requires string keys",
        explanation: "JSON only supports string keys for objects. json.dumps() will silently convert int keys to strings, which can cause confusion when you load the data back.",
      },
      {
        mistake: "Accessing a JSON field that might not exist without checking",
        wrong:   "data['allergies']   # KeyError if the API didn't include this field",
        right:   "data.get('allergies', 'Not specified')   # safe with a default",
        explanation: "API responses can vary. Always use .get() with a sensible default when working with external JSON data you don't fully control.",
      },
    ],

    exercises: [
      "Write a function that reads patient_001.json, updates the last_visit field to today's date, appends a new medication, and saves it back to the same file.",
      "Call the free Open Disease Data API (https://disease.sh/v3/covid-19/countries/Nigeria) and parse the JSON response to print a formatted 5-line health summary.",
      "Create a JSON-based settings file for a pharmacy system storing: pharmacy name, opening hours (as a nested dict per day), pharmacist details, and reorder threshold. Write a function to load and validate it.",
      "Write a function flatten_json(nested_dict) that takes a deeply nested patient record and returns a flat dictionary with dot-separated keys, e.g. {'medications.0.name': 'Metformin'}.",
    ],

    resources: [
      {
        objective: "Read and write JSON files with Python's json module",
        items: [
          { title: "Real Python — Working With JSON Data in Python", url: "https://realpython.com/python-json/", type: "article", note: "The most comprehensive free guide to Python's json module, covering files, strings, and custom serialisation." },
        ],
      },
      {
        objective: "Convert between Python dictionaries/lists and JSON strings",
        items: [
          { title: "Python Docs — json: JSON Encoder and Decoder", url: "https://docs.python.org/3/library/json.html", type: "reference", note: "Official documentation with the complete type conversion table." },
        ],
      },
      {
        objective: "Navigate nested JSON structures confidently",
        items: [
          { title: "freeCodeCamp — How to Work with JSON in Python", url: "https://www.freecodecamp.org/news/how-to-work-with-json-files-in-python/", type: "article", note: "Practical walkthrough of navigating deeply nested JSON, useful for API response handling." },
        ],
      },
      {
        objective: "Fetch real JSON data from a public API",
        items: [
          { title: "OpenFDA API Documentation", url: "https://open.fda.gov/apis/", type: "reference", note: "Free drug information API — no key required for basic use. You will use this throughout the roadmap." },
          { title: "disease.sh API Documentation", url: "https://disease.sh/docs/", type: "reference", note: "Free public health statistics API used in today's example." },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 19 — Modules, Packages & Virtual Environments
  // ============================================================
  {
    id: "W4D4", week: 4, day: 4, phase: 1,
    phaseTitle: "Python Mastery",
    date: "2026-07-09",
    type: "lesson",
    topic: "Modules, Packages & Virtual Environments",
    duration: "2–3 hours",

    objectives: [
      "Import and use Python's standard library modules effectively",
      "Create and import your own custom modules",
      "Understand packages and how Python organises larger projects",
      "Set up and use virtual environments with venv and pip",
    ],

    introduction: `
Every project so far has lived in a single file. Real software
— including everything you will build from Phase 2 onward —
is organised into multiple files grouped into modules and
packages.

Understanding modules is also precisely what lets you use the
entire Python ecosystem. pandas, numpy, scikit-learn, langchain
— every one of these is a package you install and import.

Virtual environments are non-negotiable for professional work.
They isolate each project's dependencies so that one project's
required pandas version doesn't silently conflict with
another's. Every serious data science project begins with
creating a virtual environment — this is true from your first
freelance gig to a Google-scale production system.
    `,

    mentalModel: `
MENTAL MODEL — "Specialist Drug Cabinets, Not One Giant Shelf"

Imagine if every drug in a hospital was kept on one giant
undivided shelf with no organisation. Finding anything would
be chaos, and a mislabelled bottle could end up anywhere.

Modules are specialist cabinets: the Antibiotics cabinet, the
Analgesics cabinet, the Controlled Substances safe. Each has
a clear purpose and you import (retrieve) only what you need
from the cabinet that holds it.

A virtual environment is like having a separate, fully-stocked
satellite pharmacy for each clinical trial you run — each one
isolated, with its own exact inventory, so that a change made
for one trial never accidentally affects another.
    `,

    explanation: `
IMPORTING MODULES
====================
import math                     → import an entire module
from math import sqrt, pi       → import specific items only
import numpy as np              → import with an alias (standard convention)
from datetime import datetime   → import a specific class from a module

STANDARD LIBRARY HIGHLIGHTS
==============================
os          → file system and operating system operations
sys         → interacting with the Python interpreter itself
datetime    → dates and times
math        → mathematical functions
random      → random number generation
json        → JSON parsing (Day 18)
csv         → CSV files (Day 17)
re          → regular expressions (Week 5)
collections → Counter, defaultdict, namedtuple (already used in Week 2)
itertools   → advanced iteration tools
pathlib     → modern, object-oriented file path handling

CREATING YOUR OWN MODULE
===========================
Any .py file is automatically a module. If you have a file
called pharmacytools.py containing functions, you can import
it from another file in the same folder:
    import pharmacytools
    pharmacytools.calculate_bmi(70, 1.75)
or:
    from pharmacytools import calculate_bmi
    calculate_bmi(70, 1.75)

VIRTUAL ENVIRONMENTS
=======================
# Create a virtual environment named 'venv'
python -m venv venv

# Activate it (Mac/Linux)
source venv/bin/activate

# Activate it (Windows)
venv\\Scripts\\activate

# Install packages INTO this isolated environment
pip install pandas numpy matplotlib

# Save the exact list of dependencies for reproducibility
pip freeze > requirements.txt

# Anyone (including future you) can recreate the exact environment:
pip install -r requirements.txt
    `,

    clinicalConnection: `
CLINICAL CONNECTION

Imagine you build a drug interaction checker for one client
using pandas version 1.5, and six months later you start a
different project for another client that requires pandas
version 2.2 because of a new feature.

Without virtual environments, installing pandas 2.2 globally
on your machine could silently break the first project, which
was tested and validated against 1.5's exact behaviour. In a
healthcare context, an unnoticed behaviour change in a
dose-calculation pipeline is not just inconvenient — it is
a patient safety risk.

Virtual environments mean each project's dependencies are
locked and isolated. This is industry standard practice and
will be expected in literally every data engineering and data
science role you apply for.
    `,

    example: `
# ── Day 19 Complete Example ──────────────────────────────

import os
import sys
import math
import random
import datetime
from pathlib import Path
from collections import Counter, defaultdict

# --- os module ---
print("Current directory:", os.getcwd())

# Create a directory safely (exist_ok avoids an error if it's already there)
os.makedirs("data/reports", exist_ok=True)

# --- datetime ---
today = datetime.date.today()
now   = datetime.datetime.now()
print(f"Today    : {today}")
print(f"Datetime : {now.strftime('%Y-%m-%d %H:%M:%S')}")

refill_date = datetime.date(2026, 8, 1)
days_until  = (refill_date - today).days
print(f"Days until refill: {days_until}")

# --- math ---
weight_kg, height_m = 70, 1.75
bmi = weight_kg / math.pow(height_m, 2)
print(f"\\nBMI: {bmi:.2f}")

# --- random (great for generating realistic test data) ---
sample_doses = [random.randint(100, 1000) for _ in range(10)]
print(f"\\nSample doses: {sample_doses}")
print(f"Random drug: {random.choice(['Aspirin', 'Metformin', 'Lisinopril'])}")

# --- collections.Counter ---
dispensed = ["Metformin", "Aspirin", "Metformin", "Lisinopril",
             "Aspirin", "Metformin", "Amoxicillin"]
counts = Counter(dispensed)
print(f"\\nDispensing counts: {dict(counts)}")
print(f"Most dispensed (top 2): {counts.most_common(2)}")

# --- collections.defaultdict ---
by_category = defaultdict(list)
drugs = [("Metformin", "Antidiabetic"), ("Insulin", "Antidiabetic"),
         ("Aspirin", "Analgesic"), ("Ibuprofen", "Analgesic"),
         ("Amoxicillin", "Antibiotic")]
for drug, category in drugs:
    by_category[category].append(drug)   # no KeyError even on first insert

print("\\nBy category:")
for cat, drug_list in by_category.items():
    print(f"  {cat}: {drug_list}")

# --- pathlib (modern path handling) ---
p = Path("data/reports")
report_file = p / "daily_report.txt"   # the / operator joins paths elegantly
print(f"\\nReport path  : {report_file}")
print(f"Parent folder: {report_file.parent}")
print(f"Extension    : {report_file.suffix}")

# --- Creating and using your own module ---
module_code = '''
"""pharmacytools.py — Custom utility module for pharmacy operations."""

def mg_to_g(mg):
    """Convert milligrams to grams."""
    return mg / 1000

def calculate_creatinine_clearance(age, weight, serum_creatinine, is_female=False):
    """Cockcroft-Gault equation for CrCl estimation (mL/min)."""
    crcl = ((140 - age) * weight) / (72 * serum_creatinine)
    if is_female:
        crcl *= 0.85
    return round(crcl, 1)

def bmi(weight_kg, height_m):
    return round(weight_kg / (height_m ** 2), 1)
'''

with open("pharmacytools.py", "w") as f:
    f.write(module_code)

# Import it dynamically here for demonstration
import importlib.util
spec = importlib.util.spec_from_file_location("pharmacytools", "pharmacytools.py")
pt = importlib.util.module_from_spec(spec)
spec.loader.exec_module(pt)

print(f"\\n500mg = {pt.mg_to_g(500)}g")
print(f"CrCl: {pt.calculate_creatinine_clearance(65, 70, 1.2)} mL/min")
print(f"BMI: {pt.bmi(70, 1.75)}")

# In a normal project (not this single-file demo) you would simply write:
#   import pharmacytools
#   pharmacytools.bmi(70, 1.75)
    `,

    commonMistakes: [
      {
        mistake: "Naming your own file the same as a standard library module",
        wrong:   "# your file is named random.py\nimport random   # imports YOUR file instead of Python's!",
        right:   "Never name a file random.py, math.py, os.py, json.py, etc.",
        explanation: "Python searches the current directory before the standard library. A file named random.py shadows the built-in module, causing extremely confusing errors elsewhere in your code.",
      },
      {
        mistake: "Installing packages globally instead of inside a virtual environment",
        wrong:   "pip install pandas   # installs globally, can silently break other projects",
        right:   "python -m venv venv\nsource venv/bin/activate\npip install pandas",
        explanation: "Always activate a project-specific virtual environment first. This is the single habit that separates beginner setups from professional ones.",
      },
      {
        mistake: "Forgetting to activate the virtual environment before installing or running code",
        wrong:   "pip install requests   # installed globally if venv isn't activated",
        right:   "source venv/bin/activate   # check your terminal prompt shows (venv)\npip install requests",
        explanation: "Your terminal prompt shows (venv) when it is active. Always check this before installing packages or running scripts for a specific project.",
      },
    ],

    exercises: [
      "Create a pharmacytools.py module containing at least 6 utility functions (BMI, CrCl, dose conversions, etc). Import and test all of them from a separate test file.",
      "Use the datetime module to build a prescription refill reminder: given a start date and a refill frequency in days, calculate and print all future refill dates for the next 6 months.",
      "Use collections.Counter to analyse a randomly generated list of 50 dispensed drugs (use random.choices on a list of drug names) and print the top 5 most dispensed.",
      "Set up a virtual environment for a new folder, activate it, install pandas and numpy, and generate a requirements.txt. Then deactivate it and confirm 'import pandas' fails outside the venv.",
    ],

    resources: [
      {
        objective: "Import and use Python's standard library modules effectively",
        items: [
          { title: "Python Docs — The Python Standard Library", url: "https://docs.python.org/3/library/", type: "reference", note: "Bookmark this permanently. Every standard library module is documented here in full." },
          { title: "CS50P — Week 4: Libraries", url: "https://cs50.harvard.edu/python/2022/weeks/4/", type: "video", duration: "~2 hrs", note: "Harvard's introduction to using standard library modules effectively." },
        ],
      },
      {
        objective: "Create and import your own custom modules",
        items: [
          { title: "Real Python — Python Modules and Packages: An Introduction", url: "https://realpython.com/python-modules-packages/", type: "article", note: "Comprehensive guide covering both modules and packages with clear examples." },
        ],
      },
      {
        objective: "Understand packages and how Python organises larger projects",
        items: [
          { title: "Python Docs — Modules (Official Tutorial)", url: "https://docs.python.org/3/tutorial/modules.html", type: "reference", note: "Official tutorial section covering packages, __init__.py, and import mechanics." },
        ],
      },
      {
        objective: "Set up and use virtual environments with venv and pip",
        items: [
          { title: "Real Python — Python Virtual Environments: A Primer", url: "https://realpython.com/python-virtual-environments-a-primer/", type: "article", note: "Essential reading before starting any real project. The definitive free guide on this topic." },
          { title: "Python Docs — venv: Creation of Virtual Environments", url: "https://docs.python.org/3/library/venv.html", type: "reference", note: "Official reference for every venv command and option." },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 20 — PROJECT: Automated Pharmacy Data Pipeline
  // ============================================================
  {
    id: "W4D5", week: 4, day: 5, phase: 1,
    phaseTitle: "Python Mastery",
    date: "2026-07-10",
    type: "project",
    topic: "PROJECT: Automated Pharmacy Data Pipeline",
    duration: "4–5 hours",

    objectives: [
      "Combine file I/O, CSV, JSON, and modules into one working pipeline",
      "Organise code into separate, well-named files",
      "Process real or realistic multi-source data",
      "Push a multi-file project to GitHub with a clear README",
    ],

    introduction: `
This project is your first real taste of data engineering —
the discipline you will study in great depth starting Week 9.

A pipeline reads from multiple sources, transforms the data,
and produces clean, usable outputs. Today you build exactly
that, using only what you have learned in Phase 1. No fancy
tools yet — just solid, well-organised Python.

This project should look different from your earlier ones in
one important way: it is organised into multiple files, each
with a clear, single responsibility. This is your first step
toward writing code the way professional teams do.
    `,

    mentalModel: `
MENTAL MODEL — "The Pharmacy's Daily Reconciliation"

At the end of each day, a community pharmacy reconciles three
things: what came in (inventory deliveries), what went out
(dispensing log), and what is currently on the shelf (stock
count). Reconciling these into one clear daily report is
exactly the shape of the pipeline you are building today:
read multiple sources → process → produce one clear report.
    `,

    projectBrief: `
BUILD: An automated data pipeline for a Nigerian community pharmacy.

The pipeline must:
1. Read drug inventory from formulary.csv
2. Read patient records from patients.json
3. Read dispensing history from dispense_log.csv
4. Generate three separate output reports:
   a. daily_summary.txt — a readable text report of today's activity
   b. low_stock_alert.csv — drugs needing reorder
   c. patient_medication_report.json — each patient's current medications

STRUCTURE YOUR CODE across these files:
  - pipeline.py     (the main runner — orchestrates everything)
  - readers.py      (every file-reading function lives here)
  - processors.py   (every data transformation function lives here)
  - reporters.py    (every output-generating function lives here)

This separation matters: readers.py should know nothing about
how data gets transformed, and processors.py should know
nothing about how reports get written. Each file does one job.

REAL DATA CHALLENGE:
Search Kaggle for a small drug pricing or pharmacy dataset
(try searching "Nigeria pharmacy" or "drug prices") and run
your pipeline against it instead of made-up data, if you can
find something suitable.

PUSH TO GITHUB:
Repository name: python-week4-data-pipeline
Include your sample input files and the exact expected output
in your README. This is precisely the kind of structured,
multi-file project that data employers want to see in a
portfolio.
    `,

    example: `
# ── Project Starter Scaffold ────────────────────────────
# Spread this across the 4 files described above.
# Shown here together only for illustration.

# ---------- readers.py ----------
import csv
import json

def read_formulary(filepath):
    """Reads the drug formulary CSV into a list of dicts."""
    with open(filepath, "r", encoding="utf-8") as f:
        return list(csv.DictReader(f))

def read_patients(filepath):
    """Reads patient records from JSON."""
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)

def read_dispense_log(filepath):
    """Reads the dispensing history CSV into a list of dicts."""
    with open(filepath, "r", encoding="utf-8") as f:
        return list(csv.DictReader(f))


# ---------- processors.py ----------
def find_low_stock(formulary, threshold=50):
    """Returns formulary rows with stock below the threshold."""
    return [row for row in formulary if int(row["stock"]) < threshold]

def summarize_dispensing(dispense_log):
    """Counts how many times each drug was dispensed."""
    from collections import Counter
    return Counter(row["drug_name"] for row in dispense_log)

def build_patient_medication_map(patients):
    """Builds a dict of patient name -> their medication list."""
    return {p["name"]: p.get("medications", []) for p in patients}


# ---------- reporters.py ----------
import csv
import json

def write_daily_summary(filepath, formulary, dispense_counts):
    with open(filepath, "w", encoding="utf-8") as f:
        f.write("=== DAILY PHARMACY SUMMARY ===\\n\\n")
        f.write(f"Total drugs in formulary: {len(formulary)}\\n\\n")
        f.write("Dispensing counts today:\\n")
        for drug, count in dispense_counts.items():
            f.write(f"  {drug}: {count}\\n")

def write_low_stock_csv(filepath, low_stock_rows):
    if not low_stock_rows:
        return
    with open(filepath, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=low_stock_rows[0].keys())
        writer.writeheader()
        writer.writerows(low_stock_rows)

def write_patient_medication_report(filepath, medication_map):
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(medication_map, f, indent=2)


# ---------- pipeline.py ----------
from readers import read_formulary, read_patients, read_dispense_log
from processors import find_low_stock, summarize_dispensing, build_patient_medication_map
from reporters import write_daily_summary, write_low_stock_csv, write_patient_medication_report

def run_pipeline():
    formulary    = read_formulary("formulary.csv")
    patients     = read_patients("patients.json")
    dispense_log = read_dispense_log("dispense_log.csv")

    low_stock       = find_low_stock(formulary)
    dispense_counts = summarize_dispensing(dispense_log)
    med_map         = build_patient_medication_map(patients)

    write_daily_summary("daily_summary.txt", formulary, dispense_counts)
    write_low_stock_csv("low_stock_alert.csv", low_stock)
    write_patient_medication_report("patient_medication_report.json", med_map)

    print("Pipeline complete. Reports generated.")

if __name__ == "__main__":
    run_pipeline()
    `,

    commonMistakes: [
      {
        mistake: "Putting everything in one giant file out of habit",
        wrong:   "One 300-line pipeline.py with reading, processing, and writing all mixed together",
        right:   "Separate readers.py, processors.py, reporters.py, pipeline.py as described above",
        explanation: "Separating responsibilities makes the code far easier to test, debug, and extend. This habit becomes essential once your projects grow beyond a few hundred lines.",
      },
    ],

    exercises: [],

    resources: [
      {
        objective: "Combine file I/O, CSV, JSON, and modules into one working pipeline",
        items: [
          { title: "Kaggle Datasets", url: "https://www.kaggle.com/datasets", type: "tool", note: "Source of real datasets for your pipeline project. Search for pharmacy, drug pricing, or African health data." },
        ],
      },
      {
        objective: "Push a multi-file project to GitHub with a clear README",
        items: [
          { title: "GitHub Docs — About READMEs", url: "https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes", type: "reference", note: "Official guide to writing an effective README for a multi-file project." },
        ],
      },
    ],
  },

];

if (typeof module !== "undefined") {
  module.exports = { WEEK4 };
}
