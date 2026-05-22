import { getUser, saveUser, getSettings, saveSettings, isPremium, resetAllData } from './db.js';

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const accountNameEl = document.querySelector('.account-info .account-name');
  const accountEmailEl = document.querySelector('.account-info .account-email');
  const avatarLargeEl = document.querySelector('.avatar-large');
  const premiumCard = document.querySelector('.premium-card');
  const premiumLabel = document.querySelector('.premium-card .account-name');
  const premiumSub = document.querySelector('.premium-card .account-email');

  const editNameModal = document.getElementById('editNameModal');
  const inputName = document.getElementById('inputName');
  const btnCancelName = document.getElementById('btnCancelName');
  const btnSaveName = document.getElementById('btnSaveName');
  const editChip = document.querySelector('.edit-chip');
  const accountRow = document.querySelector('.account-row');

  // Load User Info
  const user = getUser();
  const updateProfileUI = () => {
    const currentUser = getUser();
    if (accountNameEl) accountNameEl.textContent = currentUser.name;
    if (accountEmailEl) accountEmailEl.textContent = currentUser.email;
    if (avatarLargeEl && currentUser.name) {
      avatarLargeEl.textContent = currentUser.name.charAt(0).toUpperCase();
    }
  };
  updateProfileUI();

  // Load Premium Card state
  const checkPremiumStatus = () => {
    if (premiumCard) {
      premiumCard.addEventListener('click', () => {
        if (isPremium()) {
          alert("You are a Pro member! Thank you for supporting StudySong.");
        } else {
          window.location.href = 'paywall.html';
        }
      });
    }

    if (isPremium()) {
      if (premiumLabel) {
        premiumLabel.textContent = 'StudySong Pro Active';
        premiumLabel.style.color = 'var(--color-accent)';
      }
      if (premiumSub) {
        premiumSub.textContent = 'You have unlimited generations enabled';
      }
    }
  };
  checkPremiumStatus();

  // Edit profile name modal
  const openEditModal = () => {
    const currentUser = getUser();
    inputName.value = currentUser.name || '';
    editNameModal.style.display = 'flex';
    inputName.focus();
  };

  const closeEditModal = () => {
    editNameModal.style.display = 'none';
  };

  if (editChip) {
    editChip.addEventListener('click', (e) => {
      e.stopPropagation();
      openEditModal();
    });
  }
  if (accountRow) {
    accountRow.addEventListener('click', () => {
      openEditModal();
    });
  }

  btnCancelName.addEventListener('click', closeEditModal);
  btnSaveName.addEventListener('click', () => {
    const newName = inputName.value.trim();
    if (newName) {
      saveUser({ name: newName });
      updateProfileUI();
      closeEditModal();
    }
  });

  if (inputName) {
    inputName.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        btnSaveName.click();
      } else if (e.key === 'Escape') {
        closeEditModal();
      }
    });
  }

  // Load preferences settings
  const settings = getSettings();

  // Helper to sync toggle elements (clickable on the entire row)
  const syncToggle = (labelText, settingKey) => {
    const rows = document.querySelectorAll('.settings-row');
    let targetRow = null;
    rows.forEach(row => {
      const label = row.querySelector('.row-label');
      if (label && label.textContent.trim().toLowerCase() === labelText.toLowerCase()) {
        targetRow = row;
      }
    });

    if (targetRow) {
      const toggleBtn = targetRow.querySelector('.toggle');
      if (toggleBtn) {
        const isAct = settings[settingKey];
        toggleBtn.classList.toggle('on', !!isAct);
        
        targetRow.style.cursor = 'pointer';
        targetRow.addEventListener('click', () => {
          toggleBtn.classList.toggle('on');
          const nowOn = toggleBtn.classList.contains('on');
          const update = {};
          update[settingKey] = nowOn;
          saveSettings(update);
        });
      }
    }
  };

  syncToggle('Auto-play study mode', 'autoplayStudy');
  syncToggle('Show note context', 'showNoteContext');

  // Helper to sync text rows (Genre, Mood, Era, Speed) with Cycling options
  const syncTextSetting = (labelMatchText, settingKey, optionsArray) => {
    const rows = document.querySelectorAll('.settings-row');
    let targetRow = null;
    rows.forEach(row => {
      const label = row.querySelector('.row-label');
      if (label && label.textContent.trim().toLowerCase() === labelMatchText.toLowerCase()) {
        targetRow = row;
      }
    });

    if (targetRow) {
      const valueEl = targetRow.querySelector('.row-value');
      
      // Initial value
      let currentVal = settings[settingKey] || optionsArray[0];
      if (valueEl) valueEl.textContent = currentVal;

      // Click to cycle values
      targetRow.style.cursor = 'pointer';
      targetRow.addEventListener('click', () => {
        let idx = optionsArray.indexOf(currentVal);
        idx = (idx + 1) % optionsArray.length;
        currentVal = optionsArray[idx];
        if (valueEl) valueEl.textContent = currentVal;
        
        const update = {};
        update[settingKey] = currentVal;
        saveSettings(update);
      });
    }
  };

  syncTextSetting('Default genre', 'defaultGenre', ['Afrobeats', 'Amapiano', 'Pop', 'R&B', 'Hip-Hop', 'Drill', 'Lo-fi', 'Classical']);
  syncTextSetting('Default mood', 'defaultMood', ['Catchy', 'Hype', 'Calm', 'Energetic', 'Chill', 'Focused']);
  syncTextSetting('Default era', 'defaultEra', ['2020s', '2010s', '2000s', '90s', '80s', '70s']);
  syncTextSetting('Playback speed default', 'defaultSpeed', ['1x', '1.5x', '2x', '0.75x']);

  // Sign out click handler
  const signOutRow = document.querySelector('.settings-section:last-child .settings-row');
  if (signOutRow) {
    signOutRow.style.cursor = 'pointer';
    signOutRow.addEventListener('click', () => {
      if (confirm("Are you sure you want to reset all data and sign out? This clears your custom generated songs.")) {
        resetAllData();
        alert("All study states, achievements, and songs cleared successfully!");
        window.location.href = 'onboarding.html';
      }
    });
  }
});
