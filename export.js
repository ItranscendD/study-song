document.addEventListener('DOMContentLoaded', () => {

  const bottomSheet = document.getElementById('bottomSheet');
  const modalOverlay = document.getElementById('modalOverlay');
  const btnClose = document.getElementById('btnClose');

  // Slide up animation on load to simulate opening a modal
  setTimeout(() => {
    bottomSheet.classList.add('active');
    modalOverlay.classList.add('active');
  }, 100);

  // Close logic
  const closeModal = () => {
    bottomSheet.classList.remove('active');
    modalOverlay.classList.remove('active');
    
    // Simulate going back to the player
    setTimeout(() => {
      window.location.href = 'player.html';
    }, 400);
  };

  btnClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', closeModal);

  // Handle export actions
  const exportCards = document.querySelectorAll('.export-card');
  exportCards.forEach(card => {
    card.addEventListener('click', () => {
      // Visual feedback that something is happening
      const icon = card.querySelector('.icon-wrapper svg');
      const originalHtml = icon.innerHTML;
      
      // Change to a checkmark briefly
      icon.innerHTML = '<polyline points="20 6 9 17 4 12"></polyline>';
      
      setTimeout(() => {
        icon.innerHTML = originalHtml;
        alert(card.querySelector('.export-label').textContent + ' started!');
      }, 800);
    });
  });

  // Handle Save
  const btnSave = document.getElementById('btnSave');
  btnSave.addEventListener('click', () => {
    btnSave.textContent = 'Saved! ✓';
    btnSave.style.background = '#4CAF50';
    btnSave.style.boxShadow = '0 8px 20px rgba(76, 175, 80, 0.3)';
    
    setTimeout(() => {
      closeModal();
    }, 1500);
  });

});
