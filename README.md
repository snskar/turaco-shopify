# Turaco Shopify Theme

A custom Shopify theme with modular contact form functionality and heartlink gift form features.

## Features

- **Modular Contact Form**: A flexible, multi-page contact form section
- **Heartlink Gift Form**: Custom gift personalization form with:
  - Gifter/Giftee details collection
  - Photo upload integration (Cloudinary)
  - Cross-off list functionality
  - Spotify track integration
  - Message customization

## Structure

```
├── assets/
│   ├── section-heartlink-form.css
│   └── section-heartlink-form.js
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
└── README.md
```

## Installation

1. Clone this repository
2. Upload to your Shopify store using Shopify CLI or theme editor
3. Configure Cloudinary credentials in the JavaScript file
4. Customize styling as needed

## Configuration

### Cloudinary Setup
Update the following in `assets/section-heartlink-form.js`:
```javascript
cloudName: 'YOUR_CLOUD_NAME',
uploadPreset: 'YOUR_UPLOAD_PRESET',
```

## Usage

The heartlink form can be added as a section to any page or used as a standalone page template.

### As a Section
1. Go to Theme Customizer
2. Add "Modular Contact Form" section
3. Configure color scheme settings

### As a Page Template
1. Create a new page
2. Select "page.heartlink-form" as the template

## Development

This theme follows Shopify's best practices for theme development with modular components and reusable snippets.

## License

This project is proprietary and confidential. 