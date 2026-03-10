import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Sparkles, TrendingUp, Zap, ChevronRight, History, Info, Play, X, Trash2, Save } from 'lucide-react';
import { Decision, METRICS } from './types';
import ThreeBackground from './components/ThreeBackground';
import DecisionCard from './components/DecisionCard';
import RadarChart3D from './components/RadarChart3D';

interface HistoryItem {
  id: string;
  date: string;
  decisionA: Decision;
  decisionB: Decision;
  winner: string;
}

const INITIAL_DECISION_A: Decision = {
  name: 'Job A (Corporate)',
  salary: 80,
  workingHours: 70,
  stressLevel: 60,
  skillGrowth: 40,
  workLifeBalance: 30,
};

const INITIAL_DECISION_B: Decision = {
  name: 'Job B (Startup)',
  salary: 50,
  workingHours: 50,
  stressLevel: 40,
  skillGrowth: 90,
  workLifeBalance: 60,
};

export default function App() {
  const [step, setStep] = useState<'hero' | 'compare' | 'result'>('hero');
  const [decisionA, setDecisionA] = useState<Decision>(INITIAL_DECISION_A);
  const [decisionB, setDecisionB] = useState<Decision>(INITIAL_DECISION_B);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('life_tradeoff_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('life_tradeoff_history', JSON.stringify(history));
  }, [history]);

  const saveToHistory = () => {
    const newItem: HistoryItem = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toLocaleDateString(),
      decisionA,
      decisionB,
      winner: analysis.winDecision.name,
    };
    setHistory([newItem, ...history]);
  };

  const deleteFromHistory = (id: string) => {
    setHistory(history.filter(item => item.id !== id));
  };

  const loadFromHistory = (item: HistoryItem) => {
    setDecisionA(item.decisionA);
    setDecisionB(item.decisionB);
    setStep('result');
    setShowHistory(false);
  };

  const analysis = useMemo(() => {
    const scoreA = (decisionA.salary + decisionA.skillGrowth + decisionA.workLifeBalance) - (decisionA.stressLevel + decisionA.workingHours * 0.5);
    const scoreB = (decisionB.salary + decisionB.skillGrowth + decisionB.workLifeBalance) - (decisionB.stressLevel + decisionB.workingHours * 0.5);
    
    const winner = scoreA > scoreB ? 'A' : 'B';
    const winDecision = winner === 'A' ? decisionA : decisionB;
    
    return {
      winner,
      winDecision,
      diff: Math.abs(scoreA - scoreB),
      insights: [
        decisionA.salary > decisionB.salary ? `${decisionA.name} offers better financial prospects.` : `${decisionB.name} is more lucrative.`,
        decisionA.workLifeBalance > decisionB.workLifeBalance ? `${decisionA.name} prioritizes your personal time.` : `${decisionB.name} provides better balance.`,
        decisionA.skillGrowth > decisionB.skillGrowth ? `${decisionA.name} is a powerhouse for learning.` : `${decisionB.name} will grow your skills faster.`
      ]
    };
  }, [decisionA, decisionB]);

  return (
    <div className="min-h-screen text-white font-sans selection:bg-cyan-500/30">
      <ThreeBackground />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center backdrop-blur-md bg-black/10 border-b border-white/5">
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setStep('hero')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            LifeTradeoff
          </span>
        </div>
        
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setShowHistory(true)}
            className="text-sm text-white/60 hover:text-white transition-colors flex items-center gap-2"
          >
            <History className="w-4 h-4" /> History
          </button>
          <button 
            onClick={() => setShowAbout(true)}
            className="text-sm text-white/60 hover:text-white transition-colors flex items-center gap-2"
          >
            <Info className="w-4 h-4" /> About
          </button>
        </div>
      </nav>

      <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {step === 'hero' && (
            <motion.section
              key="hero"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="min-h-[80vh] flex flex-col items-center justify-center text-center space-y-8"
            >
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-cyan-400 text-sm font-medium"
                >
                  <Sparkles className="w-4 h-4" />
                  Intelligent Decision Analysis
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-6xl md:text-8xl font-bold tracking-tighter"
                >
                  Life Tradeoff <br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500">
                    Calculator
                  </span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl text-white/40 max-w-2xl mx-auto"
                >
                  Compare life decisions with futuristic 3D visualizations. 
                  Balance your career, growth, and happiness with data-driven insights.
                </motion.p>
              </div>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                onClick={() => setStep('compare')}
                className="group relative px-8 py-4 bg-white text-black rounded-full font-bold text-lg overflow-hidden transition-all hover:scale-105 active:scale-95"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10 group-hover:text-white flex items-center gap-2">
                  Start Comparison <ChevronRight className="w-5 h-5" />
                </span>
              </motion.button>
            </motion.section>
          )}

          {step === 'compare' && (
            <motion.section
              key="compare"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-12"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <DecisionCard 
                  decision={decisionA} 
                  onChange={(u) => setDecisionA(prev => ({ ...prev, ...u }))}
                  color="blue"
                  title="Decision A"
                />

                <div className="lg:sticky lg:top-32 space-y-8">
                  <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-cyan-400" />
                      Visual Analysis
                    </h3>
                    <RadarChart3D decisionA={decisionA} decisionB={decisionB} />
                  </div>

                  <button
                    onClick={() => setStep('result')}
                    className="w-full py-6 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl font-bold text-xl shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-3"
                  >
                    <Zap className="w-6 h-6 fill-current" />
                    Analyze Decisions
                  </button>
                </div>

                <DecisionCard 
                  decision={decisionB} 
                  onChange={(u) => setDecisionB(prev => ({ ...prev, ...u }))}
                  color="purple"
                  title="Decision B"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {analysis.insights.map((insight, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-4 rounded-2xl bg-white/5 border border-white/5 text-sm text-white/60 italic"
                  >
                    "{insight}"
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {step === 'result' && (
            <motion.section
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-4xl mx-auto space-y-12 py-12"
            >
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-bold">Recommended Choice</h2>
                <div className="text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
                  {analysis.winDecision.name}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-2xl space-y-6">
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-yellow-400" />
                    Why this choice?
                  </h3>
                  <p className="text-white/70 leading-relaxed">
                    Based on your priorities, {analysis.winDecision.name} provides the optimal balance 
                    between growth and sustainability. It scores significantly higher in 
                    {analysis.winDecision.skillGrowth > 70 ? ' long-term skill development' : ' overall life satisfaction'}.
                  </p>
                  <div className="space-y-4">
                    {METRICS.map(m => (
                      <div key={m.key} className="flex items-center justify-between">
                        <span className="text-white/40 text-sm">{m.label}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-cyan-500" 
                              style={{ width: `${analysis.winDecision[m.key]}%` }}
                            />
                          </div>
                          <span className="text-xs font-mono">{analysis.winDecision[m.key]}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-6 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
                    <h4 className="font-bold text-cyan-400 mb-2">Primary Advantage</h4>
                    <p className="text-sm text-white/60">
                      This path maximizes your {analysis.winDecision.salary > 70 ? 'financial independence' : 'creative freedom'} 
                      while keeping stress levels manageable.
                    </p>
                  </div>
                  <div className="p-6 rounded-2xl bg-purple-500/10 border border-purple-500/20">
                    <h4 className="font-bold text-purple-400 mb-2">Growth Potential</h4>
                    <p className="text-sm text-white/60">
                      Expect a {analysis.winDecision.skillGrowth}% increase in your professional value 
                      over the next 24 months in this role.
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setStep('compare')}
                      className="flex-1 py-4 rounded-xl border border-white/10 hover:bg-white/5 transition-colors text-white/60"
                    >
                      Adjust Parameters
                    </button>
                    <button 
                      onClick={saveToHistory}
                      className="px-6 py-4 rounded-xl border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 transition-colors text-cyan-400 flex items-center gap-2"
                    >
                      <Save className="w-5 h-5" /> Save
                    </button>
                  </div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* History Modal */}
        <AnimatePresence>
          {showHistory && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowHistory(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-2xl bg-[#0f172a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
              >
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <History className="w-5 h-5 text-cyan-400" />
                    Decision History
                  </h3>
                  <button onClick={() => setShowHistory(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4 custom-scrollbar">
                  {history.length === 0 ? (
                    <div className="text-center py-12 text-white/20">
                      No saved comparisons yet.
                    </div>
                  ) : (
                    history.map(item => (
                      <div key={item.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group hover:border-cyan-500/30 transition-all">
                        <div className="cursor-pointer flex-1" onClick={() => loadFromHistory(item)}>
                          <div className="text-xs text-white/40 mb-1">{item.date}</div>
                          <div className="font-medium">{item.decisionA.name} vs {item.decisionB.name}</div>
                          <div className="text-xs text-cyan-400/60 mt-1">Winner: {item.winner}</div>
                        </div>
                        <button 
                          onClick={() => deleteFromHistory(item.id)}
                          className="p-2 text-white/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* About Modal */}
        <AnimatePresence>
          {showAbout && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowAbout(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-2xl bg-[#0f172a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
              >
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Info className="w-5 h-5 text-purple-400" />
                    About LifeTradeoff
                  </h3>
                  <button onClick={() => setShowAbout(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-8 space-y-6 text-white/70 leading-relaxed">
                  <p>
                    <strong className="text-white">LifeTradeoff Calculator</strong> is a futuristic decision-analysis tool designed to help you visualize the complex variables of major life choices.
                  </p>
                  <div className="space-y-4">
                    <h4 className="text-white font-bold">How it works:</h4>
                    <p className="text-sm">
                      Our algorithm uses a weighted scoring system that balances positive growth factors (Salary, Skill Growth, Work-Life Balance) against negative impact factors (Stress Level, Working Hours).
                    </p>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 font-mono text-[11px]">
                      Score = (Salary + Growth + Balance) - (Stress + Hours * 0.5)
                    </div>
                  </div>
                  <p className="text-sm">
                    The 3D Radar Chart provides a spatial representation of these tradeoffs, allowing you to see where one choice excels and where it falls short compared to the alternative.
                  </p>
                  <div className="pt-4 border-t border-white/5 flex justify-center">
                    <button 
                      onClick={() => setShowAbout(false)}
                      className="px-8 py-3 bg-white text-black rounded-full font-bold hover:scale-105 transition-transform"
                    >
                      Got it
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 p-6 flex justify-center pointer-events-none">
        <div className="px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/5 text-[10px] uppercase tracking-widest text-white/30 pointer-events-auto">
          Built with Precision & Intelligence • 2026
        </div>
      </footer>
    </div>
  );
}
