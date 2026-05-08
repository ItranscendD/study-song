document.addEventListener('DOMContentLoaded', () => {

  // Generate waveform bars
  const waveform = document.getElementById('waveform');
  const numBars = 30;
  for (let i = 0; i < numBars; i++) {
    const bar = document.createElement('div');
    bar.className = 'bar';
    
    // Random height and animation delay to look natural
    const height = Math.random() * 40 + 10;
    const delay = Math.random() * 1;
    const duration = Math.random() * 0.5 + 0.5;
    
    // Set custom properties for animation
    bar.style.animationDelay = `${delay}s`;
    bar.style.animationDuration = `${duration}s`;
    
    waveform.appendChild(bar);
  }

  // Play/Pause toggle
  const playBtn = document.getElementById('playBtn');
  const iconPlay = playBtn.querySelector('.icon-play');
  const iconPause = playBtn.querySelector('.icon-pause');
  let isPlaying = true;
  
  // Start playing initially
  waveform.classList.add('playing');

  playBtn.addEventListener('click', () => {
    isPlaying = !isPlaying;
    if (isPlaying) {
      iconPlay.style.display = 'none';
      iconPause.style.display = 'block';
      waveform.classList.add('playing');
    } else {
      iconPlay.style.display = 'block';
      iconPause.style.display = 'none';
      waveform.classList.remove('playing');
    }
  });

  // Speed toggle
  const speedBtn = document.getElementById('speedBtn');
  const speeds = ['1x', '1.5x', '0.75x'];
  let currentSpeedIdx = 0;
  
  speedBtn.addEventListener('click', () => {
    currentSpeedIdx = (currentSpeedIdx + 1) % speeds.length;
    speedBtn.textContent = speeds[currentSpeedIdx];
  });

  // Simulate Lyrics Progression
  const lyricLines = document.querySelectorAll('.lyric-line');
  const lyricsContainer = document.getElementById('lyricsContainer');
  let currentLineIdx = 1; // start with 2nd line active

  // Function to advance lyrics
  const advanceLyrics = () => {
    if (!isPlaying) return;

    // Mark previous as played
    lyricLines[currentLineIdx].classList.remove('active');
    lyricLines[currentLineIdx].classList.add('played');

    // Move to next
    currentLineIdx++;
    if (currentLineIdx >= lyricLines.length) {
      currentLineIdx = 0; // Loop for demo
      lyricLines.forEach(l => l.classList.remove('played'));
    }

    // Activate new line
    const currentLine = lyricLines[currentLineIdx];
    currentLine.classList.add('active');

    // Smooth scroll the container so the active line is centered
    currentLine.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  // Run lyric progression every 3 seconds
  setInterval(advanceLyrics, 3000);
});
