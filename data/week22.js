// ============================================================
// WEEK 22 — pandas Advanced: groupby, merge, pivot, apply
// Days 106–110 | 9 Nov 2026 – 13 Nov 2026
// Phase 3: Data Science Core
// ============================================================

const WEEK22 = [

  // ============================================================
  // DAY 106 — groupby: Split, Apply, Combine
  // ============================================================
  {
    id: "W22D1", week: 22, day: 1, phase: 3,
    phaseTitle: "Data Science Core",
    date: "2026-11-09",
    type: "lesson",
    topic: "groupby: Split, Apply, Combine",
    duration: "2–3 hours",

    objectives: [
      "Understand the split-apply-combine pattern behind groupby",
      "Use groupby with sum(), mean(), count(), min(), max()",
      "Group by multiple columns simultaneously",
      "Use .agg() to apply multiple aggregation functions at once",
    ],

    introduction: `
The single most powerful analytical operation in pandas is groupby.

Every meaningful business question involves aggregation: "total 
sales per region", "average dispensing per pharmacist", "count of 
patients per drug category". Without groupby you answer these 
with clunky loops. With groupby you answer them in one line.

The mental unlock today is the split-apply-combine pattern — once 
you see it, every groupby operation is obvious, even on complex 
multi-column datasets. This is also the conceptual bridge between 
pandas and SQL: groupby is the exact equivalent of GROUP BY, and 
.agg() maps directly to SELECT SUM(), AVG(), COUNT().
    `,

    mentalModel: `
groupby works in three steps, always:

1. SPLIT — divide the DataFrame into groups based on a column's 
   unique values. If you group by "category", you get one group 
   for "Antibiotic", one for "Analgesic", etc.

2. APPLY — run a function on each group independently.
   sum() adds all values in the group.
   mean() averages them. count() counts non-null rows.

3. COMBINE — stitch the per-group results back into a single 
   output DataFrame or Series.

SQL equivalent:
  SELECT category, SUM(total_cost) FROM sales GROUP BY category
  → df.groupby("category")["total_cost"].sum()

The result is a Series (or DataFrame) indexed by the group keys. 
This is the output you filter, sort, plot, or export.
    `,

    explanation: `
BASIC GROUPBY

df.groupby("category")["total_cost"].sum()
→ total cost per category (returns a Series, indexed by category)

df.groupby("category")["total_cost"].mean()
→ average cost per category

df.groupby("category").size()
→ count of rows per category (including nulls)

df.groupby("category")["total_cost"].count()
→ count of non-null values in total_cost per category

GROUPBY MULTIPLE COLUMNS

df.groupby(["category", "pharmacist"])["total_cost"].sum()
→ total cost per (category, pharmacist) combination

AGGREGATION WITH .agg()

df.groupby("category")["total_cost"].agg(["sum", "mean", "count"])
→ all three stats in one DataFrame

df.groupby("category").agg(
    total_revenue=("total_cost", "sum"),
    avg_cost=("total_cost", "mean"),
    num_records=("record_id", "count"),
)
→ named aggregation — cleanest syntax for production code

RESETTING THE INDEX

groupby results have the group key as the index. To bring it 
back as a regular column:
result = df.groupby("category")["total_cost"].sum().reset_index()

SORTING AFTER GROUPBY

result = (
    df.groupby("category")["total_cost"]
    .sum()
    .sort_values(ascending=False)
    .reset_index()
)
    `,

    clinicalConnection: `
Monthly antimicrobial stewardship reports — required in most 
Nigerian tertiary hospitals — ask exactly the questions groupby 
answers:

- Total antibiotic dispensings per month by class
- Average course length (days_supply) by antibiotic type
- Count of antibiotic courses per ward/department

Before pandas, this meant manually tallying from paper registers 
or exporting to Excel and doing pivot tables by hand. With groupby:

df.groupby("antibiotic_class")["days_supply"].mean()

returns the average course length per class in one line — 
reproducible, auditable, and running in milliseconds on a year's 
worth of records.

This is the difference between "a pharmacist who does data work" 
and "a data scientist with pharmacy expertise." The expertise 
tells you which question to ask. The pandas skill answers it.
    `,

    example: `
import pandas as pd

data = {
    "record_id":  list(range(1, 11)),
    "drug":       ["Metformin 500mg", "Amoxicillin 500mg",
                   "Paracetamol 500mg", "Amlodipine 5mg",
                   "Artemether/Lumefantrine", "Amoxicillin 500mg",
                   "Metformin 500mg", "Ibuprofen 400mg",
                   "Amlodipine 5mg", "Artemether/Lumefantrine"],
    "category":   ["Antidiabetic", "Antibiotic", "Analgesic",
                   "Antihypertensive", "Antimalarial", "Antibiotic",
                   "Antidiabetic", "Analgesic",
                   "Antihypertensive", "Antimalarial"],
    "pharmacist": ["Victor", "Ngozi", "Victor", "Adunola", "Victor",
                   "Ngozi", "Adunola", "Victor", "Ngozi", "Adunola"],
    "quantity":   [60, 21, 30, 30, 6, 14, 60, 30, 30, 6],
    "unit_price": [850, 1200, 300, 950, 1500, 1200, 850, 400, 950, 1500],
}
df = pd.DataFrame(data)
df["total_cost"] = df["quantity"] * df["unit_price"]

# Revenue per category
print("Revenue by category:")
print(df.groupby("category")["total_cost"].sum()
      .sort_values(ascending=False))

# Named aggregation — multiple stats at once
print("\nDetailed stats per category:")
summary = df.groupby("category").agg(
    total_revenue=("total_cost", "sum"),
    avg_unit_price=("unit_price", "mean"),
    num_dispensings=("record_id", "count"),
).reset_index()
print(summary)

# Multi-column groupby
print("\nRevenue per pharmacist per category:")
print(df.groupby(["pharmacist", "category"])["total_cost"].sum()
      .reset_index().sort_values("total_cost", ascending=False))
    `,

    expectedOutput: `
Revenue by category:
category
Antidiabetic        102000
Antimalarial         27000
Antibiotic           42600
Antihypertensive     57000
Analgesic            21000
Name: total_cost, dtype: int64

Detailed stats per category:
           category  total_revenue  avg_unit_price  num_dispensings
0          Analgesic          21000           350.0                2
1         Antibiotic          42600          1200.0                2
2       Antidiabetic         102000           850.0                2
3   Antihypertensive          57000           950.0                2
4       Antimalarial          27000          1500.0                2

Revenue per pharmacist per category:
   pharmacist          category  total_cost
...
(output varies by groupby combination)
    `,

    commonMistakes: [
      "Forgetting that groupby returns a GroupBy object, not a DataFrame — you must call an aggregation (.sum(), .mean(), etc.) or .agg() to get a result you can print.",
      "Not resetting the index after groupby — the group key becomes the index, which breaks subsequent operations that expect a default RangeIndex.",
      "Using .agg(['sum', 'mean']) when you want named columns — prefer .agg(total=('col', 'sum'), avg=('col', 'mean')) for cleaner column names in the output.",
      "Confusing .size() and .count() — .size() counts all rows per group including nulls; .count() counts only non-null values per column.",
      "Applying groupby to a string column and then calling .sum() — this concatenates strings rather than raising an error, producing nonsense output. Always specify the numeric column explicitly.",
    ],

    exercises: [
      "Using the 10-row dataset from the example, compute total revenue and average unit_price per pharmacist. Sort by total revenue descending.",
      "Use .agg() to compute the sum, mean, and max of total_cost grouped by category. Reset the index and print the result.",
      "Group by both pharmacist and category. Count the number of dispensings per combination. Which combination has the most records?",
      "Filter the DataFrame to only Antibiotic and Antimalarial rows, then group by category and compute total quantity dispensed.",
      "Find the category with the single highest average unit_price using groupby + mean + idxmax(). Print the category name and the average price.",
    ],

    exerciseAnswers: [
      `result = df.groupby("pharmacist").agg(
    total_revenue=("total_cost", "sum"),
    avg_unit_price=("unit_price", "mean"),
).sort_values("total_revenue", ascending=False).reset_index()
print(result)
# Adunola: ₦68250, Victor: ₦61050, Ngozi: ₦54300 (approx, depends on data)`,

      `result = df.groupby("category").agg(
    total=("total_cost", "sum"),
    mean=("total_cost", "mean"),
    max=("total_cost", "max"),
).reset_index()
print(result)`,

      `result = df.groupby(["pharmacist", "category"]).size().reset_index(name="count")
print(result.sort_values("count", ascending=False))
# Each combination appears once in this small dataset (count=1)`,

      `filtered = df[df["category"].isin(["Antibiotic", "Antimalarial"])]
print(filtered.groupby("category")["quantity"].sum().reset_index())
# Antibiotic: 35 (21+14), Antimalarial: 12 (6+6)`,

      `avg_prices = df.groupby("category")["unit_price"].mean()
top_cat = avg_prices.idxmax()
print(f"Highest avg unit_price category: {top_cat}")
print(f"Average price: ₦{avg_prices[top_cat]:,.0f}")
# Antimalarial at ₦1500`,
    ],

    resources: [
      {
        objective: "Understand the split-apply-combine pattern",
        items: [
          { title: "pandas groupby guide (official docs)", url: "https://pandas.pydata.org/docs/user_guide/groupby.html", type: "article" },
          { title: "groupby explained (Corey Schafer)", url: "https://www.youtube.com/watch?v=Qpakvlf0jmQ", type: "video" },
        ],
      },
      {
        objective: "Practice named aggregation with .agg()",
        items: [
          { title: "Kaggle pandas micro-course — Grouping and Sorting", url: "https://www.kaggle.com/kernels/fork/587910", type: "interactive" },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 107 — merge and join: Combining DataFrames
  // ============================================================
  {
    id: "W22D2", week: 22, day: 2, phase: 3,
    phaseTitle: "Data Science Core",
    date: "2026-11-10",
    type: "lesson",
    topic: "merge and join: Combining DataFrames",
    duration: "2–3 hours",

    objectives: [
      "Understand the four join types: inner, left, right, outer",
      "Use pd.merge() to combine DataFrames on shared keys",
      "Identify and handle key mismatches that produce unexpected NaN",
      "Use pd.concat() to stack DataFrames vertically or horizontally",
    ],

    introduction: `
Real data is never in one table.

Patient records live in one table. Drug information lives in 
another. Sales transactions in a third. The ability to combine 
these tables correctly — bringing in the right columns from each, 
not losing rows you need, not duplicating rows you should not — is 
what separates a useful analysis from a misleading one.

pandas merge is SQL JOIN, translated directly to Python. If you 
already understand SQL JOINs from Phase 2, today is reinforcement 
in a new syntax. If JOINs felt shaky in SQL, today is a second 
chance to build real intuition — with visual examples and clinical 
context that make the abstract concrete.
    `,

    mentalModel: `
Think of two tables as two lists of information that share a 
common identifier (a "key"):

Table A: patients — patient_id, name, age, state
Table B: sales — sale_id, patient_id, drug, amount

The patient_id column appears in both. It is the key.

INNER JOIN — "only show me rows where the key exists in BOTH tables."
  A patient with no sales? Gone. A sale with no matching patient? Gone.

LEFT JOIN — "keep everything from the LEFT table; if there is a 
  match in the right, bring in those columns; if not, fill with NaN."
  Patient with no sales? Still shown, but sale columns are NaN.

RIGHT JOIN — opposite of left. Keep everything from the RIGHT table.

OUTER (FULL) JOIN — keep everything from both. NaN where no match.

pd.concat() is different — it stacks DataFrames that have the 
same columns (vertical) or same rows (horizontal) without 
needing a key. Think: "add more rows from a second month".
    `,

    explanation: `
pd.merge() — KEY-BASED COMBINING

Basic merge (inner join by default):
pd.merge(df_left, df_right, on="patient_id")

Specify join type:
pd.merge(df_patients, df_sales, on="patient_id", how="left")
pd.merge(df_patients, df_sales, on="patient_id", how="inner")
pd.merge(df_patients, df_sales, on="patient_id", how="outer")

Merge on different column names in each table:
pd.merge(df_a, df_b, left_on="pt_id", right_on="patient_id")

Merge on multiple keys:
pd.merge(df_a, df_b, on=["patient_id", "date"])

HANDLING DUPLICATE COLUMNS

When both tables have a column with the same name (not the key), 
pandas adds suffixes:
pd.merge(df_a, df_b, on="id", suffixes=("_left", "_right"))

CHECKING MERGE RESULTS

Always check: did the row count change as expected?
len(result)

Look for unexpected NaN in key columns after a left join — this 
signals unmatched rows.
result[result["drug"].isnull()]

pd.concat() — STACKING WITHOUT A KEY

Vertical (more rows, same columns):
pd.concat([df_may, df_june], ignore_index=True)

Horizontal (more columns, same rows):
pd.concat([df_a, df_b], axis=1)
    `,

    clinicalConnection: `
Every drug information system in healthcare is a relational 
database with multiple joined tables.

In Nigeria's LMIS (Logistics Management Information System), 
dispensing data and drug catalogue data live separately. To 
produce a meaningful report — "how much did we spend on 
antibiotics per patient?" — you must join the dispensing table 
(has patient_id and drug_id) with the drug catalogue (has drug_id, 
category, unit_price) and the patient register (has patient_id, 
demographics).

If you use an inner join carelessly, any dispensing record where 
the drug_id was entered incorrectly (a real, common data quality 
issue) disappears silently from your analysis. The left join 
preserves it and shows you NaN in the drug columns — which is your 
signal to investigate the data quality issue, not ignore it.

This is exactly the kind of silent error that leads to under-
reporting of drug usage in facility-level health management 
reports. Your awareness of this risk is a genuine clinical data 
science skill.
    `,

    example: `
import pandas as pd

patients = pd.DataFrame({
    "patient_id": [1, 2, 3, 4, 5],
    "full_name":  ["Adaeze", "Chinedu", "Fatima", "Tunde", "Ngozi"],
    "state":      ["Lagos", "Enugu", "Kano", "Oyo", "Anambra"],
})

sales = pd.DataFrame({
    "sale_id":    [1, 2, 3, 4, 6],
    "patient_id": [1, 2, 1, 3, 99],    # 99 has no matching patient
    "drug":       ["Metformin", "Amoxicillin", "Paracetamol",
                   "Amlodipine", "Artemether"],
    "amount":     [1700, 1200, 300, 950, 3000],
})

# Inner join — only rows where patient_id exists in BOTH
inner = pd.merge(patients, sales, on="patient_id", how="inner")
print("Inner join (matched rows only):")
print(inner)

# Left join — keep all patients; NaN for those with no sales
left = pd.merge(patients, sales, on="patient_id", how="left")
print("\nLeft join (all patients preserved):")
print(left)

# Unmatched sales (patient_id=99 appears in sales but not patients)
unmatched = pd.merge(patients, sales, on="patient_id", how="right")
print("\nRight join — spot unmatched sale:")
print(unmatched[unmatched["full_name"].isnull()])
    `,

    expectedOutput: `
Inner join (matched rows only):
   patient_id full_name   state  sale_id         drug  amount
0           1    Adaeze   Lagos        1     Metformin    1700
1           1    Adaeze   Lagos        3  Paracetamol     300
2           2   Chinedu   Enugu        2  Amoxicillin    1200
3           3    Fatima    Kano        4   Amlodipine     950

Left join (all patients preserved):
   patient_id full_name     state  sale_id         drug   amount
0           1    Adaeze     Lagos      1.0    Metformin   1700.0
1           1    Adaeze     Lagos      3.0  Paracetamol    300.0
2           2   Chinedu     Enugu      2.0  Amoxicillin   1200.0
3           3    Fatima      Kano      4.0   Amlodipine    950.0
4           4     Tunde       Oyo      NaN          NaN      NaN
5           5     Ngozi   Anambra      NaN          NaN      NaN

Right join — spot unmatched sale:
   patient_id full_name state  sale_id       drug  amount
4        99.0       NaN   NaN        6  Artemether    3000
    `,

    commonMistakes: [
      "Defaulting to inner join without thinking — if your result has fewer rows than the left table, you are silently dropping data. Always know which join type fits your question.",
      "Merging on a column that has different data types in each table (e.g. int in one, string in the other) — pandas will silently produce zero matches. Check dtypes before merging.",
      "Forgetting that a left join can multiply rows — if one patient_id appears 3 times in the right table, the patient's row will appear 3 times in the result.",
      "Using pd.concat() when you need pd.merge() — concat stacks without caring about matching keys; merge aligns by key. Wrong choice gives wrong results silently.",
      "Not checking the row count after a merge — always print len(result) and compare it to what you expect before continuing the analysis.",
    ],

    exercises: [
      "Create a drugs DataFrame (drug_id, name, category, unit_price) and a sales DataFrame (sale_id, drug_id, patient_id, quantity). Inner-merge them on drug_id. How many rows?",
      "Now use a left join instead. Add a row to sales with a drug_id that does not exist in drugs. What appears in the result for that row's category and unit_price columns?",
      "After the left join, compute total_cost = quantity × unit_price. Notice that the unmatched row gets NaN for total_cost. Drop those NaN rows using .dropna(subset=['total_cost']).",
      "Create two monthly sales DataFrames (May and June, same columns). Use pd.concat() to stack them into one DataFrame. Confirm the combined row count.",
      "Merge the combined monthly DataFrame with the drugs table, then groupby category to find total revenue per category across both months.",
    ],

    exerciseAnswers: [
      `drugs = pd.DataFrame({
    "drug_id": [1, 2, 3, 4],
    "name": ["Metformin", "Amoxicillin", "Paracetamol", "Amlodipine"],
    "category": ["Antidiabetic", "Antibiotic", "Analgesic", "Antihypertensive"],
    "unit_price": [850, 1200, 300, 950],
})
sales = pd.DataFrame({
    "sale_id": [1, 2, 3, 4, 5],
    "drug_id": [1, 2, 1, 3, 4],
    "patient_id": [1, 2, 3, 4, 5],
    "quantity": [60, 21, 60, 30, 30],
})
result = pd.merge(sales, drugs, on="drug_id", how="inner")
print(len(result))  # 5 rows — all match`,

      `sales_with_bad = pd.DataFrame({
    "sale_id": [1, 2, 3, 4, 5, 6],
    "drug_id": [1, 2, 1, 3, 4, 99],  # 99 doesn't exist in drugs
    "patient_id": [1, 2, 3, 4, 5, 6],
    "quantity": [60, 21, 60, 30, 30, 10],
})
result = pd.merge(sales_with_bad, drugs, on="drug_id", how="left")
print(result)
# Row with drug_id=99 shows NaN for name, category, unit_price`,

      `result["total_cost"] = result["quantity"] * result["unit_price"]
clean = result.dropna(subset=["total_cost"])
print(clean)
print(f"Dropped {len(result) - len(clean)} unmatched row(s)")`,

      `may = pd.DataFrame({"month": ["May"]*3, "drug_id": [1,2,3], "quantity": [60,21,30]})
june = pd.DataFrame({"month": ["June"]*3, "drug_id": [1,3,4], "quantity": [30,30,30]})
combined = pd.concat([may, june], ignore_index=True)
print(len(combined))  # 6 rows`,

      `merged = pd.merge(combined, drugs, on="drug_id", how="left")
merged["total_cost"] = merged["quantity"] * merged["unit_price"]
print(merged.groupby("category")["total_cost"].sum().sort_values(ascending=False))`,
    ],

    resources: [
      {
        objective: "Understand join types with visual diagrams",
        items: [
          { title: "pandas merge docs (with join type diagram)", url: "https://pandas.pydata.org/docs/reference/api/pandas.merge.html", type: "article" },
          { title: "pandas merge, join and concat (Real Python)", url: "https://realpython.com/pandas-merge-join-and-concatenate/", type: "article" },
        ],
      },
      {
        objective: "Practice combining datasets",
        items: [
          { title: "Kaggle pandas micro-course — Data Types and Missing Values", url: "https://www.kaggle.com/learn/pandas", type: "interactive" },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 108 — pivot_table and crosstab
  // ============================================================
  {
    id: "W22D3", week: 22, day: 3, phase: 3,
    phaseTitle: "Data Science Core",
    date: "2026-11-11",
    type: "lesson",
    topic: "pivot_table and crosstab: Reshaping for Analysis",
    duration: "2–3 hours",

    objectives: [
      "Use pd.pivot_table() to reshape long data into wide summary tables",
      "Understand the index, columns, values, and aggfunc parameters",
      "Use pd.crosstab() for frequency-based cross-tabulation",
      "Understand when pivot_table is more appropriate than groupby",
    ],

    introduction: `
groupby answers "what is the total per group?"
pivot_table answers "what is the total per group, arranged as a 
readable two-dimensional table?"

The difference is output shape. A groupby result is a Series or 
a flat DataFrame. A pivot table is a matrix — rows are one 
categorical variable, columns are another, and the cells contain 
the aggregated values. This is exactly the Excel pivot table you 
already know, now in code.

For a data scientist, pivot_table is primarily a reporting and 
exploration tool — it lets you see patterns across two dimensions 
simultaneously, which is much harder to spot in a flat groupby 
result.
    `,

    mentalModel: `
Think of a pivot table as rotating your data from "tall" to "wide".

TALL (groupby result):
pharmacist | category    | revenue
Victor     | Antibiotic  | 25200
Victor     | Antidiabetic| 51000
Ngozi      | Antibiotic  | 16800
Ngozi      | Antidiabetic| 51000

WIDE (pivot table):
pharmacist | Antibiotic | Antidiabetic | Antimalarial
Victor     |      25200 |        51000 |         9000
Ngozi      |      16800 |        51000 |         9000
Adunola    |      25200 |        51000 |         9000

The wide format is much easier to scan visually and compare 
across both dimensions at once. The trade-off: it is wider and 
harder to do further computations on.

Use groupby for computation. Use pivot_table for reporting.
    `,

    explanation: `
pd.pivot_table()

Parameters:
  data      → the DataFrame
  values    → column to aggregate (what goes in the cells)
  index     → column whose unique values become ROW labels
  columns   → column whose unique values become COLUMN headers
  aggfunc   → aggregation function: 'sum', 'mean', 'count', etc.
  fill_value→ replace NaN in empty cells (e.g. fill_value=0)
  margins   → add row/column totals (margins=True)

Example:
pd.pivot_table(
    df,
    values="total_cost",
    index="pharmacist",
    columns="category",
    aggfunc="sum",
    fill_value=0,
)

MULTIPLE AGGFUNC:
pd.pivot_table(df, values="total_cost", index="pharmacist",
               columns="category", aggfunc=["sum", "mean"])

pd.crosstab()

Counts the frequency of co-occurrences between two columns:
pd.crosstab(df["pharmacist"], df["category"])
→ How many times did each pharmacist dispense each category?

With a values parameter (like a mini pivot_table):
pd.crosstab(df["pharmacist"], df["category"],
            values=df["total_cost"], aggfunc="sum")

Adding margins (row/column totals):
pd.crosstab(df["pharmacist"], df["category"], margins=True)
    `,

    clinicalConnection: `
Antimicrobial stewardship dashboards are literally pivot tables.

The standard WHO AMS report format shows:
  ROWS: wards or prescribers
  COLUMNS: antibiotic class (penicillins, cephalosporins, etc.)
  CELLS: defined daily doses (DDDs) dispensed

That is a pivot table with aggfunc='sum'. Creating one manually 
in Excel for a 10,000-row dataset takes hours. In pandas:

pd.pivot_table(df, values="ddd", index="ward",
               columns="antibiotic_class", aggfunc="sum",
               fill_value=0, margins=True)

runs in milliseconds and produces the exact table the WHO 
reporting format expects — ready to copy into a report or 
export as CSV for submission.

pd.crosstab() is useful for a simpler question: "how often did 
each prescriber write antibiotics vs other drug classes?" — a 
frequency audit that informs targeted education sessions.
    `,

    example: `
import pandas as pd

data = {
    "pharmacist": ["Victor", "Ngozi", "Victor", "Adunola", "Victor",
                   "Ngozi", "Adunola", "Victor", "Ngozi", "Adunola"],
    "category":   ["Antidiabetic", "Antibiotic", "Analgesic",
                   "Antihypertensive", "Antimalarial", "Antibiotic",
                   "Antidiabetic", "Analgesic", "Antihypertensive",
                   "Antimalarial"],
    "total_cost": [51000, 25200, 9000, 28500, 9000, 16800,
                   51000, 12000, 28500, 9000],
}
df = pd.DataFrame(data)

# Pivot table — revenue per pharmacist per category
pivot = pd.pivot_table(
    df, values="total_cost",
    index="pharmacist", columns="category",
    aggfunc="sum", fill_value=0, margins=True,
)
print("Revenue pivot table:")
print(pivot)

# Crosstab — count of dispensings per pharmacist per category
print("\nDispensing frequency (crosstab):")
print(pd.crosstab(df["pharmacist"], df["category"], margins=True))
    `,

    expectedOutput: `
Revenue pivot table:
category    Analgesic  Antibiotic  Antidiabetic  Antihypertensive  Antimalarial    All
pharmacist
Adunola          0       0          51000             28500          9000      88500
Ngozi            0   42000              0             28500             0      70500
Victor       21000       0              0                 0          9000      81000
All          21000   42000          51000             57000         18000     189000

Dispensing frequency (crosstab):
category    Analgesic  Antibiotic  Antidiabetic  Antihypertensive  Antimalarial  All
pharmacist
Adunola             0           0             1                 1             1    3
Ngozi               0           2             0                 1             0    3
Victor              2           0             1                 0             1    4
All                 2           2             2                 2             2   10
    `,

    commonMistakes: [
      "Passing a list to aggfunc when you only want one function — aggfunc='sum' (string) produces a flat result; aggfunc=['sum'] (list) adds an extra header level that complicates further operations.",
      "Forgetting fill_value=0 — pivot tables with sparse data produce NaN in empty cells, which then propagate through any arithmetic you do on the result.",
      "Confusing crosstab and pivot_table — crosstab defaults to counting occurrences; pivot_table defaults to taking the mean of values. Neither is wrong; they answer different questions.",
      "Not setting margins=True when the report needs totals — the final row/column total is almost always needed in real reporting and is easy to forget.",
      "Trying to use pivot_table output directly in further groupby/merge operations without resetting the column multi-index — use .reset_index() and flatten column names first.",
    ],

    exercises: [
      "Using the example dataset, create a pivot table showing AVERAGE unit_price per pharmacist per category (not sum). Fill NaN with 0.",
      "Create a crosstab showing how many times each drug category was dispensed per pharmacist. Add margins. Which pharmacist dispensed the most Antibiotics?",
      "Add a 'state' column (Lagos, Enugu, Kano, Oyo, Anambra — repeated). Build a pivot table with state as rows and category as columns, summing total_cost.",
      "From your pivot table result, extract only the 'Antibiotic' column as a Series and sort it descending. Which state has the highest antibiotic spend?",
      "Export your pivot table to a CSV string using .to_csv(). Print the first 5 lines. (Hint: import io; df.to_csv() returns a string.)",
    ],

    exerciseAnswers: [
      `pivot_avg = pd.pivot_table(
    df, values="total_cost",
    index="pharmacist", columns="category",
    aggfunc="mean", fill_value=0,
)
print(pivot_avg)`,

      `ct = pd.crosstab(df["pharmacist"], df["category"], margins=True)
print(ct)
print("Most Antibiotic dispensings:", ct["Antibiotic"].idxmax())
# Ngozi dispensed 2 Antibiotics — highest`,

      `df["state"] = ["Lagos", "Enugu", "Lagos", "Kano", "Oyo",
                    "Enugu", "Lagos", "Kano", "Oyo", "Anambra"]
pivot_state = pd.pivot_table(
    df, values="total_cost",
    index="state", columns="category",
    aggfunc="sum", fill_value=0, margins=True,
)
print(pivot_state)`,

      `antibiotic_col = pivot_state["Antibiotic"].sort_values(ascending=False)
print(antibiotic_col)
print("Highest Antibiotic state:", antibiotic_col.index[0])`,

      `import io
csv_string = df.to_csv(index=False)
lines = csv_string.split("\\n")
print("\\n".join(lines[:5]))`,
    ],

    resources: [
      {
        objective: "Master pivot_table syntax and parameters",
        items: [
          { title: "pandas pivot_table docs", url: "https://pandas.pydata.org/docs/reference/api/pandas.pivot_table.html", type: "article" },
          { title: "pivot tables in pandas (Towards Data Science)", url: "https://towardsdatascience.com/pivot-tables-in-pandas-with-python-36953103d0a1", type: "article" },
        ],
      },
      {
        objective: "See pivot tables applied to real datasets",
        items: [
          { title: "pandas crosstab docs", url: "https://pandas.pydata.org/docs/reference/api/pandas.crosstab.html", type: "article" },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 109 — apply(), map(), and Custom Transformations
  // ============================================================
  {
    id: "W22D4", week: 22, day: 4, phase: 3,
    phaseTitle: "Data Science Core",
    date: "2026-11-12",
    type: "lesson",
    topic: "apply(), map(), and Custom Transformations",
    duration: "2–3 hours",

    objectives: [
      "Use .apply() on a Series to apply a custom function row by row",
      "Use .apply() on a DataFrame with axis=1 for row-wise logic",
      "Use .map() for element-wise lookups and replacements",
      "Know when apply() is appropriate vs vectorised operations",
    ],

    introduction: `
Vectorised operations (arithmetic, .str, np.where) cover 80% of 
transformations you need. But 20% of the time, your logic is too 
complex to express as a simple vectorised expression — it involves 
if/else chains, looks up values from a dictionary, or needs to 
access multiple columns simultaneously.

That is when apply() and map() step in.

Today is about knowing WHEN to use each, not just how. Using 
apply() where a vectorised operation exists is a common beginner 
mistake that makes code 10-100x slower. Using a vectorised 
operation when you actually need row-wise logic leads to bugs. 
Understanding the boundary between them is a genuine 
intermediate pandas skill.
    `,

    mentalModel: `
VECTORISED OPERATION:
  pandas hands the entire column to numpy at once.
  Like sending a batch order to a factory: all 10,000 items 
  processed simultaneously in compiled C. Very fast.

  df["price_vat"] = df["price"] * 1.075

apply() ON A SERIES:
  pandas loops over each element and calls your function once 
  per element. Like sending 10,000 individual orders, one at 
  a time. Much slower, but handles any logic.

  df["tier"] = df["price"].apply(lambda x: "High" if x > 1000 else "Low")

apply() ON A DATAFRAME (axis=1):
  pandas loops over each ROW and calls your function with the 
  whole row as a Series. Slowest option — but necessary when 
  your logic needs multiple columns at once.

  df["note"] = df.apply(lambda row: f"{row['drug']} for {row['patient']}", axis=1)

map() ON A SERIES:
  Element-wise lookup from a dictionary or function.
  Like a translation table — each value is looked up and 
  replaced with its mapping.

  df["cat_code"] = df["category"].map({"Antibiotic": 1, "Analgesic": 2})

RULE OF THUMB:
  Can you do it with +, -, *, /, np.where, .str? → do that.
  Does it need a dictionary lookup? → use .map().
  Does it need multiple columns or complex if/elif? → use .apply().
    `,

    explanation: `
.apply() ON A SERIES

df["tier"] = df["price"].apply(lambda x:
    "Budget" if x < 500 else "Mid" if x < 1000 else "Premium")

Or with a named function for readability:
def classify(price):
    if price < 500:   return "Budget"
    if price < 1000:  return "Mid"
    return "Premium"
df["tier"] = df["price"].apply(classify)

.apply() ON A DATAFRAME (ROW-WISE, axis=1)

def build_label(row):
    return f"{row['drug']} — {row['quantity']} units @ ₦{row['unit_price']}"
df["label"] = df.apply(build_label, axis=1)

.map() ON A SERIES

Lookup from a dictionary:
category_codes = {
    "Antibiotic": 1, "Analgesic": 2, "Antidiabetic": 3,
    "Antihypertensive": 4, "Antimalarial": 5,
}
df["cat_code"] = df["category"].map(category_codes)

Note: .map() returns NaN for any value not in the dictionary.
Use .fillna() to handle unmapped values.

.replace() — SIMPLER THAN map() FOR RENAMES

df["category"].replace({"Antibiotic": "Antibacterial"})
→ replaces matching values, leaves others unchanged (unlike map)

PERFORMANCE REMINDER

For large DataFrames, always prefer:
  vectorised > np.where > map/replace > apply (Series) > apply(axis=1)

Time the difference: %timeit or time.time() shows apply(axis=1) 
can be 100x slower than an equivalent vectorised operation.
    `,

    clinicalConnection: `
Drug interaction checking at dispensing is a real clinical workflow 
that maps exactly to apply(axis=1).

A simple rule: if a patient is dispensed both Warfarin AND 
Ibuprofen in the same visit, flag it as a potential interaction.

That rule requires looking at TWO columns simultaneously — which 
drugs the patient received — and producing a flag. You cannot do 
that with a simple vectorised expression on one column. You need 
to look at the whole row:

def check_interaction(row):
    drugs = row["drugs_dispensed"]   # hypothetically a list
    if "Warfarin" in drugs and "Ibuprofen" in drugs:
        return "FLAG: potential bleeding risk"
    return "OK"
df["interaction_flag"] = df.apply(check_interaction, axis=1)

This is the kind of logic that clinical decision support systems 
run at point-of-care — simplified here, but structurally identical 
to real pharmacovigilance algorithms.
    `,

    example: `
import pandas as pd

data = {
    "drug":       ["Metformin 500mg", "Amoxicillin 500mg",
                   "Paracetamol 500mg", "Amlodipine 5mg",
                   "Artemether/Lumefantrine"],
    "category":   ["Antidiabetic", "Antibiotic", "Analgesic",
                   "Antihypertensive", "Antimalarial"],
    "quantity":   [60, 21, 30, 30, 6],
    "unit_price": [850, 1200, 300, 950, 1500],
}
df = pd.DataFrame(data)
df["total_cost"] = df["quantity"] * df["unit_price"]

# 1. map() — encode categories as numbers
cat_codes = {"Antidiabetic": 1, "Antibiotic": 2, "Analgesic": 3,
             "Antihypertensive": 4, "Antimalarial": 5}
df["cat_code"] = df["category"].map(cat_codes)

# 2. apply() on a Series — classify by price tier
def price_tier(p):
    if p < 500:   return "Budget"
    if p < 1000:  return "Mid"
    return "Premium"
df["tier"] = df["unit_price"].apply(price_tier)

# 3. apply(axis=1) — build a human-readable dispensing label
df["label"] = df.apply(
    lambda row: f"{row['drug']} x{row['quantity']} — ₦{row['total_cost']:,}",
    axis=1
)

print(df[["drug", "tier", "cat_code", "label"]])
    `,

    expectedOutput: `
                      drug      tier  cat_code                                               label
0          Metformin 500mg       Mid         1       Metformin 500mg x60 — ₦51,000
1        Amoxicillin 500mg   Premium         2     Amoxicillin 500mg x21 — ₦25,200
2        Paracetamol 500mg    Budget         3     Paracetamol 500mg x30 — ₦9,000
3           Amlodipine 5mg       Mid         4         Amlodipine 5mg x30 — ₦28,500
4  Artemether/Lumefantrine   Premium         5  Artemether/Lumefantrine x6 — ₦9,000
    `,

    commonMistakes: [
      "Using apply(axis=1) for simple arithmetic — df.apply(lambda row: row['a'] + row['b'], axis=1) is 100x slower than df['a'] + df['b']. Always vectorise simple math.",
      "Forgetting that map() returns NaN for unmapped values — if 'Antifungal' is not in your dictionary, that row gets NaN silently. Check with .isnull().sum() after mapping.",
      "Using .apply() with a function that has side effects (prints, writes files) — apply calls the function once per element, which means those side effects happen N times.",
      "Passing axis=0 (default) to DataFrame.apply() when you want row-wise logic — axis=0 operates column by column, axis=1 operates row by row. Always be explicit.",
      "Writing complex multi-step logic inside a lambda — for anything beyond a simple expression, define a named function. It is easier to test, read, and debug.",
    ],

    exercises: [
      "Use .map() to add a 'dispensing_days' column: Antimalarial → 3 days, Antibiotic → 7 days, all others → 30 days. What value does Antidiabetic get?",
      "Write a function that classifies total_cost as 'Low' (< 10000), 'Medium' (10000–40000), or 'High' (> 40000). Apply it as a new column 'spend_class'.",
      "Use apply(axis=1) to build a 'summary' column: '{drug} dispensed to patient at ₦{unit_price}/unit'. Access both columns in the lambda.",
      "Replace 'Analgesic' with 'Pain Relief' in the category column using .replace(). Confirm it changed without affecting other categories.",
      "Compare the speed of: (a) apply(lambda x: x*1.075) vs (b) * 1.075 directly on the unit_price column using a print of time.time() before and after each. What do you observe?",
    ],

    exerciseAnswers: [
      `days_map = {
    "Antimalarial": 3,
    "Antibiotic": 7,
}
df["dispensing_days"] = df["category"].map(days_map).fillna(30).astype(int)
print(df[["drug", "category", "dispensing_days"]])
# Antidiabetic gets NaN from map → fillna(30) → 30 days`,

      `def spend_class(cost):
    if cost < 10000:  return "Low"
    if cost <= 40000: return "Medium"
    return "High"
df["spend_class"] = df["total_cost"].apply(spend_class)
print(df[["drug", "total_cost", "spend_class"]])`,

      `df["summary"] = df.apply(
    lambda row: f"{row['drug']} dispensed at ₦{row['unit_price']:,}/unit",
    axis=1
)
print(df["summary"])`,

      `df["category"] = df["category"].replace({"Analgesic": "Pain Relief"})
print(df["category"].value_counts())
# Only Analgesic changed; all other categories unchanged`,

      `import time

# Method (a): apply
start = time.time()
result_a = df["unit_price"].apply(lambda x: x * 1.075)
print(f"apply: {time.time() - start:.6f}s")

# Method (b): vectorised
start = time.time()
result_b = df["unit_price"] * 1.075
print(f"vectorised: {time.time() - start:.6f}s")
# On a small dataset the difference is tiny, but on 1M rows apply is ~100x slower`,
    ],

    resources: [
      {
        objective: "Understand when to use apply vs vectorised operations",
        items: [
          { title: "pandas apply() documentation", url: "https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.apply.html", type: "article" },
          { title: "How to use apply in pandas (Real Python)", url: "https://realpython.com/pandas-apply/", type: "article" },
        ],
      },
      {
        objective: "Practice map and replace for data encoding",
        items: [
          { title: "Kaggle — Data Cleaning course (Day 1: Handling Missing Values)", url: "https://www.kaggle.com/learn/data-cleaning", type: "interactive" },
        ],
      },
    ],
  },

  // ============================================================
  // DAY 110 — PROJECT: Sales/Revenue Analysis with groupby
  // ============================================================
  {
    id: "W22D5", week: 22, day: 5, phase: 3,
    phaseTitle: "Data Science Core",
    date: "2026-11-13",
    type: "project",
    topic: "Project: Sales/Revenue Analysis with groupby",
    duration: "3–4 hours",

    objectives: [
      "Build a complete revenue analysis using groupby, merge, pivot_table, and apply",
      "Answer real business questions from a multi-table dataset",
      "Produce a clean, labelled output that reads as a report",
      "Push your analysis script to GitHub progress log",
    ],

    introduction: `
This project combines everything from Week 22. You will work with 
two related tables (dispensing records + drug catalogue), merge 
them, then run a full revenue analysis using groupby and 
pivot_table.

The output should be a script that tells a clear story: 
how revenue broke down across categories, pharmacists, and time. 
This is the kind of monthly report a pharmacy manager or health 
facility administrator would actually use.
    `,

    mentalModel: `
The analysis pipeline for this project:

1. CREATE two DataFrames (dispensing records + drug catalogue)
2. MERGE on drug_id (left join — keep all dispensings)
3. ADD COMPUTED COLUMNS (total_cost, tier, label)
4. GROUPBY ANALYSIS:
   - Revenue per category
   - Revenue per pharmacist
   - Top 5 drugs by revenue
5. PIVOT TABLE:
   - Pharmacist × Category revenue matrix
6. INSIGHT QUESTIONS:
   - What % of revenue came from Antibiotics?
   - Which pharmacist generated the most revenue?
   - Which drug had the highest single-transaction cost?
7. PRINT as a clean, labelled report
    `,

    explanation: `
PROJECT BRIEF

Build a dataset with:
  - dispensing_records: 20+ rows (record_id, drug_id, patient_id, 
    pharmacist, quantity, date)
  - drug_catalogue: 8 drugs (drug_id, name, category, unit_price)

Then produce a Python script that answers:

Q1: Total revenue for the period
Q2: Revenue breakdown by drug category (sorted desc)
Q3: Revenue per pharmacist
Q4: Top 5 drugs by total revenue
Q5: Pivot table — pharmacist × category revenue
Q6: What percentage of total revenue came from each category?
Q7: Which single record had the highest total_cost?
Q8: Apply a price_tier label and show count of dispensings 
    per tier

Format all outputs with clear print headers so the output 
reads as a report, not just numbers.
    `,

    clinicalConnection: `
This project directly mirrors the quarterly Pharmacy Activity 
Report required by Nigeria's Federal Ministry of Health for all 
tertiary health facilities.

That report requires:
- Total value of drugs dispensed per quarter (Q1)
- Breakdown by therapeutic class (Q2)
- Workload per pharmacist/pharmacy technician (Q3)
- Highest-cost medicines (Q4)

You are building the automated version of a report that 
currently takes pharmacy staff 2-3 days per quarter to compile 
manually from dispensary registers. The same pandas script, 
pointed at a real dataset, would produce it in seconds.

This is a concrete demonstration of your value as a 
Pharm.D with data science skills.
    `,

    example: `
import pandas as pd
import numpy as np

# ── DRUG CATALOGUE ────────────────────────────────────────────
drugs = pd.DataFrame({
    "drug_id":    [1, 2, 3, 4, 5, 6, 7, 8],
    "name":       ["Metformin 500mg", "Amoxicillin 500mg",
                   "Paracetamol 500mg", "Amlodipine 5mg",
                   "Artemether/Lumefantrine", "Ibuprofen 400mg",
                   "Omeprazole 20mg", "Lisinopril 10mg"],
    "category":   ["Antidiabetic", "Antibiotic", "Analgesic",
                   "Antihypertensive", "Antimalarial", "Analgesic",
                   "PPI", "Antihypertensive"],
    "unit_price": [850, 1200, 300, 950, 1500, 400, 700, 600],
})

# ── DISPENSING RECORDS (first 5 shown) ────────────────────────
records = pd.DataFrame({
    "record_id":  list(range(1, 6)),
    "drug_id":    [1, 2, 1, 3, 5],
    "patient_id": [1, 2, 3, 4, 5],
    "pharmacist": ["Victor", "Ngozi", "Victor", "Adunola", "Victor"],
    "quantity":   [60, 21, 60, 30, 6],
    "date":       ["2025-05-01", "2025-05-02", "2025-05-03",
                   "2025-05-04", "2025-05-05"],
})

# ── MERGE & COMPUTE ───────────────────────────────────────────
df = pd.merge(records, drugs, on="drug_id", how="left")
df["total_cost"] = df["quantity"] * df["unit_price"]

print("Q1 — Total Revenue: ₦{:,.0f}".format(df["total_cost"].sum()))
print()
print("Q2 — Revenue by Category:")
print(df.groupby("category")["total_cost"].sum()
      .sort_values(ascending=False).to_string())
    `,

    expectedOutput: `
Q1 — Total Revenue: ₦152,100

Q2 — Revenue by Category:
category
Antidiabetic    102000
Antimalarial      9000
Antibiotic       25200
Analgesic         9000
(varies based on your full 20+ row dataset)

(Q3–Q8 outputs depend on your full dataset — 
 aim for at least 20 records across 3 pharmacists 
 and all 8 drug categories)
    `,

    commonMistakes: [
      "Building a dataset with all records for one pharmacist — make sure your data has at least 3 pharmacists with varied records so the groupby results are meaningful.",
      "Not checking for NaN after the merge before computing total_cost — always check result.isnull().sum() after merging.",
      "Printing raw numbers without context — wrap every result with print('Q2 — Revenue by Category:') or similar so the output is readable as a report.",
      "Skipping the pivot table (Q5) because it feels repetitive after groupby — the pivot shows you patterns the flat groupby hides. Do it.",
      "Not resetting index after groupby before further operations — the group key as index causes unexpected behaviour in subsequent operations.",
    ],

    exercises: [
      "Build the full 20+ row dispensing_records dataset and the 8-row drug_catalogue. Merge them and confirm the shape of the merged DataFrame.",
      "Answer Q1 (total revenue) and Q2 (revenue by category, sorted desc). Print both with clear labels.",
      "Answer Q3 (revenue per pharmacist) and Q4 (top 5 drugs by total revenue using groupby + sort_values + head(5)).",
      "Build the pivot table for Q5 (pharmacist × category, fill_value=0, margins=True). Print it.",
      "Answer Q6 (% of total revenue per category), Q7 (highest single-record total_cost using idxmax), and Q8 (count of dispensings per price tier using apply + value_counts).",
    ],

    exerciseAnswers: [
      `# Build 20-row dataset and confirm shape
merged = pd.merge(records, drugs, on="drug_id", how="left")
merged["total_cost"] = merged["quantity"] * merged["unit_price"]
print("Merged shape:", merged.shape)
print("Null check:\n", merged.isnull().sum())`,

      `total = merged["total_cost"].sum()
print(f"Q1 — Total Revenue: ₦{total:,.0f}")
rev_by_cat = merged.groupby("category")["total_cost"].sum().sort_values(ascending=False)
print("\nQ2 — Revenue by Category:")
print(rev_by_cat.to_string())`,

      `rev_by_pharm = merged.groupby("pharmacist")["total_cost"].sum().sort_values(ascending=False)
print("\nQ3 — Revenue per Pharmacist:")
print(rev_by_pharm.to_string())

top5_drugs = merged.groupby("name")["total_cost"].sum().sort_values(ascending=False).head(5)
print("\nQ4 — Top 5 Drugs by Revenue:")
print(top5_drugs.to_string())`,

      `pivot = pd.pivot_table(
    merged, values="total_cost",
    index="pharmacist", columns="category",
    aggfunc="sum", fill_value=0, margins=True,
)
print("\nQ5 — Pharmacist × Category Pivot Table:")
print(pivot)`,

      `# Q6 — percentage per category
total = merged["total_cost"].sum()
pct = (merged.groupby("category")["total_cost"].sum() / total * 100).round(1)
print("\nQ6 — % Revenue per Category:")
print(pct.sort_values(ascending=False))

# Q7 — highest single record
idx = merged["total_cost"].idxmax()
print(f"\nQ7 — Highest Single Record: {merged.loc[idx, 'name']}, ₦{merged.loc[idx, 'total_cost']:,}")

# Q8 — dispensings per tier
def tier(p):
    if p < 500: return "Budget"
    if p < 1000: return "Mid"
    return "Premium"
merged["tier"] = merged["unit_price"].apply(tier)
print("\nQ8 — Dispensings per Price Tier:")
print(merged["tier"].value_counts())`,
    ],

    resources: [
      {
        objective: "Review Week 22 pandas operations end-to-end",
        items: [
          { title: "pandas groupby, merge and pivot cheat sheet", url: "https://pandas.pydata.org/docs/user_guide/groupby.html", type: "article" },
          { title: "End-to-end data analysis with pandas (freeCodeCamp)", url: "https://www.youtube.com/watch?v=r-uOLxNrNk8", type: "video" },
        ],
      },
      {
        objective: "Practice on a real dataset",
        items: [
          { title: "Kaggle — Superstore Sales dataset (good for groupby/pivot practice)", url: "https://www.kaggle.com/datasets/vivek468/superstore-dataset-final", type: "interactive" },
        ],
      },
    ],
  },

];
