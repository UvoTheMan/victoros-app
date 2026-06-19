// ============================================================
// WEEK 2 — Functions, Lists, Dictionaries, Tuples
// Days 6–10 | 22–26 June 2026
// Enriched: Mental Models, Clinical Connections,
//           Objective-mapped resources (video + article + tool)
// ============================================================

const WEEK2 = [

  // ============================================================
  // DAY 6 — Functions: Defining, Parameters, Return Values
  // ============================================================
  {
    id: "W2D1", week: 2, day: 1, phase: 1,
    phaseTitle: "Python Mastery",
    date: "2026-06-22",
    type: "lesson",
    topic: "Functions: Defining, Parameters & Return Values",
    duration: "2–3 hours",

    objectives: [
      "Define functions with def and call them correctly",
      "Understand the difference between parameters and arguments",
      "Use default parameters and keyword arguments",
      "Return values from functions and understand None",
    ],

    introduction: `
Functions are the most important concept in programming.

Not loops. Not conditionals. Functions.

Here is why: everything else you have learned so far 
produces code that runs once, linearly, and is then 
forgotten. Functions let you name a block of logic 
and reuse it as many times as needed, anywhere in 
your program, without rewriting it.

Every pandas method you will call (df.groupby(), 
df.merge(), df.apply()) is a function written by 
someone else. Every scikit-learn method (model.fit(), 
model.predict()) is a function. Every Claude API 
call is a function. When you write your AI health 
agent, the core of it is a function.

Understanding functions deeply — not just how to 
call them, but how to design them well — is what 
makes you a programmer rather than someone who 
runs scripts.
    `,

    mentalModel: `
MENTAL MODEL — "The Standard Operating Procedure"

A function is a Standard Operating Procedure (SOP).

In a well-run pharmacy, you do not reinvent the 
dispensing protocol every time a patient arrives.
You wrote the SOP once, named it, and now every 
pharmacist follows it — consistently, without 
variation, every time.

A function is an SOP for your code:
  - Write the logic once (define the function)
  - Give it a name (def calculate_dose)
  - Call it every time you need it (calculate_dose(age, weight))
  - The result is always consistent

The inputs to the SOP are PARAMETERS.
The specific values you provide on a particular 
occasion are ARGUMENTS.
The outcome the SOP produces is the RETURN VALUE.
    `,

    explanation: `
DEFINING A FUNCTION
===================
def function_name(parameter1, parameter2):
    """Docstring: what this function does."""
    # function body
    return result

def     → keyword that begins the definition
name    → snake_case, descriptive verb phrase
params  → inputs the function expects (optional)
return  → sends a value back to the caller

CALLING A FUNCTION
==================
result = function_name(argument1, argument2)

The function runs its body and returns a value.
That value is assigned to result.

PARAMETERS vs ARGUMENTS
========================
Parameters → variables in the DEFINITION (the template)
Arguments  → actual values when CALLING (the specific case)

def greet(name):       ← 'name' is a PARAMETER
    return f"Hi, {name}"

greet("Victor")        ← "Victor" is an ARGUMENT

DEFAULT PARAMETERS
==================
Parameters can have default values, used when 
the caller does not provide that argument.

def dispense(drug, quantity=30, unit="tablets"):
    return f"{quantity} {unit} of {drug}"

dispense("Metformin")           → "30 tablets of Metformin"
dispense("Metformin", 60)       → "60 tablets of Metformin"
dispense("Metformin", unit="mg")→ "30 mg of Metformin"

KEYWORD ARGUMENTS
=================
You can name arguments when calling — order no longer matters.
dispense(quantity=60, drug="Aspirin", unit="tablets")

RETURN VALUES
=============
return sends exactly one value back to the caller.
A function can return any type: int, string, list, dict.
A function can return multiple values as a tuple:
  return min_val, max_val    ← actually returns (min_val, max_val)
  low, high = my_function()  ← unpack immediately

If a function has no return statement, it returns None.
None is Python's way of saying "nothing" — not zero, not 
empty string, literally the absence of a value.

SCOPE
=====
Variables created inside a function only exist INSIDE 
that function. They are destroyed when the function ends.
This is called local scope.
Variables outside all functions are in global scope.
    `,

    clinicalConnection: `
CLINICAL CONNECTION

Every clinical calculation you do manually is a function 
waiting to be written:

  calculate_crcl(age, weight, serum_creatinine, sex)
  adjust_dose_for_renal(drug, crcl)
  classify_bmi(weight_kg, height_m)
  check_interaction(drug1, drug2)
  generate_label(patient, drug, dose, frequency, days)

Once written, each function can be applied to every 
patient in a dataset automatically. A calculation that 
takes you 2 minutes per patient takes 2 microseconds 
per patient when written as a function and applied 
across a dataset.

This is the entire value proposition of clinical 
data science: your expertise encoded as functions, 
applied at scale.
    `,

    example: `
# ── Day 6 Complete Example ──────────────────────────────

# --- Basic function ---
def calculate_bmi(weight_kg, height_m):
    """
    Calculates Body Mass Index.

    Args:
        weight_kg: Patient weight in kilograms (float)
        height_m:  Patient height in metres (float)

    Returns:
        BMI rounded to 1 decimal place (float)
    """
    bmi = weight_kg / (height_m ** 2)
    return round(bmi, 1)

print(calculate_bmi(70, 1.75))   # 22.9
print(calculate_bmi(95, 1.68))   # 33.7

# --- Function with default parameters ---
def dispensing_label(drug, dose_mg, frequency="twice daily",
                     duration_days=7, pharmacist="Victor Okolie"):
    """Generates a formatted dispensing label string."""
    import datetime
    today = datetime.date.today().strftime("%d/%m/%Y")
    return (
        f"\n{'─'*38}\n"
        f"  Drug      : {drug} {dose_mg}mg\n"
        f"  Frequency : {frequency}\n"
        f"  Duration  : {duration_days} days\n"
        f"  Date      : {today}\n"
        f"  Dispensed : {pharmacist}\n"
        f"{'─'*38}"
    )

# Using defaults
print(dispensing_label("Amoxicillin", 500))

# Overriding defaults
print(dispensing_label("Metformin", 850,
                        frequency="three times daily",
                        duration_days=30))

# --- Keyword arguments ---
print(dispensing_label(
    duration_days=14,
    drug="Lisinopril",
    dose_mg=10,
    frequency="once daily"
))

# --- Multiple return values ---
def patient_stats(weights_kg):
    """
    Returns summary statistics for a list of patient weights.

    Returns:
        Tuple of (min, max, average) all in kg
    """
    return (
        min(weights_kg),
        max(weights_kg),
        round(sum(weights_kg) / len(weights_kg), 1)
    )

weights = [55.0, 72.5, 88.0, 63.0, 91.5, 47.2]
lightest, heaviest, average = patient_stats(weights)
print(f"\nLightest: {lightest}kg")
print(f"Heaviest: {heaviest}kg")
print(f"Average : {average}kg")

# --- Function calling another function ---
def classify_bmi(weight_kg, height_m):
    """Uses calculate_bmi() and classifies the result."""
    bmi = calculate_bmi(weight_kg, height_m)  # calls another function
    if bmi < 18.5:
        category = "Underweight"
    elif bmi < 25.0:
        category = "Normal weight"
    elif bmi < 30.0:
        category = "Overweight"
    else:
        category = "Obese"
    return bmi, category

bmi_val, category = classify_bmi(95, 1.68)
print(f"\nBMI: {bmi_val} — {category}")

# --- None return (no return statement) ---
def log_dispense(drug, qty):
    """Logs to console. Returns nothing (None)."""
    print(f"[LOG] Dispensed {qty}x {drug}")
    # no return statement → returns None

result = log_dispense("Aspirin", 30)
print(f"Return value: {result}")   # None

# --- Scope demonstration ---
multiplier = 2   # global scope

def double_dose(dose_mg):
    adjusted = dose_mg * multiplier  # can READ global
    return adjusted                   # local 'adjusted' dies here

print(double_dose(500))   # 1000
# print(adjusted)         # NameError — 'adjusted' is local only
    `,

    commonMistakes: [
      {
        mistake: "Forgetting the return statement",
        wrong:   "def add(a, b):\n    a + b     # calculated but discarded",
        right:   "def add(a, b):\n    return a + b",
        explanation: "Without return, the result disappears and the function returns None. This is one of the most common silent bugs for beginners.",
      },
      {
        mistake: "Defining a function after calling it",
        wrong:   "result = calculate(5)\ndef calculate(n):\n    return n * 2",
        right:   "def calculate(n):\n    return n * 2\nresult = calculate(5)",
        explanation: "Python reads top to bottom. You must define a function before calling it.",
      },
      {
        mistake: "Using a mutable default argument (notorious Python gotcha)",
        wrong:   "def add_drug(name, formulary=[]):\n    formulary.append(name)\n    return formulary",
        right:   "def add_drug(name, formulary=None):\n    if formulary is None: formulary = []\n    formulary.append(name)\n    return formulary",
        explanation: "Default lists are created ONCE and shared across all calls. Every call without a formulary argument modifies the SAME list. Always use None as default for mutable arguments.",
      },
      {
        mistake: "Confusing printing with returning",
        wrong:   "def get_bmi(w, h):\n    print(w / h**2)   # displayed but not usable",
        right:   "def get_bmi(w, h):\n    return w / h**2   # caller can use the result",
        explanation: "print() shows a value. return sends it back to the caller. If you need to USE the result later, return it. You can always print the returned value separately.",
      },
    ],

    exercises: [
      "Write a function drug_interaction_check(drug1, drug2) that checks a hardcoded dictionary of known interactions and returns a warning string or 'No known interaction'. Include at least 5 real interactions in your dictionary.",
      "Write a function generate_prescription(patient_name, age, drugs_list) where drugs_list is a list of (drug_name, dose_mg, frequency) tuples. It should return a formatted multi-line prescription string with a header, date, and numbered drug list.",
      "Write a function cockcroft_gault(age, weight_kg, serum_creatinine, is_female=False) that returns creatinine clearance in mL/min. Then write a second function dose_adjustment(drug, crcl) that uses the first function's output to recommend a dose.",
      "Take your Week 1 CLI project and refactor it: extract every logical chunk into a named function. Target at least 6 separate functions. The main() function should read like a high-level summary of the program.",
    ],

    resources: [
      {
        objective: "Define functions with def and call them correctly",
        items: [
          {
            title:    "Real Python — Defining Your Own Python Function",
            url:      "https://realpython.com/defining-your-own-python-function/",
            type:     "article",
            note:     "The most complete free guide to Python functions. Covers every concept from today.",
          },
          {
            title:    "CS50P Lecture 0 — Functions (Video)",
            url:      "https://cs50.harvard.edu/python/2022/weeks/0/",
            type:     "video",
            duration: "~2 hrs",
            note:     "Harvard's treatment of functions is excellent — watch from the 45-minute mark.",
          },
        ],
      },
      {
        objective: "Understand the difference between parameters and arguments",
        items: [
          {
            title:    "Real Python — Parameters vs Arguments",
            url:      "https://realpython.com/defining-your-own-python-function/#function-calls-and-definition",
            type:     "article",
            note:     "Specific section clarifying the parameter/argument distinction with clear examples.",
          },
        ],
      },
      {
        objective: "Use default parameters and keyword arguments",
        items: [
          {
            title:    "Real Python — Default Parameter Values",
            url:      "https://realpython.com/defining-your-own-python-function/#default-parameter-values",
            type:     "article",
            note:     "Covers default values including the mutable default argument gotcha — essential reading.",
          },
          {
            title:    "W3Schools — Python Functions (Interactive)",
            url:      "https://www.w3schools.com/python/python_functions.asp",
            type:     "interactive",
            note:     "Quick interactive reference. Good for testing keyword argument syntax.",
          },
        ],
      },
      {
        objective: "Return values from functions and understand None",
        items: [
          {
            title:    "Real Python — The return Statement",
            url:      "https://realpython.com/python-return-statement/",
            type:     "article",
            note:     "Deep guide on return — including multiple returns, early returns, and returning None.",
          },
          {
            title:    "Corey Schafer — Python Functions (Video)",
            url:      "https://www.youtube.com/watch?v=9Os0o3wzS_I",
            type:     "video",
            duration: "~30 mins",
            note:     "Clear walkthrough of function basics including return values and scope.",
          },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 7 — Lists: Indexing, Methods, Comprehensions
  // ============================================================
  {
    id: "W2D2", week: 2, day: 2, phase: 1,
    phaseTitle: "Python Mastery",
    date: "2026-06-23",
    type: "lesson",
    topic: "Lists: Creation, Indexing, Methods & Comprehensions",
    duration: "2–3 hours",

    objectives: [
      "Create and index lists including negative indexing and slicing",
      "Use the most important list methods fluently",
      "Write list comprehensions for concise transformations",
      "Understand the difference between modifying and replacing a list",
    ],

    introduction: `
Lists are Python's most versatile data structure and 
the direct predecessor of everything you will use in 
data science.

A pandas DataFrame column is a list with extra features.
A numpy array is a list optimised for mathematics.
A CSV row is a list of strings.
A JSON array is a list.
An API response's results field is almost always a list.

If you understand Python lists deeply, every data 
structure in every library will feel familiar from 
day one. The abstractions change; the underlying 
concept stays the same.

List comprehensions in particular are considered 
the most "Pythonic" way to write data transformation 
code. In pandas, you will use df.apply(lambda x: ...)
which is effectively a list comprehension over rows.
Understanding comprehensions now means that syntax 
will be immediately readable to you.
    `,

    mentalModel: `
MENTAL MODEL — "The Drug Register"

A list is your drug dispensing register — an ordered 
record of items where position matters.

Entry 0 is the first drug dispensed today.
Entry -1 is the most recent.
You can look up any entry by its position number.
You can add new entries at the end (.append).
You can insert at a specific position (.insert).
You can remove the last entry (.pop).
You can sort the entire register (.sort).

Crucially: a list remembers order. If you need to know 
that Drug A was dispensed before Drug B, a list 
preserves that information. A set would not.
    `,

    explanation: `
CREATING LISTS
==============
empty      = []
numbers    = [1, 2, 3, 4, 5]
drugs      = ["Aspirin", "Metformin", "Lisinopril"]
mixed      = [1, "Aspirin", True, 3.5]   # possible but avoid

INDEXING — zero-based
=====================
drugs = ["Aspirin", "Metformin", "Lisinopril", "Atorvastatin"]
drugs[0]    → "Aspirin"       (first item)
drugs[1]    → "Metformin"     (second item)
drugs[-1]   → "Atorvastatin"  (last item)
drugs[-2]   → "Lisinopril"    (second to last)

SLICING
=======
drugs[0:2]   → ["Aspirin", "Metformin"]    (0 and 1, not 2)
drugs[1:]    → ["Metformin", "Lisinopril", "Atorvastatin"]
drugs[:2]    → ["Aspirin", "Metformin"]
drugs[::2]   → ["Aspirin", "Lisinopril"]   (every 2nd item)
drugs[::-1]  → reversed list

KEY LIST METHODS
================
.append(x)     → add x to the END (most common)
.insert(i, x)  → insert x at index i
.extend(lst)   → add all items from another list
.remove(x)     → remove FIRST occurrence of x (by value)
.pop()         → remove and RETURN last item
.pop(i)        → remove and return item at index i
.index(x)      → find the index of first occurrence of x
.count(x)      → count occurrences of x
.sort()        → sort in place (modifies original)
sorted(lst)    → returns NEW sorted list
.reverse()     → reverse in place
.copy()        → return a shallow copy
len(lst)       → number of items
x in lst       → True/False membership check

LIST COMPREHENSION
==================
New list = [expression for item in iterable]
New list = [expression for item in iterable if condition]

# Traditional loop:
squares = []
for n in range(1, 6):
    squares.append(n ** 2)

# Comprehension — same result:
squares = [n ** 2 for n in range(1, 6)]

# With filter:
high_doses = [d for d in doses if d >= 500]

# With transformation:
upper_drugs = [drug.upper() for drug in drugs]
    `,

    clinicalConnection: `
CLINICAL CONNECTION

List comprehensions are directly equivalent to pandas 
vectorized string operations:

Python list comprehension:
  cleaned = [name.strip().title() for name in raw_names]

pandas equivalent:
  df["name"] = df["name"].str.strip().str.title()

Both do exactly the same thing — apply a transformation 
to every item in a sequence. Learning list comprehensions 
NOW means when you see pandas str methods in Phase 2, 
you will immediately understand what they are doing 
under the hood.

Boolean indexing in lists:
  high_risk = [p for p in patients if p["age"] > 65]

pandas equivalent:
  high_risk = df[df["age"] > 65]

Same logic, different syntax.
    `,

    example: `
# ── Day 7 Complete Example ──────────────────────────────

# --- Creating and indexing ---
formulary = ["Amoxicillin", "Metformin", "Lisinopril",
             "Atorvastatin", "Omeprazole", "Tramadol"]

print(f"First  : {formulary[0]}")    # Amoxicillin
print(f"Last   : {formulary[-1]}")   # Tramadol
print(f"Slice  : {formulary[1:4]}")  # ['Metformin', 'Lisinopril', 'Atorvastatin']
print(f"Every 2: {formulary[::2]}")  # ['Amoxicillin', 'Lisinopril', 'Omeprazole']
print(f"Total  : {len(formulary)}")  # 6

# --- Modifying lists ---
formulary.append("Aspirin")
print(f"\nAfter append: {formulary}")

formulary.insert(0, "Paracetamol")   # insert at position 0
print(f"After insert: {formulary}")

removed = formulary.pop()            # removes last: "Aspirin"
print(f"Removed: {removed}")
print(f"After pop: {formulary}")

formulary.remove("Tramadol")         # remove by value
print(f"After remove: {formulary}")

# --- Sorting ---
print(f"\nSorted (new list): {sorted(formulary)}")
print(f"Original unchanged: {formulary}")  # still original order

formulary.sort()   # sorts IN PLACE
print(f"After .sort(): {formulary}")

# --- Searching ---
if "Metformin" in formulary:
    idx = formulary.index("Metformin")
    print(f"\nMetformin found at index {idx}")

# --- Copying correctly ---
original = ["Aspirin", "Metformin"]
wrong_copy = original          # NOT a copy — same list!
right_copy = original.copy()   # actual copy

wrong_copy.append("Lisinopril")
print(f"\nOriginal after wrong_copy change: {original}")   # changed!
print(f"Right copy unchanged: {right_copy}")               # unchanged

# --- LIST COMPREHENSIONS ---
doses = [100, 250, 500, 750, 1000, 200, 800]

# Transform: double every dose
doubled = [dose * 2 for dose in doses]
print(f"\nDoubled: {doubled}")

# Filter: only doses >= 500
high_doses = [dose for dose in doses if dose >= 500]
print(f"High doses: {high_doses}")

# Transform + filter: halved doses, only if original >= 500
reduced_high = [dose // 2 for dose in doses if dose >= 500]
print(f"Reduced high: {reduced_high}")

# String transformation
raw_names = ["  METFORMIN  ", "aspirin", "LISINOPRIL hcl "]
cleaned   = [name.strip().title() for name in raw_names]
print(f"\nCleaned names: {cleaned}")

# Classification with comprehension
ages = [12, 45, 67, 8, 23, 78, 34, 55]
groups = [
    "Paediatric" if age < 18
    else "Geriatric" if age >= 65
    else "Adult"
    for age in ages
]
print(f"\nAge groups: {groups}")

# Nested list (2D) — patient records
patients = [
    ["Victor",  28, "Hypertension"],
    ["Amaka",   45, "Type 2 Diabetes"],
    ["Chidi",   61, "Heart Disease"],
]

print("\n=== Patient Summary ===")
for name, age, condition in patients:   # tuple unpacking
    risk = "High" if age > 50 else "Standard"
    print(f"  {name} ({age}) — {condition} — Risk: {risk}")
    `,

    commonMistakes: [
      {
        mistake: "IndexError — accessing an index that does not exist",
        wrong:   "lst = ['a','b','c']\nlst[3]  # IndexError — only 0,1,2 exist",
        right:   "lst[-1]  # safely gets last item\n# or: lst[len(lst)-1]",
        explanation: "A list of 3 items has indices 0, 1, 2. Index 3 does not exist. Use -1 for the last item.",
      },
      {
        mistake: "Confusing .sort() (in-place) with sorted() (new list)",
        wrong:   "new_list = my_list.sort()   # new_list is None!",
        right:   "my_list.sort()              # modifies in place, returns None\nnew_list = sorted(my_list)  # returns a new sorted list",
        explanation: ".sort() modifies the original and returns None. sorted() always returns a new list.",
      },
      {
        mistake: "Assigning a list to another variable does not copy it",
        wrong:   "list2 = list1\nlist2.append(x)  # also modifies list1!",
        right:   "list2 = list1.copy()  # or list1[:]",
        explanation: "list2 = list1 makes both names point to the SAME list in memory. Use .copy() to create an independent copy.",
      },
      {
        mistake: "Modifying a list while iterating over it",
        wrong:   "for item in my_list:\n    if condition: my_list.remove(item)  # skips items",
        right:   "my_list = [x for x in my_list if not condition]",
        explanation: "Removing from a list during iteration causes Python to skip items. Filter with a comprehension instead.",
      },
    ],

    exercises: [
      "Create a list of 10 drug prices in Nigerian Naira. Use a list comprehension to: (a) apply a 15% discount to prices above ₦1500, (b) convert all prices to USD by dividing by 1500, (c) filter only affordable drugs (< ₦1000 original price).",
      "Given a list of patient ages [23, 45, 67, 8, 12, 78, 34, 55, 16, 91], use a single list comprehension to produce a list of strings classifying each as 'Paediatric' (<18), 'Adult' (18-64), or 'Geriatric' (65+).",
      "Write a function search_formulary(formulary_list, search_term) that returns all drug names that CONTAIN the search term (case-insensitive). Use a list comprehension inside the function.",
      "Write a function top_n_drugs(dispensing_log, n) that takes a list of drug names (with repetitions representing multiple dispenses) and returns the n most frequently dispensed drugs in order. Use only list methods — no Counter yet.",
    ],

    resources: [
      {
        objective: "Create and index lists including negative indexing and slicing",
        items: [
          {
            title:    "Real Python — Python Lists and Tuples",
            url:      "https://realpython.com/python-lists-tuples/",
            type:     "article",
            note:     "Comprehensive guide covering creation, indexing, slicing, and all list methods.",
          },
          {
            title:    "Python Docs — Lists",
            url:      "https://docs.python.org/3/tutorial/datastructures.html#more-on-lists",
            type:     "reference",
            note:     "Official Python tutorial section on lists — complete method reference.",
          },
          {
            title:    "Corey Schafer — Python Lists, Tuples, Sets (Video)",
            url:      "https://www.youtube.com/watch?v=W8KRzm-HUcc",
            type:     "video",
            duration: "~30 mins",
            note:     "Clear walkthrough of list creation, indexing, and the most important methods.",
          },
        ],
      },
      {
        objective: "Use the most important list methods fluently",
        items: [
          {
            title:    "W3Schools — Python List Methods (Interactive)",
            url:      "https://www.w3schools.com/python/python_lists_methods.asp",
            type:     "interactive",
            note:     "Complete list of every list method with live editor. Use as a reference during exercises.",
          },
        ],
      },
      {
        objective: "Write list comprehensions for concise transformations",
        items: [
          {
            title:    "Real Python — List Comprehensions in Python",
            url:      "https://realpython.com/list-comprehension-python/",
            type:     "article",
            note:     "The definitive free guide to list comprehensions including nested and conditional forms.",
          },
          {
            title:    "Python Docs — List Comprehensions",
            url:      "https://docs.python.org/3/tutorial/datastructures.html#list-comprehensions",
            type:     "reference",
            note:     "Official Python tutorial section with clear examples.",
          },
        ],
      },
      {
        objective: "Understand the difference between modifying and replacing a list",
        items: [
          {
            title:    "Real Python — Shallow vs Deep Copy",
            url:      "https://realpython.com/copying-python-objects/",
            type:     "article",
            note:     "Explains why list2 = list1 does not copy — one of the most important concepts for avoiding silent bugs.",
          },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 8 — Dictionaries & Sets
  // ============================================================
  {
    id: "W2D3", week: 2, day: 3, phase: 1,
    phaseTitle: "Python Mastery",
    date: "2026-06-24",
    type: "lesson",
    topic: "Dictionaries & Sets: Key-Value Storage",
    duration: "2–3 hours",

    objectives: [
      "Create, access, and modify dictionaries by key",
      "Loop through dictionaries with .items(), .keys(), .values()",
      "Use .get() for safe key access",
      "Understand sets and when to use them instead of lists",
    ],

    introduction: `
Dictionaries are the most important data structure 
for data science after lists — and arguably more 
important in day-to-day coding.

Every JSON response from every API you will ever 
call is a dictionary. Every row in a pandas DataFrame 
can be accessed as a dictionary. Every configuration 
file is a dictionary. Every database record maps to 
a dictionary.

The reason dictionaries are so powerful is lookup 
speed. Finding an item in a list of 1 million items 
requires checking up to 1 million items (O(n)).
Finding a value in a dictionary of 1 million items 
always takes the same amount of time, regardless 
of size (O(1)). This is called constant-time lookup 
and it is what makes dictionaries indispensable.

Sets share this speed advantage for membership checks.
If you need to ask "is this drug in my formulary?" 
10,000 times per second, use a set — not a list.
    `,

    mentalModel: `
MENTAL MODEL — "The Drug Database"

A dictionary is a drug database.

You do not browse a drug database sequentially from 
page 1 until you find what you need. You look up 
by name: "Metformin" → and instantly get all its 
properties.

In Python:
  drug_db["Metformin"]  →  {dose: 500, class: "Biguanide", ...}

The drug NAME is the key. The drug PROPERTIES are 
the value. You look up by key, you get the value.

A set is the formulary whiteboard — just a list of 
names, no duplicates, no order. It only answers 
one question: "Is this drug on the board?" 
And it answers it instantly.
    `,

    explanation: `
CREATING DICTIONARIES
=====================
empty = {}
drug = {
    "name":          "Metformin",
    "dose_mg":       500,
    "is_controlled": False,
    "indications":   ["Type 2 Diabetes", "PCOS"]
}

Keys must be unique. Values can be anything.
Keys are almost always strings or integers.

ACCESSING VALUES
================
drug["name"]                    → "Metformin"
drug.get("name")                → "Metformin"
drug.get("price", "Unknown")    → "Unknown" (key missing, uses default)

NEVER use drug["missing_key"] in production code.
It raises KeyError if the key does not exist.
ALWAYS use drug.get("key", default) for safety.

MODIFYING
=========
drug["dose_mg"]      = 850       # update existing key
drug["manufacturer"] = "EMZOR"   # add new key
del drug["manufacturer"]         # delete a key
drug.pop("dose_mg", None)        # delete safely (no error if missing)

LOOPING
=======
for key in drug:                    # loops over keys only
for key in drug.keys():             # explicit — same as above
for value in drug.values():         # values only
for key, value in drug.items():     # BOTH — most common in practice

DICT COMPREHENSION
==================
{key_expr: value_expr for item in iterable if condition}

price_lookup = {drug: price for drug, price in drug_list}
discounted   = {k: v * 0.9 for k, v in prices.items() if v > 1000}

SETS
====
A set is like a list but: NO duplicates, UNORDERED.
unique = {"Aspirin", "Metformin", "Aspirin"}  → {"Aspirin", "Metformin"}

Set operations (very useful for data analysis):
  a | b   → union (all items in either)
  a & b   → intersection (items in both)
  a - b   → difference (in a but not in b)
  a ^ b   → symmetric difference (in one but not both)
    `,

    clinicalConnection: `
CLINICAL CONNECTION

The pandas DataFrame is built on dictionaries.

When you create a DataFrame:
  df = pd.DataFrame({
      "patient": ["Victor", "Amaka"],
      "age":     [28, 45],
      "drug":    ["Metformin", "Aspirin"]
  })

You are passing a dictionary where:
  keys   → column names
  values → lists of column data

When you read a CSV row with DictReader or pandas:
  row["patient_name"]  → string lookup by column name

That is dictionary access. Every time.

Set intersection for drug safety:
  patient_drugs = {"Metformin", "Aspirin", "Warfarin"}
  nsaid_list    = {"Aspirin", "Ibuprofen", "Naproxen"}
  nsaid_risk    = patient_drugs & nsaid_list
  # {"Aspirin"} — patient is on an NSAID
    `,

    example: `
# ── Day 8 Complete Example ──────────────────────────────

# --- Drug database as nested dict ---
drug_db = {
    "Metformin": {
        "class":            "Biguanide",
        "indication":       "Type 2 Diabetes",
        "dose_mg":          500,
        "max_daily_mg":     2000,
        "contraindications":["Renal impairment (CrCl<30)", "Hepatic impairment"],
        "is_controlled":    False,
        "price_ngn":        1500,
    },
    "Tramadol": {
        "class":            "Opioid analgesic",
        "indication":       "Moderate to severe pain",
        "dose_mg":          50,
        "max_daily_mg":     400,
        "contraindications":["Seizure disorder", "MAO inhibitor use"],
        "is_controlled":    True,
        "price_ngn":        1200,
    },
    "Amoxicillin": {
        "class":            "Aminopenicillin",
        "indication":       "Bacterial infections",
        "dose_mg":          500,
        "max_daily_mg":     3000,
        "contraindications":["Penicillin allergy"],
        "is_controlled":    False,
        "price_ngn":        2200,
    },
}

# --- Safe access with .get() ---
def get_drug_info(drug_name):
    """Safely retrieves drug info or returns a not-found message."""
    info = drug_db.get(drug_name)
    if info is None:
        return f"'{drug_name}' not found in database"
    return info

print(get_drug_info("Metformin")["indication"])  # Type 2 Diabetes
print(get_drug_info("Aspirin"))                  # not found message

# --- Nested access ---
drug = drug_db["Metformin"]
print(f"\nDrug     : Metformin")
print(f"Max daily: {drug['max_daily_mg']}mg")
print(f"Contraindications:")
for contra in drug["contraindications"]:
    print(f"  ⚠️  {contra}")

# --- Looping with .items() ---
print("\n=== Formulary Price List ===")
for name, info in drug_db.items():
    controlled = "⚠️ CTRL" if info["is_controlled"] else "OTC "
    print(f"  {controlled}  {name:<15} ₦{info['price_ngn']:,}")

# --- Building a dict from scratch ---
inventory = {}
stock_data = [("Aspirin", 200), ("Ibuprofen", 150), ("Paracetamol", 500)]

for drug, qty in stock_data:
    inventory[drug] = {"quantity": qty, "reorder_level": 50}

print(f"\nInventory: {inventory}")

# --- Dict comprehension ---
prices      = {name: info["price_ngn"] for name, info in drug_db.items()}
expensive   = {k: v for k, v in prices.items() if v > 1500}
discounted  = {k: round(v * 0.85) for k, v in prices.items()}

print(f"\nAll prices    : {prices}")
print(f"Expensive (>1500): {expensive}")
print(f"Discounted (15%): {discounted}")

# --- Sets: unique values and set operations ---
morning_meds = {"Metformin", "Aspirin", "Lisinopril", "Atorvastatin"}
evening_meds = {"Metformin", "Omeprazole", "Lisinopril"}

both_sessions = morning_meds & evening_meds          # intersection
either_session = morning_meds | evening_meds         # union
morning_only  = morning_meds - evening_meds          # difference

print(f"\nTaken twice daily : {both_sessions}")
print(f"Total unique meds  : {either_session}")
print(f"Morning only       : {morning_only}")

# --- Sets for deduplication ---
dispensed_today = ["Metformin", "Aspirin", "Metformin",
                   "Lisinopril", "Aspirin", "Tramadol"]
unique_drugs = set(dispensed_today)
print(f"\nUnique drugs dispensed: {len(unique_drugs)}")
print(f"Drugs: {unique_drugs}")
    `,

    commonMistakes: [
      {
        mistake: "Using dict[key] when the key might not exist",
        wrong:   "drug_db['Aspirin']  # KeyError if not in db",
        right:   "drug_db.get('Aspirin', 'Not found')  # safe",
        explanation: "In any real program where the key might be missing, always use .get(). KeyError crashes your program silently in the middle of processing.",
      },
      {
        mistake: "Duplicate keys — Python silently keeps only the last",
        wrong:   "d = {'drug': 'Aspirin', 'drug': 'Metformin'}  # only Metformin kept",
        right:   "# Use unique keys. If you need multiple values, use a list as the value.",
        explanation: "Python does not warn you about duplicate keys. The last assignment wins, which can cause data loss.",
      },
      {
        mistake: "Trying to index a set",
        wrong:   "my_set = {1, 2, 3}\nmy_set[0]  # TypeError — sets have no index",
        right:   "list(my_set)[0]  # convert to list first if you need indexing",
        explanation: "Sets are unordered. There is no first or second item. If you need ordering, use a list.",
      },
      {
        mistake: "Forgetting that dict.keys(), .values(), .items() return views not lists",
        wrong:   "keys = drug_db.keys()\nkeys[0]  # TypeError",
        right:   "keys = list(drug_db.keys())\nkeys[0]  # works",
        explanation: ".keys(), .values(), .items() return view objects. Wrap in list() if you need to index them.",
      },
    ],

    exercises: [
      "Build a complete drug interaction dictionary where each key is a drug name and the value is a list of drugs it interacts with and the severity. Write a function check_prescription_interactions(drug_list) that checks all pairs and returns all found interactions.",
      "Create a patient records dict with at least 5 patients. Each patient is a nested dict: name, age, conditions (list), medications (list), allergies (list). Write a function allergy_conflict(patient, new_drug, drug_allergy_map) that checks if the new drug conflicts with any patient allergy.",
      "Using set operations, find: (a) drugs prescribed in both morning and evening, (b) drugs prescribed ONLY in the morning, (c) all unique drugs across both sessions. Format the output clearly.",
      "Write a dict comprehension that takes a list of (drug_name, dose_mg, stock) tuples and produces a dict of drug_name → {'dose': dose, 'stock': stock, 'needs_reorder': stock < 50}.",
    ],

    resources: [
      {
        objective: "Create, access, and modify dictionaries by key",
        items: [
          {
            title:    "Real Python — Dictionaries in Python",
            url:      "https://realpython.com/python-dicts/",
            type:     "article",
            note:     "The most thorough free guide on Python dictionaries. Covers every operation.",
          },
          {
            title:    "Python Docs — Mapping Types (dict)",
            url:      "https://docs.python.org/3/library/stdtypes.html#mapping-types-dict",
            type:     "reference",
            note:     "Official complete reference for all dict methods.",
          },
          {
            title:    "Corey Schafer — Python Dictionaries (Video)",
            url:      "https://www.youtube.com/watch?v=daefaLgNkw0",
            type:     "video",
            duration: "~25 mins",
            note:     "Clear walkthrough of dict creation, access, looping, and comprehensions.",
          },
        ],
      },
      {
        objective: "Loop through dictionaries with .items(), .keys(), .values()",
        items: [
          {
            title:    "Real Python — How to Iterate Over a Dictionary",
            url:      "https://realpython.com/iterate-through-dictionary-python/",
            type:     "article",
            note:     "Dedicated article covering every way to loop through a dict, with performance notes.",
          },
        ],
      },
      {
        objective: "Use .get() for safe key access",
        items: [
          {
            title:    "Real Python — dict.get() vs dict[]",
            url:      "https://realpython.com/python-dicts/#getting-values",
            type:     "article",
            note:     "Section explaining .get() with default values vs bracket access.",
          },
        ],
      },
      {
        objective: "Understand sets and when to use them instead of lists",
        items: [
          {
            title:    "Real Python — Sets in Python",
            url:      "https://realpython.com/python-sets/",
            type:     "article",
            note:     "Complete guide to sets including set operations, when to use sets vs lists, and performance.",
          },
          {
            title:    "W3Schools — Python Sets (Interactive)",
            url:      "https://www.w3schools.com/python/python_sets.asp",
            type:     "interactive",
            note:     "Interactive reference for set operations including union, intersection, difference.",
          },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 9 — Tuples & Choosing the Right Data Structure
  // ============================================================
  {
    id: "W2D4", week: 2, day: 4, phase: 1,
    phaseTitle: "Python Mastery",
    date: "2026-06-25",
    type: "lesson",
    topic: "Tuples, Unpacking & Choosing the Right Data Structure",
    duration: "2–3 hours",

    objectives: [
      "Understand tuples and why immutability matters",
      "Use tuple unpacking to write elegant, readable code",
      "Use namedtuples for self-documenting data",
      "Confidently choose between list, tuple, dict, and set for any scenario",
    ],

    introduction: `
You now know Python's four core data structures.
Today you learn the final one — tuples — and more 
importantly, you build a clear decision framework 
for choosing between all four.

Choosing the wrong data structure is one of the 
most common causes of slow, buggy code. A data 
scientist who always defaults to lists is like a 
pharmacist who always prescribes paracetamol 
regardless of the diagnosis — technically functional, 
but not making the best choice for the situation.

By the end of today you will have a clear mental 
framework: given any data scenario, you should be 
able to immediately identify the right structure 
and explain why.
    `,

    mentalModel: `
MENTAL MODEL — "The Four Storage Systems"

LIST    = The dispensing register
  - Ordered, numbered entries
  - You add, remove, reorder
  - Position matters
  - Use when: sequence of items that changes

TUPLE   = The sealed patient record envelope
  - Contains multiple pieces of related data
  - Once sealed, never changed
  - Order is meaningful and fixed
  - Use when: data belongs together and must not change

DICT    = The drug database
  - Look up anything by name instantly
  - Each entry has a label (key) and content (value)
  - Use when: you need to look things up by name

SET     = The formulary whiteboard
  - Just the names, no duplicates
  - Instant membership check: "Is this on the board?"
  - Use when: you need unique items and fast lookup
    `,

    explanation: `
TUPLES
======
Created with () or just commas (parentheses optional).
coords     = (4.815, 7.049)
dose_range = (250, 1000)
patient    = "Victor", 28, "Hypertension"  # no parens needed

IMMUTABILITY
============
Once created, a tuple cannot be changed.
Attempting to modify raises TypeError.

Why immutability matters:
1. SAFETY    — data that should never change is protected
2. SPEED     — tuples are faster than lists to create/access
3. DICT KEYS — tuples can be dict keys, lists cannot
4. SIGNALS   — using a tuple tells other developers 
               "this data is fixed and related"

TUPLE UNPACKING
===============
The most elegant Python pattern:

min_dose, max_dose = (250, 1000)

Works with any iterable:
name, age, condition = "Victor", 28, "Hypertension"
first, *rest = [1, 2, 3, 4, 5]
# first = 1, rest = [2, 3, 4, 5]

Functions returning multiple values actually return tuples:
def stats(data): return min(data), max(data), sum(data)/len(data)
lo, hi, avg = stats(patient_ages)

NAMEDTUPLE
==========
from collections import namedtuple

Patient = namedtuple("Patient", ["name", "age", "condition", "ward"])
p1 = Patient("Victor", 28, "Hypertension", "Cardiology")

p1.name       → "Victor"   (readable attribute access)
p1.ward       → "Cardiology"
p1[0]         → "Victor"   (still works as index)

Namedtuples are tuples with named fields — self-documenting.

DECISION FRAMEWORK
==================
Ask these questions in order:

1. Do I need to look things up by a label/name?
   → YES: DICT

2. Do I have a collection of items that must stay unique?
   → YES: SET

3. Will the data change (add, remove, reorder)?
   → YES: LIST
   → NO:  TUPLE

Bonus: Is the data a small group of RELATED fields 
       (like a record or coordinate)?
   → TUPLE (or namedtuple for readability)
    `,

    clinicalConnection: `
CLINICAL CONNECTION

Real data science code uses all four structures together:

  # Reading a CSV gives you a LIST of DICT rows
  patients = [
      {"name": "Victor",  "age": 28, "drug": "Metformin"},
      {"name": "Amaka",   "age": 45, "drug": "Aspirin"},
  ]

  # Returning multiple stats from a function → TUPLE
  min_age, max_age, avg_age = get_age_stats(patients)

  # Tracking unique drugs dispensed today → SET
  dispensed_today = set()
  dispensed_today.add("Metformin")

  # Storing dose ranges that never change → TUPLE
  METFORMIN_RANGE = (500, 2000)  # min_dose, max_dose

  # Drug database for fast lookup → DICT
  drug_info = {"Metformin": {...}, "Aspirin": {...}}

This combination is exactly what you will see in 
every real data science script you read or write.
    `,

    example: `
# ── Day 9 Complete Example ──────────────────────────────

from collections import namedtuple

# --- Basic tuple ---
dose_range = (250, 1000)
lat_lng    = (6.5244, 3.3792)   # Lagos coordinates

print(f"Min dose: {dose_range[0]}mg")
print(f"Max dose: {dose_range[1]}mg")

# Attempting to modify raises TypeError:
# dose_range[0] = 100   # TypeError: 'tuple' object does not support assignment

# --- Tuple unpacking ---
min_dose, max_dose = dose_range
print(f"\nUnpacked: {min_dose}–{max_dose}mg")

name, age, condition = "Victor", 28, "Hypertension"
print(f"Patient: {name}, {age}, {condition}")

# Extended unpacking
first, *middle, last = [1, 2, 3, 4, 5]
print(f"\nFirst: {first}, Middle: {middle}, Last: {last}")

# --- Functions returning tuples ---
def patient_summary(ages):
    """Returns (min, max, average) — a tuple."""
    return min(ages), max(ages), round(sum(ages)/len(ages), 1)

ages = [23, 45, 67, 19, 54, 33, 78, 42]
youngest, oldest, average = patient_summary(ages)
print(f"\nAges — Min: {youngest}, Max: {oldest}, Avg: {average}")

# --- Named tuples ---
Patient = namedtuple("Patient", ["name", "age", "condition", "ward"])
Drug    = namedtuple("Drug",    ["name", "dose_mg", "is_controlled"])

patients = [
    Patient("Victor Okolie", 28, "Hypertension", "Cardiology"),
    Patient("Amaka Obi",     45, "Type 2 Diabetes", "Endocrinology"),
    Patient("Chidi Eze",     61, "Heart Failure", "Cardiology"),
]

print("\n=== Patient Register ===")
for p in patients:
    print(f"  {p.name:<20} | {p.age}yrs | {p.condition} | Ward: {p.ward}")

# Filter by ward using namedtuple attribute
cardiology = [p for p in patients if p.ward == "Cardiology"]
print(f"\nCardiology patients: {[p.name for p in cardiology]}")

# --- Tuples as dict keys ---
# You cannot use a list as a dict key — tuples work
visit_log = {}
visit_log[("Victor", "2026-06-15")] = {"drug": "Metformin", "dose": 500}
visit_log[("Victor", "2026-06-22")] = {"drug": "Lisinopril", "dose": 10}

for (patient, date), info in visit_log.items():
    print(f"  {patient} on {date}: {info['drug']} {info['dose']}mg")

# --- All four structures working together ---
# 1. LIST: ordered history of dispenses
dispense_history = []

# 2. DICT: drug database for fast lookup
formulary = {
    "Metformin":  Drug("Metformin", 500, False),
    "Tramadol":   Drug("Tramadol",  50,  True),
}

# 3. SET: unique drugs dispensed today
unique_today = set()

# 4. TUPLE: immutable dose ranges
SAFE_RANGES = {
    "Metformin": (500, 2000),
    "Tramadol":  (50,  400),
}

def dispense_drug(patient_name, drug_name, qty):
    drug  = formulary.get(drug_name)
    if not drug:
        return f"Drug not found: {drug_name}"
    lo, hi = SAFE_RANGES.get(drug_name, (0, float("inf")))
    daily_dose = drug.dose_mg * qty
    if daily_dose > hi:
        return f"⛔ Daily dose {daily_dose}mg exceeds maximum {hi}mg"
    dispense_history.append((patient_name, drug_name, qty))
    unique_today.add(drug_name)
    return f"✓ Dispensed {qty}x {drug_name} {drug.dose_mg}mg to {patient_name}"

print("\n=== Dispensing Session ===")
print(dispense_drug("Victor", "Metformin", 3))    # 1500mg — OK
print(dispense_drug("Amaka",  "Tramadol",  10))   # 500mg — exceeds 400mg
print(dispense_drug("Chidi",  "Metformin", 2))    # 1000mg — OK
print(dispense_drug("Victor", "Aspirin",   1))    # not in formulary

print(f"\nUnique drugs today: {unique_today}")
print(f"Total dispenses   : {len(dispense_history)}")
    `,

    commonMistakes: [
      {
        mistake: "Creating a single-item tuple without the trailing comma",
        wrong:   "t = (5)    # this is just the integer 5, not a tuple",
        right:   "t = (5,)   # the comma makes it a tuple",
        explanation: "Python uses the comma to identify tuples, not the parentheses. A single-item tuple MUST have a trailing comma.",
      },
      {
        mistake: "Unpacking with the wrong number of variables",
        wrong:   "a, b = (1, 2, 3)    # ValueError: too many values",
        right:   "a, b, c = (1, 2, 3)  # must match exactly\n# or: a, *rest = (1, 2, 3)  # extended unpacking",
        explanation: "The number of variables on the left must exactly match the tuple length, unless you use * for extended unpacking.",
      },
      {
        mistake: "Choosing a list when a set would be much faster",
        wrong:   "if drug_name in large_drug_list:  # O(n) — slow for large lists",
        right:   "if drug_name in drug_set:          # O(1) — always instant",
        explanation: "For membership checks on large collections, sets are orders of magnitude faster than lists. If you never need order or duplicates, use a set.",
      },
    ],

    exercises: [
      "Write a function lab_results(patient_name, values) that returns a namedtuple containing: patient_name, min_value, max_value, average, and is_critical (True if any value > 500). Display the results in a readable format.",
      "Given a list of (drug_name, quantity, unit_price_ngn) tuples representing a purchase order, write a loop that unpacks each tuple and calculates the total cost per drug and overall total.",
      "Build a complete example using all four structures: a LIST of patient names, a DICT of drug → interactions, a SET of controlled drugs, and a TUPLE of dose range constants. Write a function that uses all four to validate a prescription.",
      "Convert your Week 1 CLI project's drug database to use namedtuples instead of plain dicts. Compare the readability of drug.dose_mg vs drug['dose_mg']. Which do you prefer and why?",
    ],

    resources: [
      {
        objective: "Understand tuples and why immutability matters",
        items: [
          {
            title:    "Real Python — Python Tuples",
            url:      "https://realpython.com/python-lists-tuples/#python-tuples",
            type:     "article",
            note:     "Section on tuples within the comprehensive lists/tuples guide. Covers immutability clearly.",
          },
          {
            title:    "Python Docs — Tuples and Sequences",
            url:      "https://docs.python.org/3/tutorial/datastructures.html#tuples-and-sequences",
            type:     "reference",
            note:     "Official Python tutorial section on tuples — concise and authoritative.",
          },
        ],
      },
      {
        objective: "Use tuple unpacking to write elegant, readable code",
        items: [
          {
            title:    "Real Python — Tuple Unpacking",
            url:      "https://realpython.com/python-lists-tuples/#packing-and-unpacking",
            type:     "article",
            note:     "Covers packing, unpacking, and extended unpacking with * — all the patterns you need.",
          },
        ],
      },
      {
        objective: "Use namedtuples for self-documenting data",
        items: [
          {
            title:    "Python Docs — collections.namedtuple",
            url:      "https://docs.python.org/3/library/collections.html#collections.namedtuple",
            type:     "reference",
            note:     "Official documentation for namedtuple with all options and examples.",
          },
          {
            title:    "Real Python — namedtuple: A Lightweight Alternative",
            url:      "https://realpython.com/python-namedtuple/",
            type:     "article",
            note:     "The most complete guide to namedtuples including when to use them vs dataclasses.",
          },
        ],
      },
      {
        objective: "Confidently choose between list, tuple, dict, and set for any scenario",
        items: [
          {
            title:    "Real Python — Python Data Structures: Choosing the Right One",
            url:      "https://realpython.com/python-data-structures/",
            type:     "article",
            note:     "Covers all Python data structures with decision guidance for each scenario.",
          },
          {
            title:    "Corey Schafer — Tuples (Video)",
            url:      "https://www.youtube.com/watch?v=W8KRzm-HUcc",
            type:     "video",
            duration: "~30 mins",
            note:     "Covers lists, tuples, and sets together — helps clarify the differences.",
          },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 10 — PROJECT: Drug Inventory Management System
  // ============================================================
  {
    id: "W2D5", week: 2, day: 5, phase: 1,
    phaseTitle: "Python Mastery",
    date: "2026-06-26",
    type: "project",
    topic: "PROJECT: Drug Inventory Management System",
    duration: "4–5 hours",

    objectives: [
      "Build a complete CRUD system using all four data structures",
      "Design functions that work together as a cohesive system",
      "Generate formatted reports from stored data",
      "Push to GitHub with a detailed README showing sample output",
    ],

    introduction: `
Week 2 ends with a significantly more ambitious project 
than Week 1.

You now have functions, lists, dicts, tuples, and sets.
That is enough to build a real-world data management 
system — not a toy, but something that could 
genuinely be used in a Nigerian community pharmacy.

The design challenge today is not just writing working 
code. It is designing the data structures correctly 
so the code is clean, fast, and easy to extend.

A poorly designed drug inventory system built with 
the wrong data structures will work but will be 
slow, buggy, and hard to maintain.
A well-designed one will be fast, readable, and 
extensible — ready to become the backend of a 
web app or API in later phases.
    `,

    mentalModel: `
MENTAL MODEL — "The Digital Dispensary System"

You are building the data layer of a pharmacy 
management system. Think of it as the engine 
that a frontend interface (which you will build 
in Phase 4) will eventually sit on top of.

Design it as if someone else will use it.
That someone is future you — in 6 months, 
when you need to extend it.
    `,

    projectBrief: `
BUILD: A complete Drug Inventory Management System.

DATA STRUCTURE REQUIREMENTS:
─────────────────────────────
1. DRUG INVENTORY (dict of namedtuples or nested dicts)
   Each drug must have:
   - name, generic_name, category
   - dose_mg, unit (tablet/capsule/ml)
   - quantity_in_stock
   - unit_price_ngn
   - reorder_level
   - nafdac_number
   - expiry_date (as a string: "YYYY-MM")
   - is_controlled (bool)

2. DISPENSING LOG (list of tuples)
   Each entry: (timestamp, patient_name, drug_name, qty, pharmacist)

3. CONTROLLED DRUG REGISTER (separate dict)
   Detailed log required by law for controlled substances

4. UNIQUE DRUG CATEGORIES (set)
   Maintained automatically from inventory

FUNCTION REQUIREMENTS:
──────────────────────
- add_drug(drug_data)          → adds to inventory
- remove_drug(name)            → removes from inventory
- update_stock(name, qty)      → increase stock (receiving delivery)
- dispense(name, qty, patient) → decrease stock, add to log
- search_drug(term)            → returns list of matching drugs
- low_stock_report()           → drugs below reorder level
- expiry_report()              → drugs expiring within 3 months
- category_summary()           → count of drugs per category
- total_inventory_value()      → sum of (qty × price) for all drugs
- daily_summary()              → formatted text report

VALIDATION RULES:
─────────────────
- Cannot dispense more than available stock
- Cannot dispense a controlled drug without a prescription_ref
- Drug name cannot be empty
- Price and quantity must be positive numbers
- NAFDAC number must match format: Letter + digits + hyphen + digits

OUTPUT REQUIREMENT:
───────────────────
All reports must be formatted well enough to 
be copy-pasted directly into a message or email.

GITHUB REQUIREMENTS:
────────────────────
Repository name: python-week2-inventory-system
README must include:
  - System overview (what it does)
  - Data structure design decisions (why you chose each structure)
  - Sample output for each report function
  - How to run it
  - Your Pharm.D background as context

DATA SCIENCE CONNECTION (write this in your README):
─────────────────────────────────────────────────────
This inventory system's drug dict structure is 
directly equivalent to a pandas DataFrame. Each 
drug is a row. Each attribute is a column. In Phase 2, 
you will load this data into a DataFrame with one line:
  df = pd.DataFrame(list(inventory.values()))
Document that connection — it shows you are thinking 
ahead about how the pieces fit together.
    `,

    example: `
# ── Project Starter Scaffold ────────────────────────────

from collections import namedtuple
import datetime

# --- Data structures ---
Drug = namedtuple("Drug", [
    "name", "generic_name", "category", "dose_mg", "unit",
    "quantity", "unit_price_ngn", "reorder_level",
    "nafdac_number", "expiry_date", "is_controlled"
])

inventory        = {}   # dict: name → Drug namedtuple
dispensing_log   = []   # list: (timestamp, patient, drug, qty, pharmacist)
controlled_reg   = {}   # dict: drug_name → list of controlled dispenses
drug_categories  = set()  # set: unique categories

# --- Seed data (add at least 10 drugs yourself) ---
def seed_inventory():
    sample_drugs = [
        Drug("Metformin 500mg", "Metformin HCl", "Antidiabetic",
             500, "tablet", 200, 1500, 50, "A4-1234", "2027-06", False),
        Drug("Tramadol 50mg", "Tramadol HCl", "Analgesic (Controlled)",
             50, "capsule", 60, 1200, 20, "B2-5678", "2026-12", True),
    ]
    for drug in sample_drugs:
        inventory[drug.name] = drug
        drug_categories.add(drug.category)

# --- Core functions (implement each one fully) ---
def add_drug(drug_data):
    """Add a new drug to inventory."""
    # Your implementation here
    pass

def dispense(drug_name, qty, patient_name,
             pharmacist="Victor Okolie", prescription_ref=None):
    """
    Dispense a drug. Updates stock and logs the transaction.
    Returns success message or raises ValueError.
    """
    # Validate drug exists
    # Validate stock
    # Check controlled drug requirements
    # Update stock
    # Add to dispensing_log
    # If controlled, add to controlled_reg
    # Return formatted success message
    pass

def low_stock_report():
    """Returns formatted string of all drugs below reorder level."""
    pass

def total_inventory_value():
    """Returns total value of all stock in NGN."""
    pass

def daily_summary():
    """Returns a formatted daily report string."""
    today = datetime.date.today().strftime("%d %B %Y")
    # Build and return the full report
    pass

if __name__ == "__main__":
    seed_inventory()
    # Test your functions here
    `,

    exercises: [],

    commonMistakes: [
      {
        mistake: "Designing data structures after writing the functions",
        wrong:   "Writing functions first then trying to make the data fit",
        right:   "Design your data structures first — sketch them on paper. Then write functions that work with those structures.",
        explanation: "The data model drives everything else. A poorly designed data structure forces awkward, slow function code. Design first, code second.",
      },
    ],

    resources: [
      {
        objective: "Build a complete CRUD system using all four data structures",
        items: [
          {
            title:    "Real Python — Python Data Structures",
            url:      "https://realpython.com/python-data-structures/",
            type:     "article",
            note:     "Reference during building for choosing the right structure for each part.",
          },
        ],
      },
      {
        objective: "Push to GitHub with a detailed README showing sample output",
        items: [
          {
            title:    "makeareadme.com — README Template Generator",
            url:      "https://www.makeareadme.com/",
            type:     "tool",
            note:     "Fill in the form and get a professional README template instantly.",
          },
          {
            title:    "GitHub Docs — Basic Writing and Formatting Syntax (Markdown)",
            url:      "https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax",
            type:     "reference",
            note:     "Learn how to format your README with headers, code blocks, and tables.",
          },
          {
            title:    "freeCodeCamp — Git and GitHub for Beginners (Video)",
            url:      "https://www.youtube.com/watch?v=RGOj5yH7evk",
            type:     "video",
            duration: "~1 hr",
            note:     "Full crash course on Git commands and GitHub workflow.",
          },
        ],
      },
    ],
  },

];

if (typeof module !== "undefined") {
  module.exports = { WEEK2 };
}
