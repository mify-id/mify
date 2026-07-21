import { useState, useEffect, useRef } from 'react';
import { usePage, Link, Head } from '@inertiajs/react';
import { useTranslation } from '@/Contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Chats, X, PaperPlaneRight, Robot, ArrowRight, User } from '@phosphor-icons/react';

export default function AppLayout({ 
    children, 
    title = '', 
    description = 'mify — Laravel + React + Inertia. We architect digital systems that are precise, fast, and built to your exact specification. No templates.',
    showNav = true,
    showFooter = true,
    containerClassName = 'max-w-7xl mx-auto px-6 py-12 md:py-24 relative z-40'
}) {
    // Access global Inertia shared props safely
    const page = usePage();
    const props = page ? page.props : {};
    const auth = props.auth || { user: null };
    const { locale, toggleLocale, t } = useTranslation();

    // AI Chat FAB State
    const [showFab, setShowFab] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef(null);

    // Audio synthesizer helper using Web Audio API (No files needed, completely dynamic)
    const playChime = () => {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
            const osc1 = ctx.createOscillator();
            const osc2 = ctx.createOscillator();
            const gainNode = ctx.createGain();
            
            osc1.connect(gainNode);
            osc2.connect(gainNode);
            gainNode.connect(ctx.destination);
            
            osc1.type = 'sine';
            osc2.type = 'sine';
            
            const now = ctx.currentTime;
            osc1.frequency.setValueAtTime(523.25, now); // C5
            osc2.frequency.setValueAtTime(659.25, now + 0.08); // E5
            
            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(0.12, now + 0.02);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
            
            osc1.start(now);
            osc1.stop(now + 0.35);
            osc2.start(now + 0.08);
            osc2.stop(now + 0.35);
        } catch (e) {
            console.warn("AudioContext block:", e);
        }
    };

    const playSentSound = () => {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gainNode = ctx.createGain();
            osc.connect(gainNode);
            gainNode.connect(ctx.destination);
            osc.type = 'sine';
            const now = ctx.currentTime;
            osc.frequency.setValueAtTime(392.00, now); // G4
            osc.frequency.exponentialRampToValueAtTime(523.25, now + 0.12); // C5
            gainNode.gain.setValueAtTime(0.1, now);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
            osc.start(now);
            osc.stop(now + 0.15);
        } catch (e) {}
    };

    // FAB entrance timer
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowFab(true);
            playChime();
            setMessages([
                {
                    id: 1,
                    sender: 'bot',
                    text: locale === 'en' 
                        ? "Hi! I am the mify AI assistant. How can I help you today with Web Development, Maintenance, Marketing, or Engagement Helpers?"
                        : "Halo! Saya AI assistant mify. Ada yang bisa saya bantu hari ini terkait Jasa Pembuatan Website, Maintenance, Marketing, atau Engagement Helper?"
                }
            ]);
        }, 1500);
        return () => clearTimeout(timer);
    }, [locale]);

    // Scroll chat window to bottom
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isTyping]);

    const handleSendMessage = (textToSend = null) => {
        const text = textToSend || inputMessage;
        if (!text.trim()) return;

        const userMsg = {
            id: Date.now(),
            sender: 'user',
            text: text
        };
        const updatedMessages = [...messages, userMsg];
        setMessages(updatedMessages);
        if (!textToSend) setInputMessage('');
        
        playSentSound();
        setIsTyping(true);

        const apiMessages = updatedMessages.map(m => ({
            sender: m.sender,
            text: m.text
        }));

        fetch(route('chat.handle'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
            },
            body: JSON.stringify({ messages: apiMessages })
        })
        .then(res => {
            if (!res.ok) throw new Error('API Error');
            return res.json();
        })
        .then(data => {
            setMessages(prev => [...prev, {
                id: Date.now(),
                sender: 'bot',
                text: data.reply
            }]);
            playChime();
        })
        .catch(err => {
            console.error("Chat API error:", err);
            // Graceful fallback to local mock response
            let reply = '';
            const lowerText = text.toLowerCase();
            
            if (lowerText.includes('web') || lowerText.includes('website') || lowerText.includes('dev') || lowerText.includes('buat')) {
                reply = locale === 'en'
                    ? "We engineer high-end websites using Laravel, React, and Inertia.js. High-performance monolithic architectures, search optimized, and built to your exact business specifications."
                    : "Kami membangun website kustom premium menggunakan stack Laravel + React + Inertia.js. Sistem kami dirancang tanpa loading lag, tanpa template instan, dan 100% dioptimalkan untuk SEO dan kecepatan.";
            } else if (lowerText.includes('maintenance') || lowerText.includes('rawat') || lowerText.includes('server') || lowerText.includes('cache')) {
                reply = locale === 'en'
                    ? "Our Maintenance service includes server monitoring, database tuning, security patch updates, and automated cache purges to keep your systems operating 24/7."
                    : "Layanan Maintenance kami meliputi pemantauan berkala kesehatan server, optimasi kueri database, pembaruan keamanan, serta pembersihan cache berkala agar sistem Anda selalu responsif.";
            } else if (lowerText.includes('marketing') || lowerText.includes('agency') || lowerText.includes('seo') || lowerText.includes('promosi')) {
                reply = locale === 'en'
                    ? "As a Marketing Agency, we build data-driven acquisition pipelines, technical SEO content systems, and page conversion structures to turn user visits into actual sales."
                    : "Sebagai Marketing Agency, kami menyusun corong akuisisi pengunjung berbasis data, optimasi arsitektur SEO teknikal, serta penyesuaian copywriting konversi halaman untuk meningkatkan omzet penjualan.";
            } else if (lowerText.includes('engagement') || lowerText.includes('helper') || lowerText.includes('bot') || lowerText.includes('whatsapp') || lowerText.includes('wa')) {
                reply = locale === 'en'
                    ? "The Engagement Helper suite integrates custom WhatsApp AI assistants, automated lead qualification routines, and smart CRM follow-ups to engage and secure customer leads instantly."
                    : "Engagement Helper merupakan otomasi asisten pintar seperti bot WhatsApp AI, kualifikasi prospek otomatis, dan integrasi CRM yang membalas dan menindaklanjuti calon klien secara instan.";
            } else if (lowerText.includes('mulai') || lowerText.includes('start') || lowerText.includes('order') || lowerText.includes('hubung') || lowerText.includes('kontak')) {
                reply = locale === 'en'
                    ? "To get started, simply scroll down and fill out our client brief contact form. Our digital systems architects will analyze your requirements and get back to you with a tailor-made proposal."
                    : "Untuk memulai, silakan isi formulir Client Brief di bagian bawah halaman agensi kami. Arsitek sistem kami akan menganalisis kebutuhan Anda dan mengirimkan proposal penawaran khusus.";
            } else {
                reply = locale === 'en'
                    ? "I'm here to answer questions about mify's services: Web Development, Maintenance, Marketing Agency, and Engagement Helpers. Ask me anything!"
                    : "Saya siap membantu Anda memahami layanan mify: Jasa Pembuatan Website, Maintenance, Marketing Agency, dan Engagement Helper. Ajukan pertanyaan Anda!";
            }
            
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                sender: 'bot',
                text: reply
            }]);
            playChime();
        })
        .finally(() => {
            setIsTyping(false);
        });
    };

    const quickSuggestions = locale === 'en' 
        ? ["Web Development", "Maintenance & Server", "Marketing Agency", "Engagement Helper"]
        : ["Pembuatan Website", "Maintenance & Server", "Marketing Agency", "Engagement Helper"];

    return (
        <>
            <Head>
                <title>{title ? `${title} | mify` : 'mify | Modern Digital Architecture & Agency'}</title>
                <meta name="description" content={description} />
            </Head>

            {/* Visual Shell */}
            <div className="scroll-container bg-brand-dark text-white font-sans selection:bg-brand-lime selection:text-brand-dark relative overflow-x-hidden">
                
                {/* === BACKGROUND SYSTEM ===
                     Filosofi: Atmosfer brand yang proporsional dan performant.
                     Lapis 1 → Noise texture: fixed container agar tidak di-repaint saat scroll.
                     Lapis 2 → Brand glow: menggunakan class .brand-glow untuk akselerasi GPU.
                */}

                {/* Lapis 1: Subtle noise texture overlay — fixed to viewport for high performance (octaves=1) */}
                <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.03]"
                    style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }}
                />

                {/* Lapis 2: Brand glow — diakselerasi GPU (.brand-glow) untuk mencegah lag scrolling */}
                {/* Blue glow: menerangi Hero section secara terfokus */}
                <div className="brand-glow top-0 left-1/2 -translate-x-1/2 w-[70vw] h-[400px] bg-brand-blue/[0.12] blur-[120px]" />
                {/* Lime counter-glow: ditempatkan secara diagonal di area bawah */}
                <div className="brand-glow bottom-[15%] right-[-10vw] w-[40vw] h-[400px] bg-brand-lime/[0.06] blur-[120px]" />


                {/* Custom Cursor follower */}
                <CustomCursor />

                {/* Header Navigation */}
                {showNav && (
                    <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl px-6 py-4 flex items-center justify-between z-50 bg-brand-dark/30 backdrop-blur-md border-b border-white/5">
                        <Link href="/" className="flex items-center gap-2 group">
                            {/* Logo: code bracket mark — identitas teknis, bukan letter S biasa */}
                            <span className="w-8 h-8 rounded-xl bg-brand-lime flex items-center justify-center text-brand-dark font-black text-sm shadow-lg group-hover:rotate-6 transition-transform duration-300 tracking-tighter font-mono select-none">
                                &lt;/&gt;
                            </span>
                            <span className="font-extrabold text-2xl tracking-tight text-white group-hover:text-brand-lime transition-colors">
                                mify
                            </span>
                            {/* Status dot — bukan dekorasi, menunjukkan system online/live */}
                            <span
                                className="w-2 h-2 rounded-full bg-brand-lime ml-0.5"
                                title="System online"
                                aria-label="Online"
                            />
                        </Link>

                        {/* Navigation Links */}
                        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
                            <Link href="/#services" className="text-white/70 hover:text-white transition-colors">{t('welcome.nav_services')}</Link>
                            <Link href="/#portfolio" className="text-white/70 hover:text-white transition-colors">{t('welcome.nav_portfolio')}</Link>
                            <Link href="/#about" className="text-white/70 hover:text-white transition-colors">{t('welcome.nav_about')}</Link>
                            <Link href="/#contact" className="text-white/70 hover:text-white transition-colors">{t('welcome.nav_contact')}</Link>
                        </nav>

                        {/* Auth & Language Buttons */}
                        <div className="flex items-center gap-2 sm:gap-4">
                            <button
                                onClick={toggleLocale}
                                className="px-2 sm:px-2.5 py-1 rounded-full border border-white/10 hover:bg-white/5 text-[10px] sm:text-xs font-black uppercase tracking-wider text-brand-lime hover:text-brand-lime/80 transition-colors animate-pulse shrink-0"
                                title={locale === 'en' ? 'Switch to Indonesian' : 'Ganti ke Bahasa Inggris'}
                            >
                                {locale === 'en' ? 'EN' : 'ID'}
                            </button>
                            <a
                                href="#contact"
                                className="px-3.5 sm:px-6 py-2 sm:py-2.5 bg-brand-lime text-brand-dark font-extrabold rounded-full text-[11px] sm:text-xs uppercase tracking-wider sm:tracking-widest whitespace-nowrap hover:scale-[1.03] active:scale-[0.97] transition-all duration-200 shadow-[0_4px_20px_rgba(181,255,0,0.25)] flex items-center gap-1.5"
                            >
                                {t('welcome.nav_cta')}
                            </a>
                        </div>
                    </header>
                )}

                {/* Main Content Area */}
                <main className={containerClassName}>
                    {children}
                </main>

                {/* Footer */}
                {showFooter && (
                    <footer className="bg-black/40 border-t border-white/5 py-12 relative z-40">
                        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-lg bg-brand-lime flex items-center justify-center text-brand-dark font-black text-xs font-mono">
                                    &lt;/&gt;
                                </span>
                                <span className="font-extrabold text-lg text-white">
                                    mify
                                </span>
                            </div>

                            <p className="text-xs text-white/40">
                                © {new Date().getFullYear()} mify. All rights reserved. Built with Laravel, React 19, and Tailwind CSS v4.
                            </p>

                            <div className="flex gap-6 text-xs text-white/60">
                                <Link href="/#services" className="hover:text-brand-lime transition-colors">{t('welcome.nav_services')}</Link>
                                <Link href="/#about" className="hover:text-brand-lime transition-colors">{t('welcome.nav_about')}</Link>
                                <Link href="/#contact" className="hover:text-brand-lime transition-colors">{t('welcome.nav_contact')}</Link>
                            </div>
                        </div>
                    </footer>
                )}

                {/* AI Chatbot FAB and Floating Panel */}
                <AnimatePresence>
                    {showFab && (
                        <>
                            {/* Chat Window Panel */}
                            {chatOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                    className="fixed bottom-24 right-6 md:right-8 w-[calc(100vw-3rem)] sm:w-[380px] h-[480px] bg-brand-dark/95 backdrop-blur-md border border-white/10 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 flex flex-col overflow-hidden"
                                >
                                    {/* Chat Header */}
                                    <div className="p-4 bg-brand-dark border-b border-white/5 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-brand-lime/10 border border-brand-lime/20 flex items-center justify-center text-brand-lime">
                                                <Robot size={20} weight="duotone" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-white tracking-wide">mify Assistant</h4>
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-brand-lime animate-ping" />
                                                    <span className="text-[10px] text-white/50 font-medium">Online & Ready</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => setChatOpen(false)}
                                            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>

                                    {/* Message History */}
                                    <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
                                        {messages.map((msg) => (
                                            <div 
                                                key={msg.id}
                                                className={`flex gap-2 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
                                            >
                                                <div className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-xs
                                                    ${msg.sender === 'user' 
                                                        ? 'bg-brand-blue text-white' 
                                                        : 'bg-white/5 text-brand-lime border border-white/5'
                                                    }`}
                                                >
                                                    {msg.sender === 'user' ? <User size={14} /> : <Robot size={14} />}
                                                </div>
                                                <div className={`p-3 rounded-2xl text-xs leading-relaxed
                                                    ${msg.sender === 'user' 
                                                        ? 'bg-brand-blue text-white rounded-tr-none' 
                                                        : 'bg-white/5 text-white/90 border border-white/5 rounded-tl-none'
                                                    }`}
                                                >
                                                    {msg.text}
                                                </div>
                                            </div>
                                        ))}

                                        {isTyping && (
                                            <div className="flex gap-2 max-w-[85%]">
                                                <div className="w-7 h-7 rounded-lg shrink-0 bg-white/5 text-brand-lime border border-white/5 flex items-center justify-center">
                                                    <Robot size={14} />
                                                </div>
                                                <div className="bg-white/5 border border-white/5 text-white/90 p-3 rounded-2xl rounded-tl-none text-xs flex items-center gap-1">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                                                    <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                                                    <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                                                </div>
                                            </div>
                                        )}
                                        <div ref={chatEndRef} />
                                    </div>

                                    {/* Quick suggestion bubbles */}
                                    <div className="px-4 py-2 bg-brand-dark/40 border-t border-white/5 overflow-x-auto flex gap-2 no-scrollbar">
                                        {quickSuggestions.map((suggestion, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleSendMessage(suggestion)}
                                                className="shrink-0 px-3 py-1.5 rounded-full bg-white/5 hover:bg-brand-lime/10 border border-white/5 hover:border-brand-lime/20 text-[10px] text-white/70 hover:text-brand-lime transition-all cursor-pointer whitespace-nowrap"
                                            >
                                                {suggestion}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Chat Input form */}
                                    <form 
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            handleSendMessage();
                                        }}
                                        className="p-3 bg-brand-dark border-t border-white/5 flex gap-2"
                                    >
                                        <input 
                                            type="text"
                                            value={inputMessage}
                                            onChange={(e) => setInputMessage(e.target.value)}
                                            placeholder={locale === 'en' ? "Ask about our services..." : "Tanyakan tentang layanan..."}
                                            className="flex-1 bg-white/5 border border-white/5 rounded-xl px-3.5 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-brand-lime/50 transition-colors"
                                        />
                                        <button 
                                            type="submit"
                                            className="w-9 h-9 rounded-xl bg-brand-lime text-brand-dark flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-lg"
                                        >
                                            <PaperPlaneRight size={16} weight="bold" />
                                        </button>
                                    </form>
                                </motion.div>
                            )}

                            {/* FAB Floating Button */}
                            <motion.button
                                initial={{ opacity: 0, y: 40, scale: 0.85 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 40, scale: 0.85 }}
                                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    setChatOpen(!chatOpen);
                                    playChime();
                                }}
                                className="fixed bottom-6 right-6 md:bottom-8 md:right-8 w-14 h-14 md:w-16 md:h-16 rounded-full bg-brand-dark border border-brand-lime/30 hover:border-brand-lime/60 text-brand-lime flex items-center justify-center cursor-pointer shadow-[0_0_20px_rgba(181,255,0,0.15)] hover:shadow-[0_0_30px_rgba(181,255,0,0.3)] transition-all z-50 group"
                                aria-label="AI Chatbot Assistant"
                            >
                                <div className="relative">
                                    <Chats size={28} weight="duotone" className="group-hover:rotate-6 transition-transform" />
                                    {/* Active notification indicator */}
                                    {!chatOpen && (
                                        <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-brand-blue rounded-full border-2 border-brand-dark animate-pulse" />
                                    )}
                                </div>
                            </motion.button>
                        </>
                    )}
                </AnimatePresence>

            </div>
        </>
    );
}

