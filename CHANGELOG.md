# Changelog

All notable changes to Valtori AI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2024-12-08

### 🎉 Initial Release - MVP Launch

#### Added
- **Voice-Based Simulation**
  - Real-time speech recognition using Web Speech API
  - Text-to-speech AI responses
  - Random voice selection for variety
  
- **AI Conversation Engine**
  - Claude API integration for realistic conversations
  - Adaptive difficulty (easy/medium/hard)
  - Industry-specific customer personas
  - Natural objection handling
  - Can hang up or agree to buy

- **10 Industry Templates**
  - SaaS / Software
  - Real Estate
  - Financial Services
  - Consulting
  - Insurance
  - Healthcare
  - Manufacturing
  - E-commerce
  - Marketing Services
  - Business Services
  - Auto-assigned products with realistic pricing

- **Comprehensive Scoring System**
  - Overall score (0-100)
  - 4 key metrics:
    - Closing Ability
    - Objection Handling
    - Confidence & Energy
    - Rapport Building
  - AI-powered analysis of full conversation
  - Detailed feedback (strengths, improvements, tips)

- **Gamified Analytics**
  - Close rate tracking (%)
  - Virtual commission earnings
  - Total sales counter
  - Practice time tracking
  - Performance trends
  - Full practice history

- **User Experience**
  - Guided tutorial for first-time users
  - Stage-based script prompts (toggleable)
  - 60-second warning system
  - "Call Ended" modal for hang-ups
  - "Sale Closed" celebration (cha-ching sound)
  - FREE BETA badge with feedback link

- **Dashboard**
  - Close rate statistics
  - Earnings tracker
  - Average score with trend indicators
  - Complete call history
  - Performance metrics

#### Technical
- Single-file HTML application
- No dependencies or build process
- Browser-based storage (LocalStorage)
- Claude API for AI conversations
- Responsive design (desktop-optimized)

#### Browser Support
- Chrome/Edge (Full support)
- Safari (Limited voice support)
- Firefox (No speech recognition)

---

## [Unreleased]

### 🚀 Planned Features

#### Phase 2
- [ ] Multiple call scenarios (discovery, demo, objection handling)
- [ ] Custom script upload functionality
- [ ] Export call recordings
- [ ] Enhanced voice quality (ElevenLabs integration)
- [ ] Mobile-responsive design
- [ ] Dark/light theme toggle

#### Phase 3
- [ ] User accounts and authentication
- [ ] Team dashboards
- [ ] Manager analytics view
- [ ] Leaderboards
- [ ] Certification system
- [ ] Email notifications

#### Phase 4
- [ ] CRM integrations (HubSpot, Salesforce)
- [ ] API access
- [ ] Custom branding for enterprises
- [ ] Advanced reporting
- [ ] SSO authentication
- [ ] Mobile apps (iOS/Android)

---

## Version History

### v0.1.0 (Current)
**Status**: MVP / Beta  
**Released**: December 8, 2024  
**Code Name**: "First Call"  

**Core Functionality**:
- Cold call simulation only
- 10 industries
- Adaptive AI difficulty
- Full scoring and analytics
- Browser-based, no accounts

**Known Limitations**:
- Chrome/Edge only for voice
- LocalStorage only (no cloud sync)
- Single scenario type (cold call)
- No team features
- No mobile optimization

---

## Breaking Changes

None yet (initial release)

---

## Deprecations

None yet (initial release)

---

## Security

### v0.1.0
- All processing client-side
- No user data stored on servers
- API calls to Anthropic for AI only
- LocalStorage for practice history
- No authentication required

---

## Performance

### v0.1.0
- **Load Time**: < 2 seconds
- **Voice Recognition**: ~500ms delay
- **AI Response Time**: 1-2 seconds
- **Scoring Time**: 2-3 seconds
- **Browser Memory**: ~50MB average

---

## Bug Fixes

None yet (initial release)

---

## Contributors

- **Max Reid** - Creator & Lead Developer

---

## Notes

This is the MVP release focusing on proof of concept. The goal is to validate:
1. Voice simulation feels realistic
2. Scoring system provides value
3. Users actually practice multiple times
4. "I'd pay for this" feedback

Next version will be based on user feedback and usage data.

---

**Last Updated**: December 8, 2024  
**Next Planned Release**: v0.2.0 (TBD based on feedback)
