/* ============================================
   VALTORI AI - STATS & SCORING MODULE
   Performance tracking and analysis
   ============================================ */

const Stats = {
    
    // Calculate score based on conversation and AI state
    calculateScore(conversation, session, aiData) {
        const userMessages = conversation.filter(c => c.who === 'user');
        const closed = session.closed;
        
        // Analyze user behavior
        let introduced = false;
        let askedQuestions = 0;
        let handledObjections = 0;
        let mentionedBenefits = 0;
        let attemptedClose = 0;
        
        userMessages.forEach(msg => {
            const text = msg.txt.toLowerCase();
            
            if (text.includes('my name') || text.includes('calling from') || text.includes('this is')) {
                introduced = true;
            }
            if (text.includes('?')) {
                askedQuestions++;
            }
            if (text.includes('understand') || text.includes('i hear') || text.includes('that makes sense')) {
                handledObjections++;
            }
            if (text.includes('save') || text.includes('increase') || text.includes('benefit') || text.includes('%')) {
                mentionedBenefits++;
            }
            if (text.includes('next step') || text.includes('schedule') || text.includes('demo') || text.includes('move forward')) {
                attemptedClose++;
            }
        });
        
        // Calculate individual scores
        let closing = closed ? 85 : (attemptedClose > 0 ? 50 + attemptedClose * 10 : 30);
        let objection = handledObjections > 0 ? 50 + handledObjections * 15 : 40;
        let confidence = introduced ? 60 : 40;
        confidence += mentionedBenefits * 10;
        let rapport = aiData.mood > 70 ? 80 : aiData.mood > 50 ? 65 : aiData.mood > 30 ? 50 : 35;
        rapport += askedQuestions * 5;
        
        // Clamp values
        closing = Valtori.Utils.clamp(closing, 0, 100);
        objection = Valtori.Utils.clamp(objection, 0, 100);
        confidence = Valtori.Utils.clamp(confidence, 0, 100);
        rapport = Valtori.Utils.clamp(rapport, 0, 100);
        
        const overall = Math.round((closing + objection + confidence + rapport) / 4);
        
        // Generate feedback
        const strengths = [];
        const improvements = [];
        
        if (introduced) strengths.push('Clear professional introduction');
        if (askedQuestions >= 2) strengths.push('Good use of discovery questions');
        if (handledObjections > 0) strengths.push('Attempted to handle objections');
        if (mentionedBenefits > 0) strengths.push('Communicated value proposition');
        if (attemptedClose > 0) strengths.push('Tried to advance the sale');
        if (closed) strengths.push('Successfully closed the deal!');
        
        if (!introduced) improvements.push('Start with a clear introduction');
        if (askedQuestions < 2) improvements.push('Ask more discovery questions');
        if (handledObjections === 0) improvements.push('Practice handling objections');
        if (mentionedBenefits === 0) improvements.push('Communicate specific benefits');
        if (attemptedClose === 0) improvements.push('Ask for the next step');
        
        // Ensure we have at least some feedback
        if (strengths.length === 0) {
            strengths.push('Completed the call', 'Took initiative to practice');
        }
        if (improvements.length === 0) {
            improvements.push('Keep refining your technique');
        }
        
        // Generate insights
        const insights = [];
        
        if (closed) {
            insights.push({ 
                type: 'strength', 
                title: 'Successful Close', 
                desc: 'You built enough rapport and handled objections to close the deal.' 
            });
        } else if (aiData.mood > 60) {
            insights.push({ 
                type: 'opportunity', 
                title: 'Almost There', 
                desc: 'The prospect was warming up - a stronger close attempt might have worked.' 
            });
        } else {
            insights.push({ 
                type: 'weakness', 
                title: 'Build More Rapport', 
                desc: 'Focus on asking questions and understanding their needs before pitching.' 
            });
        }
        
        if (askedQuestions > 0) {
            insights.push({ 
                type: 'strength', 
                title: 'Engaged the Prospect', 
                desc: 'Your questions kept the conversation going and built interest.' 
            });
        }
        
        insights.push({ 
            type: 'opportunity', 
            title: 'Keep Practicing', 
            desc: 'Each call builds your skills. Aim for consistency in your approach.' 
        });
        
        return {
            overall,
            metrics: { closing, objection, confidence, rapport },
            feedback: {
                strengths: strengths.slice(0, 3),
                improvements: improvements.slice(0, 3),
                insights: insights.slice(0, 3)
            }
        };
    },
    
    // Update stats with completed session
    recordSession(session, score) {
        const stats = Valtori.State.getStats();
        
        // Update totals
        stats.totalCalls++;
        stats.totalTime += session.duration;
        stats.scores.push(score.overall);
        
        if (session.closed) {
            stats.totalSales++;
            stats.totalEarnings += session.commission;
            stats.currentStreak++;
            if (stats.currentStreak > stats.maxStreak) {
                stats.maxStreak = stats.currentStreak;
            }
        } else {
            stats.currentStreak = 0;
        }
        
        // Add to history
        const historyEntry = {
            timestamp: session.timestamp,
            industry: session.industry,
            product: session.product,
            price: session.price,
            commission: session.commission,
            duration: session.duration,
            closed: session.closed,
            score: score
        };
        
        stats.history.unshift(historyEntry);
        
        // Keep last 100 entries
        if (stats.history.length > 100) {
            stats.history = stats.history.slice(0, 100);
        }
        
        // Save
        Valtori.State.saveStats(stats);
        
        return stats;
    },
    
    // Get dashboard data
    getDashboardData() {
        const stats = Valtori.State.getStats();
        
        const closeRate = stats.totalCalls > 0 
            ? Math.round(stats.totalSales / stats.totalCalls * 100) 
            : 0;
        
        const avgScore = stats.scores.length > 0
            ? Math.round(stats.scores.reduce((a, b) => a + b, 0) / stats.scores.length)
            : null;
        
        let scoreTrend = 'No data';
        if (stats.scores.length >= 2) {
            const recentScores = stats.scores.slice(-3);
            const recentAvg = recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
            const allAvg = stats.scores.reduce((a, b) => a + b, 0) / stats.scores.length;
            
            if (recentAvg > allAvg + 2) {
                scoreTrend = '📈 Improving';
            } else if (recentAvg < allAvg - 2) {
                scoreTrend = '📉 Needs work';
            } else {
                scoreTrend = '➡️ Stable';
            }
        } else if (stats.scores.length === 1) {
            scoreTrend = 'Just starting';
        }
        
        const avgPerCall = stats.totalCalls > 0
            ? Math.round(stats.totalEarnings / stats.totalCalls)
            : 0;
        
        const timeFormatted = this.formatDuration(stats.totalTime);
        
        return {
            closeRate,
            totalSales: stats.totalSales,
            totalCalls: stats.totalCalls,
            totalEarnings: stats.totalEarnings,
            avgScore,
            scoreTrend,
            avgPerCall,
            totalTime: stats.totalTime,
            timeFormatted,
            currentStreak: stats.currentStreak,
            maxStreak: stats.maxStreak,
            history: stats.history
        };
    },
    
    // Format duration in hours and minutes
    formatDuration(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
    },
    
    // Reset all stats
    resetStats() {
        const emptyStats = {
            totalCalls: 0,
            totalSales: 0,
            totalEarnings: 0,
            totalTime: 0,
            scores: [],
            history: [],
            currentStreak: 0,
            maxStreak: 0
        };
        Valtori.State.saveStats(emptyStats);
        return emptyStats;
    },
    
    // Export stats as JSON
    exportStats() {
        const stats = Valtori.State.getStats();
        const dataStr = JSON.stringify(stats, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `valtori-stats-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
};

// Export
window.Stats = Stats;
