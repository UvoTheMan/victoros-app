// ============================================================
// ROADMAP.js — VictorOS Master Roadmap Structure
// 7 Phases | 16 Months | 64 Weeks | 320 Study Days
// June 2026 → October 2027
// Stack: Python → Data Engineering → Data Science →
//        Machine Learning → AI/LLM → AI Automation → Capstone
// ============================================================

const ROADMAP_META = {
  name:          "Victor's Full Stack Data & AI Engineering Roadmap",
  startDate:     "2026-06-15",
  endDate:       "2027-10-14",
  totalWeeks:    64,
  totalDays:     320,
  daysPerWeek:   5,
  targetRole:    "Data Engineer + Data Scientist + AI Engineer",
  cloudProvider: "GCP (Google Cloud Platform)",
  primaryStack:  [
    "Python", "SQL", "PostgreSQL", "BigQuery",
    "dbt", "Apache Airflow", "Kafka",
    "pandas", "numpy", "scikit-learn",
    "Claude API", "LangChain", "FastAPI",
    "React", "Docker", "Git/GitHub"
  ],
};

// ============================================================
// PHASE DEFINITIONS
// ============================================================

const PHASES = [
  {
    id:          1,
    title:       "Python Mastery",
    subtitle:    "The foundation everything else is built on",
    color:       "#00D4AA",
    weeks:       [1, 8],
    totalDays:   40,
    dateRange:   "15 Jun – 7 Aug 2026",
    goal: `
Write clean, professional Python. Build CLI tools,
work with files and APIs, apply OOP, write tests,
and use numpy. Every phase after this assumes
fluency in Python.
    `,
    weekTitles: [
      "W1:  Python Basics & Environment Setup",
      "W2:  Functions, Lists, Dicts, Tuples",
      "W3:  OOP: Classes, Inheritance, Exceptions",
      "W4:  File I/O, CSV, JSON, OS Module",
      "W5:  Advanced Python: Comprehensions, Lambda, Decorators",
      "W6:  APIs, HTTP Requests, Environment Variables, Testing",
      "W7:  numpy Intro + Jupyter Notebooks",
      "W8:  Code Quality, Type Hints, Concurrency Basics",
    ],
    projects: [
      { week: 1,  title: "Pharmacy CLI Dispensing Tool" },
      { week: 2,  title: "Drug Inventory Management System" },
      { week: 3,  title: "Full OOP Pharmacy System" },
      { week: 4,  title: "Automated Data Pipeline (CSV/JSON)" },
      { week: 5,  title: "Data Cleaning & Transformation Engine" },
      { week: 6,  title: "AI Health Advisor CLI (Claude API)" },
      { week: 7,  title: "numpy Statistical Analysis Tool" },
      { week: 8,  title: "Phase 1 Capstone: AI-Powered Drug Info System" },
    ],
    skills: [
      "Python fundamentals", "OOP", "File I/O",
      "REST APIs", "Exception handling", "Testing (pytest)",
      "numpy basics", "Jupyter notebooks",
      "Git/GitHub workflow", "Environment variables",
    ],
  },

  {
    id:          2,
    title:       "Data Engineering Foundations",
    subtitle:    "Move, store, transform and serve data at scale",
    color:       "#7C6FCD",
    weeks:       [9, 20],
    totalDays:   60,
    dateRange:   "10 Aug – 30 Oct 2026",
    goal: `
Build production-grade data pipelines. Design databases.
Write advanced SQL. Use cloud storage and data warehouses.
Orchestrate workflows with Airflow. Transform data with dbt.
Understand streaming with Kafka fundamentals.
    `,
    weekTitles: [
      "W9:  PostgreSQL Fundamentals & Database Design",
      "W10: Advanced SQL: Window Functions, CTEs, Optimisation",
      "W11: SQL for Analytics: Aggregations, Subqueries, EXPLAIN",
      "W12: Python + Databases: SQLAlchemy, psycopg2, ORMs",
      "W13: ETL Fundamentals: Extract, Transform, Load with Python",
      "W14: Apache Airflow: Pipeline Orchestration",
      "W15: GCP Fundamentals + Cloud Storage (GCS)",
      "W16: BigQuery: Cloud Data Warehousing",
      "W17: dbt: Data Build Tool — Transform in the Warehouse",
      "W18: Data Quality & Validation: Great Expectations",
      "W19: Kafka Fundamentals: Streaming Data Concepts",
      "W20: Modern Data Stack + Phase 2 Capstone",
    ],
    projects: [
      { week: 9,  title: "Hospital Database Schema Design (PostgreSQL)" },
      { week: 10, title: "Advanced SQL Analytics Report" },
      { week: 11, title: "SQL Query Optimisation Challenge" },
      { week: 12, title: "Python → PostgreSQL Data Loader" },
      { week: 13, title: "ETL Pipeline: Raw CSV → Clean Database" },
      { week: 14, title: "Airflow DAG: Automated Daily Data Pipeline" },
      { week: 15, title: "GCP Setup + Data Lake on GCS" },
      { week: 16, title: "BigQuery Analytics Dashboard" },
      { week: 17, title: "dbt Project: Transform Raw → Analytics Layer" },
      { week: 18, title: "Data Quality Test Suite" },
      { week: 19, title: "Kafka Producer/Consumer Demo" },
      { week: 20, title: "Phase 2 Capstone: End-to-End Data Pipeline" },
    ],
    skills: [
      "PostgreSQL", "Advanced SQL", "SQLAlchemy",
      "ETL/ELT pipelines", "Apache Airflow",
      "GCP / Google Cloud", "BigQuery",
      "dbt", "Great Expectations",
      "Kafka basics", "Data modelling", "Star schema",
    ],
  },

  {
    id:          3,
    title:       "Data Science Core",
    subtitle:    "Analyse, visualise and extract insight from data",
    color:       "#F472B6",
    weeks:       [21, 32],
    totalDays:   60,
    dateRange:   "2 Nov 2026 – 22 Jan 2027",
    goal: `
Perform end-to-end exploratory data analysis. Produce
publication-quality visualisations. Apply statistics
correctly. Work with real datasets. Build a Kaggle
portfolio. Communicate findings clearly.
    `,
    weekTitles: [
      "W21: pandas Fundamentals: DataFrames, Series, Indexing",
      "W22: pandas Advanced: groupby, merge, pivot, apply",
      "W23: Data Cleaning at Scale with pandas",
      "W24: numpy Deep Dive: Arrays, Vectorisation, Linear Algebra",
      "W25: matplotlib: Charts, Subplots, Customisation",
      "W26: seaborn: Statistical Visualisation",
      "W27: plotly: Interactive & Dashboard Visualisations",
      "W28: Statistics for Data Science: Descriptive + Inferential",
      "W29: Probability & Distributions",
      "W30: Hypothesis Testing & A/B Testing",
      "W31: Exploratory Data Analysis (EDA) End-to-End",
      "W32: Kaggle Competition + Phase 3 Capstone",
    ],
    projects: [
      { week: 21, title: "pandas Data Manipulation Showcase" },
      { week: 22, title: "Sales/Revenue Analysis with groupby" },
      { week: 23, title: "Messy Dataset Cleaning Pipeline" },
      { week: 24, title: "numpy Performance Benchmarking Study" },
      { week: 25, title: "matplotlib Multi-Chart Report" },
      { week: 26, title: "seaborn Statistical Analysis Dashboard" },
      { week: 27, title: "plotly Interactive Data Explorer" },
      { week: 28, title: "Statistical Report: Population Health Metrics" },
      { week: 29, title: "Probability Simulation & Distribution Analysis" },
      { week: 30, title: "A/B Test Analysis: Drug Efficacy Study" },
      { week: 31, title: "Full EDA: Public Health Dataset" },
      { week: 32, title: "Phase 3 Capstone: Kaggle Submission + Analysis Report" },
    ],
    skills: [
      "pandas", "numpy (advanced)", "matplotlib",
      "seaborn", "plotly", "Descriptive statistics",
      "Inferential statistics", "Hypothesis testing",
      "A/B testing", "EDA methodology",
      "Kaggle", "Data storytelling",
    ],
  },

  {
    id:          4,
    title:       "Machine Learning",
    subtitle:    "Build, evaluate and deploy predictive models",
    color:       "#F59E0B",
    weeks:       [33, 44],
    totalDays:   60,
    dateRange:   "25 Jan – 16 Apr 2027",
    goal: `
Train, evaluate and deploy ML models. Understand the
maths behind the algorithms. Use scikit-learn fluently.
Handle real-world ML challenges: imbalanced data,
feature engineering, hyperparameter tuning, model
explainability. Deploy models as APIs.
    `,
    weekTitles: [
      "W33: ML Fundamentals: Supervised vs Unsupervised, Bias-Variance",
      "W34: Linear & Logistic Regression: Theory + Implementation",
      "W35: Decision Trees & Random Forests",
      "W36: Gradient Boosting: XGBoost & LightGBM",
      "W37: Model Evaluation: Metrics, Cross-Validation, ROC-AUC",
      "W38: Feature Engineering & Preprocessing Pipelines",
      "W39: Unsupervised Learning: Clustering & Dimensionality Reduction",
      "W40: Handling Imbalanced Data & Outliers",
      "W41: Model Explainability: SHAP, LIME, Feature Importance",
      "W42: Hyperparameter Tuning: GridSearch, Optuna",
      "W43: Model Deployment: FastAPI + Docker",
      "W44: Phase 4 Capstone: End-to-End ML Project",
    ],
    projects: [
      { week: 33, title: "ML Concept Deep Dive: Theory Notes + Diagrams" },
      { week: 34, title: "Regression Model: Predict Drug Demand" },
      { week: 35, title: "Classification: Patient Risk Stratification" },
      { week: 36, title: "XGBoost: Readmission Prediction" },
      { week: 37, title: "Model Evaluation Report: Compare 5 Models" },
      { week: 38, title: "Feature Engineering Pipeline for Tabular Health Data" },
      { week: 39, title: "Customer/Patient Segmentation with K-Means" },
      { week: 40, title: "Fraud Detection on Imbalanced Dataset" },
      { week: 41, title: "Model Explainability Report with SHAP" },
      { week: 42, title: "Hyperparameter Tuning: Before vs After Study" },
      { week: 43, title: "Deploy ML Model as FastAPI Endpoint on GCP" },
      { week: 44, title: "Phase 4 Capstone: ML Pipeline — Train to Deploy" },
    ],
    skills: [
      "scikit-learn", "XGBoost", "LightGBM",
      "Feature engineering", "Model evaluation",
      "Cross-validation", "SHAP", "LIME",
      "Optuna", "FastAPI", "Docker",
      "Model deployment on GCP",
    ],
  },

  {
    id:          5,
    title:       "AI & LLM Integration",
    subtitle:    "Build intelligent systems with large language models",
    color:       "#34D399",
    weeks:       [45, 54],
    totalDays:   50,
    dateRange:   "19 Apr – 27 Jun 2027",
    goal: `
Build production-grade AI applications using Claude API
and the modern LLM stack. Implement RAG pipelines.
Build tool-using agents. Combine LLMs with your data
engineering and ML foundations to create systems
that are genuinely intelligent and useful.
    `,
    weekTitles: [
      "W45: LLM Fundamentals: How Transformers Work",
      "W46: Claude API: Messages, Tools, System Prompts",
      "W47: Prompt Engineering: Techniques & Best Practices",
      "W48: LangChain: Chains, Memory, Tools",
      "W49: RAG Part 1: Document Loading, Chunking, Embeddings",
      "W50: RAG Part 2: Vector Databases (Pinecone/Chroma)",
      "W51: AI Agents: Tool Use, Planning, Multi-step Reasoning",
      "W52: LangGraph: Stateful Multi-Agent Workflows",
      "W53: LLM Evaluation & Guardrails",
      "W54: Phase 5 Capstone: AI-Powered Application",
    ],
    projects: [
      { week: 45, title: "Transformer Architecture: Visual Explainer" },
      { week: 46, title: "Claude API: Multi-turn Conversation System" },
      { week: 47, title: "Prompt Engineering Showcase: 10 Techniques" },
      { week: 48, title: "LangChain: Document Q&A System" },
      { week: 49, title: "RAG Pipeline: Ingest + Chunk + Embed" },
      { week: 50, title: "RAG App: Query a Knowledge Base" },
      { week: 51, title: "Tool-Using Agent: Multi-Step Task Solver" },
      { week: 52, title: "LangGraph: Multi-Agent Workflow" },
      { week: 53, title: "LLM Evaluation Framework" },
      { week: 54, title: "Phase 5 Capstone: AI Health Advisor (Full Stack)" },
    ],
    skills: [
      "Claude API", "Anthropic SDK",
      "Prompt engineering", "LangChain",
      "LangGraph", "RAG pipelines",
      "Vector databases", "Embeddings",
      "AI agents", "Tool use",
      "LLM evaluation", "Guardrails",
    ],
  },

  {
    id:          6,
    title:       "AI Automation & Agents",
    subtitle:    "Build autonomous systems that work without you",
    color:       "#60A5FA",
    weeks:       [55, 60],
    totalDays:   30,
    dateRange:   "30 Jun – 8 Aug 2027",
    goal: `
Build multi-step autonomous agents and automation
workflows. Use n8n and Python to automate repetitive
data and business tasks. Combine LLMs with APIs,
databases, and external tools to build systems that
run independently and deliver real business value.
    `,
    weekTitles: [
      "W55: Automation Architecture: Principles & Design Patterns",
      "W56: n8n: No-Code/Low-Code Workflow Automation",
      "W57: CrewAI: Multi-Agent Collaboration Frameworks",
      "W58: Autonomous Data Pipelines with AI",
      "W59: WhatsApp/Telegram Bot with AI Backend",
      "W60: Phase 6 Capstone: Full Automation System",
    ],
    projects: [
      { week: 55, title: "Automation Architecture: Design Document" },
      { week: 56, title: "n8n: 3 Automated Business Workflows" },
      { week: 57, title: "CrewAI: 3-Agent Research Pipeline" },
      { week: 58, title: "AI-Driven ETL: Scrape → Analyse → Report" },
      { week: 59, title: "WhatsApp Bot with Claude AI Backend" },
      { week: 60, title: "Phase 6 Capstone: Autonomous SaaS Feature" },
    ],
    skills: [
      "n8n", "CrewAI", "Multi-agent systems",
      "Workflow automation", "API orchestration",
      "Bot development", "Background jobs",
      "Autonomous pipelines",
    ],
  },

  {
    id:          7,
    title:       "Capstone & Career Launch",
    subtitle:    "Ship your flagship project. Enter the market.",
    color:       "#F87171",
    weeks:       [61, 64],
    totalDays:   20,
    dateRange:   "11 Aug – 10 Oct 2027",
    goal: `
Build and publicly launch your flagship portfolio project.
Polish your GitHub, LinkedIn, and CV. Apply for roles or
launch your first client project. Transition from student
to practitioner.
    `,
    weekTitles: [
      "W61: Flagship Project: Architecture & Build Sprint 1",
      "W62: Flagship Project: Build Sprint 2 + Deployment",
      "W63: Portfolio Polish: GitHub, LinkedIn, CV, Case Studies",
      "W64: Career Launch: Applications, Outreach, Freelance",
    ],
    projects: [
      {
        week: 61,
        title: "Flagship Project Sprint 1",
        description: `
Your magnum opus — combines everything from all 6 phases.
Suggested: A Data Platform for African Health Analytics.
  - Data Engineering: ETL pipeline from public health APIs
  - Data Science: EDA + statistical analysis layer
  - ML: Predictive model (disease risk, demand forecasting)
  - AI: Claude-powered natural language query interface
  - Automation: Scheduled reports delivered automatically
  - Deployed: Live on GCP with a real URL
        `
      },
      {
        week: 62,
        title: "Flagship Project Sprint 2 + Live Deployment",
      },
      {
        week: 63,
        title: "Portfolio & Personal Brand Audit",
        description: `
- GitHub: All repos have READMEs, screenshots, live demos
- LinkedIn: Optimised profile, 3 featured projects
- CV: Data-focused, quantified achievements
- Case studies: 3 written project breakdowns (blog/Substack)
- Kaggle profile: At least 1 competition, public notebooks
        `
      },
      {
        week: 64,
        title: "Career Launch: First Application or Client",
      },
    ],
    skills: [
      "System design", "Technical writing",
      "Project documentation", "Portfolio curation",
      "LinkedIn optimisation", "Technical interviewing",
      "Freelance client acquisition",
    ],
  },
];

