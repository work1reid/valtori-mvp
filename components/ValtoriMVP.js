import React, { useState, useEffect, useRef } from 'react';
import { Phone, PhoneOff, Mic, MicOff, RotateCcw, TrendingUp, AlertCircle } from 'lucide-react';

const ValtoriMVP = () => {
  const [callState, setCallState] = useState('idle');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [conversation, setConversation] = useState([]);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [score, setScore] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [callDuration, setCallDuration] = useState(0);
  const [micPermission, setMicPermission] = useState('unknown');
  const [error, setError] = useState('');
  
  const recognitionRef = useRef(null);
  const callTimerRef = useRef(null);
  const synthRef = useRef(null);
  const conversationEndRef = useRef(null);

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  const isSpeechRecognitionSupported = () => {
    if (typeof window === 'undefined') return false;
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  };

  const requestMicPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setMicPermission('granted');
      setError('');
      return true;
    } catch (err) {
      console.error('Microphone permission error:', err);
      setMicPermission('denied');
      setError('Microphone access denied. Please allow microphone access in your browser settings.');
      return false;
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!isSpeechRecognitionSupported()) {
      setError('Speech recognition not supported. Please use Chrome, Edge, or Safari.');
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    
    recognition.onstart = () => {
      console.log('Speech recognition started');
      setIsListening(true);
      setError('');
    };
    
    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPiece = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcriptPiece + ' ';
        } else {
          interimTranscript += transcriptPiece;
        }
      }
      
      if (finalTranscript) {
        console.log('Final transcript:', finalTranscript);
        setTranscript('');
        handleUserMessage(finalTranscript.trim());
      } else {
        setTranscript(interimTranscript);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      
      if (event.error === 'not-allowed' || event.error === 'permission-denied') {
        setMicPermission('denied');
        setError('Microphone permission denied. Please allow microphone access.');
      } else if (event.error === 'no-speech') {
        console.log('No speech detected, continuing...');
      } else if (event.error === 'network') {
        setError('Network error. Please check your connection.');
      } else {
        setError(`Error: ${event.error}`);
      }
      
      setIsListening(false);
    };

    recognition.onend = () => {
      console.log('Speech recognition ended');
      setIsListening(false);
      
      if (callState === 'active' && !aiSpeaking) {
        setTimeout(() => {
          try {
            recognition.start();
          } catch (e) {
            console.log('Could not restart recognition:', e);
          }
        }, 100);
      }
    };

    recognitionRef.current = recognition;
    
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.log('Cleanup error:', e);
        }
      }
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
    };
  }, [callState, aiSpeaking]);

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation, transcript]);

  useEffect(() => {
    if (callState === 'active') {
      callTimerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
    }
    
    return () => {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
    };
  }, [callState]);

  const startCall = async () => {
    const hasPermission = await requestMicPermission();
    if (!hasPermission) {
      return;
    }

    setCallState('ringing');
    setConversation([]);
    setCallDuration(0);
    setScore(null);
    setFeedback([]);
    setError('');
    
    setTimeout(() => {
      setCallState('active');
      const greeting = "Hi, this is Alex speaking.";
      aiRespond(greeting);
      
      setTimeout(() => {
        if (recognitionRef.current) {
          try {
            recognitionRef.current.start();
            console.log('Started listening for user speech');
          } catch (e) {
            console.error('Could not start recognition:', e);
            setError('Could not start microphone. Please refresh and try again.');
          }
        }
      }, 1500);
    }, 2000);
  };

  const endCall = async () => {
    setCallState('ended');
    setIsListening(false);
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.log('Stop error:', e);
      }
    }
    
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    
    await generateScore();
  };

  const handleUserMessage = async (message) => {
    if (!message.trim()) return;
    
    console.log('User said:', message);
    const newConv = [...conversation, { role: 'user', content: message }];
    setConversation(newConv);
    
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.log('Stop error:', e);
      }
    }
    
    const aiResponse = await getAIResponse(newConv);
    aiRespond(aiResponse);
  };

  const aiRespond = (message) => {
    setConversation(prev => [...prev, { role: 'ai', content: message }]);
    
    if (!synthRef.current) return;
    
    setAiSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    utterance.onend = () => {
      console.log('AI finished speaking');
      setAiSpeaking(false);
    };
    
    utterance.onerror = (e) => {
      console.error('Speech synthesis error:', e);
      setAiSpeaking(false);
    };
    
    synthRef.current.cancel();
    synthRef.current.speak(utterance);
  };

  const getAIResponse = async (conv) => {
    try {
      const systemPrompt = `You are Alex, a realistic sales prospect. You're polite but busy and skeptical about sales pitches.

Behavior guidelines:
- Start neutral but engaged
- Raise realistic objections like: "I'm not sure I need this", "The price seems high", "Can you send me an email?", "I'm busy right now"
- If the salesperson asks good discovery questions, open up a bit
- If they push too hard or talk too fast, get more resistant
- Be human - use casual language, sometimes interrupt, show personality
- Keep responses to 1-2 sentences max
- Don't be hostile, just realistic

Keep it conversational and natural.`;

      const messages = conv.map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: messages,
          system: systemPrompt
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return data.content[0].text;
    } catch (error) {
      console.error('AI response error:', error);
      return "Sorry, could you repeat that?";
    }
  };

  const generateScore = async () => {
    try {
      const analysisPrompt = `Analyze this sales call simulation and provide a score and feedback.

Conversation:
${conversation.map(m => `${m.role === 'user' ? 'Salesperson' : 'Customer'}: ${m.content}`).join('\n')}

Call duration: ${callDuration} seconds

Evaluate based on:
1. Confidence and clarity
2. Asking discovery questions
3. Handling objections
4. Explaining value
5. Pace and tone

Respond in this EXACT JSON format (no markdown, no backticks):
{
  "score": <number 0-100>,
  "feedback": [
    "<specific actionable feedback point 1>",
    "<specific actionable feedback point 2>",
    "<specific actionable feedback point 3>"
  ]
}`;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{ role: 'user', content: analysisPrompt }]
        })
      });

      const data = await response.json();
      const resultText = data.content[0].text.replace(/```json|```/g, '').trim();
      const result = JSON.parse(resultText);
      
      setScore(result.score);
      setFeedback(result.feedback);
      
      // Save to Supabase
      await saveCallToDatabase(result.score, result.feedback);
    } catch (error) {
      console.error('Scoring error:', error);
      setScore(75);
      setFeedback([
        "Great effort on your first call!",
        "Try asking more discovery questions next time.",
        "Work on handling objections with empathy."
      ]);
    }
  };

  const saveCallToDatabase = async (finalScore, finalFeedback) => {
    try {
      const { supabase } = await import('../lib/supabaseClient');
      
      const { data, error } = await supabase
        .from('calls')
        .insert([
          {
            duration: callDuration,
            call_state: 'completed',
            score: finalScore,
            conversation: conversation,
            feedback: finalFeedback
          }
        ]);

      if (error) {
        console.error('Error saving to Supabase:', error);
      } else {
        console.log('Call saved to database:', data);
      }
    } catch (error) {
      console.error('Database save error:', error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0e1a 0%, #1a1f3a 100%)',
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
      color: '#ffffff',
      padding: '20px'
    }}>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap');
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(56, 189, 248, 0.3); }
          50% { box-shadow: 0 0 40px rgba(56, 189, 248, 0.6); }
        }
        
        @keyframes ripple {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        
        .message {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: '700',
            margin: '0 0 10px 0',
            background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-1px'
          }}>
            Valtori
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#94a3b8',
            margin: 0,
            fontWeight: '500',
            letterSpacing: '0.5px'
          }}>
            AI-Powered Sales Training
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '20px',
            display: 'flex',
            gap: '12px',
            alignItems: 'center'
          }}>
            <AlertCircle size={24} color="#ef4444" />
            <div style={{ flex: 1, fontSize: '14px', color: '#fca5a5' }}>
              {error}
            </div>
          </div>
        )}

        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '40px',
          marginBottom: '30px',
          minHeight: '500px',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-50%',
            right: '-20%',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(56, 189, 248, 0.1) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />

          {callState === 'idle' && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              gap: '30px',
              position: 'relative'
            }}>
              <div style={{
                width: '120px',
                height: '120px',
                background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '10px'
              }}>
                <Phone size={60} color="#ffffff" />
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <h2 style={{
                  fontSize: '28px',
                  fontWeight: '600',
                  margin: '0 0 10px 0'
                }}>
                  Ready to Practice?
                </h2>
                <p style={{
                  fontSize: '16px',
                  color: '#94a3b8',
                  margin: 0
                }}>
                  Start a simulated sales call with Alex
                </p>
              </div>

              <button
                onClick={startCall}
                disabled={!isSpeechRecognitionSupported()}
                style={{
                  background: isSpeechRecognitionSupported() 
                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                    : 'rgba(100, 116, 139, 0.5)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '18px 48px',
                  fontSize: '18px',
                  fontWeight: '600',
                  cursor: isSpeechRecognitionSupported() ? 'pointer' : 'not-allowed',
                  transition: 'all 0.3s ease',
                  boxShadow: isSpeechRecognitionSupported() 
                    ? '0 10px 30px rgba(16, 185, 129, 0.3)'
                    : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <Phone size={20} />
                {isSpeechRecognitionSupported() ? 'Start Call' : 'Browser Not Supported'}
              </button>
              
              {!isSpeechRecognitionSupported() && (
                <p style={{
                  fontSize: '14px',
                  color: '#f59e0b',
                  textAlign: 'center',
                  maxWidth: '400px'
                }}>
                  Please use Chrome, Edge, or Safari for voice features
                </p>
              )}
            </div>
          )}

          {callState === 'ringing' && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              gap: '20px'
            }}>
              <div style={{
                width: '120px',
                height: '120px',
                background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'glow 1.5s ease-in-out infinite'
              }}>
                <Phone size={60} color="#ffffff" />
              </div>
              <p style={{
                fontSize: '24px',
                fontWeight: '600',
                animation: 'pulse 1.5s ease-in-out infinite'
              }}>
                Calling Alex...
              </p>
            </div>
          )}

          {callState === 'active' && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              gap: '20px',
              position: 'relative'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '20px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div>
                  <p style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    margin: '0 0 5px 0'
                  }}>
                    Call with Alex
                  </p>
                  <p style={{
                    fontSize: '14px',
                    color: '#94a3b8',
                    margin: 0,
                    fontFamily: '"JetBrains Mono", monospace'
                  }}>
                    {formatTime(callDuration)}
                  </p>
                </div>
                <div style={{
                  padding: '8px 16px',
                  background: aiSpeaking 
                    ? 'rgba(56, 189, 248, 0.2)' 
                    : isListening 
                      ? 'rgba(16, 185, 129, 0.2)'
                      : 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: aiSpeaking 
                    ? '#38bdf8' 
                    : isListening 
                      ? '#10b981'
                      : '#94a3b8'
                }}>
                  {aiSpeaking ? '🎙️ Alex speaking...' : isListening ? '🎤 You can speak' : '⏸️ Paused'}
                </div>
              </div>

              <div style={{
                flex: 1,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                paddingRight: '10px',
                maxHeight: '400px'
              }}>
                {conversation.map((msg, idx) => (
                  <div
                    key={idx}
                    className="message"
                    style={{
                      alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                      maxWidth: '75%'
                    }}
                  >
                    <div style={{
                      background: msg.role === 'user' 
                        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                        : 'rgba(255, 255, 255, 0.08)',
                      padding: '12px 18px',
                      borderRadius: '16px',
                      fontSize: '15px',
                      lineHeight: '1.5'
                    }}>
                      {msg.content}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#64748b',
                      marginTop: '4px',
                      marginLeft: msg.role === 'user' ? 'auto' : '0',
                      marginRight: msg.role === 'user' ? '0' : 'auto',
                      width: 'fit-content'
                    }}>
                      {msg.role === 'user' ? 'You' : 'Alex'}
                    </div>
                  </div>
                ))}
                
                {transcript && (
                  <div style={{
                    alignSelf: 'flex-end',
                    maxWidth: '75%',
                    opacity: 0.6
                  }}>
                    <div style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      padding: '12px 18px',
                      borderRadius: '16px',
                      fontSize: '15px',
                      fontStyle: 'italic'
                    }}>
                      {transcript}...
                    </div>
                  </div>
                )}
                
                <div ref={conversationEndRef} />
              </div>

              <div style={{
                textAlign: 'center',
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '12px',
                fontSize: '14px',
                color: isListening ? '#10b981' : '#64748b'
              }}>
                {isListening ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      background: '#10b981',
                      borderRadius: '50%',
                      animation: 'pulse 1.5s ease-in-out infinite'
                    }} />
                    Listening... Speak now
                  </div>
                ) : aiSpeaking ? (
                  'Alex is speaking...'
                ) : (
                  'Microphone paused'
                )}
              </div>

              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'center',
                paddingTop: '20px',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <button
                  onClick={endCall}
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    border: 'none',
                    color: '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 20px rgba(239, 68, 68, 0.3)',
                    transition: 'all 0.3s ease',
                    position: 'relative'
                  }}
                  title="End Call"
                >
                  <PhoneOff size={28} />
                </button>
              </div>
            </div>
          )}

          {callState === 'ended' && score !== null && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              gap: '30px',
              position: 'relative'
            }}>
              <div style={{ textAlign: 'center' }}>
                <h2 style={{
                  fontSize: '28px',
                  fontWeight: '600',
                  margin: '0 0 10px 0'
                }}>
                  Call Complete
                </h2>
                <p style={{
                  fontSize: '14px',
                  color: '#94a3b8',
                  fontFamily: '"JetBrains Mono", monospace'
                }}>
                  Duration: {formatTime(callDuration)}
                </p>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.1) 0%, rgba(129, 140, 248, 0.1) 100%)',
                border: '2px solid rgba(56, 189, 248, 0.3)',
                borderRadius: '20px',
                padding: '40px',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '72px',
                  fontWeight: '700',
                  background: score >= 80 ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 
                             score >= 60 ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' :
                             'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: '10px',
                  fontFamily: '"JetBrains Mono", monospace'
                }}>
                  {score}
                </div>
                <div style={{
                  fontSize: '18px',
                  color: '#94a3b8',
                  fontWeight: '500'
                }}>
                  Overall Score
                </div>
              </div>

              <div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <TrendingUp size={24} color="#38bdf8" />
                  Feedback
                </h3>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  {feedback.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        padding: '16px',
                        fontSize: '15px',
                        lineHeight: '1.6'
                      }}
                    >
                      <span style={{ color: '#38bdf8', marginRight: '8px', fontWeight: '600' }}>
                        {idx + 1}.
                      </span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  setCallState('idle');
                  setConversation([]);
                  setScore(null);
                  setFeedback([]);
                  setCallDuration(0);
                  setError('');
                }}
                style={{
                  background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '16px 32px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  margin: '0 auto'
                }}
              >
                <RotateCcw size={20} />
                Practice Again
              </button>
            </div>
          )}
        </div>

        <div style={{
          textAlign: 'center',
          color: '#64748b',
          fontSize: '14px',
          padding: '20px',
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: '12px'
        }}>
          {callState === 'idle' && (
            <>
              <p style={{ margin: '0 0 10px 0' }}>
                💡 <strong>Tip:</strong> Speak clearly and ask discovery questions to understand Alex's needs
              </p>
              <p style={{ margin: 0, fontSize: '12px', color: '#475569' }}>
                Make sure to allow microphone access when prompted
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ValtoriMVP;
