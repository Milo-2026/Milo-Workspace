// Vercel API - Stripe Webhook for purchase confirmations
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        
        const customerEmail = session.customer_details?.email;
        const productName = session.metadata?.product_name || 'Unknown Product';
        
        if (customerEmail) {
            // Add to purchases table
            await supabase.from('purchases').insert([{
                email: customerEmail,
                product: productName,
                amount: session.amount_total,
                stripe_session_id: session.id,
                created_at: new Date().toISOString(),
                status: 'completed'
            }]);
            
            console.log(`Purchase recorded: ${customerEmail} - ${productName}`);
        }
    }

    res.json({ received: true });
}
