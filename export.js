import { getSong, saveSong, getSongs } from './db.js';

document.addEventListener('DOMContentLoaded', () => {
  const bottomSheet = document.getElementById('bottomSheet');
  const modalOverlay = document.getElementById('modalOverlay');
  const btnClose = document.getElementById('btnClose');
  const btnSave = document.getElementById('btnSave');

  // Load the current song detail
  const activeId = localStorage.getItem('studysong_active_player_song_id');
  const pendingSong = JSON.parse(localStorage.getItem('studysong_pending_song'));
  
  let song = null;
  if (activeId) {
    song = getSong(activeId);
  }
  if (!song && pendingSong) {
    song = pendingSong;
  }
  if (!song) {
    const songs = getSongs();
    song = songs[0];
  }

  // Populate background context and folder details
  if (song) {
    const bgTitle = document.querySelector('.bg-context .song-title');
    const bgTags = document.querySelector('.bg-context .track-tags');
    if (bgTitle) bgTitle.textContent = song.name;
    if (bgTags) {
      bgTags.innerHTML = `<span class="tag">${song.subject}</span> • <span class="tag">${song.genre}</span>`;
    }

    // Set folder name and icon to match the song's subject
    const folderIcon = document.querySelector('.folder-icon');
    const folderName = document.querySelector('.folder-name');
    if (folderIcon && folderName) {
      const subjectMeta = {
        'Biology': { icon: '🧬', name: 'Biology' },
        'History': { icon: '🏛️', name: 'History' },
        'Law': { icon: '⚖️', name: 'Law' },
        'Chemistry': { icon: '🧪', name: 'Chemistry' },
        'Languages': { icon: '🗣️', name: 'Languages' }
      };
      const meta = subjectMeta[song.subject] || { icon: '📁', name: song.subject };
      folderIcon.textContent = meta.icon;
      folderName.textContent = meta.name;
    }
  }

  // Slide up animation on load
  setTimeout(() => {
    bottomSheet.classList.add('active');
    modalOverlay.classList.add('active');
  }, 100);

  // Close logic
  const closeModal = () => {
    bottomSheet.classList.remove('active');
    modalOverlay.classList.remove('active');
    
    setTimeout(() => {
      // Return to player page (pass ID or generating state if needed)
      if (activeId) {
        window.location.href = `player.html?id=${activeId}`;
      } else {
        window.location.href = 'player.html';
      }
    }, 400);
  };

  btnClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', closeModal);

  // Handle export actions with visual feedback
  const exportCards = document.querySelectorAll('.export-card');
  exportCards.forEach(card => {
    card.addEventListener('click', () => {
      const icon = card.querySelector('.icon-wrapper svg');
      const originalHtml = icon.innerHTML;
      
      icon.innerHTML = '<polyline points="20 6 9 17 4 12"></polyline>';
      
      setTimeout(() => {
        icon.innerHTML = originalHtml;
        const actionLabel = card.querySelector('.export-label').textContent;
        // Create custom toast alert behavior or simple visual trigger
        alert(`${actionLabel} requested successfully!`);
      }, 600);
    });
  });

  // Folder selector click opens an alert
  const folderSelector = document.querySelector('.folder-selector');
  if (folderSelector) {
    folderSelector.addEventListener('click', () => {
      alert("Changing target folders is premium only.");
    });
  }

  // Save button commits song to localStorage database
  btnSave.addEventListener('click', () => {
    if (song) {
      saveSong(song);
      // Remove pending song since it's now saved
      localStorage.removeItem('studysong_pending_song');
      localStorage.setItem('studysong_active_player_song_id', song.id);
    }

    btnSave.textContent = 'Saved! ✓';
    btnSave.style.background = '#4CAF50';
    btnSave.style.boxShadow = '0 8px 20px rgba(76, 175, 80, 0.3)';
    
    setTimeout(() => {
      closeModal();
    }, 1200);
  });
});
