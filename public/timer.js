const start = document.getElementById("start");
const pause = document.getElementById("pause");
const reset = document.getElementById("reset");
const timerDisplay = document.getElementById("timeDisplay");
const progressBar = document.getElementById("progressBar");

var totalTime = 1500;
var timeleft = 1500;
var interval = null;

function updateDisplay() {
  var minutes = Math.floor(timeleft / 60);
  var seconds = timeleft % 60;
  timerDisplay.innerHTML = minutes.toString().padStart(2, '0') + ":" + seconds.toString().padStart(2, '0');
  var percent = ((totalTime - timeleft) / totalTime) * 100;
  progressBar.style.width = percent + "%";
}

const startTimer = () => {
  if (interval !== null) return;
  running=true;

  interval = setInterval(() => {
    timeleft--;
    updateDisplay();
    if (timeleft <= 0) {
      clearInterval(interval);
      interval = null;
      progressBar.style.width = "100%";
      alert("Time's up!");
    }
  }, 1000);
};

const stopTimer = () => {
  clearInterval(interval);
  interval = null;   
};

const resetTimer = () => {
  clearInterval(interval);
  interval = null;
  timeleft = 1500;
  progressBar.style.width = "0%"; 
  updateDisplay();
};

start.addEventListener("click", startTimer);
pause.addEventListener("click", stopTimer);
reset.addEventListener("click", resetTimer);

updateDisplay(); 
