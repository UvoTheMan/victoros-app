// ============================================================
// github.js — VictorOS GitHub Integration
// Pushes project logs and notes to UvoTheMan/ds-ai-roadmap-progress
// Token stored locally only — never leaves this device
// ============================================================

const GitHubSync = (() => {

  const STORAGE_KEY_TOKEN = 'victoros_github_token';
  const DEFAULT_REPO      = 'UvoTheMan/ds-ai-roadmap-progress';
  const API_BASE          = 'https://api.github.com';

  // ─── Token management (stored in localStorage, this device only) ───
  function saveToken(token) {
    if (!token || !token.trim()) return false;
    localStorage.setItem(STORAGE_KEY_TOKEN, token.trim());
    return true;
  }

  function getToken() {
    return localStorage.getItem(STORAGE_KEY_TOKEN);
  }

  function hasToken() {
    return !!getToken();
  }

  function clearToken() {
    localStorage.removeItem(STORAGE_KEY_TOKEN);
  }

  // ─── Verify token works before saving permanently ───
  async function verifyToken(token) {
    try {
      const res = await fetch(`${API_BASE}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });
      if (!res.ok) return { valid: false, error: `Status ${res.status}` };
      const user = await res.json();
      return { valid: true, username: user.login };
    } catch (err) {
      return { valid: false, error: err.message };
    }
  }

  // ─── Check if the target repo exists; create it if not ───
  async function ensureRepoExists(repo = DEFAULT_REPO) {
    const token = getToken();
    if (!token) return { ok: false, error: 'No token saved' };

    const [owner, name] = repo.split('/');
    const checkUrl = `${API_BASE}/repos/${repo}`;

    const checkRes = await fetch(checkUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (checkRes.ok) return { ok: true, created: false };

    if (checkRes.status === 404) {
      // Create the repo
      const createRes = await fetch(`${API_BASE}/user/repos`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description: "Victor's Data Science & AI Roadmap — progress logs",
          private: false,
          auto_init: true, // creates an initial commit so we can push to it
        }),
      });

      if (createRes.ok) return { ok: true, created: true };
      const err = await createRes.json();
      return { ok: false, error: err.message || 'Failed to create repo' };
    }

    return { ok: false, error: `Unexpected status ${checkRes.status}` };
  }

  // ─── Get the current SHA of a file (needed to update existing files) ───
  async function getFileSha(repo, path) {
    const token = getToken();
    const url = `${API_BASE}/repos/${repo}/contents/${path}`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (res.status === 200) {
      const data = await res.json();
      return data.sha;
    }
    return null; // file doesn't exist yet
  }

  // ─── Core push function: creates or updates a file in the repo ───
  async function pushFile(path, content, commitMessage, repo = DEFAULT_REPO) {
    const token = getToken();
    if (!token) {
      return { ok: false, error: 'No GitHub token saved. Please connect GitHub first.' };
    }

    try {
      // Make sure the repo exists first
      const repoCheck = await ensureRepoExists(repo);
      if (!repoCheck.ok) {
        return { ok: false, error: `Repo error: ${repoCheck.error}` };
      }

      const sha = await getFileSha(repo, path);
      const encodedContent = btoa(unescape(encodeURIComponent(content)));

      const url = `${API_BASE}/repos/${repo}/contents/${path}`;
      const body = {
        message: commitMessage || `Update ${path}`,
        content: encodedContent,
      };
      if (sha) body.sha = sha; // required when updating an existing file

      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const data = await res.json();
        return {
          ok: true,
          url: data.content?.html_url,
          sha: data.content?.sha,
        };
      } else {
        const err = await res.json();
        return { ok: false, error: err.message || `Status ${res.status}` };
      }
    } catch (err) {
      return { ok: false, error: err.message };
    }
  }

  // ─── Format a day's notes + metadata as a Markdown log entry ───
  function formatDayLog(dayData, notesContent) {
    const date  = dayData.date || new Date().toISOString().split('T')[0];
    const type  = dayData.type === 'project' ? '🛠️ Project' : '📚 Lesson';

    return `# ${dayData.topic}

**Date:** ${date}
**Week:** ${dayData.week} · **Day:** ${dayData.day}
**Type:** ${type}
**Phase:** ${dayData.phaseTitle || 'Phase 1'}

---

## Notes

${notesContent || '_No notes recorded for this day._'}

---

*Logged automatically by VictorOS*
`;
  }

  // ─── Format a Friday project as its own log file ───
  function formatProjectLog(dayData, notesContent) {
    const date = dayData.date || new Date().toISOString().split('T')[0];

    return `# 🛠️ Project: ${dayData.topic}

**Date completed:** ${date}
**Week:** ${dayData.week}
**Phase:** ${dayData.phaseTitle || 'Phase 1'}

---

## Project Brief

${dayData.projectBrief || '_No brief recorded._'}

---

## My Notes & Reflections

${notesContent || '_No notes recorded for this project._'}

---

*Logged automatically by VictorOS*
`;
  }

  // ─── Push a single day's notes to GitHub ───
  async function pushDayLog(dayData, notesContent) {
    const weekPadded = String(dayData.week).padStart(2, '0');
    const path = `progress/week${weekPadded}/${dayData.id}.md`;
    const content = formatDayLog(dayData, notesContent);
    const message = `Day ${dayData.day} (Week ${dayData.week}): ${dayData.topic}`;

    return await pushFile(path, content, message);
  }

  // ─── Push a Friday project log to GitHub ───
  async function pushProjectLog(dayData, notesContent) {
    const weekPadded = String(dayData.week).padStart(2, '0');
    const path = `progress/week${weekPadded}/PROJECT.md`;
    const content = formatProjectLog(dayData, notesContent);
    const message = `Week ${dayData.week} Project: ${dayData.topic}`;

    return await pushFile(path, content, message);
  }

  // ─── Update the main README with overall progress stats ───
  async function updateProgressReadme(stats) {
    const content = `# 📚 Data Science & AI Roadmap — Progress Log

**Victor Ugonna Okolie** · Pharm.D → Data Scientist & AI Engineer

---

## Current Progress

- **Days completed:** ${stats.completedDays} / ${stats.totalDays}
- **Current streak:** ${stats.streak} days 🔥
- **Current phase:** ${stats.currentPhase}
- **Completion:** ${stats.percentComplete}%

---

## About This Repo

This repository is automatically updated by **VictorOS**, a personal
PWA roadmap tracker built to guide a 16-month journey from
pharmacy practice into data engineering, data science, and AI.

Each folder under \`progress/\` contains daily notes and weekly
project logs, organised by week number.

---

*Last updated: ${new Date().toISOString().split('T')[0]}*
`;
    return await pushFile('README.md', content, 'Update progress README');
  }

  // ─── Public API ───
  return {
    saveToken,
    getToken,
    hasToken,
    clearToken,
    verifyToken,
    ensureRepoExists,
    pushFile,
    pushDayLog,
    pushProjectLog,
    updateProgressReadme,
    DEFAULT_REPO,
  };

})();
