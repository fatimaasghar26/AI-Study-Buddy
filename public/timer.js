var start = document.getElementById("start");
var pause = document.getElementById("pause");
var reset = document.getElementById("reset");
var timeDisplay = document.getElementById("timeDisplay");
var bar = document.getElementById("progressBar");
var phaseLabel = document.getElementById("phaseLabel");
var sessionInfo = document.getElementById("sessionInfo");
var sessionLog = document.getElementById("sessionLog");

var timer = null;
var timeLeft = 0;
var total = 0;
var session = 1;
var maxSessions = 4;
var isWork = true;
var mode = "custom";
var focusTime = 25;

function setMode(m, btn) {
  mode = m;

  var allBtns = document.querySelectorAll(".mode-btn");
  for (var i = 0; i < allBtns.length; i++) {
    allBtns[i].classList.remove("active");
  }
  btn.classList.add("active");

  var pomSection = document.getElementById("pomodoroInfo");
  var customSection = document.getElementById("customInputs");
  if (mode == "pomodoro") {
    pomSection.style.display = "block";
    if (customSection) customSection.style.display = "none";
  } else {
    pomSection.style.display = "none";
    if (customSection) customSection.style.display = "block";
  }

  resetTimer();
}

function getSettings() {
  var work = 25;
  var brk = 5;

  if (mode == "pomodoro") {
    work = parseInt(document.getElementById("pomWork").value);
    brk = parseInt(document.getElementById("pomBreak").value);
    maxSessions = parseInt(document.getElementById("pomSessions").value);
    if (!work) work = 25;
    if (!brk) brk = 5;
    if (!maxSessions) maxSessions = 4;
  } else {
    var customInput = document.getElementById("focusMinutes");
    work = customInput ? parseInt(customInput.value) : focusTime;
    if (!work) work = focusTime;
  }

  return { work: work, brk: brk };
}

function updateDisplay() {
  var mins = Math.floor(timeLeft / 60);
  var secs = timeLeft % 60;

  if (secs < 10) {
    timeDisplay.innerHTML = mins + ":0" + secs;
  } else {
    timeDisplay.innerHTML = mins + ":" + secs;
  }

  var percent = 0;
  if (total > 0) {
    percent = ((total - timeLeft) / total) * 100;
  }
  bar.style.width = percent + "%";

  if (mode == "pomodoro") {
    phaseLabel.innerHTML = isWork ? "Focus" : "Break";
    sessionInfo.innerHTML = "Session " + session + " of " + maxSessions;
  } else {
    phaseLabel.innerHTML = "Focus";
    sessionInfo.innerHTML = "";
  }
}

function loadPhase() {
  var s = getSettings();

  if (mode == "pomodoro") {
    total = isWork ? s.work * 60 : s.brk * 60;
  } else {
    total = s.work * 60;
  }

  timeLeft = total;
  updateDisplay();
}

function addLog(msg) {
  var div = document.createElement("div");
  div.className = "log-entry";

  var now = new Date();
  var hrs = now.getHours();
  var mins = now.getMinutes();
  var ampm = hrs >= 12 ? "PM" : "AM";
  if (hrs > 12) hrs = hrs - 12;
  if (hrs == 0) hrs = 12;
  if (mins < 10) mins = "0" + mins;

  div.innerHTML = "<span class='log-time'>" + hrs + ":" + mins + " " + ampm + "</span> " + msg;
  sessionLog.prepend(div);
}

function nextPhase() {
  if (isWork) {
    addLog("Work session " + session + " completed ✓");
    if (session >= maxSessions) {
      addLog("All " + maxSessions + " sessions done! 🎉");
      resetTimer();
      return;
    }
    isWork = false;
  } else {
    addLog("Break " + session + " done.");
    session++;
    isWork = true;
  }

  loadPhase();
  startTimer();
}

function startTimer() {
  if (timer != null) return;
  if (timeLeft == 0) loadPhase();

  timer = setInterval(function () {
    timeLeft--;
    updateDisplay();

    if (timeLeft <= 0) {
      clearInterval(timer);
      timer = null;
      bar.style.width = "100%";

      if (mode == "pomodoro") {
        nextPhase();
      } else {
        addLog("Focus session completed ✓");
        resetTimer();
      }
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
  timer = null;
}

function resetTimer() {
  clearInterval(timer);
  timer = null;
  session = 1;
  isWork = true;
  timeLeft = 0;
  bar.style.width = "0%";
  loadPhase();
}

var focusMinutesInput = document.getElementById("focusMinutes");
if (focusMinutesInput) {
  focusMinutesInput.addEventListener("change", function () {
    if (mode == "custom" && timer == null) {
      loadPhase();
    }
  });
}

start.addEventListener("click", startTimer);
pause.addEventListener("click", stopTimer);
reset.addEventListener("click", resetTimer);

loadPhase();
