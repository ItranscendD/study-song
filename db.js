// StudySong Mock Database Module

const DEFAULT_SONGS = [
  {
    id: 'mitochondria_bop',
    name: 'Mitochondria Bop',
    subject: 'Biology',
    genre: 'Afrobeats',
    era: '2020s',
    mood: 'Catchy',
    art: '🧬',
    bg: '#1a1228',
    duration: '2:08',
    favorite: false,
    lyrics: [
      "Sunlight hitting the leaves",
      "Chloroplasts working like machines",
      "Water and CO2 combine",
      "Making glucose, feeling fine",
      "ATP is the currency we spend",
      "Energy flowing until the end",
      "Cellular respiration takes the stage",
      "Turning the page, inside the cage"
    ],
    concepts: [
      "Mitochondria is the powerhouse of the cell, generating chemical energy.",
      "Photosynthesis requires water, carbon dioxide, and sunlight.",
      "The process creates glucose (sugar) which is used as food for the plant.",
      "Energy is stored as Adenosine Triphosphate (ATP)."
    ]
  },
  {
    id: 'fall_of_rome',
    name: 'Fall of Rome',
    subject: 'History',
    genre: 'Pop',
    era: '2010s',
    mood: 'Hype',
    art: '🏛️',
    bg: '#1a1f12',
    duration: '2:15',
    favorite: true,
    lyrics: [
      "Julius Caesar crossing the Rubicon",
      "Roman Empire rising to the dawn",
      "Barbarians knocking on the gate",
      "Four-seventy-six, sealed their fate",
      "Inflation rising, coins getting thin",
      "The empire falls from deep within"
    ],
    concepts: [
      "Julius Caesar's crossing of the Rubicon marked a point of no return.",
      "Barbarian tribes invaded and collapsed the Western Roman Empire.",
      "In 476 AD, the last Western Roman Emperor was deposed.",
      "Severe inflation and corruption weakened Rome from the inside."
    ]
  },
  {
    id: 'tort_law',
    name: 'Tort Law Anthem',
    subject: 'Law',
    genre: 'R&B',
    era: '2000s',
    mood: 'Calm',
    art: '⚖️',
    bg: '#141820',
    duration: '2:30',
    favorite: false,
    lyrics: [
      "Duty of care we owe to each other",
      "Negligence claims, one after another",
      "Breaching the standard, causing the harm",
      "Damages paid to soothe and disarm"
    ],
    concepts: [
      "Tort law addresses civil wrongs and negligence.",
      "Duty of care is the legal obligation to avoid harming others.",
      "Breaching the standard of care results in liability.",
      "Damages are the monetary compensations paid to the injured party."
    ]
  }
];

const DEFAULT_SETTINGS = {
  defaultGenre: 'Afrobeats',
  defaultMood: 'Catchy',
  defaultEra: '2020s',
  autoplayStudy: true,
  showNoteContext: true,
  defaultSpeed: '1x'
};

const DEFAULT_USER = {
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  subjects: ['Biology', 'History'],
  genres: ['Pop', 'Afrobeats'],
  moods: ['Catchy', 'Hype']
};

const DEFAULT_ACHIEVEMENTS = {
  unlocked: ['first_song', 'streak7', 'remix', 'lyricist', 'sharing', 'fan'],
  streak: 14,
  totalTimeStudied: 45 // minutes
};

// Initialize State
export function initDB() {
  if (!localStorage.getItem('studysong_songs')) {
    localStorage.setItem('studysong_songs', JSON.stringify(DEFAULT_SONGS));
  }
  if (!localStorage.getItem('studysong_settings')) {
    localStorage.setItem('studysong_settings', JSON.stringify(DEFAULT_SETTINGS));
  }
  if (!localStorage.getItem('studysong_user')) {
    localStorage.setItem('studysong_user', JSON.stringify(DEFAULT_USER));
  }
  if (!localStorage.getItem('studysong_achievements')) {
    localStorage.setItem('studysong_achievements', JSON.stringify(DEFAULT_ACHIEVEMENTS));
  }
  if (!localStorage.getItem('studysong_premium')) {
    localStorage.setItem('studysong_premium', 'false');
  }
}

// Songs API
export function getSongs() {
  initDB();
  return JSON.parse(localStorage.getItem('studysong_songs'));
}

export function getSong(id) {
  const songs = getSongs();
  return songs.find(s => s.id === id);
}

export function saveSong(song) {
  const songs = getSongs();
  const index = songs.findIndex(s => s.id === song.id);
  if (index !== -1) {
    songs[index] = song;
  } else {
    songs.push(song);
    incrementAchievementCount('beatmaker');
  }
  localStorage.setItem('studysong_songs', JSON.stringify(songs));
}

export function toggleFavorite(id) {
  const song = getSong(id);
  if (song) {
    song.favorite = !song.favorite;
    saveSong(song);
  }
  return song;
}

// User & Settings API
export function getUser() {
  initDB();
  return JSON.parse(localStorage.getItem('studysong_user'));
}

export function saveUser(user) {
  const currentUser = getUser();
  const updatedUser = { ...currentUser, ...user };
  localStorage.setItem('studysong_user', JSON.stringify(updatedUser));
}

export function getSettings() {
  initDB();
  return JSON.parse(localStorage.getItem('studysong_settings'));
}

export function saveSettings(settings) {
  const currentSettings = getSettings();
  const updatedSettings = { ...currentSettings, ...settings };
  localStorage.setItem('studysong_settings', JSON.stringify(updatedSettings));
}

export function isPremium() {
  initDB();
  return localStorage.getItem('studysong_premium') === 'true';
}

export function setPremium(status) {
  localStorage.setItem('studysong_premium', status ? 'true' : 'false');
}

// Achievements API
export function getAchievements() {
  initDB();
  return JSON.parse(localStorage.getItem('studysong_achievements'));
}

export function incrementAchievementCount(badgeId) {
  const achs = getAchievements();
  if (!achs.unlocked.includes(badgeId)) {
    achs.unlocked.push(badgeId);
    localStorage.setItem('studysong_achievements', JSON.stringify(achs));
    return true; // Newly unlocked
  }
  return false;
}

export function resetAllData() {
  localStorage.removeItem('studysong_songs');
  localStorage.removeItem('studysong_settings');
  localStorage.removeItem('studysong_user');
  localStorage.removeItem('studysong_achievements');
  localStorage.removeItem('studysong_premium');
  localStorage.removeItem('studysong_current_notes');
  localStorage.removeItem('studysong_current_subject');
  localStorage.removeItem('studysong_current_config');
  localStorage.removeItem('studysong_pending_song');
  initDB();
}

// Run initializer
initDB();
