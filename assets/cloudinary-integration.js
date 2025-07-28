// assets/cloudinary-integration.js
(function(){
  // Cloudinary Configuration
  const CLOUDINARY_CONFIG = {
    cloudName: 'dqrj6f0cm',
    uploadPreset: 'heartlink-uploads',
    apiKey: '277427975525328',
    maxFiles: 10,
    maxFileSize: 10485760, // 10MB
    allowedFormats: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'tiff'],
    transformations: {
      quality: 'auto:good',
      fetch_format: 'auto',
      crop: 'fill',
      gravity: 'auto',
      width: 800,
      height: 800
    }
  };

  let cloudinaryWidget = null;
  window.temporaryImages = [];

  function initializeCloudinaryWidget() {
    if (typeof cloudinary === 'undefined') {
      console.error('Cloudinary widget not loaded');
      return;
    }

    if (cloudinaryWidget) return;

    cloudinaryWidget = cloudinary.createUploadWidget({
      cloudName: CLOUDINARY_CONFIG.cloudName,
      uploadPreset: CLOUDINARY_CONFIG.uploadPreset,
      apiKey: CLOUDINARY_CONFIG.apiKey,
      multiple: true,
      maxFiles: CLOUDINARY_CONFIG.maxFiles,
      maxFileSize: CLOUDINARY_CONFIG.maxFileSize,
      allowedFormats: CLOUDINARY_CONFIG.allowedFormats,
      cropping: true,
      croppingAspectRatio: 1,
      croppingShowDimensions: true,
      croppingValidateDimensions: false,
      showSkipCropButton: true,
      croppingCoordinatesMode: 'percent',
    }, handleCloudinaryCallback);

    const uploadButton = document.getElementById('cloudinary_upload_button');
    if (uploadButton) {
      uploadButton.onclick = function(e) {
        e.preventDefault();
        if (cloudinaryWidget) {
          cloudinaryWidget.open();
        } else {
          console.error('Cloudinary widget not initialized');
        }
      };
      uploadButton.disabled = false;
    }
    console.log('Cloudinary widget initialized and upload button enabled');
  }

  function handleCloudinaryCallback(error, result) {
    if (error) {
      console.error('Cloudinary upload error:', error);
      return;
    }

    if (result.event === 'success') {
      const imageData = {
        publicId: result.info.public_id,
        secureUrl: result.info.secure_url,
        thumbnailUrl: result.info.secure_url.replace('/upload/', '/upload/c_thumb,g_face,w_150,h_150/'),
        originalUrl: result.info.secure_url,
        format: result.info.format,
        size: result.info.bytes,
        width: result.info.width,
        height: result.info.height,
        uploadedAt: new Date().toISOString(),
        isTemporary: true,
        tempId: 'temp_' + Date.now()
      };

      window.temporaryImages.push(imageData);
      addImagePreview(imageData);
      updateUploadCount();
    }
  }

  function addImagePreview(imageData) {
    const previewContainer = document.getElementById('photo_previews');
    if (!previewContainer) return;

    const previewDiv = document.createElement('div');
    previewDiv.className = 'image-preview';
    previewDiv.dataset.tempId = imageData.tempId;

    const img = document.createElement('img');
    img.src = imageData.thumbnailUrl;
    img.alt = 'Uploaded photo';
    img.className = 'preview-image';

    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-image-btn';
    removeBtn.innerHTML = '&times;';
    removeBtn.onclick = () => removeImage(imageData.tempId);

    previewDiv.appendChild(img);
    previewDiv.appendChild(removeBtn);
    previewContainer.appendChild(previewDiv);
  }

  function removeImage(tempId) {
    window.temporaryImages = window.temporaryImages.filter(img => img.tempId !== tempId);
    
    const previewElement = document.querySelector(`[data-temp-id="${tempId}"]`);
    if (previewElement) {
      previewElement.remove();
    }
    
    updateUploadCount();
  }

  function updateUploadCount() {
    const button = document.getElementById('cloudinary_upload_button');
    if (button) {
      const remaining = CLOUDINARY_CONFIG.maxFiles - window.temporaryImages.length;
      button.textContent = `Upload Photos (${window.temporaryImages.length}/${CLOUDINARY_CONFIG.maxFiles})`;
      
      if (remaining <= 0) {
        button.disabled = true;
        button.textContent = 'Maximum photos reached';
      } else {
        button.disabled = false;
      }
    }
  }

  function waitForCloudinaryAndInit() {
    if (typeof cloudinary !== 'undefined') {
      initializeCloudinaryWidget();
    } else {
      setTimeout(waitForCloudinaryAndInit, 100);
    }
  }

  window.initializeCloudinary = waitForCloudinaryAndInit;
  
})(); 