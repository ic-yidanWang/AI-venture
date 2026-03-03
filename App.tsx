
import React, { useState, useEffect, useMemo } from 'react';
import { 
  UserCircle, 
  Search, 
  Home, 
  MessageSquare, 
  Users, 
  TrendingUp, 
  Briefcase, 
  GraduationCap, 
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Sparkles,
  Zap,
  Bot,
  Send
} from 'lucide-react';
import { Post, UserProfile, UserStatus, DomesticStatus, CareerStage, Mode, CareerPreferences, MatchResult, Answer } from './types';
import { MOCK_POSTS, MOCK_USERS, MOCK_ANSWERS } from './constants';
import { generateBioAndSaveToDatabase, AdvisorChat } from './services/geminiService';
import { calculateTfIdfCosineSimilarity } from './utils/nlp';

// --- Utility Components ---

// Added optional children and key to satisfy strict TypeScript checks in some environments
const Card = ({ children, className = "" }: { children?: React.ReactNode, className?: string, key?: React.Key }) => (
  <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden ${className}`}>
    {children}
  </div>
);

// Added optional children and key to satisfy strict TypeScript checks in some environments
const Badge = ({ children, variant = "default", className = "" }: { children?: React.ReactNode, variant?: 'default' | 'outline' | 'success' | 'warning', className?: string, key?: React.Key }) => {
  const styles = {
    default: "bg-slate-100 text-slate-700",
    outline: "border border-slate-200 text-slate-600",
    success: "bg-emerald-50 text-emerald-700",
    warning: "bg-amber-50 text-amber-700"
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
};

// Added optional children and key to satisfy strict TypeScript checks in some environments
const Button = ({ children, onClick, variant = "primary", className = "", disabled = false }: { children?: React.ReactNode, onClick?: () => void, variant?: 'primary' | 'secondary' | 'ghost' | 'danger', className?: string, disabled?: boolean, key?: React.Key }) => {
  const base = "px-4 py-2 rounded-xl font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none text-sm";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-200",
    secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-50",
    danger: "bg-red-50 text-red-600 hover:bg-red-100"
  };
  return (
    <button onClick={onClick} className={`${base} ${variants[variant]} ${className}`} disabled={disabled}>
      {children}
    </button>
  );
};

const AIChatbox = ({ userBio }: { userBio: string }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'advisor', text: string }[]>([
    { role: 'advisor', text: 'Hi! I am your personalized AI career advisor. Based on your background, how can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatInstance, setChatInstance] = useState<AdvisorChat | null>(null);

  useEffect(() => {
    if (userBio) {
      setChatInstance(new AdvisorChat(userBio));
    }
  }, [userBio]);

  const handleSend = async () => {
    if (!input.trim() || !chatInstance) return;
    
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    const response = await chatInstance.sendMessage(userMsg);
    setMessages(prev => [...prev, { role: 'advisor', text: response }]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
          <Bot size={24} />
        </div>
        <div>
          <h3 className="font-bold text-slate-900">AI Advisor</h3>
          <p className="text-xs text-slate-500">Personalized advice based on your profile</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl p-3 text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-100 text-slate-800 rounded-bl-none'}`}>
              <div className="whitespace-pre-wrap">{msg.text}</div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 text-slate-500 rounded-2xl rounded-bl-none p-3 text-sm flex gap-1">
              <span className="animate-bounce">.</span><span className="animate-bounce delay-75">.</span><span className="animate-bounce delay-150">.</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-200 bg-white">
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Ask for resume tips, interview prep, etc..."
            className="flex-1 p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
          />
          <Button onClick={handleSend} disabled={isLoading || !input.trim()} className="px-4">
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

// --- Sub-sections ---

