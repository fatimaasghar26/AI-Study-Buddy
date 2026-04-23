/* timer */
let mode = 'custom';
let timerInterval = null;
let totalSeconds = 0;
let remainingSeconds = 0;
let isRunning = false;
let pomPhase = 'work';
let pomSessionsDone = 0;
let pomTotalSessions = 4;
let sessionLogs = [];

function setMode(m, btn) {
  mode = m;
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('customInputs').style.display = m === 'custom' ? 'block' : 'none';
  document.getElementById('pomodoroInfo').style.display = m === 'pomodoro' ? 'block' : 'none';
  resetTimer();
}

function getCustomSeconds() {
  const m = parseInt(document.getElementById('customMinutes').value) || 0;
  const s = parseInt(document.getElementById('customSeconds').value) || 0;
  return m * 60 + s;
}

function getPomWorkSeconds() {
  return (parseInt(document.getElementById('pomWork').value) || 25) * 60;
}

function getPomBreakSeconds() {
  return (parseInt(document.getElementById('pomBreak').value) || 5) * 60;
}

function startTimer() {
  if (isRunning) return;

  if (remainingSeconds === 0 || remainingSeconds === totalSeconds && totalSeconds === 0) {
    if (mode === 'custom') {
      totalSeconds = getCustomSeconds();
      if (totalSeconds <= 0) { alert('Set a valid time.'); return; }
      remainingSeconds = totalSeconds;
      pomPhase = 'work';
    } else {
      pomTotalSessions = parseInt(document.getElementById('pomSessions').value) || 4;
      pomPhase = 'work';
      pomSessionsDone = 0;
      totalSeconds = getPomWorkSeconds();
      remainingSeconds = totalSeconds;
    }
  }

  isRunning = true;
  updateDisplay();

  timerInterval = setInterval(() => {
    remainingSeconds--;
    updateDisplay();

    if (remainingSeconds <= 0) {
      clearInterval(timerInterval);
      isRunning = false;
      handlePhaseEnd();
    }
  }, 1000);
}

function handlePhaseEnd() {
  if (mode === 'custom') {
    logSession('Custom session complete');
    alert('Time is up!');
    return;
  }

  if (pomPhase === 'work') {
    pomSessionsDone++;
    logSession(`Work session ${pomSessionsDone} complete`);
    if (pomSessionsDone >= pomTotalSessions) {
      alert('All sessions complete! Great work!');
      resetTimer();
      return;
    }
    pomPhase = 'break';
    totalSeconds = getPomBreakSeconds();
    remainingSeconds = totalSeconds;
    alert('Work done! Starting break...');
  } else {
    pomPhase = 'work';
    totalSeconds = getPomWorkSeconds();
    remainingSeconds = totalSeconds;
    alert('Break over! Back to work...');
  }

  updateDisplay();
  startTimer();
}

function pauseTimer() {
  clearInterval(timerInterval);
  isRunning = false;
}

function resetTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  remainingSeconds = 0;
  totalSeconds = 0;
  pomPhase = 'work';
  pomSessionsDone = 0;

  document.getElementById('timeDisplay').textContent = mode === 'pomodoro'
    ? formatTime((parseInt(document.getElementById('pomWork').value) || 25) * 60)
    : formatTime(getCustomSeconds());

  document.getElementById('phaseLabel').textContent = 'Focus';
  document.getElementById('sessionInfo').textContent = '';
  document.getElementById('progressBar').style.width = '0%';
}

function updateDisplay() {
  document.getElementById('timeDisplay').textContent = formatTime(remainingSeconds);
  document.getElementById('phaseLabel').textContent = pomPhase === 'break' ? 'Break' : 'Focus';

  if (mode === 'pomodoro') {
    document.getElementById('sessionInfo').textContent =
      `Session ${pomSessionsDone + 1} of ${pomTotalSessions}`;
  }

  const pct = totalSeconds > 0 ? ((totalSeconds - remainingSeconds) / totalSeconds) * 100 : 0;
  document.getElementById('progressBar').style.width = pct + '%';
}

function logSession(msg) {
  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  sessionLogs.unshift(`${time} — ${msg}`);
  const log = document.getElementById('sessionLog');
  log.innerHTML = sessionLogs.map(l => `<p class="log-entry">${l}</p>`).join('');
}

function formatTime(secs) {
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}