import { getSongs, toggleFavorite } from './db.js';

document.addEventListener('DOMContentLoaded', () => {
  const foldersGrid = document.getElementById('foldersGrid');
  const folderDetail = document.getElementById('folderDetail');
  const btnBack = document.getElementById('btnBack');
  const detailTitle = document.getElementById('detailTitle');
  const fabAdd = document.getElementById('fabAdd');
  const filterChips = document.querySelectorAll('.filter-chip');
  const folderTiles = document.querySelectorAll('.folder-tile');
  const songListContainer = document.querySelector('.song-list');
  const toggleEmptyBtn = document.querySelector('.library-header .btn-icon');

  // Simulated empty library state tracker
  let isSimulatedEmpty = false;

  // Retrieve current songs
  const fetchActiveSongs = () => {
    if (isSimulatedEmpty) return [];
    return getSongs();
  };

  // Sync folder tiles counts and dates
  const updateFoldersUI = () => {
    const activeSongs = fetchActiveSongs();

    // Group songs by subject
    const subjectCounts = {};
    activeSongs.forEach(song => {
      const subKey = song.subject.toLowerCase();
      subjectCounts[subKey] = (subjectCounts[subKey] || 0) + 1;
    });

    folderTiles.forEach(tile => {
      const subject = tile.getAttribute('data-subject').toLowerCase();
      const count = subjectCounts[subject] || 0;
      const countEl = tile.querySelector('.song-count');
      if (countEl) {
        countEl.textContent = `${count} song${count !== 1 ? 's' : ''}`;
      }
      
      // Dynamic last edited fallback
      const editedEl = tile.querySelector('.last-edited');
      if (editedEl) {
        if (count > 0) {
          editedEl.textContent = 'Edited recently';
        } else {
          editedEl.textContent = 'Empty folder';
        }
      }
    });
  };

  // Render song items inside detail list
  const renderDetailList = (subjectName) => {
    const activeSongs = fetchActiveSongs();
    const subNameLower = subjectName.toLowerCase();
    
    // Filter songs by subject
    let filteredSongs = activeSongs.filter(s => s.subject.toLowerCase() === subNameLower);

    songListContainer.innerHTML = '';

    if (filteredSongs.length === 0) {
      // Empty Folder State
      songListContainer.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding: 40px 20px; text-align:center;">
          <div style="font-size:48px; margin-bottom:12px; filter: drop-shadow(0 0 10px rgba(124,77,255,0.3));">📁</div>
          <h3 style="font-family:'Syne',sans-serif; color:var(--text-primary); font-size:1.1rem; margin-bottom:6px;">No songs here yet</h3>
          <p style="color:var(--text-muted); font-size:0.85rem; margin-bottom:20px; max-width:200px;">Create your first study bop for ${subjectName}!</p>
          <button id="btnCreateEmptyFolder" style="background:var(--color-primary); border:none; border-radius:var(--radius-pill); color:#fff; font-family:'DM Sans',sans-serif; font-weight:700; padding:10px 24px; font-size:0.85rem; cursor:pointer; box-shadow:var(--elevation-glow);">
            Start creating
          </button>
        </div>
      `;
      const btnCreate = document.getElementById('btnCreateEmptyFolder');
      if (btnCreate) {
        btnCreate.addEventListener('click', () => {
          localStorage.setItem('studysong_current_subject', subjectName);
          window.location.href = 'input.html';
        });
      }
      return;
    }

    filteredSongs.forEach(song => {
      const item = document.createElement('div');
      item.className = 'song-item';
      item.style.cursor = 'pointer';
      
      const isFav = song.favorite;
      const favColor = isFav ? 'var(--color-accent)' : 'var(--text-secondary)';

      item.innerHTML = `
        <button class="btn-preview"><svg viewBox="0 0 24 24" fill="currentColor"><polygon points="8 5 19 12 8 19 8 5"></polygon></svg></button>
        <div class="song-info" style="flex:1;">
          <span class="song-name" style="font-weight:600; color:var(--text-primary);">${song.name}</span>
          <span class="song-meta">${song.genre} • ${song.duration}</span>
        </div>
        <button class="btn-fav" style="background:none; border:none; color:${favColor}; cursor:pointer; padding: 4px; display:flex; align-items:center; justify-content:center; margin-right:8px;">
          <svg viewBox="0 0 24 24" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:20px; height:20px;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        </button>
      `;

      // Click to toggle favorite status
      const favBtn = item.querySelector('.btn-fav');
      favBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFavorite(song.id);
        renderDetailList(subjectName);
        updateFoldersUI();
      });

      // Click item to load in player
      item.addEventListener('click', (e) => {
        if (e.target.closest('.btn-fav')) return;
        window.location.href = `player.html?id=${song.id}`;
      });

      songListContainer.appendChild(item);
    });
  };

  // Open folder logic
  folderTiles.forEach(tile => {
    tile.addEventListener('click', () => {
      const subject = tile.getAttribute('data-subject');
      const subjectFormatted = subject.charAt(0).toUpperCase() + subject.slice(1);
      
      detailTitle.textContent = subjectFormatted;
      
      // Render the detailed songs list
      renderDetailList(subjectFormatted);

      // Hide grid, show detail
      foldersGrid.classList.remove('active');
      folderDetail.classList.add('active');
    });
  });

  // Back button logic
  btnBack.addEventListener('click', () => {
    folderDetail.classList.remove('active');
    foldersGrid.classList.add('active');
    updateFoldersUI();
  });

  // Filter chips interaction
  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const chipText = chip.textContent.trim().toLowerCase();

      if (chipText === 'favorites') {
        // Render all starred favorites in the detailed list directly
        detailTitle.textContent = 'Starred Favorites';
        songListContainer.innerHTML = '';
        
        const activeSongs = fetchActiveSongs();
        const favSongs = activeSongs.filter(s => s.favorite);

        if (favSongs.length === 0) {
          songListContainer.innerHTML = `
            <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding: 40px 20px; text-align:center;">
              <span style="font-size:44px; margin-bottom:12px; color: var(--color-accent);">★</span>
              <h3 style="font-family:'Syne',sans-serif; color:var(--text-primary); font-size:1.1rem; margin-bottom:6px;">No favorites yet</h3>
              <p style="color:var(--text-muted); font-size:0.85rem; max-width:200px;">Star your preferred study bops to access them quickly here.</p>
            </div>
          `;
        } else {
          favSongs.forEach(song => {
            const item = document.createElement('div');
            item.className = 'song-item';
            item.style.cursor = 'pointer';
            item.innerHTML = `
              <button class="btn-preview"><svg viewBox="0 0 24 24" fill="currentColor"><polygon points="8 5 19 12 8 19 8 5"></polygon></svg></button>
              <div class="song-info" style="flex:1;">
                <span class="song-name" style="font-weight:600; color:var(--text-primary);">${song.name}</span>
                <span class="song-meta">${song.subject} • ${song.genre}</span>
              </div>
              <button class="btn-fav" style="background:none; border:none; color:var(--color-accent); cursor:pointer; padding: 4px; display:flex; align-items:center; justify-content:center; margin-right:8px;">
                <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:20px; height:20px;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </button>
            `;
            
            item.querySelector('.btn-fav').addEventListener('click', (e) => {
              e.stopPropagation();
              toggleFavorite(song.id);
              chip.click(); // re-trigger filtering
            });

            item.addEventListener('click', () => {
              window.location.href = `player.html?id=${song.id}`;
            });
            songListContainer.appendChild(item);
          });
        }

        // Hide grid, show detail list
        foldersGrid.classList.remove('active');
        folderDetail.classList.add('active');

      } else if (chipText === 'all') {
        // Restore normal grid view
        folderDetail.classList.remove('active');
        foldersGrid.classList.add('active');
        updateFoldersUI();
      }
    });
  });

  // FAB Interaction
  fabAdd.addEventListener('click', () => {
    window.location.href = 'input.html';
  });

  // Toggle Simulated Empty Library
  if (toggleEmptyBtn) {
    toggleEmptyBtn.title = "Toggle Empty State for testing";
    toggleEmptyBtn.addEventListener('click', () => {
      isSimulatedEmpty = !isSimulatedEmpty;
      
      // Visual feedback of simulated empty mode toggled
      if (isSimulatedEmpty) {
        toggleEmptyBtn.style.color = 'var(--color-error)';
        toggleEmptyBtn.style.borderColor = 'var(--color-error)';
        
        // Render global empty state layout
        const mainContent = document.getElementById('mainContent');
        if (mainContent) {
          mainContent.dataset.originalHtml = mainContent.innerHTML;
          mainContent.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 350px; padding: 2rem; position:relative; z-index:1;">
              <!-- Illustration -->
              <div style="position: relative; width: 140px; height: 140px; margin-bottom: 2rem; display: flex; align-items: center; justify-content: center;">
                <svg viewBox="0 0 136 136" fill="none" style="width: 100px; height: 100px; filter: drop-shadow(0 0 12px rgba(124,77,255,0.3));">
                  <circle cx="68" cy="68" r="60" stroke="rgba(124,77,255,0.12)" stroke-width="1" stroke-dasharray="4 6"/>
                  <rect x="22" y="52" width="92" height="64" rx="8" fill="#1E1830" stroke="rgba(124,77,255,0.5)" stroke-width="1.5"/>
                  <path d="M22 52 L22 46 Q22 42 26 42 L55 42 Q60 42 62 46 L66 52 Z" fill="#2A2040" stroke="rgba(124,77,255,0.4)" stroke-width="1.5"/>
                  <rect x="22" y="48" width="92" height="18" rx="5" fill="#2A2040" stroke="rgba(124,77,255,0.45)" stroke-width="1.5"/>
                </svg>
              </div>
              <h2 style="font-family:'Syne',sans-serif; font-weight:800; font-size:20px; color:var(--text-primary); text-align:center; margin-bottom:8px;">No songs yet</h2>
              <p style="color:var(--text-muted); font-size:14px; text-align:center; max-width:210px;">Songs you create get saved here</p>
            </div>
          `;
        }
      } else {
        toggleEmptyBtn.style.color = 'var(--text-primary)';
        toggleEmptyBtn.style.borderColor = 'var(--surface-divider)';
        
        // Restore original HTML
        const mainContent = document.getElementById('mainContent');
        if (mainContent && mainContent.dataset.originalHtml) {
          mainContent.innerHTML = mainContent.dataset.originalHtml;
          
          // Re-query elements that were replaced
          location.reload(); // Quick refresh to re-bind events
        }
      }
      updateFoldersUI();
    });
  }

  // Parse URL query parameter on init
  const urlParams = new URLSearchParams(window.location.search);
  const folderParam = urlParams.get('folder');
  if (folderParam) {
    const tile = document.querySelector(`.folder-tile[data-subject="${folderParam.toLowerCase()}"]`);
    if (tile) {
      tile.click();
    }
  }

  // Initial load
  updateFoldersUI();
});
