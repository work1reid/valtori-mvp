// api/whisper.js
// Backend proxy for OpenAI Whisper (voice transcription)

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        // Use server-side environment variable (SECURE!)
        const apiKey = process.env.OPENAI_API_KEY;
        
        if (!apiKey) {
            console.error('Missing OPENAI_API_KEY environment variable');
            return res.status(500).json({ error: 'Server configuration error' });
        }
        
        // Forward audio to OpenAI Whisper
        const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`
            },
            body: req.body
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            console.error('OpenAI API error:', data);
            return res.status(response.status).json(data);
        }
        
        return res.status(200).json(data);
    } catch (error) {
        console.error('Whisper proxy error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
