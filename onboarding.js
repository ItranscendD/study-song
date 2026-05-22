import { saveUser } from './db.js';

document.addEventListener('DOMContentLoaded', () => {
  let currentStep = 1;
  const totalSteps = 3;

  const nextBtn = document.getElementById('nextBtn');
  const stepIndicator = document.getElementById('stepIndicator');
  const progressFill = document.getElementById('progressFill');

  // Handle selections
  const handleSelection = (selector, multiple = true) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      el.addEventListener('click', () => {
        if (!multiple) {
          elements.forEach(e => e.classList.remove('selected'));
        }
        el.classList.toggle('selected');
        updateNextButtonState();
      });
    });
  };

  handleSelection('.subject-card', true);
  handleSelection('.genre-tile', true);
  handleSelection('.mood-pill', true); // Allowing multiple moods

  const updateNextButtonState = () => {
    let hasSelection = false;
    if (currentStep === 1) {
      hasSelection = document.querySelectorAll('.subject-card.selected').length > 0;
    } else if (currentStep === 2) {
      hasSelection = document.querySelectorAll('.genre-tile.selected').length > 0;
    } else if (currentStep === 3) {
      hasSelection = document.querySelectorAll('.mood-pill.selected').length > 0;
      if (hasSelection) {
        nextBtn.textContent = "Finish";
      } else {
        nextBtn.textContent = "Continue";
      }
    }
    nextBtn.disabled = !hasSelection;
  };

  const saveOnboardingData = () => {
    const selectedSubjects = Array.from(document.querySelectorAll('.subject-card.selected .label')).map(el => el.textContent.trim());
    const selectedGenres = Array.from(document.querySelectorAll('.genre-tile.selected .genre-name')).map(el => el.textContent.trim());
    const selectedMoods = Array.from(document.querySelectorAll('.mood-pill.selected')).map(el => el.textContent.trim());

    saveUser({
      subjects: selectedSubjects.length > 0 ? selectedSubjects : ['Biology'],
      genres: selectedGenres.length > 0 ? selectedGenres : ['Pop'],
      moods: selectedMoods.length > 0 ? selectedMoods : ['Catchy']
    });
  };

  const goToStep = (step) => {
    if (step > totalSteps) {
      // Save onboarding data and Redirect to home
      saveOnboardingData();
      window.location.href = 'home.html';
      return;
    }
    
    // Hide current step
    const currentEl = document.getElementById(`step${currentStep}`);
    currentEl.classList.remove('active');
    currentEl.classList.add('exit');

    setTimeout(() => {
      currentEl.classList.remove('exit');
    }, 400);

    // Show next step
    currentStep = step;
    const nextEl = document.getElementById(`step${currentStep}`);
    nextEl.classList.add('active');

    // Update UI
    stepIndicator.textContent = `${currentStep}/${totalSteps}`;
    progressFill.style.width = `${(currentStep / totalSteps) * 100}%`;
    
    if (currentStep === totalSteps) {
      nextBtn.textContent = document.querySelectorAll('.mood-pill.selected').length > 0 ? "Finish" : "Continue";
    }

    updateNextButtonState();
  };

  nextBtn.addEventListener('click', () => {
    goToStep(currentStep + 1);
  });

  // Skip button handler
  document.querySelector('.btn-skip').addEventListener('click', () => {
    if (currentStep < totalSteps) {
       goToStep(currentStep + 1);
    } else {
       goToStep(totalSteps + 1); // Finish
    }
  });

  // Initial state
  updateNextButtonState();
});
