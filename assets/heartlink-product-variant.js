// Heartlink Product Page Variant Handler
// This script ensures the heartlink form uses the correct variant ID when users change variants

(function() {
  'use strict';

  // Function to update the heartlink form with the selected variant
  function updateHeartlinkVariant() {
    const variantInput = document.querySelector('[name="id"]');
    const heartlinkVariantInput = document.querySelector('.product-variant-id');
    
    if (variantInput && heartlinkVariantInput) {
      heartlinkVariantInput.value = variantInput.value;
      console.log('Updated heartlink form variant ID to:', variantInput.value);
    }
  }

  // Listen for variant changes
  function initVariantWatcher() {
    const variantInput = document.querySelector('[name="id"]');
    
    if (variantInput) {
      // Watch for direct value changes
      const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.type === 'attributes' && mutation.attributeName === 'value') {
            updateHeartlinkVariant();
          }
        });
      });
      
      observer.observe(variantInput, {
        attributes: true,
        attributeFilter: ['value']
      });
      
      // Also listen for input events
      variantInput.addEventListener('change', updateHeartlinkVariant);
      
      // Initial update
      updateHeartlinkVariant();
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVariantWatcher);
  } else {
    initVariantWatcher();
  }

  // Also initialize after a small delay to ensure all other scripts have loaded
  setTimeout(initVariantWatcher, 1000);

})(); 