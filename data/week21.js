// ============================================================
// WEEK 21 — pandas Fundamentals: DataFrames, Series, Indexing
// Days 101–105 | 2 Nov 2026 – 6 Nov 2026
// Phase 3: Data Science Core
// Enriched: Mental Models, Clinical Connections,
//           Objective-mapped resources, Expected Outputs,
//           Exercise Answers
// ============================================================

const WEEK21 = [

  // ============================================================
  // DAY 101 — DataFrames: Creating, Reading, Inspecting
  // ============================================================
  {
    id: "W21D1", week: 21, day: 1, phase: 3,
    phaseTitle: "Data Science Core",
    date: "2026-11-02",
    type: "lesson",
    topic: "DataFrames: Creating, Reading, and Inspecting Data",
    duration: "2–3 hours",

    objectives: [
      "Understand what a DataFrame is and why it is the core pandas structure",
      "Create DataFrames from dictionaries, lists, and CSV files",
      "Use .head(), .tail(), .shape, .info(), and .describe() to inspect data",
      "Understand the difference between index and columns",
    ],

    introduction: `
Welcome to Phase 3, Victor — Data Science Core.

You have spent Phase 2 building pipelines that move data. Now you 
learn to actually understand it. That shift is fundamental. A data 
engineer asks "did the data arrive?" A data scientist asks "what 
does the data say?"

pandas is the Python library that makes that second question 
answerable. It gives you a structure — the DataFrame — that thinks 
about data the way you naturally do: as a table with rows, columns, 
and labels, not just bytes in a file.

This week, you build the core muscle memory that underpins 
everything in Phase 3: creating DataFrames, understanding their 
shape, and inspecting them before you analyse anything. Getting 
inspection right is the difference between knowing what you have 
and assuming what you have — a distinction that matters enormously 
when the stakes are clinical.
    `,

    mentalModel: `
Think of a DataFrame as a spreadsheet that is also a programmable 
object.

Every spreadsheet you have ever opened has the same anatomy: rows 
(records), columns (variables/features), and a header row that 
names each column. A pandas DataFrame has exactly the same anatomy, 
but with two additions:

1. AN INDEX — an explicit row label on the left, like a row number 
   or a patient ID. In a spreadsheet you scroll down to count rows. 
   In pandas, df.index tells you exactly what labels your rows carry.

2. DTYPE AWARENESS — each column has a declared data type (int64, 
   float64, object, datetime64). pandas uses this to enforce logic, 
   catch errors, and enable fast vectorised operations on millions 
   of rows in milliseconds.

Most real DataFrames come from CSV files. The mental model is 
simple: pd.read_csv() opens the file, turns row 1 into column 
headers, and makes every subsequent row a record. The result is a 
table you can slice, filter, and compute on.
    `,

    explanation: `
CREATING A DATAFRAME

The most common ways:

1. FROM A DICTIONARY (for small/test datasets):
   Each key becomes a column name; each list becomes that column's values.

   import pandas as pd

   data = {
       "drug": ["Metformin", "Amlodipine", "Amoxicillin"],
       "category": ["Antidiabetic", "Antihypertensive", "Antibiotic"],
       "price_ngn": [850, 950, 1200],
   }
   df = pd.DataFrame(data)

2. FROM A CSV FILE (most common in real work):
   pd.read_csv("sales.csv") reads the file into a DataFrame.
   Common parameters: sep, header, index_col, parse_dates, na_values.

INSPECTING A DATAFRAME

Five commands you run on every new dataset, in this order:

df.shape      → (rows, columns) as a tuple — how big is this?
df.head(5)    → first 5 rows — what does the data look like?
df.tail(5)    → last 5 rows — does it end cleanly or get messy?
df.info()     → column names, dtypes, and non-null counts — any
               missing data? are dates stored as strings?
df.describe() → count, mean, std, min, max, quartiles for numeric
               columns — are there outliers? unreasonable values?

THE INDEX

By default pandas assigns a RangeIndex (0, 1, 2, ...) — like row 
numbers. You can change it: df.set_index("patient_id") makes 
patient IDs the row label, which means you can look up any patient 
by ID instead of position. This matters enormously for merging and 
joining datasets later.

COLUMN ACCESS

df["column_name"]       → returns that column as a Series
df[["col1", "col2"]]    → returns a sub-DataFrame with those columns
df.column_name          → dot notation (works when name has no spaces)
    `,

    clinicalConnection: `
In pharmacy practice, every dispensing record is a row. Every 
attribute — drug name, strength, patient ID, prescriber, date, 
quantity — is a column. You have been reading these tables manually 
on paper or a hospital system screen your entire career.

pandas DataFrames are that same mental model, now programmable.

When you call df.info() and see that "date_dispensed" has dtype 
"object" instead of "datetime64", that is the equivalent of 
noticing someone has written dates as "12 Oct 2026" in some rows 
and "2026-10-12" in others — a data quality problem you would catch 
in a clinical audit.

df.describe() showing a minimum age of -3 in a patient dataset is 
the equivalent of a prescription with a date of birth clearly 
impossible — something your clinical training makes you catch 
immediately, even if a junior data analyst might miss it.

Your Pharm.D eye for data quality is a genuine asset here. Use it.
    `,

    example: `
import pandas as pd

# --- Create a small pharmacy dispensing DataFrame ---
data = {
    "patient_id": [1, 2, 3, 4, 5],
    "full_name":  ["Adaeze Okafor", "Chinedu Eze", "Fatima Bello",
                   "Tunde Bakare", "Ngozi Umeh"],
    "drug":       ["Metformin 500mg", "Amoxicillin 500mg",
                   "Paracetamol 500mg", "Amlodipine 5mg",
                   "Artemether/Lumefantrine"],
    "quantity":   [60, 21, 30, 30, 6],
    "price_ngn":  [1700, 1200, 300, 950, 3000],
    "dispensed":  ["2025-05-01", "2025-05-02", "2025-05-03",
                   "2025-05-04", "2025-05-05"],
}

df = pd.DataFrame(data)

# --- Basic inspection ---
print("Shape:", df.shape)
print()
print(df.head())
print()
print(df.info())
print()
print(df.describe())
    `,

    expectedOutput: `
Shape: (5, 6)

   patient_id       full_name                     drug  quantity  price_ngn   dispensed
0           1   Adaeze Okafor          Metformin 500mg        60       1700  2025-05-01
1           2     Chinedu Eze       Amoxicillin 500mg        21       1200  2025-05-02
2           3    Fatima Bello       Paracetamol 500mg        30        300  2025-05-03
3           4    Tunde Bakare          Amlodipine 5mg        30        950  2025-05-04
4           5      Ngozi Umeh  Artemether/Lumefantrine         6       3000  2025-05-05

<class 'pandas.core.frame.DataFrame'>
RangeIndex: 5 entries, 0 to 4
Data columns (total 6 columns):
 #   Column      Non-Null Count  Dtype
---  ------      --------------  -----
 0   patient_id  5 non-null      int64
 1   full_name   5 non-null      object
 2   drug        5 non-null      object
 3   quantity    5 non-null      int64
 4   price_ngn   5 non-null      int64
 5   dispensed   5 non-null      object
dtypes: int64(3), object(3)
memory usage: 368.0+ bytes

       patient_id   quantity   price_ngn
count    5.000000   5.000000    5.000000
mean     3.000000  29.400000   1430.000000
std      1.581139  19.399485   1062.731986
min      1.000000   6.000000    300.000000
25%      2.000000  21.000000    950.000000
50%      3.000000  30.000000   1200.000000
75%      4.000000  30.000000   1700.000000
max      5.000000  60.000000   3000.000000
    `,

    commonMistakes: [
      "Forgetting to import pandas as pd before using it — always the first line.",
      "Using df.shape() with parentheses — shape is an attribute, not a method. It has no ().",
      "Confusing df['col'] (returns a Series) with df[['col']] (returns a one-column DataFrame). The double brackets matter.",
      "Not calling df.info() first on a new dataset — this hides null counts and dtype issues that cause confusing errors later.",
      "Assuming numeric-looking data is actually stored as int/float — df.info() may reveal it's dtype 'object' (string), meaning arithmetic will fail.",
    ],

    exercises: [
      "Create a DataFrame from this dictionary: 10 drugs (name, category, unit_price in NGN, manufacturer). Print its shape, head, and the output of df.info().",
      "Set the row index to the drug name using df.set_index(). Then print the DataFrame again. What changed visually?",
      "Access just the 'unit_price' column and print it. Then compute its mean, max, and min using pandas built-in methods.",
      "Add a new column 'price_usd' by dividing price_ngn by 1650 (approximate rate). Print the updated DataFrame.",
      "Run df.describe() on your drugs DataFrame. What do the 25%, 50%, and 75% rows tell you about the price distribution?",
    ],

    exerciseAnswers: [
      `import pandas as pd

data = {
    "name": ["Metformin 500mg", "Amoxicillin 500mg", "Paracetamol 500mg",
             "Amlodipine 5mg", "Artemether/Lumefantrine", "Ibuprofen 400mg",
             "Omeprazole 20mg", "Lisinopril 10mg", "Azithromycin 500mg",
             "Chloroquine 250mg"],
    "category": ["Antidiabetic", "Antibiotic", "Analgesic",
                 "Antihypertensive", "Antimalarial", "Analgesic",
                 "PPI", "Antihypertensive", "Antibiotic", "Antimalarial"],
    "unit_price": [850, 1200, 300, 950, 1500, 400, 700, 600, 1800, 450],
    "manufacturer": ["Fidson", "Emzor", "GSK", "Swiss Pharma", "May & Baker",
                     "Emzor", "Strides", "Roche", "Pfizer", "Swipha"],
}
df = pd.DataFrame(data)
print(df.shape)   # (10, 4)
print(df.head())
df.info()`,

      `df = df.set_index("name")
print(df)
# The drug name is now the row label on the left instead of 0-9.
# Each row is now identifiable by drug name, not just a number.`,

      `price_series = df["unit_price"]
print(price_series)
print("Mean:", price_series.mean())    # 775.0
print("Max:", price_series.max())      # 1800
print("Min:", price_series.min())      # 300`,

      `df["price_usd"] = df["unit_price"] / 1650
print(df)
# price_usd column now appears on the right, values are small floats
# e.g. Metformin: 0.515152, Amoxicillin: 0.727273`,

      `print(df.describe())
# 25% (Q1) = 450: bottom quarter of drugs cost less than ₦450
# 50% (median) = 775: half of drugs are below ₦775
# 75% (Q3) = 1125: top quarter costs more than ₦1125
# This tells you the price distribution is right-skewed —
# a few expensive drugs (Azithromycin ₦1800, Artemether ₦1500)
# are pulling the mean (₦775) above the median.`,
    ],

    resources: [
      {
        objective: "Understand the DataFrame structure and creation",
        items: [
          { title: "pandas Getting Started — 10 Minutes to pandas", url: "https://pandas.pydata.org/docs/user_guide/10min.html", type: "article" },
          { title: "pandas DataFrame explained (Corey Schafer)", url: "https://www.youtube.com/watch?v=zmdjNSmRXF4", type: "video" },
        ],
      },
      {
        objective: "Practice reading CSV and inspecting DataFrames",
        items: [
          { title: "Kaggle pandas micro-course", url: "https://www.kaggle.com/learn/pandas", type: "interactive" },
          { title: "pandas read_csv docs", url: "https://pandas.pydata.org/docs/reference/api/pandas.read_csv.html", type: "article" },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 102 — Series: Indexing, Slicing, and Operations
  // ============================================================
  {
    id: "W21D2", week: 21, day: 2, phase: 3,
    phaseTitle: "Data Science Core",
    date: "2026-11-03",
    type: "lesson",
    topic: "Series: Indexing, Slicing, and Vectorised Operations",
    duration: "2–3 hours",

    objectives: [
      "Understand what a pandas Series is and how it differs from a list",
      "Create Series from lists and dictionaries",
      "Use index-based and position-based access on a Series",
      "Apply vectorised arithmetic and string operations to a Series",
    ],

    introduction: `
A DataFrame is made of columns. Each column is a Series.

Understanding Series as a first-class object — not just a column 
you extract and throw away — is what separates someone who uses 
pandas mechanically from someone who uses it fluently. Almost every 
transformation, filter, and aggregation you will apply in Phase 3 
operates on Series under the hood.

Today you pull the Series out of the DataFrame, understand its 
anatomy, and learn how to compute on it in ways that are 
fundamentally different from Python loops — faster, more readable, 
and far closer to how real data scientists think.
    `,

    mentalModel: `
A Python list: ordered, no labels, one-dimensional.
A pandas Series: ordered, WITH LABELS (an index), one-dimensional.

The label is everything. When you have a list [850, 1200, 300], you 
can only access position 0, 1, 2. When you have a Series with index 
["Metformin", "Amoxicillin", "Paracetamol"], you can access by 
name: s["Metformin"] → 850.

This label-aware structure is what makes operations on two Series 
align automatically. If you add two Series together, pandas matches 
by label, not by position. That automatic alignment by label is the 
most important behaviour to internalise this week.

VECTORISATION: instead of looping over each element to do 
arithmetic, you operate on the whole Series at once:
  prices * 1.075  → applies 7.5% VAT to every price in one line.
This is not just cleaner — it runs 10-100x faster than a loop 
because numpy handles the computation in compiled C under the hood.
    `,

    explanation: `
CREATING A SERIES

s = pd.Series([850, 1200, 300], index=["Metformin", "Amoxicillin", "Paracetamol"])

Without an index argument, pandas uses RangeIndex (0, 1, 2...).
From a dictionary: pd.Series({"Metformin": 850, "Amoxicillin": 1200})

ACCESSING ELEMENTS

s["Metformin"]     → 850  (label-based)
s[0]               → 850  (position-based, use with care)
s[["Metformin", "Paracetamol"]]  → sub-Series with those two labels

SLICING

s["Metformin":"Paracetamol"]  → inclusive of both endpoints (label slice)
s[0:2]                        → positions 0 and 1, NOT 2 (position slice)

VECTORISED ARITHMETIC

s + 100          → adds 100 to every element
s * 1.075        → multiplies every element (7.5% VAT)
s > 500          → returns boolean Series: True/False for each element
s[s > 500]       → filters to only elements above 500

VECTORISED STRING OPERATIONS (for text columns)

s.str.lower()    → lowercase all strings
s.str.strip()    → remove leading/trailing whitespace
s.str.contains("mg")  → boolean Series: True where "mg" appears
s.str.replace("500mg", "500 mg")  → string replacement

USEFUL SERIES ATTRIBUTES/METHODS

s.values    → numpy array of values (no index)
s.index     → the index labels
s.dtype     → data type of values
s.nunique() → count of unique values
s.value_counts()  → frequency of each unique value (very useful!)
s.isnull()  → boolean Series: True where value is NaN
s.fillna(0) → replace NaN with 0
    `,

    clinicalConnection: `
A prescription frequency count is a Series operation.

When a hospital pharmacist wants to know which drugs are most 
commonly dispensed in a month, they manually count and tally — a 
process that takes hours for a large dispensary.

drug_column.value_counts() does that in one line and returns a 
Series sorted by frequency descending.

Similarly, s.str.contains("mg") applied to a drug name column 
would instantly flag every dispensing record where the strength is 
embedded in the name — critical if you are trying to separate 
"Amoxicillin 250mg" from "Amoxicillin 500mg" records that were 
entered inconsistently.

The vectorised mindset — "operate on all values at once, not one 
by one" — maps naturally to how clinical audits actually work: you 
do not check one record at a time; you apply a rule to the whole 
dataset and investigate exceptions.
    `,

    example: `
import pandas as pd

# Series from a dictionary
prices = pd.Series({
    "Metformin 500mg":     850,
    "Amoxicillin 500mg":  1200,
    "Paracetamol 500mg":   300,
    "Amlodipine 5mg":      950,
    "Ibuprofen 400mg":     400,
})

print("Original prices:")
print(prices)

# Vectorised arithmetic — apply 7.5% VAT
prices_with_vat = prices * 1.075
print("\nPrices after 7.5% VAT:")
print(prices_with_vat.round(2))

# Boolean filter — drugs above ₦800
expensive = prices[prices > 800]
print("\nDrugs above ₦800:")
print(expensive)

# Value counts on a category Series
categories = pd.Series([
    "Antidiabetic", "Antibiotic", "Analgesic",
    "Antihypertensive", "Analgesic", "Antibiotic",
    "Antidiabetic", "Antibiotic",
])
print("\nDispensing frequency by category:")
print(categories.value_counts())
    `,

    expectedOutput: `
Original prices:
Metformin 500mg      850
Amoxicillin 500mg   1200
Paracetamol 500mg    300
Amlodipine 5mg       950
Ibuprofen 400mg      400
dtype: int64

Prices after 7.5% VAT:
Metformin 500mg       913.75
Amoxicillin 500mg    1290.00
Paracetamol 500mg     322.50
Amlodipine 5mg       1021.25
Ibuprofen 400mg       430.00
dtype: float64

Drugs above ₦800:
Metformin 500mg     850
Amoxicillin 500mg  1200
Amlodipine 5mg      950
dtype: int64

Dispensing frequency by category:
Antibiotic          3
Antidiabetic        2
Analgesic           2
Antihypertensive    1
dtype: int64
    `,

    commonMistakes: [
      "Using s[1:3] expecting it to include index 3 — position slicing in pandas is exclusive of the end (like Python lists). Label slicing is inclusive of both ends.",
      "Mixing up s['col'] (label access) and s[0] (position access) when the index has custom labels — use s.iloc[0] for unambiguous position access.",
      "Forgetting that s > 500 returns a boolean Series, not the filtered values. You need s[s > 500] to get the actual filtered data.",
      "Applying string operations to a numeric Series — s.str.lower() on a price column will raise an AttributeError. Check dtype first.",
      "Not chaining .round(2) after float arithmetic — VAT calculations produce long floats that are hard to read in output.",
    ],

    exercises: [
      "Create a Series of 8 drug prices (with drug names as the index). Filter to show only drugs costing more than ₦700. How many drugs pass the filter?",
      "Apply a 5% discount to all prices in your Series (multiply by 0.95). Round to 2 decimal places. Print the result.",
      "Create a Series of drug names (as plain strings, no index). Use .str.upper() then .str.contains('MG') to find all entries with 'MG' in the name after uppercasing.",
      "Use .value_counts() on a Series of 10 drug categories (some repeated). Print the result. Which category appears most often?",
      "Combine two price Series (morning_sales and afternoon_sales, same drug name index) by adding them together. What does pandas do when an index label appears in one but not the other?",
    ],

    exerciseAnswers: [
      `import pandas as pd

prices = pd.Series({
    "Metformin 500mg": 850, "Amoxicillin 500mg": 1200,
    "Paracetamol 500mg": 300, "Amlodipine 5mg": 950,
    "Ibuprofen 400mg": 400, "Omeprazole 20mg": 700,
    "Azithromycin 500mg": 1800, "Lisinopril 10mg": 600,
})
expensive = prices[prices > 700]
print(expensive)
print("Count above ₦700:", len(expensive))
# Output: 4 drugs (Metformin, Amoxicillin, Amlodipine, Azithromycin)`,

      `discounted = (prices * 0.95).round(2)
print(discounted)
# Metformin: 807.50, Amoxicillin: 1140.00, etc.`,

      `drug_names = pd.Series([
    "Metformin 500mg", "Amoxicillin 500mg", "Paracetamol",
    "Amlodipine 5mg", "Vitamin C", "Ibuprofen 400mg",
])
upper = drug_names.str.upper()
has_mg = upper.str.contains("MG")
print(drug_names[has_mg])
# Returns: Metformin 500mg, Amoxicillin 500mg, Amlodipine 5mg, Ibuprofen 400mg`,

      `categories = pd.Series([
    "Antibiotic", "Analgesic", "Antidiabetic", "Antibiotic",
    "Antimalarial", "Analgesic", "Antibiotic", "Antihypertensive",
    "Antidiabetic", "Analgesic",
])
print(categories.value_counts())
# Antibiotic: 3, Analgesic: 3, Antidiabetic: 2, ...
# Antibiotic and Analgesic tie for most frequent.`,

      `morning = pd.Series({"Metformin": 5, "Amoxicillin": 3, "Paracetamol": 10})
afternoon = pd.Series({"Metformin": 2, "Paracetamol": 7, "Ibuprofen": 4})
combined = morning + afternoon
print(combined)
# Metformin: 7, Amoxicillin: NaN, Paracetamol: 17, Ibuprofen: NaN
# pandas inserts NaN where a label exists in one but not the other.
# Fix with: morning.add(afternoon, fill_value=0)`,
    ],

    resources: [
      {
        objective: "Understand the pandas Series structure and indexing",
        items: [
          { title: "pandas Series docs", url: "https://pandas.pydata.org/docs/reference/api/pandas.Series.html", type: "article" },
          { title: "pandas Series tutorial (Real Python)", url: "https://realpython.com/pandas-dataframe/#accessing-and-modifying-values", type: "article" },
        ],
      },
      {
        objective: "Practice vectorised operations and value_counts",
        items: [
          { title: "Kaggle pandas micro-course — Exercise 2", url: "https://www.kaggle.com/kernels/fork/587970", type: "interactive" },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 103 — loc, iloc, and Boolean Filtering
  // ============================================================
  {
    id: "W21D3", week: 21, day: 3, phase: 3,
    phaseTitle: "Data Science Core",
    date: "2026-11-04",
    type: "lesson",
    topic: "loc, iloc, and Boolean Filtering",
    duration: "2–3 hours",

    objectives: [
      "Use .loc[] for label-based row and column selection",
      "Use .iloc[] for position-based row and column selection",
      "Build boolean filters to extract rows meeting conditions",
      "Combine multiple conditions with & and | operators",
    ],

    introduction: `
Selecting the right rows from a DataFrame is the single operation 
you will perform most often in data analysis. Every question you 
want to answer — "show me all sales above ₦2000", "find all 
patients over 50 from Lagos", "which drugs were dispensed in May?" 
— is a row selection problem.

pandas gives you two tools: loc (label-based) and iloc 
(position-based). Knowing which to use and when is non-negotiable. 
The distinction trips up beginners and even intermediate users 
because on a default RangeIndex, they look identical — until you 
reindex or sort, and then bugs appear that are very hard to trace.

Boolean filtering is how you answer real analytical questions. It 
is the pandas equivalent of a SQL WHERE clause — and by the end of 
today, you should be able to translate any SQL filter you already 
know into a pandas boolean expression.
    `,

    mentalModel: `
loc and iloc are like two different addressing systems for the 
same building:

LOC — "street address" (label-based). You say: 
  "Give me the apartment at 'patient_id = 3', in the 'full_name' 
   and 'drug' rooms."
  df.loc[3, ["full_name", "drug"]]

ILOC — "floor and room number" (position-based). You say: 
  "Give me the 4th row (index 3), columns 0 and 2."
  df.iloc[3, [0, 2]]

On a fresh DataFrame with a default RangeIndex, the label 3 and 
position 3 happen to be the same thing. But if you set_index() or 
sort_values(), the labels and positions diverge — and iloc always 
means position, loc always means label. Never confuse them.

BOOLEAN FILTERING: generate a True/False mask the same shape as 
your DataFrame, then pass it to df[mask]. Only True rows are 
returned. This is identical to how SQL WHERE works conceptually:

SQL:    SELECT * FROM sales WHERE total_amount > 2000
pandas: df[df["total_amount"] > 2000]
    `,

    explanation: `
LOC — label-based selection

df.loc[row_label]               → single row by label
df.loc[row_label, "col_name"]   → single cell
df.loc[2:5]                     → rows with labels 2, 3, 4, 5 (inclusive)
df.loc[:, "col"]                → all rows, one column
df.loc[2:5, ["drug", "price"]]  → rows 2-5, two columns

ILOC — position-based selection

df.iloc[0]               → first row (position 0)
df.iloc[-1]              → last row
df.iloc[0:3]             → rows at positions 0, 1, 2 (exclusive end)
df.iloc[:, 0]            → all rows, first column
df.iloc[0:3, [0, 2]]     → first 3 rows, columns at position 0 and 2

BOOLEAN FILTERING

Single condition:
df[df["price_ngn"] > 1000]

Multiple conditions (must use & | not and or):
df[(df["price_ngn"] > 500) & (df["category"] == "Antibiotic")]
df[(df["state"] == "Lagos") | (df["state"] == "Abuja")]

Negation:
df[~(df["category"] == "Analgesic")]   → all rows NOT Analgesic

.isin() for multiple values:
df[df["state"].isin(["Lagos", "Enugu", "Kano"])]

.between() for ranges:
df[df["age"].between(18, 65)]

COMBINING WITH COLUMN SELECTION

df.loc[df["price_ngn"] > 1000, ["drug", "price_ngn"]]
→ filtered rows AND only the two specified columns
    `,

    clinicalConnection: `
Imagine you need to audit all high-value dispensings from Lagos 
pharmacies in May 2025. In a spreadsheet, you would use multiple 
AutoFilter dropdowns. In a hospital system, you would fill out a 
search form. In pandas:

mask = (
    (df["state"] == "Lagos") &
    (df["total_amount"] > 2000) &
    (df["sale_date"].str.startswith("2025-05"))
)
audit_records = df.loc[mask, ["patient_id", "drug", "total_amount"]]

That is one operation. No manual clicking, no form, no waiting. 
And you can run it on 10 records or 10 million records with no 
change to the code.

The clinical parallel is a pharmacovigilance signal query: "flag 
all records where patient age < 12 AND drug is an adult-dose 
antibiotic AND quantity > 30." That is three conditions combined 
with AND — a boolean filter. This kind of query is how post-market 
drug safety monitoring actually works at scale.
    `,

    example: `
import pandas as pd

data = {
    "patient_id": [1, 2, 3, 4, 5, 6, 7, 8],
    "full_name":  ["Adaeze", "Chinedu", "Fatima", "Tunde",
                   "Ngozi", "Yusuf", "Blessing", "Emeka"],
    "age":        [34, 45, 29, 52, 38, 61, 27, 49],
    "state":      ["Lagos", "Enugu", "Kano", "Oyo",
                   "Anambra", "Kaduna", "Cross River", "Imo"],
    "total_spend":[1700, 1200, 900, 950, 3000, 1600, 1200, 2850],
}
df = pd.DataFrame(data)
df = df.set_index("patient_id")

# loc — label-based
print("Patient 3 by label:")
print(df.loc[3])

# iloc — position-based (3rd row = position 2)
print("\n3rd row by position:")
print(df.iloc[2])

# Boolean filter — patients over 40
print("\nPatients over 40:")
print(df[df["age"] > 40])

# Compound filter — over 40 AND high spend
print("\nOver 40 AND spent above ₦1500:")
print(df[(df["age"] > 40) & (df["total_spend"] > 1500)])
    `,

    expectedOutput: `
Patient 3 by label:
full_name    Fatima
age              29
state          Kano
total_spend     900
Name: 3, dtype: object

3rd row by position:
full_name    Fatima
age              29
state          Kano
total_spend     900
Name: 3, dtype: object

Patients over 40:
            full_name  age     state  total_spend
patient_id
2             Chinedu   45     Enugu         1200
4               Tunde   52       Oyo          950
6               Yusuf   61    Kaduna         1600
8               Emeka   49       Imo         2850

Over 40 AND spent above ₦1500:
            full_name  age   state  total_spend
patient_id
6               Yusuf   61  Kaduna         1600
8               Emeka   49     Imo         2850
    `,

    commonMistakes: [
      "Using df[2:5] directly on a non-default index — this uses position (like iloc) on the outer bracket, which is confusing. Always use .loc or .iloc explicitly for anything beyond simple column selection.",
      "Writing df[df['age'] > 40 and df['spend'] > 1000] — Python's 'and' keyword doesn't work on Series. Always use & and wrap each condition in parentheses.",
      "Forgetting that loc's slice endpoint is INCLUSIVE (df.loc[2:5] includes row 5) while iloc's is EXCLUSIVE (df.iloc[2:5] stops before position 5).",
      "Not parenthesising each condition in a compound filter — df[df['a'] > 1 & df['b'] == 'X'] will raise a TypeError or give wrong results due to operator precedence.",
      "Modifying a slice without .copy() — df[df['age'] > 40]['new_col'] = 1 raises a SettingWithCopyWarning and won't work. Use df.loc[mask, 'new_col'] = 1 instead.",
    ],

    exercises: [
      "Using the 8-patient DataFrame from the example, use .loc to retrieve patient 5's full name and state only (two columns by label).",
      "Use .iloc to retrieve the last 3 rows and the first 2 columns by position.",
      "Filter the DataFrame to show only patients from Lagos, Enugu, or Kano using .isin(). How many rows are returned?",
      "Filter to patients aged between 30 and 50 (inclusive) who spent more than ₦1000. Use .between() for the age condition.",
      "Create a new column 'high_value' that is True where total_spend > 2000, False otherwise. Use df.loc with a boolean mask to assign it (not a direct chain).",
    ],

    exerciseAnswers: [
      `# Patient 5 by label, two columns
result = df.loc[5, ["full_name", "state"]]
print(result)
# full_name      Ngozi
# state        Anambra
# Name: 5, dtype: object`,

      `# Last 3 rows, first 2 columns by position
result = df.iloc[-3:, 0:2]
print(result)
# Returns Yusuf, Blessing, Emeka with full_name and age columns`,

      `# isin filter
filtered = df[df["state"].isin(["Lagos", "Enugu", "Kano"])]
print(filtered)
print("Count:", len(filtered))
# 3 rows: Adaeze (Lagos), Chinedu (Enugu), Fatima (Kano)`,

      `# between + compound filter
mask = df["age"].between(30, 50) & (df["total_spend"] > 1000)
print(df[mask])
# Returns: Adaeze (34, ₦1700), Chinedu (45, ₦1200), Emeka (49, ₦2850)`,

      `# Correct way: use .loc to assign
df.loc[df["total_spend"] > 2000, "high_value"] = True
df.loc[df["total_spend"] <= 2000, "high_value"] = False
print(df[["full_name", "total_spend", "high_value"]])
# Ngozi (₦3000) and Emeka (₦2850) are True; rest are False`,
    ],

    resources: [
      {
        objective: "Master loc and iloc selection",
        items: [
          { title: "pandas indexing and selecting data (official docs)", url: "https://pandas.pydata.org/docs/user_guide/indexing.html", type: "article" },
          { title: "loc vs iloc explained (Real Python)", url: "https://realpython.com/pandas-iloc-loc/", type: "article" },
        ],
      },
      {
        objective: "Practice boolean filtering",
        items: [
          { title: "Kaggle pandas micro-course — Indexing, Selecting & Assigning", url: "https://www.kaggle.com/kernels/fork/587910", type: "interactive" },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 104 — Adding/Dropping Columns, Sorting, Renaming
  // ============================================================
  {
    id: "W21D4", week: 21, day: 4, phase: 3,
    phaseTitle: "Data Science Core",
    date: "2026-11-05",
    type: "lesson",
    topic: "Adding, Dropping, Sorting, and Renaming in DataFrames",
    duration: "2–3 hours",

    objectives: [
      "Add computed columns to a DataFrame using assignment and apply()",
      "Drop columns and rows safely with .drop()",
      "Sort a DataFrame by one or more columns using .sort_values()",
      "Rename columns cleanly with .rename() and .columns",
    ],

    introduction: `
Real datasets are never in the exact shape you need for analysis. 
Columns have cryptic names. You need derived metrics that are not 
in the original data. Certain columns are noise. The rows need to 
be in a specific order to detect trends.

Today's skills — adding columns, dropping noise, sorting 
intelligently, and renaming for clarity — are the "data 
carpentry" operations you run on almost every dataset before any 
real analysis begins. They are not glamorous, but they are what 
professional data analysts spend a surprisingly large fraction of 
their time doing, and doing them wrong (or in the wrong order) 
causes subtle bugs that are hard to catch downstream.
    `,

    mentalModel: `
Think of these operations as shaping a physical table before 
you work on it:

ADDING A COLUMN — placing a new ruler at the right edge of the 
table. Every row automatically gets a cell in that column.
  df["new_col"] = value_or_series

DROPPING — removing a ruler (column) or a plank (row) you do not 
need. Physically removes it from the table.
  df.drop(columns=["col"])
  df.drop(index=[0, 2])

SORTING — physically rearranging the planks (rows) so the highest 
values rise to the top (or bottom).
  df.sort_values("price_ngn", ascending=False)

RENAMING — changing the label on a ruler without changing what it 
measures.
  df.rename(columns={"old_name": "new_name"})

One key principle: most pandas operations return a NEW DataFrame 
rather than modifying the original in place. You must either 
reassign (df = df.drop(...)) or use inplace=True. The recommended 
pattern is always reassignment — it is cleaner and avoids bugs.
    `,

    explanation: `
ADDING COLUMNS

Simple assignment:
df["total_ngn"] = df["quantity"] * df["unit_price"]

Conditional assignment using np.where():
import numpy as np
df["expensive"] = np.where(df["unit_price"] > 1000, "Yes", "No")

Using .apply() for row-wise logic:
def classify_price(p):
    if p < 500:   return "Budget"
    if p < 1000:  return "Mid"
    return "Premium"
df["tier"] = df["unit_price"].apply(classify_price)

DROPPING

Drop a column:
df = df.drop(columns=["unnecessary_col"])

Drop multiple columns:
df = df.drop(columns=["col1", "col2"])

Drop rows by index label:
df = df.drop(index=[0, 3])

Drop rows by condition:
df = df[df["quantity"] > 0]   # effectively drops rows where qty = 0

SORTING

Sort by one column:
df = df.sort_values("unit_price", ascending=False)

Sort by multiple columns (price desc, then name asc):
df = df.sort_values(["unit_price", "drug"], ascending=[False, True])

Sort by index:
df = df.sort_index()

Reset the index after sorting (row numbers become 0,1,2... again):
df = df.reset_index(drop=True)

RENAMING

Single column:
df = df.rename(columns={"old": "new"})

Multiple columns at once:
df = df.rename(columns={"qty": "quantity", "px": "price_ngn"})

Replace all column names at once (must provide all):
df.columns = ["id", "name", "cat", "price", "qty"]
    `,

    clinicalConnection: `
In medication reconciliation — comparing a patient's home 
medication list to what was prescribed in hospital — you work with 
two imperfect tables with different column names and different row 
orders.

The first thing any real clinician-turned-analyst does:
1. Rename columns so both tables use the same field names 
   (rename)
2. Drop columns that only exist in one table and would confuse 
   a merge (drop)
3. Add a "total_dose_per_day" column computed from strength × 
   frequency (add computed column)
4. Sort both tables by patient_id so you can visually compare 
   them before merging (sort_values)

You will do exactly this pattern — rename → drop noise → add 
computed fields → sort → merge — every time you work with real 
clinical datasets. Today you build the first four steps of that 
workflow.
    `,

    example: `
import pandas as pd
import numpy as np

data = {
    "pt_id":  [1, 2, 3, 4, 5],
    "nm":     ["Adaeze", "Chinedu", "Fatima", "Tunde", "Ngozi"],
    "drug":   ["Metformin 500mg", "Amoxicillin 500mg",
               "Paracetamol 500mg", "Amlodipine 5mg",
               "Artemether/Lumefantrine"],
    "qty":    [60, 21, 30, 30, 6],
    "px_ngn": [850, 1200, 300, 950, 1500],
    "notes":  [None, None, None, None, None],   # empty column
}
df = pd.DataFrame(data)

# 1. Rename cryptic columns
df = df.rename(columns={"pt_id": "patient_id", "nm": "full_name",
                         "qty": "quantity", "px_ngn": "unit_price"})

# 2. Drop the empty notes column
df = df.drop(columns=["notes"])

# 3. Add a computed total_cost column
df["total_cost"] = df["quantity"] * df["unit_price"]

# 4. Add a price tier using np.where
df["tier"] = np.where(df["unit_price"] > 1000, "Premium", "Standard")

# 5. Sort by total_cost descending
df = df.sort_values("total_cost", ascending=False).reset_index(drop=True)

print(df)
    `,

    expectedOutput: `
   patient_id    full_name                     drug  quantity  unit_price  total_cost      tier
0           1       Adaeze          Metformin 500mg        60         850       51000  Standard
1           5        Ngozi  Artemether/Lumefantrine         6        1500        9000   Premium
2           2      Chinedu       Amoxicillin 500mg        21        1200       25200   Premium
3           4        Tunde          Amlodipine 5mg        30         950       28500  Standard
4           3       Fatima       Paracetamol 500mg        30         300        9000  Standard
    `,

    commonMistakes: [
      "Forgetting to reassign after .drop() — df.drop(columns=['col']) does nothing to df unless you write df = df.drop(...) or use inplace=True.",
      "Using inplace=True inconsistently — it works on some methods but not all, and makes chaining impossible. Reassignment is safer and more readable.",
      "Sorting without reset_index(drop=True) — the index labels stay in their old order after sorting, which causes confusing iloc vs loc behaviour later.",
      "Using apply() for simple arithmetic — df['total'] = df['qty'] * df['price'] is 10x faster than apply(). Only use apply() for logic that can't be vectorised.",
      "Passing a string instead of a list to drop multiple columns — df.drop('col1', 'col2') raises a TypeError. Use df.drop(columns=['col1', 'col2']).",
    ],

    exercises: [
      "Take the 8-patient DataFrame from yesterday. Rename 'total_spend' to 'spend_ngn' and 'full_name' to 'name'. Drop the 'state' column. Print the result.",
      "Add a column 'spend_usd' by dividing spend_ngn by 1650. Round to 2 decimal places.",
      "Add a column 'age_group' using np.where: 'Senior' for age >= 60, 'Adult' otherwise.",
      "Sort the DataFrame by age descending. Then reset the index. Print head(3) to confirm the oldest patient is now row 0.",
      "Drop the row where patient_id == 3 using .drop(index=...). Remember patient_id is the index here.",
    ],

    exerciseAnswers: [
      `df = df.rename(columns={"total_spend": "spend_ngn", "full_name": "name"})
df = df.drop(columns=["state"])
print(df)
# Columns are now: name, age, spend_ngn (state removed)`,

      `df["spend_usd"] = (df["spend_ngn"] / 1650).round(2)
print(df[["name", "spend_ngn", "spend_usd"]])
# Adaeze: ₦1700 → $1.03, Yusuf: ₦1600 → $0.97, etc.`,

      `import numpy as np
df["age_group"] = np.where(df["age"] >= 60, "Senior", "Adult")
print(df[["name", "age", "age_group"]])
# Only Yusuf (age 61) is "Senior"; all others are "Adult"`,

      `df = df.sort_values("age", ascending=False).reset_index(drop=True)
print(df.head(3))
# Row 0: Yusuf (61), Row 1: Tunde (52), Row 2: Emeka (49)`,

      `# patient_id is the index so use it directly
df = df.drop(index=3)
print(df)
# Fatima's row is gone; all other rows remain`,
    ],

    resources: [
      {
        objective: "Add and drop columns and rows",
        items: [
          { title: "pandas drop() documentation", url: "https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.drop.html", type: "article" },
          { title: "pandas apply() documentation", url: "https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.apply.html", type: "article" },
        ],
      },
      {
        objective: "Sort and rename DataFrames",
        items: [
          { title: "How to sort a DataFrame (pandas docs)", url: "https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.sort_values.html", type: "article" },
          { title: "Data Cleaning with pandas (freeCodeCamp)", url: "https://www.youtube.com/watch?v=ZyhVh-qRZPA", type: "video" },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 105 — PROJECT: pandas Data Manipulation Showcase
  // ============================================================
  {
    id: "W21D5", week: 21, day: 5, phase: 3,
    phaseTitle: "Data Science Core",
    date: "2026-11-06",
    type: "project",
    topic: "Project: pandas Data Manipulation Showcase",
    duration: "3–4 hours",

    objectives: [
      "Create a realistic DataFrame from scratch using your pharmacy background",
      "Apply the full Week 21 toolkit: inspection, Series ops, loc/iloc, boolean filters, add/drop/sort/rename",
      "Answer real analytical questions using pandas operations",
      "Document your analysis clearly with comments and print labels",
    ],

    introduction: `
This project ties together everything from Week 21. No new 
concepts — just you, a dataset, and real questions to answer.

You will build a 20-row pharmacy dispensing dataset, clean and 
shape it, then answer five analytical questions using the pandas 
operations you have learned this week. The goal is to produce a 
script that reads like a mini data analysis report — not a 
collection of unrelated commands, but a logical sequence from 
raw data to insight.

Push this to your GitHub progress log when done.
    `,

    mentalModel: `
A mini analysis project follows a consistent structure:

1. LOAD/CREATE — get the raw data into a DataFrame
2. INSPECT — understand shape, dtypes, nulls, basic stats
3. CLEAN/SHAPE — rename, drop noise, add computed columns
4. FILTER — isolate the subsets relevant to your questions
5. ANSWER — use Series operations and aggregations to get numbers
6. COMMUNICATE — print results with clear labels

You will follow this exact structure today. In Phase 3 you will 
repeat it on progressively larger, messier, real-world datasets. 
This is the skeleton of every data analysis you will ever do.
    `,

    explanation: `
PROJECT BRIEF

Build a 20-row DataFrame representing one month of dispensing 
records at a community pharmacy in Lagos. Include columns:
  - record_id (1–20)
  - patient_name
  - drug_name
  - category (Antibiotic, Analgesic, Antidiabetic, 
             Antihypertensive, Antimalarial)
  - quantity (realistic: 7, 14, 21, 28, 30, 60)
  - unit_price (realistic NGN prices)
  - date_dispensed (spread across May 2025)
  - pharmacist (2-3 different names)

Then answer these five questions using pandas:

Q1: What is the total revenue for the month?
Q2: Which drug category generated the most revenue?
Q3: How many records were dispensed by each pharmacist?
Q4: What are the top 3 most expensive prescriptions 
    (by total cost = quantity × unit_price)?
Q5: How many dispensings involved antibiotics for patients 
    whose names start with a vowel?

For Q2 onward you will need methods from next week (groupby). 
Try them — look up the syntax, experiment, use the Lab. If you 
get stuck, a clean filter + sum() combination is acceptable for 
now. The key is to produce an answer, even if the method is not 
the most elegant yet.
    `,

    clinicalConnection: `
This project mirrors a real monthly dispensing audit — the kind 
a community pharmacy owner or a hospital pharmacy manager 
produces at the end of every month for stock reconciliation, 
revenue reporting, and antimicrobial stewardship reviews.

Your clinical instinct will make Q5 (antibiotic dispensings) feel 
natural — that is exactly the kind of targeted query that 
underpins responsible antibiotic prescribing reviews (RAP reviews) 
in Nigerian hospital settings.

The dataset you build today is also deliberately similar to the 
dirty dataset you already have in your Lab's SQL workspace — 
except clean. By Week 23 (Data Cleaning at Scale), you will take 
something like the dirty version and transform it into something 
like today's clean version, programmatically.
    `,

    example: `
import pandas as pd
import numpy as np

# ── 1. CREATE ──────────────────────────────────────────────────
records = {
    "record_id": list(range(1, 11)),
    "patient_name": [
        "Adaeze Okafor", "Chinedu Eze", "Emeka Nwosu",
        "Fatima Bello", "Ngozi Umeh", "Tunde Bakare",
        "Aisha Mohammed", "Ikenna Duru", "Obiageli Eze",
        "Usman Garba",
    ],
    "drug_name": [
        "Metformin 500mg", "Amoxicillin 500mg", "Amlodipine 5mg",
        "Paracetamol 500mg", "Artemether/Lumefantrine",
        "Ibuprofen 400mg", "Metformin 500mg", "Amoxicillin 500mg",
        "Amlodipine 5mg", "Artemether/Lumefantrine",
    ],
    "category": [
        "Antidiabetic", "Antibiotic", "Antihypertensive",
        "Analgesic", "Antimalarial", "Analgesic",
        "Antidiabetic", "Antibiotic", "Antihypertensive",
        "Antimalarial",
    ],
    "quantity": [60, 21, 30, 30, 6, 30, 60, 14, 30, 6],
    "unit_price": [850, 1200, 950, 300, 1500, 400, 850, 1200, 950, 1500],
    "date_dispensed": [
        "2025-05-01", "2025-05-02", "2025-05-03",
        "2025-05-05", "2025-05-06", "2025-05-08",
        "2025-05-10", "2025-05-12", "2025-05-15",
        "2025-05-20",
    ],
    "pharmacist": [
        "Victor", "Ngozi", "Victor", "Ngozi", "Victor",
        "Adunola", "Victor", "Ngozi", "Adunola", "Victor",
    ],
}
df = pd.DataFrame(records)

# ── 2. ADD COMPUTED COLUMN ─────────────────────────────────────
df["total_cost"] = df["quantity"] * df["unit_price"]

# ── 3. ANSWER Q1: Total revenue ────────────────────────────────
print("Q1 — Total revenue:", df["total_cost"].sum())
    `,

    expectedOutput: `
Q1 — Total revenue: 167200

(Full project output will vary based on your 20-row dataset.
 Q2–Q5 will be explored using groupby next week — for now, 
 use boolean filters and .sum() to approximate the answers.)
    `,

    commonMistakes: [
      "Skipping df.info() at the start — always inspect before you analyse. A column that looks numeric but is stored as 'object' will break your sum().",
      "Computing total_cost after filtering — always add computed columns first, then filter. Otherwise your filter might exclude rows that should be in the total.",
      "Hardcoding category names with wrong capitalisation ('antibiotic' vs 'Antibiotic') — value_counts() is case-sensitive and will produce duplicate rows.",
      "Forgetting to reset_index() after sorting — sort before printing final tables and reset so row numbering is clean in the output.",
      "Writing the analysis as one long unbroken block — use print() with clear labels and section comments so the output is readable as a report, not just numbers.",
    ],

    exercises: [
      "Extend your dataset to 20 rows with varied patients, drugs, quantities, and dates across May 2025. Confirm df.shape returns (20, 8) before proceeding.",
      "Use df.info() and df.describe() to inspect the dataset. Write a 3-sentence comment at the top of your script summarising what you observe (any nulls? price range? quantity range?).",
      "Answer Q1 (total revenue) and Q3 (records per pharmacist using value_counts()) and print both with clear labels.",
      "Answer Q4 (top 3 most expensive prescriptions) by adding a total_cost column, sorting descending, and printing the top 3 rows showing patient, drug, and total_cost only.",
      "Answer Q5 (antibiotic dispensings where patient name starts with a vowel) using a compound boolean filter. Print the count and the matching rows.",
    ],

    exerciseAnswers: [
      `# Just confirm shape after building to 20 rows
print(df.shape)  # Should be (20, 8)
# If not 20, check your records dictionary has 20 values per key`,

      `df.info()
df.describe()
# Example comment:
# Dataset has 20 records, no nulls.
# unit_price ranges from 300 to 1500 NGN.
# Quantities range from 6 (antimalarials) to 60 (metformin packs).`,

      `print("Q1 — Total monthly revenue: ₦", df["total_cost"].sum())
print()
print("Q3 — Records per pharmacist:")
print(df["pharmacist"].value_counts())`,

      `df = df.sort_values("total_cost", ascending=False).reset_index(drop=True)
top3 = df.loc[0:2, ["patient_name", "drug_name", "total_cost"]]
print("Q4 — Top 3 most expensive prescriptions:")
print(top3)`,

      `# Antibiotic + name starts with a vowel
vowels = ["A", "E", "I", "O", "U"]
mask = (
    (df["category"] == "Antibiotic") &
    (df["patient_name"].str[0].isin(vowels))
)
result = df[mask]
print("Q5 — Antibiotic dispensings, patient name starts with vowel:")
print(f"Count: {len(result)}")
print(result[["patient_name", "drug_name", "quantity"]])`,
    ],

    resources: [
      {
        objective: "Review Week 21 pandas fundamentals end-to-end",
        items: [
          { title: "pandas cheat sheet (DataCamp)", url: "https://www.datacamp.com/cheat-sheet/pandas-cheat-sheet-for-data-science-in-python", type: "article" },
          { title: "pandas in 1 hour (Keith Galli)", url: "https://www.youtube.com/watch?v=vmEHCJofslg", type: "video" },
        ],
      },
      {
        objective: "Practice with a real dataset",
        items: [
          { title: "Kaggle datasets — search 'pharmacy' or 'drugs'", url: "https://www.kaggle.com/datasets", type: "interactive" },
        ],
      },
    ],
  },

];
