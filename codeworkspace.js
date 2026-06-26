// ============================================================
// codeworkspace.js — VictorOS Code Practice Engine
// Reusable, local-first code workspaces for:
//   - per-example "Try it yourself" boxes (scope: "example")
//   - the global scratchpad / Lab        (scope: "scratchpad")
//   - phase-level required labs          (scope: "phase")
// Storage: localStorage only, additive keys, never touches
// existing victoros_* progress/streak/notes keys.
// JS execution: sandboxed via Function() + captured console.log.
// Other languages: write / save / copy only (no in-app run),
// except SQL once sql.js is wired in (later stage).
// ============================================================

const CodeWorkspace = (() => {

  const KEY_PREFIX = 'victoros_code_';

  // Holds starter code + expected output per rendered workspace,
  // keyed by workspaceId. Kept in memory (not in the DOM) so we
  // never have to HTML-escape code into a data-attribute.
  const _registry = {};

  // ─── Storage key helper ───
  // scope: 'example' | 'scratchpad' | 'phase'
  // id: dayId (e.g. "W1D1"), 'scratchpad', or a phase number
  function getCodeWorkspaceKey(scope, id) {
    return `${KEY_PREFIX}${scope}_${id}`;
  }

  // ─── SQL data persistence (separate from the code draft above) ───
  // Lets table contents (inserts/updates/deletes the learner runs)
  // survive across runs and app closes, with an explicit Reset Data
  // button to wipe back to the original seed.
  function getSqlDataKey(scope, id, dataset) {
    return `${KEY_PREFIX}sqldata_${scope}_${id}_${dataset}`;
  }

  function _uint8ToBase64(bytes) {
    let binary = '';
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  }

  function _base64ToUint8(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  }

  function saveSqlDatabase(key, db) {
    try {
      localStorage.setItem(key, _uint8ToBase64(db.export()));
      return true;
    } catch (err) {
      console.error('CodeWorkspace: saving SQL data failed', err);
      return false;
    }
  }

  // Returns a loaded SQL.Database if a saved one exists, or null
  // (caller should seed fresh in that case).
  function loadSqlDatabase(SQL, key) {
    const saved = localStorage.getItem(key);
    if (!saved) return null;
    try {
      return new SQL.Database(_base64ToUint8(saved));
    } catch (err) {
      console.error('CodeWorkspace: loading saved SQL data failed, reseeding', err);
      return null;
    }
  }

  function resetSqlDatabase(key) {
    localStorage.removeItem(key);
  }

  // ─── Load a saved draft, or fall back to starter code ───
  function loadCodeWorkspaceValue(key, fallback = '') {
    const saved = localStorage.getItem(key);
    return saved !== null ? saved : fallback;
  }

  // ─── Save a draft ───
  function saveCodeWorkspaceValue(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (err) {
      console.error('CodeWorkspace: save failed', err);
      return false;
    }
  }

  // ─── Reset: clear the saved draft, return the starter code ───
  function resetCodeWorkspace(key, fallback = '') {
    localStorage.removeItem(key);
    return fallback;
  }

  // ─── Copy text to clipboard (with a fallback for older WebViews) ───
  async function copyCodeWorkspaceValue(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        return true;
      } catch (err2) {
        console.error('CodeWorkspace: copy failed', err2);
        return false;
      }
    }
  }

  // ─── Run JavaScript in a sandboxed Function wrapper ───
  // NOTE: this is NOT a security sandbox — it runs in the same page
  // context as the app. That's an accepted tradeoff for a local-only,
  // single-user PWA where the only code being run is the learner's own.
  function runJavaScriptWorkspace(code) {
    const logs = [];
    const originalLog = console.log;
    console.log = (...args) => {
      logs.push(args.map(formatLogArg).join(' '));
    };

    let result;
    let errorMsg = null;
    try {
      const fn = new Function(code);
      result = fn();
    } catch (err) {
      errorMsg = err.message;
    } finally {
      console.log = originalLog;
    }

    let output = logs.join('\n');
    if (!errorMsg && result !== undefined) {
      output += (output ? '\n' : '') + '⮑ ' + formatLogArg(result);
    }
    if (!errorMsg && !output) {
      output = '(no output — try a console.log() to see something here)';
    }

    return { success: !errorMsg, output, error: errorMsg };
  }

  function formatLogArg(arg) {
    if (arg === undefined) return 'undefined';
    if (typeof arg === 'object') {
      try { return JSON.stringify(arg); } catch { return String(arg); }
    }
    return String(arg);
  }

  // ─── Guess the language of a code snippet ───
  // Used so the workspace can label/runnable-flag correctly without
  // a hardcoded week-number → language lookup table that would need
  // editing every time a new phase/language is added.
  function inferLanguage(code) {
    if (!code) return 'python'; // safe default given the roadmap so far
    const sample = code.slice(0, 800);

    if (/\b(SELECT|INSERT INTO|CREATE TABLE|UPDATE|DELETE FROM)\b/i.test(sample)) {
      return 'sql';
    }
    if (/^#!\/bin\/(bash|sh)/.test(sample) || /\b(grep|awk|chmod|chown|mkdir -p)\b/.test(sample)) {
      return 'bash';
    }
    if (/\b(console\.log|const |let |=>|function\s*\()/.test(sample) &&
        !/\bdef\s|:\s*\n|print\(/.test(sample)) {
      return 'javascript';
    }
    if (/\b(def\s|import\s|print\(|elif\b|self\.)/.test(sample)) {
      return 'python';
    }
    return 'python';
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  // ─── Render a workspace block as an HTML string ───
  // options:
  //   scope           'example' | 'scratchpad' | 'phase'      (required)
  //   id              dayId / 'scratchpad' / phase number     (required)
  //   starterCode     pre-filled code if no draft saved yet    (default '')
  //   language        'javascript' | 'python' | 'sql' | ...    (default 'javascript')
  //   runnable        true = shows a Run button + output panel (default: language === 'javascript')
  //   expectedOutput  string shown behind a toggle, or null     (default null)
  //   label           heading text                              (default 'Try it yourself')
  function renderCodeWorkspace(options) {
    const {
      scope,
      id,
      starterCode = '',
      language = 'javascript',
      runnable = (language === 'javascript' || language === 'sql'),
      expectedOutput = null,
      label = 'Try it yourself',
    } = options;

    const key = getCodeWorkspaceKey(scope, id);
    const workspaceId = `workspace-${scope}-${id}`;
    const savedValue = loadCodeWorkspaceValue(key, starterCode);

    _registry[workspaceId] = { key, starterCode, language, runnable, expectedOutput };

    const runBtn = runnable
      ? `<button class="ws-btn ws-run" data-action="run">▶ Run</button>`
      : '';

    const expectedBtn = expectedOutput
      ? `<button class="ws-btn ws-expected" data-action="toggle-expected">Show Expected Output</button>`
      : '';

    const schemaBtn = language === 'sql'
      ? `<button class="ws-btn ws-expected" data-action="toggle-schema">View Sample Tables</button>`
      : '';

    const resetDataBtn = language === 'sql'
      ? `<button class="ws-btn ws-reset" data-action="reset-data">Reset Data</button>`
      : '';

    const outputPanel = runnable
      ? `<div class="workspace-output hidden" id="${workspaceId}-output"></div>`
      : '';

    const expectedPanel = expectedOutput
      ? `<div class="workspace-expected hidden" id="${workspaceId}-expected">
           <span class="workspace-expected-label">Expected output</span>
           <pre>${escapeHtml(expectedOutput)}</pre>
         </div>`
      : '';

    const schemaPanel = language === 'sql'
      ? `<div class="workspace-expected hidden" id="${workspaceId}-schema">
           <pre>${escapeHtml(SQL_SCHEMA_CLEAN)}</pre>
         </div>`
      : '';

    const practiceOnlyNote = !runnable
      ? `<p class="workspace-note">Practice only for now — ${escapeHtml(language)} doesn't run in-app yet. Write, save, and copy your code to test it elsewhere.</p>`
      : language === 'sql'
        ? `<p class="workspace-note">First SQL run needs internet once (to load the SQL engine) — fully offline after that. Your changes (inserts/updates) carry over between runs — tap Reset Data to start fresh.</p>`
        : '';

    return `
      <div class="code-workspace" id="${workspaceId}">
        <div class="workspace-header">
          <span class="workspace-label">${escapeHtml(label)}</span>
          <span class="workspace-lang-tag">${escapeHtml(language)}</span>
        </div>
        <textarea class="workspace-editor" id="${workspaceId}-editor" spellcheck="false" autocapitalize="off" autocorrect="off">${escapeHtml(savedValue)}</textarea>
        <div class="workspace-actions">
          <button class="ws-btn ws-save" data-action="save">Save Draft</button>
          <button class="ws-btn ws-reset" data-action="reset">Reset</button>
          <button class="ws-btn ws-copy" data-action="copy">Copy Code</button>
          ${runBtn}
          ${schemaBtn}
          ${resetDataBtn}
          ${expectedBtn}
        </div>
        ${outputPanel}
        ${schemaPanel}
        ${expectedPanel}
        ${practiceOnlyNote}
      </div>
    `;
  }

  // ─── Wire up event listeners after a rendered workspace is in the DOM ───
  // Call this once, right after inserting the HTML from renderCodeWorkspace().
  function wireCodeWorkspace(scope, id) {
    const workspaceId = `workspace-${scope}-${id}`;
    const container = document.getElementById(workspaceId);
    const entry = _registry[workspaceId];
    if (!container || !entry) return;

    const { key, starterCode, runnable, language } = entry;
    const editor = document.getElementById(`${workspaceId}-editor`);
    const outputEl = document.getElementById(`${workspaceId}-output`);
    const expectedEl = document.getElementById(`${workspaceId}-expected`);

    container.querySelectorAll('.ws-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const action = btn.dataset.action;

        if (action === 'save') {
          saveCodeWorkspaceValue(key, editor.value);
          flashButton(btn, 'Saved ✓');
        }

        if (action === 'reset') {
          editor.value = resetCodeWorkspace(key, starterCode);
          flashButton(btn, 'Reset ✓');
        }

        if (action === 'copy') {
          const ok = await copyCodeWorkspaceValue(editor.value);
          flashButton(btn, ok ? 'Copied ✓' : 'Copy failed');
        }

        if (action === 'run' && runnable) {
          btn.disabled = true;
          const originalLabel = btn.textContent;
          btn.textContent = 'Running…';

          const result = language === 'sql'
            ? await runSqlWorkspace(editor.value, { dataset: 'clean', scope, id })
            : runJavaScriptWorkspace(editor.value);

          outputEl.classList.remove('hidden');
          outputEl.textContent = result.success ? result.output : `⚠ ${result.error}`;
          outputEl.classList.toggle('workspace-output-error', !result.success);

          btn.disabled = false;
          btn.textContent = originalLabel;
        }

        if (action === 'reset-data') {
          resetSqlDatabase(getSqlDataKey(scope, id, 'clean'));
          flashButton(btn, 'Data reset ✓');
        }

        if (action === 'toggle-schema') {
          const schemaEl = document.getElementById(`${workspaceId}-schema`);
          if (schemaEl) {
            const nowHidden = schemaEl.classList.toggle('hidden');
            btn.textContent = nowHidden ? 'View Sample Tables' : 'Hide Sample Tables';
          }
        }

        if (action === 'toggle-expected' && expectedEl) {
          const nowHidden = expectedEl.classList.toggle('hidden');
          btn.textContent = nowHidden ? 'Show Expected Output' : 'Hide Expected Output';
        }
      });
    });

    // Safety-net autosave: if the learner taps away without hitting
    // Save Draft, we still capture their last edit on blur.
    editor.addEventListener('blur', () => {
      saveCodeWorkspaceValue(key, editor.value);
    });
  }

  function flashButton(btn, text) {
    const original = btn.textContent;
    btn.disabled = true;
    btn.textContent = text;
    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
    }, 1200);
  }

  // ============================================================
  // SQL EXECUTION (sql.js — SQLite compiled to WASM)
  // Lazy-loaded: only fetched the first time someone actually runs
  // SQL, not on every app load. Needs internet once; after that the
  // service worker caches it for offline use like everything else.
  // ============================================================
  const SQLJS_VERSION = '1.10.3';
  const SQLJS_BASE = `https://cdnjs.cloudflare.com/ajax/libs/sql.js/${SQLJS_VERSION}/`;
  let _sqlJsModulePromise = null;

  function loadSqlJs() {
    if (_sqlJsModulePromise) return _sqlJsModulePromise;

    _sqlJsModulePromise = new Promise((resolve, reject) => {
      if (typeof initSqlJs !== 'undefined') {
        initSqlJs({ locateFile: f => SQLJS_BASE + f }).then(resolve, reject);
        return;
      }
      const script = document.createElement('script');
      script.src = SQLJS_BASE + 'sql-wasm.js';
      script.crossOrigin = 'anonymous'; // so the SW can cache it as a real (non-opaque) response
      script.onload = () => {
        initSqlJs({ locateFile: f => SQLJS_BASE + f }).then(resolve, reject);
      };
      script.onerror = () => reject(new Error('Could not load the SQL engine — check your connection. Once it loads successfully one time, it works offline after that.'));
      document.head.appendChild(script);
    });

    return _sqlJsModulePromise;
  }

  function formatSqlResult(result) {
    const { columns, values } = result;
    const header = columns.join(' | ');
    const divider = columns.map(() => '---').join(' | ');
    const rows = values.map(row => row.map(v => (v === null ? 'NULL' : String(v))).join(' | '));
    return [header, divider, ...rows].join('\n');
  }

  // ─── Sample dataset, auto-loaded into every fresh SQL run ───
  // Pharmacy-themed (ties into your clinical background), but
  // generic enough for joins, GROUP BY, aggregations, and window
  // functions — covers what Phase 2's SQL weeks actually need.
  const SQL_SEED_CLEAN = `
    CREATE TABLE patients (
      patient_id INTEGER PRIMARY KEY,
      full_name TEXT,
      age INTEGER,
      gender TEXT,
      state TEXT,
      registered_date TEXT
    );

    CREATE TABLE drugs (
      drug_id INTEGER PRIMARY KEY,
      name TEXT,
      category TEXT,
      unit_price REAL,
      manufacturer TEXT
    );

    CREATE TABLE pharmacies (
      pharmacy_id INTEGER PRIMARY KEY,
      name TEXT,
      city TEXT,
      state TEXT
    );

    CREATE TABLE sales (
      sale_id INTEGER PRIMARY KEY,
      patient_id INTEGER,
      drug_id INTEGER,
      pharmacy_id INTEGER,
      quantity INTEGER,
      sale_date TEXT,
      total_amount REAL
    );

    INSERT INTO patients VALUES
      (1, 'Adaeze Okafor', 34, 'F', 'Lagos', '2025-01-12'),
      (2, 'Chinedu Eze', 45, 'M', 'Enugu', '2025-02-03'),
      (3, 'Fatima Bello', 29, 'F', 'Kano', '2025-02-18'),
      (4, 'Tunde Bakare', 52, 'M', 'Oyo', '2025-03-01'),
      (5, 'Ngozi Umeh', 38, 'F', 'Anambra', '2025-03-22'),
      (6, 'Yusuf Garba', 61, 'M', 'Kaduna', '2025-04-05'),
      (7, 'Blessing Etim', 27, 'F', 'Cross River', '2025-04-19'),
      (8, 'Emeka Nwosu', 49, 'M', 'Imo', '2025-05-02');

    INSERT INTO drugs VALUES
      (1, 'Metformin 500mg', 'Antidiabetic', 850.00, 'Fidson'),
      (2, 'Amoxicillin 500mg', 'Antibiotic', 1200.00, 'Emzor'),
      (3, 'Paracetamol 500mg', 'Analgesic', 300.00, 'GSK'),
      (4, 'Amlodipine 5mg', 'Antihypertensive', 950.00, 'Swiss Pharma'),
      (5, 'Artemether/Lumefantrine', 'Antimalarial', 1500.00, 'May & Baker'),
      (6, 'Ibuprofen 400mg', 'Analgesic', 400.00, 'Emzor');

    INSERT INTO pharmacies VALUES
      (1, 'HealthPlus Ikeja', 'Lagos', 'Lagos'),
      (2, 'MedPlus Enugu', 'Enugu', 'Enugu'),
      (3, 'Greenlife Kano', 'Kano', 'Kano'),
      (4, 'HealthPlus Ibadan', 'Ibadan', 'Oyo');

    INSERT INTO sales VALUES
      (1, 1, 1, 1, 2, '2025-05-01', 1700.00),
      (2, 2, 2, 2, 1, '2025-05-02', 1200.00),
      (3, 3, 3, 3, 3, '2025-05-03', 900.00),
      (4, 4, 4, 4, 1, '2025-05-04', 950.00),
      (5, 5, 5, 1, 2, '2025-05-05', 3000.00),
      (6, 6, 6, 2, 4, '2025-05-06', 1600.00),
      (7, 1, 3, 1, 1, '2025-05-10', 300.00),
      (8, 2, 1, 2, 2, '2025-05-12', 1700.00),
      (9, 7, 2, 3, 1, '2025-05-15', 1200.00),
      (10, 8, 4, 4, 3, '2025-05-18', 2850.00);
  `;

  const SQL_SCHEMA_CLEAN =
