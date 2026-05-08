document.addEventListener('DOMContentLoaded', () => {

  const foldersGrid = document.getElementById('foldersGrid');
  const folderDetail = document.getElementById('folderDetail');
  const btnBack = document.getElementById('btnBack');
  const detailTitle = document.getElementById('detailTitle');
  const fabAdd = document.getElementById('fabAdd');

  // Filter chips interaction
  const filterChips = document.querySelectorAll('.filter-chip');
  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
    });
  });

  // Open folder logic
  const folderTiles = document.querySelectorAll('.folder-tile');
  folderTiles.forEach(tile => {
    tile.addEventListener('click', () => {
      const subject = tile.getAttribute('data-subject');
      
      // Capitalize for title
      detailTitle.textContent = subject.charAt(0).toUpperCase() + subject.slice(1);
      
      // Hide grid, show detail
      foldersGrid.classList.remove('active');
      folderDetail.classList.add('active');
      
      // Hide FAB so it doesn't overlap list excessively, or keep it. Let's keep it.
    });
  });

  // Back button logic
  btnBack.addEventListener('click', () => {
    folderDetail.classList.remove('active');
    foldersGrid.classList.add('active');
  });

  // FAB Interaction
  fabAdd.addEventListener('click', () => {
    window.location.href = 'input.html'; // Go to create flow
  });

});
