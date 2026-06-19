// ============================================================
// WEEK 5 — Advanced Python: Comprehensions, Lambda, Decorators, Regex
// Days 21–25 | 13–17 July 2026
// Phase 1: Python Mastery
// ============================================================

const WEEK5 = [

  // ============================================================
  // DAY 21 — Advanced Comprehensions
  // ============================================================
  {
    id: "W5D1", week: 5, day: 1, phase: 1,
    phaseTitle: "Python Mastery",
    date: "2026-07-13",
    type: "lesson",
    topic: "Advanced Comprehensions: List, Dict, Set, Generator",
    duration: "2–3 hours",

    objectives: [
      "Master list comprehensions with conditions and nesting",
      "Write dict and set comprehensions confidently",
      "Use generator expressions for memory-efficient processing",
      "Recognise when a comprehension has become too complex and a loop is clearer",
    ],

    introduction: `
Comprehensions are Python's most distinctive feature — the
syntax that makes experienced Python code instantly recognisable.
They let you transform, filter, and build data structures in a
single, readable line instead of several lines of loop boilerplate.

In data science specifically, you will use this pattern
constantly: transforming a column of values, filtering rows by
a condition, building a lookup dictionary from raw records.
pandas uses vectorised operations for true performance, but
comprehensions remain essential whenever you work with lists
of dictionaries, raw API responses, or any custom transformation
pandas doesn't have a built-in for.
    `,

    mentalModel: `
MENTAL MODEL — "The Triage Line"

A list comprehension is a triage line at a busy clinic.
Patients (items) walk past one at a time. For each one, you
apply one quick rule (the expression) and optionally decide
whether they belong in this queue at all (the condition).
By the end, you have a new, clean list — nobody is examined
twice, and the original queue (the source list) is untouched.

A generator expression is the same triage process, except you
never write down the whole resulting list at once — you only
ever look at the patient currently in front of you, then
forget them and move to the next. This uses far less paper
(memory) when the queue is enormous.
    `,

    explanation: `
LIST COMPREHENSION
=====================
[expression for item in iterable]
[expression for item in iterable if condition]
[expr for x in range(5) for y in range(5)]     # nested

DICT COMPREHENSION
=====================
{key_expr: value_expr for item in iterable}
{k: v for k, v in some_dict.items() if condition}

SET COMPREHENSION
=====================
{expression for item in iterable}

GENERATOR EXPRESSION
=======================
(expression for item in iterable)
This returns a generator OBJECT — values are computed ONE AT
A TIME, on demand, rather than all at once.
sum(x**2 for x in range(1_000_000))   # never builds a full list in memory

WHEN TO AVOID A COMPREHENSION
================================
If the logic requires multiple conditions and several
transformation steps, write a normal for loop instead.
Comprehensions should be understandable at a glance. If you
have to squint and trace through it carefully, it has become
a liability rather than an asset — rewrite it as a loop.
    `,

    clinicalConnection: `
CLINICAL CONNECTION

Almost every "clean this data" task in your future work reduces
to a comprehension:

  names = [d["name"] for d in drugs]
  low_stock = [d["name"] for d in drugs if d["stock"] < 100]
  price_lookup = {d["name"]: d["price"] for d in drugs}
  categories = {d["category"] for d in drugs}

When you later write df["price_usd"] = df["price_ngn"].apply(lambda x: x / 1500)
in pandas, you are conceptually doing exactly what a list
comprehension does — apply one transformation to every item in
a sequence — just using pandas' vectorised engine for speed
instead of Python's own loop machinery.
    `,

    example: `
# ── Day 21 Complete Example ──────────────────────────────

drugs = [
    {"name": "Metformin",   "dose": 500, "stock": 200, "price": 1500, "category": "Antidiabetic"},
    {"name": "Aspirin",     "dose": 325, "stock": 45,  "price": 800,  "category": "Analgesic"},
    {"name": "Amoxicillin", "dose": 500, "stock": 80,  "price": 2200, "category": "Antibiotic"},
    {"name": "Tramadol",    "dose": 50,  "stock": 12,  "price": 1200, "category": "Analgesic"},
    {"name": "Lisinopril",  "dose": 10,  "stock": 150, "price": 1800, "category": "Antihypertensive"},
]

# --- List comprehensions ---
names = [d["name"] for d in drugs]
print("All drugs:", names)

low_stock = [d["name"] for d in drugs if d["stock"] < 100]
print("Low stock:", low_stock)

discounted = [round(d["price"] * 0.9) for d in drugs]
print("Discounted prices:", discounted)

# Nested comprehension: pair drugs with matching categories
target_categories = ["Antibiotic", "Antidiabetic"]
pairs = [(d["name"], cat) for d in drugs for cat in target_categories if d["category"] == cat]
print("Category matches:", pairs)

# --- Dict comprehension ---
price_lookup = {d["name"]: d["price"] for d in drugs}
print("\\nPrice lookup:", price_lookup)
print("Metformin costs: ₦", price_lookup["Metformin"])

reorder_dict = {d["name"]: d["stock"] for d in drugs if d["stock"] < 100}
print("Reorder needed:", reorder_dict)

# --- Set comprehension ---
unique_categories = {d["category"] for d in drugs}
print("\\nCategories:", unique_categories)

# --- Generator expressions ---
total_value = sum(d["stock"] * d["price"] for d in drugs)
print(f"\\nTotal inventory value: ₦{total_value:,}")

first_high_stock = next((d["name"] for d in drugs if d["stock"] > 100), None)
print(f"First well-stocked drug: {first_high_stock}")

# --- Building a formatted report with a comprehension ---
report_lines = [
    f"  {d['name']:20} | {d['dose']:5}mg | Stock: {d['stock']:4} | ₦{d['price']:,}"
    for d in sorted(drugs, key=lambda x: x["name"])
]
print("\\n=== Formulary Report ===")
print("\\n".join(report_lines))

# --- When NOT to use a comprehension ---
# BAD — too many conditions packed into one unreadable line:
# result = [d["name"] for d in drugs if d["stock"] < 100 and d["price"] > 1000 and d["category"] != "Analgesic"]

# GOOD — same logic, but readable as a loop:
result = []
for d in drugs:
    if d["stock"] < 100 and d["price"] > 1000 and d["category"] != "Analgesic":
        result.append(d["name"])
print("\\nFiltered (via readable loop):", result)
    `,

    commonMistakes: [
      {
        mistake: "Nesting comprehensions three or more levels deep",
        wrong:   "[x for a in b for x in a if x > 0 for y in x]   # unreadable",
        right:   "Use a regular nested for loop once nesting exceeds 2 levels",
        explanation: "Comprehensions exist for clarity. Past two levels of nesting, a loop communicates the logic far more clearly to any future reader, including future you.",
      },
      {
        mistake: "Building a full list when only an aggregate value is needed",
        wrong:   "sum([x**2 for x in range(10_000_000)])   # builds the entire list first",
        right:   "sum(x**2 for x in range(10_000_000))     # generator — never builds the list",
        explanation: "Removing the square brackets turns a list comprehension into a generator expression. When you only need the final aggregate (sum, max, any), this saves significant memory.",
      },
    ],

    exercises: [
      "From a list of 20 patient dicts, use comprehensions to: extract all unique conditions (set), create a name→age lookup (dict), and filter patients over 60 with diabetes (list).",
      "Given drug names with inconsistent casing (e.g. 'ASPIRIN', 'metformin', 'Amoxil'), use a set comprehension to produce the unique set of normalised (lowercased, stripped) names.",
      "Use a generator expression to find the first drug in a 10,000-item simulated list with stock below the reorder level, without ever building the full filtered list.",
    ],

    resources: [
      {
        objective: "Master list comprehensions with conditions and nesting",
        items: [
          { title: "Real Python — List Comprehensions in Python", url: "https://realpython.com/list-comprehension-python/", type: "article", note: "The best free resource on comprehensions, covering filtering, nesting, and readability tradeoffs." },
        ],
      },
      {
        objective: "Write dict and set comprehensions confidently",
        items: [
          { title: "Python Docs — Dict and Set Comprehensions", url: "https://docs.python.org/3/tutorial/datastructures.html#dictionaries", type: "reference", note: "Official tutorial section showing dict comprehension syntax directly." },
          { title: "Corey Schafer — Comprehensions Tutorial (Video)", url: "https://www.youtube.com/watch?v=3dt4OGnU5sM", type: "video", duration: "~30 mins", note: "Covers list, dict, and set comprehensions together with clear examples." },
        ],
      },
      {
        objective: "Use generator expressions for memory-efficient processing",
        items: [
          { title: "Real Python — How to Use Generators and yield in Python", url: "https://realpython.com/introduction-to-python-generators/", type: "article", note: "Covers generator expressions and the broader concept of lazy evaluation in Python." },
        ],
      },
      {
        objective: "Recognise when a comprehension has become too complex and a loop is clearer",
        items: [
          { title: "PEP 8 — Style Guide (general readability principles)", url: "https://peps.python.org/pep-0008/", type: "reference", note: "While not comprehension-specific, PEP 8's readability principles directly inform this judgment call." },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 22 — Lambda, map, filter, sorted with key
  // ============================================================
  {
    id: "W5D2", week: 5, day: 2, phase: 1,
    phaseTitle: "Python Mastery",
    date: "2026-07-14",
    type: "lesson",
    topic: "Lambda Functions, map(), filter(), sorted() with key",
    duration: "2–3 hours",

    objectives: [
      "Write lambda (anonymous) functions correctly",
      "Use map() and filter() for functional-style transformations",
      "Sort complex data structures using custom key functions",
      "Judge when a lambda is appropriate versus when a named function is clearer",
    ],

    introduction: `
Lambda functions and the functional tools map() and filter()
appear constantly in data science code — most notably inside
pandas operations like df["col"].apply(lambda x: ...).

Mastering them today means that when you reach pandas in
Phase 3, that syntax will already feel completely natural
rather than mysterious. They are also the standard tool for
sorting complex data structures by a custom rule, which you
will do often when ranking patients, drugs, or results.
    `,

    mentalModel: `
MENTAL MODEL — "The Sticky Note Instruction"

A lambda is a sticky note with one quick instruction written
on it — too small and disposable to deserve a full named
Standard Operating Procedure (a proper function). You hand
the sticky note to map() or sorted() and say "apply this to
everything," then throw the note away.

If the instruction needs more than one line of reasoning, it
is no longer a sticky note — it deserves a full SOP (a named
function with def). Using a lambda for complex logic is like
trying to write a full clinical protocol on a Post-it: technically
possible, but the wrong tool for the job.
    `,

    explanation: `
LAMBDA FUNCTIONS
===================
lambda arguments: expression

A lambda is a small anonymous function: no def, no name,
no explicit return (the expression's value IS the return value).

square = lambda x: x ** 2
print(square(5))   # 25

full_name = lambda first, last: f"{first} {last}"
print(full_name("Victor", "Okolie"))

map() — apply a function to every item
=========================================
map(function, iterable)   → returns a map object (wrap in list() to see it)
list(map(lambda x: x * 2, [1, 2, 3]))   → [2, 4, 6]

filter() — keep only items where the function returns True
===============================================================
filter(function, iterable)   → returns a filter object
list(filter(lambda x: x > 2, [1, 2, 3, 4]))   → [3, 4]

sorted() WITH A key FUNCTION
===============================
sorted(iterable, key=function, reverse=False)
key is a function applied to each item to determine sort order,
without changing the actual values being sorted.
    `,

    clinicalConnection: `
CLINICAL CONNECTION

This is precisely the pattern you will use in pandas constantly:
  df["price_usd"] = df["price_ngn"].apply(lambda x: x / 1500)
  df["name_clean"] = df["name"].apply(lambda x: x.strip().title())

And sorting patient or drug records by a custom rule:
  sorted_patients = sorted(patients, key=lambda p: (p["condition"], p["age"]))

This sorts first by condition alphabetically, then by age
within each condition group — exactly the kind of multi-level
sort a clinical report often requires.
    `,

    example: `
# ── Day 22 Complete Example ──────────────────────────────

drugs = [
    {"name": "Metformin",  "dose": 500, "price": 1500, "stock": 200},
    {"name": "Aspirin",    "dose": 325, "price": 800,  "stock": 45},
    {"name": "Amoxicillin","dose": 500, "price": 2200, "stock": 80},
    {"name": "Tramadol",   "dose": 50,  "price": 1200, "stock": 12},
    {"name": "Lisinopril", "dose": 10,  "price": 1800, "stock": 150},
]

# --- Lambda basics ---
get_price = lambda d: d["price"]
print(get_price(drugs[0]))   # 1500

double_dose = lambda mg: mg * 2
print(double_dose(500))   # 1000

# --- map() ---
names = list(map(lambda d: d["name"], drugs))
print("Names:", names)

discounted = list(map(lambda d: {**d, "price": round(d["price"] * 0.85)}, drugs))
print("Discounted prices:", [d["price"] for d in discounted])

# --- filter() ---
low_stock = list(filter(lambda d: d["stock"] < 100, drugs))
print("Low stock drugs:", [d["name"] for d in low_stock])

expensive = list(filter(lambda d: d["price"] > 1500, drugs))
print("Expensive:", [f"{d['name']} ₦{d['price']}" for d in expensive])

# --- sorted() with key ---
by_price = sorted(drugs, key=lambda d: d["price"])
print("\\nBy price (cheapest first):")
for d in by_price:
    print(f"  {d['name']}: ₦{d['price']}")

by_stock_desc = sorted(drugs, key=lambda d: d["stock"], reverse=True)
print("\\nBy stock (highest first):")
for d in by_stock_desc:
    print(f"  {d['name']}: {d['stock']}")

# Multi-criteria sort: condition first, then age within each condition
patients = [
    {"name": "Amaka",  "age": 45, "condition": "Diabetes"},
    {"name": "Chidi",  "age": 23, "condition": "Hypertension"},
    {"name": "Victor", "age": 28, "condition": "Diabetes"},
    {"name": "Ngozi",  "age": 61, "condition": "Hypertension"},
]
sorted_patients = sorted(patients, key=lambda p: (p["condition"], p["age"]))
print("\\nSorted by condition, then age:")
for p in sorted_patients:
    print(f"  {p['condition']} | {p['name']} ({p['age']})")

# --- Preview: this is exactly how lambda is used in pandas ---
print("\\nNote: df.apply(lambda x: ...) is precisely this pattern, used on entire DataFrame columns.")
    `,

    commonMistakes: [
      {
        mistake: "Cramming complex logic into a lambda",
        wrong:   "fn = lambda x: x*2 if x > 0 else x/2 if x < -10 else 0   # confusing nested ternary",
        right:   "def transform(x):\n    if x > 0: return x * 2\n    elif x < -10: return x / 2\n    else: return 0",
        explanation: "Lambda should fit comfortably on one simple line. Once you need multiple conditions or steps, write a proper named function instead.",
      },
      {
        mistake: "Forgetting to wrap map() and filter() in list() to see the results",
        wrong:   "result = map(lambda x: x*2, lst)   # just a map object reference",
        right:   "result = list(map(lambda x: x*2, lst))   # the actual usable list",
        explanation: "map() and filter() return lazy iterator objects, not lists. Wrap in list() when you need to print, index, or reuse the results multiple times.",
      },
    ],

    exercises: [
      "Using map() and lambda, convert a list of drug prices in NGN to USD by dividing by 1500. Then use filter() to keep only the drugs costing less than $2 USD.",
      "Sort a list of 10 patient records by (1) their primary condition alphabetically, then (2) age descending within each condition group, using a single sorted() call with a tuple key.",
      "Use lambda with sorted() to sort a list of drug names first by string LENGTH, then alphabetically among names of equal length.",
    ],

    resources: [
      {
        objective: "Write lambda (anonymous) functions correctly",
        items: [
          { title: "Real Python — How to Use Python Lambda Functions", url: "https://realpython.com/python-lambda/", type: "article", note: "Thorough guide on lambda syntax, common use cases, and when to avoid them." },
        ],
      },
      {
        objective: "Use map() and filter() for functional-style transformations",
        items: [
          { title: "Corey Schafer — Lambda, Map, Filter (Video)", url: "https://www.youtube.com/watch?v=hYzwCsKGRrg", type: "video", duration: "~25 mins", note: "Clear walkthrough of all three concepts together with practical examples." },
        ],
      },
      {
        objective: "Sort complex data structures using custom key functions",
        items: [
          { title: "Real Python — Sorting Data With Python", url: "https://realpython.com/python-sort/", type: "article", note: "Covers sorted(), .sort(), key functions, and multi-criteria sorting in depth." },
          { title: "Python Docs — Sorting HOW TO", url: "https://docs.python.org/3/howto/sorting.html", type: "reference", note: "Official guide covering key functions and operator.itemgetter as an alternative to lambda." },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 23 — Decorators & Higher-Order Functions
  // ============================================================
  {
    id: "W5D3", week: 5, day: 3, phase: 1,
    phaseTitle: "Python Mastery",
    date: "2026-07-15",
    type: "lesson",
    topic: "Decorators & Higher-Order Functions",
    duration: "2–3 hours",

    objectives: [
      "Understand functions as first-class objects in Python",
      "Write and apply your own decorators",
      "Use functools.wraps to preserve a decorated function's identity",
      "Recognise decorators in real frameworks (Flask, FastAPI, pytest)",
    ],

    introduction: `
Decorators are an advanced but genuinely essential Python
pattern. They appear everywhere in professional code:

Flask and FastAPI use @app.route() / @app.get() to define API
endpoints. pytest uses @pytest.fixture for test setup. Your
own AI agent code, later in this roadmap, will use decorators
for rate limiting, caching, and logging API calls.

When you see @something written directly above a function
definition, that is a decorator. Today you will understand
precisely what is happening mechanically, and how to write
your own.
    `,

    mentalModel: `
MENTAL MODEL — "The Pre- and Post-Procedure Checklist"

A decorator is a standardised checklist wrapped around a
procedure, applied to every procedure of that type automatically.

Before a controlled drug is dispensed: log the request, verify
the prescription, check authentication. After: log completion,
update the register. You do not want to retype this checklist
inside every single dispensing function — instead, you wrap
the checklist around the function ONCE, and Python silently
runs the "before" steps, then the actual function, then the
"after" steps, every single time it is called.

That wrapping mechanism is exactly what a decorator is.
    `,

    explanation: `
FIRST-CLASS FUNCTIONS
========================
In Python, functions are themselves objects. This means you can:
  - assign a function to a variable
  - pass a function as an argument to another function
  - return a function from another function
This is the foundation that makes decorators possible at all.

HOW A DECORATOR WORKS
========================
A decorator is a function that:
  1. Takes a function as input
  2. Returns a NEW function that wraps the original
  3. The @ symbol is simply shorthand for: fn = decorator(fn)

# Without @ syntax (the manual, equivalent version):
def my_func():
    print("hello")
my_func = log_decorator(my_func)

# With @ syntax (exactly the same thing, written more cleanly):
@log_decorator
def my_func():
    print("hello")

functools.wraps
==================
Without @functools.wraps, a decorated function loses its
original __name__ and docstring, which makes debugging
confusing. Always include it inside your own decorators.
    `,

    clinicalConnection: `
CLINICAL CONNECTION

A @requires_prescription decorator could wrap any dispensing
function and refuse to run it at all unless a valid
prescription number was supplied — without that check logic
being duplicated inside every single drug-specific dispensing
function in your system. This is exactly the kind of clean,
centralised safety check that real pharmacy software relies on,
and it is the same mechanism FastAPI uses later in this roadmap
to enforce that a request includes a valid API key before your
AI health agent will even attempt to answer it.
    `,

    example: `
# ── Day 23 Complete Example ──────────────────────────────

import functools
import time
import datetime

# --- Basic decorator ---
def log_function_call(func):
    """Logs whenever a function is called."""
    @functools.wraps(func)   # preserves the original name and docstring
    def wrapper(*args, **kwargs):
        print(f"[LOG] {datetime.datetime.now().strftime('%H:%M:%S')} — Calling {func.__name__}")
        result = func(*args, **kwargs)
        print(f"[LOG] {func.__name__} completed")
        return result
    return wrapper

@log_function_call
def dispense_drug(drug_name, quantity):
    """Dispenses a drug from inventory."""
    print(f"Dispensing {quantity}x {drug_name}")
    return f"Dispensed {quantity}x {drug_name}"

result = dispense_drug("Metformin", 30)
print(result)

# --- Timing decorator ---
def timer(func):
    """Measures how long a function takes to run."""
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        elapsed = time.time() - start
        print(f"⏱️  {func.__name__} took {elapsed:.4f}s")
        return result
    return wrapper

@timer
def process_large_dataset(n):
    """Simulates processing n patient records."""
    return sum(i ** 2 for i in range(n))

process_large_dataset(1_000_000)

# --- Decorator that takes its own arguments ---
def validate_dose(min_dose=0, max_dose=2000):
    """Validates that a dose argument falls within a safe range."""
    def decorator(func):
        @functools.wraps(func)
        def wrapper(drug_name, dose_mg, *args, **kwargs):
            if not (min_dose < dose_mg <= max_dose):
                raise ValueError(
                    f"Dose {dose_mg}mg is outside the safe range "
                    f"({min_dose}–{max_dose}mg)"
                )
            return func(drug_name, dose_mg, *args, **kwargs)
        return wrapper
    return decorator

@validate_dose(min_dose=0, max_dose=1000)
def administer(drug_name, dose_mg):
    return f"Administering {dose_mg}mg of {drug_name}"

print(administer("Aspirin", 325))   # fine

try:
    print(administer("Aspirin", 5000))   # raises ValueError
except ValueError as e:
    print(f"Error: {e}")

# --- Stacking multiple decorators (applied bottom-up) ---
@timer
@log_function_call
def analyze_patient_records(patient_count):
    return [i ** 2 for i in range(patient_count)]

analyze_patient_records(100_000)

# --- Real-world style: authentication decorator ---
AUTHENTICATED_USERS = {"victor_okolie", "admin_pharmacist"}

def require_auth(func):
    """Only allows authenticated pharmacists to call this function."""
    @functools.wraps(func)
    def wrapper(pharmacist_id, *args, **kwargs):
        if pharmacist_id not in AUTHENTICATED_USERS:
            raise PermissionError(f"Access denied: {pharmacist_id} is not authenticated")
        return func(pharmacist_id, *args, **kwargs)
    return wrapper

@require_auth
def access_controlled_log(pharmacist_id, drug_name):
    return f"[CONTROLLED LOG] {pharmacist_id} accessed records for {drug_name}"

print(access_controlled_log("victor_okolie", "Tramadol"))
try:
    print(access_controlled_log("unknown_user", "Tramadol"))
except PermissionError as e:
    print(f"Error: {e}")
    `,

    commonMistakes: [
      {
        mistake: "Forgetting @functools.wraps inside your own decorator",
        wrong:   "def wrapper(*args): ...\nreturn wrapper   # my_func.__name__ becomes 'wrapper'!",
        right:   "@functools.wraps(func)\ndef wrapper(*args): ...",
        explanation: "Without @functools.wraps, every function decorated this way reports the same generic name and loses its docstring, making debugging and introspection confusing.",
      },
      {
        mistake: "Calling the inner function instead of returning the wrapper itself",
        wrong:   "def decorator(func):\n    return func()   # calls it immediately, returns its RESULT not a function",
        right:   "def decorator(func):\n    def wrapper(*args, **kwargs):\n        return func(*args, **kwargs)\n    return wrapper",
        explanation: "A decorator must return a FUNCTION that Python will call later — not the result of calling the original function right away.",
      },
    ],

    exercises: [
      "Write a @retry(max_attempts=3) decorator that retries a function up to 3 times if it raises an exception — useful for unreliable API calls you will write starting Week 6.",
      "Write a @cache decorator that stores the results of previous calls so identical inputs return instantly without recomputing. Test it on a deliberately slow recursive Fibonacci function.",
      "Write a @requires_prescription decorator for your Week 3 pharmacy project that raises PrescriptionRequiredError if the drug is controlled and no prescription number was supplied.",
    ],

    resources: [
      {
        objective: "Understand functions as first-class objects in Python",
        items: [
          { title: "Real Python — Primer on Python Decorators", url: "https://realpython.com/primer-on-python-decorators/", type: "article", note: "The definitive guide on Python decorators, starting from first-class functions as the foundation." },
        ],
      },
      {
        objective: "Write and apply your own decorators",
        items: [
          { title: "Corey Schafer — Decorators (Video)", url: "https://www.youtube.com/watch?v=FsAPt_9Bf3U", type: "video", duration: "~30 mins", note: "Clear, step-by-step build-up from a plain function to a fully working decorator." },
        ],
      },
      {
        objective: "Use functools.wraps to preserve a decorated function's identity",
        items: [
          { title: "Python Docs — functools.wraps", url: "https://docs.python.org/3/library/functools.html#functools.wraps", type: "reference", note: "Official documentation explaining exactly what wraps preserves and why it matters." },
        ],
      },
      {
        objective: "Recognise decorators in real frameworks (Flask, FastAPI, pytest)",
        items: [
          { title: "FastAPI Documentation — First Steps", url: "https://fastapi.tiangolo.com/tutorial/first-steps/", type: "reference", note: "See @app.get() in action — this is the exact decorator pattern you will use heavily from Week 43 onward." },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 24 — Regular Expressions for Data Cleaning
  // ============================================================
  {
    id: "W5D4", week: 5, day: 4, phase: 1,
    phaseTitle: "Python Mastery",
    date: "2026-07-16",
    type: "lesson",
    topic: "Regular Expressions (regex) for Data Cleaning",
    duration: "2–3 hours",

    objectives: [
      "Understand core regex patterns and the re module",
      "Use re.search(), re.match(), re.findall(), and re.sub() correctly",
      "Write patterns to validate and clean messy real-world data",
      "Apply regex to validate drug names, NAFDAC numbers, and phone numbers",
    ],

    introduction: `
Regular expressions are a small, dense language for matching
patterns in text. They look intimidating the first time you
see one, but they are among the most powerful tools available
for cleaning messy real-world data.

Messy data is the norm, not the exception. NAFDAC numbers
written in five inconsistent formats, phone numbers as +234,
0803, or 234803, dates as "15/06/2026" or "June 15 2026" —
regex lets you clean all of this systematically, at any scale.
pandas' own str.extract() and str.replace() methods are built
directly on top of Python's regex engine.
    `,

    mentalModel: `
MENTAL MODEL — "The Pattern-Matching Stamp"

A regex pattern is a rubber stamp shaped like a very specific
template. You press it against a piece of text to check:
does this text fit the shape of the stamp?

\\d means "any digit goes here." + means "one or more of the
previous shape." A NAFDAC validation pattern like
^[A-Z]\\d{0,2}-\\d{4,5}$ is a stamp shaped exactly like a real
NAFDAC number: one capital letter, up to two digits, a hyphen,
then 4 or 5 digits. If the text doesn't perfectly fit that
shape, the stamp simply doesn't match.
    `,

    explanation: `
CORE PATTERNS
================
.        any character except a newline
\\d        any digit [0-9]
\\w        any word character [a-zA-Z0-9_]
\\s        any whitespace
\\D        NOT a digit
+        one or more of the previous element
*        zero or more of the previous element
?        zero or one of the previous element (optional)
{n}      exactly n of the previous element
{n,m}    between n and m of the previous element
^        start of the string
$        end of the string
[]       a character class, e.g. [aeiou] or [a-z]
|        OR, e.g. (cat|dog)
()       a capturing group

KEY FUNCTIONS
================
re.search(pattern, string)    → find the pattern ANYWHERE in the string
re.match(pattern, string)     → match only at the START of the string
re.fullmatch(pattern, string) → the ENTIRE string must match
re.findall(pattern, string)   → ALL matches, returned as a list
re.sub(pattern, repl, string) → find and replace
re.split(pattern, string)     → split a string by a pattern

ALWAYS use raw strings (r'...') for regex patterns to prevent
Python from interpreting backslashes before the regex engine does.
    `,

    clinicalConnection: `
CLINICAL CONNECTION

Real Nigerian pharmacy data is messy in extremely specific,
predictable ways:
  "  METFORMIN  HCL  500MG  "
  "Aspirin (325mg) - Oral"
  "amoxicillin-500mg-capsules"

A single well-designed regex-based cleaning function can
standardise all of these into "Metformin", "Aspirin", and
"Amoxicillin" reliably. This is not a hypothetical exercise —
it is the very first step you will perform on every real
health dataset you work with for the rest of your career.
    `,

    example: `
# ── Day 24 Complete Example ──────────────────────────────

import re

# --- Basic search ---
text = "Patient prescribed Metformin 500mg twice daily for 30 days"

dose = re.search(r"\\d+mg", text)
if dose:
    print(f"Found dose: {dose.group()}")   # 500mg

numbers = re.findall(r"\\d+", text)
print(f"All numbers: {numbers}")   # ['500', '30']

# --- Validation ---
def validate_nafdac(number):
    """NAFDAC format: one letter, optional 1-2 digits, hyphen, 4-5 digits."""
    pattern = r"^[A-Z]\\d{0,2}-\\d{4,5}$"
    return bool(re.fullmatch(pattern, number))

test_numbers = ["A1-0234", "B12-45678", "123-456", "AB-1234", "C3-99"]
for num in test_numbers:
    valid = validate_nafdac(num)
    print(f"  {num}: {'✓ Valid' if valid else '✗ Invalid'}")

# --- Phone number normalisation ---
def normalize_phone(raw):
    """Converts Nigerian phone numbers into +234 format."""
    digits = re.sub(r"\\D", "", raw)   # strip all non-digit characters
    if digits.startswith("234"):
        return "+" + digits
    elif digits.startswith("0") and len(digits) == 11:
        return "+234" + digits[1:]
    return None

phones = ["08012345678", "+2348012345678", "234-8012-345678", "0803 456 7890"]
for phone in phones:
    print(f"  {phone} → {normalize_phone(phone)}")

# --- Cleaning messy drug names ---
raw_drug_names = [
    "  METFORMIN  HCL  500MG  ",
    "Aspirin (325mg)  -  Oral",
    "amoxicillin-500mg-capsules",
    "PARACETAMOL///500///MG",
]

def clean_drug_name(raw):
    """Cleans a messy drug name string to a standardised format."""
    cleaned = re.sub(r"\\(.*?\\)", "", raw)                              # drop parentheses content
    cleaned = re.sub(r"\\d+\\s*(mg|g|mcg|IU)", "", cleaned, flags=re.IGNORECASE)  # drop dose info
    cleaned = re.sub(r"[^a-zA-Z\\s]", " ", cleaned)                       # non-letters → spaces
    cleaned = re.sub(r"\\s+", " ", cleaned).strip().title()               # collapse spaces, title case
    return cleaned

for name in raw_drug_names:
    print(f"  '{name}' → '{clean_drug_name(name)}'")

# --- Extracting structured data from free text ---
prescription = """
Patient: Victor Okolie, 28M
Date: 15/06/2026
Drugs:
  1. Metformin 500mg BD x 30 days
  2. Lisinopril 10mg OD x 30 days
"""

drug_pattern = r"(\\w+)\\s+(\\d+mg)"
matches = re.findall(drug_pattern, prescription)
print("\\nExtracted drugs:")
for drug, dose in matches:
    print(f"  {drug}: {dose}")

patient_match = re.search(r"Patient: (.+?), (\\d+)(M|F)", prescription)
if patient_match:
    name, age, gender = patient_match.groups()
    print(f"\\nPatient: {name}, Age: {age}, Gender: {'Male' if gender == 'M' else 'Female'}")
    `,

    commonMistakes: [
      {
        mistake: "Calling .group() on a search that returned None",
        wrong:   "match = re.search(pattern, text)\nprint(match.group())   # crashes if no match was found",
        right:   "match = re.search(pattern, text)\nif match:\n    print(match.group())",
        explanation: "re.search() returns None when nothing matches. Always check for None before calling .group() on the result.",
      },
      {
        mistake: "Forgetting to use raw strings for regex patterns",
        wrong:   're.search("\\\\d+", text)   # backslash may be interpreted before regex sees it',
        right:   're.search(r"\\\\d+", text)   # r prefix prevents Python from pre-processing the backslash',
        explanation: "Without the r prefix, Python's own string escaping rules can interfere with characters the regex engine expects to see literally.",
      },
    ],

    exercises: [
      "Write a regex to extract every drug name and dose pair from a paragraph of clinical text, and test it on at least 5 differently formatted example sentences.",
      "Build a data validation function for patient intake records using regex: validate the name (letters and spaces only), age (1-3 digits), and phone number (Nigerian format).",
      "Take a list of 20 deliberately messy drug names and clean them with a single reusable function: stripping whitespace, removing doses, removing punctuation, and standardising to Title Case.",
    ],

    resources: [
      {
        objective: "Understand core regex patterns and the re module",
        items: [
          { title: "CS50P — Week 7: Regular Expressions", url: "https://cs50.harvard.edu/python/2022/weeks/7/", type: "video", duration: "~2 hrs", note: "Harvard's clear, beginner-friendly introduction to regex in Python." },
          { title: "Python Docs — Regular Expression HOWTO", url: "https://docs.python.org/3/howto/regex.html", type: "reference", note: "The official, thorough guide to Python's re module." },
        ],
      },
      {
        objective: "Use re.search(), re.match(), re.findall(), and re.sub() correctly",
        items: [
          { title: "Real Python — Regular Expressions: Regexes in Python", url: "https://realpython.com/regex-python/", type: "article", note: "Comprehensive guide covering every core re function with worked examples." },
        ],
      },
      {
        objective: "Write patterns to validate and clean messy real-world data",
        items: [
          { title: "Regex101 — Interactive Regex Tester", url: "https://regex101.com/", type: "interactive", note: "Test your regex patterns instantly with live highlighting. Bookmark this — you will use it for years." },
        ],
      },
      {
        objective: "Apply regex to validate drug names, NAFDAC numbers, and phone numbers",
        items: [
          { title: "Python Docs — re Module Reference", url: "https://docs.python.org/3/library/re.html", type: "reference", note: "Complete official reference for every function and flag in the re module." },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 25 — PROJECT: Data Cleaning & Transformation Engine
  // ============================================================
  {
    id: "W5D5", week: 5, day: 5, phase: 1,
    phaseTitle: "Python Mastery",
    date: "2026-07-17",
    type: "project",
    topic: "PROJECT: Data Cleaning & Transformation Engine",
    duration: "4–5 hours",

    objectives: [
      "Apply comprehensions, lambda, regex, and decorators together",
      "Build a reusable data cleaning pipeline",
      "Process a deliberately messy, realistic dataset",
      "Push the project to GitHub with before/after evidence",
    ],

    introduction: `
This project brings together every tool from Week 5 into one
genuinely useful piece of software: a data cleaning engine.

Data cleaning is widely estimated to consume 60–80% of real
data science work. A polished, well-documented data cleaning
project is therefore one of the most directly employable
pieces of evidence you can put in your portfolio — it proves
you understand the part of the job that takes up most of the
actual time.
    `,

    mentalModel: `
MENTAL MODEL — "Triage Before Treatment"

No clinician treats a patient before triage: vitals checked,
history confirmed, obvious errors in the chart corrected.
Data cleaning is triage for datasets — nothing downstream
(analysis, modelling, AI) can be trusted until the raw input
has been validated and standardised first.
    `,

    projectBrief: `
BUILD: A data cleaning and transformation engine for pharmacy records.

Take a deliberately messy input CSV (you create it, with
intentional errors) and clean it:
1. Normalise drug names (strip, title case, remove embedded doses)
2. Validate and standardise NAFDAC numbers, flagging invalid ones
3. Normalise phone numbers to +234 format
4. Parse and standardise dates from multiple formats into ISO 8601
5. Flag and separately log any invalid records rather than silently dropping them
6. Output: a clean CSV, a separate error log, and a short summary report

USE:
- Regex for pattern matching and cleaning (Day 24)
- Lambda + map/filter for quick transformations (Day 22)
- Comprehensions for building output structures (Day 21)
- A @log_step decorator that prints which cleaning step ran and how many records it affected (Day 23)

REAL DATA:
Create intentionally messy data simulating what you would
genuinely find in a small Nigerian pharmacy's hand-typed
records: typos, inconsistent formats, missing values, and
at least a few exact duplicate rows.

PUSH TO GITHUB:
Repository name: python-week5-data-cleaner
Show the messy input alongside the clean output directly in
your README — this before/after comparison is exactly what
makes a data cleaning project compelling to a reviewer.
    `,

    example: `
# ── Starter scaffold — build the full pipeline around this ──

import re
import csv
import functools

def log_step(step_name):
    """Decorator that logs a cleaning step's name and record count."""
    def decorator(func):
        @functools.wraps(func)
        def wrapper(records, *args, **kwargs):
            result = func(records, *args, **kwargs)
            print(f"[{step_name}] processed {len(records)} records")
            return result
        return wrapper
    return decorator

@log_step("Clean drug names")
def clean_drug_names(records):
    for r in records:
        name = re.sub(r"\\d+\\s*(mg|g|mcg)", "", r["drug_name"], flags=re.IGNORECASE)
        name = re.sub(r"[^a-zA-Z\\s]", " ", name)
        r["drug_name"] = re.sub(r"\\s+", " ", name).strip().title()
    return records

@log_step("Validate NAFDAC numbers")
def validate_nafdac_numbers(records):
    pattern = r"^[A-Z]\\d{0,2}-\\d{4,5}$"
    errors = []
    for r in records:
        if not re.fullmatch(pattern, r.get("nafdac", "")):
            errors.append(r)
    return errors   # the invalid ones, to be logged separately

# Continue building: normalize_phones(), standardize_dates(),
# remove_duplicates(), and the main pipeline that chains all
# of these steps together and writes the three output files.
    `,

    commonMistakes: [],
    exercises: [],

    resources: [
      {
        objective: "Build a reusable data cleaning pipeline",
        items: [
          { title: "Kaggle Learn — Data Cleaning (Free Micro-Course)", url: "https://www.kaggle.com/learn/data-cleaning", type: "interactive", note: "Short, free, hands-on course specifically about data cleaning techniques and mindset." },
        ],
      },
      {
        objective: "Push the project to GitHub with before/after evidence",
        items: [
          { title: "GitHub Docs — About READMEs", url: "https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes", type: "reference", note: "Use tables or side-by-side code blocks to show messy input vs clean output clearly." },
        ],
      },
    ],
  },

];

if (typeof module !== "undefined") {
  module.exports = { WEEK5 };
}
