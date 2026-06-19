// ============================================================
// app.js — VictorOS Core Application Logic
// Handles: routing, rendering, state, day navigation,
//          tying together notifications.js, notes.js, github.js
// ============================================================

const App = (() => {

  // ─── Combine all loaded week data into one flat array ───
  function getAllDays() {
    let days = [];
    if (typeof WEEK1 !== 'undefined') days = days.concat(WEEK1);
    if (typeof WEEK2 !== 'undefined') days = days.concat(WEEK2);
    if (typeof WEEK3 !== 'undefined') days = days.concat(WEEK3);
    if (typeof WEEK4 !== 'undefined') days = days.concat(WEEK4);
    if (typeof WEEK5 !== 'undefined') days = days.concat(WEEK5);
    if (typeof WEEK6 !== 'undefined') days = days.concat(WEEK6);
    if (typeof WEEK7 !== 'undefined') days = days.concat(WEEK7);
    // Future weeks (WEEK8, ...) get added here as they're built
    return days;
  }

  const STORAGE_KEY_COMPLETED = 'victoros_completed_days';
  const STORAGE_KEY_CURRENT   = 'victoros_current_day_id';

  let state = {
    allDays:       [],
    currentDayId:  null,
    currentWeek:   1,
    completed:     {},   // { dayId: true }
    activeView:    'today',
  };

  // ============================================================
  // STATE PERSISTENCE
  // ============================================================

  function loadCompleted() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_COMPLETED) || '{}');
    } catch {
      return {};
    }
  }

  function saveCompleted() {
    localStorage.setItem(STORAGE_KEY_COMPLETED, JSON.stringify(state.completed));
  }

  function getCurrentDayId() {
    const saved = localStorage.getItem(STORAGE_KEY_CURRENT);
    if (saved) return saved;
    // Default: find the first incomplete day, or Day 1 if none done
    const firstIncomplete = state.allDays.find(d => !state.completed[d.id]);
    return firstIncomplete ? firstIncomplete.id : (state.allDays[0]?.id || 'W1D1');
  }

  function setCurrentDayId(dayId) {
    state.currentDayId = dayId;
    localStorage.setItem(STORAGE_KEY_CURRENT, dayId);
  }

  // ============================================================
  // DAY LOOKUP HELPERS
  // ============================================================

  function findDay(dayId) {
    return state.allDays.find(d => d.id === dayId);
  }

  function getDaysForWeek(weekNum) {
    return state.allDays.filter(d => d.week === weekNum);
  }

  function getTotalWeeks() {
    if (typeof ROADMAP_META !== 'undefined') return ROADMAP_META.totalWeeks;
    return 64;
  }

  function getTotalDays() {
    if (typeof ROADMAP_META !== 'undefined') return ROADMAP_META.totalDays;
    return 320;
  }

  function getNextDay(dayId) {
    const idx = state.allDays.findIndex(d => d.id === dayId);
    if (idx === -1 || idx === state.allDays.length - 1) return null;
    return state.allDays[idx + 1];
  }

  // ============================================================
  // STREAK CALCULATION
  // ============================================================

  function calculateStreak() {
    // Walk backwards from most recently completed day, counting
    // consecutive completions. A gap is only forgiven if every
    // day between the two completions was a Saturday or Sunday
    // (i.e. no weekday was actually skipped).
    const sortedCompleted = state.allDays
      .filter(d => state.completed[d.id])
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    if (sortedCompleted.length === 0) return 0;

    let streak = 1;
    for (let i = 0; i < sortedCompleted.length - 1; i++) {
      const current  = new Date(sortedCompleted[i].date);
      const previous = new Date(sortedCompleted[i + 1].date);

      if (allDaysBetweenAreWeekend(previous, current)) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }

  // Checks every calendar day strictly between two dates (exclusive)
  // and returns true only if all of them fall on Sat/Sun.
  // Same-day or next-day always returns true trivially.
  function allDaysBetweenAreWeekend(earlierDate, laterDate) {
    const cursor = new Date(earlierDate);
    cursor.setDate(cursor.getDate() + 1);

    while (cursor < laterDate) {
      const day = cursor.getDay(); // 0 = Sun, 6 = Sat
      if (day !== 0 && day !== 6) return false; // a weekday was skipped
      cursor.setDate(cursor.getDate() + 1);
    }
    return true;
  }

  // ============================================================
  // RENDERING — TODAY VIEW
  // ============================================================

  function renderToday() {
    const day = findDay(state.currentDayId);
    if (!day) {
      document.getElementById('today-topic').textContent = "You're all caught up! 🎉";
      return;
    }

    // Header
    const dateObj = new Date(day.date);
    const dateStr = dateObj.toLocaleDateString('en-GB', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
    document.getElementById('today-date').textContent = dateStr;
    document.getElementById('today-week-label').textContent =
      `Week ${day.week} · Day ${getDayIndexOverall(day.id) + 1} of ${getTotalDays()}`;

    // Day card
    document.getElementById('day-type-badge').textContent =
      day.type === 'project' ? 'Project' : 'Lesson';
    document.getElementById('day-type-badge').className =
      `type-badge ${day.type === 'project' ? 'project' : 'lesson'}`;
    document.getElementById('today-topic').textContent = day.topic;
    document.getElementById('today-duration').textContent = `⏱ ${day.duration || ''}`;

    // Objectives
    const objList = document.getElementById('objectives-list');
    objList.innerHTML = '';
    (day.objectives || []).forEach(obj => {
      const li = document.createElement('li');
      li.textContent = obj;
      objList.appendChild(li);
    });
    toggleBlock('objectives-block', (day.objectives || []).length > 0);

    // Introduction (combine intro + mental model + clinical connection if present)
    let introText = day.introduction || '';
    if (day.mentalModel) introText += '\n\n' + day.mentalModel;
    document.getElementById('intro-text').textContent = introText.trim();
    toggleBlock('intro-block', !!introText.trim());

    // Explanation (combine explanation + clinical connection)
    let explainText = day.explanation || '';
    if (day.clinicalConnection) explainText += '\n\n' + day.clinicalConnection;
    document.getElementById('explanation-text').textContent = explainText.trim();
    toggleBlock('explanation-block', !!explainText.trim());

    // Example code
    document.getElementById('example-code').textContent = day.example || '';
    toggleBlock('example-block', !!day.example);

    // Common mistakes
    renderMistakes(day.commonMistakes || []);

    // Exercises
    renderExercises(day.exercises || []);

    // Project block (Fridays)
    if (day.type === 'project' && day.projectBrief) {
      document.getElementById('project-brief').textContent = day.projectBrief;
      toggleBlock('project-block', true);
    } else {
      toggleBlock('project-block', false);
    }

    // Resources
    renderResources(day.resources || []);

    // Notes — load from IndexedDB
    loadNotesForDay(day.id);

    // Complete button state
    updateCompleteButton(day.id);
  }

  function getDayIndexOverall(dayId) {
    return state.allDays.findIndex(d => d.id === dayId);
  }

  function toggleBlock(blockId, show) {
    const el = document.getElementById(blockId);
    if (!el) return;
    el.classList.toggle('hidden', !show);
  }

  function renderMistakes(mistakes) {
    const container = document.getElementById('mistakes-list');
    container.innerHTML = '';
    if (!mistakes.length) {
      toggleBlock('mistakes-block', false);
      return;
    }
    toggleBlock('mistakes-block', true);

    mistakes.forEach(m => {
      const div = document.createElement('div');
      div.className = 'mistake-item';
      div.innerHTML = `
        <div class="mistake-label">⚠️ ${escapeHtml(m.mistake)}</div>
        <div class="mistake-wrong">✗ ${escapeHtml(m.wrong)}</div>
        <div class="mistake-right">✓ ${escapeHtml(m.right)}</div>
        <div class="mistake-explanation">${escapeHtml(m.explanation)}</div>
      `;
      container.appendChild(div);
    });
  }

  function renderExercises(exercises) {
    const list = document.getElementById('exercises-list');
    list.innerHTML = '';
    if (!exercises.length) {
      toggleBlock('exercises-block', false);
      return;
    }
    toggleBlock('exercises-block', true);

    exercises.forEach((ex, i) => {
      const li = document.createElement('li');
      li.innerHTML = `<span class="exercise-num">${i + 1}.</span><span>${escapeHtml(ex)}</span>`;
      list.appendChild(li);
    });
  }

  function renderResources(resources) {
    const container = document.getElementById('resources-list');
    container.innerHTML = '';
    if (!resources.length) {
      toggleBlock('resources-block', false);
      return;
    }
    toggleBlock('resources-block', true);

    // Handle both old format (flat list) and new format (objective-mapped)
    resources.forEach(group => {
      if (group.objective && group.items) {
        // New objective-mapped format
        const objHeader = document.createElement('div');
        objHeader.style.fontSize = '12px';
        objHeader.style.color = 'var(--teal)';
        objHeader.style.fontWeight = '600';
        objHeader.style.margin = '12px 0 6px';
        objHeader.textContent = `→ ${group.objective}`;
        container.appendChild(objHeader);

        group.items.forEach(item => container.appendChild(buildResourceItem(item)));
      } else {
        // Old flat format
        container.appendChild(buildResourceItem(group));
      }
    });
  }

  function buildResourceItem(item) {
    const icons = { video: '▶️', article: '📄', interactive: '🛠️', reference: '📘', tool: '🔧' };
    const icon = icons[item.type] || '📄';

    const div = document.createElement('div');
    div.className = 'resource-item';
    div.innerHTML = `
      <div class="resource-type-icon">${icon}</div>
      <div class="resource-info">
        <a class="resource-title" href="${escapeHtml(item.url)}" target="_blank" rel="noopener">
          ${escapeHtml(item.title)}
        </a>
        <div class="resource-meta">${escapeHtml(item.type || '')}${item.duration ? ' · ' + escapeHtml(item.duration) : ''}</div>
        ${item.note ? `<div class="resource-note">${escapeHtml(item.note)}</div>` : ''}
      </div>
    `;
    return div;
  }

  function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ============================================================
  // NOTES INTEGRATION
  // ============================================================

  async function loadNotesForDay(dayId) {
    const textarea = document.getElementById('day-notes');
    try {
      const note = await Notes.load(dayId);
      textarea.value = note ? note.content : '';
    } catch {
      textarea.value = '';
    }
  }

  async function saveCurrentNotes() {
    const day = findDay(state.currentDayId);
    if (!day) return;
    const content = document.getElementById('day-notes').value;

    await Notes.save(day.id, content, {
      week: day.week, phase: day.phase, topic: day.topic, date: day.date
    });

    const indicator = document.getElementById('notes-saved-indicator');
    indicator.classList.remove('hidden');
    setTimeout(() => indicator.classList.add('hidden'), 1800);
  }

  // ============================================================
  // COMPLETE DAY
  // ============================================================

  function updateCompleteButton(dayId) {
    const btn = document.getElementById('complete-btn');
    const isDone = !!state.completed[dayId];
    btn.textContent = isDone ? '✓ Day Complete!' : 'Mark Day Complete ✓';
    btn.classList.toggle('completed', isDone);
  }

  function toggleDayComplete() {
    const day = findDay(state.currentDayId);
    if (!day) return;

    state.completed[day.id] = !state.completed[day.id];
    saveCompleted();
    updateCompleteButton(day.id);
    updateGlobalProgress();
    updateStreakDisplay();

    // If marking complete, advance to next day automatically
    if (state.completed[day.id]) {
      const next = getNextDay(day.id);
      if (next) {
        setTimeout(() => {
          setCurrentDayId(next.id);
          renderToday();
        }, 600);
      }
    }
  }

  // ============================================================
  // GLOBAL PROGRESS BAR + STREAK
  // ============================================================

  function updateGlobalProgress() {
    const completedCount = Object.values(state.completed).filter(Boolean).length;
    const total = getTotalDays();
    const pct = Math.round((completedCount / total) * 100);

    document.getElementById('global-progress-bar').style.width = `${pct}%`;
    document.getElementById('global-progress-text').textContent = `${completedCount} / ${total} days`;
  }

  function updateStreakDisplay() {
    const streak = calculateStreak();
    document.getElementById('streak-count').textContent = streak;
  }

  // ============================================================
  // RENDERING — WEEK VIEW
  // ============================================================

  function renderWeek() {
    const days = getDaysForWeek(state.currentWeek);

    // Try to get the phase title even if no day-level data exists yet,
    // by looking it up from the PHASES roadmap structure.
    let phase = days[0] ? days[0].phaseTitle : '';
    if (!phase && typeof getPhaseForWeek === 'function') {
      const phaseInfo = getPhaseForWeek(state.currentWeek);
      phase = phaseInfo ? phaseInfo.title : '';
    }

    document.getElementById('week-title').textContent =
      `Week ${state.currentWeek}${phase ? ' — ' + phase : ''}`;

    const completedInWeek = days.filter(d => state.completed[d.id]).length;
    const pct = days.length ? Math.round((completedInWeek / days.length) * 100) : 0;
    document.getElementById('week-progress-bar').style.width = `${pct}%`;
    document.getElementById('week-progress-text').textContent =
      days.length ? `${completedInWeek} / ${days.length} days` : 'Not yet available';

    const listEl = document.getElementById('week-days-list');
    listEl.innerHTML = '';

    if (!days.length) {
      listEl.innerHTML = `
        <div class="empty-notes" style="padding:40px 20px;">
          📅 Content for Week ${state.currentWeek} hasn't been built yet.<br>
          Check back soon — keep progressing through your current week!
        </div>`;
      document.getElementById('week-project-card').classList.add('hidden');
      return;
    }

    const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

    days.forEach(day => {
      const isDone  = !!state.completed[day.id];
      const isToday = day.id === state.currentDayId;

      const item = document.createElement('div');
      item.className = `week-day-item ${isToday ? 'today' : ''} ${isDone ? 'completed' : ''}`;
      item.innerHTML = `
        <div class="day-check ${isDone ? 'done' : ''}">${isDone ? '✓' : ''}</div>
        <div class="day-item-info">
          <div class="day-item-label">${dayLabels[day.day - 1] || ''}${isToday ? ' · Today' : ''}</div>
          <div class="day-item-topic">${escapeHtml(day.topic)}</div>
        </div>
        ${day.type === 'project' ? '<div class="day-item-badge" style="background:rgba(245,158,11,.15);color:var(--orange);">PROJECT</div>' : ''}
      `;
      item.addEventListener('click', () => {
        setCurrentDayId(day.id);
        switchView('today');
      });
      listEl.appendChild(item);
    });

    // Friday project card
    const fridayDay = days.find(d => d.type === 'project');
    const projectCard = document.getElementById('week-project-card');
    if (fridayDay && fridayDay.projectBrief) {
      document.getElementById('week-project-title').textContent = fridayDay.topic;
      document.getElementById('week-project-brief-preview').textContent =
        fridayDay.projectBrief.trim().slice(0, 200) + '...';
      projectCard.classList.remove('hidden');

      document.getElementById('view-project-btn').onclick = () => {
        setCurrentDayId(fridayDay.id);
        switchView('today');
      };
    } else {
      projectCard.classList.add('hidden');
    }
  }

  function navigateWeek(delta) {
    const newWeek = state.currentWeek + delta;
    if (newWeek < 1 || newWeek > getTotalWeeks()) return;
    state.currentWeek = newWeek;
    renderWeek();
  }

  // ============================================================
  // RENDERING — ROADMAP VIEW
  // ============================================================

  function renderRoadmap() {
    const container = document.getElementById('phases-list');
    container.innerHTML = '';

    if (typeof PHASES === 'undefined') {
      container.innerHTML = '<p style="color:var(--text-muted)">Roadmap data loading...</p>';
      return;
    }

    PHASES.forEach(phase => {
      const phaseDays = state.allDays.filter(d => d.phase === phase.id);
      const completedInPhase = phaseDays.filter(d => state.completed[d.id]).length;
      const pct = phaseDays.length ? Math.round((completedInPhase / phaseDays.length) * 100) : 0;

      const block = document.createElement('div');
      block.className = 'phase-block';
      block.innerHTML = `
        <div class="phase-header" data-phase="${phase.id}">
          <div class="phase-num" style="background:${phase.color}22;border:2px solid ${phase.color}44;color:${phase.color}">
            ${pct === 100 ? '✓' : String(phase.id).padStart(2, '0')}
          </div>
          <div class="phase-info">
            <div class="phase-title-text">${escapeHtml(phase.title)}</div>
            <div class="phase-progress-wrap">
              <div class="progress-track"><div class="progress-fill" style="width:${pct}%;background:${phase.color}"></div></div>
              <span class="phase-pct" style="color:${phase.color}">${pct}%</span>
            </div>
          </div>
          <span class="phase-arrow">↓</span>
        </div>
        <div class="phase-weeks" id="phase-weeks-${phase.id}">
          ${(phase.weekTitles || []).map((wt, i) => {
            const weekNum = phase.weeks[0] + i;
            return `<div class="week-row" data-week="${weekNum}">
              <span class="week-row-num">W${weekNum}</span>
              <span class="week-row-topic">${escapeHtml(wt.replace(/^W\d+:\s*/, ''))}</span>
            </div>`;
          }).join('')}
        </div>
      `;
      container.appendChild(block);
    });

    // Wire up expand/collapse
    container.querySelectorAll('.phase-header').forEach(header => {
      header.addEventListener('click', () => {
        const phaseId = header.dataset.phase;
        const weeksEl = document.getElementById(`phase-weeks-${phaseId}`);
        const arrow = header.querySelector('.phase-arrow');
        weeksEl.classList.toggle('open');
        arrow.classList.toggle('open');
      });
    });

    // Wire up week row clicks
    container.querySelectorAll('.week-row').forEach(row => {
      row.addEventListener('click', (e) => {
        e.stopPropagation();
        const weekNum = parseInt(row.dataset.week);
        state.currentWeek = weekNum;
        switchView('week');
      });
    });
  }

  // ============================================================
  // RENDERING — NOTES VIEW
  // ============================================================

  async function renderNotes(query = '') {
    const container = document.getElementById('notes-list');
    container.innerHTML = '<p class="loading" style="color:var(--text-muted)">Loading notes...</p>';

    try {
      const notes = query ? await Notes.search(query) : await Notes.loadAll();

      if (!notes.length) {
        container.innerHTML = `<div class="empty-notes">
          ${query ? `No notes match "${escapeHtml(query)}"` : 'No notes yet. Start writing on any day!'}
        </div>`;
        return;
      }

      container.innerHTML = '';
      notes.forEach(note => {
        const item = document.createElement('div');
        item.className = 'note-archive-item';
        const dateStr = note.date ? new Date(note.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
        item.innerHTML = `
          <div class="note-item-date">${dateStr} · ${escapeHtml(note.dayId)}</div>
          <div class="note-item-topic">${escapeHtml(note.topic || '')}</div>
          <div class="note-item-preview">${escapeHtml(note.content || '')}</div>
        `;
        item.addEventListener('click', () => {
          setCurrentDayId(note.dayId);
          switchView('today');
        });
        container.appendChild(item);
      });
    } catch (err) {
      container.innerHTML = '<div class="empty-notes">Error loading notes.</div>';
    }
  }

  // ============================================================
  // RENDERING — PROGRESS VIEW
  // ============================================================

  function renderProgress() {
    const completedCount = Object.values(state.completed).filter(Boolean).length;
    const total = getTotalDays();
    const pct = Math.round((completedCount / total) * 100);
    const streak = calculateStreak();

    const projectsCompleted = state.allDays.filter(
      d => d.type === 'project' && state.completed[d.id]
    ).length;

    document.getElementById('stat-streak').textContent = streak;
    document.getElementById('stat-completed').textContent = completedCount;
    document.getElementById('stat-projects').textContent = projectsCompleted;
    document.getElementById('stat-percent').textContent = `${pct}%`;

    // Phase progress bars
    const phaseContainer = document.getElementById('phase-progress-list');
    phaseContainer.innerHTML = '';
    if (typeof PHASES !== 'undefined') {
      PHASES.forEach(phase => {
        const phaseDays = state.allDays.filter(d => d.phase === phase.id);
        const done = phaseDays.filter(d => state.completed[d.id]).length;
        const phasePct = phaseDays.length ? Math.round((done / phaseDays.length) * 100) : 0;

        const item = document.createElement('div');
        item.className = 'phase-progress-item';
        item.innerHTML = `
          <div class="phase-progress-label">
            <span class="phase-progress-name">${escapeHtml(phase.title)}</span>
            <span class="phase-progress-pct">${phasePct}%</span>
          </div>
          <div class="progress-track"><div class="progress-fill" style="width:${phasePct}%;background:${phase.color}"></div></div>
        `;
        phaseContainer.appendChild(item);
      });
    }

    // Completion calendar (simple grid of all loaded days)
    const calContainer = document.getElementById('completion-calendar');
    calContainer.innerHTML = '';
    state.allDays.forEach(day => {
      const cell = document.createElement('div');
      const isDone  = !!state.completed[day.id];
      const isToday = day.id === state.currentDayId;
      cell.className = `cal-cell ${isDone ? 'done' : ''} ${isToday ? 'today' : ''}`;
      cell.title = day.topic;
      calContainer.appendChild(cell);
    });

    // ETA estimate
    const etaEl = document.getElementById('eta-display');
    if (typeof ROADMAP_META !== 'undefined') {
      etaEl.innerHTML = `At 5 study days/week, you'll complete the roadmap by
        <strong>${new Date(ROADMAP_META.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>.<br>
        ${completedCount} of ${total} days complete (${pct}%).`;
    }
  }

  // ============================================================
  // VIEW SWITCHING
  // ============================================================

  function switchView(viewName) {
    state.activeView = viewName;

    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));

    const targetView = document.getElementById(`view-${viewName}`);
    if (targetView) {
      targetView.classList.remove('hidden');
      targetView.classList.add('active');
    }

    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === viewName);
    });

    // Render the appropriate view
    if (viewName === 'today')    renderToday();
    if (viewName === 'week')     renderWeek();
    if (viewName === 'roadmap')  renderRoadmap();
    if (viewName === 'notes')    renderNotes();
    if (viewName === 'progress') renderProgress();
  }

  // ============================================================
  // GITHUB PUSH HANDLERS
  // ============================================================

  async function handleGithubPush() {
    const day = findDay(state.currentDayId);
    if (!day) return;

    if (!GitHubSync.hasToken()) {
      document.getElementById('github-setup').classList.remove('hidden');
      return;
    }

    const notes = document.getElementById('day-notes').value;
    const btn = document.getElementById('github-push-btn');
    btn.textContent = '⏳';

    const result = day.type === 'project'
      ? await GitHubSync.pushProjectLog(day, notes)
      : await GitHubSync.pushDayLog(day, notes);

    btn.textContent = '⬆️';

    if (result.ok) {
      alert('✓ Pushed to GitHub successfully!');
    } else {
      alert(`Push failed: ${result.error}`);
    }
  }

  async function handleGithubSetup() {
    const tokenInput = document.getElementById('github-token-input');
    const token = tokenInput.value.trim();

    if (!token) return;

    const verification = await GitHubSync.verifyToken(token);
    if (!verification.valid) {
      alert(`Token verification failed: ${verification.error}`);
      return;
    }

    GitHubSync.saveToken(token);
    document.getElementById('github-setup').classList.add('hidden');
    alert(`✓ Connected as ${verification.username}`);
  }

  // ============================================================
  // INITIALISATION
  // ============================================================

  function wireEventListeners() {
    // Bottom nav
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', () => switchView(btn.dataset.view));
    });

    // Complete button
    document.getElementById('complete-btn').addEventListener('click', toggleDayComplete);

    // Notes
    document.getElementById('save-notes-btn').addEventListener('click', saveCurrentNotes);

    // Copy code button
    document.getElementById('copy-code-btn').addEventListener('click', () => {
      const code = document.getElementById('example-code').textContent;
      navigator.clipboard.writeText(code).then(() => {
        const btn = document.getElementById('copy-code-btn');
        btn.textContent = 'Copied ✓';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = 'Copy';
          btn.classList.remove('copied');
        }, 1500);
      });
    });

    // Week navigation
    document.getElementById('prev-week-btn').addEventListener('click', () => navigateWeek(-1));
    document.getElementById('next-week-btn').addEventListener('click', () => navigateWeek(1));

    // Notes search
    document.getElementById('notes-search').addEventListener('input', (e) => {
      renderNotes(e.target.value);
    });

    // GitHub push (topbar icon)
    document.getElementById('github-push-btn').addEventListener('click', handleGithubPush);

    // GitHub push (project block button)
    document.getElementById('push-project-btn').addEventListener('click', handleGithubPush);

    // GitHub setup overlay
    document.getElementById('save-github-btn').addEventListener('click', handleGithubSetup);
    document.getElementById('skip-github-btn').addEventListener('click', () => {
      document.getElementById('github-setup').classList.add('hidden');
    });

    // Notification permission overlay
    document.getElementById('allow-notif-btn').addEventListener('click', async () => {
      const granted = await Notifications.requestPermission();
      document.getElementById('notif-prompt').classList.add('hidden');
      if (granted) {
        const day = findDay(state.currentDayId);
        Notifications.scheduleDaily(() => findDay(state.currentDayId));
      }
      Notifications.updateToggleBtn();
    });
    document.getElementById('deny-notif-btn').addEventListener('click', () => {
      document.getElementById('notif-prompt').classList.add('hidden');
    });

    // Install overlay
    document.getElementById('enable-notifications-btn').addEventListener('click', () => {
      document.getElementById('install-overlay').classList.add('hidden');
      document.getElementById('notif-prompt').classList.remove('hidden');
    });
    document.getElementById('skip-install-btn').addEventListener('click', () => {
      document.getElementById('install-overlay').classList.add('hidden');
    });

    // Notification toggle button in Progress view
    document.getElementById('notif-toggle-btn').addEventListener('click', async () => {
      const status = Notifications.getPermissionStatus();
      if (status === 'default') {
        document.getElementById('notif-prompt').classList.remove('hidden');
      } else if (status === 'denied') {
        alert('Notifications are blocked. Please enable them in your browser settings.');
      }
    });
  }

  function showFirstLaunchOverlay() {
    const hasLaunchedBefore = localStorage.getItem('victoros_launched');
    if (!hasLaunchedBefore) {
      document.getElementById('install-overlay').classList.remove('hidden');
      localStorage.setItem('victoros_launched', '1');
    }
  }

  async function init() {
    state.allDays  = getAllDays();
    state.completed = loadCompleted();
    state.currentDayId = getCurrentDayId();

    const currentDay = findDay(state.currentDayId);
    state.currentWeek = currentDay ? currentDay.week : 1;

    wireEventListeners();

    document.getElementById('app').classList.remove('hidden');

    updateGlobalProgress();
    updateStreakDisplay();
    switchView('today');

    showFirstLaunchOverlay();

    // Initialise notifications with a LIVE getter so the notification
    // body always reflects whatever day is current, not boot-time state
    if (typeof Notifications !== 'undefined') {
      Notifications.init(() => findDay(state.currentDayId));
    }
  }

  // ─── Public API ───
  return { init, switchView };

})();

// ─── Boot the app once the DOM is ready ───
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
