/* ============================================
   VALTORI AI - CORE APPLICATION
   Shared utilities, state management, configuration
   ============================================ */

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
    industries: {
        saas: { name: 'SaaS / Software', product: 'Enterprise CRM Software', price: 8500, commission: 0.15 },
        realestate: { name: 'Real Estate', product: 'Premium Property Listing', price: 450000, commission: 0.03 },
        financial: { name: 'Financial Services', product: 'Wealth Management Package', price: 25000, commission: 0.08 },
        consulting: { name: 'Consulting', product: 'Business Strategy Engagement', price: 15000, commission: 0.20 },
        insurance: { name: 'Insurance', product: 'Commercial Insurance Policy', price: 12000, commission: 0.10 },
        healthcare: { name: 'Healthcare', product: 'Medical Equipment System', price: 35000, commission: 0.12 },
        manufacturing: { name: 'Manufacturing', product: 'Industrial Automation Solution', price: 75000, commission: 0.08 },
        ecommerce: { name: 'E-commerce', product: 'E-commerce Platform Package', price: 18000, commission: 0.15 },
        marketing: { name: 'Marketing', product: 'Annual Marketing Retainer', price: 48000, commission: 0.18 },
        business: { name: 'Business Services', product: 'Managed Services Contract', price: 24000, commission: 0.15 }
    },
    
    stages: {
        opening: ['Introduce yourself clearly', 'State your company name', 'Ask if now is a good time'],
        permission: ['Respect their time', 'Ask for 2-3 minutes', 'Create curiosity about results'],
        value: ['Mention a specific pain point', 'Share a success story', 'Quantify the benefit'],
        discovery: ['Ask about their current situation', 'Listen more than you talk', 'Dig deeper with follow-ups'],
        objection: ['Acknowledge their concern', 'Ask clarifying questions', 'Provide proof or examples'],
        close: ['Suggest a specific next step', 'Offer a clear call-to-action', 'Be confident and direct']
    },
    
    salePatterns: [
        "let's do it", "yes i'm interested", "i'll buy", "sounds good", "sign me up",
        "let's proceed", "i'll take it", "deal", "count me in", "i'm in",
        "send contract", "you convinced me", "let's move forward", "i want it", "where do i sign"
    ],
    
    hangupPatterns: [
        "goodbye", "have to go now", "not interested", "don't call again",
        "hanging up", "stop calling", "leave me alone", "no thanks bye",
        "i'm done", "this call is over"
    ]
};

// ============================================
// STATE MANAGEMENT
// ============================================
const State = {
    // Get stats from localStorage
    getStats() {
        try {
            const saved = localStorage.getItem('valtoriStats');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.error('Failed to load stats:', e);
        }
        return {
            totalCalls: 0,
            totalSales: 0,
            totalEarnings: 0,
            totalTime: 0,
            scores: [],
            history: [],
            currentStreak: 0,
            maxStreak: 0
        };
    },
    
    // Save stats to localStorage
    saveStats(stats) {
        try {
            localStorage.setItem('valtoriStats', JSON.stringify(stats));
        } catch (e) {
            console.error('Failed to save stats:', e);
        }
    },
    
    // Get preferences from localStorage
    getPrefs() {
        try {
            const saved = localStorage.getItem('valtoriPrefs');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.error('Failed to load prefs:', e);
        }
        return {
            isFirstCall: true,
            promptsOn: true,
            voiceOn: true,
            difficulty: 'medium'
        };
    },
    
    // Save preferences to localStorage
    savePrefs(prefs) {
        try {
            localStorage.setItem('valtoriPrefs', JSON.stringify(prefs));
        } catch (e) {
            console.error('Failed to save prefs:', e);
        }
    },
    
    // Get current session data (for passing between pages)
    getSession() {
        try {
            const saved = sessionStorage.getItem('valtoriSession');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.error('Failed to load session:', e);
        }
        return null;
    },
    
    // Save current session data
    saveSession(session) {
        try {
            sessionStorage.setItem('valtoriSession', JSON.stringify(session));
        } catch (e) {
            console.error('Failed to save session:', e);
        }
    },
    
    // Clear session data
    clearSession() {
        sessionStorage.removeItem('valtoriSession');
    },
    
    // Get last results (for results page)
    getLastResults() {
        try {
            const saved = sessionStorage.getItem('valtoriResults');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.error('Failed to load results:', e);
        }
        return null;
    },
    
    // Save last results
    saveLastResults(results) {
        try {
            sessionStorage.setItem('valtoriResults', JSON.stringify(results));
        } catch (e) {
            console.error('Failed to save results:', e);
        }
    },
    
    // Get OpenAI key
    getOpenAIKey() {
        return localStorage.getItem('valtoriOpenAIKey') || '';
    },
    
    // Save OpenAI key
    saveOpenAIKey(key) {
        if (key) {
            localStorage.setItem('valtoriOpenAIKey', key);
        } else {
            localStorage.removeItem('valtoriOpenAIKey');
        }
    }
};

