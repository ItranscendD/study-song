import { getSong, saveSong, getSongs } from './db.js';

document.addEventListener('DOMContentLoaded', () => {
  // Query parameters parsing
  const urlParams = new URLSearchParams(window.location.search);
  const isGenerating = urlParams.get('generating') === 'true';
  const simulateTimeout = urlParams.get('timeout') === 'true';
  const songId = urlParams.get('id');

  // DOM Elements
  const loadingOverlay = document.getElementById('loadingOverlay');
  const errorSheetOverlay = document.getElementById('errorSheetOverlay');
  const regenOverlay = document.getElementById('regenOverlay');
  const btnTryAgain = document.getElementById('btnTryAgain');
  const btnConfirmRegen = document.getElementById('btnConfirmRegen');
  const btnCancelRegen = document.getElementById('btnCancelRegen');
  const playBtn = document.getElementById('playBtn');
  const iconPlay = playBtn.querySelector('.icon-play');
  const iconPause = playBtn.querySelector('.icon-pause');
  const speedBtn = document.getElementById('speedBtn');
  const progressFill = document.getElementById('progressFill');
  const progressTrack = document.querySelector('.progress-track');
  const currentTimeEl = document.getElementById('currentTime');
  const totalTimeEl = document.querySelector('.total-time');
  const songTitleEl = document.querySelector('.song-title');
  const trackTagsEl = document.querySelector('.track-tags');
  const lyricsContainer = document.getElementById('lyricsContainer');
  const waveform = document.getElementById('waveform');

  // Load active song
  let currentSong = null;
  if (songId) {
    currentSong = getSong(songId);
  }
  if (!currentSong) {
    const pending = localStorage.getItem('studysong_pending_song');
    if (pending) {
      currentSong = JSON.parse(pending);
    }
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
      lyrics: ['Mitochondria is the powerhouse of the cell', 'Produces ATP to make it run well'],
      concepts: ['Mitochondria powerhouse']
    };
  }

  // Set active ID in database context
  localStorage.setItem('studysong_active_player_song_id', currentSong.id);

  // Set App Container Background to matching theme
  const appContainer = document.querySelector('.app-container');
  if (appContainer && currentSong.bg) {
    appContainer.style.background = currentSong.bg;
  }

  // Populate Song Details
  if (songTitleEl) songTitleEl.textContent = currentSong.name;
  if (trackTagsEl) {
    trackTagsEl.innerHTML = `
      <span class="tag">${currentSong.subject}</span> • 
      <span class="tag">${currentSong.genre}</span> • 
      <span class="tag">${currentSong.era}</span>
    `;
  }
  totalTimeEl.textContent = currentSong.duration;

  // Convert duration to seconds
  const parseDuration = (durStr) => {
    const parts = durStr.split(':');
    if (parts.length === 2) {
      return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
    }
    return 120; // fallback
  };
  const durationSecs = parseDuration(currentSong.duration);

  // Initial playback state
  let isPlaying = false;
  let currentTime = 0;
  let playbackSpeed = 1;
  let activeRegenIndex = -1;

  // Generate waveform bars
  const numBars = 30;
  waveform.innerHTML = '';
  for (let i = 0; i < numBars; i++) {
    const bar = document.createElement('div');
    bar.className = 'bar';
    const height = Math.random() * 60 + 10;
    bar.style.height = `${height}px`;
    const delay = Math.random() * 1;
    const duration = Math.random() * 0.5 + 0.5;
    bar.style.animationDelay = `${delay}s`;
    bar.style.animationDuration = `${duration}s`;
    waveform.appendChild(bar);
  }

  // Render Lyric Lines with Regen buttons
  const renderLyrics = () => {
    lyricsContainer.innerHTML = '';
    currentSong.lyrics.forEach((line, idx) => {
      const lineEl = document.createElement('div');
      lineEl.className = 'lyric-line';
      lineEl.dataset.index = idx;
      lineEl.innerHTML = `
        <span>${line}</span>
        <button class="btn-regen-inline" data-index="${idx}">Regen ✨</button>
      `;

      // Lyric line click to seek
      lineEl.addEventListener('click', (e) => {
        // Prevent click if clicking the regen button
        if (e.target.classList.contains('btn-regen-inline')) return;
        seekToLine(idx);
      });

      // Hook up inline regen button
      const regenBtn = lineEl.querySelector('.btn-regen-inline');
      regenBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        activeRegenIndex = idx;
        regenOverlay.classList.add('active');
      });

      lyricsContainer.appendChild(lineEl);
    });
  };
  renderLyrics();

  // Highlight and scroll active lyrics
  const updateLyricsHighlight = () => {
    const lines = lyricsContainer.querySelectorAll('.lyric-line');
    if (!lines.length) return;

    // Calculate current line index based on elapsed ratio
    const ratio = currentTime / durationSecs;
    const activeIdx = Math.min(Math.floor(ratio * lines.length), lines.length - 1);

    lines.forEach((line, idx) => {
      line.classList.remove('active', 'played');
      if (idx < activeIdx) {
        line.classList.add('played');
      } else if (idx === activeIdx) {
        line.classList.add('active');
        // Smooth scroll container to keep active line centered
        line.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  };

  // Playback timer tick
  let playbackInterval = null;
  const tickDurationMs = 100; // tick every 100ms for smooth progress

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const updateUI = () => {
    currentTimeEl.textContent = formatTime(currentTime);
    const pct = (currentTime / durationSecs) * 100;
    progressFill.style.width = `${pct}%`;
    updateLyricsHighlight();
  };

  const startPlayback = () => {
    if (isPlaying) return;
    isPlaying = true;
    waveform.classList.add('playing');
    iconPlay.style.display = 'none';
    iconPause.style.display = 'block';

    playbackInterval = setInterval(() => {
      // Increment time scaled by playback speed
      currentTime += (tickDurationMs / 1000) * playbackSpeed;
      if (currentTime >= durationSecs) {
        currentTime = 0; // Loop or stop
      }
      updateUI();
    }, tickDurationMs);
  };

  const pausePlayback = () => {
    if (!isPlaying) return;
    isPlaying = false;
    waveform.classList.remove('playing');
    iconPlay.style.display = 'block';
    iconPause.style.display = 'none';
    clearInterval(playbackInterval);
  };

  playBtn.addEventListener('click', () => {
    if (isPlaying) {
      pausePlayback();
    } else {
      startPlayback();
    }
  });

  // Speed selector interaction
  const speeds = [
    { label: '1x', val: 1.0 },
    { label: '1.5x', val: 1.5 },
    { label: '2x', val: 2.0 },
    { label: '0.75x', val: 0.75 }
  ];
  let currentSpeedIdx = 0;

  speedBtn.addEventListener('click', () => {
    currentSpeedIdx = (currentSpeedIdx + 1) % speeds.length;
    const sp = speeds[currentSpeedIdx];
    speedBtn.textContent = sp.label;
    playbackSpeed = sp.val;
  });

  // Skip Back / Skip Fwd
  const skipBackBtn = document.querySelector('.skip-back');
  const skipFwdBtn = document.querySelector('.skip-fwd');

  skipBackBtn.addEventListener('click', () => {
    currentTime = Math.max(0, currentTime - 10);
    updateUI();
  });

  skipFwdBtn.addEventListener('click', () => {
    currentTime = Math.min(durationSecs - 0.5, currentTime + 10);
    updateUI();
  });

  // Seek/Scrub interaction on progress track
  const handleSeek = (e) => {
    const rect = progressTrack.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(clickX / rect.width, 1));
    currentTime = pct * durationSecs;
    updateUI();
  };

  progressTrack.addEventListener('mousedown', handleSeek);

  const seekToLine = (lineIdx) => {
    const linesCount = currentSong.lyrics.length;
    currentTime = (lineIdx / linesCount) * durationSecs;
    updateUI();
  };

  // ── Regeneration Modal Logic ──
  btnCancelRegen.addEventListener('click', () => {
    regenOverlay.classList.remove('active');
    activeRegenIndex = -1;
  });

  btnConfirmRegen.addEventListener('click', () => {
    if (activeRegenIndex === -1) return;
    btnConfirmRegen.textContent = 'Regenerating... ⏳';
    btnConfirmRegen.disabled = true;

    // Simulate generation delay
    setTimeout(() => {
      // Replacements options
      const alternativeRhymes = [
        "Synthesizing energy, doing it right",
        "Keeping the metabolic fire burning bright",
        "Empirical evidence that standard was met",
        "Civil liability we won't forget",
        "Reactions proceeding at double the rate",
        "Catalyst working to speed up the state",
        "Conjugating regular verbs in the past",
        "Learning the structure that's built to last",
        "Julius Caesar crossing that river at night",
        "Legions of Rome preparing to fight"
      ];

      const replacement = alternativeRhymes[Math.floor(Math.random() * alternativeRhymes.length)];
      currentSong.lyrics[activeRegenIndex] = `✨ ${replacement}`;
      
      // Save updated song details
      saveSong(currentSong);
      
      // Also update pending song if it is matching
      const pending = localStorage.getItem('studysong_pending_song');
      if (pending) {
        const pObj = JSON.parse(pending);
        if (pObj.id === currentSong.id) {
          localStorage.setItem('studysong_pending_song', JSON.stringify(currentSong));
        }
      }

      renderLyrics();
      updateLyricsHighlight();

      // Reset button and close overlay
      btnConfirmRegen.textContent = 'Yes, regenerate';
      btnConfirmRegen.disabled = false;
      regenOverlay.classList.remove('active');
      activeRegenIndex = -1;
    }, 1200);
  });

  // ── Loading & Timeout Timelines ──
  if (isGenerating) {
    loadingOverlay.classList.add('active');

    // Generate loading visualizer bars
    const loadingVisualizer = document.getElementById('loadingVisualizer');
    if (loadingVisualizer) {
      loadingVisualizer.innerHTML = '';
      for (let i = 0; i < 15; i++) {
        const bar = document.createElement('div');
        bar.className = 'visualizer-bar';
        bar.style.setProperty('--dur', `${Math.random() * 0.4 + 0.4}s`);
        loadingVisualizer.appendChild(bar);
      }
    }

    // Cycle status text
    const statusTextEl = document.getElementById('loadingStatus');
    const statuses = [
      'Extracting subject keywords...',
      'Mapping standard templates...',
      'Synthesizing vocals...',
      'Mixing background beats...',
      'Mastering audio output...'
    ];
    let statusIdx = 0;
    const statusCycle = setInterval(() => {
      statusIdx = (statusIdx + 1) % statuses.length;
      statusTextEl.textContent = statuses[statusIdx];
    }, 600);

    if (simulateTimeout) {
      // Timeline for Timeout Error
      setTimeout(() => {
        clearInterval(statusCycle);
        // Freeze visualizer
        const bars = loadingVisualizer.querySelectorAll('.visualizer-bar');
        bars.forEach(b => {
          b.style.animation = 'none';
          b.style.height = '15px';
        });

        // Flash red
        loadingOverlay.style.transition = 'none';
        loadingOverlay.style.backgroundColor = 'var(--color-error)';
        setTimeout(() => {
          loadingOverlay.style.transition = 'opacity 0.3s ease';
          loadingOverlay.style.backgroundColor = '#0E0E12';

          // Slide up error sheet
          errorSheetOverlay.classList.add('active');
        }, 200);
      }, 2500);

      // Try again reload
      btnTryAgain.addEventListener('click', () => {
        window.location.href = 'player.html?generating=true';
      });

    } else {
      // Normal successful timeline
      setTimeout(() => {
        clearInterval(statusCycle);
        loadingOverlay.classList.remove('active');
        // Start playing automatically
        startPlayback();
        updateUI();
      }, 2500);
    }
  } else {
    // Normal start, update UI with details
    updateUI();
  }
});
