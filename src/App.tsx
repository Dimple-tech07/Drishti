import { motion, AnimatePresence, useScroll, useSpring, useTransform, useMotionValue } from 'motion/react';
import { Megaphone, Radar, HandHeart, Shield, BarChart3, Send, Eye, ArrowLeft, MapPin, Users, MessageSquare, ShieldCheck, Activity, Search, Bell } from 'lucide-react';
import Background from './components/Background';
import React, { ReactNode, useRef, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Link } from 'react-router-dom';

// --- Types ---
interface HoverIconCardProps {
    icon: ReactNode;
    title: string;
    themeColor: string;
    description: string;
    route: string;
}

// --- Components ---

const HoverIconCard = ({ icon, title, themeColor, description, route }: HoverIconCardProps) => {
    const navigate = useNavigate();
    const cardRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = (mouseX / width) - 0.5;
        const yPct = (mouseY / height) - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <div style={{ perspective: "1200px" }}>
            <motion.div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onClick={() => navigate(route)}
                className="glass-panel p-8 flex flex-col items-center justify-center cursor-pointer overflow-hidden relative group h-80 text-center border border-white/5"
                style={{ 
                    transformStyle: "preserve-3d",
                    rotateX,
                    rotateY
                }}
                whileHover={{ 
                    scale: 1.05,
                    boxShadow: `0 0 40px ${themeColor}33`,
                    borderColor: `${themeColor}44`
                }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                initial="rest"
            >
                {/* Corner Glow Effects */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-tl-xl" 
                    style={{ borderColor: themeColor, boxShadow: `-2px -2px 15px ${themeColor}` }} />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-tr-xl" 
                    style={{ borderColor: themeColor, boxShadow: `2px -2px 15px ${themeColor}` }} />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-bl-xl" 
                    style={{ borderColor: themeColor, boxShadow: `-2px 2px 15px ${themeColor}` }} />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-br-xl" 
                    style={{ borderColor: themeColor, boxShadow: `2px 2px 15px ${themeColor}` }} />

                <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700"
                    style={{ background: `radial-gradient(circle at center, ${themeColor} 0%, transparent 70%)` }}
                />
                
                <motion.div
                    style={{ 
                        color: themeColor, 
                        transformStyle: "preserve-3d",
                        translateZ: 60
                    }}
                    className="z-10 mb-6 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                >
                    {icon}
                </motion.div>
                
                <motion.h3 
                    className="text-2xl font-bold tracking-wide z-10 text-white transition-colors" 
                    style={{ 
                        textShadow: `0 2px 15px ${themeColor}88`,
                        transform: "translateZ(30px)"
                    }}
                >
                    {title}
                </motion.h3>
                <motion.p 
                    className="mt-4 text-md text-gray-300 group-hover:text-white transition-colors z-10 hidden md:block"
                    style={{ transform: "translateZ(20px)" }}
                >
                    {description}
                </motion.p>
            </motion.div>
        </div>
    );
};

// --- Page Layout Wrapper ---
const PageContainer = ({ children, title, color }: { children: ReactNode, title: string, color: string }) => {
    const navigate = useNavigate();
    return (
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="min-h-screen bg-[#050505] text-white p-6 md:p-12 pt-24"
        >
            <Background />
            <button 
                onClick={() => navigate('/')}
                className="fixed top-8 left-8 z-[100] flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
            >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-bold uppercase tracking-widest">Back to Hub</span>
            </button>
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-4 mb-12">
                    <div className="w-2 h-12 rounded-full" style={{ backgroundColor: color }} />
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase">{title}</h1>
                </div>
                {children}
            </div>
        </motion.div>
    );
};

// --- 1. Report Emergency Page ---
const ReportEmergency = () => {
    const [messages, setMessages] = useState([
        { id: 1, text: "Drishti Emergency Protocol Initialized. Please provide details of the case.", sender: "system" }
    ]);
    const [input, setInput] = useState("");

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        setMessages([...messages, { id: Date.now(), text: input, sender: "user" }]);
        setInput("");
        // Simulate system response
        setTimeout(() => {
            setMessages(prev => [...prev, { id: Date.now() + 1, text: "Report received. Local authorities and nearby volunteers are being notified. Please stay on the line.", sender: "system" }]);
        }, 1000);
    };

    return (
        <PageContainer title="Report Emergency" color="#FF9F0A">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[70vh]">
                <div className="lg:col-span-2 flex flex-col bg-white/5 border border-white/10 rounded-[32px] overflow-hidden backdrop-blur-xl">
                    <div className="flex-1 p-6 overflow-y-auto space-y-4">
                        {messages.map(m => (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={m.id} 
                                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[80%] p-4 rounded-2xl ${m.sender === 'user' ? 'bg-[#FF9F0A] text-black font-bold' : 'bg-white/10 border border-white/10'}`}>
                                    {m.text}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <form onSubmit={handleSend} className="p-6 bg-black/40 border-t border-white/10 flex gap-4">
                        <input 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type emergency details..." 
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-6 py-4 outline-none focus:border-[#FF9F0A] transition-colors"
                        />
                        <button className="p-4 bg-[#FF9F0A] text-black rounded-xl hover:scale-105 transition-transform">
                            <Send size={24} />
                        </button>
                    </form>
                </div>
                <div className="space-y-6">
                    <div className="p-8 bg-white/5 border border-white/10 rounded-3xl">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-[#FF9F0A] mb-4">Security Status</h3>
                        <div className="flex items-center gap-3 mb-4">
                            <ShieldCheck className="text-[#FF9F0A]" />
                            <span className="font-bold">End-to-End Encrypted</span>
                        </div>
                        <p className="text-sm text-white/50">Your location and identity are protected by AES-256 encryption. Only verified responders can access this data.</p>
                    </div>
                    <div className="p-8 bg-red-500/10 border border-red-500/20 rounded-3xl">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-red-500 mb-4">Active Responders</h3>
                        <div className="flex items-center gap-3">
                            <Users className="text-red-500" />
                            <span className="text-2xl font-black">12</span>
                        </div>
                        <p className="text-sm text-white/50 mt-2">Volunteers within 2km radius have been alerted.</p>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
};

// --- 2. Live Searchlight Page ---
const LiveSearchlight = () => {
    return (
        <PageContainer title="Live Searchlight" color="#0A84FF">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3 aspect-video bg-white/5 border border-white/10 rounded-[40px] relative overflow-hidden group">
                    {/* Simulated Map */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative w-full h-full">
                            {/* Scanning Effect */}
                            <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-[#0A84FF]/20 rounded-full"
                            >
                                <div className="absolute top-0 left-1/2 w-px h-1/2 bg-gradient-to-t from-[#0A84FF] to-transparent origin-bottom" />
                            </motion.div>
                            
                            {/* Volunteer Pins */}
                            {[...Array(8)].map((_, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: [0.4, 1, 0.4] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                                    className="absolute w-3 h-3 bg-[#0A84FF] rounded-full shadow-[0_0_10px_#0A84FF]"
                                    style={{ top: `${20 + Math.random() * 60}%`, left: `${20 + Math.random() * 60}%` }}
                                />
                            ))}

                            {/* Found Child Pinpoint */}
                            <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute top-[45%] left-[55%] z-20"
                            >
                                <div className="relative">
                                    <MapPin size={48} className="text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
                                    <motion.div 
                                        animate={{ scale: [1, 2], opacity: [1, 0] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                        className="absolute inset-0 bg-red-500 rounded-full"
                                    />
                                </div>
                                <div className="absolute top-0 left-12 bg-black/80 border border-red-500/50 p-3 rounded-xl backdrop-blur-md w-48">
                                    <h4 className="text-red-500 font-bold text-xs uppercase tracking-widest">Target Located</h4>
                                    <p className="text-sm font-bold">Sector 4 - Warehouse District</p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                    
                    {/* HUD Controls */}
                    <div className="absolute bottom-8 left-8 flex gap-4">
                        <div className="px-6 py-3 bg-black/60 border border-white/10 rounded-xl backdrop-blur-md flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-xs font-bold uppercase tracking-widest">Live Feed: Active</span>
                        </div>
                        <div className="px-6 py-3 bg-black/60 border border-white/10 rounded-xl backdrop-blur-md flex items-center gap-3">
                            <Users size={16} className="text-[#0A84FF]" />
                            <span className="text-xs font-bold uppercase tracking-widest">Responders: 42</span>
                        </div>
                    </div>
                </div>
                <div className="space-y-6">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#0A84FF]">Active Sectors</h3>
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors cursor-pointer group">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-bold">Sector 0{i}</span>
                                <Activity size={16} className="text-[#0A84FF] group-hover:animate-pulse" />
                            </div>
                            <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${30 + Math.random() * 60}%` }}
                                    className="h-full bg-[#0A84FF]"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </PageContainer>
    );
};

// --- 3. Register Volunteer Page ---
const RegisterVolunteer = () => {
    return (
        <PageContainer title="Register Volunteer" color="#FFD60A">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white/5 border border-white/10 rounded-[40px] p-8 md:p-12 backdrop-blur-xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        <div className="space-y-4">
                            <label className="block text-xs font-bold uppercase tracking-widest text-white/40">Full Name</label>
                            <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 outline-none focus:border-[#FFD60A] transition-colors" placeholder="John Doe" />
                        </div>
                        <div className="space-y-4">
                            <label className="block text-xs font-bold uppercase tracking-widest text-white/40">Contact Number</label>
                            <input type="tel" className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 outline-none focus:border-[#FFD60A] transition-colors" placeholder="+91 98765 43210" />
                        </div>
                        <div className="space-y-4">
                            <label className="block text-xs font-bold uppercase tracking-widest text-white/40">Area of Operation</label>
                            <select className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 outline-none focus:border-[#FFD60A] transition-colors appearance-none">
                                <option>Select Sector</option>
                                <option>Sector 1 - North</option>
                                <option>Sector 2 - East</option>
                                <option>Sector 3 - South</option>
                                <option>Sector 4 - West</option>
                            </select>
                        </div>
                        <div className="space-y-4">
                            <label className="block text-xs font-bold uppercase tracking-widest text-white/40">Verification ID</label>
                            <div className="w-full bg-white/5 border border-dashed border-white/20 rounded-xl p-4 text-center cursor-pointer hover:bg-white/10 transition-colors">
                                <span className="text-sm text-white/40">Upload Aadhaar / Govt ID</span>
                            </div>
                        </div>
                    </div>
                    <button className="w-full py-6 bg-[#FFD60A] text-black font-black uppercase tracking-[0.2em] rounded-2xl hover:scale-[1.02] transition-transform shadow-[0_0_30px_rgba(255,214,10,0.3)]">
                        Initialize Registration
                    </button>
                    <p className="text-center text-xs text-white/30 mt-8 uppercase tracking-widest">
                        By registering, you agree to the Drishti Volunteer Protocol and Code of Conduct.
                    </p>
                </div>
            </div>
        </PageContainer>
    );
};

// --- 4. Report Chat Page ---
const ReportChat = () => {
    return (
        <PageContainer title="Case Feed" color="#30D158">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {[1, 2, 3].map(i => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="p-8 bg-white/5 border border-white/10 rounded-[32px] hover:bg-white/10 transition-all group"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-[#30D158]/20 flex items-center justify-center text-[#30D158]">
                                        <MessageSquare size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-xl">Case Update: #DR-902{i}</h4>
                                        <p className="text-sm text-white/40">Sector {i} • 12 mins ago</p>
                                    </div>
                                </div>
                                <div className="px-4 py-1 bg-[#30D158]/10 border border-[#30D158]/20 rounded-full text-[#30D158] text-[10px] font-bold uppercase tracking-widest">
                                    Verified
                                </div>
                            </div>
                            <p className="text-lg text-white/70 leading-relaxed mb-6">
                                New lead reported by volunteer network in the North Plaza area. CCTV footage being reviewed by local authorities. All volunteers in Sector {i} are requested to maintain high alert.
                            </p>
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40">
                                    <Users size={14} />
                                    <span>24 Responders</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40">
                                    <Bell size={14} />
                                    <span>Alert Sent</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
                <div className="space-y-6">
                    <div className="p-8 bg-white/5 border border-white/10 rounded-[32px]">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-[#30D158] mb-6">Live Stats</h3>
                        <div className="space-y-8">
                            <div>
                                <span className="block text-4xl font-black mb-1">1,242</span>
                                <span className="text-xs font-bold uppercase tracking-widest text-white/40">Active Cases</span>
                            </div>
                            <div>
                                <span className="block text-4xl font-black mb-1">89%</span>
                                <span className="text-xs font-bold uppercase tracking-widest text-white/40">Recovery Rate</span>
                            </div>
                            <div>
                                <span className="block text-4xl font-black mb-1">52k</span>
                                <span className="text-xs font-bold uppercase tracking-widest text-white/40">Volunteers</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
};

// --- Digital Eye Component ---
const DigitalEye = () => {
    return (
        <div className="absolute inset-0 flex items-center justify-center opacity-40 pointer-events-none z-0 overflow-hidden">
            <motion.div 
                className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px]"
                animate={{
                    scaleY: [1, 1, 0.05, 1, 1],
                    opacity: [0.4, 0.4, 0.1, 0.4, 0.4]
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    times: [0, 0.48, 0.5, 0.52, 1],
                    ease: "easeInOut"
                }}
            >
                <svg viewBox="0 0 200 200" className="w-full h-full">
                    <defs>
                        <radialGradient id="eyeGlow" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#0A84FF" stopOpacity="0.6" />
                            <stop offset="70%" stopColor="#0A84FF" stopOpacity="0.1" />
                            <stop offset="100%" stopColor="transparent" />
                        </radialGradient>
                        <radialGradient id="irisLens" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#FF9F0A" />
                            <stop offset="40%" stopColor="#0A84FF" />
                            <stop offset="100%" stopColor="#050505" />
                        </radialGradient>
                        <pattern id="hexPattern" x="0" y="0" width="10" height="17.32" patternUnits="userSpaceOnUse">
                            <path d="M5 0 L10 2.88 L10 8.66 L5 11.54 L0 8.66 L0 2.88 Z" fill="none" stroke="#0A84FF" strokeWidth="0.1" opacity="0.2" />
                        </pattern>
                    </defs>

                    {/* Outer Glow */}
                    <circle cx="100" cy="100" r="80" fill="url(#eyeGlow)" />

                    {/* Hexagonal Grid Overlay */}
                    <path d="M20,100 C20,100 60,40 100,40 C140,40 180,100 180,100 C180,100 140,160 100,160 C60,160 20,100 20,100 Z" fill="url(#hexPattern)" opacity="0.3" />

                    {/* Network Lines & Dots */}
                    <g className="opacity-60" stroke="#0A84FF" strokeWidth="0.2">
                        <path d="M20,100 C20,100 60,40 100,40 C140,40 180,100 180,100 C180,100 140,160 100,160 C60,160 20,100 20,100 Z" fill="rgba(10, 132, 255, 0.05)" strokeWidth="0.8" strokeDasharray="1 2" />
                        <path d="M40,100 C40,100 70,60 100,60 C130,60 160,100 160,100 C160,100 130,140 100,140 C70,140 40,100 40,100 Z" fill="rgba(10, 132, 255, 0.03)" strokeWidth="0.5" />
                        
                        {/* Rotating Data Rings */}
                        <motion.circle 
                            cx="100" cy="100" r="35" 
                            fill="none" stroke="#0A84FF" strokeWidth="0.5" 
                            strokeDasharray="2 10"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        />
                        <motion.circle 
                            cx="100" cy="100" r="30" 
                            fill="none" stroke="#FF9F0A" strokeWidth="0.3" 
                            strokeDasharray="1 5"
                            animate={{ rotate: -360 }}
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        />

                        {/* Scanning Bar */}
                        <motion.line 
                            x1="40" y1="60" x2="160" y2="60" 
                            stroke="#0A84FF" strokeWidth="0.5" opacity="0.5"
                            animate={{ y: [0, 80, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </g>

                    {/* Iris / Camera Lens */}
                    <g transform="translate(100, 100)">
                        <circle r="22" fill="url(#irisLens)" className="drop-shadow-[0_0_15px_rgba(255,159,10,0.6)]" />
                        
                        {/* Digital HUD Elements */}
                        <g opacity="0.6">
                            <line x1="-25" y1="0" x2="-20" y2="0" stroke="white" strokeWidth="0.5" />
                            <line x1="20" y1="0" x2="25" y2="0" stroke="white" strokeWidth="0.5" />
                            <line x1="0" y1="-25" x2="0" y2="-20" stroke="white" strokeWidth="0.5" />
                            <line x1="0" y1="20" x2="0" y2="25" stroke="white" strokeWidth="0.5" />
                        </g>

                        <circle r="18" fill="none" stroke="white" strokeWidth="0.1" opacity="0.3" />
                        <circle r="12" fill="none" stroke="#FF9F0A" strokeWidth="0.5" strokeDasharray="0.5 1.5" />
                        
                        {/* Lens Aperture Details */}
                        {[...Array(6)].map((_, i) => (
                            <rect 
                                key={i} 
                                width="10" 
                                height="0.5" 
                                fill="white" 
                                opacity="0.2" 
                                transform={`rotate(${i * 60}) translate(8, 0)`} 
                            />
                        ))}
                        
                        {/* Center Pupil */}
                        <circle r="4" fill="#050505" />
                        <circle r="1.5" cx="-1" cy="-1" fill="white" opacity="0.6" />
                    </g>
                </svg>
            </motion.div>
        </div>
    );
};

// --- Home Button ---
const HomeButton = () => {
    return (
        <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed top-6 left-6 z-[100] p-3 rounded-full bg-black/40 backdrop-blur-md border border-[#0A84FF]/50 shadow-[0_0_15px_rgba(10,132,255,0.3)] hover:shadow-[0_0_25px_rgba(10,132,255,0.6)] transition-all group"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
        >
            <Eye size={24} className="text-[#0A84FF] group-hover:text-[#52a2ff] transition-colors drop-shadow-[0_0_8px_rgba(10,132,255,0.8)]" />
        </motion.button>
    );
};

// --- Main Hub Component ---
const Hub = () => {
    return (
        <div className="min-h-screen relative font-sans text-white pb-64 selection:bg-[#0A84FF] selection:text-white overflow-x-hidden">
            <Background />
            <HomeButton />
            
            {/* Hero Header */}
            <div className="h-screen flex flex-col items-center justify-center relative z-10 px-6">
                <DigitalEye />
                <motion.h1 
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="text-7xl md:text-9xl font-extrabold tracking-tighter mb-6 glow-text text-center text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400"
                >
                    DRISHTI
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-white/40 font-mono tracking-[0.4em] uppercase text-[10px] mt-4"
                >
                    Decentralized Child Safety Network
                </motion.p>
            </div>

            {/* Features Grid */}
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12 mt-20 z-10 relative">
                <HoverIconCard 
                    icon={<Megaphone size={56} />} 
                    title="Report Emergency" 
                    themeColor="#FF9F0A" 
                    description="Start a secure chat to report missing children."
                    route="/report"
                />
                <HoverIconCard 
                    icon={<Radar size={56} />} 
                    title="Live Searchlight" 
                    themeColor="#0A84FF" 
                    description="View live searches and pinpoint found child locations."
                    route="/searchlight"
                />
                <HoverIconCard 
                    icon={<HandHeart size={56} />} 
                    title="Register Volunteer" 
                    themeColor="#FFD60A" 
                    description="Join the network to receive local missing alerts."
                    route="/join"
                />
                <HoverIconCard 
                    icon={<Shield size={56} />} 
                    title="Report Chat" 
                    themeColor="#30D158" 
                    description="Access live case details and confirm incoming leads."
                    route="/feed"
                />
            </div>
        </div>
    );
};

export default function App() {
  return (
    <Router>
        <AnimatePresence mode="wait">
            <Routes>
                <Route path="/" element={<Hub />} />
                <Route path="/report" element={<ReportEmergency />} />
                <Route path="/searchlight" element={<LiveSearchlight />} />
                <Route path="/join" element={<RegisterVolunteer />} />
                <Route path="/feed" element={<ReportChat />} />
            </Routes>
        </AnimatePresence>
    </Router>
  );
}

