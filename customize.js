document.addEventListener('DOMContentLoaded', () => {

  const setupSelector = (groupName) => {
    const buttons = document.querySelectorAll(`button[data-group="${groupName}"]`);
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove selected class from all in this group
        buttons.forEach(b => b.classList.remove('selected'));
        // Add to clicked
        btn.classList.add('selected');
        
        // Ensure smooth scroll to center the selected item
        btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      });
    });
  };

  setupSelector('genre');
  setupSelector('era');
  setupSelector('mood');

  const generateBtn = document.getElementById('generateBtn');
  generateBtn.addEventListener('click', () => {
    // Simple UI state transition to show it's working
    generateBtn.innerHTML = 'Generating... 🎧';
    generateBtn.style.opacity = '0.8';
    generateBtn.disabled = true;
    
    // Navigate to player after brief loading state
    setTimeout(() => {
      window.location.href = 'player.html';
    }, 1500);
  });

});
