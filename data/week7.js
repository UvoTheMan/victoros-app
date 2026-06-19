// ============================================================
// WEEK 7 — numpy Intro + Jupyter Notebooks
// Days 31–35 | 27–31 July 2026
// Phase 1: Python Mastery
// ============================================================

const WEEK7 = [

  // ============================================================
  // DAY 31 — numpy Fundamentals: Arrays, dtypes, Indexing
  // ============================================================
  {
    id: "W7D1", week: 7, day: 1, phase: 1,
    phaseTitle: "Python Mastery",
    date: "2026-07-27",
    type: "lesson",
    topic: "numpy Fundamentals: ndarray, dtypes, Creation, Indexing & Slicing",
    duration: "2–3 hours",

    objectives: [
      "Explain why numpy arrays exist and how they differ from Python lists",
      "Create arrays using array(), zeros(), ones(), arange(), linspace()",
      "Inspect array properties: shape, dtype, ndim, size",
      "Index and slice 1D and 2D arrays, including boolean masking",
    ],

    introduction: `
Every data science and ML library you will ever touch — pandas,
scikit-learn, TensorFlow, PyTorch — is built on top of numpy
arrays under the hood. A pandas DataFrame is, structurally,
a collection of numpy arrays with labels attached. Before you
can credibly call yourself a data professional, you need numpy
to feel as natural as Python lists do right now.

Today you're laying the foundation stone of the entire Data
Science and ML phases ahead. Take your time with the mental
model — it will save you weeks of confusion later when you
hit broadcasting and vectorisation.
    `,

    mentalModel: `
MENTAL MODEL — "The Pre-Printed Lab Requisition Form"

A Python list is like a blank notepad — you can write anything,
of any type, in any order, and it's flexible but slow to process
in bulk. A numpy array is like a pre-printed lab requisition
form: every field is the same type, the same size, laid out in
a fixed grid. Because the computer knows in advance exactly what
shape and type the data is, it can process the whole form at
once using optimised, compiled C code instead of looping field
by field in slow Python.

That fixed structure is the entire reason numpy is 10–100x
faster than pure Python for numerical work — and it's also why
arrays must hold a single, consistent dtype.
    `,

    explanation: `
WHY NOT JUST USE LISTS?
========================
Python lists store pointers to objects scattered in memory.
numpy arrays store raw, contiguous, same-type data — like a
row of lab vials in a rack rather than addresses to vials kept
in different rooms. This contiguity is what enables vectorised
math at C speed instead of Python's interpreter loop speed.

CREATING ARRAYS
================
import numpy as np

np.array([1, 2, 3])              # from a list
np.array([[1, 2], [3, 4]])       # 2D from nested lists
np.zeros((3, 4))                 # 3x4 array of zeros
np.ones((2, 2))                  # 2x2 array of ones
np.arange(0, 10, 2)              # [0, 2, 4, 6, 8] — like range()
np.linspace(0, 1, 5)             # 5 evenly spaced points 0→1
np.full((2, 3), 7)               # filled with a constant
np.eye(3)                        # 3x3 identity matrix

INSPECTING ARRAYS
===================
arr.shape     # tuple, e.g. (3, 4) — rows, columns
arr.dtype     # data type, e.g. int64, float64
arr.ndim      # number of dimensions
arr.size      # total number of elements

DTYPES MATTER
==============
np.array([1, 2, 3]).dtype          # int64
np.array([1.0, 2, 3]).dtype        # float64 — one float "infects" all
np.array([1, 2], dtype="float32")  # explicit dtype, saves memory

Mixing types silently upcasts everything to the most general
type. This is a common source of subtle bugs in real pipelines.

INDEXING & SLICING
====================
arr = np.array([10, 20, 30, 40, 50])
arr[0]          # 10
arr[-1]         # 50
arr[1:4]        # [20, 30, 40]
arr[::2]        # [10, 30, 50] — every other element

For 2D arrays, use comma-separated indices, not chained brackets:
matrix = np.array([[1, 2, 3], [4, 5, 6]])
matrix[0, 2]     # 3   (row 0, col 2)
matrix[:, 1]     # [2, 5]  — entire column 1
matrix[1, :]     # [4, 5, 6] — entire row 1

BOOLEAN MASKING
=================
arr = np.array([10, 20, 30, 40, 50])
mask = arr > 25          # [False, False, True, True, True]
arr[mask]                 # [30, 40, 50]
arr[arr > 25]              # same thing, one line — very common pattern

VIEWS VS COPIES
=================
Slicing a numpy array returns a VIEW (same memory), not a copy.
Modifying a slice modifies the original array — unlike Python
list slicing, which always copies. Use .copy() when you need an
independent array.
    `,

    clinicalConnection: `
Think of a numpy array the way you'd think of a structured lab
panel — say, a Basic Metabolic Panel with fixed fields: Na, K,
Cl, CO2, BUN, Creatinine, Glucose, all numeric, always in that
order. You wouldn't expect one patient's panel to suddenly have
a text note where Glucose should be — the structure is rigid by
design, which is exactly why you can compare panels across
thousands of patients instantly. That rigidity is numpy's whole
value proposition: uniform structure enables bulk computation.
    `,

    example: `
import numpy as np

# A week of patient temperature readings (°F), 5 patients x 7 days
temps = np.array([
    [98.6, 99.1, 98.4, 98.9, 99.5, 98.7, 98.6],
    [101.2, 100.8, 100.1, 99.7, 99.2, 98.9, 98.6],
    [97.9, 98.0, 98.2, 98.5, 98.6, 98.4, 98.3],
    [99.8, 100.4, 101.1, 101.5, 100.9, 99.6, 98.9],
    [98.5, 98.6, 98.5, 98.7, 98.6, 98.5, 98.6],
])

print("Shape:", temps.shape)        # (5, 7) -> 5 patients, 7 days
print("Dtype:", temps.dtype)        # float64

# Day 1 readings for all patients (column 0)
day1 = temps[:, 0]
print("Day 1 readings:", day1)

# All readings for patient 2 (row index 1)
patient2 = temps[1, :]
print("Patient 2's week:", patient2)

# Boolean mask: flag any fever reading (>100.4°F) across the whole panel
fever_mask = temps > 100.4
print("Fever readings:", temps[fever_mask])

# How many fever readings total?
print("Fever count:", fever_mask.sum())
    `,

    commonMistakes: [
      "Using chained indexing like arr[0][2] on 2D arrays instead of arr[0, 2] — both work but comma indexing is faster and is the idiomatic numpy style.",
      "Forgetting that slices are views: modifying a slice unexpectedly changes the original array. Use .copy() when you need a true independent copy.",
      "Mixing int and float in a list before converting to array, then being confused why dtype is float64 — numpy upcasts to the most general type automatically.",
      "Assuming np.array() and np.asarray() always copy data — np.array() copies by default, np.asarray() does not if the input is already an array.",
    ],

    exercises: [
      "Create a 4x4 array of zeros, then use slicing to set the entire second row to the value 9 without using a loop.",
      "Given an array of 20 random integers between 0 and 100 (np.random.randint), use boolean masking to extract only the values greater than 50.",
      "Create a 1D array of the numbers 1–12, reshape it into a 3x4 2D array using .reshape(), then extract the middle column.",
      "Take the patient temperature example above and write one line of code that returns True if ANY patient had a fever reading at any point (hint: research np.any()).",
    ],

    resources: [
      {
        objective: "Understand why numpy arrays exist and how they differ from lists",
        items: [
          { title: "numpy official — NumPy: the absolute basics for beginners", url: "https://numpy.org/doc/stable/user/absolute_beginners.html", type: "article", note: "The official starting point — covers arrays, dtypes, and the why behind numpy's design." },
          { title: "freeCodeCamp — NumPy Tutorial for Beginners (YouTube)", url: "https://www.youtube.com/watch?v=QUT1VHiLmmI", type: "video", note: "Full beginner walkthrough of array creation, indexing, and operations." },
        ],
      },
      {
        objective: "Practice array creation, indexing, and boolean masking interactively",
        items: [
          { title: "W3Schools — NumPy Array Indexing", url: "https://www.w3schools.com/python/numpy/numpy_array_indexing.asp", type: "interactive", note: "Runnable in-browser examples for indexing, slicing, and boolean masks — no setup needed." },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 32 — Array Manipulation: Reshaping, Broadcasting, Stacking
  // ============================================================
  {
    id: "W7D2", week: 7, day: 2, phase: 1,
    phaseTitle: "Python Mastery",
    date: "2026-07-28",
    type: "lesson",
    topic: "Array Manipulation: Reshaping, Broadcasting, Stacking & Axis Operations",
    duration: "2–3 hours",

    objectives: [
      "Reshape arrays with .reshape(), .flatten(), and .ravel()",
      "Understand and apply numpy's broadcasting rules",
      "Combine arrays with concatenate(), vstack(), and hstack()",
      "Correctly use the axis parameter in multi-dimensional operations",
    ],

    introduction: `
Yesterday you learned the static structure of arrays. Today is
about reshaping that structure to fit the problem at hand, and
understanding broadcasting — the single most important numpy
concept for writing fast, loop-free code. Broadcasting is the
mechanism that lets you write "temps - 98.6" on a whole array of
readings and have it just work, element by element, with zero
explicit loops.

This is also where most beginners get tripped up by the axis
parameter. By the end of today, axis=0 vs axis=1 will be
intuitive rather than something you have to guess at.
    `,

    mentalModel: `
MENTAL MODEL — "Broadcasting Is Photocopying, Not Magic"

When numpy adds a single number to an entire array, it's not
doing anything mystical — it's mentally photocopying that number
into an array of the same shape first, then doing ordinary
element-wise addition. Broadcasting rules just describe exactly
when numpy is allowed to "photocopy" a smaller array up to match
a bigger one (and when shapes are too incompatible to do so).

For axis: think of axis=0 as "collapse downward, column by
column" (you get one result per column) and axis=1 as "collapse
sideways, row by row" (you get one result per row). If you ever
forget which is which, mentally picture which direction gets
"squashed flat" — that's the axis you specified.
    `,

    explanation: `
RESHAPING
==========
arr = np.arange(12)            # [0, 1, ..., 11]
arr.reshape(3, 4)               # 3 rows, 4 columns
arr.reshape(4, 3)               # 4 rows, 3 columns
arr.reshape(2, -1)               # numpy infers the missing dimension
arr.flatten()                    # always returns a copy, 1D
arr.ravel()                      # returns a view when possible, 1D (faster)

Reshape requires the total element count to stay the same:
a 12-element array can become (3,4), (4,3), (2,6), (12,1) — but
never (3,5).

BROADCASTING RULES (simplified)
==================================
1. Compare shapes from the right-hand side
2. Dimensions are compatible if they're equal, OR one of them is 1
3. Missing dimensions are treated as size 1

arr = np.array([[1, 2, 3], [4, 5, 6]])   # shape (2, 3)
arr + 10                                   # scalar broadcasts to every element
arr + np.array([10, 20, 30])              # shape (3,) broadcasts across rows
arr + np.array([[100], [200]])            # shape (2,1) broadcasts across columns

If shapes are genuinely incompatible (e.g. (2,3) and (4,)),
numpy raises a ValueError rather than guessing.

STACKING & COMBINING
=======================
a = np.array([1, 2, 3])
b = np.array([4, 5, 6])

np.concatenate([a, b])          # [1,2,3,4,5,6] — joins along existing axis
np.vstack([a, b])               # stacks as new rows -> shape (2,3)
np.hstack([a, b])               # stacks horizontally -> [1,2,3,4,5,6]

For 2D arrays, vstack adds rows (like adding new patients to a
panel), hstack adds columns (like adding a new lab result column
to existing patients).

AXIS-AWARE AGGREGATION
=========================
matrix = np.array([[1, 2, 3], [4, 5, 6]])   # shape (2, 3)

matrix.sum()             # 21 -> total, no axis
matrix.sum(axis=0)       # [5, 7, 9]   -> sum DOWN each column (collapses rows)
matrix.sum(axis=1)       # [6, 15]      -> sum ACROSS each row (collapses columns)

The same axis logic applies to .mean(), .max(), .min(), .std().
    `,

    clinicalConnection: `
Picture a ward's vitals spreadsheet: rows are patients, columns
are days. axis=0 (collapsing rows) gives you one number per
DAY across all patients — useful for "what was the average
temperature on the ward on Day 3?" axis=1 (collapsing columns)
gives you one number per PATIENT across all days — useful for
"what was this specific patient's average temperature for the
week?" Knowing which axis to collapse is the difference between
a per-patient summary and a per-day summary — getting it backwards
is a real and common analysis bug, not just a numpy quirk.
    `,

    example: `
import numpy as np

# Same 5-patient, 7-day temperature panel from yesterday
temps = np.array([
    [98.6, 99.1, 98.4, 98.9, 99.5, 98.7, 98.6],
    [101.2, 100.8, 100.1, 99.7, 99.2, 98.9, 98.6],
    [97.9, 98.0, 98.2, 98.5, 98.6, 98.4, 98.3],
    [99.8, 100.4, 101.1, 101.5, 100.9, 99.6, 98.9],
    [98.5, 98.6, 98.5, 98.7, 98.6, 98.5, 98.6],
])

# Average temperature PER PATIENT across the week (collapse columns -> axis=1)
patient_avg = temps.mean(axis=1)
print("Per-patient weekly average:", patient_avg)

# Average temperature PER DAY across all patients (collapse rows -> axis=0)
daily_avg = temps.mean(axis=0)
print("Per-day ward average:", daily_avg)

# Broadcasting: convert the entire panel from Fahrenheit to Celsius in one line
temps_celsius = (temps - 32) * 5 / 9
print("First patient, in Celsius:", temps_celsius[0])

# Stack a new 6th patient's week onto the panel
new_patient = np.array([98.4, 98.5, 98.6, 98.5, 98.4, 98.6, 98.5])
temps_updated = np.vstack([temps, new_patient])
print("New shape after adding patient:", temps_updated.shape)   # (6, 7)
    `,

    commonMistakes: [
      "Confusing axis=0 and axis=1 — remember axis=0 collapses ROWS (one result per column), axis=1 collapses COLUMNS (one result per row).",
      "Trying to reshape an array into a shape with a different total element count, causing a ValueError. Always check rows*cols matches the original size.",
      "Using hstack when vstack was needed (or vice versa) when combining 2D arrays — hstack adds columns, vstack adds rows.",
      "Assuming broadcasting will silently 'figure out' any shape mismatch — it only works when shapes align per the broadcasting rules, otherwise it errors loudly (which is a good thing).",
    ],

    exercises: [
      "Create a 1D array of 24 numbers and reshape it into a (4, 6) array, then into a (2, 3, 4) 3D array.",
      "Given a (3,4) array of exam scores, write one line using broadcasting to add a 5-point curve to every score.",
      "Create two (2,3) arrays and combine them with both vstack and hstack — print both results and explain the shape of each in a comment.",
      "Using the temperature panel example, write code to find which single patient (by row index) had the highest weekly average temperature.",
    ],

    resources: [
      {
        objective: "Understand numpy's broadcasting rules deeply",
        items: [
          { title: "numpy official — Broadcasting", url: "https://numpy.org/doc/stable/user/basics.broadcasting.html", type: "article", note: "The canonical explanation of broadcasting rules straight from the numpy docs." },
          { title: "Real Python — NumPy arange(): How to Use np.arange()", url: "https://realpython.com/how-to-use-numpy-arange/", type: "article", note: "Useful refresher on array generation that pairs well with reshaping practice." },
        ],
      },
      {
        objective: "Visualize and practice axis-based aggregation",
        items: [
          { title: "Corey Schafer — NumPy Tutorials (YouTube playlist)", url: "https://www.youtube.com/playlist?list=PL-osiE80TeTvipOqomVEeZ1HRrcEvtZB_", type: "video", note: "Clear visual walkthroughs of axis operations and reshaping." },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 33 — numpy Math, Statistics & Random
  // ============================================================
  {
    id: "W7D3", week: 7, day: 3, phase: 1,
    phaseTitle: "Python Mastery",
    date: "2026-07-29",
    type: "lesson",
    topic: "numpy Math & Statistics: Aggregations, Random Module, Basic Linear Algebra",
    duration: "2–3 hours",

    objectives: [
      "Apply statistical aggregation functions: mean, median, std, var, percentile",
      "Generate reproducible random data with np.random",
      "Perform basic linear algebra: dot products and matrix multiplication",
      "Use np.where() and np.unique() for conditional logic and value counting",
    ],

    introduction: `
This is the day numpy starts feeling like the engine room of
data science rather than 'fancy lists'. Every statistic you'll
compute in Phase 3 (pandas, EDA, hypothesis testing) is built on
the functions you'll practice today. Get comfortable with these
now and pandas will feel like numpy with labels — because, under
the hood, that's almost exactly what it is.
    `,

    mentalModel: `
MENTAL MODEL — "The Lab's Statistical Summary Printout"

When a lab analyser finishes a batch, it doesn't just dump raw
numbers — it prints a summary: mean, range, flagged outliers.
numpy's aggregation functions are that summary printout for any
array. np.random is the lab's "simulate a batch of results for
training purposes" mode — useful for testing pipelines before
real data exists, as long as you fix the seed so the simulated
batch is reproducible every time you run it.
    `,

    explanation: `
STATISTICAL AGGREGATIONS
===========================
arr = np.array([12, 15, 11, 19, 22, 14, 17])

arr.mean()            # average
arr.std()              # standard deviation (population, ddof=0 by default)
arr.var()              # variance
np.median(arr)         # median
np.percentile(arr, 90) # 90th percentile
arr.min(), arr.max()    # extremes
np.ptp(arr)             # range: max - min

Note: arr.std() defaults to ddof=0 (population std). For sample
std (the one you usually want in real analysis), use
arr.std(ddof=1).

RANDOM MODULE
===============
np.random.seed(42)                  # fixes randomness for reproducibility
np.random.rand(3)                    # 3 floats, uniform [0, 1)
np.random.randint(0, 100, size=5)   # 5 random ints, 0–99
np.random.normal(loc=98.6, scale=0.7, size=10)  # 10 samples from a normal distribution
np.random.choice([1, 2, 3], size=5, replace=True)  # random sampling with replacement

Always set a seed in any script you expect to be reproducible —
otherwise every run produces different random results, making
debugging and testing unreliable.

np.where() — VECTORISED IF/ELSE
==================================
temps = np.array([97.9, 99.1, 101.2, 98.6, 100.5])
status = np.where(temps > 100.4, "Fever", "Normal")
# array(['Normal', 'Normal', 'Fever', 'Normal', 'Fever'])

This replaces a manual for-loop with an if/else inside it —
np.where is the vectorised equivalent and is dramatically faster
on large arrays.

np.unique() — VALUE COUNTING
===============================
statuses = np.array(["Normal", "Fever", "Normal", "Normal", "Fever"])
np.unique(statuses)                          # ['Fever', 'Normal']
np.unique(statuses, return_counts=True)       # (['Fever','Normal'], [2, 3])

BASIC LINEAR ALGEBRA
=======================
a = np.array([1, 2, 3])
b = np.array([4, 5, 6])

np.dot(a, b)              # 1*4 + 2*5 + 3*6 = 32 (dot product)
a @ b                       # same thing, @ is the matrix-multiply operator

A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])
A @ B                        # matrix multiplication (NOT element-wise A*B)
A * B                        # element-wise multiplication — different result!

A @ B and A * B are easy to confuse and produce very different
results — this is one of the most common numpy bugs in real code.
    `,

    clinicalConnection: `
np.where() is precisely the logic behind any clinical flagging
rule: "if glucose > 126 mg/dL fasting, flag as diabetic range,
else normal." You've applied this logic manually a thousand
times reading lab reports — np.where lets you apply that exact
rule to an entire dataset of thousands of patients in one
vectorised line instead of one patient at a time.
    `,

    example: `
import numpy as np

np.random.seed(42)

# Simulate a batch of 200 fasting glucose readings (mg/dL),
# roughly normal around 100 with some spread
glucose = np.random.normal(loc=100, scale=15, size=200)

print("Mean glucose:", round(glucose.mean(), 1))
print("Std dev:", round(glucose.std(ddof=1), 1))
print("90th percentile:", round(np.percentile(glucose, 90), 1))

# Flag readings using clinical thresholds
status = np.where(glucose >= 126, "Diabetic range",
          np.where(glucose >= 100, "Prediabetic range", "Normal"))

labels, counts = np.unique(status, return_counts=True)
for label, count in zip(labels, counts):
    print(f"{label}: {count} patients ({count/len(glucose)*100:.1f}%)")

# Basic linear algebra: weighted risk score from 3 lab values per patient
# (toy example — not real clinical weighting)
lab_values = np.array([100, 140, 35])     # glucose, BP systolic, BMI-ish proxy
weights    = np.array([0.5, 0.3, 0.2])
risk_score = lab_values @ weights
print("Composite risk score:", risk_score)
    `,

    commonMistakes: [
      "Using A * B when matrix multiplication (A @ B) was intended, or vice versa — these give completely different results for 2D arrays.",
      "Forgetting to set np.random.seed(), making 'reproducible' analysis scripts produce different results every run — a real problem when debugging or sharing notebooks.",
      "Using the default arr.std() (ddof=0, population) when a sample standard deviation (ddof=1) is statistically what's needed — this is a frequent source of slightly-wrong statistics in real reports.",
      "Nesting too many np.where() calls and producing unreadable code — beyond 2 levels, consider np.select() or pandas instead.",
    ],

    exercises: [
      "Generate 1000 random integers between 1 and 6 (simulating dice rolls) with a fixed seed, then use np.unique with return_counts to tabulate how many times each face appeared.",
      "Given an array of 50 random exam scores (0–100), use np.where to create a pass/fail array using a 50-point cutoff, then count how many passed with np.unique.",
      "Create two 3x3 matrices and compute both their element-wise product and their matrix product — print both and write a comment explaining why they differ.",
      "Simulate 500 blood pressure readings using np.random.normal(120, 12, 500), then report the mean, sample std (ddof=1), and what percentage exceed 140 (hypertensive range).",
    ],

    resources: [
      {
        objective: "Master numpy's statistical aggregation functions",
        items: [
          { title: "numpy official — Statistics", url: "https://numpy.org/doc/stable/reference/routines.statistics.html", type: "reference", note: "Full reference of every statistical function numpy offers, with parameter details." },
          { title: "Khan Academy — Standard deviation (refresher)", url: "https://www.khanacademy.org/math/statistics-probability/summarizing-quantitative-data/variance-standard-deviation-population/v/range-variance-and-standard-deviation-as-measures-of-dispersion", type: "video", note: "Quick refresher on the statistics underlying std/var before applying them in numpy." },
        ],
      },
      {
        objective: "Understand the difference between element-wise and matrix multiplication",
        items: [
          { title: "freeCodeCamp — NumPy Matrix Multiplication explained", url: "https://www.freecodecamp.org/news/numpy-matrix-multiplication/", type: "article", note: "Direct, visual explanation of @ vs * with worked examples." },
        ],
      },
      {
        objective: "Practice the random module for reproducible simulations",
        items: [
          { title: "numpy official — Random sampling (numpy.random)", url: "https://numpy.org/doc/stable/reference/random/index.html", type: "reference", note: "Covers seeding, distributions, and sampling functions in depth." },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 34 — Jupyter Notebooks: Setup & Workflow
  // ============================================================
  {
    id: "W7D4", week: 7, day: 4, phase: 1,
    phaseTitle: "Python Mastery",
    date: "2026-07-30",
    type: "lesson",
    topic: "Jupyter Notebooks: Setup, Cells, Magic Commands & Professional Workflow",
    duration: "2–3 hours",

    objectives: [
      "Install and launch Jupyter Notebook / JupyterLab locally",
      "Distinguish code cells, markdown cells, and execution order",
      "Use essential magic commands (%timeit, %%time, %matplotlib inline)",
      "Apply notebook best practices to avoid hidden-state bugs",
    ],

    introduction: `
Every data scientist, ML engineer, and AI researcher you'll ever
work alongside uses notebooks daily for exploration — even
though production code still lives in .py files. Today is about
becoming fluent in the notebook environment itself: how cells
execute, why execution ORDER (not just position) matters, and
how to avoid the single most common notebook bug — invisible
hidden state from cells run out of order.
    `,

    mentalModel: `
MENTAL MODEL — "The Notebook Is a Lab Bench, Not a Script"

A .py script runs top to bottom, every time, in a clean state —
like following a recipe exactly as written. A notebook is more
like a lab bench: you can run experiments in any order, leave
some reagents (variables) sitting out from an earlier step, and
come back to them later. This is powerful for exploration, but
dangerous for reproducibility — your notebook's visible cell
order can completely lie about what state Python is actually in.
The fix is discipline: restart and "Run All" regularly to confirm
your notebook still works top-to-bottom, the way a script would.
    `,

    explanation: `
INSTALLING & LAUNCHING
=========================
pip install notebook jupyterlab

jupyter notebook        # classic interface
jupyter lab              # modern interface (recommended)

Both open in your browser, connecting to a local Python "kernel"
— a running Python process that holds your variables in memory
between cell executions.

CELL TYPES
============
Code cells    -> Python code, executed with Shift+Enter
Markdown cells -> formatted text, headers, lists, images, LaTeX
                  math ($E = mc^2$), rendered when run like a cell

EXECUTION ORDER, NOT POSITION, IS WHAT MATTERS
==================================================
The number in [ ] next to a cell (e.g. [7]) shows the ORDER it
was executed, not its position on the page. You can write cell 1,
run it, write cell 2, run it, then go BACK and edit cell 1 and
re-run it — now cell 1 executed AFTER cell 2, regardless of where
it sits visually. This is the #1 source of "it works for me but
not when I restart" notebook bugs.

ESSENTIAL MAGIC COMMANDS
===========================
%timeit some_function()       # times a single line, averages multiple runs
%%time                          # (cell magic) times the whole cell once
%matplotlib inline             # render plots directly in the notebook
%who                             # list all variables currently in memory
%reset                           # clear all variables (careful!)
!pip install pandas            # run shell commands directly from a cell

NOTEBOOK BEST PRACTICES
===========================
1. Restart kernel and "Run All" before considering work done —
   this is the only way to verify top-to-bottom correctness.
2. Keep cells short and focused — one logical step per cell.
3. Use markdown cells to document WHY, not just what.
4. Move reusable code (functions, classes) into a .py file and
   import it — notebooks are for exploration, not for housing
   your final production logic.
5. Clear outputs before committing to Git (Cell -> All Output ->
   Clear) to keep diffs clean — notebook outputs as JSON blobs
   create noisy, unreadable Git history otherwise.

EXPORTING
===========
jupyter nbconvert --to script notebook.ipynb    # extract to .py
jupyter nbconvert --to html notebook.ipynb       # shareable HTML report
    `,

    clinicalConnection: `
Running notebook cells out of order is exactly like a lab tech
re-running an assay step out of sequence and trusting old reagent
prep from an earlier, now-stale batch — the displayed result
looks fine, but it was computed against an inconsistent state.
The "Restart and Run All" habit is your equivalent of redoing the
full assay from a fresh, controlled starting point before you
trust the final reading.
    `,

    example: `
# ── Cell 1 (markdown) ──
# # Glucose Batch Analysis
# Exploring a simulated batch of fasting glucose readings.

# ── Cell 2 (code) ──
import numpy as np
np.random.seed(42)
glucose = np.random.normal(100, 15, 200)
print(glucose[:5])

# ── Cell 3 (code) ──
%%time
mean_val = glucose.mean()
std_val  = glucose.std(ddof=1)
print(f"Mean: {mean_val:.1f}, Std: {std_val:.1f}")

# ── Cell 4 (code) ──
%timeit glucose.mean()
# Useful for comparing performance of different approaches later,
# e.g. numpy mean() vs a manual Python loop sum() / len()

# ── Cell 5 (code) ──
%matplotlib inline
import matplotlib.pyplot as plt
plt.hist(glucose, bins=20)
plt.title("Glucose Distribution")
plt.show()

# ── Discipline check ──
# Kernel -> Restart & Run All. If every cell still produces the
# same output top-to-bottom, the notebook is genuinely reproducible.
    `,

    commonMistakes: [
      "Trusting a notebook's visual cell order instead of its execution order — always check the [N] numbers, and when in doubt, Restart & Run All.",
      "Leaving large or sensitive outputs (full dataframes, API keys printed for debugging) committed in the .ipynb JSON when pushed to GitHub.",
      "Writing all logic directly in notebook cells with no functions, making code impossible to reuse or unit test later.",
      "Forgetting %matplotlib inline (in classic Jupyter) and wondering why plots open in a separate window or don't render at all.",
    ],

    exercises: [
      "Install Jupyter, launch JupyterLab, and create a new notebook with a markdown title cell followed by a code cell that imports numpy and prints its version.",
      "Deliberately create the 'out of order' bug: define a variable in cell 2, use it in cell 3, then edit cell 2 to change the variable, run ONLY cell 3 again, and observe the stale result. Then fix it by re-running cell 2.",
      "Use %timeit to compare the speed of summing a 1,000,000-element numpy array using arr.sum() versus a plain Python for loop.",
      "Export your practice notebook to both a .py script and an .html report using nbconvert, and open both to confirm they rendered correctly.",
    ],

    resources: [
      {
        objective: "Install and launch Jupyter for the first time",
        items: [
          { title: "Jupyter official — Installing Jupyter", url: "https://jupyter.org/install", type: "article", note: "Official install instructions for both classic Notebook and JupyterLab." },
          { title: "Corey Schafer — Jupyter Notebook Tutorial (YouTube)", url: "https://www.youtube.com/watch?v=HW29067qVWk", type: "video", note: "Friendly walkthrough of installation, cells, and basic workflow." },
        ],
      },
      {
        objective: "Understand execution order and avoid hidden-state bugs",
        items: [
          { title: "Real Python — Jupyter Notebook: An Introduction", url: "https://realpython.com/jupyter-notebook-introduction/", type: "article", note: "Covers cell execution order, kernels, and common pitfalls in depth." },
        ],
      },
      {
        objective: "Practice notebook magic commands hands-on",
        items: [
          { title: "Google Colab (free, no install)", url: "https://colab.research.google.com/", type: "interactive", note: "Free hosted Jupyter environment — useful for practicing magic commands without a local install." },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 35 — Week 7 Project: numpy Statistical Analysis Tool
  // ============================================================
  {
    id: "W7D5", week: 7, day: 5, phase: 1,
    phaseTitle: "Python Mastery",
    date: "2026-07-31",
    type: "project",
    topic: "Project: numpy Statistical Analysis Tool",
    duration: "3–4 hours",

    objectives: [
      "Combine array creation, indexing, broadcasting, and aggregation into one working tool",
      "Use a Jupyter notebook as the deliverable, following best practices from Day 34",
      "Produce a clean, documented statistical summary of a simulated dataset",
      "Practice structuring exploratory work the way a real data analyst would",
    ],

    introduction: `
Today you bring the whole week together. The brief: build a
numpy-powered statistical analysis tool inside a Jupyter
notebook that takes a simulated dataset (you'll generate it with
np.random, just like Day 33) and produces a full statistical
profile — means, spreads, percentiles, flagged outliers — laid
out cleanly with markdown commentary explaining each step.

This is your Phase 1, Week 7 capstone project. Treat it as
something you could screenshot and put directly into your
portfolio or GitHub.
    `,

    mentalModel: `
MENTAL MODEL — "The Discharge Summary"

A good discharge summary doesn't just dump every lab value ever
recorded — it synthesises the stay into the key findings a future
reader needs: what was abnormal, what trended, what to watch.
Your notebook today should read the same way: not a wall of raw
numbers, but a synthesised, narrated summary that highlights the
findings, written for a reader who wasn't there when you ran the
analysis.
    `,

    explanation: `
PROJECT BRIEF
================
Build "numpy Statistical Analysis Tool" as a Jupyter notebook
(.ipynb) with the following sections, each as its own markdown +
code cell pair:

1. SETUP
   - Import numpy (and matplotlib for one chart)
   - Set a random seed for reproducibility
   - State in markdown what dataset you're simulating and why

2. DATA GENERATION
   - Simulate a realistic dataset using np.random (e.g. 300
     patients' fasting glucose, or any domain you prefer —
     exam scores, sensor readings, crypto price deltas are all
     fine substitutes if you want variety)
   - Print shape, dtype, and the first few values to confirm it
     looks right

3. DESCRIPTIVE STATISTICS
   - Compute mean, median, sample std (ddof=1), min, max, and
     the 25th/50th/75th/90th percentiles
   - Present these in a clearly formatted printed summary

4. CONDITIONAL ANALYSIS
   - Use np.where() to bucket the data into at least 3 categories
     based on meaningful thresholds
   - Use np.unique(..., return_counts=True) to report how many
     fall into each bucket, with percentages

5. VISUAL SUMMARY
   - One histogram (plt.hist) showing the distribution, with a
     vertical line marking the mean (plt.axvline)

6. WRITTEN FINDINGS
   - A final markdown cell, written in your own words, summarising
     2–3 key findings as if reporting to a stakeholder

7. DISCIPLINE CHECK
   - Restart kernel, Run All, confirm everything still executes
     top-to-bottom with no errors
   - Clear outputs of any oversized cells before saving
    `,

    clinicalConnection: `
This project mirrors exactly what you'd produce reviewing a
batch of lab results across a patient cohort: simulate or pull
the data, summarise centrally and look at spread, flag anything
outside expected ranges, visualise the distribution, and write a
short narrative interpretation. The skills transfer directly —
only the tool (numpy instead of a clinical reporting system)
has changed.
    `,

    example: `
# Skeleton to adapt inside your notebook — not the full solution.
# Fill in the written findings and visual polish yourself.

import numpy as np
import matplotlib.pyplot as plt

np.random.seed(7)

# 1. Simulate a dataset (swap domain if you prefer)
glucose = np.random.normal(loc=100, scale=15, size=300)

# 2. Descriptive statistics
summary = {
    "mean":   glucose.mean(),
    "median": np.median(glucose),
    "std":    glucose.std(ddof=1),
    "min":    glucose.min(),
    "max":    glucose.max(),
    "p25":    np.percentile(glucose, 25),
    "p75":    np.percentile(glucose, 75),
    "p90":    np.percentile(glucose, 90),
}
for key, val in summary.items():
    print(f"{key:>6}: {val:.2f}")

# 3. Conditional bucketing
status = np.where(glucose >= 126, "Diabetic range",
          np.where(glucose >= 100, "Prediabetic range", "Normal"))
labels, counts = np.unique(status, return_counts=True)
for label, count in zip(labels, counts):
    print(f"{label}: {count} ({count/len(glucose)*100:.1f}%)")

# 4. Visual summary
plt.hist(glucose, bins=25, edgecolor="black")
plt.axvline(glucose.mean(), color="red", linestyle="--", label="Mean")
plt.title("Simulated Fasting Glucose Distribution (n=300)")
plt.xlabel("Glucose (mg/dL)")
plt.ylabel("Frequency")
plt.legend()
plt.show()

# 5. Written findings -> add as a markdown cell in your real notebook
    `,

    commonMistakes: [
      "Skipping the markdown narration and submitting a notebook of bare code cells — the written interpretation is graded as part of the deliverable, not optional polish.",
      "Not setting a random seed, making the 'reproducible' project produce different numbers every time it's reviewed.",
      "Forgetting the discipline check (Restart & Run All) before considering the notebook finished — a notebook that only works in its accidental execution order isn't done.",
      "Leaving giant, uncleared cell outputs (e.g. printing the full 300-element array) cluttering the notebook before saving/pushing to GitHub.",
    ],

    exercises: [
      "Build the full project notebook as specified in the brief above, using a dataset of your choice.",
      "Add one extra statistic not covered in the brief (e.g. skewness via a manual formula, or interquartile range) and explain in markdown why you chose it.",
      "Push the finished .ipynb to your GitHub (UvoTheMan/ds-ai-roadmap-progress or a dedicated repo) with a short README describing the project.",
      "Re-run the entire notebook with a different random seed and compare: do your written findings still hold, or were they oddly specific to the first seed?",
    ],

    resources: [
      {
        objective: "See a complete worked example of a numpy-based statistical notebook",
        items: [
          { title: "Kaggle — Learn: Pandas/NumPy micro-course (Exercises)", url: "https://www.kaggle.com/learn/pandas", type: "interactive", note: "Free, runnable notebooks with guided exercises — useful structural reference even though it leans pandas." },
        ],
      },
      {
        objective: "Polish notebook presentation and markdown formatting",
        items: [
          { title: "Jupyter official — Markdown Cells documentation", url: "https://jupyter-notebook.readthedocs.io/en/stable/examples/Notebook/Working%20With%20Markdown%20Cells.html", type: "reference", note: "Reference for formatting markdown cells cleanly: headers, lists, math, images." },
        ],
      },
      {
        objective: "Push the finished project to GitHub correctly",
        items: [
          { title: "GitHub Docs — Adding a file to a repository", url: "https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository", type: "article", note: "Quick reference for committing and pushing the finished notebook to your existing GitHub account." },
        ],
      },
    ],
  },

];

if (typeof module !== "undefined") {
  module.exports = { WEEK7 };
}
