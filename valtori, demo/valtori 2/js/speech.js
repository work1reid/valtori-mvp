/* ============================================
   VALTORI AI - SPEECH MODULE
   Voice input (Whisper) and output (Web Speech API)
   ============================================ */

const Speech = {
    // Speech synthesis
    synth: window.speechSynthesis,
    voices: [],
    voiceEnabled: true,
    
    // Recording state
    mediaRecorder: null,
    audioChunks: [],
    isRecording: false,
    recordingTimeout: null,
    
    // Callbacks
    onTranscription: null,
    onRecordingStart: null,
    onRecordingEnd: null,
    onSpeakingStart: null,
    onSpeakingEnd: null,
    
    // Initialize
    init() {
        // Load voices
        if (this.synth) {
            this.voices = this.synth.getVoices();
            this.synth.onvoiceschanged = () => {
                this.voices = this.synth.getVoices();
            };
        }
        
        // Load preference
        const prefs = Valtori.State.getPrefs();
        this.voiceEnabled = prefs.voiceOn !== false;
    },
    
    // Enable/disable voice output
    setVoiceEnabled(enabled) {
        this.voiceEnabled = enabled;
        const prefs = Valtori.State.getPrefs();
        prefs.voiceOn = enabled;
        Valtori.State.savePrefs(prefs);
    },
    
    // Speak text
    speak(text, callback) {
        if (!this.voiceEnabled || !this.synth) {
            if (callback) setTimeout(callback, 300);
            return;
        }
        
        // Cancel any ongoing speech
        this.synth.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Get English voice
        if (this.voices.length === 0) {
            this.voices = this.synth.getVoices();
        }
        const englishVoices = this.voices.filter(v => v.lang.startsWith('en'));
        if (englishVoices.length > 0) {
            utterance.voice = englishVoices[0];
        }
        
        utterance.rate = 0.95;
        utterance.pitch = 1;
        
        utterance.onstart = () => {
            if (this.onSpeakingStart) this.onSpeakingStart();
        };
        
        utterance.onend = () => {
            if (this.onSpeakingEnd) this.onSpeakingEnd();
            if (callback) callback();
        };
        
        utterance.onerror = () => {
            if (this.onSpeakingEnd) this.onSpeakingEnd();
            if (callback) callback();
        };
        
        this.synth.speak(utterance);
    },
    
    // Stop speaking
    stopSpeaking() {
        if (this.synth) {
            this.synth.cancel();
        }
    },
    
    // Start recording
    async startRecording() {
        const apiKey = Valtori.State.getOpenAIKey();
        if (!apiKey) {
            Valtori.Toast.warning('Set OpenAI API key for voice input');
            Valtori.showAPIModal();
            return false;
        }
        
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            this.mediaRecorder = new MediaRecorder(stream);
            this.audioChunks = [];
            
            this.mediaRecorder.ondataavailable = (e) => {
                this.audioChunks.push(e.data);
            };
            
            this.mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
                stream.getTracks().forEach(track => track.stop());
                
                if (this.onRecordingEnd) this.onRecordingEnd();
                
                await this.transcribeAudio(audioBlob);
            };
            
            this.mediaRecorder.onerror = () => {
                stream.getTracks().forEach(track => track.stop());
                this.isRecording = false;
                if (this.onRecordingEnd) this.onRecordingEnd();
                Valtori.Toast.error('Recording error');
            };
            
            this.mediaRecorder.start();
            this.isRecording = true;
            
            if (this.onRecordingStart) this.onRecordingStart();
            
            // Auto-stop after 60 seconds
            this.recordingTimeout = setTimeout(() => {
                if (this.isRecording) {
                    this.stopRecording();
                }
            }, 60000);
            
            return true;
            
        } catch (e) {
            console.error('Microphone access error:', e);
            Valtori.Toast.error('Could not access microphone');
            return false;
        }
    },
    
    // Stop recording
    stopRecording() {
        if (this.recordingTimeout) {
            clearTimeout(this.recordingTimeout);
            this.recordingTimeout = null;
        }
        
        if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
            this.isRecording = false;
            this.mediaRecorder.stop();
        }
    },
    
    // Toggle recording
    async toggleRecording() {
        if (this.isRecording) {
            this.stopRecording();
        } else {
            await this.startRecording();
        }
        return this.isRecording;
    },
    
    // Transcribe audio using Whisper API
    async transcribeAudio(audioBlob) {
        const apiKey = Valtori.State.getOpenAIKey();
        if (!apiKey) {
            Valtori.Toast.error('No API key');
            return;
        }
        
        try {
            const formData = new FormData();
            formData.append('file', audioBlob, 'audio.webm');
            formData.append('model', 'whisper-1');
            
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 30000);
            
            const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`
                },
                body: formData,
                signal: controller.signal
            });
            
            clearTimeout(timeout);
            
            if (!response.ok) {
                if (response.status === 401) {
                    Valtori.Toast.error('Invalid API key');
                    Valtori.showAPIModal();
                } else if (response.status === 429) {
                    Valtori.Toast.warning('Rate limited - please wait');
                } else {
                    Valtori.Toast.error('Transcription failed');
                }
                return;
            }
            
            const data = await response.json();
            
            if (data.text && data.text.trim()) {
                if (this.onTranscription) {
                    this.onTranscription(data.text.trim());
                }
            } else {
                Valtori.Toast.warning('Could not understand audio');
            }
            
        } catch (e) {
            if (e.name === 'AbortError') {
                Valtori.Toast.error('Transcription timed out');
            } else {
                console.error('Whisper API error:', e);
                Valtori.Toast.error('Transcription failed');
            }
        }
    }
};

// Export
window.Speech = Speech;
