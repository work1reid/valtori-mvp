# Valtori MVP - AI-Powered Sales Training

An AI-powered sales call simulator that helps sales professionals practice their pitch, handle objections, and improve their performance through real-time feedback.

![Valtori](https://img.shields.io/badge/Built%20with-Next.js-black?style=for-the-badge&logo=next.js)
![Claude](https://img.shields.io/badge/Powered%20by-Claude%20AI-orange?style=for-the-badge)

## 🎯 Features

- **Voice-Based Call Simulation** - Real speech recognition and synthesis for natural conversation
- **AI Customer (Alex)** - Realistic prospect powered by Claude AI with dynamic objections
- **Live Conversation Flow** - Natural back-and-forth dialogue with real-time transcription
- **Post-Call Scoring** - Automated evaluation based on confidence, discovery questions, objection handling, and more
- **Actionable Feedback** - Get 3 specific improvement points after each call

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Chrome, Edge, or Safari browser (for voice features)
- Anthropic API access (the app uses Claude Sonnet 4)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/valtori-mvp.git
cd valtori-mvp
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📝 How to Use

1. **Click "Start Call"** - The app will request microphone access
2. **Allow microphone permissions** when prompted
3. **Wait for Alex to greet you** - The AI customer will say "Hi, this is Alex speaking"
4. **Start your pitch** - Speak naturally, the app will transcribe in real-time
5. **Handle objections** - Alex will raise realistic concerns
6. **End the call** - Click the red phone button
7. **Review your score** - Get instant feedback and actionable tips

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18
- **AI**: Anthropic Claude Sonnet 4 API
- **Speech**: Web Speech API (STT), Speech Synthesis API (TTS)
- **Icons**: Lucide React
- **Styling**: Inline CSS with gradients and animations

## 📦 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Deploy! (No environment variables needed - API authentication is handled automatically)

The app will be live at `https://your-project.vercel.app`

### Deploy to Netlify

1. Push your code to GitHub
2. Visit [netlify.com](https://netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Select your GitHub repository
5. Build command: `npm run build`
6. Publish directory: `.next`
7. Deploy!

## ⚠️ Important Notes

### Microphone Access

- **HTTPS Required**: Microphone access only works on HTTPS or localhost
- **Browser Support**: Best performance on Chrome/Edge, Safari works but less reliable
- **Permissions**: Users must explicitly allow microphone access

### API Usage

The app currently calls the Anthropic API directly from the browser. **For production**, you should:

1. Create a backend proxy to hide your API key
2. Implement rate limiting
3. Add user authentication

Example backend (Next.js API route):

```javascript
// pages/api/chat.js
export default async function handler(req, res) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify(req.body)
  });
  
  const data = await response.json();
  res.status(200).json(data);
}
```

Then update the fetch URLs in `ValtoriMVP.js` to `/api/chat` instead of the Anthropic API directly.

## 🔧 Configuration

### Customize the AI Customer

Edit the `systemPrompt` in `components/ValtoriMVP.js`:

```javascript
const systemPrompt = `You are Alex, a realistic sales prospect...
// Customize personality, objections, industry, etc.
`;
```

### Adjust Scoring Criteria

Modify the `generateScore` function to evaluate different metrics:

```javascript
Evaluate based on:
1. Your custom metric
2. Another metric
3. Etc.
```

## 📊 Roadmap

- [ ] Multiple customer personas (skeptical, interested, busy)
- [ ] Custom objection libraries
- [ ] Historical call tracking
- [ ] Team dashboards
- [ ] Export call recordings
- [ ] Integration with CRM systems

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this for your own projects!

## 🙏 Acknowledgments

- Built with [Claude](https://claude.ai) by Anthropic
- Inspired by FXReplay and modern sales training platforms
- Icons by [Lucide](https://lucide.dev)

## 📧 Support

For issues or questions, please open a GitHub issue or contact [your@email.com]

---

**Built with ❤️ for sales professionals who want to level up their game**
