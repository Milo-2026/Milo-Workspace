// Vercel API - Subscribe to email list via Supabase + Send Resend Email
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        // Add to subscribers table
        const { data, error } = await supabase
            .from('subscribers')
            .upsert([{ 
                email: email, 
                created_at: new Date().toISOString(),
                status: 'active',
                current_day: 0
            }], { onConflict: 'email' });

        if (error) throw error;

        // Send welcome email via Resend
        const resendApiKey = process.env.RESEND_API_KEY;
        if (resendApiKey) {
            const emailHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
    <h1 style="color: #22c55e;">⚡ Welcome to AI Automation Week!</h1>
    
    <p>You're in! Check your inbox tomorrow for Day 1 of your 7-day AI automation course.</p>
    
    <p>Here's what you're getting:</p>
    <ul>
        <li>📅 <strong>Day 1:</strong> Welcome + Why 53% of businesses fail at this</li>
        <li>📊 <strong>Day 2:</strong> The 5 numbers every business needs</li>
        <li>🤖 <strong>Day 3:</strong> Your first AI employee</li>
        <li>⚙️ <strong>Day 4:</strong> 50 tasks you can automate today</li>
        <li>📋 <strong>Day 5:</strong> Your 7-day action plan</li>
        <li>🎁 <strong>Day 6:</strong> Special offer (just for you)</li>
        <li>🚀 <strong>Day 7:</strong> How to get started immediately</li>
    </ul>
    
    <p>See you tomorrow!</p>
    
    <p>— Milo<br>NoCodeLab</p>
    
    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
    <p style="font-size: 12px; color: #666;">
        NoCodeLab helps small businesses automate with AI.<br>
        <a href="https://nocodelab.tech" style="color: #22c55e;">nocodelab.tech</a>
    </p>
</body>
</html>`;

            await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${resendApiKey}`
                },
                body: JSON.stringify({
                    from: 'Milo at NoCodeLab <milo@nocodelab.tech>',
                    to: email,
                    subject: '⚡ Welcome to AI Automation Week!',
                    html: emailHtml
                })
            });
        }

        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
}
