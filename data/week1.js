// ============================================================
// WEEK 1 — Python Basics & Environment Setup
// Days 1–5 | 15–19 June 2026
// Enriched: Mental Models, Clinical Connections,
//           Objective-mapped resources (video + article + tool)
// ============================================================

const WEEK1 = [

  // ============================================================
  // DAY 1 — Why Python? Setup & Your First Program
  // ============================================================
  {
    id: "W1D1", week: 1, day: 1, phase: 1,
    phaseTitle: "Python Mastery",
    date: "2026-06-15",
    type: "lesson",
    topic: "Why Python? Setup & Your First Program",
    duration: "2–3 hours",

    objectives: [
      "Understand why Python dominates data science and AI",
      "Install Python, VS Code, and set up your environment",
      "Write and run your first Python program",
      "Understand variables, print(), and basic data types",
    ],

    introduction: `
Welcome to Day 1, Victor.

Before writing a single line of code, you need to understand WHY 
you are learning Python specifically — because purpose-driven 
learning sticks far better than mechanical repetition.

Python is the dominant language in data science, machine learning, 
and AI for three concrete reasons:

1. READABILITY — Python's syntax reads almost like plain English.
   This low cognitive overhead means you spend mental energy on 
   the problem, not on fighting the language.

2. ECOSYSTEM — Python has the richest set of data/AI libraries 
   on earth: pandas, numpy, scikit-learn, TensorFlow, LangChain, 
   and the Anthropic SDK you'll use for your health agent.

3. INDUSTRY STANDARD — It is what every employer, every AI 
   company, every research lab, and every data team uses.
   Knowing Python means your work is immediately shareable, 
   reviewable, and deployable.

Your Pharm.D background is a rare advantage here. You already 
understand the domain your data will come from. Most data 
scientists have to learn the domain after learning the tools. 
You are starting with the domain — that inverts the difficulty.
    `,

    mentalModel: `
MENTAL MODEL — "The Dispensing System"

Think of Python as your pharmacy's dispensing software. 
It is not the only dispensing system on earth — there is R, 
Julia, MATLAB — but it is the one the entire industry has agreed 
on. Pharmacists in Lagos, London, and Lagos all use the same 
NAFDAC database. Data scientists worldwide all use Python.

A variable in Python is like a labelled drawer in the dispensary. 
You put something in it, you give it a name, and later you can 
open that drawer by name to get exactly what you stored.
    `,

    explanation: `
VARIABLES
=========
A variable is a named container that holds a value.
Python figures out the data type automatically — no need to 
declare it upfront (unlike Java or C++).

You create a variable with the assignment operator =:
    drug_name = "Amoxicillin"

You can reassign it at any time:
    drug_name = "Metformin"

Python just updates the label on the drawer.

THE FOUR BASIC DATA TYPES
==========================
int   → whole numbers with no decimal point
       Example: tablet_count = 500

float → numbers with a decimal point
       Example: dose_mg = 12.5

str   → text, always wrapped in quotes (single or double)
       Example: patient_name = "Victor Okolie"

bool  → only two possible values: True or False
       Example: is_controlled = False
       Note: capital T and F — Python is case-sensitive here.

PRINT()
=======
print() sends output to your screen. It is your most basic 
debugging and communication tool. You will use it hundreds 
of times per project.

F-STRINGS (formatted string literals)
======================================
The cleanest way to embed variable values inside text.
Prefix the string with f, then wrap the variable in {}.

    name = "Victor"
    print(f"Hello, {name}")  →  Hello, Victor

F-strings also evaluate expressions inside the braces:
    print(f"2 + 2 = {2 + 2}")  →  2 + 2 = 4

TYPE()
======
type() tells you what data type a variable holds.
    type("hello")  →  <class 'str'>
    type(500)      →  <class 'int'>
    type(3.14)     →  <class 'float'>
    type(True)     →  <class 'bool'>
    `,

    clinicalConnection: `
CLINICAL CONNECTION

Every piece of patient data you will ever process as a data 
scientist maps directly to these types:

  Patient name          → str
  Age                   → int
  Blood pressure (mmHg) → int or float
  Temperature (°C)      → float
  Is diabetic?          → bool
  NAFDAC number         → str (not int — leading zeros matter)

When you later read a CSV of 10,000 patient records into pandas, 
pandas will automatically assign each column a dtype — which is 
just pandas' word for Python's basic data types. Understanding 
types NOW means you will instantly understand why pandas behaves 
the way it does in Phase 2.
    `,

    example: `
# ── Day 1 Complete Example ──────────────────────────────

# --- Integer ---
patient_age   = 34
tablet_count  = 500
ward_number   = 7

# --- Float ---
dose_mg       = 12.5
temperature   = 36.8
bmi           = 24.3

# --- String ---
drug_name     = "Amoxicillin"
patient_name  = "Victor Okolie"
nafdac_number = "A4-1234"   # string — not int

# --- Boolean ---
is_controlled         = False
is_prescription_req   = True
is_in_stock           = True

# --- print() with f-strings ---
print(f"Patient     : {patient_name}")
print(f"Age         : {patient_age} years")
print(f"Drug        : {drug_name} {dose_mg}mg")
print(f"Controlled  : {is_controlled}")
print(f"In stock    : {is_in_stock}")

# Output:
# Patient     : Victor Okolie
# Age         : 34 years
# Drug        : Amoxicillin 12.5mg
# Controlled  : False
# In stock    : True

# --- Checking types ---
print(type(patient_name))   # <class 'str'>
print(type(patient_age))    # <class 'int'>
print(type(dose_mg))        # <class 'float'>
print(type(is_controlled))  # <class 'bool'>

# --- Reassignment ---
drug_name = "Metformin"     # variable updated
dose_mg   = 500             # type changed from float to int
print(f"Updated: {drug_name} {dose_mg}mg")

# --- Expression inside f-string ---
tablets_per_pack = 30
dose_per_tablet  = 500
print(f"Total mg in pack: {tablets_per_pack * dose_per_tablet}mg")
# Total mg in pack: 15000mg
    `,

    commonMistakes: [
      {
        mistake: "Spaces in variable names",
        wrong:   "drug name = 'Aspirin'",
        right:   "drug_name = 'Aspirin'",
        explanation: "Python variable names cannot contain spaces. Use underscores to separate words. This convention is called snake_case and it is the Python standard.",
      },
      {
        mistake: "Forgetting quotes around strings",
        wrong:   "drug_name = Paracetamol",
        right:   "drug_name = 'Paracetamol'",
        explanation: "Without quotes, Python treats Paracetamol as another variable name and raises NameError: name 'Paracetamol' is not defined.",
      },
      {
        mistake: "Confusing = (assignment) with == (comparison)",
        wrong:   "if patient_age = 34:",
        right:   "if patient_age == 34:",
        explanation: "Single = assigns a value. Double == checks if two values are equal. Using = inside a condition is a SyntaxError in Python.",
      },
      {
        mistake: "Using lowercase true or false",
        wrong:   "is_controlled = false",
        right:   "is_controlled = False",
        explanation: "Python booleans are True and False with capital first letters. Lowercase gives NameError.",
      },
    ],

    exercises: [
      "Create variables representing a complete patient intake form: full name (str), age (int), weight in kg (float), is pregnant (bool), primary diagnosis (str). Print all values using a single f-string block that looks like a formatted label.",
      "Create a variable drug_dose set to 500. Print it. Then reassign it to 250. Print it again. Add a comment on each line explaining what is happening.",
      "Call type() on 6 different variables — at least one of each basic type. Print the results and write a comment predicting the type before each call. Were you right?",
      "NAFDAC challenge: store the NAFDAC number A4-1234 as both a string and try storing it as an integer. What happens? Write a comment explaining why NAFDAC numbers must always be strings.",
    ],

    resources: [
      {
        objective: "Understand why Python dominates data science and AI",
        items: [
          {
            title:    "Python for Data Science Handbook — Why Python?",
            url:      "https://jakevdp.github.io/PythonDataScienceHandbook/00.00-preface.html",
            type:     "article",
            note:     "Free online book by Jake VanderPlas (O'Reilly). The preface explains exactly why Python won the data science ecosystem battle.",
          },
          {
            title:    "CS50P Lecture 0 — Functions, Variables (Video)",
            url:      "https://cs50.harvard.edu/python/2022/weeks/0/",
            type:     "video",
            duration: "~2 hrs",
            note:     "Harvard's official intro. Watch the first 30 minutes for the 'why Python' context.",
          },
        ],
      },
      {
        objective: "Install Python, VS Code, and set up your environment",
        items: [
          {
            title:    "Real Python — Python 3 Installation & Setup Guide",
            url:      "https://realpython.com/installing-python/",
            type:     "article",
            note:     "Step-by-step guide for Windows, Mac, and Linux. Most thorough free guide available.",
          },
          {
            title:    "VS Code Python Extension — Official Docs",
            url:      "https://code.visualstudio.com/docs/languages/python",
            type:     "article",
            note:     "Official Microsoft guide for the Python extension in VS Code.",
          },
        ],
      },
      {
        objective: "Write and run your first Python program",
        items: [
          {
            title:    "Python.org — Python 3 Tutorial: An Informal Introduction",
            url:      "https://docs.python.org/3/tutorial/introduction.html",
            type:     "article",
            note:     "Official Python tutorial. Section 3.1 covers your first interactive Python session.",
          },
          {
            title:    "Automate the Boring Stuff — Chapter 1: The Interactive Shell",
            url:      "https://automatetheboringstuff.com/2e/chapter1/",
            type:     "article",
            note:     "Free online. Explains how to run Python interactively and as a script.",
          },
        ],
      },
      {
        objective: "Understand variables, print(), and basic data types",
        items: [
          {
            title:    "Real Python — Variables in Python",
            url:      "https://realpython.com/python-variables/",
            type:     "article",
            note:     "Deep, clear guide on variables, naming, assignment, and types. Highly recommended.",
          },
          {
            title:    "W3Schools — Python Variables (Interactive)",
            url:      "https://www.w3schools.com/python/python_variables.asp",
            type:     "interactive",
            note:     "Use the 'Try it Yourself' editor to test every concept in the browser. No installation needed.",
          },
          {
            title:    "Corey Schafer — Python Tutorial for Beginners: Variables and Data Types (Video)",
            url:      "https://www.youtube.com/watch?v=khKv-8q7YmY",
            type:     "video",
            duration: "~25 mins",
            note:     "Corey Schafer is the gold standard for clear Python tutorials.",
          },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 2 — Operators, String Manipulation & User Input
  // ============================================================
  {
    id: "W1D2", week: 1, day: 2, phase: 1,
    phaseTitle: "Python Mastery",
    date: "2026-06-16",
    type: "lesson",
    topic: "Operators, String Manipulation & User Input",
    duration: "2–3 hours",

    objectives: [
      "Use arithmetic, comparison, and logical operators confidently",
      "Manipulate strings: slicing, methods, and formatting",
      "Take user input with input() and handle it safely",
      "Convert between data types with int(), float(), str()",
    ],

    introduction: `
Yesterday you created variables. Today you learn to DO things 
with them. This is where code starts to feel alive.

Operators are the verbs of programming. They let you calculate, 
compare, combine, and make decisions about your data.

String manipulation is particularly critical for data science. 
Real-world datasets are messy in very specific ways — drug names 
with inconsistent casing, patient records with extra spaces, 
NAFDAC numbers in three different formats.

Knowing how to clean strings programmatically is one of the 
highest-value skills in your first year as a data scientist. 
When you later use pandas' str methods, every single one maps 
directly to what you learn today.
    `,

    mentalModel: `
MENTAL MODEL — "The Pharmacist's Calculation Sheet"

Arithmetic operators are the formulas on your calculation sheet.
You know the inputs (weight, age, concentration) and the 
operator (formula) produces the output (dose).

Comparison operators are your clinical decision criteria.
"If systolic BP >= 140" — that >= is a comparison operator 
returning True or False, which then drives the next action.

String methods are your label printer's formatting rules.
.upper() = ALL CAPS label.
.strip() = trim the excess from the edges.
.split() = separate a compound entry into individual items.
    `,

    explanation: `
ARITHMETIC OPERATORS
====================
+    addition              5 + 3     → 8
-    subtraction           10 - 4    → 6
*    multiplication        3 * 4     → 12
/    division (float)      7 / 2     → 3.5
//   floor division        7 // 2    → 3    (drops decimal)
%    modulo (remainder)    7 % 2     → 1
**   exponentiation        2 ** 3    → 8

Floor division (//) is useful when you need whole units:
"How many FULL packs of 30 can I fill from 95 tablets?"
95 // 30  →  3 packs (with 5 tablets left over: 95 % 30 = 5)

COMPARISON OPERATORS (always return True or False)
===================================================
==   equal to              5 == 5    → True
!=   not equal to          5 != 3    → True
>    greater than           7 > 3    → True
<    less than              2 < 5    → True
>=   greater or equal       5 >= 5   → True
<=   less or equal          3 <= 4   → True

LOGICAL OPERATORS
=================
and  → BOTH conditions must be True
or   → AT LEAST ONE must be True
not  → flips True to False, False to True

Example:
  has_prescription = True
  is_controlled    = True
  can_dispense = has_prescription and not is_controlled
  # True and not True → True and False → False

MOST-USED STRING METHODS
========================
.upper()       → "metformin".upper()         = "METFORMIN"
.lower()       → "ASPIRIN".lower()           = "aspirin"
.title()       → "amoxicillin hcl".title()   = "Amoxicillin Hcl"
.strip()       → "  data  ".strip()          = "data"
.lstrip()      → "  data  ".lstrip()         = "data  "
.rstrip()      → "  data  ".rstrip()         = "  data"
.replace(a,b)  → "Hello World".replace("World","Victor")
.split(sep)    → "a,b,c".split(",")          = ["a","b","c"]
.startswith()  → "Amoxicillin".startswith("Amo") = True
.endswith()    → "tablet".endswith("let")    = True
.count(sub)    → "banana".count("a")         = 3
len(string)    → len("Victor")               = 6

STRING SLICING
==============
text = "Paracetamol"
text[0]     → "P"          (first character)
text[-1]    → "l"          (last character)
text[0:4]   → "Para"       (index 0 up to but not including 4)
text[4:]    → "cetamol"    (from index 4 to end)
text[:4]    → "Para"       (from start to index 3)
text[::-1]  → "lomatetaraP" (reversed)

TYPE CONVERSION (casting)
=========================
int("25")      → 25      (string to integer)
float("12.5")  → 12.5    (string to float)
str(500)       → "500"   (integer to string)
bool(0)        → False   (zero is falsy)
bool(1)        → True    (any non-zero is truthy)

CRITICAL: input() ALWAYS returns a string.
If you ask for a number, you MUST convert it:
  age = int(input("Enter age: "))
    `,

    clinicalConnection: `
CLINICAL CONNECTION

Data cleaning is 60–80% of real data science work. 
Most of that cleaning is string manipulation.

Imagine you receive a CSV export from a Nigerian hospital's 
legacy system. The drug name column contains:
  "  METFORMIN HCL  "
  "metformin-500mg"
  "Metformin (Hydrochloride)"
  "METFORMIN"

These all refer to the same drug. Before any analysis, 
you must standardize them. The tools are:
  .strip()    → remove surrounding spaces
  .lower()    → normalize case
  .replace()  → remove unwanted characters
  .split()    → separate drug name from dose

This is not hypothetical — it is the first thing you will 
do on every real health dataset you ever work with.
    `,

    example: `
# ── Day 2 Complete Example ──────────────────────────────

# --- Arithmetic operators ---
tablet_weight_mg  = 500
tablets_per_pack  = 30
daily_dose_mg     = 1000

total_mg_per_pack = tablet_weight_mg * tablets_per_pack
print(f"Total mg per pack : {total_mg_per_pack}mg")   # 15000

days_supply = total_mg_per_pack / daily_dose_mg
print(f"Days supply       : {days_supply} days")       # 15.0

full_packs, leftover = divmod(95, 30)  # floor div + modulo
print(f"Full packs: {full_packs}, Leftover tablets: {leftover}")

# --- Comparison operators ---
patient_age   = 17
systolic_bp   = 145
is_adult      = patient_age >= 18
is_hypertensive = systolic_bp >= 140

print(f"Is adult        : {is_adult}")         # False
print(f"Is hypertensive : {is_hypertensive}")  # True

# --- Logical operators ---
has_prescription = True
is_controlled    = True

can_dispense = has_prescription and not is_controlled
print(f"Can dispense     : {can_dispense}")   # False

needs_referral = systolic_bp >= 140 or patient_age < 18
print(f"Needs referral   : {needs_referral}") # True

# --- String methods: real data cleaning scenario ---
raw_entries = [
  "  AMOXICILLIN CAPSULES  ",
  "metformin-500mg",
  "Aspirin (325mg) - oral",
  "  LISINOPRIL  ",
]

print("\n=== Cleaned Drug Names ===")
for raw in raw_entries:
    # Step 1: strip whitespace
    step1 = raw.strip()
    # Step 2: lowercase everything
    step2 = step1.lower()
    # Step 3: remove parenthetical content — simplified here
    step3 = step2.split("(")[0].strip()
    # Step 4: remove dose from name (split on hyphen or space+digit)
    step4 = step3.split("-")[0].strip()
    # Step 5: title case
    cleaned = step4.title()
    print(f"  '{raw.strip()}' → '{cleaned}'")

# Output:
# 'AMOXICILLIN CAPSULES' → 'Amoxicillin Capsules'
# 'metformin-500mg'      → 'Metformin'
# 'Aspirin (325mg) - oral' → 'Aspirin'
# 'LISINOPRIL'           → 'Lisinopril'

# --- String slicing ---
nafdac = "A4-1234"
prefix = nafdac[0]        # "A"
number = nafdac[3:]       # "1234"
print(f"NAFDAC prefix: {prefix}, number: {number}")

# --- input() and type conversion ---
# Uncomment to run interactively:
# raw_age  = input("Patient age: ")
# raw_dose = input("Dose in mg : ")
# age  = int(raw_age)
# dose = float(raw_dose)
# print(f"Daily dose for {age}yr patient: {dose * 2}mg/day")

# Simulated version:
raw_age  = "34"
raw_dose = "12.5"
age  = int(raw_age)
dose = float(raw_dose)
print(f"Daily dose for {age}yr patient: {dose * 2}mg/day")
# Daily dose for 34yr patient: 25.0mg/day
    `,

    commonMistakes: [
      {
        mistake: "Not converting input() to a number before math",
        wrong:   "age = input('Age: ')\nif age > 18:   # TypeError",
        right:   "age = int(input('Age: '))\nif age > 18:   # works",
        explanation: "input() always returns a string. '34' > 18 causes a TypeError. Always cast with int() or float() before arithmetic or comparison.",
      },
      {
        mistake: "Confusing / (true division) with // (floor division)",
        wrong:   "packs = 95 / 30    # gives 3.1666... not 3",
        right:   "packs = 95 // 30   # gives 3 (whole packs)",
        explanation: "Use // when you need whole units — whole packs, whole tablets, whole days.",
      },
      {
        mistake: "String comparison is case-sensitive",
        wrong:   "'Paracetamol' == 'paracetamol'  → False",
        right:   "'Paracetamol'.lower() == 'paracetamol'.lower()  → True",
        explanation: "Always normalize case before comparing drug names or any text data. This is the single most common source of duplicate records in health datasets.",
      },
      {
        mistake: "Calling a string method without the dot notation",
        wrong:   "upper(drug_name)",
        right:   "drug_name.upper()",
        explanation: "String methods belong to the string object. You call them ON the string with a dot.",
      },
    ],

    exercises: [
      "A patient needs 3 doses of 250mg per day for 7 days. Using only arithmetic operators, calculate: total tablets needed, total mg consumed, and print whether a 30-tablet pack is sufficient (use a comparison operator for the last part).",
      "Take this messy drug name string: '  METFORMIN HYDROCHLORIDE 500MG  '. Apply at least 4 string methods in sequence to produce the clean output: 'Metformin Hydrochloride'. Print the result after each step.",
      "Write a small program that asks the user for their weight (kg) and height (m), converts both to floats, calculates BMI (weight / height²), and prints: the BMI value and whether it is Normal (18.5–24.9), Overweight (25–29.9), or Obese (30+) using comparison operators only — no if statements yet.",
      "Given the string 'Aspirin-325mg-tablet', use slicing and .split() to extract just 'Aspirin' and just '325' as separate variables. Print both.",
    ],

    resources: [
      {
        objective: "Use arithmetic, comparison, and logical operators confidently",
        items: [
          {
            title:    "Real Python — Operators and Expressions in Python",
            url:      "https://realpython.com/python-operators-expressions/",
            type:     "article",
            note:     "The most thorough free guide to Python operators. Covers all types with examples.",
          },
          {
            title:    "W3Schools — Python Operators (Interactive)",
            url:      "https://www.w3schools.com/python/python_operators.asp",
            type:     "interactive",
            note:     "Use the live editor to test each operator immediately. Good for quick reference.",
          },
          {
            title:    "CS50P Lecture 1 — Conditionals (Video, covers operators)",
            url:      "https://cs50.harvard.edu/python/2022/weeks/1/",
            type:     "video",
            duration: "~2 hrs",
            note:     "David Malan explains comparison and logical operators in the context of real decisions.",
          },
        ],
      },
      {
        objective: "Manipulate strings: slicing, methods, and formatting",
        items: [
          {
            title:    "Real Python — Python String Formatting Best Practices",
            url:      "https://realpython.com/python-string-formatting/",
            type:     "article",
            note:     "Covers f-strings, .format(), and why f-strings are now the standard.",
          },
          {
            title:    "Python Docs — Common String Operations",
            url:      "https://docs.python.org/3/library/stdtypes.html#string-methods",
            type:     "reference",
            note:     "Official complete list of every string method. Bookmark this forever.",
          },
          {
            title:    "Corey Schafer — Python String Methods (Video)",
            url:      "https://www.youtube.com/watch?v=k9TUPpGqYTo",
            type:     "video",
            duration: "~30 mins",
            note:     "Best video walkthrough of the most important string methods.",
          },
        ],
      },
      {
        objective: "Take user input with input() and handle it safely",
        items: [
          {
            title:    "Real Python — Python's input() Function",
            url:      "https://realpython.com/python-input-function/",
            type:     "article",
            note:     "Covers input(), type conversion, and validation — all in one place.",
          },
        ],
      },
      {
        objective: "Convert between data types with int(), float(), str()",
        items: [
          {
            title:    "Real Python — Type Conversion in Python",
            url:      "https://realpython.com/python-data-types/#type-conversion",
            type:     "article",
            note:     "Clear explanation of implicit vs explicit conversion with worked examples.",
          },
          {
            title:    "W3Schools — Python Casting (Interactive)",
            url:      "https://www.w3schools.com/python/python_casting.asp",
            type:     "interactive",
            note:     "Quick interactive reference for int(), float(), str() conversions.",
          },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 3 — Control Flow: if, elif, else
  // ============================================================
  {
    id: "W1D3", week: 1, day: 3, phase: 1,
    phaseTitle: "Python Mastery",
    date: "2026-06-17",
    type: "lesson",
    topic: "Control Flow: if, elif, else & Conditionals",
    duration: "2–3 hours",

    objectives: [
      "Write if/elif/else statements to make branching decisions",
      "Understand Python's indentation as block structure",
      "Nest conditions inside each other correctly",
      "Use conditional expressions (ternary) for clean one-liners",
    ],

    introduction: `
Without control flow, a program is just a list — it executes 
every line in order, top to bottom, every single time.
Control flow is what gives programs intelligence.

When you counsel a patient on whether they can take ibuprofen, 
your brain silently runs through a decision tree:
  - Do they have a peptic ulcer?     → if yes: contraindicated
  - Are they on warfarin?            → if yes: caution — bleeding risk
  - Are they pregnant (3rd trimester)? → if yes: avoid
  - Otherwise                        → generally appropriate

That exact structure — a chain of conditions leading to 
different outcomes — is what if/elif/else implements.

In data science, control flow is how you:
  - Classify patients into risk categories
  - Flag records that need manual review
  - Apply different formulas based on patient demographics
  - Route data through different processing pipelines
    `,

    mentalModel: `
MENTAL MODEL — "The Clinical Decision Tree"

Every standard treatment guideline is a decision tree.
The WHO treatment algorithm for malaria is an if/elif/else 
structure in plain English. Python's if/elif/else lets you 
encode that algorithm as executable code — which means 
you can run it on 100,000 patient records in seconds 
instead of reviewing them one by one.

Indentation in Python is the visual equivalent of the 
branching lines in a flowchart. The indented lines "belong 
to" the condition above them, just as a branch in a 
flowchart "belongs to" its decision diamond.
    `,

    explanation: `
BASIC STRUCTURE
===============
if condition:
    # runs ONLY if condition is True
elif another_condition:
    # runs if first was False AND this is True
elif yet_another:
    # as many elif blocks as needed
else:
    # runs if ALL above conditions were False

Python evaluates conditions top to bottom and stops 
at the FIRST True one. The else block is a catch-all.

THE INDENTATION RULE
====================
Python uses 4 spaces of indentation to define a block.
This is NOT optional — it is enforced syntax.

WRONG (will crash with IndentationError):
  if True:
  print("hello")       ← must be indented

CORRECT:
  if True:
      print("hello")   ← 4 spaces

TRUTHINESS (beyond True and False)
===================================
Python treats certain values as falsy even if they 
are not the literal value False:
  Falsy values: 0, 0.0, "", [], {}, None
  Truthy: any non-zero number, non-empty string/list

This means: if drug_name:  ← checks if string is non-empty
            if stock:      ← checks if stock is non-zero

TERNARY EXPRESSION (conditional in one line)
============================================
value = "Adult" if age >= 18 else "Minor"

Read as: "value is 'Adult' IF age >= 18, ELSE 'Minor'"
Use for simple True/False assignments. 
Do NOT use for complex logic — write a proper if/else.

NESTED CONDITIONS
=================
An if block can contain another if block inside it.
Be careful of deep nesting (more than 2–3 levels) 
as it becomes hard to read quickly.
    `,

    clinicalConnection: `
CLINICAL CONNECTION

The Cockroft-Gault dose adjustment algorithm is a 
perfect real-world if/elif/else chain:

  if CrCl >= 60:   full dose
  elif CrCl >= 30: reduce by 50%
  elif CrCl >= 15: reduce by 75%
  else:            contraindicated

You will implement exactly this kind of algorithm 
in your data science work — applied automatically 
across thousands of patient records. That is the 
difference between a pharmacist reviewing one patient 
at a time and a data scientist who builds the tool 
that reviews all of them simultaneously.
    `,

    example: `
# ── Day 3 Complete Example ──────────────────────────────

# --- Basic if/elif/else ---
def classify_blood_pressure(systolic, diastolic):
    """
    Classifies BP using AHA 2017 guidelines.
    Returns a classification string.
    """
    if systolic < 120 and diastolic < 80:
        return "Normal"
    elif systolic < 130 and diastolic < 80:
        return "Elevated"
    elif systolic < 140 or diastolic < 90:
        return "Stage 1 Hypertension"
    elif systolic >= 180 or diastolic >= 120:
        return "Hypertensive Crisis — seek emergency care"
    else:
        return "Stage 2 Hypertension"

readings = [(115, 75), (125, 78), (135, 88), (155, 95), (185, 125)]
for sys, dia in readings:
    classification = classify_blood_pressure(sys, dia)
    print(f"  {sys}/{dia} mmHg → {classification}")

# --- Dose adjustment by renal function ---
def metformin_dose(crcl_ml_min):
    """
    Metformin dose adjustment based on CrCl (Cockcroft-Gault).
    Returns dosing recommendation as a string.
    """
    if crcl_ml_min >= 60:
        return "Full dose: 500–1000mg twice daily"
    elif crcl_ml_min >= 45:
        return "Reduce dose: 500mg twice daily — monitor closely"
    elif crcl_ml_min >= 30:
        return "Caution: 500mg once daily — specialist review needed"
    else:
        return "CONTRAINDICATED — risk of lactic acidosis"

test_crcl = [80, 52, 38, 20]
print("\n=== Metformin Dosing by CrCl ===")
for crcl in test_crcl:
    print(f"  CrCl {crcl} mL/min → {metformin_dose(crcl)}")

# --- Nested conditions ---
age = 8
weight_kg = 25
has_allergy = False
drug = "Amoxicillin"

if drug == "Amoxicillin":
    if has_allergy:
        recommendation = "CONTRAINDICATED — documented penicillin allergy"
    elif age < 1:
        recommendation = "Consult paediatrician — under 1 year"
    else:
        dose = 25 * weight_kg  # 25mg/kg for paediatrics
        recommendation = f"Paediatric dose: {dose}mg three times daily"
else:
    recommendation = "Drug not in this protocol"

print(f"\n{drug} recommendation: {recommendation}")

# --- Logical operators in conditions ---
is_pregnant    = False
is_breastfeed  = True
age            = 24

if is_pregnant or is_breastfeed:
    print("NSAID caution: avoid ibuprofen in pregnancy/breastfeeding")
elif age < 16:
    print("Aspirin caution: Reye syndrome risk under 16")
else:
    print("Standard NSAID dosing appropriate")

# --- Ternary expressions ---
stock = 45
reorder_level = 50
status = "REORDER NOW" if stock < reorder_level else "Adequate"
print(f"\nStock status: {status}")

age = 15
group = "Paediatric" if age < 18 else "Adult"
print(f"Dosing group: {group}")

# --- Truthiness check ---
drug_name = ""
patient_id = None

if not drug_name:
    print("Error: drug name is required")
if not patient_id:
    print("Error: patient ID is required")
    `,

    commonMistakes: [
      {
        mistake: "Missing colon after condition",
        wrong:   "if age > 18\n    print('adult')",
        right:   "if age > 18:\n    print('adult')",
        explanation: "The colon is mandatory. Python raises SyntaxError without it. Every if, elif, else, for, while, def, and class line must end with a colon.",
      },
      {
        mistake: "Using = instead of == in a condition",
        wrong:   "if drug = 'Aspirin':",
        right:   "if drug == 'Aspirin':",
        explanation: "= is assignment. == is comparison. This is the single most common error beginners make in conditionals.",
      },
      {
        mistake: "Inconsistent indentation inside blocks",
        wrong:   "if True:\n  print('a')   # 2 spaces\n    print('b') # 4 spaces",
        right:   "if True:\n    print('a')  # 4 spaces\n    print('b')  # 4 spaces",
        explanation: "All lines in the same block must have exactly the same indentation. Mixing causes IndentationError.",
      },
      {
        mistake: "Ordering conditions wrong so some branches never run",
        wrong:   "if crcl >= 30: ...\nelif crcl >= 60: ...  # never reached if crcl=80",
        right:   "if crcl >= 60: ...   # most restrictive first\nelif crcl >= 30: ...",
        explanation: "Python stops at the first True condition. Put the most specific/restrictive conditions first.",
      },
    ],

    exercises: [
      "Write a function creatinine_clearance_category(crcl) that returns 'Normal' (>90), 'Mildly Reduced' (60–90), 'Moderately Reduced' (30–60), 'Severely Reduced' (15–30), or 'Kidney Failure' (<15). Test it with at least 6 values.",
      "Write a paediatric weight-based dosing function for paracetamol: dose = 15mg/kg for age 2–11, standard adult 500mg for age 12–64, 500mg with caution for age 65+, contraindicated under 2 years. Include a nested check: if dose would exceed 1000mg, cap it at 1000mg.",
      "Write a blood glucose classifier using Nigerian Diabetic Association thresholds: Fasting <5.6 = Normal, 5.6–6.9 = Prediabetic, >=7.0 = Diabetic. Add a ternary expression that sets a follow_up variable to 'Yes' if prediabetic or diabetic, 'No' otherwise.",
      "Ask the user to input a number 1–7. Use if/elif/else to print the day of the week and whether it is a weekday or weekend. What happens if they type 0 or 8? Handle that case too.",
    ],

    resources: [
      {
        objective: "Write if/elif/else statements to make branching decisions",
        items: [
          {
            title:    "Real Python — Conditional Statements in Python (if/elif/else)",
            url:      "https://realpython.com/python-conditional-statements/",
            type:     "article",
            note:     "The most comprehensive free article on Python conditionals. Covers all edge cases.",
          },
          {
            title:    "CS50P Lecture 1 — Conditionals (Video)",
            url:      "https://cs50.harvard.edu/python/2022/weeks/1/",
            type:     "video",
            duration: "~2 hrs",
            note:     "Harvard's approach, with excellent worked examples from scratch.",
          },
        ],
      },
      {
        objective: "Understand Python's indentation as block structure",
        items: [
          {
            title:    "Real Python — Indentation in Python",
            url:      "https://realpython.com/python-program-structure/#indentation",
            type:     "article",
            note:     "Explains why Python uses indentation, how it works, and how to avoid IndentationError.",
          },
          {
            title:    "PEP 8 — Indentation (Official Style Guide)",
            url:      "https://peps.python.org/pep-0008/#indentation",
            type:     "reference",
            note:     "The official Python style guide section on indentation. Short read, important reference.",
          },
        ],
      },
      {
        objective: "Nest conditions inside each other correctly",
        items: [
          {
            title:    "Real Python — Nested if Statements",
            url:      "https://realpython.com/python-conditional-statements/#nested-if-statements",
            type:     "article",
            note:     "Specific section on nesting with guidance on when nesting becomes too deep.",
          },
        ],
      },
      {
        objective: "Use conditional expressions (ternary) for clean one-liners",
        items: [
          {
            title:    "Real Python — Ternary Operator in Python",
            url:      "https://realpython.com/python-conditional-statements/#conditional-expressions-pythons-ternary-operator",
            type:     "article",
            note:     "Covers ternary syntax, best practices, and when NOT to use it.",
          },
          {
            title:    "W3Schools — Python Ternary (Interactive)",
            url:      "https://www.w3schools.com/python/python_conditions.asp",
            type:     "interactive",
            note:     "Quick interactive reference with live editor.",
          },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 4 — Loops: for, while, range(), enumerate()
  // ============================================================
  {
    id: "W1D4", week: 1, day: 4, phase: 1,
    phaseTitle: "Python Mastery",
    date: "2026-06-18",
    type: "lesson",
    topic: "Loops: for, while, range() & Iteration",
    duration: "2–3 hours",

    objectives: [
      "Use for loops to iterate over any sequence",
      "Use while loops for condition-based repetition",
      "Control loops with break, continue, and else",
      "Use range() and enumerate() effectively",
    ],

    introduction: `
Loops are the feature that makes computers worth using.
A human pharmacist can review perhaps 100 patient records 
in a day. A Python loop can process 100,000 in seconds.

Without loops, data science is physically impossible.
Every operation you will ever perform on a dataset 
is a loop under the hood — even when you call a 
single pandas function on a million rows.

Understanding loops at the Python level means you 
understand what is happening inside every library 
you will ever use. That depth of understanding is 
what separates engineers who just use tools from 
engineers who understand and extend them.
    `,

    mentalModel: `
MENTAL MODEL — "The Ward Round"

A for loop is a ward round. You have a list of patients.
You visit each one in order, perform the same assessment 
process (the loop body), then move to the next.
You do not skip anyone. You do not loop back.
When the list is done, the round is done.

A while loop is a monitoring protocol. 
"While the patient's saturation is below 95%, 
adjust the oxygen flow and check again."
You keep repeating until the condition changes.
The danger: if saturation never reaches 95%, 
you loop forever — an infinite loop.
Always make sure your while condition will eventually 
become False.
    `,

    explanation: `
FOR LOOP — iterate over a known sequence
=========================================
for variable in sequence:
    # body — runs once per item

The variable takes the value of each item in turn.
The sequence can be a list, string, range, dict, 
or any iterable.

WHILE LOOP — repeat until condition is False
=============================================
while condition:
    # body — keep running until condition is False

Always ensure something inside the body moves the 
condition toward False, or you create an infinite loop.

RANGE()
=======
range(stop)          → 0, 1, ..., stop-1
range(start, stop)   → start, start+1, ..., stop-1
range(start, stop, step) → with custom step

range(5)       → 0 1 2 3 4
range(1, 6)    → 1 2 3 4 5     (stop is excluded)
range(0, 10, 2) → 0 2 4 6 8   (step of 2)
range(10, 0, -1) → 10 9 8 ... 1 (countdown)

ENUMERATE()
===========
When you need both the index AND the value:

for index, item in enumerate(my_list):
    print(index, item)

By default, index starts at 0.
enumerate(my_list, start=1) → starts at 1.

BREAK AND CONTINUE
==================
break    → immediately exits the entire loop
continue → skips the rest of this iteration, 
           jumps to the next one

LOOP ELSE
=========
A lesser-known but useful feature:
for item in list:
    if condition: break
else:
    # runs ONLY if loop completed without break
    # i.e. the item was never found
    `,

    clinicalConnection: `
CLINICAL CONNECTION

In your future data science work, you will write loops like:

FOR loops:
  - Process every row in a patient dataset
  - Apply a dose formula to every patient's weight
  - Check every drug in a prescription against 
    a contraindications list

WHILE loops:
  - Keep prompting for valid input until received
  - Retry a failed API call up to 3 times
  - Monitor a streaming data feed until a 
    threshold is crossed

BREAK in clinical context:
  - Loop through drug combinations and break 
    (stop checking) as soon as a critical 
    interaction is found

CONTINUE in clinical context:
  - Loop through records and skip (continue) 
    any that are missing required fields
    `,

    example: `
# ── Day 4 Complete Example ──────────────────────────────

# --- Basic for loop over a list ---
formulary = ["Amoxicillin", "Metformin", "Lisinopril", "Aspirin"]

print("=== Formulary ===")
for drug in formulary:
    print(f"  • {drug}")

# --- for with range() ---
print("\n=== Tablet Count ===")
for i in range(1, 6):
    print(f"  Tablet {i} dispensed")

# --- enumerate() — index + value ---
print("\n=== Numbered Formulary ===")
for num, drug in enumerate(formulary, start=1):
    print(f"  {num}. {drug}")

# --- Accumulating with a loop ---
patient_weights = [55.0, 72.5, 88.0, 63.0, 91.5]
total   = 0
count   = 0

for weight in patient_weights:
    total += weight
    count += 1

average = total / count
print(f"\nAverage weight: {average:.1f} kg")

# --- Loop with condition inside ---
doses_mg = [500, 250, 1500, 750, 2500, 100]
safe_doses   = []
unsafe_doses = []

for dose in doses_mg:
    if dose > 1000:
        unsafe_doses.append(dose)
    else:
        safe_doses.append(dose)

print(f"Safe doses  : {safe_doses}")
print(f"Unsafe doses: {unsafe_doses}")

# --- CONTINUE: skip invalid records ---
records = [
    {"name": "Victor",  "age": 28},
    {"name": "",        "age": 34},   # missing name
    {"name": "Amaka",   "age": -1},   # invalid age
    {"name": "Chidi",   "age": 61},
]

print("\n=== Valid Records ===")
for record in records:
    if not record["name"]:
        print(f"  Skipping: missing name")
        continue
    if record["age"] <= 0:
        print(f"  Skipping: invalid age for {record['name']}")
        continue
    print(f"  ✓ {record['name']}, {record['age']} years")

# --- BREAK: stop at first critical finding ---
interactions = [
    ("Aspirin",   "Warfarin",   "moderate"),
    ("Metformin", "Alcohol",    "moderate"),
    ("Tramadol",  "MAO-inhibitor", "CRITICAL"),
    ("Lisinopril","Potassium",  "moderate"),
]

print("\n=== Interaction Check ===")
for drug1, drug2, severity in interactions:
    print(f"  Checking: {drug1} + {drug2}")
    if severity == "CRITICAL":
        print(f"  ⛔ CRITICAL interaction found — STOP dispensing")
        break
else:
    print("  All interactions are non-critical")

# --- WHILE loop: stock depletion simulation ---
stock = 20
dispensed = 0

print(f"\n=== Dispensing Simulation (stock: {stock}) ===")
while stock > 0:
    stock     -= 1
    dispensed += 1
    if stock == 5:
        print(f"  ⚠️  Low stock warning: {stock} remaining")
    if dispensed == 10:
        break  # dispensed enough for today

print(f"Dispensed: {dispensed} | Remaining: {stock}")
    `,

    commonMistakes: [
      {
        mistake: "Infinite while loop — condition never becomes False",
        wrong:   "while stock > 0:\n    print(stock)  # stock never changes",
        right:   "while stock > 0:\n    print(stock)\n    stock -= 1  # must move toward False",
        explanation: "Always ensure something inside the while body brings the condition closer to False. If nothing changes, the loop runs forever and crashes your program.",
      },
      {
        mistake: "range() stop value is exclusive — off by one errors",
        wrong:   "range(1, 5)  # expecting 1,2,3,4,5 but only gets 1,2,3,4",
        right:   "range(1, 6)  # stop is always excluded",
        explanation: "range(start, stop) includes start but excludes stop. To get 1 through 5, use range(1, 6).",
      },
      {
        mistake: "Modifying a list while iterating over it",
        wrong:   "for item in my_list:\n    my_list.remove(item)  # unpredictable skipping",
        right:   "my_list = [x for x in my_list if keep_condition(x)]",
        explanation: "Changing a list while looping over it causes Python to skip items silently. Never modify a list inside a for loop over it.",
      },
      {
        mistake: "Expecting enumerate to start at 1 by default",
        wrong:   "for i, item in enumerate(lst):  # i starts at 0",
        right:   "for i, item in enumerate(lst, start=1):  # i starts at 1",
        explanation: "enumerate() defaults to 0-based indexing. Pass start=1 for human-readable numbering.",
      },
    ],

    exercises: [
      "Given a list of 8 patient blood pressures as tuples (systolic, diastolic), use a for loop with enumerate() to print each as a numbered entry with its BP classification (reuse your function from Day 3).",
      "Write a while loop that simulates dispensing from a stock of 100 tablets, dispensing 5 at a time. Print a reorder alert when stock drops below 20. Stop when stock hits 0. Use break if somehow stock goes negative.",
      "Use a for loop with continue to filter a list of 10 drug records and skip any with missing NAFDAC numbers or prices of 0. Print only valid records, and at the end print how many were skipped.",
      "Use a for/else to search a formulary list for a specific drug name. If found, print its position (use break). If not found, the else block should print a 'not in formulary' message.",
    ],

    resources: [
      {
        objective: "Use for loops to iterate over any sequence",
        items: [
          {
            title:    "Real Python — Python for Loops: The Definitive Guide",
            url:      "https://realpython.com/python-for-loop/",
            type:     "article",
            note:     "Covers everything: iterables, range, enumerate, zip, nested loops, and best practices.",
          },
          {
            title:    "CS50P Lecture 2 — Loops (Video)",
            url:      "https://cs50.harvard.edu/python/2022/weeks/2/",
            type:     "video",
            duration: "~2 hrs",
            note:     "Harvard's lecture builds loops from scratch with excellent progressive examples.",
          },
        ],
      },
      {
        objective: "Use while loops for condition-based repetition",
        items: [
          {
            title:    "Real Python — Python while Loops",
            url:      "https://realpython.com/python-while-loop/",
            type:     "article",
            note:     "Covers while, break, continue, else, and infinite loop prevention.",
          },
        ],
      },
      {
        objective: "Control loops with break, continue, and else",
        items: [
          {
            title:    "Python Docs — break and continue Statements",
            url:      "https://docs.python.org/3/tutorial/controlflow.html#break-and-continue-statements",
            type:     "reference",
            note:     "Official documentation — short but authoritative.",
          },
          {
            title:    "W3Schools — Python break / continue (Interactive)",
            url:      "https://www.w3schools.com/python/python_for_loops.asp",
            type:     "interactive",
            note:     "Live editor to test break and continue immediately.",
          },
        ],
      },
      {
        objective: "Use range() and enumerate() effectively",
        items: [
          {
            title:    "Real Python — Python range() Function",
            url:      "https://realpython.com/python-range/",
            type:     "article",
            note:     "Deep guide on range() — all three forms, step values, reversed ranges.",
          },
          {
            title:    "Real Python — Python enumerate()",
            url:      "https://realpython.com/python-enumerate/",
            type:     "article",
            note:     "Complete guide to enumerate() with start parameter and practical use cases.",
          },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 5 — PROJECT: Pharmacy CLI Tool
  // ============================================================
  {
    id: "W1D5", week: 1, day: 5, phase: 1,
    phaseTitle: "Python Mastery",
    date: "2026-06-19",
    type: "project",
    topic: "PROJECT: Pharmacy CLI Dispensing Tool",
    duration: "3–5 hours",

    objectives: [
      "Integrate all Week 1 concepts in one complete program",
      "Build a CLI tool that mirrors real pharmacist decisions",
      "Practice writing clean, readable code with comments",
      "Push a complete project to GitHub with a proper README",
    ],

    introduction: `
Week 1 ends with your first real project.

A project is not an exercise. There is no answer key.
You make design decisions, you hit bugs you have to 
solve yourself, and you end up with something real 
that you can show to anyone.

This project intentionally uses your Pharm.D knowledge 
as the domain. Your clinical understanding is not a 
distraction from coding — it is your competitive edge.
You know what the program should do because you have 
done it manually hundreds of times.

The goal is not perfection. The goal is completion + 
a working program pushed to GitHub by end of day.
    `,

    mentalModel: `
MENTAL MODEL — "The Digital Dispensary Counter"

Imagine you are building a digital version of the 
paper log sheet every community pharmacist keeps.
Patient comes in. You note their name. You check 
the drug. You calculate the dose. You print the label.
You log the transaction.

That is your program. Every step is one of the 
concepts from this week.
    `,

    projectBrief: `
BUILD: A command-line pharmacy dispensing assistant.

MINIMUM REQUIREMENTS:
─────────────────────
1. Display a numbered menu of at least 5 drugs with 
   their available doses and stock levels

2. Ask for:
   - Patient name
   - Patient age
   - Drug selection (by number)
   - Quantity needed

3. Validate inputs:
   - Age must be a positive integer
   - Quantity cannot exceed available stock
   - Drug number must be in the valid range

4. Apply clinical logic:
   - Check if the drug is appropriate for the patient's age
   - Calculate the correct dose (weight-based for paediatrics 
     if age < 12, ask for weight)
   - Flag controlled drugs and ask for prescription number

5. Output a formatted dispensing label:
   ┌──────────────────────────────────┐
   │  VICTOR'S COMMUNITY PHARMACY    │
   │  Patient  : Victor Okolie       │
   │  Drug     : Amoxicillin 500mg   │
   │  Dose     : 500mg               │
   │  Frequency: Three times daily   │
   │  Duration : 7 days              │
   │  Date     : 15/06/2026          │
   └──────────────────────────────────┘

6. After each dispense:
   - Decrement stock
   - Ask: "Dispense for another patient? (y/n)"
   - Loop back if yes, exit if no

7. On exit:
   - Print a session summary:
     Total patients served, total drugs dispensed,
     list of drugs that need reordering (<10 in stock)

STRETCH GOALS (optional):
──────────────────────────
- Drug interaction check between two selected drugs
- Save the session log to a .txt file
- Add a search function to find a drug by partial name
- Colour-code the terminal output using ANSI codes

GITHUB REQUIREMENTS:
────────────────────
Repository name: python-week1-pharmacy-cli
README must include:
  - What the program does (2–3 sentences)
  - How to run it (python main.py)
  - Example output (screenshot or text block)
  - What concepts from Week 1 are demonstrated
  - Your name and Pharm.D background — own your domain expertise

Commit at least 3 times during development:
  1. "Initial scaffold: menu and drug data"
  2. "Add dispensing logic and label generation"
  3. "Add session summary and input validation"
    `,

    example: `
# ── Project Starter Scaffold ────────────────────────────
# Build ON TOP of this. Do not just copy it.

import datetime

# Drug database — expand this significantly
DRUGS = {
    1: {"name": "Amoxicillin",  "dose_mg": 500, "stock": 50, "controlled": False, "min_age": 0},
    2: {"name": "Metformin",    "dose_mg": 500, "stock": 30, "controlled": False, "min_age": 18},
    3: {"name": "Tramadol",     "dose_mg": 50,  "stock": 20, "controlled": True,  "min_age": 16},
    4: {"name": "Paracetamol",  "dose_mg": 500, "stock": 80, "controlled": False, "min_age": 0},
    5: {"name": "Lisinopril",   "dose_mg": 10,  "stock": 25, "controlled": False, "min_age": 18},
}

REORDER_LEVEL = 10
session_log   = []

def display_menu():
    print("\n" + "="*40)
    print("  PHARMACY DISPENSING SYSTEM")
    print("="*40)
    for num, drug in DRUGS.items():
        stock_warn = " ⚠️" if drug["stock"] < REORDER_LEVEL else ""
        print(f"  {num}. {drug['name']} {drug['dose_mg']}mg "
              f"(Stock: {drug['stock']}){stock_warn}")
    print("="*40)

def get_patient_info():
    name = input("Patient name: ").strip()
    while not name:
        print("Name cannot be empty.")
        name = input("Patient name: ").strip()

    while True:
        try:
            age = int(input("Patient age : "))
            if age <= 0: raise ValueError
            break
        except ValueError:
            print("Please enter a valid positive age.")

    return name, age

def dispense(drug, patient_name, age, quantity):
    """Core dispensing logic — expand this significantly."""
    if age < drug["min_age"]:
        return f"⛔ {drug['name']} not suitable for age {age}"
    if quantity > drug["stock"]:
        return f"⛔ Insufficient stock. Available: {drug['stock']}"

    drug["stock"] -= quantity
    today = datetime.date.today().strftime("%d/%m/%Y")

    label = f"""
┌{'─'*36}┐
│  VICTOR'S COMMUNITY PHARMACY      │
│  Patient  : {patient_name:<23}│
│  Drug     : {drug['name']} {drug['dose_mg']}mg{' '*(18-len(drug['name']))}│
│  Quantity : {quantity} tablet(s){' '*21}│
│  Date     : {today}{' '*21}│
└{'─'*36}┘"""

    session_log.append({
        "patient": patient_name,
        "drug":    drug["name"],
        "qty":     quantity,
        "date":    today,
    })

    return label

# Main loop — build the full program here
def main():
    print("\nWelcome to Victor's Pharmacy CLI")
    # Your main loop goes here
    pass

if __name__ == "__main__":
    main()
    `,

    commonMistakes: [
      {
        mistake: "Trying to build everything at once",
        wrong:   "Sitting staring at a blank file trying to plan the perfect program",
        right:   "Build the menu first. Get it working. Then add dispensing. Then validation. One piece at a time.",
        explanation: "Professional software is built incrementally. Get something running, then improve it. A working simple program is worth more than a perfect program that doesn't exist yet.",
      },
      {
        mistake: "Not committing to GitHub until the end",
        wrong:   "Finishing everything then doing one big commit",
        right:   "Commit after each working milestone (menu, dispensing, validation, summary)",
        explanation: "Frequent commits show your thinking process and protect your work. If something breaks, you can roll back to a previous commit.",
      },
    ],

    exercises: [],

    resources: [
      {
        objective: "Integrate all Week 1 concepts in one complete program",
        items: [
          {
            title:    "Real Python — How to Build a Command Line Interface",
            url:      "https://realpython.com/command-line-interfaces-python-argparse/",
            type:     "article",
            note:     "Reference for CLI structure. You don't need argparse for this project — just input() — but this shows the professional approach.",
          },
          {
            title:    "Automate the Boring Stuff — Chapters 1–3 Review",
            url:      "https://automatetheboringstuff.com/2e/chapter1/",
            type:     "article",
            note:     "Use as a reference during building. All Week 1 concepts are covered here.",
          },
        ],
      },
      {
        objective: "Push a complete project to GitHub with a proper README",
        items: [
          {
            title:    "GitHub Docs — About READMEs",
            url:      "https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes",
            type:     "article",
            note:     "Official guide on writing a README. Short and directly useful.",
          },
          {
            title:    "makeareadme.com — README Template Generator",
            url:      "https://www.makeareadme.com/",
            type:     "tool",
            note:     "Interactive README template. Fill in the fields and get a formatted README.",
          },
          {
            title:    "GitHub Git Handbook (Video overview)",
            url:      "https://www.youtube.com/watch?v=RGOj5yH7evk",
            type:     "video",
            duration: "~1 hr",
            note:     "freeCodeCamp's Git and GitHub crash course. Watch if you need a refresher on push/commit.",
          },
        ],
      },
    ],
  },

];

// Export
if (typeof module !== "undefined") {
  module.exports = { WEEK1 };
}