// ============================================================
// PORTFOLIO ROADMAP — All 15 Projects
// ============================================================

const PORTFOLIO = [
  // Phase 1
  { id: "P1",  phase: 1, week: 1,  title: "CLI Dispensing Tool",              type: "CLI",            stack: ["Python"],                              difficulty: "Beginner"     },
  { id: "P2",  phase: 1, week: 2,  title: "Drug Inventory OOP System",        type: "CLI",            stack: ["Python", "OOP"],                       difficulty: "Beginner"     },
  { id: "P3",  phase: 1, week: 8,  title: "AI-Powered Drug Info System",      type: "CLI + API",      stack: ["Python", "Claude API"],                difficulty: "Intermediate" },
  // Phase 2
  { id: "P4",  phase: 2, week: 13, title: "ETL Pipeline: CSV → PostgreSQL",   type: "Data Pipeline",  stack: ["Python", "PostgreSQL", "Airflow"],     difficulty: "Intermediate" },
  { id: "P5",  phase: 2, week: 17, title: "dbt + BigQuery Data Warehouse",    type: "Data Engineering",stack: ["GCP", "BigQuery", "dbt"],             difficulty: "Intermediate" },
  { id: "P6",  phase: 2, week: 20, title: "End-to-End Data Pipeline",         type: "Data Engineering",stack: ["Python", "Airflow", "GCS", "BigQuery"],difficulty: "Advanced"    },
  // Phase 3
  { id: "P7",  phase: 3, week: 31, title: "Full EDA: Public Health Dataset",  type: "Analysis",       stack: ["pandas", "seaborn", "plotly"],         difficulty: "Intermediate" },
  { id: "P8",  phase: 3, week: 32, title: "Kaggle Competition Submission",    type: "Competition",    stack: ["pandas", "scikit-learn"],              difficulty: "Intermediate" },
  // Phase 4
  { id: "P9",  phase: 4, week: 43, title: "ML Model API on GCP",              type: "ML + Deployment",stack: ["scikit-learn", "FastAPI", "Docker", "GCP"], difficulty: "Advanced" },
  { id: "P10", phase: 4, week: 44, title: "ML Pipeline: Train to Deploy",     type: "ML",             stack: ["XGBoost", "SHAP", "FastAPI", "Docker"], difficulty: "Advanced"   },
  // Phase 5
  { id: "P11", phase: 5, week: 50, title: "RAG Knowledge Base App",           type: "AI App",         stack: ["Claude API", "LangChain", "Pinecone"], difficulty: "Advanced"    },
  { id: "P12", phase: 5, week: 54, title: "AI Health Advisor (Full Stack)",   type: "AI App",         stack: ["Claude API", "FastAPI", "React", "USDC"], difficulty: "Advanced" },
  // Phase 6
  { id: "P13", phase: 6, week: 59, title: "WhatsApp Bot + Claude Backend",    type: "Automation",     stack: ["Python", "Claude API", "n8n"],         difficulty: "Advanced"    },
  { id: "P14", phase: 6, week: 60, title: "Autonomous SaaS Feature",          type: "Automation",     stack: ["CrewAI", "n8n", "FastAPI"],            difficulty: "Advanced"    },
  // Phase 7
  { id: "P15", phase: 7, week: 62, title: "Flagship: Health Data Platform",   type: "Full Stack",     stack: ["Everything"],                          difficulty: "Expert"      },
];

