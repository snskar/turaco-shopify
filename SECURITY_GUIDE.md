# Security Guide: Cloudinary Credentials

## ⚠️ IMPORTANT: Never Commit API Keys to Version Control!

This guide explains how to securely handle Cloudinary credentials in your Shopify theme.

## 🔒 Current Security Setup

### ✅ What's Protected
- `.env` files (already in .gitignore)
- `config/cloudinary.json` (added to .gitignore)
- API keys removed from client-side code
- Development config loader for local testing

### 🛡️ Security Measures Implemented

1. **Environment Variables**: Use `.env` files for local development
2. **Config Files**: Separate config files (excluded from git)
3. **Client-Side Protection**: No hardcoded credentials in JavaScript
4. **Development Loader**: Secure loading for local development

## 📁 File Structure

```
├── .env                    # Your actual credentials (NOT committed)
├── env.example            # Example structure (committed)
├── config/
│   └── cloudinary.json    # Development config (NOT committed)
├── assets/
│   ├── cloudinary-config-loader.js  # Development helper
│   └── section-heartlink-form.js    # Main functionality
└── .gitignore             # Protects sensitive files
```

## 🚀 Setup Instructions

### 1. Create Your Environment File

Copy `env.example` to `.env` and fill in your credentials:

```bash
cp env.example .env
```

Edit `.env`:
```env
CLOUDINARY_CLOUD_NAME=dqrj6f0cm
CLOUDINARY_API_KEY=277427975525328
CLOUDINARY_API_SECRET=QNBUG-CT1VmUw3bNVCyWWpK9878
CLOUDINARY_UPLOAD_PRESET=heartlink-uploads
```

### 2. Development Configuration

The `config/cloudinary.json` file is already created with your credentials for local development. This file is **NOT committed to git**.

### 3. Production Setup

For production, use one of these secure methods:

#### Option A: Shopify Metafields (Recommended)
1. Go to Shopify Admin → Settings → Custom data → Metafields
2. Add metafields for your shop:
   - `cloudinary.cloud_name` (Single line text)
   - `cloudinary.upload_preset` (Single line text)
3. Set the values in your Shopify admin

#### Option B: Shopify App
Create a Shopify app that provides configuration via a secure API endpoint.

#### Option C: Environment Variables (Server-side)
If using a build process, set environment variables on your server.

## 🔍 Verification

### Check What's Protected
```bash
# These files should NOT be tracked by git
git status config/cloudinary.json
git status .env

# These files should be tracked
git status env.example
git status .gitignore
```

### Test Local Development
1. Start your local development server
2. Open browser console
3. You should see: "Cloudinary development config loaded"
4. Upload functionality should work

## 🚨 Security Checklist

- [ ] `.env` file created with your credentials
- [ ] `config/cloudinary.json` contains development config
- [ ] Both files are in `.gitignore`
- [ ] No hardcoded credentials in JavaScript files
- [ ] Production uses secure method (metafields/app)
- [ ] API secret is never exposed to client-side

## 🛠️ Troubleshooting

### "Cloudinary not configured" Error
1. Check that `config/cloudinary.json` exists
2. Verify credentials in the config file
3. Ensure you're running on localhost (development only)

### Upload Not Working
1. Check browser console for errors
2. Verify Cloudinary upload preset is created
3. Test with a simple image file

### Production Issues
1. Verify metafields are set in Shopify admin
2. Check that secure endpoint is working
3. Ensure CORS is configured properly

## 📚 Additional Resources

- [Cloudinary Security Best Practices](https://cloudinary.com/documentation/security)
- [Shopify Metafields Documentation](https://help.shopify.com/en/manual/metafields)
- [Environment Variables Best Practices](https://12factor.net/config)

## 🔄 Deployment Process

### Development
1. Use `config/cloudinary.json` for local testing
2. Credentials are loaded automatically on localhost

### Production
1. Set up Shopify metafields with production credentials
2. Deploy theme without sensitive files
3. Test upload functionality on live site

## 🆘 Emergency

If you accidentally committed credentials:

1. **Immediately rotate your API keys** in Cloudinary dashboard
2. Remove the commit from git history
3. Update all references to use new keys
4. Check for any exposed credentials in logs

## 📞 Support

For security concerns:
- Cloudinary Support: [support@cloudinary.com](mailto:support@cloudinary.com)
- Shopify Support: [help.shopify.com](https://help.shopify.com) 