// ============================================
// TOAST NOTIFICATIONS
// ============================================
const Toast = {
    container: null,
    
    init() {
        this.container = document.getElementById('toastContainer');
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'toastContainer';
            this.container.className = 'toast-container';
            document.body.appendChild(this.container);
        }
    },
    
    show(message, type = 'info', duration = 3000) {
        if (!this.container) this.init();
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };
        toast.innerHTML = `
            <span class="toast-icon">${icons[type] || icons.info}</span>
            <span class="toast-message">${message}</span>
        `;
        
        this.container.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'toastIn 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },
    
    success(message) { this.show(message, 'success'); },
    error(message) { this.show(message, 'error'); },
    warning(message) { this.show(message, 'warning'); },
    info(message) { this.show(message, 'info'); }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================
const Utils = {
    // Format time in MM:SS
    formatTime(seconds) {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    },
    
    // Format currency
    formatCurrency(amount) {
        return '$' + amount.toLocaleString();
    },
    
    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },
    
    // Get URL parameter
    getUrlParam(name) {
        const params = new URLSearchParams(window.location.search);
        return params.get(name);
    },
    
    // Navigate to page with optional params
    navigateTo(page, params = {}) {
        let url = page;
        const paramString = new URLSearchParams(params).toString();
        if (paramString) {
            url += '?' + paramString;
        }
        window.location.href = url;
    },
    
    // Random pick from array
    randomPick(array) {
        return array[Math.floor(Math.random() * array.length)];
    },
    
    // Clamp number between min and max
    clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }
};

// ============================================
// KEYBOARD SHORTCUTS
// ============================================
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Escape to close modals
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay.active').forEach(modal => {
                modal.classList.remove('active');
            });
        }
    });
}

// ============================================
// API KEY MODAL
// ============================================
function showAPIModal() {
    const modal = document.getElementById('apiModal');
    if (!modal) return;
    
    const statusEl = document.getElementById('apiKeyStatus');
    const inputEl = document.getElementById('apiKeyInput');
    const key = State.getOpenAIKey();
    
    if (key) {
        if (statusEl) statusEl.innerHTML = '<div class="modal-status success">✓ Voice input enabled</div>';
        if (inputEl) inputEl.value = key.substring(0, 7) + '...' + key.slice(-4);
    } else {
        if (statusEl) statusEl.innerHTML = '<div class="modal-status error">Voice input disabled (text still works)</div>';
        if (inputEl) inputEl.value = '';
    }
    
    modal.classList.add('active');
}

function closeAPIModal() {
    const modal = document.getElementById('apiModal');
    if (modal) modal.classList.remove('active');
}

function saveAPIKey() {
    const inputEl = document.getElementById('apiKeyInput');
    if (!inputEl) return;
    
    const key = inputEl.value.trim();
    if (!key) {
        Toast.error('Please enter an API key');
        return;
    }
    if (!key.startsWith('sk-')) {
        Toast.error('Invalid key format (should start with sk-)');
        return;
    }
    
    State.saveOpenAIKey(key);
    Toast.success('API key saved');
    
    const statusEl = document.getElementById('apiKeyStatus');
    if (statusEl) statusEl.innerHTML = '<div class="modal-status success">✓ Saved</div>';
}

function clearAPIKey() {
    State.saveOpenAIKey('');
    
    const statusEl = document.getElementById('apiKeyStatus');
    const inputEl = document.getElementById('apiKeyInput');
    
    if (statusEl) statusEl.innerHTML = '<div class="modal-status error">Cleared</div>';
    if (inputEl) inputEl.value = '';
    
    Toast.info('API key cleared');
}

// ============================================
// INIT ON ALL PAGES
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    Toast.init();
    initKeyboardShortcuts();
});

// Export for use in other modules
window.Valtori = {
    CONFIG,
    State,
    Toast,
    Utils,
    showAPIModal,
    closeAPIModal,
    saveAPIKey,
    clearAPIKey
};
