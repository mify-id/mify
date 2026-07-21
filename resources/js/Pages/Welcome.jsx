import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';
import { useTranslation } from '@/Contexts/LanguageContext';
import { 
    Heart, 
    ChatCircle, 
    PaperPlaneRight, 
    Bookmark, 
    Sparkle, 
    ArrowRight, 
    Code, 
    TrendUp, 
    Stack, 
    Check, 
    CursorClick, 
    Plus, 
    Gear, 
    CheckCircle,
    Chats,
    Globe,
    Briefcase,
    Eye,
    Wrench
} from '@phosphor-icons/react';

// Reusable Instagram-style card component with micro-interactions
function InstagramCard({ 
    variant = 'blue', 
    profileName = 'mify', 
    profileSub = 'Sponsored', 
    badges = [], 
    title = '', 
    description = '', 
    children, 
    initialLikes = 120 
}) {
    const [likes, setLikes] = useState(initialLikes);
    const [isLiked, setIsLiked] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [commentsCount, setCommentsCount] = useState(12);
    const [isCommented, setIsCommented] = useState(false);

    const handleLike = (e) => {
        if (e) e.stopPropagation();
        if (isLiked) {
            setLikes(likes - 1);
        } else {
            setLikes(likes + 1);
        }
        setIsLiked(!isLiked);
    };

    const handleBookmark = (e) => {
        if (e) e.stopPropagation();
        setIsBookmarked(!isBookmarked);
    };

    const handleComment = (e) => {
        if (e) e.stopPropagation();
        if (!isCommented) {
            setCommentsCount(commentsCount + 1);
        } else {
            setCommentsCount(commentsCount - 1);
        }
        setIsCommented(!isCommented);
    };

    const isBlue = variant === 'blue';
    const cardBg = isBlue ? 'bg-brand-blue text-white' : 'bg-brand-lime text-brand-dark';
    const borderColor = isBlue ? 'border-white/10' : 'border-brand-dark/5';
    const profileCircleBg = isBlue ? 'bg-white/20' : 'bg-brand-dark/10';
    const profileInnerBg = isBlue ? 'bg-white/40' : 'bg-brand-dark/30';
    const textSub = isBlue ? 'text-white/60' : 'text-brand-dark/60';
    const textBody = isBlue ? 'text-white/80' : 'text-brand-dark/80';
    const borderDivider = isBlue ? 'border-white/10' : 'border-brand-dark/10';
    
    const iconHoverColor = isBlue ? 'hover:text-brand-lime' : 'hover:text-brand-blue';

    return (
        <div 
            className={`w-full max-w-[360px] aspect-[4/5] rounded-[24px] p-6 shadow-2xl border ${borderColor} flex flex-col justify-between relative overflow-hidden hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ease-out group ${cardBg}`}
        >
            {/* Background Accent Gradients */}
            <div className={`absolute -right-16 -top-16 w-32 h-32 rounded-full blur-2xl transition-all duration-300 ${
                isBlue 
                    ? 'bg-brand-lime/10 group-hover:bg-brand-lime/25' 
                    : 'bg-brand-blue/10 group-hover:bg-brand-blue/25'
            }`} />
            
            {/* Card Header (Instagram Profile Style) */}
            <div className={`flex items-center gap-3 border-b ${borderDivider} pb-4 z-10`}>
                <div className={`w-10 h-10 rounded-full ${profileCircleBg} border ${borderColor} flex items-center justify-center`}>
                    <div className={`w-6 h-6 rounded-full ${profileInnerBg} flex items-center justify-center font-bold text-xs`}>
                        {profileName.charAt(0).toUpperCase()}
                    </div>
                </div>
                <div className="flex flex-col">
                    <span className="font-extrabold text-sm tracking-tight leading-none mb-1">{profileName}</span>
                    <span className={`text-[10px] ${textSub} leading-none`}>{profileSub}</span>
                </div>
                <div className="ml-auto flex gap-1">
                    <div className={`w-1.5 h-1.5 rounded-full ${isBlue ? 'bg-white/40' : 'bg-brand-dark/40'}`}></div>
                    <div className={`w-1.5 h-1.5 rounded-full ${isBlue ? 'bg-white/40' : 'bg-brand-dark/40'}`}></div>
                    <div className={`w-1.5 h-1.5 rounded-full ${isBlue ? 'bg-white/40' : 'bg-brand-dark/40'}`}></div>
                </div>
            </div>

            {/* Card Content Area */}
            <div className="my-auto flex flex-col gap-4 py-2 z-10">
                {title && (
                    <h3 className="text-xl md:text-2xl font-black tracking-tight leading-tight">
                        {title}
                    </h3>
                )}
                
                {description && (
                    <p className={`text-sm leading-relaxed ${textBody}`}>
                        {description}
                    </p>
                )}

                {/* Badges Container */}
                {badges.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
                        <AnimatePresence>
                            {badges.map((badge, idx) => {
                                const isOdd = idx % 2 === 1;
                                let badgeStyle = '';
                                
                                if (isBlue) {
                                    badgeStyle = isOdd 
                                        ? 'bg-brand-lime text-brand-dark' 
                                        : 'bg-white text-brand-dark';
                                } else {
                                    badgeStyle = isOdd 
                                        ? 'bg-brand-blue text-white' 
                                        : 'bg-white text-brand-dark border border-brand-dark/15';
                                }

                                return (
                                    <motion.span 
                                        key={badge}
                                        initial={{ opacity: 0, scale: 0.85, y: 5 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.85, y: -5 }}
                                        transition={{ duration: 0.25, ease: "easeOut" }}
                                        layout
                                        className={`inline-flex items-center gap-1 font-bold px-3 py-1.5 rounded-full text-xs shadow-sm hover:-translate-y-0.5 hover:rotate-1 transition-all duration-200 cursor-default ${badgeStyle}`}
                                    >
                                        {isOdd ? <Sparkle className="w-3.5 h-3.5" weight="bold" /> : <Check className="w-3.5 h-3.5" weight="bold" />}
                                        {badge}
                                    </motion.span>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}

                {children}
            </div>

            {/* Card Footer (Engagement Bar) */}
            <div className={`pt-4 border-t ${borderDivider} mt-auto z-10 flex flex-col gap-2`}>
                <div className="flex items-center justify-between">
                    <div className="flex gap-4">
                        <button 
                            onClick={handleLike}
                            className={`transition-all duration-200 hover:scale-110 active:scale-95 ${isLiked ? 'text-red-500' : ''}`}
                        >
                            <Heart className={`w-6 h-6 ${isLiked ? 'text-red-500' : (isBlue ? 'text-white' : 'text-brand-dark')}`} weight={isLiked ? "fill" : "bold"} />
                        </button>
                        <button 
                            onClick={handleComment}
                            className={`transition-all duration-200 hover:scale-110 active:scale-95 ${iconHoverColor}`}
                        >
                            <ChatCircle className={`w-6 h-6 ${isBlue ? 'text-white' : 'text-brand-dark'}`} weight={isCommented ? "fill" : "bold"} />
                        </button>
                        <button 
                            onClick={(e) => e.stopPropagation()}
                            className={`transition-all duration-200 hover:scale-110 active:scale-95 ${iconHoverColor}`}
                        >
                            <PaperPlaneRight className="w-6 h-6" weight="bold" />
                        </button>
                    </div>
                    <button 
                        onClick={handleBookmark}
                        className={`transition-all duration-200 hover:scale-110 active:scale-95 ${isBookmarked ? 'text-brand-lime' : ''}`}
                    >
                        <Bookmark className={`w-6 h-6 ${isBookmarked ? (isBlue ? 'text-brand-lime' : 'text-brand-blue') : (isBlue ? 'text-white' : 'text-brand-dark')}`} weight={isBookmarked ? "fill" : "bold"} />
                    </button>
                </div>
                <div className="flex justify-between items-center text-xs font-bold px-0.5">
                    <span>{likes.toLocaleString()} likes</span>
                    <span>{commentsCount} comments</span>
                </div>
            </div>
        </div>
    );
}

export default function Welcome({ portfolios = [] }) {
    const { t } = useTranslation();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [activeModalProject, setActiveModalProject] = useState(null);
    const [contactSubmitted, setContactSubmitted] = useState(false);
    const { data: formData, setData: setFormData, post, processing, reset } = useForm({
        name: '',
        email: '',
        message: '',
    });

    // Card stack shuffling states for Hero section
    const [heroActiveCard, setHeroActiveCard] = useState('blue'); // 'blue' or 'lime'
    const [isHeroShuffling, setIsHeroShuffling] = useState(false);

    const handleHeroShuffle = () => {
        if (isHeroShuffling) return;
        setIsHeroShuffling(true);
        setTimeout(() => {
            setHeroActiveCard(prev => (prev === 'blue' ? 'lime' : 'blue'));
            setIsHeroShuffling(false);
        }, 300);
    };

    const handleContactSubmit = (e) => {
        e.preventDefault();
        post(route('briefs.store'), {
            preserveScroll: true,
            onSuccess: () => {
                setContactSubmitted(true);
                reset();
            }
        });
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.05
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1]
            }
        }
    };

    return (
        <AppLayout 
            title="Welcome" 
            containerClassName="w-full relative" // override to let child page control internal container styling
        >
            <section className="snap-section brand-section brand-section-transparent min-h-screen flex items-center w-full pt-28 pb-16 md:py-32">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="lg:col-span-7 flex flex-col items-start text-left gap-5 sm:gap-6"
                >
                    {/* Tagline Badge */}
                    <motion.div 
                        variants={itemVariants} 
                        className="inline-flex items-center gap-2 max-w-full bg-white/5 border border-white/10 rounded-full px-3 py-1.5 hover:bg-white/[0.08] hover:border-brand-blue/30 transition-all duration-300 select-none overflow-hidden"
                    >
                        <span className="bg-brand-lime text-brand-dark font-black text-[9px] px-2 py-0.5 rounded uppercase tracking-widest shrink-0">
                            {t('welcome.hero_span')}
                        </span>
                        <span className="text-[11px] sm:text-xs text-white/80 font-medium flex items-center gap-1.5 truncate">
                            {t('welcome.hero_subspan')} <ArrowRight className="w-3.5 h-3.5 text-brand-lime shrink-0" weight="bold" />
                        </span>
                    </motion.div>

                    {/* Heading */}
                    <motion.h1 
                        variants={itemVariants}
                        className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] text-white"
                    >
                        {t('welcome.hero_heading_1')} <span className="font-serif italic font-normal text-brand-lime">{t('welcome.hero_heading_2')}</span>
                    </motion.h1>

                    {/* Description */}
                    <motion.p 
                        variants={itemVariants}
                        className="text-base sm:text-lg md:text-xl text-white/70 leading-relaxed max-w-xl"
                    >
                        {t('welcome.hero_desc')}
                    </motion.p>

                    {/* Call To Actions — Sesuai dengan DESIGN.md Primary & Secondary CTAs */}
                    <motion.div 
                        variants={itemVariants}
                        className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto pt-2"
                    >
                        <a
                            href="#contact"
                            className="px-6 sm:px-8 py-3.5 sm:py-4 bg-brand-lime text-brand-dark font-extrabold rounded-full text-sm sm:text-base flex items-center justify-center gap-2 hover:scale-[1.03] active:scale-[0.97] transition-all duration-200 shadow-[0_4px_25px_rgba(181,255,0,0.25)]"
                        >
                            {t('welcome.hero_cta')} <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" weight="bold" />
                        </a>
                        <a
                            href="#services"
                            className="px-6 sm:px-8 py-3.5 sm:py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-full text-sm sm:text-base border border-white/10 hover:border-white/20 flex items-center justify-center gap-2 transition-all duration-200"
                        >
                            {t('welcome.hero_view_systems')} <CursorClick className="w-4 h-4 sm:w-5 sm:h-5 text-brand-lime" weight="bold" />
                        </a>
                    </motion.div>

                    {/* Metrics Bar — Redesigned with right-padding protection against bottom-right AI Chat FAB collision */}
                    <motion.div 
                        variants={itemVariants}
                        className="grid grid-cols-3 gap-2 sm:gap-4 border-t border-white/10 pt-6 sm:pt-8 mt-2 sm:mt-4 w-full max-w-md pr-12 sm:pr-0"
                    >
                        <div className="flex flex-col gap-1 border-r border-white/5 pr-3 sm:pr-4">
                            <span className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none">10x</span>
                            <span className="text-[9px] sm:text-[10px] text-white/40 font-bold uppercase tracking-widest leading-tight">{t('welcome.metric_speed')}</span>
                        </div>
                        <div className="flex flex-col gap-1 border-r border-white/5 px-2">
                            <span className="text-2xl sm:text-3xl font-black text-brand-lime tracking-tight leading-none">99%</span>
                            <span className="text-[9px] sm:text-[10px] text-white/40 font-bold uppercase tracking-widest leading-tight">{t('welcome.metric_lighthouse')}</span>
                        </div>
                        <div className="flex flex-col gap-1 pl-2">
                            <span className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none">3.2x</span>
                            <span className="text-[9px] sm:text-[10px] text-white/40 font-bold uppercase tracking-widest leading-tight">{t('welcome.metric_conversion')}</span>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Overlapping Interactive Instagram-style Cards (Poker Deck Shuffle style) */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.96, y: 24 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
                    className="lg:col-span-5 flex flex-col items-center justify-center relative min-h-[520px] w-full mt-12 lg:mt-0"
                >
                    
                    {/* Floating Instruction sticker */}
                    <div className="absolute top-[34%] left-[-8%] hidden xl:block z-30 pointer-events-none select-none">
                        <svg className="w-20 h-20 text-brand-lime rotate-[-30deg]" fill="none" viewBox="0 0 100 100">
                            <path d="M10,80 Q30,40 70,30 M55,18 L73,32 L58,45" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none" />
                        </svg>
                        <span className="text-[10px] font-black tracking-widest uppercase text-brand-lime rotate-[5deg] block -mt-4 ml-6 animate-pulse">
                            {t('welcome.click_shuffle')}
                        </span>
                    </div>

                    <div 
                        onClick={handleHeroShuffle}
                        className={`relative w-full max-w-[340px] md:max-w-[360px] h-[450px] cursor-pointer select-none ${heroActiveCard === 'blue' ? 'card-blue-active' : 'card-lime-active'}`}
                    >
                        {/* Blue Card */}
                        <div className={`shuffle-card card-blue ${isHeroShuffling && heroActiveCard === 'blue' ? 'shuffling-out' : ''}`}>
                            <InstagramCard 
                                variant="blue" 
                                title={t('welcome.card_1_title')} 
                                description={t('welcome.card_1_desc')}
                                badges={['Laravel 13', 'Inertia 2.0', 'PostgreSQL']}
                                initialLikes={342}
                            />
                        </div>

                        {/* Lime Card */}
                        <div className={`shuffle-card card-lime ${isHeroShuffling && heroActiveCard === 'lime' ? 'shuffling-out' : ''}`}>
                            <InstagramCard 
                                variant="lime" 
                                title={t('welcome.card_2_title')} 
                                description={t('welcome.card_2_desc')}
                                badges={['Tailwind v4', 'React 19', 'Aesthetics']}
                                initialLikes={892}
                            />
                        </div>
                    </div>
                    
                    {/* Small helpful hint on mobile/tablet */}
                    <span className="text-[10px] text-white/30 uppercase tracking-widest font-black mt-4 block xl:hidden">
                        {t('welcome.tap_shuffle')}
                    </span>
                </motion.div>
                </div>
            </section>

            {/* Services Section */}
            <section id="services" className="snap-section brand-section brand-section-subtle min-h-screen flex items-center w-full">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4"
                    >
                        <div className="flex flex-col items-start gap-4">
                            <span className="bg-brand-blue text-white font-black text-xs px-3.5 py-1.5 rounded-full uppercase tracking-widest">
                                {t('welcome.services_span')}
                            </span>
                            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                                {t('welcome.services_title_1')} <span className="font-serif italic font-normal text-brand-lime">{t('welcome.services_title_2')}</span>
                            </h2>
                        </div>
                        <p className="text-white/60 max-w-md text-base leading-relaxed">
                            {t('welcome.services_desc')}
                        </p>
                    </motion.div>

                    {/* Bento Grid — asimetris, bukan 4 kartu identik */}
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 lg:gap-5">

                        {/* [1] Featured Card — Jasa Pembuatan Website (lebar 4 kolom) */}
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                            className="md:col-span-4 brand-card hover:border-brand-blue/30 flex flex-col justify-between group min-h-[260px]"
                        >
                            <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-brand-blue/10 blur-2xl group-hover:bg-brand-blue/20 transition-all" />
                            <div className="flex flex-col gap-4 z-10">
                                <div className="flex items-center gap-3">
                                    <div className="brand-icon-box brand-icon-box-blue text-brand-blue">
                                        <Globe className="w-6 h-6" weight="bold" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/30">{t('welcome.bento_1_tag')}</span>
                                </div>
                                <h3 className="text-3xl font-black tracking-tight">
                                    {t('welcome.bento_1_title')}
                                </h3>
                                <p className="text-sm text-white/70 leading-relaxed max-w-sm">
                                    {t('welcome.bento_1_desc')}
                                </p>
                            </div>
                            <a href="#contact" className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-lime mt-8 cursor-pointer z-10">
                                {t('welcome.bento_1_cta')} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" weight="bold" />
                            </a>
                        </motion.div>

                        {/* [2] Maintenance & Optimasi (lebar 2 kolom) */}
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                            className="md:col-span-2 brand-card-accent flex flex-col justify-between group"
                        >
                            <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-brand-lime/15 blur-xl group-hover:bg-brand-lime/25 transition-all" />
                            <div className="flex flex-col gap-4 z-10">
                                <div className="brand-icon-box text-brand-lime">
                                    <Wrench className="w-6 h-6" weight="bold" />
                                </div>
                                <h3 className="text-2xl font-black tracking-tight">
                                    {t('welcome.bento_2_title')}
                                </h3>
                                <p className="text-sm text-white/70 leading-relaxed">
                                    {t('welcome.bento_2_desc')}
                                </p>
                            </div>
                            <a href="#contact" className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-lime mt-6 cursor-pointer z-10">
                                {t('welcome.bento_2_cta')} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" weight="bold" />
                            </a>
                        </motion.div>

                        {/* [3] Marketing Agency (lebar 2 kolom) */}
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                            className="md:col-span-2 brand-card hover:border-brand-blue/30 flex flex-col justify-between group"
                        >
                            <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-brand-blue/10 blur-xl group-hover:bg-brand-blue/20 transition-all" />
                            <div className="flex flex-col gap-4 z-10">
                                <div className="brand-icon-box brand-icon-box-blue text-brand-blue">
                                    <TrendUp className="w-6 h-6" weight="bold" />
                                </div>
                                <h3 className="text-2xl font-black tracking-tight leading-tight">
                                    {t('welcome.bento_3_title')}
                                </h3>
                                <p className="text-sm text-white/70 leading-relaxed">
                                    {t('welcome.bento_3_desc')}
                                </p>
                            </div>
                            <a href="#contact" className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-lime mt-6 cursor-pointer z-10">
                                {t('welcome.bento_3_cta')} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" weight="bold" />
                            </a>
                        </motion.div>

                        {/* [4] AI Engagement Helper & Otomasi (lebar 4 kolom) */}
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                            className="md:col-span-4 brand-card flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 group hover:border-brand-lime/20"
                        >
                            <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-brand-lime/8 blur-2xl group-hover:bg-brand-lime/15 transition-all" />
                            <div className="flex flex-col gap-4 z-10">
                                <div className="brand-icon-box text-brand-lime">
                                    <Chats className="w-6 h-6" weight="bold" />
                                </div>
                                <h3 className="text-2xl font-black tracking-tight">
                                    {t('welcome.bento_4_title')}
                                </h3>
                                <p className="text-sm text-white/70 leading-relaxed max-w-md">
                                    {t('welcome.bento_4_desc')}
                                </p>
                            </div>
                            <a href="#contact" className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-lime whitespace-nowrap cursor-pointer z-10 shrink-0">
                                {t('welcome.bento_4_cta')} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" weight="bold" />
                            </a>
                        </motion.div>

                    </div>
                </div>
            </section>

            {/* Portfolio Showcase Section */}
            <section id="portfolio" className="snap-section brand-section min-h-screen flex items-center w-full relative z-30">
                <div className="max-w-7xl mx-auto px-6 w-full">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="flex flex-col gap-3 max-w-xl"
                        >
                            <div className="flex items-center gap-2 text-brand-lime text-xs font-black uppercase tracking-widest">
                                <Briefcase className="w-4 h-4" weight="bold" />
                                <span>Portfolio Showcase</span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
                                Featured Projects & <span className="font-serif italic font-normal text-brand-lime">Engineering</span>
                            </h2>
                            <p className="text-white/70 text-sm leading-relaxed">
                                Real-world digital systems, high-velocity POS engines, and autonomous AI tools crafted to exact client specifications.
                            </p>
                        </motion.div>

                        {/* Category Filter Tabs */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                            className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none"
                        >
                            {['All', 'Web System', 'POS Cashier', 'AI Automation', 'Marketing System'].map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-300 ${
                                        selectedCategory === cat
                                            ? 'bg-brand-lime text-brand-dark shadow-lg shadow-brand-lime/20 scale-105'
                                            : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </motion.div>
                    </div>

                    {/* Portfolio Grid */}
                    {portfolios.length === 0 ? (
                        <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
                            <Briefcase className="w-12 h-12 text-white/20 mx-auto mb-3" weight="duotone" />
                            <p className="text-sm text-white/60">No portfolio projects available yet. Stay tuned!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {portfolios
                                .filter(p => selectedCategory === 'All' || p.category === selectedCategory)
                                .map((project, index) => (
                                    <motion.div
                                        key={project.id}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6, delay: index * 0.1 }}
                                        className="brand-card group hover:border-brand-blue/50 flex flex-col justify-between overflow-hidden p-0"
                                    >
                                        {/* Project Cover Image */}
                                        <div className="relative h-56 w-full overflow-hidden bg-brand-dark/80">
                                            <img 
                                                src={project.image_url} 
                                                alt={project.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/30 to-transparent opacity-90" />
                                            
                                            <span className="absolute top-4 left-4 bg-brand-lime text-brand-dark font-black text-[10px] uppercase tracking-widest px-2.5 py-1 rounded shadow-md">
                                                {project.category}
                                            </span>
                                        </div>

                                        {/* Content */}
                                        <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                                            <div className="space-y-2">
                                                <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-brand-lime transition-colors">
                                                    {project.title}
                                                </h3>
                                                <p className="text-xs text-white/70 leading-relaxed line-clamp-3">
                                                    {project.description}
                                                </p>
                                            </div>

                                            {/* Tech Stack */}
                                            {Array.isArray(project.tech_stack) && project.tech_stack.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5 pt-2">
                                                    {project.tech_stack.map((tech, i) => (
                                                        <span 
                                                            key={i}
                                                            className="bg-white/5 border border-white/10 text-white/80 text-[10px] px-2.5 py-0.5 rounded font-mono"
                                                        >
                                                            {tech}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Actions */}
                                            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                                                {project.project_url ? (
                                                    <a 
                                                        href={project.project_url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-lime hover:underline group-hover:translate-x-0.5 transition-transform"
                                                    >
                                                        <span>Visit Demo</span>
                                                        <ArrowRight className="w-3.5 h-3.5" weight="bold" />
                                                    </a>
                                                ) : (
                                                    <button 
                                                        onClick={() => setActiveModalProject(project)}
                                                        className="inline-flex items-center gap-1.5 text-xs font-bold text-white/80 hover:text-brand-lime transition-colors"
                                                    >
                                                        <Eye className="w-3.5 h-3.5" />
                                                        <span>Preview Details</span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                        </div>
                    )}
                </div>
            </section>

            {/* About/Difference Section */}
            <section id="about" className="snap-section brand-section brand-section-subtle min-h-screen flex items-center w-full">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="max-w-2xl mx-auto flex flex-col gap-4 mb-16"
                    >
                        <span className="text-brand-lime text-xs font-black uppercase tracking-widest">{t('welcome.about_tag')}</span>
                        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
                            {t('welcome.about_title_1')} <span className="font-serif italic font-normal text-brand-lime">{t('welcome.about_title_2')}</span>
                        </h2>
                        <p className="text-white/70">
                            {t('welcome.about_desc')}
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                            className="brand-card flex flex-col gap-4 group"
                        >
                            <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-brand-lime/[0.06] group-hover:bg-brand-lime/[0.18] transition-all duration-300 blur-xl" />
                            <div className="w-10 h-10 rounded-full bg-brand-lime text-brand-dark flex items-center justify-center font-extrabold z-10">
                                01
                            </div>
                            <h4 className="text-xl font-bold mt-2">{t('welcome.about_c1_title')}</h4>
                            <p className="text-sm text-white/70 leading-relaxed">
                                {t('welcome.about_c1_desc')}
                            </p>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                            className="brand-card flex flex-col gap-4 group"
                        >
                            <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-brand-blue/[0.06] group-hover:bg-brand-blue/[0.18] transition-all duration-300 blur-xl" />
                            <div className="w-10 h-10 rounded-full bg-brand-blue text-white flex items-center justify-center font-extrabold z-10">
                                02
                            </div>
                            <h4 className="text-xl font-bold mt-2">{t('welcome.about_c2_title')}</h4>
                            <p className="text-sm text-white/70 leading-relaxed">
                                {t('welcome.about_c2_desc')}
                            </p>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                            className="brand-card flex flex-col gap-4 group"
                        >
                            <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-white/[0.03] group-hover:bg-white/[0.12] transition-all duration-300 blur-xl" />
                            <div className="w-10 h-10 rounded-full bg-white text-brand-dark flex items-center justify-center font-extrabold z-10">
                                03
                            </div>
                            <h4 className="text-xl font-bold mt-2">{t('welcome.about_c3_title')}</h4>
                            <p className="text-sm text-white/70 leading-relaxed">
                                {t('welcome.about_c3_desc')}
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Contact Form Section */}
            <section id="contact" className="snap-section brand-section brand-section-transparent min-h-screen flex items-center w-full">
                <div className="max-w-7xl mx-auto px-6 relative">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.96, y: 30 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="max-w-xl mx-auto brand-panel md:p-12 relative z-10"
                    >
                    <div className="text-center flex flex-col gap-3 mb-8">
                        <span className="text-brand-lime text-xs font-black uppercase tracking-widest">{t('welcome.contact_tag')}</span>
                        <h3 className="text-3xl font-black tracking-tight leading-tight">
                            {t('welcome.contact_title_1')} <span className="font-serif italic font-normal text-brand-lime">{t('welcome.contact_title_2')}</span>
                        </h3>
                        <p className="text-sm text-white/60">
                            {t('welcome.contact_desc')}
                        </p>
                    </div>

                    {contactSubmitted ? (
                        <div className="bg-brand-lime/10 border border-brand-lime/20 rounded-2xl p-8 text-center flex flex-col items-center gap-4 animate-scale-in">
                            <CheckCircle className="w-16 h-16 text-brand-lime" weight="bold" />
                            <h4 className="text-xl font-bold text-white">{t('welcome.contact_success_title')}</h4>
                            <p className="text-sm text-white/70 leading-relaxed">
                                Thank you, <span className="font-extrabold text-white">{formData.name}</span>. We've received your request and will reach out to you at <span className="font-extrabold text-white">{formData.email}</span> shortly.
                            </p>
                            <button 
                                onClick={() => {
                                    setContactSubmitted(false);
                                    setFormData({ name: '', email: '', message: '' });
                                }}
                                className="mt-4 px-6 py-2.5 bg-brand-lime text-brand-dark font-extrabold rounded-full text-xs hover:scale-105 active:scale-95 transition-all"
                            >
                                {t('welcome.contact_send_another')}
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleContactSubmit} className="flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-white/40 uppercase tracking-widest">{t('welcome.contact_name')}</label>
                                <input 
                                    type="text" 
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Alex Mercer"
                                    className="brand-input"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-white/40 uppercase tracking-widest">{t('welcome.contact_email')}</label>
                                <input 
                                    type="email" 
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="alex@company.com"
                                    className="brand-input"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-white/40 uppercase tracking-widest">{t('welcome.contact_project')}</label>
                                <textarea 
                                    required
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    placeholder="What systems are you looking to build or optimize?"
                                    rows={4}
                                    className="brand-input resize-none"
                                />
                            </div>

                            <button 
                                type="submit"
                                disabled={processing}
                                className={`w-full py-4 bg-brand-lime text-brand-dark font-extrabold rounded-full text-base transition-all duration-200 shadow-[0_4px_25px_rgba(181,255,0,0.25)] flex items-center justify-center gap-2 ${
                                    processing 
                                        ? 'opacity-50 cursor-not-allowed' 
                                        : 'hover:scale-[1.03] active:scale-[0.97]'
                                }`}
                            >
                                {processing ? t('welcome.contact_sending') : t('welcome.contact_btn')} <PaperPlaneRight className="w-4 h-4" weight="bold" />
                            </button>
                        </form>
                    )}
                    </motion.div>
                </div>
            </section>
        </AppLayout>
    );
}