`Sample tables — auto-loaded before every run, just query them:

patients(patient_id, full_name, age, gender, state, registered_date)
drugs(drug_id, name, category, unit_price, manufacturer)
pharmacies(pharmacy_id, name, city, state)
sales(sale_id, patient_id, drug_id, pharmacy_id, quantity, sale_date, total_amount)

Try:
SELECT * FROM patients;

Or something heavier:
SELECT d.name, SUM(s.total_amount) AS revenue
FROM sales s JOIN drugs d ON s.drug_id = d.drug_id
GROUP BY d.name ORDER BY revenue DESC;`;

  // ─── Dirty dataset — for the Lab's data-cleaning practice ───
  // All columns stored as TEXT (like a raw CSV import would land),
  // deliberately full of: inconsistent casing/whitespace, mixed date
  // formats, duplicate rows, orphan foreign keys, currency symbols,
  // unit suffixes, and missing values. Good for the ETL/Great
  // Expectations/dbt-tests mindset later in Phase 2.
  const SQL_SEED_DIRTY = `
    CREATE TABLE patients_raw (
      patient_id TEXT,
      full_name TEXT,
      age TEXT,
      gender TEXT,
      state TEXT,
      registered_date TEXT
    );

    CREATE TABLE drugs_raw (
      drug_id TEXT,
      name TEXT,
      category TEXT,
      unit_price TEXT,
      manufacturer TEXT
    );

    CREATE TABLE sales_raw (
      sale_id TEXT,
      patient_id TEXT,
      drug_id TEXT,
      pharmacy_id TEXT,
      quantity TEXT,
      sale_date TEXT,
      total_amount TEXT
    );

    INSERT INTO patients_raw VALUES
      ('1', '  Adaeze Okafor', '34', 'F', 'Lagos', '2025-01-12'),
      ('2', 'CHINEDU EZE', '45', 'M', 'Enugu', '03/02/2025'),
      ('3', 'Fatima Bello', 'twenty-nine', 'F', 'Kano', '2025-02-18'),
      ('4', 'Tunde Bakare', '52', 'M', NULL, '2025-03-01'),
      ('4', 'Tunde Bakare', '52', 'M', 'Oyo', '2025-03-01'),
      ('5', 'Ngozi  Umeh', '38', 'f', 'Anambra', '2025/03/22'),
      ('6', 'yusuf garba', NULL, 'M', 'Kaduna', '2025-04-05'),
      ('7', 'Blessing Etim', '27', 'F', 'Cross River', ''),
      ('8', 'Emeka Nwosu', '49yrs', 'M', 'Imo', '2025-05-02'),
      ('9', '', '31', 'F', 'Rivers', '2025-05-10');

    INSERT INTO drugs_raw VALUES
      ('1', 'Metformin 500mg', 'Antidiabetic', '850.00', 'Fidson'),
      ('2', 'metformin500mg', 'antidiabetic', '850', 'Fidson'),
      ('3', 'Amoxicillin 500mg', 'Antibiotic', '₦1200', 'Emzor'),
      ('4', 'PARACETAMOL 500MG', 'Analgesic', '300.00 NGN', 'GSK'),
      ('5', 'Amlodipine 5mg', NULL, '950', NULL),
      ('6', ' Ibuprofen 400mg ', 'Analgesic', 'N/A', 'Emzor');

    INSERT INTO sales_raw VALUES
      ('1', '1', '1', '1', '2', '2025-05-01', '1700.00'),
      ('2', '2', '2', '2', '1', '2025-05-02', '1200.00'),
      ('3', '99', '3', '3', '3', '2025-05-03', '900.00'),
      ('4', '4', '4', '4', '-1', '2025-05-04', '950.00'),
      ('5', '5', '5', '1', '2', '2025-05-05', NULL),
      ('6', '6', '6', '2', '4', '2025-05-06', '1600.00'),
      ('6', '6', '6', '2', '4', '2025-05-06', '1600.00'),
      ('8', '2', '1', '2', '2', 'May 12 2025', '1700.00'),
      ('9', '7', '888', '3', '1', '2025-05-15', '1200.00'),
      ('10', '8', '4', '4', '3', '2025-05-18', '2850.00');
  `;

  const SQL_SCHEMA_DIRTY =
