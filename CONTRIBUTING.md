# Contributing to Valtori AI

Thank you for your interest in contributing to Valtori AI! 🎉

This document provides guidelines for contributing to the project.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Style Guidelines](#style-guidelines)

---

## 🤝 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all.

### Our Standards

**Positive behavior includes:**
- Being respectful and inclusive
- Accepting constructive criticism
- Focusing on what's best for the community
- Showing empathy towards others

**Unacceptable behavior includes:**
- Harassment or discriminatory language
- Trolling or insulting comments
- Personal or political attacks
- Publishing others' private information

---

## 💡 How Can I Contribute?

### Reporting Bugs

**Before submitting a bug report:**
1. Check existing issues to avoid duplicates
2. Test in the latest version
3. Try in different browsers

**Bug Report Template:**
```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
 - Browser: [e.g., Chrome 120]
 - OS: [e.g., macOS 14.0]
 - Version: [e.g., 0.1.0]

**Additional context**
Any other context about the problem.
```

### Suggesting Features

**Feature Request Template:**
```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Any alternative solutions or features.

**Additional context**
Any other context or screenshots.
```

### Improving Documentation

- Fix typos or clarify existing docs
- Add examples or use cases
- Translate documentation
- Create tutorials or guides

---

## 🛠️ Development Setup

### Prerequisites

- Modern web browser (Chrome/Edge)
- Text editor (VS Code recommended)
- Git
- Basic HTML/CSS/JavaScript knowledge

### Local Setup

```bash
# 1. Fork the repository on GitHub

# 2. Clone your fork
git clone https://github.com/YOUR-USERNAME/valtori-ai.git
cd valtori-ai

# 3. Create a branch
git checkout -b feature/your-feature-name

# 4. Open in browser
open index.html
# Or use a local server
python3 -m http.server 8000
```

### Project Structure

```
valtori-ai/
├── index.html              # Main application file
├── README.md               # Project documentation
├── CHANGELOG.md            # Version history
├── CONTRIBUTING.md         # This file
├── LICENSE                 # License information
└── .gitignore             # Git ignore rules
```

---

## 🚀 Pull Request Process

### Before Submitting

1. **Test your changes**
   - Works in Chrome/Edge
   - No console errors
   - Voice recognition still works
   - Scoring system functions
   - Data persists correctly

2. **Code Quality**
   - Follow existing code style
   - Add comments for complex logic
   - Keep functions small and focused
   - No unnecessary console.logs

3. **Documentation**
   - Update README if needed
   - Add to CHANGELOG
   - Document new features

### Submitting a PR

1. **Create Pull Request**
   - Clear title describing the change
   - Reference any related issues
   - Describe what was changed and why

2. **PR Template**
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring

## Testing
- [ ] Tested in Chrome
- [ ] Tested in Edge
- [ ] No console errors
- [ ] Voice recognition works
- [ ] Scoring system works

## Screenshots (if applicable)
Add screenshots here

## Related Issues
Closes #(issue number)
```

3. **Review Process**
   - Maintainer will review
   - Address any feedback
   - Once approved, will be merged

---

## 📐 Style Guidelines

### JavaScript

```javascript
// Use const/let, not var
const industryConfig = INDUSTRIES[selectedIndustry];

// Clear function names
function handleUserSpeech(text) {
    // Implementation
}

// Comments for complex logic
// Calculate adaptive difficulty based on average score
// Easy: < 50, Medium: 50-75, Hard: > 75
const difficulty = avgScore > 75 ? 'hard' : avgScore > 50 ? 'medium' : 'easy';

// Avoid magic numbers
const WARNING_THRESHOLD = 60; // seconds
const EXCELLENT_SCORE = 80;
```

### HTML/CSS

```html
<!-- Semantic HTML -->
<section class="dashboard">
    <h2>Your Dashboard</h2>
    <!-- Content -->
</section>

<!-- Clear class names -->
<div class="metric-card">
    <div class="metric-title">Close Rate</div>
    <div class="metric-value">45%</div>
</div>
```

```css
/* CSS Variables for theming */
:root {
    --primary-color: #00f5ff;
    --success-color: #00ff88;
}

/* Clear naming */
.btn-primary {
    background: var(--primary-color);
}

/* Consistent spacing */
.card {
    padding: 2rem;
    margin-bottom: 1.5rem;
}
```

### Git Commit Messages

**Format:**
```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**
```bash
feat(scoring): add confidence metric to analysis

fix(voice): resolve mic permission issue on Safari

docs(readme): update installation instructions

refactor(ai): simplify conversation prompt logic
```

---

## 🧪 Testing Guidelines

### Manual Testing Checklist

**Before submitting any PR, test:**

- [ ] Landing page loads correctly
- [ ] Industry selection works
- [ ] Tutorial modal appears on first use
- [ ] Microphone permission prompt works
- [ ] Voice recognition captures speech
- [ ] AI responds with voice
- [ ] Transcript updates in real-time
- [ ] Prompts appear/disappear correctly
- [ ] Timer counts correctly
- [ ] 60-second warning shows
- [ ] Sale celebration works (cha-ching)
- [ ] Hang-up modal works
- [ ] Scoring screen displays correctly
- [ ] All 4 metrics show
- [ ] Feedback is relevant
- [ ] Dashboard updates
- [ ] History shows past calls
- [ ] Stats calculate correctly
- [ ] LocalStorage persists data
- [ ] No console errors

### Browser Testing

Test in:
- ✅ Chrome (latest)
- ✅ Edge (latest)
- ⚠️ Safari (note limitations)

---

## 📝 Documentation Standards

### Code Comments

```javascript
/**
 * Calculates the overall score based on 4 metrics
 * @param {Object} metrics - Contains closing, objection, confidence, rapport scores
 * @returns {number} Overall score (0-100)
 */
function calculateOverallScore(metrics) {
    // Implementation
}
```

### README Updates

When adding features, update:
- Feature list
- Usage instructions
- Screenshots (if UI changed)
- Technical details (if architecture changed)

---

## 🎯 Priority Areas

**High Priority:**
- Bug fixes
- Performance improvements
- Browser compatibility
- Documentation clarity

**Medium Priority:**
- New features from roadmap
- UI/UX improvements
- Code refactoring

**Low Priority:**
- Minor style changes
- Optional features
- Experimental ideas

---

## 💬 Communication

### Discussions
- Use GitHub Discussions for questions
- Check existing discussions first
- Be respectful and constructive

### Issues
- Use GitHub Issues for bugs/features
- Follow issue templates
- Provide clear details

### Contact
- **Email**: max@workreid.com
- **Twitter**: @maxreid
- **GitHub**: @maxreid

---

## 🏆 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md (if we create one)
- Mentioned in release notes
- Credited in documentation

---

## ❓ Questions?

If you have questions about contributing:
1. Check existing documentation
2. Search closed issues
3. Ask in GitHub Discussions
4. Contact maintainer

---

**Thank you for contributing to Valtori AI! 🚀**

Every contribution, no matter how small, makes a difference.
