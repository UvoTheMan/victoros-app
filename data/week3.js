// ============================================================
// WEEK 3 — Object-Oriented Programming
// Days 11–15 | 29 June – 3 July 2026
// Enriched: Mental Models, Clinical Connections,
//           Objective-mapped resources (video + article + tool)
// ============================================================

const WEEK3 = [

  // ============================================================
  // DAY 11 — Classes, __init__, Instance vs Class Attributes
  // ============================================================
  {
    id: "W3D1", week: 3, day: 1, phase: 1,
    phaseTitle: "Python Mastery",
    date: "2026-06-29",
    type: "lesson",
    topic: "OOP Part 1: Classes, __init__ & Attributes",
    duration: "2–3 hours",

    objectives: [
      "Understand what Object-Oriented Programming is and why it matters",
      "Define a class with __init__ and create instances from it",
      "Distinguish between instance attributes and class attributes",
      "Write instance methods that operate on object data",
    ],

    introduction: `
You have been writing procedural Python — a sequence 
of instructions that runs top to bottom. That style 
works well for scripts, but it breaks down when your 
program grows large and complex.

Object-Oriented Programming (OOP) is a different way 
of organising code. Instead of grouping logic into 
functions, you group related DATA and BEHAVIOUR 
together into objects.

Why does this matter for you specifically?

Every library you will use in data science and AI 
is OOP under the hood:

  pandas DataFrame → a class
  df.head()        → a method on that class
  df.shape         → an attribute of that class

  sklearn model    → a class
  model.fit()      → a method
  model.coef_      → an attribute

  Claude API client → a class
  client.messages.create() → a method

When you call df.describe(), you are calling an 
instance method on a DataFrame object. Understanding 
OOP at this level means you understand WHAT these 
libraries are doing, not just HOW to call them.

And when you build your AI health agent, you will 
design it as a class — with attributes for the 
patient context and methods for asking questions, 
processing responses, and logging results.
    `,

    mentalModel: `
MENTAL MODEL — "The Drug Formulation Template"

A CLASS is a formulation template — a master recipe 
that defines what every tablet of this drug will 
contain and how it will behave.

An OBJECT (instance) is a specific manufactured 
batch created from that template.

The TEMPLATE (class) says:
  "Every drug has a name, dose, and stock level.
   Every drug can be dispensed and restocked."

The SPECIFIC DRUG (object) says:
  "I am Metformin 500mg. I have 200 units in stock.
   My price is ₦1,500."

You write the template once.
You create as many specific drugs as you need 
from that template — each with its own data.

__init__ is the manufacturing process — the 
moment a specific drug object is created from 
the template, __init__ runs to set its 
individual properties.
    `,

    explanation: `
CLASS DEFINITION
================
class ClassName:
    """Docstring describing the class."""

    def __init__(self, param1, param2):
        self.param1 = param1  # instance attribute
        self.param2 = param2  # instance attribute

    def method_name(self):
        """A method that operates on this object."""
        return self.param1

CREATING AN INSTANCE (object)
==============================
my_object = ClassName(value1, value2)

Python calls __init__ automatically with your values.

SELF
====
self is a reference to the specific object being 
created or used. It is always the first parameter 
of any method. Python passes it automatically — 
you never provide it when calling.

my_object.method()   ← you write this
ClassName.method(my_object)  ← what Python actually does

INSTANCE ATTRIBUTES vs CLASS ATTRIBUTES
========================================
Instance attributes → unique to each object
  Set in __init__ with self.attribute_name = value
  Different objects have different values

Class attributes → shared by ALL instances
  Defined directly in the class body (not in __init__)
  All objects share the same value

class Drug:
    category = "Medication"   # CLASS attribute
    count    = 0              # CLASS attribute

    def __init__(self, name):
        self.name = name      # INSTANCE attribute
        Drug.count += 1       # increment shared counter

INSTANCE METHODS
================
def method_name(self, param):
    # can read and modify self.attribute_name
    return something

Called on an instance: my_drug.dispense(30)
    `,

    clinicalConnection: `
CLINICAL CONNECTION

A Patient class captures everything you need 
to know about a patient and what you can do 
with that information:

class Patient:
    def __init__(self, name, age, weight_kg):
        self.name       = name
        self.age        = age
        self.weight_kg  = weight_kg
        self.medications = []
        self.conditions  = []

    def add_medication(self, drug, dose):
        self.medications.append((drug, dose))

    def calculate_bmi(self):
        # needs height too — design decision for your exercise

    def clinical_summary(self):
        # returns a formatted summary

In data science, you will often load a CSV into a 
DataFrame, then write methods that operate on each 
row as if it were a patient object. Understanding 
OOP means you understand WHY pandas is designed 
the way it is — not as a collection of functions, 
but as a class with attributes (df.columns, 
df.dtypes, df.shape) and methods (df.groupby(), 
df.merge(), df.apply()).
    `,

    example: `
# ── Day 11 Complete Example ──────────────────────────────

class Drug:
    """
    Represents a pharmaceutical drug in the dispensary system.

    Class Attributes:
        formulary_name: Name of the pharmacy (shared by all drugs)
        total_drugs:    Running count of all Drug objects created

    Instance Attributes:
        name, dose_mg, indication, is_controlled, stock
    """

    # CLASS attributes — shared by ALL Drug instances
    formulary_name = "Victor's Community Pharmacy"
    total_drugs    = 0

    def __init__(self, name, dose_mg, indication,
                 is_controlled=False, stock=0):
        # INSTANCE attributes — unique to each Drug object
        self.name          = name
        self.dose_mg       = dose_mg
        self.indication    = indication
        self.is_controlled = is_controlled
        self.stock         = stock
        self.dispense_log  = []

        # Update the class-level counter
        Drug.total_drugs += 1

    # --- Instance methods ---
    def add_stock(self, quantity):
        """Add units to stock. Returns new stock level."""
        if quantity <= 0:
            raise ValueError("Quantity must be positive")
        self.stock += quantity
        return self.stock

    def dispense(self, quantity, patient_name):
        """
        Dispense drug to a patient.
        Returns confirmation string or raises ValueError.
        """
        if quantity <= 0:
            raise ValueError("Quantity must be positive")
        if quantity > self.stock:
            raise ValueError(
                f"Insufficient stock. Available: {self.stock}"
            )
        self.stock -= quantity
        self.dispense_log.append((patient_name, quantity))
        return f"Dispensed {quantity}x {self.name} to {patient_name}"

    def needs_reorder(self, reorder_level=50):
        """Returns True if stock is below the reorder level."""
        return self.stock < reorder_level

    def info(self):
        """Returns a formatted drug information string."""
        controlled = "⚠️  CONTROLLED" if self.is_controlled else "✓ OTC"
        return (
            f"\n{'─'*40}\n"
            f"  Drug        : {self.name} {self.dose_mg}mg\n"
            f"  Indication  : {self.indication}\n"
            f"  Status      : {controlled}\n"
            f"  Stock       : {self.stock} units\n"
            f"  Formulary   : {Drug.formulary_name}\n"
            f"{'─'*40}"
        )


# --- Creating objects (instances) ---
metformin  = Drug("Metformin",  500, "Type 2 Diabetes")
tramadol   = Drug("Tramadol",   50,  "Moderate-severe pain", is_controlled=True)
amoxicillin = Drug("Amoxicillin", 500, "Bacterial infections", stock=100)

# Each object has its OWN instance attributes
print(f"Metformin dose  : {metformin.dose_mg}mg")
print(f"Tramadol dose   : {tramadol.dose_mg}mg")

# All objects share the SAME class attribute
print(f"\nTotal drugs     : {Drug.total_drugs}")   # 3
print(f"Formulary       : {metformin.formulary_name}")
print(f"Same formulary? : {metformin.formulary_name == tramadol.formulary_name}")

# --- Using instance methods ---
metformin.add_stock(200)
print(f"\n{metformin.info()}")

print(metformin.dispense(30, "Victor Okolie"))
print(metformin.dispense(20, "Amaka Obi"))

try:
    print(metformin.dispense(500, "Chidi Eze"))  # exceeds stock
except ValueError as e:
    print(f"Error: {e}")

print(f"\nMetformin dispense log: {metformin.dispense_log}")
print(f"Needs reorder (level 50)? {metformin.needs_reorder(50)}")
print(f"Needs reorder (level 200)? {metformin.needs_reorder(200)}")

# --- Class attribute vs instance attribute ---
print(f"\nDrug.total_drugs     : {Drug.total_drugs}")
print(f"metformin.total_drugs: {metformin.total_drugs}")  # same thing
    `,

    commonMistakes: [
      {
        mistake: "Forgetting self as the first parameter of methods",
        wrong:   "def add_stock(quantity):\n    self.stock += quantity  # NameError",
        right:   "def add_stock(self, quantity):\n    self.stock += quantity",
        explanation: "Every instance method must have self as its first parameter. Python passes the object automatically, but you must declare the parameter.",
      },
      {
        mistake: "Accessing an attribute that was never created",
        wrong:   "drug = Drug('Aspirin', 325, 'Pain')\nprint(drug.price)  # AttributeError",
        right:   "Only access attributes defined in __init__ or set by a method.",
        explanation: "Objects only have the attributes explicitly created in __init__ or added by a method. Accessing anything else raises AttributeError.",
      },
      {
        mistake: "Modifying class attributes through an instance",
        wrong:   "metformin.total_drugs = 0  # creates a new INSTANCE attribute",
        right:   "Drug.total_drugs = 0       # modifies the CLASS attribute",
        explanation: "Setting drug.class_attr = value does not change the class attribute — it creates a NEW instance attribute that shadows it. Always modify class attributes through the class name.",
      },
      {
        mistake: "Calling __init__ manually",
        wrong:   "drug.__init__('Aspirin', 325)  # wrong",
        right:   "drug = Drug('Aspirin', 325)     # correct — Python calls __init__",
        explanation: "__init__ is called automatically when you create an instance. Never call it directly.",
      },
    ],

    exercises: [
      "Create a Patient class with instance attributes: name, age, weight_kg, height_m, conditions (list), medications (list). Write methods: add_condition(condition), add_medication(drug, dose), calculate_bmi(), is_high_risk() (returns True if age > 65 or BMI > 30 or len(conditions) > 2), and clinical_summary() that returns a formatted string.",
      "Add a class attribute to Drug called all_drugs (a list). In __init__, append self to all_drugs. Add a class method (use @classmethod with cls) that returns all drugs below a given stock level. Test with 5 Drug objects.",
      "Create a Pharmacy class that contains a list of Drug objects and a list of Patient objects. Add methods: add_drug(), add_patient(), find_drug(name), find_patient(name), and inventory_report() that prints all drugs with their stock levels.",
      "Extend your Week 2 inventory project by converting the drug dictionary into proper Drug class instances. Show that the behaviour is identical but the code is now more organised and readable.",
    ],

    resources: [
      {
        objective: "Understand what Object-Oriented Programming is and why it matters",
        items: [
          {
            title:    "Real Python — Object-Oriented Programming (OOP) in Python 3",
            url:      "https://realpython.com/python3-object-oriented-programming/",
            type:     "article",
            note:     "The best free introduction to OOP in Python. Covers the why before the how.",
          },
          {
            title:    "CS50P Lecture 8 — Object-Oriented Programming (Video)",
            url:      "https://cs50.harvard.edu/python/2022/weeks/8/",
            type:     "video",
            duration: "~2 hrs",
            note:     "Harvard's treatment of OOP is excellent — builds from scratch with real examples.",
          },
        ],
      },
      {
        objective: "Define a class with __init__ and create instances from it",
        items: [
          {
            title:    "Real Python — Classes and Instances",
            url:      "https://realpython.com/python3-object-oriented-programming/#define-a-class-in-python",
            type:     "article",
            note:     "Specific section on class definition, __init__, and creating instances.",
          },
          {
            title:    "Python Docs — Classes",
            url:      "https://docs.python.org/3/tutorial/classes.html",
            type:     "reference",
            note:     "Official Python tutorial on classes — authoritative and comprehensive.",
          },
        ],
      },
      {
        objective: "Distinguish between instance attributes and class attributes",
        items: [
          {
            title:    "Real Python — Class vs Instance Variables",
            url:      "https://realpython.com/python3-object-oriented-programming/#class-and-instance-attributes",
            type:     "article",
            note:     "Clear explanation of the difference with examples showing how they behave differently.",
          },
          {
            title:    "Corey Schafer — OOP Part 1: Classes and Instances (Video)",
            url:      "https://www.youtube.com/watch?v=ZDa-Z5JzLYM",
            type:     "video",
            duration: "~20 mins",
            note:     "Part 1 of the best OOP tutorial series on YouTube. Watch all 6 parts this week.",
          },
        ],
      },
      {
        objective: "Write instance methods that operate on object data",
        items: [
          {
            title:    "Real Python — Instance Methods",
            url:      "https://realpython.com/python3-object-oriented-programming/#instance-methods",
            type:     "article",
            note:     "Focused explanation of instance methods, self, and how methods differ from functions.",
          },
          {
            title:    "Corey Schafer — OOP Part 2: Class Variables (Video)",
            url:      "https://www.youtube.com/watch?v=BJ-VvGyQxho",
            type:     "video",
            duration: "~18 mins",
            note:     "Covers class vs instance variables with clear visual examples.",
          },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 12 — Dunder Methods, classmethods, staticmethods
  // ============================================================
  {
    id: "W3D2", week: 3, day: 2, phase: 1,
    phaseTitle: "Python Mastery",
    date: "2026-06-30",
    type: "lesson",
    topic: "OOP Part 2: Dunder Methods, @classmethod & @staticmethod",
    duration: "2–3 hours",

    objectives: [
      "Implement __str__ and __repr__ for readable object output",
      "Use key dunder methods: __len__, __eq__, __lt__, __contains__",
      "Distinguish between instance methods, class methods, and static methods",
      "Use @classmethod as an alternative constructor",
    ],

    introduction: `
Yesterday you built the skeleton of a class.
Today you add the features that make your objects 
feel like natural Python — not bolted-on code.

Dunder methods (double-underscore methods) are 
Python's protocol for making custom objects 
integrate with built-in Python operations.

When you type print(my_object), Python calls 
my_object.__str__(). When you type len(my_object), 
Python calls my_object.__len__(). When you sort 
a list of objects, Python calls __lt__() to compare.

This is how the pandas DataFrame knows how to 
display itself in a Jupyter notebook. This is how 
scikit-learn models know how to compare themselves.
This is how Python's own int, str, and list types 
respond to +, -, *, len(), and print().

Learning dunders means you can build objects that 
behave indistinguishably from Python's own built-in 
types — and that is a mark of professional Python.
    `,

    mentalModel: `
MENTAL MODEL — "The Pharmacy System Protocol"

In a pharmacy, every drug form has a standard 
protocol — a set of procedures it must support:
  - How to read the label (str)
  - How to count units (len)
  - How to determine if two drugs are the same (eq)
  - How to rank by strength (lt)

Dunder methods are Python's version of this protocol.
By implementing them, your object "speaks Python" — 
it works with print(), len(), ==, sorted(), and 
the in operator naturally.

@classmethod is like a specialist dispensing protocol 
that works at the PHARMACY level, not the drug level.
It creates or manages Drug objects from outside.

@staticmethod is a utility function that lives 
inside the class for organisational purposes, 
but does not need access to any specific drug.
    `,

    explanation: `
KEY DUNDER METHODS
==================
__str__(self)
  Called by print() and str()
  Should return a human-readable string
  → "Metformin 500mg (Stock: 200)"

__repr__(self)
  Called in the Python console and by repr()
  Should return an unambiguous developer string
  → "Drug(name='Metformin', dose_mg=500, stock=200)"
  Rule: repr should ideally allow you to recreate the object

__len__(self)
  Called by len(obj)
  Must return an integer
  → len(drug) could return drug.stock

__eq__(self, other)
  Called by == operator
  → drug1 == drug2 checks if names match

__lt__(self, other)
  Called by < and used by sorted()
  → sorted(drugs) sorts by dose_mg

__contains__(self, item)
  Called by the in operator on this object
  → "Aspirin" in formulary

__add__(self, other)
  Called by + operator
  → drug1 + drug2 could combine their stock

THREE TYPES OF METHODS
=======================
Instance method  → def method(self, ...):
  Operates on a specific instance
  Most common type

Class method     → @classmethod + def method(cls, ...):
  Operates on the CLASS itself
  cls is the class, not an instance
  Common use: alternative constructors

Static method    → @staticmethod + def method(...):
  No self, no cls
  Just a utility function that belongs in the class
  Use when the function is related but needs no object data

ALTERNATIVE CONSTRUCTORS WITH @classmethod
==========================================
class Drug:
    @classmethod
    def from_dict(cls, data_dict):
        return cls(data_dict["name"], data_dict["dose"])

    @classmethod
    def from_csv_row(cls, row_string):
        parts = row_string.split(",")
        return cls(parts[0].strip(), int(parts[1].strip()))

This lets you create objects from different data 
sources without needing multiple __init__ signatures.
    `,

    clinicalConnection: `
CLINICAL CONNECTION

__repr__ is what saves you during debugging:

Without __repr__:
  print(my_drug)  → <__main__.Drug object at 0x7f3a1b2c>
  (useless — tells you nothing)

With __repr__:
  print(my_drug)  → Drug(name='Metformin', dose_mg=500, stock=150)
  (immediately useful)

In data science, when you have a list of 1000 
patient objects and need to inspect one, __repr__ 
is the difference between understanding your data 
instantly and spending 10 minutes guessing.

@classmethod from_dict() is exactly how you will 
create objects from API responses and CSV rows:

  api_response = {"name": "Metformin", "dose_mg": 500}
  drug = Drug.from_dict(api_response)

This pattern is used constantly in production 
data pipelines.
    `,

    example: `
# ── Day 12 Complete Example ──────────────────────────────

import functools

@functools.total_ordering   # auto-generates __le__, __gt__, __ge__ from __eq__ + __lt__
class Drug:
    """Drug with full dunder method support."""

    all_drugs = []   # class attribute

    def __init__(self, name, dose_mg, stock=0, price_ngn=0):
        self.name      = name
        self.dose_mg   = dose_mg
        self.stock     = stock
        self.price_ngn = price_ngn
        Drug.all_drugs.append(self)

    # --- DUNDER: human-readable string ---
    def __str__(self):
        return f"{self.name} {self.dose_mg}mg (Stock: {self.stock})"

    # --- DUNDER: developer-readable string ---
    def __repr__(self):
        return (f"Drug(name={self.name!r}, dose_mg={self.dose_mg}, "
                f"stock={self.stock}, price_ngn={self.price_ngn})")

    # --- DUNDER: len(drug) = stock level ---
    def __len__(self):
        return self.stock

    # --- DUNDER: drug1 == drug2 (by name, case-insensitive) ---
    def __eq__(self, other):
        if not isinstance(other, Drug):
            return NotImplemented
        return self.name.lower() == other.name.lower()

    # --- DUNDER: drug1 < drug2 (by dose) ---
    def __lt__(self, other):
        if not isinstance(other, Drug):
            return NotImplemented
        return self.dose_mg < other.dose_mg

    # --- DUNDER: "Metformin" in formulary ---
    def __contains__(self, drug_name):
        # Used on a Formulary class — see below
        return drug_name.lower() == self.name.lower()

    # --- DUNDER: drug1 + drug2 = combined stock ---
    def __add__(self, other):
        if not isinstance(other, Drug):
            return NotImplemented
        combined = Drug(f"{self.name}+{other.name}",
                        self.dose_mg, self.stock + other.stock)
        return combined

    # --- @classmethod: alternative constructors ---
    @classmethod
    def from_dict(cls, data):
        """Create a Drug from a dictionary (e.g. API response)."""
        return cls(
            name      = data["name"],
            dose_mg   = data["dose_mg"],
            stock     = data.get("stock", 0),
            price_ngn = data.get("price_ngn", 0)
        )

    @classmethod
    def from_csv_row(cls, row):
        """Create a Drug from a CSV row string."""
        parts = [p.strip() for p in row.split(",")]
        return cls(parts[0], int(parts[1]), int(parts[2]), int(parts[3]))

    @classmethod
    def low_stock_alert(cls, threshold=50):
        """Return all Drug instances below threshold."""
        return [d for d in cls.all_drugs if d.stock < threshold]

    # --- @staticmethod: utility, no self or cls needed ---
    @staticmethod
    def is_valid_dose(dose_mg):
        """Check if dose is within universally safe range."""
        return 0 < dose_mg <= 2000

    @staticmethod
    def nafdac_format(number):
        """Validate NAFDAC number format."""
        import re
        return bool(re.match(r'^[A-Z]\d{0,2}-\d{4,5}$', number))


# --- Using the class ---
metformin  = Drug("Metformin",  500, stock=150, price_ngn=1500)
tramadol   = Drug("Tramadol",   50,  stock=30,  price_ngn=1200)
aspirin    = Drug("Aspirin",    325, stock=200, price_ngn=800)
ibuprofen  = Drug("Ibuprofen",  400, stock=40,  price_ngn=900)

# __str__ via print
print(metformin)        # Metformin 500mg (Stock: 150)

# __repr__ directly
print(repr(tramadol))   # Drug(name='Tramadol', dose_mg=50, ...)

# __len__
print(f"Stock: {len(metformin)}")    # 150

# __eq__
drug_copy = Drug("metformin", 250)   # same name, different dose
print(f"Same drug? {metformin == drug_copy}")    # True (case-insensitive)

# __lt__ and sorting
all_drugs = [metformin, tramadol, aspirin, ibuprofen]
sorted_by_dose = sorted(all_drugs)
print("\nSorted by dose:")
for d in sorted_by_dose:
    print(f"  {d}")

# @classmethod: from_dict
api_data = {"name": "Lisinopril", "dose_mg": 10, "stock": 80, "price_ngn": 1800}
lisinopril = Drug.from_dict(api_data)
print(f"\nFrom dict: {lisinopril}")

# @classmethod: from_csv_row
csv_row = "Omeprazole, 20, 60, 2200"
omeprazole = Drug.from_csv_row(csv_row)
print(f"From CSV : {omeprazole}")

# @classmethod: low stock alert
print("\nLow stock alert (threshold 50):")
for d in Drug.low_stock_alert(50):
    print(f"  ⚠️  {d}")

# @staticmethod: no instance needed
print(f"\nValid dose 500mg  : {Drug.is_valid_dose(500)}")   # True
print(f"Valid dose 5000mg : {Drug.is_valid_dose(5000)}")   # False
print(f"Valid NAFDAC A4-1234: {Drug.nafdac_format('A4-1234')}")  # True
    `,

    commonMistakes: [
      {
        mistake: "__str__ returning a non-string",
        wrong:   "def __str__(self):\n    return self.dose_mg   # int, not string",
        right:   "def __str__(self):\n    return f'{self.name} {self.dose_mg}mg'",
        explanation: "__str__ must return a string. Returning any other type raises TypeError when Python calls it.",
      },
      {
        mistake: "Using self inside a @staticmethod",
        wrong:   "@staticmethod\ndef validate(self, dose):  # wrong — no self",
        right:   "@staticmethod\ndef validate(dose):        # no self parameter",
        explanation: "Static methods have no access to the instance or class. Remove self entirely. If you need self, use a regular instance method.",
      },
      {
        mistake: "Using @classmethod when you need an instance method",
        wrong:   "@classmethod\ndef dispense(cls, qty):  # cls is the class, not an instance",
        right:   "def dispense(self, qty):  # self is the specific drug object",
        explanation: "Use @classmethod when you need to work with the CLASS itself (e.g. creating instances, accessing class attributes). Use regular methods when you need data from a SPECIFIC instance.",
      },
    ],

    exercises: [
      "Add __str__, __repr__, __len__, __eq__, and __lt__ to your Patient class from Day 11. Make __len__ return the number of medications, __eq__ compare by patient ID, and __lt__ compare by age. Test that sorted(patient_list) works.",
      "Add a @classmethod from_dict() to your Drug class that creates a Drug from a dictionary. Add a @classmethod bulk_create(cls, list_of_dicts) that creates multiple Drug objects at once. Test with 5 drug dictionaries.",
      "Add a @staticmethod calculate_crcl(age, weight, creatinine, is_female=False) to your Patient class that implements the Cockcroft-Gault equation. This is a pure calculation — no patient data needed, hence static.",
      "Write a Formulary class that wraps a list of Drug objects. Implement __contains__ so you can write 'if \"Metformin\" in my_formulary:', __len__ to return the number of drugs, and __iter__ so you can write 'for drug in my_formulary:'.",
    ],

    resources: [
      {
        objective: "Implement __str__ and __repr__ for readable object output",
        items: [
          {
            title:    "Real Python — Python __str__ and __repr__",
            url:      "https://realpython.com/python-repr-vs-str/",
            type:     "article",
            note:     "Clear explanation of the difference between __str__ and __repr__ with examples.",
          },
          {
            title:    "Corey Schafer — OOP Part 4: Dunder/Magic Methods (Video)",
            url:      "https://www.youtube.com/watch?v=3ohzBxoFHAY",
            type:     "video",
            duration: "~20 mins",
            note:     "Best video introduction to dunder methods including __str__ and __repr__.",
          },
        ],
      },
      {
        objective: "Use key dunder methods: __len__, __eq__, __lt__, __contains__",
        items: [
          {
            title:    "Python Docs — Data Model: Special Method Names",
            url:      "https://docs.python.org/3/reference/datamodel.html#special-method-names",
            type:     "reference",
            note:     "The complete official reference for every dunder method. Bookmark this.",
          },
          {
            title:    "Real Python — Python's Magic Methods Guide",
            url:      "https://realpython.com/python-magic-methods/",
            type:     "article",
            note:     "Practical guide covering the most useful dunder methods with real examples.",
          },
        ],
      },
      {
        objective: "Distinguish between instance methods, class methods, and static methods",
        items: [
          {
            title:    "Real Python — Python's classmethod and staticmethod",
            url:      "https://realpython.com/instance-class-and-static-methods-demystified/",
            type:     "article",
            note:     "The definitive free guide — compares all three with side-by-side examples.",
          },
          {
            title:    "Corey Schafer — OOP Part 3: classmethods and staticmethods (Video)",
            url:      "https://www.youtube.com/watch?v=rq8cL2XMM5M",
            type:     "video",
            duration: "~17 mins",
            note:     "Crystal-clear explanation of when and why to use each type.",
          },
        ],
      },
      {
        objective: "Use @classmethod as an alternative constructor",
        items: [
          {
            title:    "Real Python — Alternative Constructors with @classmethod",
            url:      "https://realpython.com/instance-class-and-static-methods-demystified/#class-methods",
            type:     "article",
            note:     "Section specifically on from_dict() and from_string() patterns.",
          },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 13 — Inheritance & Polymorphism
  // ============================================================
  {
    id: "W3D3", week: 3, day: 3, phase: 1,
    phaseTitle: "Python Mastery",
    date: "2026-07-01",
    type: "lesson",
    topic: "OOP Part 3: Inheritance & Polymorphism",
    duration: "2–3 hours",

    objectives: [
      "Create child classes that inherit from a parent class",
      "Override parent methods to specialise child behaviour",
      "Use super() to extend parent methods without replacing them",
      "Understand polymorphism and why it makes code extensible",
    ],

    introduction: `
Inheritance is the OOP feature that prevents 
the most code duplication.

Every pharmaceutical drug shares certain properties:
name, dose, stock, the ability to be dispensed.
But specific drug categories have additional 
properties and behaviours:

Controlled drugs need: a prescription log, 
a DEA-equivalent number, special dispensing rules.

Antibiotics need: antibiotic class, days of therapy, 
counselling about completing the course.

Vaccines need: storage temperature, doses required, 
cold chain management.

Without inheritance, you would duplicate the 
common drug logic in every class. With inheritance, 
you write the common logic ONCE in a parent class, 
then each child class adds only what is unique to it.

This is also exactly how sklearn is structured:
  BaseEstimator (parent) → provides fit(), get_params()
  LinearRegression (child) → adds its specific maths
  RandomForest (child) → adds its specific maths

Every sklearn model you will ever use inherits 
from BaseEstimator. Understanding inheritance means 
you understand the structure of the most important 
machine learning library in Python.
    `,

    mentalModel: `
MENTAL MODEL — "The Drug Classification System"

The British National Formulary (BNF) classifies 
drugs in a hierarchy. At the top: Drug. Beneath 
that: Analgesic, Antibiotic, Antidiabetic. 
Beneath those: NSAIDs, Opioids; 
Beta-lactams, Macrolides; etc.

Each level inherits everything from the level above 
and adds its own specific properties.

An NSAID is a Drug (inherits all drug behaviour) 
AND an Analgesic (inherits analgesic properties) 
AND has its own specific properties 
(GI risk, renal effects).

Python inheritance mirrors this hierarchy exactly.
The child IS A parent — with extras.
    `,

    explanation: `
DEFINING INHERITANCE
====================
class ChildClass(ParentClass):
    def __init__(self, parent_params, extra_param):
        super().__init__(parent_params)  # parent setup
        self.extra_param = extra_param   # child-specific

super() calls the parent class.
super().__init__() runs the parent's __init__ 
to set up the inherited attributes.

OVERRIDING METHODS
==================
If the child defines a method with the SAME NAME 
as a parent method, it REPLACES the parent version.

class Drug:
    def dispense(self, qty, patient):
        self.stock -= qty

class ControlledDrug(Drug):
    def dispense(self, qty, patient, prescription):
        # Override — adds prescription check
        if not prescription:
            raise PermissionError("Prescription required")
        super().dispense(qty, patient)   # run parent's version too
        self.log_controlled_dispense(qty, patient, prescription)

CALLING super()
===============
super().method() calls the parent's version of 
a method from within the child's override.
This lets you EXTEND the parent's behaviour 
rather than completely replace it.

POLYMORPHISM
============
Different objects, same method name, different 
behaviour — but all work correctly when called 
the same way.

for drug in [regular_drug, controlled_drug, antibiotic]:
    drug.dispense(qty, patient)   # each responds appropriately

isinstance(obj, ClassName)  → True if obj is an instance 
                              of ClassName OR any subclass
issubclass(Child, Parent)   → True if Child inherits from Parent
    `,

    clinicalConnection: `
CLINICAL CONNECTION

Polymorphism is what lets you write:

  for drug in patient.medications:
      label = drug.generate_label()
      print(label)

Even though patient.medications contains a mix 
of Drug, ControlledDrug, and Antibiotic objects, 
each one responds to generate_label() correctly 
because they all have that method — just with 
different implementations.

This is how you will build your AI health agent's 
response handler. Each query type (drug info, 
interaction check, dose calculation) will be a 
subclass of a base Query class, each with its own 
process() method. The main loop just calls 
query.process() — polymorphism handles the rest.
    `,

    example: `
# ── Day 13 Complete Example ──────────────────────────────

import datetime

# --- PARENT CLASS ---
class Drug:
    """Base class for all pharmaceutical drugs."""

    def __init__(self, name, dose_mg, indication, stock=0):
        self.name        = name
        self.dose_mg     = dose_mg
        self.indication  = indication
        self.stock       = stock
        self._log        = []    # private — use _ prefix convention

    def dispense(self, qty, patient_name):
        """Standard dispensing — no special requirements."""
        if qty > self.stock:
            raise ValueError(f"Stock insufficient: {self.stock} available")
        self.stock -= qty
        entry = {
            "date":    datetime.date.today().isoformat(),
            "patient": patient_name,
            "qty":     qty,
        }
        self._log.append(entry)
        return f"✓ Dispensed {qty}x {self.name} to {patient_name}"

    def generate_label(self):
        return (f"Drug: {self.name} {self.dose_mg}mg | "
                f"Indication: {self.indication}")

    def __str__(self):
        return f"{self.name} {self.dose_mg}mg"


# --- CHILD CLASS 1: ControlledDrug ---
class ControlledDrug(Drug):
    """
    A Drug that requires a prescription and generates
    a legal controlled substance log.
    """
    def __init__(self, name, dose_mg, indication,
                 schedule_class, stock=0):
        super().__init__(name, dose_mg, indication, stock)
        self.schedule_class    = schedule_class
        self.controlled_log    = []

    def dispense(self, qty, patient_name, prescription_ref):
        """Override: adds prescription check and controlled log."""
        if not prescription_ref:
            raise PermissionError(
                f"{self.name} is a controlled drug. "
                f"Valid prescription required."
            )
        # Call parent's dispense to handle stock deduction
        result = super().dispense(qty, patient_name)

        # Extra controlled drug logging
        self.controlled_log.append({
            "date":         datetime.date.today().isoformat(),
            "patient":      patient_name,
            "qty":          qty,
            "prescription": prescription_ref,
            "schedule":     self.schedule_class,
        })
        return f"[CONTROLLED S{self.schedule_class}] {result} | Rx: {prescription_ref}"

    def generate_label(self):
        base = super().generate_label()
        return f"{base} | ⚠️ SCHEDULE {self.schedule_class} CONTROLLED"

    def print_controlled_log(self):
        print(f"\n=== Controlled Log: {self.name} ===")
        for entry in self.controlled_log:
            print(f"  {entry['date']} | {entry['patient']} | "
                  f"{entry['qty']} units | Rx: {entry['prescription']}")


# --- CHILD CLASS 2: Antibiotic ---
class Antibiotic(Drug):
    """A Drug with antibiotic-specific counselling requirements."""

    def __init__(self, name, dose_mg, indication,
                 antibiotic_class, duration_days, stock=0):
        super().__init__(name, dose_mg, indication, stock)
        self.antibiotic_class = antibiotic_class
        self.duration_days    = duration_days

    def dispense(self, qty, patient_name):
        result = super().dispense(qty, patient_name)
        counselling = self.get_counselling()
        return f"{result}\n  📋 Counselling: {counselling}"

    def get_counselling(self):
        return (f"Complete the full {self.duration_days}-day course "
                f"of {self.name}. Do not stop early even if you feel better.")

    def generate_label(self):
        base = super().generate_label()
        return f"{base} | Class: {self.antibiotic_class} | Duration: {self.duration_days} days"


# --- CHILD CLASS 3: OTCDrug ---
class OTCDrug(Drug):
    """A Drug available over the counter with a shelf location."""

    def __init__(self, name, dose_mg, indication,
                 shelf_location, stock=0):
        super().__init__(name, dose_mg, indication, stock)
        self.shelf_location = shelf_location

    def generate_label(self):
        base = super().generate_label()
        return f"{base} | OTC — Shelf: {self.shelf_location}"


# --- Creating objects ---
tramadol = ControlledDrug(
    "Tramadol", 50, "Moderate-severe pain",
    schedule_class=2, stock=100
)
amoxicillin = Antibiotic(
    "Amoxicillin", 500, "Bacterial infections",
    antibiotic_class="Aminopenicillin",
    duration_days=7, stock=80
)
aspirin = OTCDrug(
    "Aspirin", 325, "Pain / Antiplatelet",
    shelf_location="Aisle 3, Shelf B", stock=200
)

# --- Dispensing ---
print(tramadol.dispense(10, "Victor Okolie", "RX-2026-001"))
print()
print(amoxicillin.dispense(21, "Amaka Obi"))
print()
print(aspirin.dispense(30, "Chidi Eze"))

tramadol.print_controlled_log()

# --- POLYMORPHISM: one loop, all drug types ---
all_drugs = [tramadol, amoxicillin, aspirin]
print("\n=== Dispensing Labels ===")
for drug in all_drugs:
    print(f"  {drug.generate_label()}")

# --- isinstance checks ---
print(f"\nTramadol is Drug?           {isinstance(tramadol, Drug)}")
print(f"Tramadol is ControlledDrug? {isinstance(tramadol, ControlledDrug)}")
print(f"Aspirin is ControlledDrug?  {isinstance(aspirin, ControlledDrug)}")
print(f"ControlledDrug is Drug?     {issubclass(ControlledDrug, Drug)}")
    `,

    commonMistakes: [
      {
        mistake: "Forgetting to call super().__init__()",
        wrong:   "class Child(Parent):\n    def __init__(self, extra):\n        self.extra = extra  # parent attributes never set!",
        right:   "class Child(Parent):\n    def __init__(self, parent_arg, extra):\n        super().__init__(parent_arg)\n        self.extra = extra",
        explanation: "Without super().__init__(), the parent's attributes are never created. Accessing self.name (set by the parent) will raise AttributeError.",
      },
      {
        mistake: "Overriding a method without calling super() when you need both behaviours",
        wrong:   "def dispense(self, qty, patient, rx):\n    # completely replaces parent logic",
        right:   "def dispense(self, qty, patient, rx):\n    result = super().dispense(qty, patient)  # parent logic\n    self.extra_logging()  # child addition",
        explanation: "Overriding replaces the parent method entirely. If you need the parent's logic too, call super().method() inside the override.",
      },
      {
        mistake: "Checking type with type() instead of isinstance()",
        wrong:   "if type(drug) == Drug:  # False for ControlledDrug even though it IS a Drug",
        right:   "if isinstance(drug, Drug):  # True for Drug and all subclasses",
        explanation: "type() checks the exact class. isinstance() checks the class AND all subclasses. Always use isinstance() for type checking.",
      },
    ],

    exercises: [
      "Create a Vaccine class that inherits from Drug. Add: target_disease, doses_required (int), storage_temp_celsius (float), and cold_chain_intact (bool). Override dispense() to check cold_chain_intact — if False, raise a ColdChainViolationError. Add a generate_label() that includes storage requirements.",
      "Create an IV (intravenous) Drug class that inherits from Drug. Add: concentration_mg_per_ml, volume_ml, route='IV'. Override dispense() to calculate and display the volume to draw up. Override generate_label() to include dilution instructions.",
      "Write a function process_prescription(drug_list, patient_name) that accepts a mixed list of Drug, ControlledDrug, Antibiotic, and OTCDrug objects. It should call dispense() on each appropriately (controlled ones need a prescription_ref). Demonstrate polymorphism explicitly.",
      "Add a MixedFormulary class that stores all four drug types. Implement __iter__ so you can loop over it, __len__ for the count, and a method controlled_drugs_only() that returns only ControlledDrug instances using isinstance().",
    ],

    resources: [
      {
        objective: "Create child classes that inherit from a parent class",
        items: [
          {
            title:    "Real Python — Inheritance and Composition in Python OOP",
            url:      "https://realpython.com/inheritance-composition-python/",
            type:     "article",
            note:     "The most thorough free article on Python inheritance. Covers all scenarios.",
          },
          {
            title:    "CS50P Lecture 8 — OOP: Inheritance (Video)",
            url:      "https://cs50.harvard.edu/python/2022/weeks/8/",
            type:     "video",
            duration: "~2 hrs",
            note:     "Covers inheritance clearly with real examples built from scratch.",
          },
        ],
      },
      {
        objective: "Override parent methods to specialise child behaviour",
        items: [
          {
            title:    "Real Python — Method Overriding in Python",
            url:      "https://realpython.com/inheritance-composition-python/#overriding-methods",
            type:     "article",
            note:     "Specific section on overriding with examples of when and why.",
          },
          {
            title:    "Corey Schafer — OOP Part 5: Inheritance (Video)",
            url:      "https://www.youtube.com/watch?v=RSl87lqOXDE",
            type:     "video",
            duration: "~20 mins",
            note:     "Clear examples of inheritance and method overriding.",
          },
        ],
      },
      {
        objective: "Use super() to extend parent methods without replacing them",
        items: [
          {
            title:    "Real Python — super() in Python",
            url:      "https://realpython.com/python-super/",
            type:     "article",
            note:     "Deep dive into super() — covers single and multiple inheritance scenarios.",
          },
          {
            title:    "Python Docs — super()",
            url:      "https://docs.python.org/3/library/functions.html#super",
            type:     "reference",
            note:     "Official documentation — concise and authoritative.",
          },
        ],
      },
      {
        objective: "Understand polymorphism and why it makes code extensible",
        items: [
          {
            title:    "Real Python — Polymorphism in Python",
            url:      "https://realpython.com/inheritance-composition-python/#polymorphism-in-python",
            type:     "article",
            note:     "Section on polymorphism with clear examples of the same interface, different behaviour.",
          },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 14 — Exception Handling
  // ============================================================
  {
    id: "W3D4", week: 3, day: 4, phase: 1,
    phaseTitle: "Python Mastery",
    date: "2026-07-02",
    type: "lesson",
    topic: "Exception Handling: try, except, else, finally & Custom Exceptions",
    duration: "2–3 hours",

    objectives: [
      "Handle exceptions with try/except/else/finally correctly",
      "Catch specific exception types rather than all exceptions",
      "Create and raise custom exceptions for domain-specific errors",
      "Write exception-safe code that fails gracefully",
    ],

    introduction: `
Real programs deal with the unexpected: files that 
do not exist, network timeouts, invalid user input, 
division by zero, missing dictionary keys.

Exception handling is what separates code that 
CRASHES when something goes wrong from code that 
HANDLES problems gracefully and tells you exactly 
what went wrong.

In data science, you will hit exceptions constantly:
  KeyError        → accessing a missing column name
  ValueError      → converting "N/A" to int
  FileNotFoundError → wrong path to a CSV
  ConnectionError → API is down during data fetch
  TypeError       → wrong data type in a calculation

Your AI health agent will be handling patient queries 
in real time. One unhandled exception cannot crash 
the entire service. Exception handling is what keeps 
it running and logging errors for later debugging.

Professional code never shows users a raw Python 
traceback. It catches the exception, logs it, and 
returns a meaningful message.
    `,

    mentalModel: `
MENTAL MODEL — "The Adverse Event Protocol"

In pharmacy practice, an adverse drug event is not 
a system failure — it is a known risk that has a 
defined response protocol:
  - Identify the event (catch the exception)
  - Classify it (which type of exception?)
  - Respond appropriately (handle it)
  - Document it (log it)
  - Continue patient care (else / finally block)

try/except mirrors this exactly:
  try:       → attempt the action
  except:    → identify and handle the problem
  else:      → if no problem occurred, do this
  finally:   → always do this (cleanup, logging)

Custom exceptions are like defining new event 
categories: InsufficientStockError is more 
informative than a generic ValueError.
It tells you exactly what kind of problem occurred.
    `,

    explanation: `
BASIC STRUCTURE
===============
try:
    # code that might raise an exception
except SpecificError as e:
    # handle that specific error
except AnotherError as e:
    # handle another type
except (ErrorA, ErrorB) as e:
    # handle multiple types the same way
except Exception as e:
    # catch-all (use sparingly — too broad)
else:
    # runs ONLY if NO exception was raised
finally:
    # ALWAYS runs — use for cleanup

THE EXCEPTION HIERARCHY
========================
BaseException
  └── Exception  (catch most things here)
        ├── ValueError     (wrong value or type)
        ├── TypeError      (wrong data type)
        ├── KeyError       (missing dict key)
        ├── IndexError     (list index out of range)
        ├── FileNotFoundError
        ├── AttributeError (missing attribute)
        ├── ZeroDivisionError
        ├── PermissionError
        └── RuntimeError   (general runtime problem)

RAISING EXCEPTIONS
==================
raise ValueError("Dose must be positive")
raise KeyError("Drug not found in formulary")

CUSTOM EXCEPTIONS
=================
class DrugNotFoundError(Exception):
    """Raised when a drug is not in the formulary."""
    pass

class InsufficientStockError(Exception):
    """Raised when requested quantity exceeds stock."""
    def __init__(self, drug_name, requested, available):
        self.drug_name  = drug_name
        self.requested  = requested
        self.available  = available
        super().__init__(
            f"Cannot dispense {requested}x {drug_name}. "
            f"Only {available} available."
        )

BEST PRACTICES
==============
1. Catch SPECIFIC exceptions, not bare except:
2. Never use except: pass — it hides bugs silently
3. Keep try blocks small — only the risky line
4. Use else for code that runs only on success
5. Use finally for cleanup (close files, DB connections)
6. Log exceptions — do not just print them
    `,

    clinicalConnection: `
CLINICAL CONNECTION

Exception handling directly models clinical risk 
management. Consider the parallels:

  DrugNotFoundError     → Drug not in formulary
  PrescriptionRequired  → Missing legal requirement
  InsufficientStock     → Cannot fill the prescription
  AllergyConflict       → Contraindication detected
  DoseTooHighError      → Dose exceeds safe maximum
  ColdChainViolation    → Storage requirement breached

Each one is a specific, named problem with a 
specific, appropriate response. That is precisely 
what custom exceptions give you — named, specific 
error categories with their own response protocols.

When your AI health agent queries the Claude API 
and the API returns an error, you need to handle:
  - anthropic.AuthenticationError → bad API key
  - anthropic.RateLimitError → too many requests
  - anthropic.APIConnectionError → no internet
  - anthropic.APIStatusError → server error

Each needs a different response. Specific exception 
handling is the only correct approach.
    `,

    example: `
# ── Day 14 Complete Example ──────────────────────────────

import datetime

# --- CUSTOM EXCEPTIONS ---
class PharmacyError(Exception):
    """Base exception for all pharmacy system errors."""
    pass

class DrugNotFoundError(PharmacyError):
    """Drug is not in the formulary."""
    def __init__(self, drug_name):
        self.drug_name = drug_name
        super().__init__(f"'{drug_name}' is not in the formulary.")

class InsufficientStockError(PharmacyError):
    """Requested quantity exceeds available stock."""
    def __init__(self, drug_name, requested, available):
        self.drug_name = drug_name
        self.requested = requested
        self.available = available
        super().__init__(
            f"Cannot dispense {requested}x {drug_name}. "
            f"Only {available} available."
        )

class PrescriptionRequiredError(PharmacyError):
    """Controlled drug dispensed without a prescription."""
    def __init__(self, drug_name):
        super().__init__(
            f"{drug_name} is a controlled substance. "
            f"A valid prescription number is required."
        )

class InvalidDoseError(PharmacyError):
    """Dose is outside safe therapeutic range."""
    def __init__(self, drug_name, dose, max_dose):
        super().__init__(
            f"Dose {dose}mg exceeds maximum {max_dose}mg for {drug_name}."
        )


# --- SAFE DISPENSE FUNCTION ---
FORMULARY = {
    "Metformin":  {"stock": 150, "max_daily_mg": 2000, "controlled": False, "dose_mg": 500},
    "Tramadol":   {"stock": 40,  "max_daily_mg": 400,  "controlled": True,  "dose_mg": 50},
    "Aspirin":    {"stock": 200, "max_daily_mg": 4000,  "controlled": False, "dose_mg": 325},
}

def safe_dispense(drug_name, qty, patient_name,
                  prescription_ref=None, log_file="dispense_log.txt"):
    """
    Safely dispenses a drug with full exception handling.

    Returns:
        Success message string

    Raises:
        DrugNotFoundError, InsufficientStockError,
        PrescriptionRequiredError, InvalidDoseError
    """
    try:
        # Check drug exists
        if drug_name not in FORMULARY:
            raise DrugNotFoundError(drug_name)

        drug       = FORMULARY[drug_name]
        daily_dose = drug["dose_mg"] * qty

        # Check controlled drug requirements
        if drug["controlled"] and not prescription_ref:
            raise PrescriptionRequiredError(drug_name)

        # Check dose safety
        if daily_dose > drug["max_daily_mg"]:
            raise InvalidDoseError(drug_name, daily_dose, drug["max_daily_mg"])

        # Check stock
        if qty > drug["stock"]:
            raise InsufficientStockError(drug_name, qty, drug["stock"])

        # All checks passed — perform dispense
        drug["stock"] -= qty
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
        log_entry = f"{timestamp} | {patient_name} | {drug_name} x{qty}\n"

    except DrugNotFoundError as e:
        print(f"❌ DRUG ERROR    : {e}")
        return None

    except PrescriptionRequiredError as e:
        print(f"⚠️  LEGAL ERROR  : {e}")
        return None

    except InvalidDoseError as e:
        print(f"⚠️  DOSE ERROR   : {e}")
        return None

    except InsufficientStockError as e:
        print(f"⚠️  STOCK ERROR  : {e}")
        print(f"   Available: {e.available}, Requested: {e.requested}")
        return None

    except PharmacyError as e:
        # Catch any other pharmacy-related error
        print(f"🔴 PHARMACY ERROR: {e}")
        return None

    except Exception as e:
        # Catch unexpected errors — log but do not swallow
        print(f"🚨 UNEXPECTED    : {type(e).__name__}: {e}")
        return None

    else:
        # Runs ONLY if no exception occurred
        success_msg = f"✓ Dispensed {qty}x {drug_name} to {patient_name}"
        print(success_msg)
        return success_msg

    finally:
        # ALWAYS runs — log every attempt (success or failure)
        print(f"   [LOG] Dispense attempt: {drug_name} x{qty} for {patient_name}")

# --- Testing every scenario ---
print("=== Dispense Scenarios ===\n")

print("1. Valid dispense:")
safe_dispense("Metformin", 30, "Victor Okolie")

print("\n2. Drug not in formulary:")
safe_dispense("Penicillin", 10, "Amaka Obi")

print("\n3. Controlled drug, no prescription:")
safe_dispense("Tramadol", 5, "Chidi Eze")

print("\n4. Controlled drug, with prescription:")
safe_dispense("Tramadol", 5, "Chidi Eze", prescription_ref="RX-2026-001")

print("\n5. Insufficient stock:")
safe_dispense("Tramadol", 100, "Ngozi Adeyemi", prescription_ref="RX-2026-002")

print("\n6. Dose too high:")
safe_dispense("Metformin", 10, "Victor Okolie")   # 10 x 500 = 5000mg > 2000mg

# --- Safe type conversion ---
def safe_parse_dose(raw_input):
    """Parse dose input with clear error handling."""
    try:
        dose = float(raw_input)
        if dose <= 0:
            raise ValueError("Dose must be a positive number")
        if dose > 2000:
            raise ValueError(f"Dose {dose}mg exceeds safe limit of 2000mg")
        return dose
    except ValueError as e:
        print(f"Invalid dose '{raw_input}': {e}")
        return None

print("\n=== Dose Parsing ===")
for test in ["500", "abc", "-100", "5000", "12.5"]:
    result = safe_parse_dose(test)
    if result:
        print(f"  '{test}' → {result}mg ✓")
    `,

    commonMistakes: [
      {
        mistake: "Using bare except: without specifying the exception type",
        wrong:   "try:\n    risky()\nexcept:\n    pass   # swallows ALL errors silently",
        right:   "try:\n    risky()\nexcept ValueError as e:\n    print(f'Value error: {e}')",
        explanation: "Bare except catches everything including KeyboardInterrupt and SystemExit. It hides bugs that should be fixed. Always catch specific exceptions.",
      },
      {
        mistake: "Putting too much code in the try block",
        wrong:   "try:\n    step1()\n    step2()\n    step3()\nexcept Exception as e:\n    print(e)  # which step failed?",
        right:   "# Keep try blocks to the minimum lines that might raise",
        explanation: "Large try blocks make it impossible to know which line caused the exception. Keep try blocks as small as possible.",
      },
      {
        mistake: "Not using the exception object's information",
        wrong:   "except InsufficientStockError:\n    print('Stock error')  # loses the details",
        right:   "except InsufficientStockError as e:\n    print(f'{e.drug_name}: {e.available} available')",
        explanation: "Custom exceptions can carry extra data. Always capture the exception with 'as e' and use its attributes.",
      },
      {
        mistake: "Using finally for logic that should only run on success",
        wrong:   "finally:\n    send_success_email()  # runs even after an error!",
        right:   "else:\n    send_success_email()   # only runs if no exception",
        explanation: "finally always runs regardless of whether an exception occurred. Use else for code that should only run on success.",
      },
    ],

    exercises: [
      "Create a full exception hierarchy for your pharmacy system: PharmacyError (base) → DrugNotFoundError, InsufficientStockError, AllergyConflictError, ExpiredDrugError, InvalidPatientError. Each custom exception must store relevant data as attributes and produce an informative error message.",
      "Write a function load_formulary(filepath) that reads a JSON file with try/except handling for: FileNotFoundError (file missing), json.JSONDecodeError (invalid JSON), KeyError (missing required field). Use else to confirm successful load and finally to print 'Load attempt complete'.",
      "Wrap your Week 2 inventory system's dispense() function in comprehensive exception handling. Every possible failure mode should raise a specific custom exception. Write a test script that deliberately triggers every exception type.",
      "Write a function safe_api_call(url, params) that uses requests to fetch data. Handle: requests.ConnectionError, requests.Timeout, requests.HTTPError (with different messages for 401, 404, 500 status codes). Use retry logic: if ConnectionError, wait 1 second and try again up to 3 times.",
    ],

    resources: [
      {
        objective: "Handle exceptions with try/except/else/finally correctly",
        items: [
          {
            title:    "Real Python — Python Exceptions: An Introduction",
            url:      "https://realpython.com/python-exceptions/",
            type:     "article",
            note:     "The most comprehensive free guide to Python exceptions. Covers all four clauses.",
          },
          {
            title:    "CS50P Lecture 3 — Exceptions (Video)",
            url:      "https://cs50.harvard.edu/python/2022/weeks/3/",
            type:     "video",
            duration: "~2 hrs",
            note:     "Harvard's approach to exceptions — builds understanding from first principles.",
          },
        ],
      },
      {
        objective: "Catch specific exception types rather than all exceptions",
        items: [
          {
            title:    "Python Docs — Built-in Exceptions",
            url:      "https://docs.python.org/3/library/exceptions.html",
            type:     "reference",
            note:     "Complete list of all built-in Python exceptions with descriptions. Bookmark this.",
          },
          {
            title:    "Real Python — Python Exception Hierarchy",
            url:      "https://realpython.com/python-exceptions/#the-exception-hierarchy",
            type:     "article",
            note:     "Section explaining the exception class hierarchy — important for understanding which to catch.",
          },
        ],
      },
      {
        objective: "Create and raise custom exceptions for domain-specific errors",
        items: [
          {
            title:    "Real Python — Creating Custom Exceptions in Python",
            url:      "https://realpython.com/python-custom-exceptions/",
            type:     "article",
            note:     "Step-by-step guide to designing and raising custom exception classes.",
          },
          {
            title:    "Python Docs — User-defined Exceptions",
            url:      "https://docs.python.org/3/tutorial/errors.html#user-defined-exceptions",
            type:     "reference",
            note:     "Official tutorial section on creating custom exceptions.",
          },
        ],
      },
      {
        objective: "Write exception-safe code that fails gracefully",
        items: [
          {
            title:    "Real Python — LBYL vs EAFP: Two Coding Styles",
            url:      "https://realpython.com/python-lbyl-vs-eafp/",
            type:     "article",
            note:     "Explains Python's preferred EAFP (Easier to Ask Forgiveness than Permission) style vs defensive LBYL.",
          },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 15 — PROJECT: Full OOP Pharmacy System
  // ============================================================
  {
    id: "W3D5", week: 3, day: 5, phase: 1,
    phaseTitle: "Python Mastery",
    date: "2026-07-03",
    type: "project",
    topic: "PROJECT: Full OOP Pharmacy Management System",
    duration: "5–6 hours",

    objectives: [
      "Design and build a complete OOP system from scratch",
      "Demonstrate inheritance, polymorphism, dunder methods, and custom exceptions",
      "Write production-quality code with docstrings and type hints",
      "Push the most complete Python project so far to GitHub",
    ],

    introduction: `
This is your most ambitious project yet.

Week 3 gave you the most powerful tools in Python:
classes, inheritance, polymorphism, dunder methods, 
and exception handling. Today you combine all of 
them into one cohesive system.

The standard for this project is high.
This is a portfolio piece — something you should 
be able to show to a technical interviewer or 
hiring manager and walk them through.

It should demonstrate that you can:
  1. Design a class hierarchy before writing code
  2. Use inheritance to avoid duplication
  3. Handle errors gracefully with custom exceptions
  4. Write self-documenting code (docstrings, type hints)
  5. Organise code into logical, importable modules
    `,

    mentalModel: `
MENTAL MODEL — "Build the Hospital, Not Just the Wards"

Do not jump into writing Drug or Patient classes.
Start at the top:

  What does a PHARMACY need?
    → A Formulary (collection of drugs)
    → A Patient Register
    → A dispensing system
    → Reporting

  What are the DRUG TYPES?
    → Drug (base)
    → ControlledDrug (child)
    → Antibiotic (child)
    → OTCDrug (child)

  What are the ERRORS that can occur?
    → DrugNotFoundError
    → InsufficientStockError
    → AllergyConflictError
    → PrescriptionRequiredError

Draw this hierarchy on paper before writing 
a single line of code.
    `,

    projectBrief: `
BUILD: A complete Object-Oriented Pharmacy Management System.

CLASS HIERARCHY REQUIRED:
──────────────────────────
1. PharmacyError (Exception base)
   ├── DrugNotFoundError
   ├── InsufficientStockError
   ├── AllergyConflictError
   ├── PrescriptionRequiredError
   └── ExpiredDrugError

2. Drug (base class)
   ├── ControlledDrug (child)
   ├── Antibiotic (child)
   ├── OTCDrug (child)
   └── Vaccine (child)

3. Patient
   - name, age, weight_kg, allergies (list), conditions (list)
   - medications (list of (Drug, dose, frequency) tuples)
   - Methods: add_medication, remove_medication,
              check_allergy_conflict, clinical_summary

4. Pharmacist
   - name, licence_number
   - Methods: dispense, verify_prescription

5. Prescription
   - patient, pharmacist, drugs_list, date, rx_number
   - Methods: validate, generate_pdf_content

6. Pharmacy (main orchestrator)
   - formulary (dict), patient_register (dict)
   - dispensing_log (list)
   - Methods: register_patient, add_drug, dispense,
              allergy_check, generate_daily_report

DUNDER METHODS REQUIRED:
─────────────────────────
- Drug:      __str__, __repr__, __len__ (stock), __eq__ (by name), __lt__ (by dose)
- Patient:   __str__, __repr__, __len__ (number of medications), __eq__ (by name)
- Pharmacy:  __len__ (drugs in formulary), __contains__ (drug in formulary)

MINIMUM TEST SCENARIOS:
────────────────────────
1. Create a pharmacy with 10 drugs (mix of types)
2. Register 5 patients
3. Check allergy conflicts before dispensing
4. Dispense to each patient (mix of drug types)
5. Attempt 3 scenarios that should raise exceptions
6. Generate a daily report

FILE STRUCTURE:
───────────────
pharmacy_system/
  __init__.py
  exceptions.py     ← all custom exceptions
  drugs.py          ← Drug and all subclasses
  patient.py        ← Patient class
  pharmacist.py     ← Pharmacist class
  prescription.py   ← Prescription class
  pharmacy.py       ← Pharmacy main class
  main.py           ← demo script

GITHUB REQUIREMENTS:
────────────────────
Repository: python-week3-oop-pharmacy
README must include:
  - UML class diagram (hand-drawn and photographed is fine)
  - Class hierarchy description
  - Sample output from main.py
  - Design decisions: why each class exists
  - What you would add in a production version
    `,

    example: `
# ── Starter: exceptions.py ──────────────────────────────

class PharmacyError(Exception):
    """Base exception for all pharmacy system errors."""
    pass

class DrugNotFoundError(PharmacyError):
    def __init__(self, drug_name):
        self.drug_name = drug_name
        super().__init__(f"'{drug_name}' is not in the formulary.")

class InsufficientStockError(PharmacyError):
    def __init__(self, drug_name, requested, available):
        self.drug_name = drug_name
        self.requested = requested
        self.available = available
        super().__init__(
            f"Cannot dispense {requested}x {drug_name}. "
            f"Only {available} in stock."
        )

class AllergyConflictError(PharmacyError):
    def __init__(self, patient_name, drug_name, allergen):
        super().__init__(
            f"ALLERGY ALERT: {patient_name} is allergic to "
            f"{allergen}. {drug_name} is contraindicated."
        )

class PrescriptionRequiredError(PharmacyError):
    def __init__(self, drug_name):
        super().__init__(
            f"{drug_name} requires a valid prescription."
        )

# ── Starter: drugs.py ───────────────────────────────────
from exceptions import PharmacyError
import datetime

class Drug:
    """
    Base class for all pharmaceutical drugs.
    Build your full class hierarchy here.
    """
    total_drugs = 0

    def __init__(self, name: str, dose_mg: float,
                 indication: str, stock: int = 0,
                 price_ngn: float = 0,
                 expiry_date: str = "2028-01"):
        self.name        = name
        self.dose_mg     = dose_mg
        self.indication  = indication
        self.stock       = stock
        self.price_ngn   = price_ngn
        self.expiry_date = expiry_date
        Drug.total_drugs += 1

    def __str__(self):
        return f"{self.name} {self.dose_mg}mg"

    def __repr__(self):
        return (f"Drug(name={self.name!r}, dose_mg={self.dose_mg}, "
                f"stock={self.stock})")

    def __len__(self):
        return self.stock

    def __eq__(self, other):
        if not isinstance(other, Drug):
            return NotImplemented
        return self.name.lower() == other.name.lower()

    def __lt__(self, other):
        if not isinstance(other, Drug):
            return NotImplemented
        return self.dose_mg < other.dose_mg

    def is_expired(self) -> bool:
        """Check if drug has passed its expiry date."""
        expiry = datetime.datetime.strptime(self.expiry_date, "%Y-%m").date()
        return datetime.date.today() > expiry

    def dispense(self, qty: int, patient_name: str) -> str:
        """Override this in child classes for specialised behaviour."""
        from exceptions import InsufficientStockError
        if qty > self.stock:
            raise InsufficientStockError(self.name, qty, self.stock)
        self.stock -= qty
        return f"✓ Dispensed {qty}x {self} to {patient_name}"

    def generate_label(self) -> str:
        return f"Drug: {self} | Indication: {self.indication}"

# Build ControlledDrug, Antibiotic, OTCDrug, Vaccine here
# Follow the same pattern as Day 13

# ── Starter: main.py ────────────────────────────────────
from pharmacy import Pharmacy
from drugs import Drug, ControlledDrug, Antibiotic, OTCDrug
from patient import Patient

def main():
    # 1. Create pharmacy
    pharmacy = Pharmacy("Victor's Community Pharmacy", "Lagos")

    # 2. Add drugs to formulary
    # Add at least 10 drugs here

    # 3. Register patients
    # Register at least 5 patients here

    # 4. Process prescriptions
    # Dispense to each patient

    # 5. Trigger exception scenarios
    # Demonstrate all custom exceptions

    # 6. Generate report
    print(pharmacy.generate_daily_report())

if __name__ == "__main__":
    main()
    `,

    exercises: [],

    commonMistakes: [
      {
        mistake: "Starting to code before designing the class hierarchy",
        wrong:   "Opening a blank file and writing class Drug immediately",
        right:   "Spend 20 minutes drawing the hierarchy and relationships on paper first",
        explanation: "Poor upfront design leads to classes that do not work well together and require rewrites. Design on paper first.",
      },
      {
        mistake: "Making every class depend on every other class",
        wrong:   "Drug imports Patient, Patient imports Pharmacy, Pharmacy imports Drug — circular imports",
        right:   "Design a clear dependency direction: exceptions ← drugs ← patient ← pharmacy",
        explanation: "Circular imports crash Python. Design your import dependencies to flow in one direction only.",
      },
    ],

    resources: [
      {
        objective: "Design and build a complete OOP system from scratch",
        items: [
          {
            title:    "Real Python — Python OOP: A Complete Guide",
            url:      "https://realpython.com/python3-object-oriented-programming/",
            type:     "article",
            note:     "Use as your reference throughout the project build.",
          },
          {
            title:    "Corey Schafer — OOP Tutorial Series Parts 1–6 (Video)",
            url:      "https://www.youtube.com/watch?v=ZDa-Z5JzLYM",
            type:     "video",
            duration: "~3 hrs total",
            note:     "Watch all 6 parts this week if you have not already. Best OOP series on YouTube.",
          },
        ],
      },
      {
        objective: "Write production-quality code with docstrings and type hints",
        items: [
          {
            title:    "Real Python — Documenting Python Code",
            url:      "https://realpython.com/documenting-python-code/",
            type:     "article",
            note:     "Guide to writing good docstrings — covers Google style which you should use.",
          },
          {
            title:    "Real Python — Python Type Checking (Type Hints)",
            url:      "https://realpython.com/python-type-checking/",
            type:     "article",
            note:     "Introduction to type hints — add them to every function and method in this project.",
          },
        ],
      },
      {
        objective: "Push the most complete Python project so far to GitHub",
        items: [
          {
            title:    "GitHub Docs — Creating a Repository",
            url:      "https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository",
            type:     "reference",
            note:     "Quick guide to creating and pushing a new repo.",
          },
          {
            title:    "Draw.io — Free UML Diagram Tool",
            url:      "https://app.diagrams.net/",
            type:     "tool",
            note:     "Free browser-based tool to draw your class hierarchy diagram for the README.",
          },
        ],
      },
    ],
  },

];

if (typeof module !== "undefined") {
  module.exports = { WEEK3 };
}
