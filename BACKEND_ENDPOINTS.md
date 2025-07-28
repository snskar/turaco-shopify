# Backend Endpoints for Temporary Image Storage

## Overview
This system prevents unnecessary Cloudinary API usage by storing images temporarily and only committing them to CDN after successful checkout.

## Key Benefits
- ✅ **Cost Savings**: Only pay for images that result in sales
- ✅ **API Efficiency**: Reduce unnecessary uploads
- ✅ **User Experience**: Seamless upload process
- ✅ **Automatic Cleanup**: Abandoned checkouts don't waste resources

## Required Endpoints

### 1. Commit Images to CDN
**POST** `/apps/commit-cloudinary-images`

Commits temporary images to permanent storage after successful checkout.

**Request:**
```json
{
  "images": [
    {
      "publicId": "temp/image1_abc123",
      "tempId": "temp_1234567890_abc123"
    }
  ],
  "orderId": "shopify_order_123",
  "customerId": "customer_456"
}
```

**Response:**
```json
{
  "success": true,
  "committedImages": [
    {
      "publicId": "permanent/order123/image1_abc123",
      "permanentUrl": "https://res.cloudinary.com/cloud/image/upload/v123/permanent/order123/image1.jpg",
      "tempId": "temp_1234567890_abc123"
    }
  ]
}
```

### 2. Cleanup Temporary Images
**POST** `/apps/cleanup-cloudinary-images`

Removes temporary images when checkout is abandoned.

**Request:**
```json
{
  "images": ["temp/image1_abc123", "temp/image2_def456"]
}
```

**Response:**
```json
{
  "success": true,
  "deletedCount": 2
}
```

## Implementation Examples

### Node.js/Express Backend
```javascript
const express = require('express');
const cloudinary = require('cloudinary').v2;
const app = express();

// Commit images after successful checkout
app.post('/apps/commit-cloudinary-images', async (req, res) => {
  try {
    const { images, orderId } = req.body;
    
    // Verify order is paid
    const order = await verifyShopifyOrder(orderId);
    if (!order || order.financial_status !== 'paid') {
      return res.status(400).json({ error: 'Order not paid' });
    }
    
    const committedImages = [];
    for (const image of images) {
      // Move from temp to permanent folder
      const result = await cloudinary.uploader.rename(
        image.publicId,
        `permanent/${orderId}/${image.publicId.split('/').pop()}`,
        { overwrite: true }
      );
      
      committedImages.push({
        publicId: result.public_id,
        permanentUrl: result.secure_url,
        tempId: image.tempId
      });
    }
    
    res.json({ success: true, committedImages });
  } catch (error) {
    res.status(500).json({ error: 'Commit failed' });
  }
});

// Cleanup abandoned checkouts
app.post('/apps/cleanup-cloudinary-images', async (req, res) => {
  try {
    const { images } = req.body;
    let deletedCount = 0;
    
    for (const publicId of images) {
      await cloudinary.uploader.destroy(publicId);
      deletedCount++;
    }
    
    res.json({ success: true, deletedCount });
  } catch (error) {
    res.status(500).json({ error: 'Cleanup failed' });
  }
});
```

### Shopify Webhook Integration
```javascript
// Listen for successful checkouts
app.post('/webhooks/orders/paid', async (req, res) => {
  const order = req.body;
  
  // Get temporary images from order
  const tempImages = await getOrderMetafields(order.id, 'temp_images');
  
  if (tempImages) {
    await commitImagesToCDN(tempImages, order.id);
  }
  
  res.status(200).send('OK');
});
```

## Cloudinary Setup

### Temporary Upload Preset
Create a preset for temporary uploads:
- **Name**: `temp-uploads`
- **Folder**: `temp`
- **Signing Mode**: `Unsigned`
- **Transformations**: Same as permanent

### Automatic Cleanup
Set up scheduled cleanup for old temporary images:
```javascript
// Run daily to clean up old temp images
cron.schedule('0 2 * * *', async () => {
  const result = await cloudinary.api.delete_resources_by_prefix('temp/', {
    type: 'upload',
    keep_original: false
  });
  console.log('Cleaned up temp images:', result);
});
```

## Security & Best Practices

1. **Verify Order Status**: Only commit images for paid orders
2. **Rate Limiting**: Prevent API abuse
3. **Error Handling**: Graceful degradation
4. **Monitoring**: Track API usage and costs
5. **Backup**: Store image metadata in Shopify metafields

## Cost Optimization Results

- **Before**: 100 uploads = 100 API calls (paid)
- **After**: 100 uploads, 20 checkouts = 20 API calls (paid) + 80 temp (free)

**Savings**: ~80% reduction in API costs! 