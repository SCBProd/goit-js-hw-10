import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";


let usrSDate = null;
let timerId = null;

const input = document.getElementById("datetime-picker");
const btn = document.getElementById("btn");

const daysEl = document.querySelector("[data-days]");
const hoursEl = document.querySelector("[data-hours]");
const minutesEl = document.querySelector("[data-minutes]");
const secondsEl = document.querySelector("[data-seconds]");

btn.disabled = true;

/* ---------- flatpickr ---------- */

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    usrSDate = selectedDates[0];

    if (usrSDate <= new Date()) {
      
      iziToast.show({
    title: 'STOP',
        message: 'Please choose a date in the future',
        theme: 'dark'
        
});
      btn.disabled = true;
    } else {
      btn.disabled = false;
    }
  },
};

flatpickr("#datetime-picker", options);

/* ---------- Start button ---------- */

btn.addEventListener("click", () => {
  btn.disabled = true;
  input.disabled = true;

  timerId = setInterval(() => {
    const currentTime = new Date();
    const diff = usrSDate - currentTime;

    if (diff <= 0) {
      clearInterval(timerId);
      updateTimer(convertMs(0));

      input.disabled = false;
      btn.disabled = true;
      return;
    }

    updateTimer(convertMs(diff));
  }, 1000);
});

/* ---------- helpers ---------- */

function updateTimer({ days, hours, minutes, seconds }) {
  daysEl.textContent = days;
  hoursEl.textContent = addLeadingZero(hours);
  minutesEl.textContent = addLeadingZero(minutes);
  secondsEl.textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
  return String(value).padStart(2, "0");
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
