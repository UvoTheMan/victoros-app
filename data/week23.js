// ============================================================
// WEEK 23 — Data Cleaning at Scale
// Days 111–115 | 16 Nov 2026 – 20 Nov 2026
// Phase 3: Data Science Core
// ============================================================

const WEEK23 = [

  // ============================================================
  // DAY 111 — Missing Data: Detecting and Handling NaN
  // ============================================================
  {
    id: "W23D1", week: 23, day: 1, phase: 3,
    phaseTitle: "Data Science Core",
    date: "2026-11-16",
    type: "lesson",
    topic: "Missing Data: Detecting and Handling NaN",
    duration: "2–3 hours",

    objectives: [
      "Detect missing values using .isnull(), .isna(), and .info()",
      "Understand the difference between dropping and filling missing data",
      "Use .dropna() with subset and thresh parameters correctly",
      "Use .fillna() with constants, forward-fill, and computed values",
    ],

    introduction: `
Real datasets are dirty. Not occasionally — almost always. Missing
values, duplicate records, inconsistent formatting, and impossible
outliers are the norm, not the exception, in any dataset that
passed through human data entry.

This week is about the unglamorous but essential skill of data
cleaning. No analysis is trustworthy if it runs on dirty data —
"garbage in, garbage out" is not a cliché, it is a description of
how every flawed report gets produced.

You already have a dirty SQL dataset in your Lab. This week you
develop the pandas equivalent skillset — cleaning data
programmatically, the same techniques used in production ETL
pipelines before data ever reaches an analyst's dashboard.
    `,

    mentalModel: `
Missing data in pandas is represented as NaN (Not a Number) for
numeric/object columns, or NaT (Not a Time) for datetime columns.

Think of NaN as an empty seat at a dinner table — the chair exists
(the row exists), but nobody is sitting there (no value for that
column). Your job is to decide, for each empty seat:
  - leave it empty (keep as NaN, acknowledge the gap)
  - remove the chair entirely (drop the row)
  - seat someone there (fill the value)

The decision depends on WHY the data is missing and WHAT you plan
to do with it. A missing age might be safely filled with the
average age. A missing patient_id should probably never be filled
— it likely means the row itself is unreliable.
    `,

    explanation: `
DETECTING MISSING DATA

df.isnull()               → DataFrame of True/False, same shape as df
df.isnull().sum()         → count of missing values PER COLUMN
df.isnull().sum().sum()   → total missing values in the whole DataFrame
df[df["col"].isnull()]    → rows where that column is missing

DROPPING MISSING DATA

df.dropna()                     → drop ANY row with ANY missing value
df.dropna(subset=["col"])       → drop rows missing THAT column only
df.dropna(how="all")            → drop rows where ALL values are missing
df.dropna(thresh=3)             → keep rows with at least 3 non-null values
df.dropna(axis=1)               → drop COLUMNS with any missing value

FILLING MISSING DATA

df["col"].fillna(0)                   → replace NaN with a constant
df["col"].fillna(df["col"].mean())    → replace with the column mean
df["col"].fillna(df["col"].median())  → replace with the median
df["col"].fillna(method="ffill")      → carry last valid value down
df["col"].fillna(df["col"].mode()[0]) → fill with most common value

CHOOSING MEAN VS MEDIAN

Mean is sensitive to outliers. If a price column has one entry of
999999 due to a data entry error, the mean will be distorted.
Median is robust — it picks the middle value regardless of
extremes. Prefer median for skewed data.

VERIFYING THE CLEAN

After any cleaning, always re-check:
df.isnull().sum()
df.shape   (did you lose more rows than expected?)
    `,

    clinicalConnection: `
Missing data in clinical records is not random noise — it often
carries meaning. A missing "allergy" field might mean "no allergies
recorded" or "the field was never asked" — treating those the same
way can be dangerous.

A missing blood pressure reading should not be filled with the
average — that could mask a genuinely abnormal or unmeasured value.
Contrast that with a missing "pharmacist" field in a dispensing
record: safely fillable with "Unknown" since it only affects
attribution, not clinical interpretation.

The skill here requires your clinical judgment about what
missingness means in each specific column, applied before you
choose drop vs fill vs flag.
    `,

    example: `
import pandas as pd
import numpy as np

data = {
    "patient_id": [1, 2, 3, 4, 5, 6],
    "full_name":  ["Adaeze", "Chinedu", None, "Tunde", "Ngozi", "Yusuf"],
    "age":        [34, 45, 29, np.nan, 38, np.nan],
    "state":      ["Lagos", None, "Kano", "Oyo", "Anambra", "Kaduna"],
    "weight_kg":  [68.5, np.nan, 55.0, 80.2, np.nan, 72.0],
}
df = pd.DataFrame(data)

print("Missing values per column:")
print(df.isnull().sum())

# Drop rows missing identity, fill numeric, fill categorical
clean = df.dropna(subset=["full_name"]).copy()
clean["age"] = clean["age"].fillna(clean["age"].median())
clean["state"] = clean["state"].fillna("Unknown")

print("\nAfter cleaning:")
print(clean)
print("\nRemaining nulls:")
print(clean.isnull().sum())
    `,

    expectedOutput: `
Missing values per column:
patient_id    0
full_name     1
age           2
state         1
weight_kg     2
dtype: int64

After cleaning:
   patient_id full_name   age    state  weight_kg
0           1    Adaeze  34.0    Lagos       68.5
1           2   Chinedu  45.0  Unknown        NaN
3           4     Tunde  38.0      Oyo       80.2
4           5     Ngozi  38.0  Anambra        NaN
5           6     Yusuf  38.0   Kaduna       72.0

Remaining nulls:
patient_id    0
full_name     0
age           0
state         0
weight_kg     2
dtype: int64
    `,

    commonMistakes: [
      "Using df.dropna() without subset= — this drops a row if ANY column has a missing value, silently destroying most of your dataset on wide tables.",
      "Filling all missing values the same way regardless of column meaning — missing ID and missing optional note are not equivalent.",
      "Using mean() on a skewed column with outliers — always check df.describe() before deciding between mean and median.",
      "Forgetting that fillna() returns a new Series by default — you must reassign: df['col'] = df['col'].fillna(...).",
      "Not re-checking .isnull().sum() after cleaning — always confirm your cleaning actually worked.",
    ],

    exercises: [
      "Build a 10-row pandas DataFrame with realistic missing values in at least 3 columns. Print isnull().sum().",
      "Identify which column(s) should never be filled (likely an ID or name field) and drop rows missing that column using dropna(subset=...).",
      "For a numeric column with missing values, fill using the median. Print the value used and confirm no NaN remain in that column.",
      "For a categorical column with missing values, fill using the mode (most common value). Print which value was used.",
      "Compare row count before and after your full cleaning pipeline. Write a one-line print statement describing what was lost and why.",
    ],

    exerciseAnswers: [
      `import pandas as pd
import numpy as np

data = {
    "record_id": list(range(1, 11)),
    "patient_name": ["Adaeze", "Chinedu", None, "Tunde", "Ngozi",
                     "Yusuf", "Blessing", None, "Fatima", "Emeka"],
    "age": [34, 45, 29, np.nan, 38, 61, np.nan, 27, 49, np.nan],
    "drug_category": ["Antidiabetic", None, "Analgesic", "Antihypertensive",
                      "Antimalarial", None, "Analgesic", "Antibiotic",
                      "Antihypertensive", "Antidiabetic"],
}
df = pd.DataFrame(data)
print(df.isnull().sum())
# patient_name: 2, age: 3, drug_category: 2`,

      `clean = df.dropna(subset=["patient_name"]).copy()
print(f"Dropped {len(df) - len(clean)} rows missing patient_name")`,

      `median_age = clean["age"].median()
clean["age"] = clean["age"].fillna(median_age)
print(f"Filled age with median: {median_age}")
print(clean["age"].isnull().sum())  # 0`,

      `mode_category = clean["drug_category"].mode()[0]
clean["drug_category"] = clean["drug_category"].fillna(mode_category)
print(f"Filled drug_category with mode: {mode_category}")`,

      `print(f"Started with {len(df)} rows, ended with {len(clean)} rows. "
      f"Dropped rows missing patient_name since an unidentified "
      f"patient record cannot be reliably analysed.")`,
    ],

    resources: [
      {
        objective: "Understand missing data detection and handling",
        items: [
          { title: "Working with missing data (pandas official docs)", url: "https://pandas.pydata.org/docs/user_guide/missing_data.html", type: "article" },
          { title: "Kaggle — Data Cleaning: Handling Missing Values", url: "https://www.kaggle.com/code/alexisbcook/handling-missing-values", type: "interactive" },
        ],
      },
      {
        objective: "See real-world missing data strategies",
        items: [
          { title: "Dealing with missing data (Towards Data Science)", url: "https://towardsdatascience.com/data-cleaning-with-python-and-pandas-detecting-missing-values-3e9c6ebcf78b", type: "article" },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 112 — Duplicates, Inconsistent Text, and String Cleaning
  // ============================================================
  {
    id: "W23D2", week: 23, day: 2, phase: 3,
    phaseTitle: "Data Science Core",
    date: "2026-11-17",
    type: "lesson",
    topic: "Duplicates, Inconsistent Text, and String Cleaning",
    duration: "2–3 hours",

    objectives: [
      "Detect and remove duplicate rows using .duplicated() and .drop_duplicates()",
      "Standardise inconsistent text casing and whitespace",
      "Use regular expressions with .str.extract() and .str.replace()",
      "Identify and merge near-duplicate categorical values",
    ],

    introduction: `
Two records that should be identical but are not — 'CHINEDU EZE'
vs 'Chinedu Eze' vs ' chinedu eze ' — are one of the most common
and most damaging data quality problems. They look different to a
computer even though they represent the same person, silently
fragmenting your analysis: a groupby on a poorly cleaned name
column will count the same person as three different people.

Today you build the toolkit to catch and fix this systematically —
using exactly the kind of messy data already in your Lab's dirty
dataset.
    `,

    mentalModel: `
EXACT DUPLICATES — two rows that are byte-for-byte identical.
Usually caused by a double-submission error. Easy to detect.

NEAR-DUPLICATES (TEXT) — values representing the same real thing
written differently: casing, whitespace, abbreviations.
'Lagos' vs 'LAGOS' vs ' Lagos ' are the same state.

The cleaning order matters: ALWAYS normalise text (strip, lower,
standardise) BEFORE checking for duplicates — otherwise
case-sensitive duplicate detection will miss matches that are
really the same record.
    `,

    explanation: `
DETECTING DUPLICATES

df.duplicated()                        → True for repeat rows
df.duplicated().sum()                  → count of duplicate rows
df.duplicated(subset=["patient_id"])   → based on ONE column only
df.duplicated(keep=False)              → mark ALL occurrences

REMOVING DUPLICATES

df.drop_duplicates()                            → keep first, drop rest
df.drop_duplicates(subset=["patient_id"])       → dedupe on one column
df.drop_duplicates(keep="last")                 → keep the LAST entry

STRING CLEANING

df["col"].str.strip()        → remove leading/trailing whitespace
df["col"].str.lower()        → lowercase everything
df["col"].str.title()        → "john doe" → "John Doe"

REGULAR EXPRESSIONS

Extract a number from text:
df["dose_mg"] = df["drug_name"].str.extract(r"(\\d+)mg")

Remove a pattern:
df["clean_name"] = df["drug_name"].str.replace(r"\\d+mg", "", regex=True).str.strip()

Check if a pattern exists:
df["has_dose"] = df["drug_name"].str.contains(r"\\d+mg", regex=True)

STANDARDISING NEAR-DUPLICATES

category_corrections = {
    "antibiotic": "Antibiotic",
    "ANTIBIOTIC": "Antibiotic",
    "antibiotics": "Antibiotic",
}
df["category"] = df["category"].str.strip().str.title()
# .title() handles most casing; mapping handles misspellings
    `,

    clinicalConnection: `
Drug name standardisation is a textbook pharmacy data problem.
'Paracetamol', 'paracetamol 500mg', 'PARACETAMOL', and 'Panadol'
might all refer to the same product in a dispensing dataset entered
by different staff.

If you run a groupby on raw drug_name text, your "most dispensed
drug" report will undercount Paracetamol because its dispensings
are split across 4+ spellings — a genuinely common failure mode in
Nigerian pharmacy systems that rely on free-text drug entry rather
than a standardised catalogue lookup.
    `,

    example: `
import pandas as pd

data = {
    "patient_id":  [1, 2, 2, 3, 4, 4],
    "full_name":   ["  Adaeze Okafor", "CHINEDU EZE", "Chinedu Eze",
                    "fatima bello", "Tunde Bakare", "Tunde Bakare"],
    "state":       ["lagos", "ENUGU", "Enugu", " Kano", "Oyo", "Oyo"],
    "drug":        ["Metformin500mg", "Amoxicillin 500 MG",
                    "amoxicillin500mg", "Paracetamol500mg",
                    "Amlodipine5mg", "Amlodipine5mg"],
}
df = pd.DataFrame(data)

print("Exact duplicate rows:", df.duplicated().sum())
print("Duplicate patient_id:", df.duplicated(subset=["patient_id"]).sum())

# Clean text first
df["full_name"] = df["full_name"].str.strip().str.title()
df["state"] = df["state"].str.strip().str.title()
df["drug"] = df["drug"].str.lower().str.replace(" ", "", regex=False)

print("\nAfter text cleaning:")
print(df)

deduped = df.drop_duplicates(subset=["patient_id"], keep="first")
print("\nAfter dropping duplicates:")
print(deduped)
    `,

    expectedOutput: `
Exact duplicate rows: 0
Duplicate patient_id: 2

After text cleaning:
   patient_id       full_name   state                drug
0           1  Adaeze Okafor   Lagos      metformin500mg
1           2    Chinedu Eze   Enugu    amoxicillin500mg
2           2    Chinedu Eze   Enugu    amoxicillin500mg
3           3   Fatima Bello    Kano   paracetamol500mg
4           4   Tunde Bakare     Oyo       amlodipine5mg
5           4   Tunde Bakare     Oyo       amlodipine5mg

After dropping duplicates:
   patient_id       full_name   state                drug
0           1  Adaeze Okafor   Lagos      metformin500mg
1           2    Chinedu Eze   Enugu    amoxicillin500mg
3           3   Fatima Bello    Kano   paracetamol500mg
4           4   Tunde Bakare     Oyo       amlodipine5mg
    `,

    commonMistakes: [
      "Checking for duplicates BEFORE cleaning text — 'CHINEDU EZE' and 'Chinedu Eze' won't be flagged as duplicates until you normalise casing first.",
      "Using drop_duplicates() with no subset on a wide table — only catches rows identical across EVERY column.",
      "Forgetting regex=True when using a regex pattern in .str.replace().",
      "Using .str.title() on drug names with acronyms — 'hiv' becomes 'Hiv', not 'HIV'. Check the result.",
      "Dropping duplicates with keep='first' without checking which version is more complete — sometimes the LAST entry was a correction.",
    ],

    exercises: [
      "Build a 10-row DataFrame with at least 3 duplicate patient_id entries and inconsistent name casing/whitespace. Count duplicates before any cleaning.",
      "Clean the full_name and state columns: strip whitespace, apply .title(). Recount duplicates by patient_id after cleaning.",
      "Use a regex to extract the numeric dose from a drug_name column like 'Amoxicillin500mg' into a new 'dose_mg' column.",
      "Drop duplicate patient_id rows keeping the LAST occurrence. Print the final row count.",
      "Create a category column with near-duplicates ('Antibiotic', 'antibiotic', 'ANTIBIOTICS', 'Anti-biotic'). Write a mapping dictionary to standardise all to 'Antibiotic'.",
    ],

    exerciseAnswers: [
      `import pandas as pd

data = {
    "patient_id": [1, 2, 2, 3, 4, 4, 5, 6, 6, 7],
    "full_name": ["Adaeze", "CHINEDU EZE", " chinedu eze", "Fatima",
                  "TUNDE", " Tunde ", "Ngozi", "yusuf garba",
                  "Yusuf Garba", "Blessing"],
}
df = pd.DataFrame(data)
print("Duplicates before:", df.duplicated(subset=["patient_id"]).sum())  # 3`,

      `df["full_name"] = df["full_name"].str.strip().str.title()
print("Duplicates after:", df.duplicated(subset=["patient_id"]).sum())  # Still 3`,

      `drug_data = pd.DataFrame({"drug_name": ["Amoxicillin500mg", "Metformin850mg", "Paracetamol300mg"]})
drug_data["dose_mg"] = drug_data["drug_name"].str.extract(r"(\\d+)mg")
print(drug_data)
# dose_mg: 500, 850, 300 (as strings; use .astype(int) to convert)`,

      `deduped = df.drop_duplicates(subset=["patient_id"], keep="last")
print(f"Final row count: {len(deduped)}")  # 7 unique patients`,

      `category = pd.Series(["Antibiotic", "antibiotic", "ANTIBIOTICS", "Anti-biotic"])
mapping = {"antibiotic": "Antibiotic", "antibiotics": "Antibiotic", "anti-biotic": "Antibiotic"}
cleaned = category.str.lower().str.strip().map(mapping).fillna(category)
print(cleaned)  # All four become 'Antibiotic'`,
    ],

    resources: [
      {
        objective: "Detect and remove duplicate records",
        items: [
          { title: "pandas drop_duplicates() docs", url: "https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.drop_duplicates.html", type: "article" },
          { title: "Kaggle — Inconsistent Data Entry", url: "https://www.kaggle.com/code/alexisbcook/inconsistent-data-entry", type: "interactive" },
        ],
      },
      {
        objective: "Practice regex-based string cleaning",
        items: [
          { title: "pandas string methods (.str accessor) docs", url: "https://pandas.pydata.org/docs/user_guide/text.html", type: "article" },
          { title: "Python regex tester (regex101)", url: "https://regex101.com/", type: "interactive" },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 113 — Data Types, Date Parsing, and Outlier Detection
  // ============================================================
  {
    id: "W23D3", week: 23, day: 3, phase: 3,
    phaseTitle: "Data Science Core",
    date: "2026-11-18",
    type: "lesson",
    topic: "Data Types, Date Parsing, and Outlier Detection",
    duration: "2–3 hours",

    objectives: [
      "Convert columns to correct dtypes using .astype() and pd.to_numeric()",
      "Parse inconsistent date formats using pd.to_datetime()",
      "Detect outliers using the IQR method and z-scores",
      "Decide when an outlier is an error vs a genuine extreme value",
    ],

    introduction: `
A column that looks numeric is not always stored as numeric. Dates
entered by different people rarely follow one format. And a single
absurd value — a price of 9,999,999 for paracetamol — can silently
wreck every average and sum you compute downstream.

Today closes out the core data cleaning toolkit: getting types
right, getting dates parseable, and catching the outliers that
indicate either genuine extreme cases or, more often, data entry
errors that need investigation before you trust your analysis.
    `,

    mentalModel: `
TYPE COERCION: pandas often reads messy data as 'object' dtype
(essentially: "I don't know what this is, treating it as text").
Your job is to tell pandas explicitly what each column actually is
— int, float, datetime — so it can validate and compute correctly.

DATE PARSING: pd.to_datetime() is a universal date translator.
Whether the source says "12 Oct 2026", "2026-10-12", or
"10/12/2026", it converts all to one canonical internal
representation, so they sort and compare correctly.

OUTLIER DETECTION (IQR): the IQR is the spread between the 25th
and 75th percentile — the "normal middle" of your data. Anything
1.5x the IQR below Q1 or above Q3 is flagged as an outlier —
not automatically wrong, but worth a closer look.
    `,

    explanation: `
TYPE CONVERSION

df["age"] = df["age"].astype(int)           → fails if NaN present
df["age"] = df["age"].astype("Int64")       → nullable integer, allows NaN
df["price"] = pd.to_numeric(df["price"], errors="coerce")
   → converts to numeric; unconvertible values become NaN
   → SAFE way to clean messy numeric text columns

DATE PARSING

df["date"] = pd.to_datetime(df["date"])
   → auto-detects most formats

df["date"] = pd.to_datetime(df["date"], format="%d/%m/%Y")
   → explicit format for DD/MM/YYYY inputs

df["date"] = pd.to_datetime(df["date"], errors="coerce")
   → unparseable dates become NaT instead of raising an error

EXTRACTING DATE PARTS

df["year"]     = df["date"].dt.year
df["month"]    = df["date"].dt.month
df["day_name"] = df["date"].dt.day_name()

OUTLIER DETECTION — IQR METHOD

Q1 = df["price"].quantile(0.25)
Q3 = df["price"].quantile(0.75)
IQR = Q3 - Q1
upper_bound = Q3 + 1.5 * IQR
outliers = df[df["price"] > upper_bound]

OUTLIER DETECTION — Z-SCORE METHOD

mean = df["price"].mean()
std  = df["price"].std()
df["z_score"] = (df["price"] - mean) / std
outliers = df[df["z_score"].abs() > 3]

DECIDING WHAT TO DO

Investigate first — never blindly drop. An outlier might be:
  - A genuine bulk order (keep it)
  - A data entry error: 9999999 instead of 999 (fix or drop)
  - Mixed units: price in kobo instead of naira (convert)
    `,

    clinicalConnection: `
A patient age of 250 in a hospital system is obviously a data
entry error. Catching it with df.describe() (max jumps out) or an
IQR filter is a first-pass sanity check every clinical dataset
needs before any real analysis.

Dose outliers matter even more. A prescribed quantity of 6000
tablets when normal range is 7-90 is either a bulk institutional
order or a catastrophic data entry error — and the difference
matters for patient safety. Outlier detection is not just a
statistics exercise; in clinical data, it is often your first
automated safety check.
    `,

    example: `
import pandas as pd

data = {
    "patient_id": [1, 2, 3, 4, 5, 6],
    "age": ["34", "45", "29", "250", "38", "abc"],
    "price_ngn": [850, 1200, 300, 9999999, 950, 400],
    "date_dispensed": ["2025-05-01", "01/05/2025", "3 May 2025",
                       "2025-05-04", "2025-05-05", "2025-05-06"],
}
df = pd.DataFrame(data)

# Fix age
df["age"] = pd.to_numeric(df["age"], errors="coerce")
print("Age after coercion:")
print(df["age"])

# Fix dates
df["date_dispensed"] = pd.to_datetime(df["date_dispensed"], errors="coerce")
print("\nDates after parsing:")
print(df["date_dispensed"])

# Detect price outliers using IQR
Q1 = df["price_ngn"].quantile(0.25)
Q3 = df["price_ngn"].quantile(0.75)
IQR = Q3 - Q1
upper_bound = Q3 + 1.5 * IQR
outliers = df[df["price_ngn"] > upper_bound]
print("\nPrice outliers:")
print(outliers[["patient_id", "price_ngn"]])
    `,

    expectedOutput: `
Age after coercion:
0     34.0
1     45.0
2     29.0
3    250.0
4     38.0
5      NaN
Name: age, dtype: float64

Dates after parsing:
0   2025-05-01
1   2025-05-01
2   2025-05-03
3   2025-05-04
4   2025-05-05
5   2025-05-06
Name: date_dispensed, dtype: datetime64[ns]

Price outliers:
   patient_id  price_ngn
3           4    9999999
    `,

    commonMistakes: [
      "Using .astype(int) directly on a column with NaN — this raises an error. Use pd.to_numeric(errors='coerce') first.",
      "Not specifying errors='coerce' when parsing dates — pd.to_datetime() will raise on the first unparseable value.",
      "Treating age=250 as 'probably fine' without investigation — always inspect outliers before deciding what to do.",
      "Using the IQR method on naturally wide-range columns (e.g. drug prices spanning 50 to 50,000 genuinely) — context matters more than the formula.",
      "Forgetting that dd/mm/yyyy order may be auto-interpreted incorrectly — always verify a date sample after parsing Nigerian-style dates.",
    ],

    exercises: [
      "Build a 'quantity' column stored as text with some non-numeric entries ('30', '60', 'sixty', '21'). Use pd.to_numeric with errors='coerce'. How many became NaN?",
      "Build a 'date_dispensed' column with at least 3 different date formats. Parse with pd.to_datetime(errors='coerce'). Extract the month name into a new column.",
      "Using the IQR method, detect outliers in a price column where one value is 100x larger than the rest. Print the bounds and the flagged row(s).",
      "Using the z-score method on the same column, confirm the same outlier has a z-score magnitude > 3.",
      "Decide and justify in a comment: would you drop, cap, or investigate the outlier? Implement your choice using .clip() or .drop().",
    ],

    exerciseAnswers: [
      `import pandas as pd

qty_text = pd.Series(["30", "60", "sixty", "21", "14"])
qty_clean = pd.to_numeric(qty_text, errors="coerce")
print(qty_clean)
print(f"NaN count: {qty_clean.isnull().sum()}")  # 1 ('sixty')`,

      `dates = pd.Series(["2025-05-01", "02/05/2025", "5 May 2025", "not a date"])
parsed = pd.to_datetime(dates, errors="coerce")
month_name = parsed.dt.month_name()
print(month_name)
# 3 valid dates parse to May; 'not a date' becomes NaT → NaN for month_name`,

      `prices = pd.Series([850, 1200, 300, 950, 400, 99000])
Q1, Q3 = prices.quantile(0.25), prices.quantile(0.75)
IQR = Q3 - Q1
upper = Q3 + 1.5 * IQR
print(f"Upper bound: {upper:.0f}")
print(prices[prices > upper])  # 99000 flagged`,

      `mean, std = prices.mean(), prices.std()
z_scores = (prices - mean) / std
print(z_scores)
print(prices[z_scores.abs() > 3])  # 99000 confirmed as outlier`,

      `# Cap at upper bound rather than dropping — preserves the row
# for other analyses; the price can be reviewed manually
prices_capped = prices.clip(upper=upper)
print(prices_capped)  # 99000 replaced with upper bound value`,
    ],

    resources: [
      {
        objective: "Master dtype conversion and date parsing",
        items: [
          { title: "pandas to_datetime() docs", url: "https://pandas.pydata.org/docs/reference/api/pandas.to_datetime.html", type: "article" },
          { title: "pandas to_numeric() docs", url: "https://pandas.pydata.org/docs/reference/api/pandas.to_numeric.html", type: "article" },
        ],
      },
      {
        objective: "Understand outlier detection methods",
        items: [
          { title: "Outlier detection with IQR (Towards Data Science)", url: "https://towardsdatascience.com/detecting-and-treating-outliers-in-python-part-1-4ece5098b755", type: "article" },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 114 — Building a Reusable Data Cleaning Pipeline
  // ============================================================
  {
    id: "W23D4", week: 23, day: 4, phase: 3,
    phaseTitle: "Data Science Core",
    date: "2026-11-19",
    type: "lesson",
    topic: "Building a Reusable Data Cleaning Pipeline",
    duration: "2–3 hours",

    objectives: [
      "Combine cleaning steps into a single reusable function",
      "Apply the function to a fresh, unseen messy dataset",
      "Log what each cleaning step changed (rows dropped, values filled)",
      "Understand why pipelines matter for production data work",
    ],

    introduction: `
Today you stop writing one-off cleaning scripts and start writing
a CLEANING PIPELINE — a single function that takes any raw
DataFrame matching your expected schema and returns a clean one,
with a log of exactly what changed.

This is the difference between cleaning data once and cleaning
data as a repeatable, auditable process. New data arrives daily
or monthly in real work, needing the same cleaning every time.
A function you can call repeatedly, with logging, is what separates
a hobbyist script from production-quality work — and connects
directly to Phase 2's Airflow DAG tasks and dbt models.
    `,

    mentalModel: `
Think of a cleaning pipeline as an assembly line, not a workbench.

Raw data enters at one end. It passes through clearly named
stations, each doing ONE job:

  STATION 1: Standardise column names
  STATION 2: Fix data types
  STATION 3: Handle missing values
  STATION 4: Remove duplicates
  STATION 5: Flag/handle outliers

At each station, you log what happened. By the end, clean data
exits and you have a complete, auditable trail — essential in
regulated contexts (pharma, clinical data) where you may need
to justify exactly how a number in a report was derived.
    `,

    explanation: `
STRUCTURING A CLEANING FUNCTION

def clean_dispensing_data(df):
    log = []
    df = df.copy()   # never mutate the original
    initial_rows = len(df)

    # Station 1: standardise column names
    df.columns = df.columns.str.strip().str.lower().str.replace(" ", "_")

    # Station 2: fix types
    df["quantity"]   = pd.to_numeric(df["quantity"], errors="coerce")
    df["unit_price"] = pd.to_numeric(df["unit_price"], errors="coerce")
    df["date"]       = pd.to_datetime(df["date"], errors="coerce")

    # Station 3: handle missing values
    before = len(df)
    df = df.dropna(subset=["patient_id", "drug_name"])
    log.append(f"Dropped {before - len(df)} rows missing key fields")

    missing_qty = df["quantity"].isnull().sum()
    df["quantity"] = df["quantity"].fillna(df["quantity"].median())
    log.append(f"Filled {missing_qty} missing quantities with median")

    # Station 4: remove duplicates
    df["full_name"] = df["full_name"].str.strip().str.title()
    before = len(df)
    df = df.drop_duplicates(subset=["patient_id", "drug_name", "date"])
    log.append(f"Removed {before - len(df)} duplicate rows")

    # Station 5: flag outliers
    Q1, Q3 = df["unit_price"].quantile([0.25, 0.75])
    IQR = Q3 - Q1
    df["price_outlier_flag"] = df["unit_price"] > Q3 + 1.5 * IQR
    log.append(f"Flagged {df['price_outlier_flag'].sum()} price outliers")

    log.append(f"Final: {initial_rows} to {len(df)} rows")
    return df, log

WHY .copy() MATTERS

Without df.copy(), your function modifies the ORIGINAL DataFrame
the caller passed in — a classic source of bugs where data
"mysteriously" changes outside the function.

WHY RETURN A LOG

Returning (clean_df, log) means every call produces a record of
what happened — essential when someone asks why this month's
report shows fewer records than the raw export.
    `,

    clinicalConnection: `
A reusable cleaning pipeline mirrors how Standard Operating
Procedures (SOPs) work in pharmacy practice. An SOP for medication
reconciliation is not improvised each time — it is a documented,
repeatable sequence, applied identically every time, with a record
of what was done.

Your cleaning pipeline function IS the data-engineering equivalent
of an SOP: documented, repeatable, auditable — applied identically
to every new batch of dispensing data, with a log functioning like
a clinical note. This mindset — "build the process once, apply it
consistently, log everything" — is exactly what NAFDAC increasingly
expects from pharmacovigilance reporting systems.
    `,

    example: `
import pandas as pd
import numpy as np

def clean_pharmacy_data(df):
    """Cleans raw pharmacy dispensing data. Returns (clean_df, log)."""
    log = []
    df = df.copy()
    initial_rows = len(df)

    df.columns = df.columns.str.strip().str.lower().str.replace(" ", "_")
    df["quantity"]   = pd.to_numeric(df["quantity"], errors="coerce")
    df["unit_price"] = pd.to_numeric(df["unit_price"], errors="coerce")

    df["patient_name"] = df["patient_name"].str.strip().str.title()

    before = len(df)
    df = df.dropna(subset=["patient_name"])
    log.append(f"Dropped {before - len(df)} rows with missing patient name")

    missing_qty = df["quantity"].isnull().sum()
    df["quantity"] = df["quantity"].fillna(df["quantity"].median())
    log.append(f"Filled {missing_qty} missing quantities with median")

    before = len(df)
    df = df.drop_duplicates(subset=["patient_name", "drug"])
    log.append(f"Removed {before - len(df)} duplicate rows")

    log.append(f"Final: {initial_rows} to {len(df)} rows")
    return df, log


raw = pd.DataFrame({
    "Patient Name": ["  adaeze okafor", "CHINEDU EZE", "Chinedu Eze",
                     None, "Tunde Bakare"],
    "Drug":         ["Metformin", "Amoxicillin", "Amoxicillin",
                     "Paracetamol", "Amlodipine"],
    "Quantity":     ["60", "21", "21", "30", "abc"],
    "Unit Price":   [850, 1200, 1200, 300, 950],
})

clean_df, change_log = clean_pharmacy_data(raw)
print("Cleaned data:")
print(clean_df)
print("\nChange log:")
for entry in change_log:
    print(" -", entry)
    `,

    expectedOutput: `
Cleaned data:
   patient_name         drug  quantity  unit_price
0  Adaeze Okafor    Metformin      60.0         850
1    Chinedu Eze  Amoxicillin      21.0        1200
4   Tunde Bakare   Amlodipine      30.0         950

Change log:
 - Dropped 1 rows with missing patient name
 - Filled 1 missing quantities with median
 - Removed 1 duplicate rows
 - Final: 5 to 3 rows
    `,

    commonMistakes: [
      "Not calling df.copy() at the start — silently mutates the caller's original DataFrame.",
      "Hardcoding column names without standardising first — if raw data sometimes has 'Patient Name' and sometimes 'patient_name', the pipeline breaks.",
      "Deduplicating BEFORE cleaning text — near-duplicates with different casing won't be caught.",
      "Not returning a log — you cannot answer 'why did the row count change' weeks later.",
      "Building one giant cleaning step instead of separate named stations — hard to debug when only one part of the cleaning is wrong.",
    ],

    exercises: [
      "Write a clean_sales_data(df) function that standardises column names, converts quantity and price to numeric, and returns (clean_df, log).",
      "Add a station that drops rows missing 'patient_id', logging how many were dropped.",
      "Add a station that cleans drug_name text (strip, title case) and removes duplicates based on (patient_id, drug_name).",
      "Test your function on TWO different messy datasets with different missing columns and duplicate patterns. Confirm it handles both without errors.",
      "Add a final station that flags price outliers with IQR and adds a boolean 'price_outlier_flag' column. Log how many rows were flagged.",
    ],

    exerciseAnswers: [
      `import pandas as pd

def clean_sales_data(df):
    log = []
    df = df.copy()
    df.columns = df.columns.str.strip().str.lower().str.replace(" ", "_")
    df["quantity"] = pd.to_numeric(df["quantity"], errors="coerce")
    df["price"] = pd.to_numeric(df["price"], errors="coerce")
    log.append("Standardised columns and converted quantity/price to numeric")
    return df, log`,

      `def clean_sales_data(df):
    log = []
    df = df.copy()
    df.columns = df.columns.str.strip().str.lower().str.replace(" ", "_")
    df["quantity"] = pd.to_numeric(df["quantity"], errors="coerce")
    df["price"] = pd.to_numeric(df["price"], errors="coerce")
    before = len(df)
    df = df.dropna(subset=["patient_id"])
    log.append(f"Dropped {before - len(df)} rows missing patient_id")
    return df, log`,

      `def clean_sales_data(df):
    log = []
    df = df.copy()
    df.columns = df.columns.str.strip().str.lower().str.replace(" ", "_")
    df["quantity"] = pd.to_numeric(df["quantity"], errors="coerce")
    df["price"] = pd.to_numeric(df["price"], errors="coerce")
    before = len(df)
    df = df.dropna(subset=["patient_id"])
    log.append(f"Dropped {before - len(df)} rows missing patient_id")
    df["drug_name"] = df["drug_name"].str.strip().str.title()
    before = len(df)
    df = df.drop_duplicates(subset=["patient_id", "drug_name"])
    log.append(f"Removed {before - len(df)} duplicate rows")
    return df, log`,

      `raw1 = pd.DataFrame({
    "Patient Id": [1, 2, 2], "Drug Name": ["metformin", "AMOXICILLIN", "Amoxicillin"],
    "Quantity": ["60", "21", "21"], "Price": [850, 1200, 1200],
})
raw2 = pd.DataFrame({
    "Patient Id": [1, None, 3], "Drug Name": ["Paracetamol", "Ibuprofen", "Amlodipine"],
    "Quantity": ["30", "abc", "30"], "Price": [300, 400, 950],
})
clean1, log1 = clean_sales_data(raw1)
clean2, log2 = clean_sales_data(raw2)
print("Dataset 1:", log1)
print("Dataset 2:", log2)`,

      `def clean_sales_data(df):
    log = []
    df = df.copy()
    df.columns = df.columns.str.strip().str.lower().str.replace(" ", "_")
    df["quantity"] = pd.to_numeric(df["quantity"], errors="coerce")
    df["price"] = pd.to_numeric(df["price"], errors="coerce")
    before = len(df)
    df = df.dropna(subset=["patient_id"])
    log.append(f"Dropped {before - len(df)} rows missing patient_id")
    df["drug_name"] = df["drug_name"].str.strip().str.title()
    before = len(df)
    df = df.drop_duplicates(subset=["patient_id", "drug_name"])
    log.append(f"Removed {before - len(df)} duplicate rows")
    Q1, Q3 = df["price"].quantile([0.25, 0.75])
    IQR = Q3 - Q1
    df["price_outlier_flag"] = df["price"] > Q3 + 1.5 * IQR
    log.append(f"Flagged {df['price_outlier_flag'].sum()} price outliers")
    return df, log`,
    ],

    resources: [
      {
        objective: "Learn pipeline design patterns for data cleaning",
        items: [
          { title: "Building data cleaning pipelines in pandas (Real Python)", url: "https://realpython.com/python-data-cleaning-numpy-pandas/", type: "article" },
          { title: "pandas pipe() method for chaining transformations", url: "https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.pipe.html", type: "article" },
        ],
      },
      {
        objective: "Connect cleaning pipelines to production tools",
        items: [
          { title: "Great Expectations overview", url: "https://docs.greatexpectations.io/docs/", type: "article" },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 115 — PROJECT: Clean the Dirty Dataset
  // ============================================================
  {
    id: "W23D5", week: 23, day: 5, phase: 3,
    phaseTitle: "Data Science Core",
    date: "2026-11-20",
    type: "project",
    topic: "Project: Clean the Dirty Dataset",
    duration: "3–4 hours",

    objectives: [
      "Apply the full Week 23 cleaning toolkit to a realistically messy dataset",
      "Build a complete, logged cleaning pipeline from raw to analysis-ready",
      "Validate the cleaned data with a before/after comparison",
      "Produce a short data quality report summarising what was found and fixed",
    ],

    introduction: `
This is the project Week 23 has been building toward: take
genuinely messy data — structurally similar to the dirty dataset
in your Lab — and turn it into something trustworthy enough to
analyse.

Open your Lab, switch to SQL, select the Dirty dataset, and tap
"View Sample Tables" to see the kinds of problems in patients_raw,
drugs_raw, and sales_raw. You will recreate an equivalent messy
dataset in pandas today and clean it using everything from
this week.
    `,

    mentalModel: `
The full cleaning workflow for this project:

1. LOAD raw, messy data (build it deliberately messy)
2. PROFILE it — df.info(), df.describe(), isnull().sum(),
   duplicated().sum() — understand the damage before fixing
3. BUILD a cleaning pipeline function
4. RUN it, capturing the log
5. VALIDATE — compare before/after row counts, dtypes, nulls
6. REPORT — a short written summary of what was wrong and what
   you did, written for a non-technical pharmacy manager
    `,

    explanation: `
PROJECT BRIEF

Build a deliberately messy 15-20 row dispensing dataset with:
  - Duplicate patient_id values
  - full_name with inconsistent casing/whitespace, some missing
  - age stored as text with some non-numeric entries
  - drug_name with near-duplicate spellings
  - unit_price with currency symbols or 'N/A' mixed in
  - date_dispensed in at least 3 different formats
  - at least one clear price outlier

Then:
1. PROFILE the raw data
2. WRITE a clean_dispensing_data(df) pipeline covering all
   Week 23 stations
3. RUN it and print the log
4. VALIDATE with before/after comparison
5. WRITE a 4-6 sentence data quality report as a Python string,
   for a non-technical pharmacy manager

Push the completed script to your GitHub progress log.
    `,

    clinicalConnection: `
This project is the pandas equivalent of your Lab's dirty SQL
dataset — and that connection is intentional. By finishing this,
you will have practiced the same data-cleaning mindset in two
tools (SQL and pandas), exactly how real data teams work.

The data quality report mirrors something genuinely useful in
practice — the kind of short, honest summary a pharmacy
informatics lead writes before presenting monthly figures to
hospital management: "here is what we found wrong with the source
data, and here is exactly what we did to fix it."

That kind of transparent, documented data quality communication is
rare and valuable. Your clinical background lets you write it with
the right emphasis — flagging issues that genuinely matter for
patient safety, not just statistical tidiness.
    `,

    example: `
import pandas as pd
import numpy as np

raw = pd.DataFrame({
    "Patient ID": [1, 2, 2, 3, 4, 5, 5],
    "Full Name": ["  adaeze okafor", "CHINEDU EZE", "Chinedu Eze",
                  None, "Tunde Bakare", "ngozi umeh", "Ngozi Umeh"],
    "Age": ["34", "45", "45", "29", "fifty-two", "38", "38"],
    "Drug Name": ["metformin500mg", "AMOXICILLIN 500MG",
                  "Amoxicillin500mg", "paracetamol 500mg",
                  "Amlodipine5mg", "Artemether250mg", "Artemether250mg"],
    "Unit Price": ["850", "1200", "1200", "300", "N/A", "1500", "1500"],
    "Date Dispensed": ["2025-05-01", "02/05/2025", "02/05/2025",
                       "3 May 2025", "2025-05-04", "5/5/2025", "5/5/2025"],
})

print("Shape:", raw.shape)
print("Nulls:\n", raw.isnull().sum())
print("Duplicate Patient IDs:", raw.duplicated(subset=["Patient ID"]).sum())
    `,

    expectedOutput: `
Shape: (7, 6)
Nulls:
 Patient ID         0
Full Name          1
Age                0
Drug Name          0
Unit Price         0
Date Dispensed     0
dtype: int64
Duplicate Patient IDs: 2

(Full output depends on your complete clean_dispensing_data()
 implementation — target a final dataset with standardised
 columns, correct dtypes, no unjustified duplicates, and a
 clear change log with before/after counts.)
    `,

    commonMistakes: [
      "Building a dataset that is too clean — make it genuinely messy in at least 5 distinct ways, mirroring the Lab's dirty dataset.",
      "Writing one-off steps instead of a reusable function — the whole point of Week 23 is the Day 114 pipeline pattern.",
      "Forgetting to validate after cleaning — always show a before/after comparison.",
      "Writing the final report in overly technical language — it should be readable by a non-technical pharmacy manager.",
      "Dropping the price outlier before checking 'N/A' coercion — always coerce types before outlier detection.",
    ],

    exercises: [
      "Build the full 15-20 row messy dataset. Profile it: print shape, isnull().sum(), duplicated(subset=['patient_id']).sum(), and dtypes.",
      "Write your clean_dispensing_data(df) pipeline with at least 4 named stations.",
      "Run the pipeline and print the full change log.",
      "Print a before/after comparison: row count, null count, and confirm age and unit_price are now numeric dtype.",
      "Write a 4-6 sentence data quality report as a Python string, written for a non-technical pharmacy manager. Print it.",
    ],

    exerciseAnswers: [
      `import pandas as pd
import numpy as np

raw = pd.DataFrame({
    "Patient ID": [1, 2, 2, 3, 4, 5, 5, 6, 7, 8, 9, 9, 10, 11, 12],
    "Full Name": ["  adaeze okafor", "CHINEDU EZE", "Chinedu Eze", None,
                  "Tunde Bakare", "ngozi umeh", "Ngozi Umeh", "Yusuf Garba",
                  "Blessing Etim", "Emeka Nwosu", "Aisha Mohammed",
                  "Aisha Mohammed", "Ikenna Duru", "Obiageli Eze", "Usman Garba"],
    "Age": ["34", "45", "45", "29", "fifty-two", "38", "38", "61", "27",
            "49", "31", "31", "55", "42", "39"],
    "Drug Name": ["metformin500mg", "AMOXICILLIN 500MG", "Amoxicillin500mg",
                  "paracetamol500mg", "Amlodipine5mg", "Artemether250mg",
                  "Artemether250mg", "Ibuprofen400mg", "Metformin500mg",
                  "Amoxicillin500mg", "Lisinopril10mg", "Lisinopril10mg",
                  "Omeprazole20mg", "Paracetamol500mg", "Amlodipine5mg"],
    "Unit Price": ["850", "1200", "1200", "300", "N/A", "1500", "1500",
                   "400", "850", "1200", "600", "600", "999999", "300", "950"],
    "Date Dispensed": ["2025-05-01", "02/05/2025", "02/05/2025", "3 May 2025",
                       "2025-05-04", "5/5/2025", "5/5/2025", "2025-05-06",
                       "2025-05-07", "2025-05-08", "2025-05-09", "2025-05-09",
                       "2025-05-10", "2025-05-11", "2025-05-12"],
})
print("Shape:", raw.shape)
print(raw.isnull().sum())
print("Dupes:", raw.duplicated(subset=["Patient ID"]).sum())`,

      `def clean_dispensing_data(df):
    log = []
    df = df.copy()
    initial_rows = len(df)
    df.columns = df.columns.str.strip().str.lower().str.replace(" ", "_")
    df["age"] = pd.to_numeric(df["age"], errors="coerce")
    df["unit_price"] = (df["unit_price"].astype(str)
                         .str.replace("N/A", "", regex=False)
                         .str.strip())
    df["unit_price"] = pd.to_numeric(df["unit_price"], errors="coerce")
    df["date_dispensed"] = pd.to_datetime(df["date_dispensed"], errors="coerce")
    log.append("Station 1-2: columns standardised and types coerced")
    before = len(df)
    df = df.dropna(subset=["full_name"])
    log.append(f"Station 3: Dropped {before - len(df)} rows missing full_name")
    df["age"] = df["age"].fillna(df["age"].median())
    df["full_name"] = df["full_name"].str.strip().str.title()
    df["drug_name"] = df["drug_name"].str.lower().str.replace(" ", "", regex=False)
    before = len(df)
    df = df.drop_duplicates(subset=["patient_id", "drug_name"])
    log.append(f"Station 4: Removed {before - len(df)} duplicate rows")
    Q1, Q3 = df["unit_price"].quantile([0.25, 0.75])
    IQR = Q3 - Q1
    df["price_outlier_flag"] = df["unit_price"] > Q3 + 1.5 * IQR
    log.append(f"Station 5: Flagged {df['price_outlier_flag'].sum()} price outliers")
    log.append(f"Final: {initial_rows} to {len(df)} rows")
    return df, log`,

      `clean_df, change_log = clean_dispensing_data(raw)
for entry in change_log:
    print(" -", entry)`,

      `print("BEFORE:")
print(f"  Rows: {len(raw)}")
print(f"  Nulls:\n{raw.isnull().sum()}")
print("\nAFTER:")
print(f"  Rows: {len(clean_df)}")
print(f"  Nulls:\n{clean_df.isnull().sum()}")
print(f"  Age dtype: {clean_df['age'].dtype}")
print(f"  Unit price dtype: {clean_df['unit_price'].dtype}")`,

      `report = """
DATA QUALITY REPORT — May 2025 Dispensing Records

We reviewed 15 raw dispensing records before monthly reporting.
One record was excluded due to a missing patient name, making it
impossible to reliably attribute the dispensing. Four duplicate
records (same patient, same drug) were identified and removed,
likely caused by double-entry in the dispensary system.
One price entry (999,999) is far above the normal drug price
range and has been flagged for manual verification rather than
included in revenue totals. All date and numeric fields have
been standardised to consistent formats. The final dataset
contains 12 verified records ready for analysis.
"""
print(report)`,
    ],

    resources: [
      {
        objective: "Review the full Week 23 cleaning toolkit",
        items: [
          { title: "pandas data cleaning checklist (Towards Data Science)", url: "https://towardsdatascience.com/data-cleaning-with-python-and-pandas-detecting-missing-values-3e9c6ebcf78b", type: "article" },
          { title: "Kaggle — full Data Cleaning micro-course", url: "https://www.kaggle.com/learn/data-cleaning", type: "interactive" },
        ],
      },
      {
        objective: "See data quality reporting examples",
        items: [
          { title: "Writing effective data quality reports", url: "https://www.montecarlodata.com/blog-data-quality-report/", type: "article" },
        ],
      },
    ],
  },

];
