let audioPlayers = document.querySelectorAll(".audio-player");
let currentIndex = 0; // To keep track of the current audio index

audioPlayers.forEach((player, index) => {
  let audio = player.querySelector(".audio-element");
  let playPauseButton = player.querySelector(".play-pause-button");
  let progress = player.querySelector(".progress");
  let progressBar = player.querySelector(".progress-bar");
  // Create or select a tooltip element to display the time
  let timeTooltip = player.querySelector(".time-tooltip") || document.createElement("span");
  timeTooltip.classList.add("time-tooltip");
  progressBar.appendChild(timeTooltip); // Append the tooltip to the progress bar

  playPauseButton.addEventListener("click", function () {
    if (audio.paused) {
      // pause all other audios and reset buttons to "Play"
      document.querySelectorAll(".audio-element").forEach((el) => {
        el.pause();
        if (el !== audio) {
          el
            .closest(".audio-player")
            .querySelector(".play-pause-button").textContent = "⏵︎";
        }
      });

      audio.play();
      playPauseButton.textContent = "⏸︎";
    } else {
      audio.pause();
      playPauseButton.textContent = "⏵︎";
    }
  });

  audio.addEventListener("timeupdate", function () {
    let position = audio.currentTime / audio.duration;
    progress.style.width = position * 100 + "%";
  });

  audio.addEventListener("ended", function () {
    audio.currentTime = 0;
    audio.pause();
    let playPauseButton = audio
      .closest(".audio-player")
      .querySelector(".play-pause-button");
    // Move to next audio after one finishes
    let nextIndex = index + 1;
    playAudioByIndex(nextIndex);
    playPauseButton.textContent = "⏵︎";
  });

  // Add mousemove event listener to show time tooltip on hover
  progressBar.addEventListener("mousemove", function (e) {
    let rect = this.getBoundingClientRect();
    let hoverPosition = (e.clientX - rect.left) / rect.width;
    let hoverTime = hoverPosition * audio.duration;
    let minutes = Math.floor(hoverTime / 60);
    let seconds = Math.floor(hoverTime % 60);
    seconds = seconds < 10 ? '0' + seconds : seconds; // Format seconds to always be two digits
    timeTooltip.textContent = `${minutes}:${seconds}`; // Set the formatted time
    timeTooltip.style.left = `${e.clientX - rect.left}px`; // Adjust the tooltip position horizontally
    // No change needed to the style.left calculation here since it's about vertical positioning
    timeTooltip.style.display = 'block'; // Make sure the tooltip is visible
  });

  // Hide the tooltip when not hovering over the progress bar
  progressBar.addEventListener("mouseleave", function () {
    timeTooltip.style.display = 'none';
  });

  progressBar.addEventListener("click", function (e) {
    let rect = this.getBoundingClientRect();
    let clickPosition = (e.clientX - rect.left) / rect.width;
    audio.currentTime = clickPosition * audio.duration;
  });
});

function playAudioByIndex(index) {
  if (index >= audioPlayers.length) {
    currentIndex = 0; // Reset or stop when all audios have been played
    return;
  }

  let player = audioPlayers[index];
  let audio = player.querySelector(".audio-element");
  let playPauseButton = player.querySelector(".play-pause-button");

  // Pause currently playing audio, if any
  document.querySelectorAll(".audio-element").forEach((el) => {
    el.pause();
    el.closest(".audio-player").querySelector(".play-pause-button").textContent =
      "⏵︎";
  });

  // Play the selected audio
  audio.play();
  playPauseButton.textContent = "⏸︎";
  currentIndex = index; // Update the current index
}
