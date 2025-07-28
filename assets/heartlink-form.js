// assets/heartlink-form.js
(function(){
  const OPTIONS = {
    compliment: {
      COUPLE: [
        "Gorgeous butt","Angel voice","God's best creation","Infectious laugh","Cutest smile",
        "Buttery soft skin","Eyes I want to drown in","In-house comedian","Really witty",
        "Smarty pants","Softest cheeks","Kissable hands","Kindest heart","Funnest person",
        "Model face","Fire figure","Hotter than the sun","Flawless legs","Smarter than Holmes",
        "Lotus eyes","Human sunshine","Killer hips","Sculpted arms","Juicy lips","Fluttery lashes"
      ],
      OTHER: [
        "Angel voice","God's best creation","Infectious laugh","Cutest smile","In-house comedian",
        "Really witty","Smarty pants","Softest cheeks","Kindest heart","Funnest person",
        "Smarter than Holmes","Lotus eyes","Human sunshine","Bright spark","Heart of gold",
        "Endless energy","Joyful soul","Master of jokes","Wise beyond years","Gentle spirit",
        "Bright smile","Thoughtful mind","Steady rock","Creative genius","Cheerful vibe",
        "Pure kindness","Warm hugs specialist"
      ]
    },
    spin: {
      COUPLE: [
        "Movie night","Dinner date","Coffee date","Walk in the park","Shopping spree",
        "Cooking together","Dance class","Massage session","Game night","Puzzle time",
        "Photo session","Karaoke night","Board games","Card games","Video games",
        "Reading together","Writing letters","Drawing session","Music listening","Stargazing"
      ],
      OTHER: [
        "Movie night","Coffee date","Walk in the park","Shopping spree","Cooking together",
        "Game night","Puzzle time","Photo session","Karaoke night","Board games",
        "Card games","Video games","Reading together","Writing letters","Drawing session",
        "Music listening","Stargazing","Hiking","Biking","Swimming"
      ]
    },
    scratch: {
      COUPLE: [
        "Hug coupon","30 mins massage","Room cleaning service","Breakfast in bed",
        "Piggyback ride","Slow dance in living room","Head scratch session",
        "Handwritten poem","A day of \"yes, dear\"","Foot rub anytime","Manicure session"
      ],
      OTHER: [
        "30 mins massage","Room cleaning service","Manicure session",
        "Piggyback ride","Head scratch session","Hug coupon","Handwritten poem","I'll be chef"
      ]
    }
  };

  const currentLists = {
    compliment: [],
    spin: [],
    scratch: []
  };

  function createChipDiv(text, sectionKey, index) {
    const chip = document.createElement('div');
    chip.className = 'cross-off-chip';

    const span = document.createElement('span');
    span.textContent = text;
    chip.appendChild(span);

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'remove-btn';
    btn.innerHTML = '&times;';
    btn.addEventListener('click', () => removeItem(sectionKey, index));
    chip.appendChild(btn);

    return chip;
  }

  function renderSection(key, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    currentLists[key].forEach((item, i) => {
      container.appendChild(createChipDiv(item, key, i));
    });
  }

  window.renderPage2 = function() {
    if (!window._page2Initialized) {
      const rel = window.FormDataCache?.relation || document.getElementById('relation')?.value || 'OTHER';
      const variant = /^(Boyfriend|Girlfriend|Husband|Wife)$/i.test(rel) ? 'COUPLE' : 'OTHER';
      currentLists.compliment = OPTIONS.compliment[variant].slice();
      currentLists.spin = OPTIONS.spin[variant].slice();
      currentLists.scratch = OPTIONS.scratch[variant].slice();
      window._page2Initialized = true;
    }
    renderSection('compliment', 'compliment_chips');
    renderSection('spin', 'spin_chips');
    renderSection('scratch', 'scratch_chips');
    attachAddButtons();
  };

  function removeItem(sectionKey, index) {
    currentLists[sectionKey].splice(index, 1);
    renderSection(sectionKey, sectionKey + '_chips');
  }

  window.addCustomItem = function(sectionKey) {
    const input = document.getElementById(sectionKey + '_custom_input');
    const val = input?.value.trim();
    if (!val) return;
    currentLists[sectionKey].push(val);
    input.value = '';
    renderSection(sectionKey, sectionKey + '_chips');
  };

  function attachAddButtons() {
    ['compliment', 'spin', 'scratch'].forEach(key => {
      const btn = document.querySelector(`#${key}-section .cross-off-add button`);
      if (btn && !btn.dataset.listenerAttached) {
        btn.addEventListener('click', () => window.addCustomItem(key));
        btn.dataset.listenerAttached = 'true';
      }
    });
  }

  window.saveFormData = async function() {
    // --- Data Gathering ---
    // Read data directly from the form fields to ensure it's up-to-date.
    const gifterName = document.getElementById('gifter_name')?.value || '';
    const gifteeName = document.getElementById('giftee_name')?.value || '';
    const relation = document.getElementById('relation')?.value || '';
    const occasion = document.getElementById('occasion')?.value || '';
    const message = document.getElementById('message')?.value || '';
    const photos = window.temporaryImages?.map(img => img.secureUrl) || [];
    const compliments = currentLists.compliment || [];
    const spinIdeas = currentLists.spin || [];
    const scratchCoupons = currentLists.scratch || [];

    // --- Line Item Properties ---
    // These properties will be attached to the product in the cart.
    const lineItemProperties = {
      'Gifter Name': gifterName,
      'Giftee Name': gifteeName,
      'Relation': relation,
      'Occasion': occasion,
      'Message': message,
      // Join arrays for display in order details. Underscores are removed for better readability.
      'Photos': photos.join(', '), 
      'Compliments': compliments.join(', '),
      'Spin the Wheel Ideas': spinIdeas.join(', '),
      'Scratch Card Coupons': scratchCoupons.join(', ')
    };

    // --- Add to Cart Payload ---
    const payload = {
      form_type: 'product',
      utf8: '✓',
      items: [{
        quantity: 1,
        // Get the variant ID from the URL parameter or from the product form
        id: (new URLSearchParams(window.location.search)).get('variant') || 
            document.querySelector('[name="id"]')?.value || 
            document.querySelector('.product-variant-id')?.value || 
            46718886871266,
        properties: lineItemProperties
      }]
    };

    console.log('Adding to cart with payload:', JSON.stringify(payload, null, 2));

    try {
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error('Error adding to cart:', responseData.description || responseData.message || 'Unknown error');
        
        // Show inline error instead of alert
        if (window.HeartlinkFormErrors) {
          window.HeartlinkFormErrors.showGeneralError(`There was an issue adding the product to your cart: ${responseData.description || 'Please try again.'}`);
        } else {
          alert(`There was an issue adding the product to your cart: ${responseData.description || 'Please try again.'}`);
        }
        return;
      }

      console.log('Product added to cart successfully:', responseData);
      
      // Redirect to checkout
      window.location.href = '/checkout';

    } catch (error) {
      console.error('Failed to send "add to cart" request:', error);
      
      // Show inline error instead of alert
      if (window.HeartlinkFormErrors) {
        window.HeartlinkFormErrors.showGeneralError('Could not connect to the server to add your product. Please check your internet connection and try again.');
      } else {
        alert('Could not connect to the server to add your product. Please check your internet connection and try again.');
      }
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    // This is now handled by form-logic.js to prevent race conditions.
  });
})(); 