import { getSettings, saveSong } from './db.js';

document.addEventListener('DOMContentLoaded', () => {
  // Setup selectors clicking behavior
  const setupSelector = (groupName) => {
    const buttons = document.querySelectorAll(`button[data-group="${groupName}"]`);
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      });
    });
  };

  setupSelector('genre');
  setupSelector('era');
  setupSelector('mood');

  // Pre-select options based on settings defaults
  const settings = getSettings();
  const defaultGenre = settings.defaultGenre || 'Pop';
  const defaultEra = settings.defaultEra || '2020s';
  const defaultMood = settings.defaultMood || 'Catchy';

  const preselectOption = (groupName, value) => {
    const buttons = document.querySelectorAll(`button[data-group="${groupName}"]`);
    buttons.forEach(btn => {
      let btnText = '';
      if (groupName === 'mood') {
        btnText = btn.querySelector('.text').textContent.trim();
      } else if (groupName === 'era') {
        btnText = btn.querySelector('.year').textContent.trim();
      } else {
        btnText = btn.textContent.trim();
      }
      
      if (btnText.toLowerCase() === value.toLowerCase()) {
        buttons.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        // Smooth scroll to center the item after layout renders
        setTimeout(() => {
          btn.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'center' });
        }, 100);
      }
    });
  };

  preselectOption('genre', defaultGenre);
  preselectOption('era', defaultEra);
  preselectOption('mood', defaultMood);

  // Extract key concepts dynamically from notes
  const notesText = localStorage.getItem('studysong_current_notes') || '';
  const subject = localStorage.getItem('studysong_current_subject') || 'Biology';
  const conceptListEl = document.querySelector('.concept-list');

  let extractedConcepts = [];

  if (conceptListEl) {
    conceptListEl.innerHTML = '';
    // Split notes into sentences
    const rawSentences = notesText.split(/[.?!]/).map(s => s.trim()).filter(s => s.length > 10);
    
    if (rawSentences.length > 0) {
      extractedConcepts = rawSentences.slice(0, 3).map(s => s.endsWith('.') ? s : s + '.');
    } else {
      // Subject fallback concepts
      if (subject === 'History') {
        extractedConcepts = [
          "Julius Caesar crossed the Rubicon in 49 BC.",
          "This marked the beginning of a civil war and the end of the Roman Republic.",
          "The Western Roman Empire collapsed in 476 AD under barbarian invasions."
        ];
      } else if (subject === 'Law') {
        extractedConcepts = [
          "Negligence is a failure to exercise appropriate duty of care.",
          "Causation links the breach of duty to the actual harm suffered.",
          "Damages represent the legal remedy compensating for civil injury."
        ];
      } else if (subject === 'Chemistry') {
        extractedConcepts = [
          "Chemical bonds hold atoms together in molecules.",
          "Covalent bonds involve the sharing of electron pairs.",
          "Reactions occur when bonds break and new bonds form."
        ];
      } else if (subject === 'Languages') {
        extractedConcepts = [
          "Verbs change form depending on tense and subject.",
          "The subjunctive mood expresses wishes, doubts, or hypothetical situations.",
          "Regular verb conjugation follows consistent ending patterns."
        ];
      } else {
        extractedConcepts = [
          "Mitochondria act as the cell's powerhouse, producing ATP.",
          "Photosynthesis converts carbon dioxide and water into glucose.",
          "Cellular respiration breaks down glucose to release chemical energy."
        ];
      }
    }

    extractedConcepts.forEach(concept => {
      const li = document.createElement('li');
      li.textContent = concept;
      conceptListEl.appendChild(li);
    });
  }

  // Handle Generate Song
  const generateBtn = document.getElementById('generateBtn');
  generateBtn.addEventListener('click', () => {
    generateBtn.innerHTML = 'Analyzing concepts... ⏳';
    generateBtn.disabled = true;

    // Collect choices
    const getSelected = (groupName) => {
      const selectedBtn = document.querySelector(`button[data-group="${groupName}"].selected`);
      if (!selectedBtn) return '';
      if (groupName === 'mood') {
        return selectedBtn.querySelector('.text').textContent.trim();
      } else if (groupName === 'era') {
        return selectedBtn.querySelector('.year').textContent.trim();
      } else {
        return selectedBtn.textContent.trim();
      }
    };

    const genre = getSelected('genre');
    const era = getSelected('era');
    const mood = getSelected('mood');

    // Create Title based on subject
    const subjectTitles = {
      'Biology': ['Cellular Energy Flow', 'Krebs Cycle Anthem', 'DNA Synthesis Groove'],
      'History': ['Crossing the Rubicon', 'Pax Romana Rise', 'Empires in the Dust'],
      'Law': ['Standard of Care Duty', 'The Civil Tort Anthem', 'Reasonable Person Test'],
      'Chemistry': ['Atomic Bonding Bop', 'Covalent Connections', 'Chemical Catalyst Vibe'],
      'Languages': ['Subjunctive Mood Swings', 'Verb Conjugation Flow', 'Grammar Rules Rap']
    };

    const list = subjectTitles[subject] || ['Study Anthem', 'Session Groove', 'Focus Flow'];
    const songName = list[Math.floor(Math.random() * list.length)];

    // Subject Icon and Background Color Mapping
    const subjectMeta = {
      'Biology': { icon: '🧬', bg: '#1a1228' },
      'History': { icon: '🏛️', bg: '#221a12' },
      'Law': { icon: '⚖️', bg: '#141820' },
      'Chemistry': { icon: '🧪', bg: '#122228' },
      'Languages': { icon: '🗣️', bg: '#221216' }
    };
    const meta = subjectMeta[subject] || { icon: '🎵', bg: '#1C1C24' };

    // Build mock lyrics from notes or defaults
    let lyrics = [];
    if (notesText && notesText.length > 30) {
      const clauses = notesText.split(/[.?!,;:]/).map(s => s.trim()).filter(s => s.length > 12);
      if (clauses.length >= 4) {
        lyrics = clauses.slice(0, 8);
      }
    }
    
    if (lyrics.length < 4) {
      // Default lyrics
      if (subject === 'History') {
        lyrics = [
          "Caesar is marching, crossing the stream",
          "Rubicon behind him, chasing a dream",
          "Roman senate trembles, legions fall in line",
          "Crossing that river, crossing the line",
          "Power of the empire, rising to the sky",
          "History was written, as the days went by"
        ];
      } else if (subject === 'Law') {
        lyrics = [
          "Duty of care is the foundation we lay",
          "Reasonable standard in what you do and say",
          "Breach of that duty, causing the harm",
          "Damages follow to soothe and disarm"
        ];
      } else if (subject === 'Chemistry') {
        lyrics = [
          "Atoms sharing electrons, making it tight",
          "Covalent bonding under the light",
          "Molecules reacting, bonds start to break",
          "Energy releasing, changes they make"
        ];
      } else if (subject === 'Languages') {
        lyrics = [
          "Conjugating verbs, changing the end",
          "Tenses and endings, letters we blend",
          "Subjunctive expressing the things we desire",
          "Speak with the rhythm, setting the fire"
        ];
      } else {
        lyrics = [
          "Powerhouse mitochondria pumping inside",
          "Producing the energy where cells reside",
          "ATP storing the charge of the spark",
          "Synthesizing glucose, light in the dark",
          "Respiration moving, turning the wheel",
          "Active transport making it real"
        ];
      }
    }

    // Build the pending song object
    const pendingSong = {
      id: 'song_' + Date.now(),
      name: songName,
      subject: subject,
      genre: genre,
      era: era,
      mood: mood,
      art: meta.icon,
      bg: meta.bg,
      duration: '2:15',
      favorite: false,
      lyrics: lyrics,
      concepts: extractedConcepts
    };

    localStorage.setItem('studysong_pending_song', JSON.stringify(pendingSong));

    setTimeout(() => {
      generateBtn.innerHTML = 'Synthesizing voice... 🎙️';
      setTimeout(() => {
        window.location.href = 'player.html?generating=true';
      }, 1000);
    }, 1000);
  });
});
