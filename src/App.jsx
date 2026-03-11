import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Users, Plus, Trash2, RotateCw, X, Check, ArrowRight, 
  ArrowLeft, Sparkles, History, MapPin, UserPlus, Settings, Wand2,
  Trophy, AlertTriangle, Coffee, Pizza, Beer, Utensils,
  ChevronDown, Eraser
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
    // Inject Font & Update SEO Title
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    document.title = "Kahit Saan — Group Decision Solved";
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

  // --- LOGIC: Cravings & Collated Groups ---
  const currentUserCravings = useMemo(() => {
    if (!participants[currentUserIndex]) return [];
    return cravings.filter(c => c.addedBy === participants[currentUserIndex].name);
  }, [cravings, currentUserIndex, participants]);

  // QA FIX: Grouping logic for Veto and Wheel (Collating names)
  const groupedCravings = useMemo(() => {
    const groups = {};
    cravings.forEach(c => {
      const key = c.text.toLowerCase();
      if (!groups[key]) {
        groups[key] = { 
          text: c.text, 
          contributors: [c.addedBy],
          vetoed: c.vetoed,
          weight: 1
        };
      } else {
        if (!groups[key].contributors.includes(c.addedBy)) {
          groups[key].contributors.push(c.addedBy);
          groups[key].weight += 1;
        }
        if (c.vetoed) groups[key].vetoed = true;
      }
    });
    return Object.values(groups);
  }, [cravings]);

  const addCraving = (text) => {
    const cleanText = text.trim();
    if (!cleanText) return;

    if (currentUserCravings.length >= 3) {
      showError("Limit reached! 3 items only.");
      return;
    }

    // QA FIX: Only block duplicates if the SAME user adds them twice
    const isUserDuplicate = currentUserCravings.some(c => c.text.toLowerCase() === cleanText.toLowerCase());
    if (isUserDuplicate) {
      showError("You already added that!");
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

  // QA FIX: Back Button Logic
  const handleBack = () => {
    if (step === 'input') {
      if (currentUserIndex > 0) {
        setCurrentUserIndex(currentUserIndex - 1);
      } else {
        setStep('lobby');
      }
    } else if (step === 'veto') {
      setStep('input');
      setCurrentUserIndex(participants.length - 1);
    } else if (step === 'spin') {
      setStep('veto');
    }
  };

  const nextUser = () => {
    if (currentUserIndex < participants.length - 1) {
      setCurrentUserIndex(currentUserIndex + 1);
    } else {
      setStep('veto');
    }
  };

  const toggleVeto = (text) => {
    const lowerText = text.toLowerCase();
    setCravings(cravings.map(c => 
      c.text.toLowerCase() === lowerText ? { ...c, vetoed: !c.vetoed } : c
    ));
  };

  const validChoices = useMemo(() => groupedCravings.filter(c => !c.vetoed), [groupedCravings]);

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

  // QA FIX: Clear Menu only wipes food, keeps participants
  const clearAllCravings = () => {
    setCravings([]);
    setErrorMsg('');
    if (step !== 'lobby' && step !== 'result') {
      setStep('input');
      setCurrentUserIndex(0);
    }
  };

  const resetEverything = () => {
    setStep('lobby');
    setParticipants([]);
    setCravings([]);
    setCurrentUserIndex(0);
    setWinner(null);
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-amber-50 text-slate-900 font-sans p-4 md:p-8 flex flex-col items-center justify-center overflow-hidden" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      
      {/* UI FIX: Reduced base min-height and added dynamic flexibility */}
      <div className="w-full max-w-md bg-white rounded-[3rem] shadow-2xl overflow-hidden relative border border-orange-100/50 min-h-[520px] flex flex-col transition-all duration-500">
        
        {/* Header Section */}
        <header className={`p-8 bg-gradient-to-br ${THEME.gradient} text-white transition-all duration-500 relative shrink-0`}>
          {step !== 'lobby' && step !== 'result' && !spinning && (
            <button 
              onClick={handleBack}
              className="absolute left-6 top-1/2 -translate-y-1/2 p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-all active:scale-90 z-10"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div className={`flex items-center justify-between ${step !== 'lobby' && step !== 'result' ? 'pl-8' : ''}`}>
            <div className="text-left">
              <h1 className="text-3xl font-black tracking-tighter leading-none">Kahit<span className="opacity-60 font-light underline decoration-2 underline-offset-4">Saan</span></h1>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mt-1">Group Decision Engine</p>
            </div>
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
              <Utensils size={24} />
            </div>
          </div>
        </header>

        <div className="p-8 flex-1 flex flex-col overflow-hidden">
          
          {/* STEP 1: LOBBY */}
          {step === 'lobby' && (
            <div className="flex-1 flex flex-col animate-in slide-in-from-bottom-4">
              <div className="space-y-2 text-left mb-6">
                <h2 className="text-xl font-black text-slate-800">Who's eating? 🍽️</h2>
                <p className="text-sm text-slate-500 font-medium">Add group members to break the curse.</p>
              </div>

              <div className="flex gap-2 mb-6">
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

              {/* UI FIX: The list now flex-grows to take available space, pushing button to bottom */}
              <div className="flex-1 space-y-2 overflow-y-auto pr-1 scrollbar-hide mb-6 text-left">
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
                {participants.length === 0 && (
                  <div className="h-full flex flex-center items-center justify-center border-2 border-dashed border-orange-100 rounded-3xl opacity-40">
                    <p className="text-xs font-bold text-orange-300 uppercase tracking-widest italic">Lobby is empty</p>
                  </div>
                )}
              </div>

              <button 
                disabled={participants.length < 2}
                onClick={() => setStep('input')}
                className={`w-full py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-xl transition-all shrink-0 ${participants.length < 2 ? 'bg-slate-100 text-slate-300 grayscale' : `${THEME.primary} text-white ${THEME.buttonShadow} hover:-translate-y-1`}`}
              >
                Let's Choose
              </button>
            </div>
          )}

          {/* STEP 2: INPUT CRAVINGS */}
          {step === 'input' && (
            <div className="flex-1 flex flex-col animate-in slide-in-from-right-4">
              <div className="flex items-center justify-between mb-6">
                <div className="space-y-1 text-left">
                  <h2 className={`text-xl font-black italic uppercase tracking-tighter ${THEME.primaryText}`}>
                    {participants[currentUserIndex].name}'s Turn
                  </h2>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    {currentUserCravings.length === 0 
                      ? "Pick a favorite or type a new one" 
                      : currentUserCravings.length === 3 
                        ? "Perfect selection!" 
                        : `Entry ${currentUserCravings.length + 1} of 3`}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-orange-100 flex items-center justify-center font-black text-orange-600 shrink-0">
                  {currentUserIndex + 1}/{participants.length}
                </div>
              </div>

              {errorMsg && (
                <div className="bg-rose-50 text-rose-600 p-3 rounded-xl text-xs font-bold flex items-center gap-2 animate-bounce mb-4">
                  <AlertTriangle size={14} /> {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 mb-6">
                {['Pizza', 'Samgyup', 'Coffee', 'Burgers', 'Sushi', 'Wings'].map(suggest => {
                  // QA FIX: Items can be reselected if not added by THIS user yet
                  const isAlreadyAddedByUser = currentUserCravings.some(c => c.text.toLowerCase() === suggest.toLowerCase());
                  const isLimit = currentUserCravings.length >= 3;
                  return (
                    <button 
                      key={suggest}
                      disabled={isAlreadyAddedByUser || isLimit}
                      onClick={() => addCraving(suggest)}
                      className={`p-4 rounded-2xl text-xs font-black transition-all border flex items-center gap-2 
                        ${isAlreadyAddedByUser ? 'bg-orange-50 border-orange-100 text-orange-300' : 
                          isLimit ? 'bg-slate-50 border-slate-100 text-slate-200' : 
                          'bg-white text-slate-600 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 shadow-sm'}`}
                    >
                      {isAlreadyAddedByUser ? <Check size={12}/> : <Plus size={12} />} {suggest}
                    </button>
                  );
                })}
              </div>

              <div className="flex-1 space-y-2 text-left mb-6 overflow-y-auto scrollbar-hide">
                <h4 className="text-[10px] font-black uppercase text-slate-400">Current Order ({currentUserCravings.length}/3)</h4>
                <div className="flex flex-wrap gap-2 pt-1">
                  {currentUserCravings.map((c) => (
                    <div key={c.id} className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-xs font-black flex items-center gap-2 border border-orange-200 shadow-sm">
                      {c.text}
                      <button onClick={() => setCravings(cravings.filter(item => item.id !== c.id))}>
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  {currentUserCravings.length === 0 && (
                    <p className="text-xs text-slate-300 italic pt-1">Add at least one choice to continue...</p>
                  )}
                </div>
              </div>

              <div className="space-y-4 shrink-0">
                {currentUserCravings.length < 3 && (
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="e.g. Ramen, Siomai..." 
                      className={`flex-1 bg-slate-50 border-none rounded-2xl px-5 py-4 ${THEME.focusRing} outline-none font-bold placeholder:text-slate-300 shadow-inner`}
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
                    {currentUserIndex === participants.length - 1 ? 'Finish Menu' : 'Next Person'} <ArrowRight size={18} />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: VETO MODE */}
          {step === 'veto' && (
            <div className="flex-1 flex flex-col animate-in slide-in-from-right-4">
              <div className="space-y-1 text-left mb-6">
                <div className="flex items-center gap-2 text-rose-500">
                  <AlertTriangle size={20} />
                  <h2 className="text-xl font-black tracking-tight uppercase italic leading-none">The Veto Round</h2>
                </div>
                <p className="text-xs font-medium text-slate-500">Strike out anything hated. (Social weighted view)</p>
              </div>

              <div className="flex-1 space-y-2 overflow-y-auto pr-1 scrollbar-hide mb-6">
                {groupedCravings.map((group) => (
                  <button 
                    key={group.text}
                    onClick={() => toggleVeto(group.text)}
                    className={`w-full p-4 rounded-2xl border-2 text-left flex items-center justify-between transition-all ${group.vetoed ? 'bg-rose-50 border-rose-100' : 'bg-white border-orange-50 hover:border-orange-200 shadow-sm'}`}
                  >
                    <div className="flex-1 pr-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-black ${group.vetoed ? 'line-through text-rose-300' : 'text-slate-700'}`}>{group.text}</span>
                        {/* Weighted Badge */}
                        {group.weight > 1 && (
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-black text-white ${group.vetoed ? 'bg-rose-200' : 'bg-orange-500 shadow-sm'}`}>
                            {group.weight} votes
                          </span>
                        )}
                      </div>
                      {/* Collate View Contributors */}
                      <p className={`text-[9px] font-bold uppercase tracking-widest mt-1 ${group.vetoed ? 'text-rose-200' : 'text-slate-300'}`}>
                        From: {group.contributors.join(', ')}
                      </p>
                    </div>
                    <div className={`p-1.5 rounded-full shrink-0 transition-colors ${group.vetoed ? 'bg-rose-500 text-white' : 'bg-orange-50 text-orange-400'}`}>
                      {group.vetoed ? <X size={14} /> : <Check size={14} />}
                    </div>
                  </button>
                ))}
              </div>

              <button 
                disabled={validChoices.length === 0}
                onClick={() => setStep('spin')}
                className={`w-full py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-xl transition-all shrink-0 ${validChoices.length === 0 ? 'bg-slate-100 text-slate-300 grayscale' : `bg-gradient-to-r ${THEME.gradient} text-white shadow-orange-100`}`}
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
                          <path d={d} fill={i % 2 === 0 ? '#f97316' : '#f43f5e'} stroke="white" strokeWidth="0.5" />
                          <text x="50" y="15" transform={`rotate(${startAngle + sliceAngle/2} 50 50)`} fill="white" fontSize="4.5" fontWeight="900" textAnchor="middle" className="uppercase tracking-tighter">
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
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.4em]">The choice is made</p>
                <h2 className={`text-6xl font-black tracking-tighter ${THEME.primaryText} uppercase italic leading-tight`}>{winner?.text}</h2>
                <div className="space-y-1 mt-6">
                  <p className="text-[10px] font-black uppercase text-slate-300 tracking-widest">Co-curated by consensus</p>
                  <p className="text-sm font-extrabold text-slate-700">{winner?.contributors.join(', ')}</p>
                </div>
              </div>

              <div className="w-full pt-6 space-y-3">
                <button 
                  onClick={() => {
                    const query = encodeURIComponent(winner.text + " restaurant near me");
                    window.open(`https://www.google.com/maps/search/${query}`, '_blank');
                  }}
                  className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl active:scale-95"
                >
                  <MapPin size={16} /> Find Nearby Places
                </button>
                <button onClick={resetEverything} className="w-full py-4 text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] hover:text-orange-500 transition-all">
                  New Barkada Round
                </button>
              </div>
            </div>
          )}

        </div>

        {/* FOOTER: Separate Reset vs Clear All */}
        {step !== 'lobby' && step !== 'result' && (
          <footer className="px-8 py-4 bg-orange-50/50 border-t border-orange-100/50 flex items-center justify-between shrink-0">
            <div className="flex gap-1.5 shrink-0">
              {['input', 'veto', 'spin'].map((s) => (
                <div key={s} className={`h-1.5 w-6 rounded-full transition-all duration-700 ${step === s ? `${THEME.primary} w-10` : 'bg-orange-200'}`} />
              ))}
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={clearAllCravings}
                disabled={cravings.length === 0}
                className={`text-[10px] font-black uppercase flex items-center gap-1 transition-all ${cravings.length === 0 ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:text-orange-600'}`}
                title="Wipe only cravings, keep group"
              >
                <Eraser size={10} /> Clear Menu
              </button>
              <button 
                onClick={resetEverything} 
                className="text-[10px] font-black uppercase text-slate-400 hover:text-rose-500 transition-colors flex items-center gap-1"
                title="Back to very start"
              >
                 <RotateCw size={10} /> Full Reset
              </button>
            </div>
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