export function CustomCursor() {
    const dotRef = useRef(null);
    const ringRef = useRef(null);
    const mouseCoords = useRef({ x: -100, y: -100 });
    const ringCoords = useRef({ x: -100, y: -100 });
    const [hovered, setHovered] = useState(false);
    const [hoverType, setHoverType] = useState('lime'); // 'lime' or 'blue'

    useEffect(() => {
        document.documentElement.classList.add('has-custom-cursor');
        return () => {
            document.documentElement.classList.remove('has-custom-cursor');
        };
    }, []);

    useEffect(() => {
        const onMouseMove = (e) => {
            mouseCoords.current = { x: e.clientX, y: e.clientY };
            if (dotRef.current) {
                dotRef.current.style.transform = `translate3d(${e.clientX - 3}px, ${e.clientY - 3}px, 0)`;
            }
        };

        window.addEventListener('mousemove', onMouseMove);

        let animationFrameId;
        const updateRing = () => {
            const ease = 0.16; // smooth follow lag speed
            ringCoords.current.x += (mouseCoords.current.x - ringCoords.current.x) * ease;
            ringCoords.current.y += (mouseCoords.current.y - ringCoords.current.y) * ease;

            if (ringRef.current) {
                const offset = hovered ? 24 : 16;
                ringRef.current.style.transform = `translate3d(${ringCoords.current.x - offset}px, ${ringCoords.current.y - offset}px, 0)`;
            }

            animationFrameId = requestAnimationFrame(updateRing);
        };

        animationFrameId = requestAnimationFrame(updateRing);

        const handleMouseOver = (e) => {
            const target = e.target.closest('a, button, [role="button"], input, select, textarea, .cursor-pointer, .shuffle-card');
            if (target) {
                setHovered(true);
                // Check if target is a blue themed element
                const isBlueElement = target.classList.contains('bg-brand-blue') || 
                                     target.classList.contains('text-brand-blue') || 
                                     target.closest('.brand-icon-box-blue') || 
                                     target.closest('.hover\\:border-brand-blue\\/40') ||
                                     target.closest('.hover\\:border-brand-blue\\/30');
                if (isBlueElement) {
                    setHoverType('blue');
                } else {
                    setHoverType('lime');
                }
            } else {
                setHovered(false);
            }
        };

        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseover', handleMouseOver);
            cancelAnimationFrame(animationFrameId);
        };
    }, [hovered]);

    return (
        <>
            {/* Inner Dot */}
            <div 
                ref={dotRef}
                className="hidden md:block fixed top-0 left-0 w-1.5 h-1.5 rounded-full pointer-events-none z-[9999] bg-brand-lime mix-blend-screen"
                style={{ transform: 'translate3d(-100px, -100px, 0)' }}
            />
            {/* Outer Ring Follower */}
            <div 
                ref={ringRef}
                className={`hidden md:block fixed top-0 left-0 rounded-full pointer-events-none z-[9998] border transition-[width,height,border-color,background-color] duration-300 ease-out
                    ${hovered 
                        ? (hoverType === 'blue' 
                            ? 'w-12 h-12 border-brand-blue/50 bg-brand-blue/10 shadow-[0_0_15px_rgba(30,74,233,0.2)]' 
                            : 'w-12 h-12 border-brand-lime/50 bg-brand-lime/10 shadow-[0_0_15px_rgba(181,255,0,0.2)]')
                        : 'w-8 h-8 border-brand-lime/20 bg-transparent'
                    }
                `}
                style={{ transform: 'translate3d(-100px, -100px, 0)' }}
            />
        </>
    );
}