const AuthView = ({ onVerified }: { onVerified: (email: string, existingUser?: UserProfile) => void }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [expectedCode, setExpectedCode] = useState('');

  const isEdu = email.endsWith('.ac.uk') || email.endsWith('.edu');

  const handleSendCode = () => {
    // Just move to the next step, no need to generate a specific code or show an alert
    setStep(2);
  };

  const handleVerifyCode = () => {
    // Accept ANY 6-digit code
    if (code.length === 6) {
      const existingUser = MOCK_USERS.find(u => u.email === email);
      onVerified(email, existingUser);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-slate-50 to-blue-50">
      <Card className="max-w-md w-full p-8">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-600 p-3 rounded-2xl">
            <ShieldCheck className="text-white w-8 h-8" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 text-center mb-2">Verify Student Identity</h2>
        <p className="text-slate-500 text-center mb-8 text-sm">Join the anonymous community for your university.</p>
        
        {step === 1 ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">University Email</label>
              <input 
                type="email" 
                placeholder="you@university.ac.uk"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button 
              className="w-full py-3" 
              disabled={!isEdu}
              onClick={handleSendCode}
            >
              Send Verification Code
            </Button>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400 font-medium">Or</span></div>
            </div>
            <Button variant="secondary" className="w-full py-3 flex items-center justify-center gap-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
              Verify with LinkedIn
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">We sent a 6-digit code to <b>{email}</b></p>
            <input 
              type="text" 
              placeholder="000000"
              maxLength={6}
              className="w-full text-center text-2xl tracking-[1em] px-4 py-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <Button 
              className="w-full py-3" 
              disabled={code.length !== 6}
              onClick={handleVerifyCode}
            >
              Verify Code
            </Button>
            <button onClick={() => setStep(1)} className="w-full text-center text-sm text-slate-500 hover:text-blue-600 font-medium">
              Back to email
            </button>
          </div>
        )}
      </Card>
    </div>
  );
};

