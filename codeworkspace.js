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
      runnable = language === 'javascript',
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

    const outputPanel = runnable
      ? `<div class="workspace-output hidden" id="${workspaceId}-output"></div>`
      : '';

    const expectedPanel = expectedOutput
      ? `<div class="workspace-expected hidden" id="${workspaceId}-expected">
           <span class="workspace-expected-label">Expected output</span>
           <pre>${escapeHtml(expectedOutput)}</pre>
         </div>`
      : '';

    const practiceOnlyNote = !runnable
      ? `<p class="workspace-note">Practice only for now — ${escapeHtml(language)} doesn't run in-app yet. Write, save, and copy your code to test it elsewhere.</p>`
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
          ${expectedBtn}
        </div>
        ${outputPanel}
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

    const { key, starterCode, runnable } = entry;
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
          const result = runJavaScriptWorkspace(editor.value);
          outputEl.classList.remove('hidden');
          outputEl.textContent = result.success ? result.output : `⚠ ${result.error}`;
          outputEl.classList.toggle('workspace-output-error', !result.success);
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

  // ─── Public API ───
  return {
    getCodeWorkspaceKey,
    loadCodeWorkspaceValue,
    saveCodeWorkspaceValue,
    resetCodeWorkspace,
    copyCodeWorkspaceValue,
    runJavaScriptWorkspace,
    renderCodeWorkspace,
    wireCodeWorkspace,
  };

})();
