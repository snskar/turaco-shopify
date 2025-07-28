# Cloudinary Setup Guide for Heartlink Form

## Overview
This guide will help you configure Cloudinary for the photo upload feature in your heartlink form. Cloudinary provides automatic image optimization, cropping, compression, and format conversion.

## Features You'll Get

### ✅ Cropping Features
- **Aspect Ratio**: 1:1 (square) cropping
- **Skip Crop Button**: Users can skip cropping if desired
- **Face Detection**: Automatic face detection for better cropping
- **Custom Dimensions**: Users can adjust crop area

### ✅ Compression & Optimization
- **Automatic Quality**: `auto:good` quality setting
- **Format Optimization**: Automatic conversion to WebP/AVIF when supported
- **Size Optimization**: Images resized to 800x800px max
- **Progressive Loading**: Optimized for web performance

### ✅ Image Types Supported
- **JPEG/JPG**: Standard photo format
- **PNG**: For images with transparency
- **WebP**: Modern web-optimized format
- **GIF**: Animated images
- **BMP**: Bitmap images
- **TIFF**: High-quality images

## Step 1: Create Cloudinary Account

1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. Verify your email address

## Step 2: Get Your Credentials

After signing in to your Cloudinary dashboard:

1. **Cloud Name**: Found in the dashboard header (e.g., `my-cloud-name`)
2. **API Key**: Go to Settings → Access Keys → API Key
3. **API Secret**: Go to Settings → Access Keys → API Secret

## Step 3: Create Upload Preset

1. Go to Settings → Upload
2. Scroll to "Upload presets"
3. Click "Add upload preset"
4. Configure the preset:
   - **Name**: `heartlink-uploads` (or your preferred name)
   - **Signing Mode**: `Unsigned` (for client-side uploads)
   - **Folder**: `heartlink-photos` (optional)
   - **Allowed Formats**: `jpg, jpeg, png, webp, gif, bmp, tiff`
   - **Max File Size**: `10MB`
   - **Transformation**: 
     - Quality: `auto:good`
     - Format: `auto`
     - Crop: `fill`
     - Gravity: `auto`
     - Width: `800`
     - Height: `800`

## Step 4: Update Configuration

Edit `assets/section-heartlink-form.js` and update the `CLOUDINARY_CONFIG` object:

```javascript
const CLOUDINARY_CONFIG = {
  cloudName: 'your-cloud-name', // Replace with your cloud name
  uploadPreset: 'heartlink-uploads', // Replace with your upload preset name
  apiKey: 'your-api-key', // Optional: for advanced features
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
```

## Step 5: Test the Upload

1. Open your heartlink form page
2. Navigate to page 2 (Personalize It)
3. Click "Upload Photos"
4. Select an image file
5. Test the cropping feature
6. Verify the upload works

## Advanced Configuration Options

### Custom Transformations
You can modify the image transformations in the config:

```javascript
transformations: {
  quality: 'auto:best', // or 'auto:good', 'auto:low'
  fetch_format: 'webp', // force WebP format
  crop: 'thumb', // different crop modes
  gravity: 'face', // face detection
  width: 1200, // larger images
  height: 1200,
  effect: 'sharpen', // add effects
  radius: 20 // rounded corners
}
```

### Upload Restrictions
```javascript
maxFiles: 5, // reduce max files
maxFileSize: 5242880, // 5MB limit
allowedFormats: ['jpg', 'png'], // restrict formats
```

### Cropping Options
```javascript
cropping: true,
croppingAspectRatio: 16/9, // widescreen
croppingShowDimensions: true,
croppingValidateDimensions: true,
showSkipCropButton: true,
croppingCoordinatesMode: 'percent'
```

## Troubleshooting

### Common Issues

1. **"Cloudinary widget not loaded"**
   - Check if the Cloudinary script is loading
   - Verify internet connection

2. **"Upload failed"**
   - Check your cloud name and upload preset
   - Verify upload preset is set to "Unsigned"
   - Check file size and format restrictions

3. **Images not appearing**
   - Check browser console for errors
   - Verify CORS settings in Cloudinary
   - Check if images are being uploaded to correct folder

### Debug Mode
Add this to your configuration for debugging:

```javascript
debug: true,
console: true
```

## Security Considerations

1. **Upload Preset**: Use unsigned uploads for client-side uploads
2. **File Restrictions**: Limit file types and sizes
3. **Folder Structure**: Organize uploads in folders
4. **Access Control**: Set appropriate access permissions

## Performance Tips

1. **CDN**: Cloudinary automatically serves images via CDN
2. **Responsive Images**: Use `w_auto` for responsive images
3. **Lazy Loading**: Implement lazy loading for image previews
4. **Caching**: Cloudinary handles caching automatically

## Support

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Upload Widget Guide](https://cloudinary.com/documentation/upload_widget)
- [Image Transformations](https://cloudinary.com/documentation/image_transformations)

## Cost Considerations

- **Free Tier**: 25GB storage, 25GB bandwidth/month
- **Paid Plans**: Start at $89/month for more storage/bandwidth
- **Pay-as-you-go**: Available for additional usage

For most small to medium projects, the free tier is sufficient. 