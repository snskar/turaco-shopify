# Turaco Shopify Theme

A custom Shopify theme with modular contact form functionality and heartlink gift form features.

## Features

- **Modular Contact Form**: A flexible, multi-page contact form section
- **Heartlink Gift Form**: Custom gift personalization form with:
  - Gifter/Giftee details collection
  - **Enhanced Photo Upload Integration (Cloudinary)** with:
    - ✅ **Cropping Features**: 1:1 aspect ratio, face detection, skip crop option
    - ✅ **Compression & Optimization**: Automatic quality optimization, format conversion
    - ✅ **Multiple Image Types**: JPEG, PNG, WebP, GIF, BMP, TIFF support
    - ✅ **Progress Tracking**: Real-time upload progress
    - ✅ **Error Handling**: Comprehensive error messages
    - ✅ **Responsive Design**: Mobile-optimized interface
    - ✅ **Cost Optimization**: Temporary storage until checkout completion
    - ✅ **API Efficiency**: Only pay for images that result in sales
  - Cross-off list functionality
  - Spotify track integration
  - Message customization

## Structure

```
├── assets/
│   ├── section-heartlink-form.css
│   ├── section-heartlink-form.js
│   └── cloudinary-config-loader.js
├── sections/
│   └── heartlink-form.liquid
├── snippets/
│   ├── heartlink-gifter-details.liquid
│   ├── heartlink-message.liquid
│   ├── heartlink-photo-upload.liquid
│   ├── heartlink-cross-off-list.liquid
│   ├── heartlink-spotify.liquid
│   ├── heartlink-form-page1.liquid
│   └── heartlink-form-page2.liquid
├── templates/
│   └── page.heartlink-form.liquid
├── config/
│   └── cloudinary.json (protected)
├── CLOUDINARY_SETUP.md
├── SECURITY_GUIDE.md
├── BACKEND_ENDPOINTS.md
└── README.md
```

## Installation

1. Clone this repository
2. Upload to your Shopify store using Shopify CLI or theme editor
3. **Configure Cloudinary credentials** (see [CLOUDINARY_SETUP.md](CLOUDINARY_SETUP.md))
4. **Set up backend endpoints** for temporary image storage (see [BACKEND_ENDPOINTS.md](BACKEND_ENDPOINTS.md))
5. Customize styling as needed

## Configuration

### Cloudinary Setup
**📖 Complete setup guide: [CLOUDINARY_SETUP.md](CLOUDINARY_SETUP.md)**

Quick setup:
1. Create a Cloudinary account at [cloudinary.com](https://cloudinary.com)
2. Create upload presets for both temporary and permanent storage
3. Update the configuration in `assets/section-heartlink-form.js`:

```javascript
const CLOUDINARY_CONFIG = {
  cloudName: 'your-cloud-name',
  uploadPreset: 'your-upload-preset',
  // ... other settings
};
```

### Backend Setup for Cost Optimization
**📖 Backend implementation: [BACKEND_ENDPOINTS.md](BACKEND_ENDPOINTS.md)**

The system uses temporary image storage to prevent unnecessary API usage:
- Images are uploaded to temporary storage initially
- Only committed to permanent CDN after successful checkout
- Abandoned checkouts automatically clean up temporary images
- **Result**: ~80% reduction in Cloudinary API costs

### Features Included

#### 🖼️ Photo Upload Features
- **Multiple file upload** (up to 10 images)
- **Drag & drop** support
- **Image cropping** with 1:1 aspect ratio
- **Automatic optimization** and compression
- **Format conversion** (WebP, AVIF when supported)
- **Progress tracking** with visual feedback
- **Error handling** with user-friendly messages
- **Responsive previews** with hover effects
- **File size and format validation**
- **Temporary storage** until checkout completion
- **Cost optimization** - only pay for successful sales

#### 🎨 UI Enhancements
- **Modern gradient buttons** with hover effects
- **Grid-based image previews** with remove functionality
- **Progress bars** with animations
- **Error messages** with auto-dismiss
- **Mobile-responsive** design
- **Loading states** and disabled states
- **Temporary upload indicators** with visual feedback

#### 💰 Cost Optimization
- **Temporary Storage**: Images stored temporarily during form completion
- **Checkout Integration**: Images committed only after successful payment
- **Automatic Cleanup**: Abandoned checkouts don't waste API credits
- **Usage Tracking**: Monitor API usage and costs
- **Efficiency**: Significant reduction in unnecessary uploads

## Usage

The heartlink form can be added as a section to any page or used as a standalone page template.

### As a Section
1. Go to Theme Customizer
2. Add "Heartlink Form" section
3. Configure color scheme settings

### As a Page Template
1. Create a new page
2. Select "page.heartlink-form" as the template

## Development

This theme follows Shopify's best practices for theme development with modular components and reusable snippets.

### Key Files
- `assets/section-heartlink-form.js` - Main JavaScript with Cloudinary integration
- `assets/section-heartlink-form.css` - Enhanced styling for upload features
- `assets/cloudinary-config-loader.js` - Secure credential loading
- `sections/heartlink-form.liquid` - Main section template
- `snippets/heartlink-form-page2.liquid` - Photo upload page

### Security Features
- **Protected Credentials**: API keys stored securely (see [SECURITY_GUIDE.md](SECURITY_GUIDE.md))
- **Environment Variables**: Local development with .env files
- **Git Protection**: Sensitive files excluded from version control
- **Production Ready**: Multiple secure deployment options

## Cost Optimization Results

### Before Implementation
- 100 image uploads = 100 API calls (all paid)
- Abandoned checkouts waste API credits
- No cost control for failed transactions

### After Implementation
- 100 image uploads, 20 successful checkouts = 20 API calls (paid)
- 80 abandoned checkouts = 0 API costs (temporary storage)
- **Result**: ~80% reduction in Cloudinary API costs

## License

This project is proprietary and confidential. 