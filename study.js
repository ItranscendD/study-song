import { getSong, getSongs } from './db.js';

document.addEventListener('DOMContentLoaded', () => {

  // Load the active song details
  const activeId = localStorage.getItem('studysong_active_player_song_id');
  let currentSong = null;
  if (activeId) {
    currentSong = getSong(activeId);
  }
  if (!currentSong) {
    const songs = getSongs();
    currentSong = songs[0] || {
      id: 'mitochondria_bop',
      name: 'Mitochondria Bop',
      subject: 'Biology',
      genre: 'Afrobeats',
      era: '2020s',
      mood: 'Catchy',
      bg: '#1a1228',
      duration: '2:08',
      lyrics: ["Sunlight hitting the leaves", "Chloroplasts working like machines", "Water and CO2 combine", "Making glucose, feeling fine"],
      concepts: ["Photosynthesis requires water, carbon dioxide, and sunlight."]
    };
  }

  // Populate Song Title
  const songTitleEl = document.querySelector('.study-header .song-title');
  if (songTitleEl) {
    songTitleEl.textContent = currentSong.name;
  }

  // Set Background Color
  const appContainer = document.getElementById('tapArea');
  if (appContainer && currentSong.bg) {
    appContainer.style.background = `radial-gradient(circle at center, ${currentSong.bg} 40%, #08080A 100%)`;
  }

  // Generate lyricsData dynamically by pairing lyrics with their concepts
  const lyricsData = currentSong.lyrics.map((line, idx) => {
    const conceptIdx = Math.min(
      Math.floor((idx / currentSong.lyrics.length) * currentSong.concepts.length),
      currentSong.concepts.length - 1
    );
    const concept = currentSong.concepts[conceptIdx] || "Study notes detail matching this line.";
    return {
      lyric: line,
      concept: concept
    };
  });

  let currentIndex = 0;
  let isPlaying = true;
  const BASE_TIME_PER_LINE = 5000; // 5 seconds per line normally
  let playbackSpeed = 1.0;
  let progressAccumulator = 0;
  let timerInterval;

  const currentLyricEl = document.getElementById('currentLyric');
  const originalConceptEl = document.getElementById('originalConcept');
  const lyricCard = document.getElementById('lyricCard');
  const timerProgress = document.getElementById('timerProgress');
  
  const playPauseBtn = document.getElementById('playPauseBtn');
  const iconPlay = document.getElementById('iconPlay');
  const iconPause = document.getElementById('iconPause');
  const tapArea = document.getElementById('tapArea');

  // Find Speed button
  const speedBtn = Array.from(document.querySelectorAll('.study-footer .toggle-btn')).find(btn => btn.textContent.includes('Speed'));
  const speedsList = [
    { label: '1x', val: 1.0 },
    { label: '1.5x', val: 1.5 },
    { label: '2x', val: 2.0 },
    { label: '0.75x', val: 0.75 }
  ];
  let speedIdx = 0;

  if (speedBtn) {
    const speedValSpan = speedBtn.querySelector('span:first-child');
    speedBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Avoid advancing lyrics on speed change
      speedIdx = (speedIdx + 1) % speedsList.length;
      const selectedSpeed = speedsList[speedIdx];
      
      if (speedValSpan) speedValSpan.textContent = selectedSpeed.label;
      playbackSpeed = selectedSpeed.val;
      
      // Visual feedback of active speed state
      speedBtn.classList.toggle('active', selectedSpeed.val !== 1.0);
    });
  }

  const updateContent = () => {
    // Retrigger entrance animation
    lyricCard.style.animation = 'none';
    lyricCard.offsetHeight; // trigger reflow
    lyricCard.style.animation = 'fadeIn 0.45s cubic-bezier(0.16, 1, 0.3, 1)';

    currentLyricEl.textContent = lyricsData[currentIndex].lyric;
    originalConceptEl.textContent = lyricsData[currentIndex].concept;
    
    progressAccumulator = 0;
    updateTimerUI();
  };

  const advance = () => {
    currentIndex = (currentIndex + 1) % lyricsData.length;
    updateContent();
  };

  const updateTimerUI = () => {
    // Circle circumference is 283
    const offset = 283 - (progressAccumulator * 283);
    timerProgress.style.strokeDashoffset = offset;
  };

  const tickIntervalMs = 50;

  const updateTimer = () => {
    if (!isPlaying) return;

    // Accumulate progress: fraction of time elapsed based on speed
    const step = tickIntervalMs / (BASE_TIME_PER_LINE / playbackSpeed);
    progressAccumulator = Math.min(progressAccumulator + step, 1);
    
    updateTimerUI();

    if (progressAccumulator >= 1) {
      advance();
    }
  };

  // Run timer loop
  timerInterval = setInterval(updateTimer, tickIntervalMs);

  // Tap anywhere on content to advance manually
  tapArea.addEventListener('click', (e) => {
    // Prevent manual advance if clicking footer buttons or header controls
    if (e.target.closest('.study-footer') || e.target.closest('.study-header') || e.target.closest('#playPauseBtn')) {
      return;
    }
    advance();
  });

  // Play/pause toggle
  playPauseBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent advancing
    isPlaying = !isPlaying;
    
    if (isPlaying) {
      iconPlay.style.display = 'none';
      iconPause.style.display = 'block';
    } else {
      iconPlay.style.display = 'block';
      iconPause.style.display = 'none';
    }
  });

  // Chorus and Vocals toggle premium visual changes
  const toggleBtns = document.querySelectorAll('.study-footer .toggle-btn');
  toggleBtns.forEach(btn => {
    if (btn === speedBtn) return; // handled separately

    btn.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent advancing
      btn.classList.toggle('active');
      
      const label = btn.querySelector('span:last-child').textContent.toLowerCase();
      if (label === 'vocals') {
        const hasVocals = btn.classList.contains('active');
        if (hasVocals) {
          currentLyricEl.style.opacity = '1';
          currentLyricEl.style.fontStyle = 'normal';
        } else {
          // Dim vocals to show instrumental simulation
          currentLyricEl.style.opacity = '0.35';
          currentLyricEl.style.fontStyle = 'italic';
        }
      } else if (label === 'chorus') {
        const isChorusOn = btn.classList.contains('active');
        // Add chorus text glow shadow highlight
        if (isChorusOn) {
          currentLyricEl.style.textShadow = '0 0 15px rgba(255, 107, 107, 0.7)';
        } else {
          currentLyricEl.style.textShadow = 'none';
        }
      }
    });
  });

  // Initialize view
  updateContent();
});