`DIRTY sample tables — intentionally messy, for cleaning practice:

patients_raw(patient_id, full_name, age, gender, state, registered_date)
  → has: duplicate patient_id, mixed date formats, age as words/suffix,
    inconsistent casing, blank/missing values

drugs_raw(drug_id, name, category, unit_price, manufacturer)
  → has: near-duplicate drug names, currency symbols, unit suffixes,
    missing category/manufacturer

sales_raw(sale_id, patient_id, drug_id, pharmacy_id, quantity, sale_date, total_amount)
  → has: orphan patient_id/drug_id (no matching row), duplicate sale_id,
    negative quantity, mixed date formats, missing totals

Try:
SELECT * FROM patients_raw;

Cleaning practice:
SELECT DISTINCT TRIM(full_name) AS clean_name, patient_id
FROM patients_raw;`;

  // Reuses a persisted DB if one exists for this scope/id/dataset
  // (so INSERTs/UPDATEs survive across runs and app closes); seeds
  // fresh from the sample data otherwise. Always saves back after
  // running, so the next run picks up wherever this one left off.
  // Pass { scope, id } so changes are tracked per workspace; without
  // them, falls back to a one-off, non-persisted in-memory run.
  async function runSqlWorkspace(code, options = {}) {
    const { dataset = 'clean', scope = null, id = null } = options;

    let SQL;
    try {
      SQL = await loadSqlJs();
    } catch (err) {
      return { success: false, output: '', error: err.message };
    }

    const dataKey = scope && id ? getSqlDataKey(scope, id, dataset) : null;
    let db = dataKey ? loadSqlDatabase(SQL, dataKey) : null;

    if (!db) {
      db = new SQL.Database();
      const seedScript = dataset === 'dirty' ? SQL_SEED_DIRTY : SQL_SEED_CLEAN;
      try {
        db.run(seedScript);
      } catch (err) {
        db.close();
        return { success: false, output: '', error: `Sample data failed to load: ${err.message}` };
      }
    }

    let results;
    try {
      results = db.exec(code);
    } catch (err) {
      db.close();
      return { success: false, output: '', error: err.message };
    }

    if (dataKey) saveSqlDatabase(dataKey, db);
    db.close();

    if (!results.length) {
      return { success: true, output: '(ran successfully — no rows returned, e.g. CREATE/INSERT with no SELECT)' };
    }

    return { success: true, output: results.map(formatSqlResult).join('\n\n') };
  }

  // ============================================================
  // GLOBAL CODE LAB (scratchpad — scope: 'scratchpad')
  // One workspace, language selectable; each language keeps its
  // own separate saved draft.
  // ============================================================
  const LAB_LANGUAGES = ['javascript', 'python', 'sql', 'bash', 'markdown'];
  const LAB_LANGUAGE_LABELS = {
    javascript: 'JavaScript',
    python: 'Python',
    sql: 'SQL',
    bash: 'Bash',
    markdown: 'Markdown / Notes',
  };
  const LAB_DEFAULT_LANGUAGE = 'javascript';
  const LAB_DEFAULT_DATASET = 'dirty'; // Lab defaults to messy data for cleaning practice

  function getLabLanguageKey() {
    return `${KEY_PREFIX}scratchpad_lastlang`;
  }

  function getLabDatasetKey() {
    return `${KEY_PREFIX}scratchpad_dataset`;
  }

  function isLabRunnable(language) {
    return language === 'javascript' || language === 'sql';
  }

  function renderGlobalCodeLab() {
    const savedLang = localStorage.getItem(getLabLanguageKey()) || LAB_DEFAULT_LANGUAGE;
    const savedDataset = localStorage.getItem(getLabDatasetKey()) || LAB_DEFAULT_DATASET;
    const options = LAB_LANGUAGES.map(lang =>
      `<option value="${lang}" ${lang === savedLang ? 'selected' : ''}>${LAB_LANGUAGE_LABELS[lang]}</option>`
    ).join('');

    return `
      <div class="code-workspace code-lab">
        <div class="workspace-header">
          <span class="workspace-label">Scratchpad</span>
          <select id="lab-language-select" class="lab-lang-select">${options}</select>
        </div>
        <div class="lab-dataset-row hidden" id="lab-dataset-row">
          <span class="workspace-note" style="margin:0;">Sample data:</span>
          <select id="lab-dataset-select" class="lab-lang-select">
            <option value="clean" ${savedDataset === 'clean' ? 'selected' : ''}>Clean</option>
            <option value="dirty" ${savedDataset === 'dirty' ? 'selected' : ''}>Dirty (cleaning practice)</option>
          </select>
        </div>
        <textarea class="workspace-editor" id="lab-editor" spellcheck="false" autocapitalize="off" autocorrect="off"></textarea>
        <div class="workspace-actions">
          <button class="ws-btn" data-lab-action="save">Save</button>
          <button class="ws-btn" data-lab-action="reset">Reset</button>
          <button class="ws-btn" data-lab-action="copy">Copy</button>
          <button class="ws-btn ws-run hidden" id="lab-run-btn" data-lab-action="run">▶ Run</button>
          <button class="ws-btn ws-expected hidden" id="lab-schema-btn" data-lab-action="toggle-schema">View Sample Tables</button>
          <button class="ws-btn ws-reset hidden" id="lab-reset-data-btn" data-lab-action="reset-data">Reset Data</button>
        </div>
        <div class="workspace-output hidden" id="lab-output"></div>
        <div class="workspace-expected hidden" id="lab-schema-panel"><pre id="lab-schema-text"></pre></div>
        <p class="workspace-note hidden" id="lab-note"></p>
      </div>
    `;
  }

  function wireGlobalCodeLab() {
    const select = document.getElementById('lab-language-select');
    const datasetRow = document.getElementById('lab-dataset-row');
    const datasetSelect = document.getElementById('lab-dataset-select');
    const editor = document.getElementById('lab-editor');
    const runBtn = document.getElementById('lab-run-btn');
    const schemaBtn = document.getElementById('lab-schema-btn');
    const resetDataBtn = document.getElementById('lab-reset-data-btn');
    const schemaPanel = document.getElementById('lab-schema-panel');
    const schemaText = document.getElementById('lab-schema-text');
    const outputEl = document.getElementById('lab-output');
    const noteEl = document.getElementById('lab-note');
    if (!select || !editor) return;

    const currentKey = () => getCodeWorkspaceKey('scratchpad', select.value);

    function updateSchemaText() {
      schemaText.textContent = datasetSelect.value === 'dirty' ? SQL_SCHEMA_DIRTY : SQL_SCHEMA_CLEAN;
    }

    function loadForLanguage() {
      editor.value = loadCodeWorkspaceValue(currentKey(), '');
      outputEl.classList.add('hidden');
      outputEl.textContent = '';
      schemaPanel.classList.add('hidden');
      schemaBtn.textContent = 'View Sample Tables';

      const runnable = isLabRunnable(select.value);
      runBtn.classList.toggle('hidden', !runnable);

      const isSql = select.value === 'sql';
      datasetRow.classList.toggle('hidden', !isSql);
      schemaBtn.classList.toggle('hidden', !isSql);
      resetDataBtn.classList.toggle('hidden', !isSql);
      if (isSql) updateSchemaText();

      if (!runnable) {
        noteEl.textContent = `Practice only for now — ${LAB_LANGUAGE_LABELS[select.value]} doesn't run in-app yet. Write, save, and copy your code to test it elsewhere.`;
        noteEl.classList.remove('hidden');
      } else if (isSql) {
        noteEl.textContent = 'First SQL run needs internet once (to load the SQL engine) — fully offline after that. Your changes carry over between runs — tap Reset Data to start fresh.';
        noteEl.classList.remove('hidden');
      } else {
        noteEl.classList.add('hidden');
      }
    }

    select.addEventListener('change', () => {
      localStorage.setItem(getLabLanguageKey(), select.value);
      loadForLanguage();
    });

    datasetSelect.addEventListener('change', () => {
      localStorage.setItem(getLabDatasetKey(), datasetSelect.value);
      updateSchemaText();
      outputEl.classList.add('hidden');
      outputEl.textContent = '';
    });

    editor.addEventListener('blur', () => {
      saveCodeWorkspaceValue(currentKey(), editor.value);
    });

    document.querySelectorAll('[data-lab-action]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const action = btn.dataset.labAction;

        if (action === 'save') {
          saveCodeWorkspaceValue(currentKey(), editor.value);
          flashButton(btn, 'Saved ✓');
        }

        if (action === 'reset') {
          editor.value = resetCodeWorkspace(currentKey(), '');
          flashButton(btn, 'Reset ✓');
        }

        if (action === 'copy') {
          const ok = await copyCodeWorkspaceValue(editor.value);
          flashButton(btn, ok ? 'Copied ✓' : 'Copy failed');
        }

        if (action === 'toggle-schema') {
          const nowHidden = schemaPanel.classList.toggle('hidden');
          btn.textContent = nowHidden ? 'View Sample Tables' : 'Hide Sample Tables';
        }

        if (action === 'run') {
          const lang = select.value;
          if (!isLabRunnable(lang)) return;

          runBtn.disabled = true;
          const originalLabel = runBtn.textContent;
          runBtn.textContent = 'Running…';

          const result = lang === 'javascript'
            ? runJavaScriptWorkspace(editor.value)
            : await runSqlWorkspace(editor.value, { dataset: datasetSelect.value, scope: 'scratchpad', id: 'global' });

          outputEl.classList.remove('hidden');
          outputEl.textContent = result.success ? result.output : `⚠ ${result.error}`;
          outputEl.classList.toggle('workspace-output-error', !result.success);

          runBtn.disabled = false;
          runBtn.textContent = originalLabel;
        }

        if (action === 'reset-data') {
          resetSqlDatabase(getSqlDataKey('scratchpad', 'global', datasetSelect.value));
          flashButton(btn, 'Data reset ✓');
        }
      });
    });

    loadForLanguage();
  }

  // ─── Public API ───
  return {
    getCodeWorkspaceKey,
    loadCodeWorkspaceValue,
    saveCodeWorkspaceValue,
    resetCodeWorkspace,
    copyCodeWorkspaceValue,
    runJavaScriptWorkspace,
    runSqlWorkspace,
    inferLanguage,
    renderCodeWorkspace,
    wireCodeWorkspace,
    renderGlobalCodeLab,
    wireGlobalCodeLab,
  };

})();
