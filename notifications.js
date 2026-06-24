// ============================================================
// notifications.js — VictorOS Notification System
// - Registers service worker
// - One-time permission prompt
// - Daily alert at user-chosen time (saved to localStorage)
// - Reschedules automatically every day
// ============================================================

const Notifications = (() => {

  const STORAGE_KEY_HOUR    = 'victoros_notif_hour';
  const STORAGE_KEY_GRANTED = 'victoros_notif_granted';
  const STORAGE_KEY_LAST_SHOWN = 'victoros_notif_last_shown';
  const DEFAULT_HOUR        = 7; // 7:00 AM

  // ─── Register service worker ───
  async function registerSW() {
    if (!('serviceWorker' in navigator)) {
      console.warn('Service workers not supported.');
      return null;
    }
    try {
      const reg = await navigator.serviceWorker.register('/sw.js');
      console.log('SW registered:', reg.scope);
      return reg;
    } catch (err) {
      console.error('SW registration failed:', err);
      return null;
    }
  }

  // ─── Get saved notification hour ───
  function getSavedHour() {
    const saved = localStorage.getItem(STORAGE_KEY_HOUR);
    return saved !== null ? parseInt(saved) : DEFAULT_HOUR;
  }

  // ─── Save notification hour ───
  function saveHour(hour) {
    localStorage.setItem(STORAGE_KEY_HOUR, hour);
  }

  // ─── Check current permission status ───
  function getPermissionStatus() {
    if (!('Notification' in window)) return 'unsupported';
    return Notification.permission; // 'default' | 'granted' | 'denied'
  }

  // ─── Request permission (one-time) ───
  async function requestPermission() {
    if (!('Notification' in window)) return false;
    if (Notification.permission === 'granted') return true;
    if (Notification.permission === 'denied') return false;

    const result = await Notification.requestPermission();
    const granted = result === 'granted';
    localStorage.setItem(STORAGE_KEY_GRANTED, granted ? '1' : '0');
    return granted;
  }

  // ─── Calculate ms until next occurrence of hour:00 ───
  function msUntilHour(hour) {
    const now   = new Date();
    const next  = new Date();
    next.setHours(hour, 0, 0, 0);

    // If that time already passed today, schedule for tomorrow
    if (next <= now) next.setDate(next.getDate() + 1);

    return next.getTime() - now.getTime();
  }

  // ─── Skip weekends (Sat=6, Sun=0) ───
  function isTodayWeekend() {
    const day = new Date().getDay();
    return day === 0 || day === 6;
  }

  // ─── YYYY-MM-DD for "have we already shown today's reminder?" checks ───
  function todayDateString() {
    return new Date().toISOString().slice(0, 10);
  }

  // ─── Build notification body from today's roadmap day ───
  function buildNotifBody(dayData) {
    if (!dayData) return "Today's lesson is waiting. Keep the streak alive! 🔥";
    const emoji = dayData.type === 'project' ? '🛠️' : '📚';
    return `${emoji} ${dayData.topic} — Week ${dayData.week}, Day ${dayData.day}`;
  }

  // ─── Fire a local notification via the SW ───
  // dayDataSource can be a static object OR a function that
  // returns the current day fresh at call-time (preferred,
  // so the notification never goes stale as the user progresses).
  async function fireNotification(dayDataSource) {
    if (isTodayWeekend()) return; // no weekend alerts
    if (Notification.permission !== 'granted') return;

    const dayData = typeof dayDataSource === 'function' ? dayDataSource() : dayDataSource;

    const reg = await navigator.serviceWorker.ready;
    reg.showNotification('VictorOS — Study Time 🔥', {
      body: buildNotifBody(dayData),
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      tag: 'victoros-daily',
      renotify: true,
      vibrate: [200, 100, 200],
      data: { url: '/?view=today' },
      actions: [
        { action: 'open',    title: '📖 Open App' },
        { action: 'dismiss', title: 'Later'        }
      ]
    });
    localStorage.setItem(STORAGE_KEY_LAST_SHOWN, todayDateString());
  }

  // ─── Schedule the next daily notification ───
  // Uses setTimeout — reschedules itself each day.
  // Accepts the same static-or-function dayDataSource as fireNotification.
  let _scheduledTimer = null;
  let _dayDataSource   = null;

  function scheduleDaily(dayDataSource) {
    if (_scheduledTimer) clearTimeout(_scheduledTimer);
    _dayDataSource = dayDataSource; // remember for updateHour() calls

    const hour  = getSavedHour();
    const delay = msUntilHour(hour);
    const hhmm  = `${String(hour).padStart(2,'0')}:00`;

    console.log(`Next notification scheduled at ${hhmm} (in ${Math.round(delay/60000)} mins)`);

    _scheduledTimer = setTimeout(async () => {
      await fireNotification(_dayDataSource);
      scheduleDaily(_dayDataSource); // reschedule for next day, same source
    }, delay);
  }

  // ─── Update notification time (called from settings UI) ───
  function updateHour(newHour, dayData) {
    saveHour(newHour);
    scheduleDaily(dayData); // reschedule immediately with new time
    console.log(`Notification time updated to ${newHour}:00`);
  }

  // ─── Send a test notification immediately ───
  async function sendTest() {
    if (Notification.permission !== 'granted') {
      alert('Please allow notifications first.');
      return;
    }
    const reg = await navigator.serviceWorker.ready;
    reg.showNotification('VictorOS — Test 🔔', {
      body: 'Notifications are working! You\'ll be reminded daily.',
      icon: '/icons/icon-192.png',
      tag: 'victoros-test',
      vibrate: [200, 100, 200],
    });
  }

  // ─── Catch-up check: did today's reminder already fire? ───
  // setTimeout-based scheduling does NOT survive the PWA being
  // closed or the phone being locked for hours — mobile browsers
  // suspend JS timers in that state. This is the practical mitigation:
  // every time the app actually opens, check whether today's reminder
  // time has already passed and hasn't fired yet, and if so, fire it
  // immediately instead of silently never showing it.
  async function catchUpIfMissed(dayDataSource) {
    if (isTodayWeekend()) return;
    if (Notification.permission !== 'granted') return;

    const lastShown = localStorage.getItem(STORAGE_KEY_LAST_SHOWN);
    const today = todayDateString();
    if (lastShown === today) return; // already shown today, nothing to do

    const hour = getSavedHour();
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hour, 0, 0, 0);

    if (now >= scheduledTime) {
      await fireNotification(dayDataSource);
    }
  }

  // ─── Full init: register SW + prompt + schedule ───
  async function init(dayData) {
    await registerSW();

    const status = getPermissionStatus();

    if (status === 'granted') {
      await catchUpIfMissed(dayData);
      scheduleDaily(dayData);
    }
    // Prompt is shown by app.js on first launch
    // (controlled by #notif-prompt overlay)

    // Sync select UI element if present
    const sel = document.getElementById('notif-time-select');
    if (sel) {
      sel.value = getSavedHour();
      sel.addEventListener('change', () => {
        updateHour(parseInt(sel.value), dayData);
      });
    }

    updateToggleBtn();
  }

  // ─── Update the toggle button in settings ───
  function updateToggleBtn() {
    const btn    = document.getElementById('notif-toggle-btn');
    const status = document.getElementById('notif-status');
    if (!btn || !status) return;

    const perm = getPermissionStatus();
    if (perm === 'granted') {
      status.textContent = 'On';
      btn.classList.add('active');
    } else if (perm === 'denied') {
      status.textContent = 'Blocked';
      btn.classList.remove('active');
    } else {
      status.textContent = 'Off';
      btn.classList.remove('active');
    }
  }

  // ─── Public API ───
  return {
    init,
    requestPermission,
    scheduleDaily,
    updateHour,
    sendTest,
    getSavedHour,
    getPermissionStatus,
    updateToggleBtn,
    catchUpIfMissed,
  };

})();
