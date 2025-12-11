// api/whisper.js - Fixed version for Vercel
import formidable from 'formidable';
import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';

export const config = {
    api: {
        bodyParser: false, // Disable default body parser
    },
};

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
        console.error('Missing OPENAI_API_KEY environment variable');
        return res.status(500).json({ error: 'Server configuration error' });
    }
    
    try {
        // Parse the incoming FormData
        const form = formidable({ multiples: false });
        
        const { files } = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) reject(err);
                else resolve({ fields, files });
            });
        });
        
        const audioFile = files.file;
        if (!audioFile) {
            return res.status(400).json({ error: 'No audio file provided' });
        }
        
        // Create new FormData for OpenAI API
        const formData = new FormData();
        formData.append('file', fs.createReadStream(audioFile.filepath), {
            filename: 'audio.webm',
            contentType: 'audio/webm',
        });
        formData.append('model', 'whisper-1');
        
        // Send to OpenAI
        const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                ...formData.getHeaders(),
            },
            body: formData,
        });
        
        const data = await response.json();
        
        // Clean up temp file
        try {
            fs.unlinkSync(audioFile.filepath);
        } catch (e) {
            console.error('Failed to delete temp file:', e);
        }
        
        if (!response.ok) {
            console.error('OpenAI API error:', data);
            return res.status(response.status).json(data);
        }
        
        return res.status(200).json(data);
    } catch (error) {
        console.error('Whisper proxy error:', error);
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
}
