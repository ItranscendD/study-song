document.addEventListener('DOMContentLoaded', () => {
  const noteInput = document.getElementById('noteInput');
  const charCount = document.getElementById('charCount');
  const processBtn = document.getElementById('processBtn');
  const MAX_CHARS = 3000;

  noteInput.addEventListener('input', () => {
    const currentLength = noteInput.value.length;
    charCount.textContent = `${currentLength} / ${MAX_CHARS}`;
    
    if (currentLength > 0) {
      processBtn.disabled = false;
    } else {
      processBtn.disabled = true;
    }
    
    // Optional: add visual warning if close to limit
    if (currentLength > MAX_CHARS * 0.9) {
      charCount.style.color = '#FF6B6B';
    } else {
      charCount.style.color = 'var(--text-secondary)';
    }
  });

  // Process button → navigate to customize
  processBtn.addEventListener('click', () => {
    processBtn.textContent = 'Processing...';
    processBtn.disabled = true;
    setTimeout(() => {
      window.location.href = 'customize.html';
    }, 800);
  });

  // Example functionality for the "Try sample notes" button
  const methodBtns = document.querySelectorAll('.method-btn');
  methodBtns[3].addEventListener('click', () => {
    noteInput.value = "The mitochondria is the powerhouse of the cell. It generates most of the chemical energy needed to power the cell's biochemical reactions. Chemical energy produced by the mitochondria is stored in a small molecule called adenosine triphosphate (ATP).";
    // Trigger input event to update char count and button state
    noteInput.dispatchEvent(new Event('input'));
  });

});
