
  // The `api/webhook.js` file is created to handle the incoming webhook from Shopify.
  // It will receive the order data, process it, and send it to your Vercel application.
  
  import { json } from 'body-parser';
  import { createHmac } from 'crypto';
  
  export default async function handler(req, res) {
    if (req.method === 'POST') {
      const hmac = req.headers['x-shopify-hmac-sha256'];
      const body = await json(req);
      const shopifySecret = process.env.SHOPIFY_WEBHOOK_SECRET;
  
      const hash = createHmac('sha256', shopifySecret)
        .update(JSON.stringify(body))
        .digest('base64');
  
      if (hash === hmac) {
        // The webhook is authentic.
        // Process the order data here.
        console.log('Webhook received and verified:', body);
  
        // Send the order data to your Vercel application.
        const response = await fetch('YOUR_VERCEL_APP_URL', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });
  
        if (response.ok) {
          console.log('Order data sent to Vercel application successfully.');
        } else {
          console.error('Error sending order data to Vercel application:', response.statusText);
        }
  
        res.status(200).send('Webhook received.');
      } else {
        // The webhook is not authentic.
        res.status(401).send('Unauthorized.');
      }
    } else {
      res.setHeader('Allow', 'POST');
      res.status(405).end('Method Not Allowed');
    }
  } 