// ============================================================
// CAREER MILESTONES
// ============================================================

const CAREER_MILESTONES = [
  {
    month:  4,
    date:   "Oct 2026",
    title:  "Junior Data Analyst Ready",
    description: "Can write Python, advanced SQL, build ETL pipelines, and use Git. Ready for analyst and junior DE roles.",
    evidence: ["P1", "P2", "P3", "P4"],
  },
  {
    month:  8,
    date:   "Feb 2027",
    title:  "Data Engineer Ready",
    description: "Can design databases, build cloud pipelines, use Airflow + dbt + BigQuery, validate data quality.",
    evidence: ["P4", "P5", "P6"],
  },
  {
    month:  12,
    date:   "Jun 2027",
    title:  "Data Scientist + AI Engineer Ready",
    description: "Can build and deploy ML models, perform statistical analysis, and build LLM-powered applications.",
    evidence: ["P7", "P8", "P9", "P10", "P11", "P12"],
  },
  {
    month:  16,
    date:   "Oct 2027",
    title:  "Full Stack Data + AI Engineer",
    description: "End-to-end capability: data engineering → data science → ML → AI → automation. Flagship project live.",
    evidence: ["P13", "P14", "P15"],
  },
];

// ============================================================
// DATE CALCULATOR — maps week number to actual calendar dates
// ============================================================

function getWeekDates(weekNumber) {
  const startDate = new Date("2026-06-15");
  const weekStart = new Date(startDate);
  weekStart.setDate(startDate.getDate() + (weekNumber - 1) * 7);

  const days = [];
  for (let d = 0; d < 5; d++) {
    const day = new Date(weekStart);
    day.setDate(weekStart.getDate() + d);
    days.push(day.toISOString().split("T")[0]);
  }
  return days;
}

function getDayId(weekNumber, dayNumber) {
  return `W${weekNumber}D${dayNumber}`;
}

function getPhaseForWeek(weekNumber) {
  return PHASES.find(p => weekNumber >= p.weeks[0] && weekNumber <= p.weeks[1]);
}

// ============================================================
// EXPORT
// ============================================================

if (typeof module !== "undefined") {
  module.exports = {
    ROADMAP_META,
    PHASES,
    PORTFOLIO,
    CAREER_MILESTONES,
    getWeekDates,
    getDayId,
    getPhaseForWeek,
  };
}
