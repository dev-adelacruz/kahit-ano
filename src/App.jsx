import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Users, Plus, Trash2, RotateCw, X, Check, ArrowRight, 
  Sparkles, History, MapPin, UserPlus, Settings, Wand2,
  Trophy, AlertTriangle, Coffee, Pizza, Beer, Utensils,
  ChevronDown
} from 'lucide-react';

// DESIGN SYSTEM: "Vibrant Sunburst"
const THEME = {
  primary: 'bg-orange-500',
  primaryText: 'text-orange-600',
  secondary: 'bg-rose-500',
  accent: 'text-rose-600',
  buttonShadow: 'shadow-orange-200',
  focusRing: 'focus:ring-orange-500',
  gradient: 'from-orange-500 to-rose-600'
};

const App = () => {
  // Application State
  const [step, setStep] = useState('lobby'); // 'lobby' | 'input' | 'veto' | 'spin' | 'result'
  const [participants, setParticipants] = useState([]);
  const [newParticipantName, setNewParticipantName] = useState('');
  const [cravings, setCravings] = useState([]); // { id, text, addedBy, vetoed: false }
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState(null);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    document.title = "Kahit Saan — Decision Solved";
  }, []);

  // --- LOGIC: Lobby ---
  const addParticipant = () => {
    if (!newParticipantName.trim()) return;
    setParticipants([...participants, { name: newParticipantName.trim(), color: getRandomColor() }]);
    setNewParticipantName('');
  };

  const getRandomColor = () => {
    const colors = ['#f59e0b', '#ef4444', '#10b981', '#ec4899', '#8b5cf6', '#06b6d4'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // --- LOGIC: Cravings ---
  const currentUserCravings = useMemo(() => {
    if (!participants[currentUserIndex]) return [];
    return cravings.filter(c => c.addedBy === participants[currentUserIndex].name);
  }, [cravings, currentUserIndex, participants]);

  const addCraving = (text) => {
    const cleanText = text.trim();
    if (!cleanText) return;

    if (currentUserCravings.length >= 3) {
      showError("Limit reached! 3 items only.");
      return;
    }

    const isDuplicate = cravings.some(c => c.text.toLowerCase() === cleanText.toLowerCase());
    if (isDuplicate) {
      showError("Already on the list!");
      return;
    }

    setCravings([...cravings, { 
      id: Math.random().toString(36).substr(2, 9),
      text: cleanText, 
      addedBy: participants[currentUserIndex].name,
      vetoed: false 
    }]);
    setErrorMsg('');
  };

  const showError = (msg) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(''), 2000);
  };

  const nextUser = () => {
    if (currentUserIndex < participants.length - 1) {
      setCurrentUserIndex(currentUserIndex + 1);
    } else {
      setStep('veto');
      setCurrentUserIndex(0);
    }
  };

  // --- LOGIC: Veto ---
  const toggleVeto = (id) => {
    setCravings(cravings.map(c => 
      c.id === id ? { ...c, vetoed: !c.vetoed } : c
    ));
  };

  // --- LOGIC: The Wheel ---
  const validChoices = useMemo(() => cravings.filter(c => !c.vetoed), [cravings]);

  const spinWheel = () => {
    if (spinning || validChoices.length === 0) return;
    
    setSpinning(true);
    const newRotation = wheelRotation + 1800 + Math.random() * 360;
    setWheelRotation(newRotation);

    setTimeout(() => {
      const actualRotation = newRotation % 360;
      const segmentSize = 360 / validChoices.length;
      const winningIndex = Math.floor((360 - (actualRotation % 360)) / segmentSize) % validChoices.length;
      
      setWinner(validChoices[winningIndex]);
      setSpinning(false);
      setStep('result');
    }, 4000);
  };

  const reset = () => {
    setStep('lobby');
    setParticipants([]);
    setCravings([]);
    setCurrentUserIndex(0);
    setWinner(null);
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-amber-50 text-slate-900 font-sans p-4 md:p-8 flex flex-col items-center justify-center overflow-hidden" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      
      <div className="w-full max-w-md bg-white rounded-[3rem] shadow-2xl overflow-hidden relative border border-orange-100/50 min-h-[600px] flex flex-col">
        
        {/* Header Section */}
        <header className={`p-8 bg-gradient-to-br ${THEME.gradient} text-white transition-all duration-500`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tighter">Kahit<span className="opacity-60 font-light underline decoration-2 underline-offset-4">Saan</span></h1>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mt-1">Decision Engine</p>
            </div>
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
              <Utensils size={24} />
            </div>
          </div>
        </header>

        <div className="p-8 flex-1 flex flex-col">
          
          {/* STEP 1: LOBBY */}
          {step === 'lobby' && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4">
              <div className="space-y-2 text-left">
                <h2 className="text-xl font-black text-slate-800">Who's eating? 🍽️</h2>
                <p className="text-sm text-slate-500 font-medium">Add your group members to start.</p>
              </div>

              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Enter name..." 
                  className={`flex-1 bg-orange-50 border-none rounded-2xl px-5 py-4 ${THEME.focusRing} outline-none font-bold placeholder:text-orange-200`}
                  value={newParticipantName}
                  onChange={(e) => setNewParticipantName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addParticipant()}
                />
                <button 
                  onClick={addParticipant}
                  className={`${THEME.primary} text-white p-4 rounded-2xl shadow-lg ${THEME.buttonShadow} active:scale-95 transition-all`}
                >
                  <Plus size={24} />
                </button>
              </div>

              <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2 scrollbar-hide">
                {participants.map((p, i) => (
                  <div key={i} className="flex items-center justify-between bg-orange-50/30 p-4 rounded-2xl border border-orange-100/50 animate-in fade-in">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full shadow-inner border-2 border-white" style={{ backgroundColor: p.color }} />
                      <span className="font-bold text-slate-700">{p.name}</span>
                    </div>
                    <button onClick={() => setParticipants(participants.filter((_, idx) => idx !== i))}>
                      <Trash2 size={16} className="text-orange-300 hover:text-rose-500 transition-colors" />
                    </button>
                  </div>
                ))}
              </div>

              <button 
                disabled={participants.length < 2}
                onClick={() => setStep('input')}
                className={`w-full py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-xl transition-all ${participants.length < 2 ? 'bg-slate-100 text-slate-300' : `${THEME.primary} text-white ${THEME.buttonShadow} hover:-translate-y-1`}`}
              >
                Let's Choose
              </button>
            </div>
          )}

          {/* STEP 2: INPUT CRAVINGS - REFINED UX */}
          {step === 'input' && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1 text-left">
                  <h2 className={`text-xl font-black italic uppercase tracking-tighter ${THEME.primaryText}`}>
                    {participants[currentUserIndex].name}'s Turn
                  </h2>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    {currentUserCravings.length === 0 
                      ? "Add at least one item" 
                      : currentUserCravings.length === 3 
                        ? "List complete!" 
                        : "You can add up to 3"}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-orange-100 flex items-center justify-center font-black text-orange-600">
                  {currentUserIndex + 1}/{participants.length}
                </div>
              </div>

              {errorMsg && (
                <div className="bg-rose-50 text-rose-600 p-3 rounded-xl text-xs font-bold flex items-center gap-2 animate-bounce">
                  <AlertTriangle size={14} /> {errorMsg}
                </div>
              )}

              {/* Quick Suggestions */}
              <div className="grid grid-cols-2 gap-3">
                {['Pizza', 'Samgyup', 'Coffee', 'Burgers', 'Sushi', 'Wings'].map(suggest => {
                  const isAdded = cravings.some(c => c.text.toLowerCase() === suggest.toLowerCase());
                  const isLimit = currentUserCravings.length >= 3;
                  return (
                    <button 
                      key={suggest}
                      disabled={isAdded || isLimit}
                      onClick={() => addCraving(suggest)}
                      className={`p-4 rounded-2xl text-xs font-black transition-all border flex items-center gap-2 
                        ${isAdded ? 'bg-orange-50 border-orange-100 text-orange-300' : 
                          isLimit ? 'bg-slate-50 border-slate-100 text-slate-200' : 
                          'bg-white text-slate-600 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 shadow-sm'}`}
                    >
                      {isAdded ? <Check size={12}/> : <Plus size={12} />} {suggest}
                    </button>
                  );
                })}
              </div>

              {/* Active User List */}
              <div className="space-y-2 min-h-[100px] text-left">
                <h4 className="text-[10px] font-black uppercase text-slate-400">Your Menu ({currentUserCravings.length}/3)</h4>
                <div className="flex flex-wrap gap-2">
                  {currentUserCravings.map((c) => (
                    <div key={c.id} className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-xs font-black flex items-center gap-2 border border-orange-200 shadow-sm">
                      {c.text}
                      <button onClick={() => setCravings(cravings.filter(item => item.id !== c.id))}>
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  {currentUserCravings.length === 0 && (
                    <p className="text-xs text-slate-300 italic pt-2">Tell us what you're craving...</p>
                  )}
                </div>
              </div>

              {/* Logic Fix: Show button as long as they have 1 item, keep input visible until 3 items */}
              <div className="space-y-4 pt-4">
                {currentUserCravings.length < 3 && (
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="e.g. Ramen, Siomai..." 
                      className={`flex-1 bg-slate-50 border-none rounded-2xl px-5 py-4 ${THEME.focusRing} outline-none font-bold placeholder:text-slate-300 shadow-inner transition-all`}
                      onKeyPress={(e) => {
                        if(e.key === 'Enter') {
                          addCraving(e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                  </div>
                )}
                
                {currentUserCravings.length >= 1 && (
                  <button 
                    onClick={nextUser}
                    className={`w-full py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-xl bg-gradient-to-r ${THEME.gradient} text-white shadow-orange-100 flex items-center justify-center gap-2 animate-in slide-in-from-top-2`}
                  >
                    {currentUserIndex === participants.length - 1 ? 'Start Resolution' : 'Done with my turn'} <ArrowRight size={18} />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: VETO MODE */}
          {step === 'veto' && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <div className="space-y-1 text-left">
                <div className="flex items-center gap-2 text-rose-500">
                  <AlertTriangle size={20} />
                  <h2 className="text-xl font-black tracking-tight uppercase italic">The Veto Round</h2>
                </div>
                <p className="text-xs font-medium text-slate-500">Strike out anything the group absolutely hates.</p>
              </div>

              <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2 scrollbar-hide">
                {cravings.map((c) => (
                  <button 
                    key={c.id}
                    onClick={() => toggleVeto(c.id)}
                    className={`w-full p-4 rounded-2xl border-2 text-left flex items-center justify-between transition-all ${c.vetoed ? 'bg-rose-50 border-rose-100' : 'bg-white border-orange-50 hover:border-orange-200 shadow-sm'}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`font-black ${c.vetoed ? 'line-through text-rose-300' : 'text-slate-700'}`}>{c.text}</span>
                      <span className="text-[9px] font-bold uppercase text-slate-300 tracking-widest">From {c.addedBy}</span>
                    </div>
                    <div className={`p-1.5 rounded-full transition-colors ${c.vetoed ? 'bg-rose-500 text-white' : 'bg-orange-50 text-orange-400'}`}>
                      {c.vetoed ? <X size={14} /> : <Check size={14} />}
                    </div>
                  </button>
                ))}
              </div>

              <button 
                disabled={validChoices.length === 0}
                onClick={() => setStep('spin')}
                className={`w-full py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-xl transition-all ${validChoices.length === 0 ? 'bg-slate-100 text-slate-300 grayscale' : `bg-gradient-to-r ${THEME.gradient} text-white shadow-orange-100`}`}
              >
                Go to the Wheel ({validChoices.length})
              </button>
            </div>
          )}

          {/* STEP 4: THE SPIN */}
          {step === 'spin' && (
            <div className="flex-1 flex flex-col items-center justify-center space-y-10 animate-in zoom-in-95">
              <div className="text-center space-y-2">
                <h2 className={`text-2xl font-black tracking-tighter uppercase italic ${THEME.primaryText}`}>Wheel of Fate</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">May the best craving win</p>
              </div>

              <div className="relative w-64 h-64 flex items-center justify-center">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-20 text-rose-500 animate-bounce">
                  <ChevronDown size={48} fill="currentColor" />
                </div>
                
                <div 
                  className="w-full h-full rounded-full border-[12px] border-slate-900 shadow-2xl overflow-hidden transition-transform duration-[4000ms] cubic-bezier(0.1, 0, 0.1, 1)"
                  style={{ transform: `rotate(${wheelRotation}deg)` }}
                >
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    {validChoices.map((choice, i) => {
                      const sliceAngle = 360 / validChoices.length;
                      const startAngle = i * sliceAngle;
                      const endAngle = (i + 1) * sliceAngle;
                      
                      const x1 = 50 + 50 * Math.cos((startAngle - 90) * Math.PI / 180);
                      const y1 = 50 + 50 * Math.sin((startAngle - 90) * Math.PI / 180);
                      const x2 = 50 + 50 * Math.cos((endAngle - 90) * Math.PI / 180);
                      const y2 = 50 + 50 * Math.sin((endAngle - 90) * Math.PI / 180);

                      const largeArcFlag = sliceAngle > 180 ? 1 : 0;
                      const d = `M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

                      return (
                        <g key={i}>
                          <path 
                            d={d} 
                            fill={i % 2 === 0 ? '#f97316' : '#f43f5e'} 
                            stroke="white" 
                            strokeWidth="0.5" 
                          />
                          <text 
                            x="50" y="15" 
                            transform={`rotate(${startAngle + sliceAngle/2} 50 50)`} 
                            fill="white" 
                            fontSize="4.5" 
                            fontWeight="900" 
                            textAnchor="middle"
                            className="uppercase tracking-tighter"
                          >
                            {choice.text.substring(0, 10)}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>

              <button 
                onClick={spinWheel}
                disabled={spinning}
                className={`px-12 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl transition-all active:scale-95 ${spinning ? 'bg-slate-200 text-slate-400' : `${THEME.primary} text-white shadow-orange-200 hover:-translate-y-1`}`}
              >
                {spinning ? 'Deciding...' : 'Spin the Wheel'}
              </button>
            </div>
          )}

          {/* STEP 5: RESULT */}
          {step === 'result' && (
            <div className="flex-1 flex flex-col items-center justify-center space-y-8 animate-in zoom-in-90 duration-500">
              <div className="p-8 bg-orange-100 rounded-full text-orange-600 animate-bounce shadow-xl shadow-orange-100/50">
                <Trophy size={80} />
              </div>
              
              <div className="text-center space-y-2">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.4em]">We're having</p>
                <h2 className={`text-6xl font-black tracking-tighter ${THEME.primaryText} uppercase italic leading-tight`}>{winner?.text}</h2>
                <div className="inline-block px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest mt-4 shadow-lg">
                  Curated by {winner?.addedBy}
                </div>
              </div>

              <div className="w-full pt-10 space-y-3">
                <button 
                  onClick={() => {
                    const query = encodeURIComponent(winner.text + " restaurant near me");
                    window.open(`https://www.google.com/maps/search/${query}`, '_blank');
                  }}
                  className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl active:scale-95"
                >
                  <MapPin size={16} /> Find Nearby Places
                </button>
                <button 
                  onClick={reset}
                  className="w-full py-4 text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] hover:text-orange-500 transition-all"
                >
                  Start New Round
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer Progress */}
        {step !== 'lobby' && step !== 'result' && (
          <footer className="px-8 py-4 bg-orange-50/50 border-t border-orange-100/50 flex items-center justify-between">
            <div className="flex gap-1.5">
              {['input', 'veto', 'spin'].map((s) => (
                <div key={s} className={`h-1.5 w-8 rounded-full transition-all duration-700 ${step === s ? `${THEME.primary} w-12` : 'bg-orange-200'}`} />
              ))}
            </div>
            <button onClick={reset} className="text-[10px] font-black uppercase text-orange-400 hover:text-rose-500 transition-colors flex items-center gap-1">
               <RotateCw size={10} /> Reset
            </button>
          </footer>
        )}
      </div>

      {/* Decorative BG */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-orange-200 rounded-full blur-[140px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-rose-200 rounded-full blur-[120px]" />
      </div>
    </div>
  );
};

export default App;