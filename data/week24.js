// ============================================================
// WEEK 24 — numpy: Arrays, Vectorisation, and Broadcasting
// Days 116–120 | 23 Nov 2026 – 27 Nov 2026
// Phase 3: Data Science Core
// ============================================================

const WEEK24 = [

  // ============================================================
  // DAY 116 — numpy Arrays: Creation, Shape, and Dtype
  // ============================================================
  {
    id: "W24D1", week: 24, day: 1, phase: 3,
    phaseTitle: "Data Science Core",
    date: "2026-11-23",
    type: "lesson",
    topic: "numpy Arrays: Creation, Shape, and Dtype",
    duration: "2–3 hours",

    objectives: [
      "Understand what a numpy array is and how it differs from a Python list",
      "Create arrays using np.array(), np.zeros(), np.ones(), np.arange(), np.linspace()",
      "Inspect and control array shape, ndim, dtype, and size",
      "Reshape arrays using .reshape() and .flatten()",
    ],

    introduction: `
You have been using numpy indirectly for weeks — pandas is built
on top of it. Every time you computed df["price"].mean(), numpy
was doing the actual arithmetic under the hood. Today you go one
level deeper and work with numpy directly.

Why does this matter? Because the moment you move from pandas
DataFrames into machine learning — which starts in Week 29 — you
will be working with numpy arrays nonstop. Scikit-learn, TensorFlow,
and PyTorch all speak numpy. Understanding arrays at this level
removes the "magic" from ML code and makes you fluent in the
mathematical language of data science.

This week is also where Phase 3 transitions from "cleaning and
transforming data" to "understanding data mathematically."
    `,

    mentalModel: `
A Python list: can hold anything (ints, strings, objects mixed),
variable types, flexible. Slow for math.

A numpy array: ONE type for ALL elements, fixed size, stored in
a contiguous block of memory. Extremely fast for math.

The speed difference is fundamental: a list iterates one element
at a time. A numpy array sends ALL elements to compiled C/Fortran
routines that operate on the whole batch at once — this is
vectorisation, and it is the mathematical engine behind all of
modern data science and machine learning.

SHAPE: a 1D array [1, 2, 3] has shape (3,).
       a 2D array [[1,2],[3,4]] has shape (2, 2): 2 rows, 2 cols.
       a 3D array has shape (depth, rows, cols).

Understanding shape is non-negotiable in ML — the most common
error in machine learning is a shape mismatch between two arrays
that were supposed to align.
    `,

    explanation: `
CREATING ARRAYS

import numpy as np

np.array([1, 2, 3])               → 1D array from a list
np.array([[1, 2], [3, 4]])        → 2D array (matrix) from nested list
np.zeros((3, 4))                  → 3x4 array filled with 0.0
np.ones((2, 3))                   → 2x3 array filled with 1.0
np.full((3, 3), 7)                → 3x3 array filled with 7
np.eye(4)                         → 4x4 identity matrix (diagonal 1s)
np.arange(0, 10, 2)               → [0, 2, 4, 6, 8] (like range())
np.linspace(0, 1, 5)              → [0, 0.25, 0.5, 0.75, 1.0] (5 evenly spaced)
np.random.seed(42)
np.random.rand(3, 4)              → 3x4 array of random floats in [0, 1)
np.random.randint(0, 100, (3, 4)) → 3x4 array of random integers in [0, 100)

INSPECTING ARRAYS

arr.shape     → tuple of dimensions, e.g. (3, 4)
arr.ndim      → number of dimensions, e.g. 2
arr.dtype     → data type, e.g. float64, int32
arr.size      → total number of elements
arr.itemsize  → bytes per element

RESHAPING

arr.reshape(2, 6)    → reshape a 12-element 1D array into 2 rows x 6 cols
arr.flatten()        → collapse any shape into 1D
arr.T                → transpose (swap rows and columns)

DTYPE CONTROL

np.array([1, 2, 3], dtype=np.float64)   → force float
np.array([1.5, 2.7], dtype=np.int32)    → truncates to int: [1, 2]
arr.astype(np.float32)                  → convert existing array dtype
    `,

    clinicalConnection: `
Drug dosing tables are naturally 2D arrays: rows = patients,
columns = dosing time points (morning, noon, evening, night).
In hospital pharmacy systems these are literally stored as matrices.

A pharmacokinetic model — computing how drug concentration changes
over time in a patient's blood — is a mathematical function
operating on a vector (1D array) of time points and returning
a vector of concentrations. numpy's linspace is exactly what
you would use to define the time axis: "compute concentration
at 100 evenly-spaced points between 0 and 24 hours."

Understanding array shape and dtype at this level is also what
makes ML-based clinical decision support code debuggable. When
your model throws a "shapes (100, 5) and (5, 1) cannot be
broadcast together" error, knowing what those numbers mean lets
you fix it in seconds instead of hours.
    `,

    example: `
import numpy as np

# 1D array — drug prices
prices = np.array([850, 1200, 300, 950, 1500, 400])
print("Prices:", prices)
print("Shape:", prices.shape)
print("Dtype:", prices.dtype)

# 2D array — patient dosing schedule (3 patients x 4 time points)
dosing = np.array([
    [250, 250, 250, 0],   # Patient 1: morning, noon, evening, night
    [500, 0,   500, 0],   # Patient 2
    [250, 250, 0,   0],   # Patient 3
])
print("\nDosing schedule:")
print(dosing)
print("Shape:", dosing.shape)   # (3, 4)
print("ndim:", dosing.ndim)     # 2

# Create structured arrays
time_points = np.linspace(0, 24, 9)
print("\nTime points (0-24h):", time_points)

# Reshape
flat = np.arange(12)
matrix = flat.reshape(3, 4)
print("\nReshaped 1D to 3x4:")
print(matrix)
print("Transposed shape:", matrix.T.shape)
    `,

    expectedOutput: `
Prices: [ 850 1200  300  950 1500  400]
Shape: (6,)
Dtype: int64

Dosing schedule:
[[250 250 250   0]
 [500   0 500   0]
 [250 250   0   0]]
Shape: (3, 4)
ndim: 2

Time points (0-24h): [ 0.  3.  6.  9. 12. 15. 18. 21. 24.]

Reshaped 1D to 3x4:
[[ 0  1  2  3]
 [ 4  5  6  7]
 [ 8  9 10 11]]
Transposed shape: (4, 3)
    `,

    commonMistakes: [
      "Mixing types in a numpy array — np.array([1, 'two', 3]) upcasts everything to string dtype, silently breaking any subsequent math.",
      "Confusing .shape (tuple) with .size (total element count) — (3, 4).shape gives (3, 4); .size gives 12.",
      "Reshaping with incompatible sizes — np.arange(10).reshape(3, 4) raises an error because 10 != 3*4. Total elements must match.",
      "Forgetting that .T transposes rows and columns — useful for matrix multiplication alignment, but easy to apply accidentally and silently produce the wrong shape.",
      "Not setting np.random.seed() before generating random arrays — without it, every run produces different arrays, making code non-reproducible.",
    ],

    exercises: [
      "Create a 1D numpy array of 8 realistic drug prices (NGN). Print its shape, dtype, and size. Then convert it to float32 dtype.",
      "Create a 2D array representing a 5-patient, 3-timepoint dosing schedule (rows=patients, cols=time points). Print shape, ndim.",
      "Use np.linspace to create 100 evenly-spaced time points from 0 to 48 hours. Print the first 5 and last 5 values.",
      "Create a 6-element 1D array with np.arange(6, 30, 4). Reshape it to (2, 3). Print both the original and reshaped versions.",
      "Create a 4x4 identity matrix using np.eye(). What does each diagonal value represent conceptually (think matrix multiplication)?",
    ],

    exerciseAnswers: [
      `import numpy as np

prices = np.array([850, 1200, 300, 950, 1500, 400, 700, 600])
print("Shape:", prices.shape)     # (8,)
print("Dtype:", prices.dtype)     # int64
print("Size:", prices.size)       # 8
prices_f32 = prices.astype(np.float32)
print("New dtype:", prices_f32.dtype)  # float32`,

      `dosing = np.array([
    [250, 500, 250],
    [500, 0, 500],
    [250, 250, 0],
    [0, 0, 0],
    [500, 500, 250],
])
print("Shape:", dosing.shape)   # (5, 3)
print("ndim:", dosing.ndim)     # 2`,

      `time = np.linspace(0, 48, 100)
print("First 5:", time[:5])
print("Last 5:", time[-5:])
# First 5: [0, 0.484..., 0.969..., 1.454..., 1.939...]
# Last 5: [46.06..., 46.54..., 47.03..., 47.51..., 48.0]`,

      `arr = np.arange(6, 30, 4)
print("Original:", arr)          # [ 6 10 14 18 22 26]
reshaped = arr.reshape(2, 3)
print("Reshaped:\n", reshaped)   # [[6,10,14],[18,22,26]]`,

      `identity = np.eye(4)
print(identity)
# Diagonal values are all 1.0, off-diagonal are 0.0.
# In matrix multiplication: multiplying any matrix M by the
# identity matrix gives M back unchanged — it's the matrix
# equivalent of multiplying a number by 1.`,
    ],

    resources: [
      {
        objective: "Understand numpy array fundamentals",
        items: [
          { title: "numpy Quickstart Tutorial (official)", url: "https://numpy.org/doc/stable/user/quickstart.html", type: "article" },
          { title: "numpy arrays explained (Real Python)", url: "https://realpython.com/numpy-array-programming/", type: "article" },
        ],
      },
      {
        objective: "Practice array creation and reshaping",
        items: [
          { title: "numpy exercises (101 problems)", url: "https://github.com/rougier/numpy-100", type: "interactive" },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 117 — Indexing, Slicing, and Fancy Indexing
  // ============================================================
  {
    id: "W24D2", week: 24, day: 2, phase: 3,
    phaseTitle: "Data Science Core",
    date: "2026-11-24",
    type: "lesson",
    topic: "Array Indexing, Slicing, and Fancy Indexing",
    duration: "2–3 hours",

    objectives: [
      "Index and slice 1D and 2D numpy arrays with confidence",
      "Use boolean masking on numpy arrays",
      "Use fancy indexing (integer array indexing) to select non-contiguous elements",
      "Understand how numpy views differ from copies",
    ],

    introduction: `
Selecting elements from a numpy array is, on the surface, similar
to selecting from a Python list. But two numpy-specific features
make it fundamentally more powerful:

BOOLEAN MASKING — select elements based on a condition applied to
the whole array at once, with no loop needed.

FANCY INDEXING — select any arbitrary set of elements by passing
an array of indices, including non-contiguous, repeated, or
reordered selections.

Both of these patterns appear constantly in machine learning code:
selecting training samples, filtering predictions above a threshold,
reordering features. Understanding them now means ML code won't
feel like magic later.
    `,

    mentalModel: `
1D ARRAY INDEXING works exactly like Python list indexing:
  arr[0] → first element
  arr[-1] → last element
  arr[1:4] → elements at positions 1, 2, 3 (exclusive end)

2D ARRAY INDEXING uses TWO indices: [row, col]
  arr[0, 1] → first row, second column
  arr[0:2, 1:3] → first two rows, columns 1 and 2
  arr[:, 2] → ALL rows, column 2 (a whole column)
  arr[1, :] → row 1, ALL columns (a whole row)

BOOLEAN MASKING — generate a True/False array matching the shape
of your input, then use it as an index:
  mask = arr > 500
  arr[mask]  → returns only the elements where mask is True

FANCY INDEXING — pass an array of integer indices:
  arr[[0, 2, 4]]  → elements at positions 0, 2, and 4

VIEW VS COPY — slicing gives you a VIEW (changes to it modify
the original). Boolean masking and fancy indexing give you a COPY.
    `,

    explanation: `
1D INDEXING AND SLICING

arr = np.array([10, 20, 30, 40, 50, 60])
arr[0]       → 10
arr[-1]      → 60
arr[1:4]     → [20, 30, 40]
arr[::2]     → [10, 30, 50]   (every other element)
arr[::-1]    → [60, 50, 40, 30, 20, 10]  (reverse)

2D INDEXING AND SLICING

mat = np.array([[1, 2, 3],
                [4, 5, 6],
                [7, 8, 9]])
mat[0, 0]       → 1
mat[1, :]       → [4, 5, 6]   (row 1)
mat[:, 2]       → [3, 6, 9]   (column 2)
mat[0:2, 1:3]   → [[2,3],[5,6]]  (submatrix)
mat[2, 2]       → 9

BOOLEAN MASKING

prices = np.array([850, 1200, 300, 950, 1500])
mask = prices > 900
print(mask)           → [False  True False  True  True]
print(prices[mask])   → [ 1200   950  1500]
prices[prices < 400] = 400   → in-place: clip below 400

FANCY INDEXING

arr = np.array([10, 20, 30, 40, 50])
indices = np.array([0, 2, 4])
arr[indices]     → [10, 30, 50]
arr[[1, 1, 3]]   → [20, 20, 40]  (repeat allowed)

VIEW VS COPY

view = arr[1:4]       → VIEW: changes to view change original
view[0] = 999         → arr[1] is now 999

copy = arr[1:4].copy()   → COPY: independent of original
copy = arr[mask]          → boolean mask always returns a copy
copy = arr[[0, 2]]        → fancy index always returns a copy
    `,

    clinicalConnection: `
Boolean masking is how you would implement a clinical decision
rule on a computed array.

Imagine you have computed drug concentration over time as a
numpy array:

concentration = np.array([0.5, 2.1, 4.8, 3.2, 1.1, 0.3, 0.1])
time_hrs = np.array([0, 2, 4, 6, 8, 12, 24])

Therapeutic window: between 2.0 and 4.5 mg/L.
time_in_window = time_hrs[
    (concentration >= 2.0) & (concentration <= 4.5)
]

That gives you the hours when the drug concentration is
therapeutically effective — a genuine pharmacokinetic calculation
that numpy makes trivial, the same calculation that AUC (area
under the curve) computations in bioavailability studies depend on.
    `,

    example: `
import numpy as np

# Patient blood glucose readings (mg/dL), 8 readings per patient
glucose = np.array([
    [95,  88, 120, 145, 98,  82,  91, 105],   # Patient 1
    [130, 155, 200, 178, 145, 160, 143, 188],  # Patient 2 (diabetic)
    [88,  92,  85,  90,  87,  95,  91,  89],   # Patient 3 (normal)
])

# Select all readings for Patient 2
print("Patient 2 readings:", glucose[1, :])

# Select the 3rd reading (index 2) for all patients
print("3rd reading all patients:", glucose[:, 2])

# Boolean mask — flag hyperglycaemic readings (> 140 mg/dL)
hyper_mask = glucose > 140
print("\nHyperglycaemic readings:")
print(glucose[hyper_mask])

# Count hyper readings per patient using row-wise sum
print("\nHyperglycaemic readings per patient:")
print(hyper_mask.sum(axis=1))   # axis=1 = sum across columns

# Fancy indexing — get readings at hours 2, 4, 8 (indices 1, 3, 7)
selected = glucose[:, [1, 3, 7]]
print("\nReadings at hours 2, 4, 8:")
print(selected)
    `,

    expectedOutput: `
Patient 2 readings: [130 155 200 178 145 160 143 188]

3rd reading all patients: [120 200  85]

Hyperglycaemic readings:
[145 155 200 178 145 160 143 188]

Hyperglycaemic readings per patient:
[1 7 0]

Readings at hours 2, 4, 8:
[[ 88 145 105]
 [155 178 188]
 [ 92  90  89]]
    `,

    commonMistakes: [
      "Using arr[1][2] instead of arr[1, 2] for 2D indexing — both work but arr[1, 2] is significantly faster and is the correct numpy idiom.",
      "Modifying a slice and expecting the original to be unchanged — numpy slices are views, not copies. Use .copy() if you need independence.",
      "Applying boolean mask from a different-shaped array — the mask must exactly match the shape of the array you are indexing.",
      "Expecting fancy indexing to be a view — arr[[0, 1, 2]] always returns a copy, so modifying it does not change the original.",
      "Using Python 'and'/'or' for boolean operations on arrays — always use & and | with parentheses on numpy boolean arrays.",
    ],

    exercises: [
      "Create a 4x6 numpy array of random integers (0-100). Select the second row. Select the last column. Select the top-right 2x3 submatrix.",
      "Apply a boolean mask to your array to find all values above 70. How many are there? What percentage of the array does that represent?",
      "Replace all values below 20 in your array with 0 using boolean masking in-place.",
      "Use fancy indexing to select rows 0 and 3 simultaneously. Then select columns 1, 3, and 5 simultaneously.",
      "Demonstrate the view vs copy difference: slice rows 1:3 into a variable, change one element, and show that the original array also changed.",
    ],

    exerciseAnswers: [
      `import numpy as np
np.random.seed(42)
arr = np.random.randint(0, 100, (4, 6))
print(arr)
print("Row 1:", arr[1, :])
print("Last col:", arr[:, -1])
print("Top-right 2x3:", arr[0:2, 3:6])`,

      `mask = arr > 70
count = mask.sum()
pct = count / arr.size * 100
print(f"Values above 70: {count} ({pct:.1f}%)")`,

      `arr[arr < 20] = 0
print("After zeroing values below 20:")
print(arr)`,

      `rows = arr[[0, 3], :]
print("Rows 0 and 3:\n", rows)
cols = arr[:, [1, 3, 5]]
print("Columns 1, 3, 5:\n", cols)`,

      `original = arr.copy()
view = arr[1:3]
view[0, 0] = 9999
print("Original arr[1,0] after modifying view:", arr[1, 0])
# arr[1, 0] is now 9999 — the view modified the original
# Contrast: if you had done .copy(), the original would be unchanged`,
    ],

    resources: [
      {
        objective: "Master numpy indexing patterns",
        items: [
          { title: "numpy indexing (official docs)", url: "https://numpy.org/doc/stable/user/basics.indexing.html", type: "article" },
          { title: "numpy views vs copies explained", url: "https://numpy.org/doc/stable/user/basics.copies.html", type: "article" },
        ],
      },
      {
        objective: "Practice boolean masking and fancy indexing",
        items: [
          { title: "numpy-100 exercises (problems 25-50)", url: "https://github.com/rougier/numpy-100", type: "interactive" },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 118 — Vectorised Operations and Broadcasting
  // ============================================================
  {
    id: "W24D3", week: 24, day: 3, phase: 3,
    phaseTitle: "Data Science Core",
    date: "2026-11-25",
    type: "lesson",
    topic: "Vectorised Operations and Broadcasting",
    duration: "2–3 hours",

    objectives: [
      "Apply arithmetic and mathematical operations to whole arrays at once",
      "Use universal functions (ufuncs) like np.sqrt(), np.exp(), np.log()",
      "Understand numpy broadcasting rules for operations on different shapes",
      "Apply broadcasting to compute pairwise differences and normalisation",
    ],

    introduction: `
Broadcasting is the most powerful — and most confusing — feature
in numpy. It is what makes numpy look like it is doing impossible
things: adding a shape (3, 4) array to a shape (4,) array without
any loop, without any explicit tiling. Understanding it removes
the magic and makes you a genuinely fluent numpy user.

It is also unavoidable in machine learning: normalising features,
computing distances between data points, applying per-feature
scaling — all of these use broadcasting. You will write code
that uses it whether you understand it or not. Understanding it
means you write it correctly and debug it when it fails.
    `,

    mentalModel: `
VECTORISED OPERATIONS: apply an operation to every element of an
array simultaneously, with no Python loop.
  arr * 2       → doubles every element
  arr + arr2    → adds corresponding elements (same shape)
  np.sqrt(arr)  → square root of every element

BROADCASTING: numpy's rules for making operations work between
arrays of DIFFERENT but COMPATIBLE shapes.

The rules (simplified):
1. Arrays must have the same number of dimensions, OR the smaller
   one gets padded on the LEFT with size-1 dimensions.
2. Dimensions are compatible if they are equal OR one of them is 1.
3. A size-1 dimension is STRETCHED to match the other array.

Example:
  shape (3, 4) + shape (4,) → shape (4,) is treated as (1, 4)
  → (1, 4) stretches to (3, 4) → element-wise addition works

Think of it as numpy automatically repeating the smaller array
to fill the shape of the larger one, without actually copying
the data (memory-efficient).
    `,

    explanation: `
VECTORISED ARITHMETIC

a = np.array([10, 20, 30, 40])
a + 5           → [15, 25, 35, 45]   (scalar broadcast)
a * 2           → [20, 40, 60, 80]
a ** 2          → [100, 400, 900, 1600]
a / a.max()     → [0.25, 0.5, 0.75, 1.0]   (normalise to [0,1])

ELEMENT-WISE WITH TWO ARRAYS (same shape)

b = np.array([1, 2, 3, 4])
a + b           → [11, 22, 33, 44]
a * b           → [10, 40, 90, 160]

UNIVERSAL FUNCTIONS (ufuncs)

np.sqrt(a)      → element-wise square root
np.exp(a)       → element-wise e^x
np.log(a)       → element-wise natural log
np.abs(a)       → element-wise absolute value
np.round(a, 2)  → round each element to 2 decimal places
np.maximum(a, b)  → element-wise maximum of two arrays
np.clip(a, 20, 35) → clip values to range [20, 35]

AGGREGATE OPERATIONS

a.sum()         → sum of all elements
a.mean()        → arithmetic mean
a.std()         → standard deviation
a.min(), a.max()
np.median(a)    → median

ON 2D ARRAYS: specify axis=
mat.sum(axis=0)  → sum DOWN each column → shape (ncols,)
mat.sum(axis=1)  → sum ACROSS each row → shape (nrows,)
mat.mean(axis=0) → mean of each column

BROADCASTING EXAMPLES

prices = np.array([[850, 1200, 300],   # shop 1
                   [900, 1150, 280]])   # shop 2
tax_rates = np.array([0.075, 0.05, 0.10])   # per product

# prices shape: (2, 3)
# tax_rates shape: (3,) — broadcasts to (2, 3) automatically
prices_with_tax = prices * (1 + tax_rates)
    `,

    clinicalConnection: `
Min-max normalisation — scaling all feature values to the range
[0, 1] — is one of the first preprocessing steps in almost every
machine learning model. In clinical data science, this is applied
to patient features (age, weight, lab values) before training:

data = np.array([[34, 68.5, 120], [45, 80.2, 145], [29, 55.0, 98]])
# columns: age, weight_kg, glucose_mg_dl

col_min = data.min(axis=0)    # min per feature (shape: (3,))
col_max = data.max(axis=0)    # max per feature (shape: (3,))
normalised = (data - col_min) / (col_max - col_min)

That subtraction and division both use broadcasting — (2, 3) minus
(3,) operates column-wise automatically. This single operation
normalises all patients across all features simultaneously. In
Week 29 (Machine Learning), this will be one of your first
preprocessing steps.
    `,

    example: `
import numpy as np

# Patient features: age, weight (kg), glucose (mg/dL)
patients = np.array([
    [34, 68.5, 120],
    [45, 80.2, 145],
    [29, 55.0,  98],
    [52, 90.1, 200],
    [38, 72.3, 115],
])

print("Raw patient data:")
print(patients)

# Column-wise stats using axis=0
print("\nMean per feature:", patients.mean(axis=0).round(1))
print("Std per feature:", patients.std(axis=0).round(1))

# Min-max normalisation (broadcasting)
col_min = patients.min(axis=0)
col_max = patients.max(axis=0)
normalised = (patients - col_min) / (col_max - col_min)
print("\nNormalised [0, 1]:")
print(normalised.round(3))

# Clip glucose values to therapeutic range [70, 180]
glucose = patients[:, 2]
clipped = np.clip(glucose, 70, 180)
print("\nGlucose clipped to [70, 180]:", clipped)
    `,

    expectedOutput: `
Raw patient data:
[[ 34.   68.5 120. ]
 [ 45.   80.2 145. ]
 [ 29.   55.   98. ]
 [ 52.   90.1 200. ]
 [ 38.   72.3 115. ]]

Mean per feature: [ 39.6  73.2 135.6]
Std per feature: [ 8.4 12.0  36.6]

Normalised [0, 1]:
[[0.217 0.382 0.216]
 [0.696 0.716 0.461]
 [0.    0.    0.   ]
 [1.    1.    1.   ]
 [0.391 0.501 0.167]]

Glucose clipped to [70, 180]: [120 145  98 180 115]
    `,

    commonMistakes: [
      "Confusing element-wise multiplication (*) with matrix multiplication (@) — arr1 * arr2 multiplies corresponding elements; arr1 @ arr2 is the dot product. Both are valid; they do different things.",
      "Getting a broadcasting error and not knowing why — always check .shape on both arrays first. The right-most dimensions must be equal or one must be 1.",
      "Using .sum() without axis= on a 2D array expecting column sums — without axis, .sum() returns a single scalar (sum of everything).",
      "Forgetting that division by zero produces inf or nan (not an error) in numpy — always check for zeros before dividing, especially in normalisation.",
      "Assuming arr1 + arr2 sums everything — it adds element-wise. For the scalar sum of all elements combined, use (arr1 + arr2).sum().",
    ],

    exercises: [
      "Create a (4, 3) array of drug prices. Add a 7.5% VAT to every element using broadcasting with a scalar. Round to 2 decimal places.",
      "Create a (3, 4) array of patient glucose readings. Compute the mean and standard deviation per patient (axis=1). Print both.",
      "Normalise the glucose array column-wise to [0, 1] using min-max normalisation with broadcasting. Confirm the min of each column in the result is 0 and the max is 1.",
      "Create two (4,) arrays (morning and evening glucose). Use np.maximum() to find the higher reading at each time point.",
      "Compute the z-score of each column in the patient features array: (value - column_mean) / column_std. Use broadcasting. Print the result rounded to 2 decimal places.",
    ],

    exerciseAnswers: [
      `import numpy as np
np.random.seed(42)
prices = np.random.randint(300, 2000, (4, 3)).astype(float)
prices_vat = (prices * 1.075).round(2)
print(prices_vat)`,

      `np.random.seed(0)
glucose = np.random.randint(80, 220, (3, 4))
print(glucose)
print("Mean per patient:", glucose.mean(axis=1).round(1))
print("Std per patient:", glucose.std(axis=1).round(1))`,

      `col_min = glucose.min(axis=0)
col_max = glucose.max(axis=0)
normalised = (glucose - col_min) / (col_max - col_min)
print(normalised.round(3))
print("Min per col:", normalised.min(axis=0))   # all 0
print("Max per col:", normalised.max(axis=0))   # all 1`,

      `morning = np.array([95, 145, 88, 200])
evening = np.array([110, 130, 95, 175])
higher = np.maximum(morning, evening)
print("Higher reading at each point:", higher)
# [110, 145, 95, 200]`,

      `patients = np.array([
    [34, 68.5, 120], [45, 80.2, 145],
    [29, 55.0,  98], [52, 90.1, 200], [38, 72.3, 115],
])
col_mean = patients.mean(axis=0)
col_std  = patients.std(axis=0)
z_scores = ((patients - col_mean) / col_std).round(2)
print(z_scores)
# Each column now has mean ~0 and std ~1`,
    ],

    resources: [
      {
        objective: "Understand numpy broadcasting rules",
        items: [
          { title: "numpy broadcasting guide (official)", url: "https://numpy.org/doc/stable/user/basics.broadcasting.html", type: "article" },
          { title: "numpy ufuncs documentation", url: "https://numpy.org/doc/stable/reference/ufuncs.html", type: "article" },
        ],
      },
      {
        objective: "Practice vectorised operations",
        items: [
          { title: "numpy array programming (Real Python deep dive)", url: "https://realpython.com/numpy-array-programming/", type: "article" },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 119 — Linear Algebra Fundamentals with numpy
  // ============================================================
  {
    id: "W24D4", week: 24, day: 4, phase: 3,
    phaseTitle: "Data Science Core",
    date: "2026-11-26",
    type: "lesson",
    topic: "Linear Algebra Fundamentals with numpy",
    duration: "2–3 hours",

    objectives: [
      "Perform matrix multiplication using @ and np.dot()",
      "Compute the transpose, inverse, and determinant of a matrix",
      "Solve a system of linear equations using np.linalg.solve()",
      "Understand the intuition behind dot products and matrix multiplication",
    ],

    introduction: `
Linear algebra is the mathematical language of machine learning.
Every neural network layer is a matrix multiplication. Every
linear regression is a matrix equation. Principal Component
Analysis (PCA, coming in Week 31) uses eigenvectors and
eigenvalues. Knowing these tools, even at an intuitive level,
makes ML code far less opaque.

Today is not a mathematics course. You will learn enough to:
  - Understand what matrix multiplication does geometrically
  - Implement it correctly in numpy
  - Solve a simple clinical equation system
  - Know what inverse, determinant, and transpose mean at an
    intuitive level, so ML documentation makes sense

The goal is fluency in the concepts, not mathematical proof.
    `,

    mentalModel: `
DOT PRODUCT (1D arrays): multiplies corresponding elements and
sums the results. It is a measure of "similarity" or "alignment":
  [1, 2, 3] . [4, 5, 6] = 1*4 + 2*5 + 3*6 = 32

MATRIX MULTIPLICATION (2D arrays): each element of the output
is the dot product of a ROW from the left matrix and a COLUMN
from the right matrix. Shape (m, k) @ (k, n) → (m, n).
The inner dimensions MUST match.

TRANSPOSE (arr.T): flips rows and columns. Used constantly to
make matrix multiplication shapes align.

INVERSE (np.linalg.inv(A)): the matrix equivalent of 1/x.
A @ A_inv = Identity matrix. Used in solving systems of equations.

DETERMINANT (np.linalg.det(A)): a scalar value summarising
the matrix. If det = 0, the matrix has no inverse (like 1/0).

SOLVING Ax = b: given a matrix A of coefficients and a vector b
of results, find the vector x. This is the core of linear regression.
    `,

    explanation: `
MATRIX MULTIPLICATION

A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])

A @ B              → matrix multiplication
np.dot(A, B)       → same result
A * B              → element-wise (NOT matrix mult)

Shape rule: (m, k) @ (k, n) → (m, n)
The inner dimensions (k) must match.

TRANSPOSE

A.T                → swap rows and columns
(A.T).shape        → if A is (3, 5), A.T is (5, 3)

INVERSE AND DETERMINANT

np.linalg.inv(A)   → inverse of A (A must be square, det != 0)
np.linalg.det(A)   → determinant of A

SOLVING SYSTEMS OF EQUATIONS

np.linalg.solve(A, b)
→ solves Ax = b for x
→ far more numerically stable than computing inv(A) @ b

Example: 2x + 3y = 13, 5x + y = 8
A = np.array([[2, 3], [5, 1]])
b = np.array([13, 8])
x = np.linalg.solve(A, b)   → solution vector [x, y]

NORMS (vector length)

np.linalg.norm(v)         → Euclidean (L2) norm
np.linalg.norm(v, ord=1)  → L1 norm (sum of abs values)

EIGENVALUES AND EIGENVECTORS (preview)

eigenvalues, eigenvectors = np.linalg.eig(A)
→ used in PCA and dimensionality reduction (Week 31)
    `,

    clinicalConnection: `
Pharmacokinetic modelling uses systems of differential equations
that simplify to matrix equations in discrete time steps.

A two-compartment model (drug in blood + tissue) at steady state
can be written as Ax = b, where A contains the transfer rate
constants between compartments and b is the dosing vector.
np.linalg.solve() gives you the steady-state concentration in
each compartment directly, without iterative simulation.

At a more practical level, the linear regression you will
implement in Week 30 for predicting drug adherence from patient
features IS, mathematically, the equation:
  coefficients = (X.T @ X)^-1 @ X.T @ y

Every @ is a matrix multiplication. Every .T is a transpose.
np.linalg.solve() is the numerically stable way to compute
the exact same thing. Knowing what these operations mean
means the ML formula does not look like gibberish.
    `,

    example: `
import numpy as np

# Matrix multiplication — feature matrix x weight vector
# (like a single neuron in a neural network)
X = np.array([[1, 2, 3],
              [4, 5, 6],
              [7, 8, 9]])
w = np.array([0.1, 0.5, 0.3])   # weights/coefficients
output = X @ w                    # shape (3,): one output per row
print("Neural net-style output:", output.round(3))

# Solving a system of equations
# Drug A and Drug B both contribute to patient score
# 3a + 2b = 12 (patient 1 score equation)
# a  + 4b = 11 (patient 2 score equation)
A = np.array([[3, 2], [1, 4]])
b = np.array([12, 11])
solution = np.linalg.solve(A, b)
print("\nSolution [a, b]:", solution.round(3))

# Verify: A @ solution should equal b
print("Verification:", np.allclose(A @ solution, b))

# Transpose usage
feature_matrix = np.random.rand(5, 3)   # 5 samples, 3 features
gram_matrix = feature_matrix.T @ feature_matrix  # (3, 3)
print("\nGram matrix shape:", gram_matrix.shape)
print("Determinant:", np.linalg.det(gram_matrix).round(4))
    `,

    expectedOutput: `
Neural net-style output: [1.4 3.5 5.6]

Solution [a, b]: [2. 3.]

Verification: True

Gram matrix shape: (3, 3)
Determinant: 0.xxxx   (varies by random seed)
    `,

    commonMistakes: [
      "Using * for matrix multiplication — arr1 * arr2 is element-wise (Hadamard product), not matrix multiplication. Always use @ or np.dot() for true matrix multiplication.",
      "Getting shape errors in matrix multiplication without checking the inner dimensions — always print both shapes before multiplying: a.shape, b.shape.",
      "Computing inv(A) @ b instead of np.linalg.solve(A, b) — computing the inverse is slower and less numerically stable. Use solve() whenever you are solving Ax = b.",
      "Expecting a square matrix when computing eigenvalues — np.linalg.eig() only works on square matrices. Non-square uses np.linalg.svd() instead.",
      "Forgetting that matrix multiplication is NOT commutative: A @ B != B @ A in general. Order matters.",
    ],

    exercises: [
      "Create a (3, 3) matrix A and a (3,) vector b. Compute A @ b and print the result. What shape is it?",
      "Verify that a matrix times its inverse equals the identity matrix: compute A @ np.linalg.inv(A) and print. Use np.allclose() to confirm it equals np.eye(3).",
      "Solve this system: 2x + y = 5, 3x + 4y = 10. Use np.linalg.solve(). Verify by plugging the solution back into both equations.",
      "Compute the Euclidean distance between two 3D patient feature vectors [34, 68.5, 120] and [45, 80.2, 145] using np.linalg.norm(v1 - v2).",
      "Build a simple dot-product 'similarity score': given two 1D arrays representing patient drug profiles, compute their dot product. What does a larger dot product mean intuitively?",
    ],

    exerciseAnswers: [
      `import numpy as np
np.random.seed(1)
A = np.array([[2, 1, 0], [1, 3, 1], [0, 1, 4]])
b = np.array([5, 10, 7])
result = A @ b
print("A @ b:", result)   # [20, 42, 38]
print("Shape:", result.shape)  # (3,)`,

      `A = np.array([[2., 1.], [3., 4.]])
A_inv = np.linalg.inv(A)
product = A @ A_inv
print(product)
print("Is identity?", np.allclose(product, np.eye(2)))  # True`,

      `A = np.array([[2., 1.], [3., 4.]])
b = np.array([5., 10.])
x = np.linalg.solve(A, b)
print("Solution:", x.round(3))   # [2., 1.]
print("Verify eq1:", np.allclose(2*x[0] + x[1], 5))    # True
print("Verify eq2:", np.allclose(3*x[0] + 4*x[1], 10)) # True`,

      `p1 = np.array([34, 68.5, 120])
p2 = np.array([45, 80.2, 145])
dist = np.linalg.norm(p2 - p1)
print(f"Euclidean distance: {dist:.2f}")
# sqrt((45-34)^2 + (80.2-68.5)^2 + (145-120)^2) = sqrt(121+136.89+625) = ~29.4`,

      `patient_a = np.array([1, 0, 1, 0, 1])   # takes drugs 1, 3, 5
patient_b = np.array([1, 1, 0, 0, 1])   # takes drugs 1, 2, 5
patient_c = np.array([0, 0, 0, 1, 0])   # takes drug 4 only
print("A-B similarity:", np.dot(patient_a, patient_b))  # 2 (share 2 drugs)
print("A-C similarity:", np.dot(patient_a, patient_c))  # 0 (no shared drugs)
# Larger dot product = more drugs in common = more similar drug profiles`,
    ],

    resources: [
      {
        objective: "Understand matrix multiplication intuitively",
        items: [
          { title: "3Blue1Brown — Essence of Linear Algebra (YouTube series)", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab", type: "video" },
          { title: "numpy.linalg documentation", url: "https://numpy.org/doc/stable/reference/routines.linalg.html", type: "article" },
        ],
      },
      {
        objective: "Connect linear algebra to machine learning",
        items: [
          { title: "Linear algebra for ML (fast.ai)", url: "https://www.fast.ai/posts/2017-01-14-fastai-blog.html", type: "article" },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 120 — PROJECT: numpy Statistical Analysis
  // ============================================================
  {
    id: "W24D5", week: 24, day: 5, phase: 3,
    phaseTitle: "Data Science Core",
    date: "2026-11-27",
    type: "project",
    topic: "Project: numpy Statistical Analysis",
    duration: "3–4 hours",

    objectives: [
      "Apply Week 24 numpy skills to a real statistical analysis task",
      "Compute descriptive statistics, normalise data, and detect outliers",
      "Use boolean masking and broadcasting on a realistic clinical dataset",
      "Demonstrate the performance difference between numpy and pure Python loops",
    ],

    introduction: `
This project ties together the whole Week 24 toolkit: array
creation, slicing, boolean masking, vectorised operations,
broadcasting, and linear algebra. You will work with a clinical
dataset (patient features and lab values) and run a complete
statistical analysis using numpy — the kind of analysis that
feeds directly into the machine learning pipeline you will build
starting in Week 29.
    `,

    mentalModel: `
The analysis pipeline for this project:

1. CREATE a structured patient features array
   (rows=patients, cols=features)
2. DESCRIPTIVE STATS — mean, std, min, max per feature (axis=0)
3. NORMALISE — min-max scaling using broadcasting
4. OUTLIER DETECTION — z-score based, using vectorised operations
5. BOOLEAN MASKING — find patients meeting clinical criteria
6. BENCHMARKING — compare numpy vectorised vs pure Python loop
7. LINEAR ALGEBRA — solve a simple clinical equation system
    `,

    explanation: `
PROJECT BRIEF

Build a (50, 5) numpy array representing 50 patients with 5 features:
  - age (years, normally distributed around 45)
  - weight (kg, normally distributed around 70)
  - glucose (mg/dL, bimodal: ~90 for normal, ~160 for diabetic)
  - systolic_bp (mmHg, normally distributed around 125)
  - cholesterol (mg/dL, normally distributed around 190)

Use np.random.seed(42) for reproducibility.

Then:

Q1: Compute mean, std, min, max per feature (axis=0)
Q2: How many patients are hypertensive (systolic_bp > 140)?
Q3: How many are diabetic (glucose > 126 mg/dL)?
Q4: What fraction are BOTH hypertensive AND diabetic?
Q5: Normalise all features to [0, 1]. Verify by checking
    min and max of each column in the result.
Q6: Compute z-scores for glucose. Flag patients with
    |z| > 2 as extreme values. How many are flagged?
Q7: Compute the Euclidean distance between the first patient
    and every other patient (hint: np.linalg.norm with axis=1)
Q8: Benchmark: sum all 250 values (a) with numpy .sum()
    and (b) with a Python for loop. Print both times.
    `,

    clinicalConnection: `
This project is a simplified version of the first analytical step
in every clinical predictive modelling study: characterising your
patient cohort before building any model.

In real clinical research, the equivalent is Table 1 of a paper —
the "Characteristics of Study Participants" table showing mean ± SD
for continuous variables, count and % for categorical, with
subgroups defined by disease status. You are computing exactly
that, using numpy, on a simulated cohort.

By the end of Week 32 (Capstone), you will apply these exact
skills to real clinical datasets (something from Kaggle or a
Nigerian health data source, if available). This project is the
scaffolding that makes that capstone possible.
    `,

    example: `
import numpy as np
import time

np.random.seed(42)

# Build synthetic patient features array (50 patients, 5 features)
n = 50
ages         = np.random.normal(45, 12, n).clip(18, 85)
weights      = np.random.normal(70, 15, n).clip(40, 130)
glucose      = np.concatenate([
    np.random.normal(90, 10, n//2),    # non-diabetic
    np.random.normal(160, 20, n//2),   # diabetic
])
systolic_bp  = np.random.normal(125, 20, n).clip(80, 200)
cholesterol  = np.random.normal(190, 35, n).clip(100, 300)

patients = np.column_stack([ages, weights, glucose, systolic_bp, cholesterol])
feature_names = ["age", "weight", "glucose", "systolic_bp", "cholesterol"]

print("Patient matrix shape:", patients.shape)

# Q1: Descriptive statistics
print("\nMean per feature:")
for name, val in zip(feature_names, patients.mean(axis=0)):
    print(f"  {name}: {val:.1f}")
    `,

    expectedOutput: `
Patient matrix shape: (50, 5)

Mean per feature:
  age: 44.5
  weight: 70.2
  glucose: 125.4
  systolic_bp: 124.8
  cholesterol: 191.3

(Q2-Q8 outputs depend on your seed and full implementation.
 Approximate expected results with seed=42:
  Hypertensive (BP>140): ~14 patients
  Diabetic (glucose>126): ~25 patients
  Both: ~7-8 patients
  Extreme glucose z-scores (|z|>2): ~3-5 patients)
    `,

    commonMistakes: [
      "Forgetting np.random.seed(42) at the top — without it, every run gives different arrays and your counts won't match expected values.",
      "Using Python .clip() on a numpy array — numpy arrays have their own .clip() method that is vectorised. Don't iterate.",
      "Building the patient array with np.concatenate then forgetting to shuffle — the first 25 rows will all be non-diabetic, last 25 all diabetic, which can bias some analyses.",
      "Using np.linalg.norm without axis=1 for row-wise distances — without axis, it returns the norm of the entire flattened matrix.",
      "Not using np.random.seed() in the benchmark test — timing results can vary between runs; explain in a comment that timing is approximate.",
    ],

    exercises: [
      "Build the full 50x5 patient matrix as described. Print shape, confirm dtype is float64.",
      "Answer Q1 (mean/std/min/max per feature) and Q2-Q4 (hypertension/diabetes counts and overlap) with clearly labelled print statements.",
      "Answer Q5 (normalise to [0,1]) and verify by printing the min and max of each column in the normalised result.",
      "Answer Q6 (z-score outlier detection for glucose) and print the indices and glucose values of flagged patients.",
      "Answer Q7 (Euclidean distance from patient 0 to all others) and print the index of the most similar patient. Then benchmark Q8 (numpy sum vs Python loop sum) and print both times.",
    ],

    exerciseAnswers: [
      `import numpy as np
import time

np.random.seed(42)
n = 50
ages        = np.random.normal(45, 12, n).clip(18, 85)
weights     = np.random.normal(70, 15, n).clip(40, 130)
glucose     = np.concatenate([np.random.normal(90, 10, n//2),
                              np.random.normal(160, 20, n//2)])
systolic_bp = np.random.normal(125, 20, n).clip(80, 200)
cholesterol = np.random.normal(190, 35, n).clip(100, 300)
patients = np.column_stack([ages, weights, glucose, systolic_bp, cholesterol])
print("Shape:", patients.shape)
print("Dtype:", patients.dtype)`,

      `feature_names = ["age", "weight", "glucose", "systolic_bp", "cholesterol"]
stats = np.array([patients.mean(axis=0), patients.std(axis=0),
                  patients.min(axis=0), patients.max(axis=0)])
print("Feature stats (mean/std/min/max):")
for name, m, s, mn, mx in zip(feature_names, *stats):
    print(f"  {name}: mean={m:.1f} std={s:.1f} min={mn:.1f} max={mx:.1f}")

hypertensive = patients[:, 3] > 140
diabetic = patients[:, 2] > 126
print(f"\nHypertensive: {hypertensive.sum()}")
print(f"Diabetic: {diabetic.sum()}")
print(f"Both: {(hypertensive & diabetic).sum()}")`,

      `col_min = patients.min(axis=0)
col_max = patients.max(axis=0)
normalised = (patients - col_min) / (col_max - col_min)
print("Min per col:", normalised.min(axis=0).round(6))
print("Max per col:", normalised.max(axis=0).round(6))
# All mins should be 0.0, all maxes should be 1.0`,

      `glucose_col = patients[:, 2]
z_glucose = (glucose_col - glucose_col.mean()) / glucose_col.std()
extreme_mask = np.abs(z_glucose) > 2
print(f"Extreme glucose patients: {extreme_mask.sum()}")
print("Indices:", np.where(extreme_mask)[0])
print("Glucose values:", glucose_col[extreme_mask].round(1))`,

      `# Q7: distances from patient 0
diffs = patients[1:] - patients[0]
distances = np.linalg.norm(diffs, axis=1)
most_similar_idx = np.argmin(distances) + 1  # +1 because we skipped index 0
print(f"Most similar to patient 0: patient {most_similar_idx} (dist={distances.min():.2f})")

# Q8: benchmark
t1 = time.time()
_ = patients.sum()
t2 = time.time()
numpy_time = t2 - t1

t3 = time.time()
total = 0
for row in patients:
    for val in row:
        total += val
t4 = time.time()
loop_time = t4 - t3

print(f"\nnumpy .sum(): {numpy_time*1e6:.2f} microseconds")
print(f"Python loop: {loop_time*1e6:.2f} microseconds")
print(f"numpy is ~{loop_time/numpy_time:.0f}x faster")`,
    ],

    resources: [
      {
        objective: "Review the full Week 24 numpy toolkit",
        items: [
          { title: "numpy for data science — full summary (freeCodeCamp)", url: "https://www.youtube.com/watch?v=QUT1VHiLmmI", type: "video" },
          { title: "numpy cheat sheet (DataCamp)", url: "https://www.datacamp.com/cheat-sheet/numpy-cheat-sheet-data-analysis-in-python", type: "article" },
        ],
      },
      {
        objective: "Prepare for statistical analysis in Phase 3",
        items: [
          { title: "Scipy stats module — extends numpy for statistics", url: "https://docs.scipy.org/doc/scipy/reference/stats.html", type: "article" },
        ],
      },
    ],
  },

];
