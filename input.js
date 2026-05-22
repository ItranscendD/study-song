document.addEventListener('DOMContentLoaded', () => {
  const noteInput = document.getElementById('noteInput');
  const charCount = document.getElementById('charCount');
  const processBtn = document.getElementById('processBtn');
  const MAX_CHARS = 3000;

  // Overlays & Sheets
  const uploadSheetOverlay = document.getElementById('uploadSheetOverlay');
  const scanOverlay = document.getElementById('scanOverlay');
  const voiceOverlay = document.getElementById('voiceOverlay');

  // Simulation buttons
  const btnSimulateSuccess = document.getElementById('btnSimulateSuccess');
  const btnSimulateFailure = document.getElementById('btnSimulateFailure');
  const btnCloseUploadSheet = document.getElementById('btnCloseUploadSheet');
  const btnCancelScan = document.getElementById('btnCancelScan');
  const btnCancelVoice = document.getElementById('btnCancelVoice');

  // Method buttons grid
  const methodBtns = document.querySelectorAll('.method-btn');

  // Load previous notes if any
  const savedNotes = localStorage.getItem('studysong_current_notes');
  if (savedNotes) {
    noteInput.value = savedNotes;
    updateInputState();
  }

  function updateInputState() {
    const currentLength = noteInput.value.length;
    charCount.textContent = `${currentLength} / ${MAX_CHARS}`;
    
    if (currentLength > 0) {
      processBtn.disabled = false;
    } else {
      processBtn.disabled = true;
    }
    
    if (currentLength > MAX_CHARS * 0.9) {
      charCount.style.color = 'var(--color-error)';
    } else {
      charCount.style.color = 'var(--text-secondary)';
    }
  }

  noteInput.addEventListener('input', updateInputState);

  // Process button → navigate to customize
  processBtn.addEventListener('click', () => {
    processBtn.innerHTML = 'Processing notes... <span class="arrow">⏳</span>';
    processBtn.disabled = true;

    const text = noteInput.value.trim();
    const lowerText = text.toLowerCase();
    
    // Simple subject keywords matcher
    let subject = 'Biology'; // default
    if (lowerText.includes('caesar') || lowerText.includes('rome') || lowerText.includes('empire') || lowerText.includes('history') || lowerText.includes('napoleon')) {
      subject = 'History';
    } else if (lowerText.includes('tort') || lowerText.includes('law') || lowerText.includes('court') || lowerText.includes('legal') || lowerText.includes('negligence') || lowerText.includes('contract')) {
      subject = 'Law';
    } else if (lowerText.includes('chemistry') || lowerText.includes('molecule') || lowerText.includes('reaction') || lowerText.includes('compound') || lowerText.includes('bond') || lowerText.includes('atom')) {
      subject = 'Chemistry';
    } else if (lowerText.includes('language') || lowerText.includes('spanish') || lowerText.includes('french') || lowerText.includes('verb') || lowerText.includes('vocabulary') || lowerText.includes('english')) {
      subject = 'Languages';
    }

    localStorage.setItem('studysong_current_notes', text);
    localStorage.setItem('studysong_current_subject', subject);

    setTimeout(() => {
      window.location.href = 'customize.html';
    }, 1200);
  });

  // Method 1: Upload file simulation
  if (methodBtns[0]) {
    methodBtns[0].addEventListener('click', () => {
      uploadSheetOverlay.classList.add('active');
    });
  }

  btnCloseUploadSheet.addEventListener('click', () => {
    uploadSheetOverlay.classList.remove('active');
  });

  btnSimulateSuccess.addEventListener('click', () => {
    uploadSheetOverlay.classList.remove('active');
    // Pre-fill biology / chemistry mixed notes
    noteInput.value = "The Citric Acid Cycle (also known as the Krebs Cycle) is a series of chemical reactions used by all aerobic organisms to generate energy. It occurs in the mitochondrial matrix and provides precursors for amino acids as well as the reducing agent NADH, which is used in the electron transport chain.";
    updateInputState();
    showToast("Upload successful", "Your notes have been scanned and imported.", true);
  });

  btnSimulateFailure.addEventListener('click', () => {
    uploadSheetOverlay.classList.remove('active');
    showToast("Upload failed", "File couldn't be read. Try a PDF or plain text.", false);
  });

  // Method 2: Scan handwriting simulation
  let scanTimer = null;
  if (methodBtns[1]) {
    methodBtns[1].addEventListener('click', () => {
      scanOverlay.classList.add('active');
      const scanStatus = document.getElementById('scanStatus');
      
      let step = 0;
      const statusSteps = [
        "Positioning camera...",
        "Detecting handwriting margins...",
        "Scanning lines and paragraphs...",
        "Converting handwriting to digital text...",
        "Structuring key concepts..."
      ];
      
      scanStatus.textContent = statusSteps[0];
      const stepInterval = setInterval(() => {
        step++;
        if (step < statusSteps.length) {
          scanStatus.textContent = statusSteps[step];
        }
      }, 600);

      scanTimer = setTimeout(() => {
        clearInterval(stepInterval);
        scanOverlay.classList.remove('active');
        noteInput.value = "The Solar System consists of our Sun and everything bound to it by gravity: planets Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune; dwarf planets Pluto, Ceres; dozens of moons; and millions of asteroids, comets, and meteoroids.";
        updateInputState();
        showToast("Scan successful", "Handwriting converted to study notes.", true);
      }, 3500);
    });
  }

  btnCancelScan.addEventListener('click', () => {
    if (scanTimer) clearTimeout(scanTimer);
    scanOverlay.classList.remove('active');
  });

  // Method 3: Voice record simulation
  let voiceTimer = null;
  let voiceSecsInterval = null;
  if (methodBtns[2]) {
    methodBtns[2].addEventListener('click', () => {
      voiceOverlay.classList.add('active');
      const voiceTimerEl = document.getElementById('voiceTimer');
      
      let secs = 0;
      voiceTimerEl.textContent = "00:00";
      voiceSecsInterval = setInterval(() => {
        secs++;
        const formatSecs = secs < 10 ? `0${secs}` : secs;
        voiceTimerEl.textContent = `00:${formatSecs}`;
      }, 1000);

      voiceTimer = setTimeout(() => {
        clearInterval(voiceSecsInterval);
        voiceOverlay.classList.remove('active');
        noteInput.value = "Civil liability under tort law requires four primary elements to be satisfied. First, a duty of care must exist between the parties. Second, there must be a breach of that duty. Third, the breach must cause the injury (causation). Fourth, the plaintiff must have suffered actual damages.";
        updateInputState();
        showToast("Audio transcribed", "Voice recording successfully summarized.", true);
      }, 4500);
    });
  }

  btnCancelVoice.addEventListener('click', () => {
    if (voiceTimer) clearTimeout(voiceTimer);
    if (voiceSecsInterval) clearInterval(voiceSecsInterval);
    voiceOverlay.classList.remove('active');
  });

  // Method 4: Try sample notes
  if (methodBtns[3]) {
    methodBtns[3].addEventListener('click', () => {
      noteInput.value = "The mitochondria is the powerhouse of the cell. It generates most of the chemical energy needed to power the cell's biochemical reactions. Chemical energy produced by the mitochondria is stored in a small molecule called adenosine triphosphate (ATP).";
      updateInputState();
      showToast("Sample loaded", "Biology sample notes loaded successfully.", true);
    });
  }

  // ── Toast Logic ──
  let dismissTimeout = null;

  function showToast(title, message, isSuccess = true) {
    const wrap = document.getElementById('toastWrap');
    const toast = document.getElementById('toastElement');
    const icon = document.getElementById('toastIcon');
    const titleEl = document.getElementById('toastTitle');
    const msgEl = document.getElementById('toastMsg');
    const timer = document.getElementById('toastTimer');

    // Clear any running dismiss
    if (dismissTimeout) {
      clearTimeout(dismissTimeout);
      dismissTimeout = null;
    }

    // Set classes and text
    toast.className = 'toast ' + (isSuccess ? 'toast-success' : 'toast-error');
    titleEl.textContent = title;
    msgEl.textContent = message;

    // Set icon
    if (isSuccess) {
      icon.innerHTML = `<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>`;
    } else {
      icon.innerHTML = `<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>`;
    }

    // Reset state
    wrap.classList.remove('dismissed');
    wrap.classList.remove('visible');

    // Force reflow so transition re-triggers
    void wrap.offsetWidth;

    // Clone timer to restart animation
    const fresh = timer.cloneNode(true);
    timer.parentNode.replaceChild(fresh, timer);
    
    // Show
    wrap.classList.add('visible');

    // Auto-dismiss after 4s
    dismissTimeout = setTimeout(() => {
      dismissToast();
    }, 4000);
  }

  function dismissToast() {
    const wrap = document.getElementById('toastWrap');
    if (wrap) {
      wrap.classList.remove('visible');
      wrap.classList.add('dismissed');
    }
  }

  document.getElementById('toastClose').addEventListener('click', () => {
    if (dismissTimeout) clearTimeout(dismissTimeout);
    dismissToast();
  });
});
