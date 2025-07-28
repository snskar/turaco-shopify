// assets/form-logic.js
(function(){
  console.log('form-logic.js loaded');
  window.FormDataCache = {};

  // Error handling utility functions
  window.HeartlinkFormErrors = {
    // Initialize error containers if they don't exist
    ensureErrorContainers: function() {
      // Check if general error container exists
      let generalError = document.querySelector('.heartlink-form__error-message-wrapper');
      if (!generalError) {
        console.warn('General error container not found, creating fallback');
        const page1 = document.getElementById('page-1');
        if (page1) {
          const fallback = document.createElement('div');
          fallback.className = 'heartlink-form__error-message-wrapper';
          fallback.setAttribute('role', 'alert');
          fallback.hidden = true;
          fallback.innerHTML = `
            <span class="form__message">
              <span class="svg-wrapper">
                <svg class="icon icon-error" viewBox="0 0 13 13">
                  <circle cx="6.5" cy="6.5" r="5.5" stroke="#fff" stroke-width="2"/>
                  <circle cx="6.5" cy="6.5" r="5.5" fill="#EB001B" stroke="#EB001B" stroke-width=".7"/>
                  <path fill="#fff" d="m6.5 2.5-.5 5h1l-.5-5zm.5 6.5c0 .28-.22.5-.5.5s-.5-.22-.5-.5.22-.5.5-.5.5.22.5.5z"/>
                </svg>
              </span>
              <span class="heartlink-form__error-message"></span>
            </span>
          `;
          page1.insertBefore(fallback, page1.querySelector('.contact__fields'));
        }
      }
    },

    // Show error for a specific field
    showFieldError: function(fieldId, message) {
      const field = document.getElementById(fieldId);
      const errorContainer = document.getElementById(fieldId + '-error');
      const errorText = errorContainer?.querySelector('.error-text');
      
      if (field && errorContainer && errorText) {
        // Set field as invalid
        field.setAttribute('aria-invalid', 'true');
        field.classList.add('field--error');
        
        // Show error message
        errorText.textContent = message;
        errorContainer.hidden = false;
        
        console.log(`Showing field error for ${fieldId}: ${message}`);
      } else {
        console.warn(`Field error container not found for ${fieldId}, using fallback`);
        // Fallback to alert if error containers are missing
        alert(`${message}`);
      }
    },

    // Clear error for a specific field
    clearFieldError: function(fieldId) {
      const field = document.getElementById(fieldId);
      const errorContainer = document.getElementById(fieldId + '-error');
      
      if (field && errorContainer) {
        // Remove invalid state
        field.setAttribute('aria-invalid', 'false');
        field.classList.remove('field--error');
        
        // Hide error message
        errorContainer.hidden = true;
        
        console.log(`Cleared field error for ${fieldId}`);
      }
    },

    // Clear all field errors
    clearAllFieldErrors: function() {
      const requiredFields = ['gifter_name', 'giftee_name', 'relation', 'occasion'];
      requiredFields.forEach(fieldId => this.clearFieldError(fieldId));
      this.clearGeneralError();
    },

    // Show general form error
    showGeneralError: function(message) {
      this.ensureErrorContainers();
      
      const errorWrapper = document.querySelector('.heartlink-form__error-message-wrapper');
      const errorMessage = document.querySelector('.heartlink-form__error-message');
      
      if (errorWrapper && errorMessage) {
        errorMessage.textContent = message;
        errorWrapper.hidden = false;
        
        // Scroll to top to show the error
        errorWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        console.log(`Showing general error: ${message}`);
      } else {
        console.warn('General error container not found, using fallback alert');
        alert(message);
      }
    },

    // Clear general form error
    clearGeneralError: function() {
      const errorWrapper = document.querySelector('.heartlink-form__error-message-wrapper');
      
      if (errorWrapper) {
        errorWrapper.hidden = true;
        console.log('Cleared general error');
      }
    }
  };

  window.goToPage = function(page) {
    console.log('goToPage called with page:', page);
    const page1 = document.getElementById('page-1');
    const page2 = document.getElementById('page-2');
    console.log('Found elements:', { page1: !!page1, page2: !!page2 });

    if (page1 && page2) {
      if (page === 2 && !validatePage1()) {
        console.log('Validation failed for page 1');
        return; // validatePage1() now handles showing errors inline
      }

      console.log('Switching to page:', page);
      if (page === 1) {
        page1.style.display = 'block';
        page2.style.display = 'none';
        console.log('Switched to page 1');
      } else {
        page1.style.display = 'none';
        page2.style.display = 'block';
        console.log('Switched to page 2');
        
        // Add debugging for page 2 button detection
        setTimeout(() => {
          const backBtn = document.getElementById('back_button');
          const saveBtn = document.getElementById('save_button');
          console.log('Page 2 buttons after switch:', { 
            backButton: !!backBtn, 
            saveButton: !!saveBtn,
            backBtnVisible: backBtn?.offsetParent !== null,
            saveBtnVisible: saveBtn?.offsetParent !== null
          });
        }, 50);
        
        window.renderPage2 && window.renderPage2();
        window.initializeCloudinary && window.initializeCloudinary();
      }
    } else {
      console.error('Missing page elements:', { page1, page2 });
    }
  };

  function validatePage1() {
    console.log('Starting validation...');
    
    // Clear all previous errors
    window.HeartlinkFormErrors.clearAllFieldErrors();
    
    const requiredFields = [
      { id: 'gifter_name', label: 'Your Name' },
      { id: 'giftee_name', label: 'Receiver Name' },
      { id: 'relation', label: 'Relation' },
      { id: 'occasion', label: 'Occasion' }
    ];
    
    let hasErrors = false;
    
    for (const field of requiredFields) {
      const element = document.getElementById(field.id);
      const value = element?.value?.trim();
      
      console.log(`Field ${field.id}:`, { element: !!element, value: value, valid: !!(element && value) });
      
      if (!element || !value) {
        window.HeartlinkFormErrors.showFieldError(field.id, `${field.label} is required.`);
        hasErrors = true;
        console.log(`Validation failed at field: ${field.id}`);
      }
    }
    
    if (hasErrors) {
      window.HeartlinkFormErrors.showGeneralError('Please fill out all required fields to continue.');
      return false;
    }
    
    console.log('All validation passed');
    return true;
  }

  // Enhanced saveFormData wrapper with error handling
  window.safeSaveFormData = function() {
    console.log('safeSaveFormData called');
    
    // Clear any previous errors
    window.HeartlinkFormErrors.clearGeneralError();
    
    try {
      if (typeof window.saveFormData === 'function') {
        console.log('Calling window.saveFormData...');
        window.saveFormData();
      } else {
        console.error('window.saveFormData is not a function:', typeof window.saveFormData);
        window.HeartlinkFormErrors.showGeneralError('Form submission failed. Please refresh the page and try again.');
      }
    } catch (error) {
      console.error('Error in saveFormData:', error);
      window.HeartlinkFormErrors.showGeneralError('There was an error saving your form. Please check your information and try again.');
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded fired');
    const appContainer = document.getElementById('custom-form-app');
    console.log('App container found:', !!appContainer);

    // Add real-time error clearing for better UX
    const requiredFields = ['gifter_name', 'giftee_name', 'relation', 'occasion'];
    requiredFields.forEach(fieldId => {
      const field = document.getElementById(fieldId);
      if (field) {
        // Clear error on input change
        const eventType = field.tagName.toLowerCase() === 'select' ? 'change' : 'input';
        field.addEventListener(eventType, function() {
          if (this.getAttribute('aria-invalid') === 'true' && this.value.trim()) {
            window.HeartlinkFormErrors.clearFieldError(fieldId);
            
            // Also clear general error if all fields are now valid
            const allValid = requiredFields.every(id => {
              const element = document.getElementById(id);
              return element?.value?.trim();
            });
            
            if (allValid) {
              window.HeartlinkFormErrors.clearGeneralError();
            }
          }
        });
        
        // Clear error on focus for better immediate feedback
        field.addEventListener('focus', function() {
          if (this.getAttribute('aria-invalid') === 'true') {
            window.HeartlinkFormErrors.clearFieldError(fieldId);
          }
        });
      }
    });

    if (appContainer) {
      console.log('Setting up click listener on app container');
      appContainer.addEventListener('click', (event) => {
        console.log('Click detected on:', event.target);
        console.log('Event target classes:', event.target.className);
        console.log('Event target ID:', event.target.id);
        
        const target = event.target.closest('button');
        console.log('Closest button:', target);
        console.log('Closest button ID:', target?.id);
        console.log('Closest button classes:', target?.className);
        
        if (!target) {
          console.log('No button found in click target');
          return;
        }

        console.log('Button clicked with ID:', target.id);
        if (target.id === 'next_button') {
          console.log('NEXT BUTTON CLICKED - calling goToPage(2)');
          event.preventDefault();
          goToPage(2);
        } else if (target.id === 'back_button') {
          console.log('BACK BUTTON CLICKED - calling goToPage(1)');
          event.preventDefault();
          goToPage(1);
        } else if (target.id === 'save_button') {
          console.log('SAVE BUTTON CLICKED');
          event.preventDefault();
          window.safeSaveFormData();
        } else {
          console.log('Unknown button clicked:', target.id);
        }
      });
    } else {
      console.error('App container not found!');
    }
    
    console.log('Initializing to page 1');
    goToPage(1);
  });

  // Also add a backup direct event listener for all buttons
  setTimeout(() => {
    console.log('Setting up backup event listeners');
    const nextButton = document.getElementById('next_button');
    const backButton = document.getElementById('back_button');
    const saveButton = document.getElementById('save_button');
    
    console.log('Buttons found:', { 
      next: !!nextButton, 
      back: !!backButton, 
      save: !!saveButton 
    });
    
    if (nextButton) {
      nextButton.addEventListener('click', function(e) {
        console.log('DIRECT NEXT BUTTON CLICK DETECTED');
        e.preventDefault();
        goToPage(2);
      });
    }
    
    if (backButton) {
      backButton.addEventListener('click', function(e) {
        console.log('DIRECT BACK BUTTON CLICK DETECTED');
        e.preventDefault();
        goToPage(1);
      });
    }
    
    if (saveButton) {
      saveButton.addEventListener('click', function(e) {
        console.log('DIRECT SAVE BUTTON CLICK DETECTED');
        e.preventDefault();
        window.safeSaveFormData();
      });
    }
  }, 500);
})(); 