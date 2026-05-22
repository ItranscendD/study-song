import { getUser, getSongs } from './db.js';

document.addEventListener('DOMContentLoaded', () => {
  // Update Date
  const dateTextEl = document.querySelector('.date-text');
  if (dateTextEl) {
    const options = { weekday: 'long', month: 'short', day: 'numeric' };
    dateTextEl.textContent = new Date().toLocaleDateString('en-US', options);
  }

  // Update Greeting User Name
  const greetingEl = document.querySelector('.greeting');
  if (greetingEl) {
    const user = getUser();
    const firstName = user.name ? user.name.split(' ')[0] : 'Alex';
    greetingEl.innerHTML = `Hey, ${firstName} <span class="wave">👋</span>`;
  }

  // Render recent songs dynamically
  const songs = getSongs();
  const recentScroll = document.querySelector('.horizontal-scroll');
  
  if (recentScroll && songs.length > 0) {
    recentScroll.innerHTML = ''; // Clear hardcoded ones
    songs.slice(0, 5).forEach(song => {
      const card = document.createElement('div');
      card.className = 'playback-card';
      card.style.cursor = 'pointer';
      card.innerHTML = `
        <div class="card-art" style="background: ${song.bg || '#1C1C24'}">${song.art || '🎵'}</div>
        <div class="card-info">
          <h3 class="song-name">${song.name}</h3>
          <div class="tags">
            <span class="tag subject-tag">${song.subject}</span>
            <span class="tag genre-tag">${song.genre}</span>
          </div>
        </div>
        <button class="btn-play">
          <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="8 5 19 12 8 19 8 5"></polygon></svg>
        </button>
      `;
      // Click card to play
      card.addEventListener('click', () => {
        window.location.href = `player.html?id=${song.id}`;
      });
      recentScroll.appendChild(card);
    });
  }

  // Render folders with dynamic track counts
  const libraryGrid = document.querySelector('.library-grid');
  if (libraryGrid) {
    // Group songs by subject
    const subjectCounts = {};
    songs.forEach(song => {
      subjectCounts[song.subject] = (subjectCounts[song.subject] || 0) + 1;
    });

    const folders = [
      { name: 'Biology', icon: '🧬', class: 'folder-biology', key: 'Biology' },
      { name: 'Chemistry', icon: '🧪', class: 'folder-chemistry', key: 'Chemistry' },
      { name: 'History', icon: '🏛️', class: 'folder-history', key: 'History' },
      { name: 'Languages', icon: '🗣️', class: 'folder-languages', key: 'Languages' }
    ];

    libraryGrid.innerHTML = ''; // Clear hardcoded ones
    folders.forEach(f => {
      const count = subjectCounts[f.key] || 0;
      const folderDiv = document.createElement('div');
      folderDiv.className = `library-folder ${f.class}`;
      folderDiv.style.cursor = 'pointer';
      folderDiv.innerHTML = `
        <div class="folder-overlay"></div>
        <span class="subject-icon">${f.icon}</span>
        <div class="folder-info">
          <h3 class="folder-name">${f.name}</h3>
          <span class="track-count">${count} track${count !== 1 ? 's' : ''}</span>
        </div>
      `;
      // Redirect to library page with folder parameter
      folderDiv.addEventListener('click', () => {
        window.location.href = `library.html?folder=${f.key.toLowerCase()}`;
      });
      libraryGrid.appendChild(folderDiv);
    });
  }
});
