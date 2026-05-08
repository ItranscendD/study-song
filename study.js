document.addEventListener('DOMContentLoaded', () => {

  const lyricsData = [
    {
      lyric: "Chloroplasts working like machines",
      concept: "Generates chemical energy for biochemical reactions."
    },
    {
      lyric: "Water and CO2 combine",
      concept: "Photosynthesis requires water, carbon dioxide, and sunlight."
    },
    {
      lyric: "Making glucose, feeling fine",
      concept: "The process creates glucose (sugar) which is used as food for the plant."
    },
    {
      lyric: "ATP is the currency we spend",
      concept: "Energy is stored as Adenosine Triphosphate (ATP)."
    }
  ];

  let currentIndex = 0;
  let isPlaying = true;
  const TIME_PER_LINE = 5000; // 5 seconds per line
  let startTime = Date.now();
  let timerInterval;

  const currentLyricEl = document.getElementById('currentLyric');
  const originalConceptEl = document.getElementById('originalConcept');
  const lyricCard = document.getElementById('lyricCard');
  const timerProgress = document.getElementById('timerProgress');
  
  const playPauseBtn = document.getElementById('playPauseBtn');
  const iconPlay = document.getElementById('iconPlay');
  const iconPause = document.getElementById('iconPause');
  
  const tapArea = document.getElementById('tapArea');

  const updateContent = () => {
    // Retrigger animation
    lyricCard.style.animation = 'none';
    lyricCard.offsetHeight; // trigger reflow
    lyricCard.style.animation = 'fadeIn 0.4s ease-out';

    currentLyricEl.textContent = lyricsData[currentIndex].lyric;
    originalConceptEl.textContent = lyricsData[currentIndex].concept;
    
    startTime = Date.now();
    updateTimer();
  };

  const advance = () => {
    currentIndex = (currentIndex + 1) % lyricsData.length;
    updateContent();
  };

  const updateTimer = () => {
    if (!isPlaying) return;
    
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / TIME_PER_LINE, 1);
    
    // Circle circumference is 283
    const offset = 283 - (progress * 283);
    timerProgress.style.strokeDashoffset = offset;

    if (progress >= 1) {
      advance();
    }
  };

  // Run timer loop
  timerInterval = setInterval(updateTimer, 50);

  // Tap anywhere to advance manually
  tapArea.addEventListener('click', () => {
    advance();
  });

  // Play/pause toggle
  playPauseBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent advancing
    isPlaying = !isPlaying;
    
    if (isPlaying) {
      iconPlay.style.display = 'none';
      iconPause.style.display = 'block';
      startTime = Date.now() - ((283 - parseFloat(timerProgress.style.strokeDashoffset)) / 283 * TIME_PER_LINE);
    } else {
      iconPlay.style.display = 'block';
      iconPause.style.display = 'none';
    }
  });

  // Toggle buttons
  const toggleBtns = document.querySelectorAll('.toggle-btn');
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent advancing
      btn.classList.toggle('active');
    });
  });

});