const OnboardingView = ({ onComplete }: { onComplete: (profile: Partial<UserProfile>) => void }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    status: 'Undergrad',
    year: 'Year 1',
    focus: [],
    domesticStatus: 'Domestic',
    major: '',
    university: '',
    internshipExperience: '',
    campusExperience: '',
    researchExperience: '',
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const toggleFocus = (f: string) => {
    setFormData(prev => ({
      ...prev,
      focus: prev.focus?.includes(f) ? prev.focus.filter(i => i !== f) : [...(prev.focus || []), f]
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <Card className="max-w-lg w-full p-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Step {step} of 4</span>
            <span className="text-xs font-medium text-slate-400">{Math.round((step / 4) * 100)}% Complete</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${(step / 4) * 100}%` }}></div>
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900">Education Background</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">University</label>
                <input 
                  type="text" 
                  placeholder="e.g. University of Oxford"
                  className="w-full p-3 rounded-xl border border-slate-200"
                  value={formData.university}
                  onChange={(e) => setFormData({...formData, university: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">What is your current status?</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Undergrad', 'Master', 'PhD', 'Alumni', 'Other'].map(s => (
                    <button 
                      key={s}
                      onClick={() => setFormData({...formData, status: s as UserStatus})}
                      className={`px-4 py-2 text-sm rounded-xl border transition-all ${formData.status === s ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 hover:border-slate-300'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Which year are you in?</label>
                <select 
                  className="w-full p-3 rounded-xl border border-slate-200 bg-white"
                  value={formData.year}
                  onChange={(e) => setFormData({...formData, year: e.target.value})}
                >
                  <option>Year 1</option>
                  <option>Year 2</option>
                  <option>Year 3</option>
                  <option>Year 4+</option>
                  <option>Postgrad Year 1</option>
                  <option>Postgrad Year 2+</option>
                  <option>Graduated (Alumni)</option>
                </select>
              </div>
            </div>
            <Button onClick={nextStep} className="w-full py-3">Continue</Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900">Your Major & Focus</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Major / Field of Study</label>
                <input 
                  type="text" 
                  placeholder="e.g. Computer Science, Economics"
                  className="w-full p-3 rounded-xl border border-slate-200"
                  value={formData.major}
                  onChange={(e) => setFormData({...formData, major: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">What are you focused on?</label>
                <div className="flex flex-wrap gap-2">
                  {['Internships', 'Full-time jobs', 'Postgrad applications', 'Switching fields', 'Academic performance', 'Social & student life'].map(f => (
                    <button 
                      key={f}
                      onClick={() => toggleFocus(f)}
                      className={`px-3 py-1.5 text-xs rounded-full border transition-all ${formData.focus?.includes(f) ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={prevStep} className="flex-1">Back</Button>
              <Button onClick={nextStep} className="flex-[2]">Continue</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900">Experience (Optional)</h3>
            <p className="text-sm text-slate-500">Share your background to get better matches. You can skip any of these.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Internship Experience</label>
                <textarea 
                  placeholder="e.g. SWE Intern at Google, Summer Analyst at Goldman Sachs..."
                  className="w-full p-3 rounded-xl border border-slate-200 h-24 resize-none"
                  value={formData.internshipExperience}
                  onChange={(e) => setFormData({...formData, internshipExperience: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Campus Experience</label>
                <textarea 
                  placeholder="e.g. President of CS Club, Debate Team Captain..."
                  className="w-full p-3 rounded-xl border border-slate-200 h-24 resize-none"
                  value={formData.campusExperience}
                  onChange={(e) => setFormData({...formData, campusExperience: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Research Experience</label>
                <textarea 
                  placeholder="e.g. NLP Research Assistant, Published paper on AI..."
                  className="w-full p-3 rounded-xl border border-slate-200 h-24 resize-none"
                  value={formData.researchExperience}
                  onChange={(e) => setFormData({...formData, researchExperience: e.target.value})}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={prevStep} className="flex-1">Back</Button>
              <Button variant="secondary" onClick={nextStep} className="flex-1">Skip</Button>
              <Button onClick={nextStep} className="flex-1">Continue</Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900">Almost there!</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Are you domestic or international?</label>
                <div className="flex gap-2">
                  {['Domestic', 'International'].map(s => (
                    <button 
                      key={s}
                      onClick={() => setFormData({...formData, domesticStatus: s as DomesticStatus})}
                      className={`flex-1 px-4 py-2 text-sm rounded-xl border transition-all ${formData.domesticStatus === s ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 hover:border-slate-300'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={prevStep} className="flex-1">Back</Button>
              <Button onClick={() => onComplete(formData)} className="flex-[2]">Finish Setup</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

const MainApp = ({ user }: { user: UserProfile }) => {
  const [activeMode, setActiveMode] = useState<Mode>('Career');
  const [careerStage, setCareerStage] = useState<CareerStage>('Exploring');
  const [preferences, setPreferences] = useState<CareerPreferences>({ likes: [], dislikes: [], values: [] });
  const [view, setView] = useState<'feed' | 'thread' | 'matching' | 'advisor'>('feed');
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [interactedMatches, setInteractedMatches] = useState<Set<string>>(new Set());
  const [interactionScores, setInteractionScores] = useState<number[]>([]);

  // Filter posts based on mode
  const filteredPosts = useMemo(() => MOCK_POSTS.filter(p => p.category === activeMode), [activeMode]);

  const selectedPost = useMemo(() => MOCK_POSTS.find(p => p.id === selectedPostId), [selectedPostId]);
  const answers = useMemo(() => MOCK_ANSWERS.filter(a => a.postId === selectedPostId), [selectedPostId]);

  const togglePref = (key: keyof CareerPreferences, val: string) => {
    setPreferences(prev => ({
      ...prev,
      [key]: prev[key].includes(val) ? prev[key].filter(v => v !== val) : [...prev[key], val]
    }));
  };

  // NLP-based matching using Cosine Similarity on the 7th column (aiBio)
  const matches = useMemo(() => {
    const corpus = MOCK_USERS.map(u => u.aiBio || "");
    if (user.aiBio) corpus.push(user.aiBio);

    return MOCK_USERS
      .filter(u => u.id !== user.id && !interactedMatches.has(u.id))
      .map(other => {
        const similarity = calculateTfIdfCosineSimilarity(user.aiBio || "", other.aiBio || "", corpus);
        // Compress the similarity score so it doesn't easily reach 100%
        // Maps the 0.0 - 1.0 NLP similarity to a 0 - 85% range for a more realistic UI feel
        const score = Math.round(similarity * 85);
        
        const reasons: string[] = ["Based on AI Bio analysis"];
        if (score > 25) reasons.push("High NLP similarity");
        if (other.major === user.major) reasons.push("Same major");

        return { user: other, score, reasons };
      })
      .sort((a, b) => b.score - a.score);
  }, [user, interactedMatches]);

  const handleMatchAction = (otherId: string, matchScore: number, action: 'match' | 'reject') => {
    // Update the average match score based on the action
    if (action === 'match') {
      // If matched (Chat/Invite), we add their match percentage to our average
      setInteractionScores(prev => [...prev, matchScore]);
    } else {
      // If rejected (Pass), it counts as a 0% success for the recommendation
      setInteractionScores(prev => [...prev, 0]);
    }

    setInteractedMatches(prev => new Set(prev).add(otherId));
  };

  const avgMatch = interactionScores.length > 0 
    ? Math.round(interactionScores.reduce((a, b) => a + b, 0) / interactionScores.length) 
    : null;

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 sticky top-0 h-screen p-4">
        <div className="flex items-center gap-3 px-3 py-6 mb-4">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
            <ShieldCheck size={24} />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900">Alumni X</span>
        </div>
        
        <nav className="flex-1 space-y-1">
          {[
            { id: 'feed', icon: Home, label: 'Explore' },
            { id: 'matching', icon: Users, label: 'Peer Match' },
            { id: 'advisor', icon: Bot, label: 'AI Advisor' },
            { id: 'trending', icon: TrendingUp, label: 'Trending' }
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => setView(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === item.id ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto p-4 bg-slate-50 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
              <UserCircle size={20} className="text-slate-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold truncate">Anonymous User</span>
              <span className="text-[10px] text-slate-400 font-medium">Verified • Avg Match: {avgMatch !== null ? `${avgMatch}%` : '--%'}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header/Toggle */}
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 p-4">
          <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
            <div className="flex bg-slate-100 p-1 rounded-xl w-full max-w-sm">
              <button 
                onClick={() => setActiveMode('Career')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-all text-sm font-semibold ${activeMode === 'Career' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Briefcase size={16} />
                Career
              </button>
              <button 
                onClick={() => setActiveMode('School Life')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-all text-sm font-semibold ${activeMode === 'School Life' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <GraduationCap size={16} />
                School Life
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 max-w-3xl w-full mx-auto p-4 space-y-6">
          {view === 'feed' && (
            <>
              {/* Career Stage Selector (Only in Career Mode) */}
              {activeMode === 'Career' && (
                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <h4 className="text-sm font-bold text-slate-900">What is your current stage?</h4>
                    <div className="flex flex-wrap gap-2">
                      {['Exploring', 'Preparing', 'Applying', 'Interviewing', 'Offer', 'Struggling'].map(stage => (
                        <button 
                          key={stage}
                          onClick={() => setCareerStage(stage as CareerStage)}
                          className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all ${careerStage === stage ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
                        >
                          {stage}
                        </button>
                      ))}
                    </div>
                  </div>

                  {careerStage === 'Struggling' && (
                    <Card className="p-5 border-blue-100 bg-blue-50/50">
                      <div className="flex gap-3 mb-4">
                        <Zap className="text-blue-600" size={20} />
                        <div>
                          <h4 className="text-sm font-bold">Preferences & Exclusions</h4>
                          <p className="text-xs text-slate-500">Helping us find the right mentors for you.</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex flex-col gap-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Likes</span>
                          <div className="flex flex-wrap gap-1.5">
                            {['math-heavy', 'people-facing', 'creative', 'structured', 'fast-paced'].map(l => (
                              <button key={l} onClick={() => togglePref('likes', l)} className={`px-3 py-1 rounded-full text-[10px] border ${preferences.likes.includes(l) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200'}`}>{l}</button>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Dislikes</span>
                          <div className="flex flex-wrap gap-1.5">
                            {['coding-heavy', 'sales', 'high uncertainty', 'long hours'].map(d => (
                              <button key={d} onClick={() => togglePref('dislikes', d)} className={`px-3 py-1 rounded-full text-[10px] border ${preferences.dislikes.includes(d) ? 'bg-red-600 text-white border-red-600' : 'bg-white text-slate-600 border-slate-200'}`}>{d}</button>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Values</span>
                          <div className="flex flex-wrap gap-1.5">
                            {['money', 'impact', 'stability', 'visa-friendly', 'WLB'].map(v => (
                              <button key={v} onClick={() => togglePref('values', v)} className={`px-3 py-1 rounded-full text-[10px] border ${preferences.values.includes(v) ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200'}`}>{v}</button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  )}
                </div>
              )}

              {/* Trending Posts */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg">Trending Discussions</h3>
                  <div className="flex items-center gap-1 text-slate-400">
                    <TrendingUp size={16} />
                    <span className="text-xs font-medium">Updated just now</span>
                  </div>
                </div>
                {filteredPosts.map(post => (
                  <Card 
                    key={post.id} 
                    className="cursor-pointer hover:border-blue-300 transition-all active:scale-[0.99]"
                  >
                    <div className="p-5" onClick={() => { setSelectedPostId(post.id); setView('thread'); }}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{post.authorBadge}</Badge>
                          <span className="text-[10px] text-slate-400">• {post.createdAt}</span>
                        </div>
                        <button className="text-slate-400 hover:text-slate-600"><Flag size={14} /></button>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mb-2 leading-tight">{post.title}</h4>
                      <p className="text-sm text-slate-600 line-clamp-2 mb-4">{post.content}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {post.tags.map(tag => <Badge key={tag}>{tag}</Badge>)}
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <MessageSquare size={14} />
                          <span className="text-xs font-bold">{post.repliesCount}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}

          {view === 'matching' && (
            <div className="space-y-6">
              <div className="text-center py-8">
                <div className="inline-flex p-3 rounded-2xl bg-blue-100 text-blue-600 mb-4">
                  <Users size={32} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Find Someone Like You</h3>
                <p className="text-slate-500 max-w-sm mx-auto mt-2">Connecting you with peers based on major, stage, and life preferences.</p>
              </div>

              <div className="grid gap-4">
                {matches.map(({ user: other, score, reasons }) => (
                  <Card key={other.id} className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-bold text-slate-900">{other.university || 'Unknown University'}</span>
                          <span className="text-xs text-slate-500">• {other.major} • {other.status}</span>
                          <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${score > 50 ? 'bg-orange-50 text-orange-600' : 'bg-slate-100 text-slate-600'}`}>
                            {score}% Match
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 mb-4">Interested in {other.focus.join(', ')}</p>
                        <div className="flex flex-wrap gap-2 mb-6">
                          {reasons.map(r => (
                            <span key={r} className="text-[10px] px-2 py-0.5 bg-slate-50 border border-slate-100 text-slate-500 rounded-md">
                              {r}
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Button className="flex-1" onClick={() => handleMatchAction(other.id, score, 'match')}>Chat</Button>
                          <Button variant="secondary" className="flex-1" onClick={() => handleMatchAction(other.id, score, 'match')}>Invite</Button>
                          <Button variant="ghost" className="flex-1 text-slate-400 hover:text-red-500" onClick={() => handleMatchAction(other.id, score, 'reject')}>Pass</Button>
                        </div>
                      </div>
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl flex items-center justify-center border border-slate-100">
                        <UserCircle size={40} className="text-slate-300" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {view === 'advisor' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <AIChatbox userBio={user.aiBio || "I am a student exploring career options."} />
            </div>
          )}

          {view === 'thread' && selectedPost && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <button 
                onClick={() => setView('feed')}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-semibold text-sm transition-all"
              >
                <ArrowLeft size={16} />
                Back to Feed
              </button>

              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="success">Verified {selectedPost.authorBadge.split(' • ')[1]}</Badge>
                  <span className="text-xs text-slate-400">{selectedPost.createdAt}</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-4">{selectedPost.title}</h2>
                <div className="text-slate-700 leading-relaxed whitespace-pre-line mb-6">
                  {selectedPost.content}
                </div>
                <div className="flex items-center gap-4 border-t border-slate-50 pt-4">
                  <button className="flex items-center gap-1.5 text-slate-500 hover:text-blue-600 text-xs font-bold transition-colors">
                    <ThumbsUp size={16} /> 12
                  </button>
                  <button className="flex items-center gap-1.5 text-slate-500 hover:text-red-600 text-xs font-bold transition-colors">
                    <ThumbsDown size={16} />
                  </button>
                  <button className="ml-auto text-slate-400 hover:text-slate-600 text-xs font-bold">Report</button>
                </div>
              </Card>

              {/* AI Action Plan */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                <Card className="relative p-6 bg-slate-900 border-0">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="bg-blue-600 p-1.5 rounded-lg">
                      <Sparkles size={16} className="text-white" />
                    </div>
                    <h4 className="text-white font-bold text-sm tracking-tight">AI Action Plan</h4>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex gap-3">
                      <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px] font-bold mt-0.5">1</div>
                      <p className="text-slate-300 text-sm">Refine your <b>"Why JP Morgan"</b> story by linking their ESG goals to your background.</p>
                    </li>
                    <li className="flex gap-3">
                      <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px] font-bold mt-0.5">2</div>
                      <p className="text-slate-300 text-sm">Practise <b>2-minute STAR responses</b> for technical hurdles you overcame in projects.</p>
                    </li>
                    <li className="flex gap-3">
                      <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px] font-bold mt-0.5">3</div>
                      <p className="text-slate-300 text-sm">Check the specific HireVue <b>video lighting</b>—avoid shadows to look more confident.</p>
                    </li>
                  </ul>
                </Card>
              </div>

              {/* Answers */}
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900">Answers ({answers.length})</h3>
                {answers.map(ans => (
                  <Card key={ans.id} className={`p-5 ${ans.isActionable ? 'border-l-4 border-l-blue-600' : ''}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-700">{ans.authorBadge}</span>
                        {ans.isActionable && <Badge variant="warning" className="flex items-center gap-1"><Zap size={10} /> Helpful</Badge>}
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">Cred Score: {MOCK_USERS.find(u => u.id === ans.authorId)?.credibilityScore || 0}</span>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed mb-4">{ans.content}</p>
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-1 text-slate-500 text-xs font-bold hover:text-blue-600">
                        <ThumbsUp size={14} /> {ans.upvotes}
                      </button>
                      <button className="flex items-center gap-1 text-slate-500 text-xs font-bold hover:text-red-600">
                        <ThumbsDown size={14} />
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Right Sidebar - Widgets */}
      <aside className="hidden lg:flex flex-col w-80 p-6 sticky top-0 h-screen space-y-6">
        <Card className="p-5 bg-gradient-to-br from-white to-blue-50/30">
          <h4 className="font-bold text-sm mb-4">Trending Tags</h4>
          <div className="flex flex-wrap gap-2">
            {['#Internship2024', '#LSE', '#HireVue', '#QuantFinance', '#VisaSponsorship', '#WLB'].map(tag => (
              <button key={tag} className="text-xs font-semibold px-3 py-1.5 bg-white border border-slate-200 rounded-lg hover:border-blue-400 hover:text-blue-600 transition-all">
                {tag}
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h4 className="font-bold text-sm mb-4">Similar Peers Online</h4>
          <div className="space-y-4">
            {matches.slice(0, 3).map(({ user: other, score }) => (
              <div key={other.id} className="flex items-center justify-between gap-3 group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                      <UserCircle size={24} />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold group-hover:text-blue-600 transition-colors">{other.major}</span>
                    <span className="text-[10px] text-slate-400">{other.status} • {score * 10}% match</span>
                  </div>
                </div>
                <ChevronRight size={14} className="text-slate-300 group-hover:text-blue-500" />
              </div>
            ))}
          </div>
          <Button variant="ghost" className="w-full mt-4 text-xs" onClick={() => setView('matching')}>View All Matches</Button>
        </Card>

        <div className="p-4 rounded-2xl bg-slate-900 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={16} className="text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider">Community Trust</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            All users are verified student/alumni. Be helpful, gain credibility, and unlock private groups.
          </p>
        </div>
      </aside>
    </div>
  );
};

export default function App() {
  const [authState, setAuthState] = useState<'login' | 'onboarding' | 'main'>('login');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [tempEmail, setTempEmail] = useState('');

  const handleVerified = (email: string, existingUser?: UserProfile) => {
    if (existingUser) {
      setUserProfile(existingUser);
      setAuthState('main');
    } else {
      setTempEmail(email);
      setAuthState('onboarding');
    }
  };

  const handleOnboardingComplete = (data: Partial<UserProfile>) => {
    // Generate a temporary bio so NLP matching works instantly
    const tempBio = `I am a ${data.status || 'student'} at ${data.university || 'university'} majoring in ${data.major || 'my field'}. I am focused on ${(data.focus || []).join(' and ')}. My experience includes ${data.internshipExperience || 'various projects'}.`;

    // 1. Instantly let the user in (no loading screen)
    const newUser: UserProfile = {
      id: 'u-current',
      email: tempEmail,
      university: data.university || 'Unknown University',
      status: data.status || 'Undergrad',
      year: data.year || 'Year 1',
      major: data.major || 'Computer Science',
      focus: data.focus || [],
      domesticStatus: data.domesticStatus || 'Domestic',
      internshipExperience: data.internshipExperience,
      campusExperience: data.campusExperience,
      researchExperience: data.researchExperience,
      credibilityScore: 100,
      isVerified: true,
      careerStage: 'Exploring',
      aiBio: tempBio
    };
    
    setUserProfile(newUser);
    setAuthState('main');

    // 2. Background task: Call Gemini to generate the 7th column (bio) and save to DB
    generateBioAndSaveToDatabase(newUser).then((realAiBio) => {
      // Silently update the user's profile with the real AI-generated bio
      setUserProfile(prev => prev ? { ...prev, aiBio: realAiBio } : null);
    });
  };

  return (
    <div className="antialiased text-slate-900">
      {authState === 'login' && <AuthView onVerified={handleVerified} />}
      {authState === 'onboarding' && <OnboardingView onComplete={handleOnboardingComplete} />}
      {authState === 'main' && userProfile && <MainApp user={userProfile} />}
    </div>
  );
}
