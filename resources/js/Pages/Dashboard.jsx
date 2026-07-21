import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import BrandConfirmModal from '@/Components/Brand/BrandConfirmModal';
import { Head, Link, router } from '@inertiajs/react';
import { 
    EnvelopeSimple, 
    Database, 
    Terminal, 
    IdentificationCard, 
    Code, 
    Trash, 
    Sparkle, 
    Copy, 
    Check, 
    X, 
    Cpu,
    CalendarBlank,
    Warning,
    Lightning,
    Briefcase,
    Monitor,
    ArrowRight,
    ArrowUpRight,
    ShieldCheck,
    Plus,
    Gear,
    TrendUp
} from '@phosphor-icons/react';

export default function Dashboard({ 
    briefs = [], 
    pipelines = [],
    portfolios = [],
    dbSize = 'N/A', 
    adminCount = 0, 
    auditLogs = [], 
    openDesignStatus = 'offline', 
    viteStatus = 'offline', 
    gitCommit = 'N/A' 
}) {
    const [selectedBriefId, setSelectedBriefId] = useState(null);
    const [blueprintFocus, setBlueprintFocus] = useState('speed');
    const [blueprintActiveTab, setBlueprintActiveTab] = useState('architecture');
    const [isGenerating, setIsGenerating] = useState(false);
    const [copied, setCopied] = useState(false);
    const [deleteBriefId, setDeleteBriefId] = useState(null);

    const activeBrief = briefs.find(b => b.id === selectedBriefId);

    const pendingBriefsCount = briefs.filter(b => b.status === 'pending').length;
    const featuredPortfoliosCount = portfolios.filter(p => p.is_featured).length;

    const handleUpdateStatus = (id, newStatus) => {
        router.patch(route('briefs.update-status', id), { status: newStatus }, {
            preserveScroll: true
        });
    };

    const handleDeleteBrief = (id) => {
        setDeleteBriefId(id);
    };

    const confirmDeleteBrief = () => {
        if (deleteBriefId) {
            router.delete(route('briefs.destroy', deleteBriefId), {
                preserveScroll: true,
                onSuccess: () => {
                    if (selectedBriefId === deleteBriefId) {
                        setSelectedBriefId(null);
                    }
                    setDeleteBriefId(null);
                },
                onFinish: () => setDeleteBriefId(null)
            });
        }
    };

    const handleGenerateBlueprint = (id) => {
        setIsGenerating(true);
        router.post(route('briefs.generate-blueprint', id), { focus: blueprintFocus }, {
            preserveScroll: true,
            onFinish: () => {
                setIsGenerating(false);
            }
        });
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Just now';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        } catch (e) {
            return 'Recent';
        }
    };

    return (
        <>
            <AdminLayout 
                activeTab="overview" 
                title={<>Executive System <span className="font-serif italic font-normal text-brand-lime">&amp; Control Center</span></>}
            >
                <Head title="System Dashboard | MiFy Admin" />

                <div className="space-y-8">
                    
                    {/* Top KPI Cards Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        
                        {/* KPI 1: Inbound Briefs */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-brand-lime/40 transition-all group relative overflow-hidden">
                            <div className="absolute -right-6 -bottom-6 w-20 h-20 rounded-full bg-brand-lime/10 blur-lg group-hover:bg-brand-lime/20 transition-all" />
                            <div className="flex items-center justify-between mb-3 relative z-10">
                                <span className="text-xs font-bold text-white/50 uppercase tracking-wider">Inbound Briefs</span>
                                <div className="p-2 rounded-xl bg-brand-lime/10 text-brand-lime">
                                    <EnvelopeSimple size={20} weight="duotone" />
                                </div>
                            </div>
                            <div className="flex items-baseline justify-between relative z-10">
                                <span className="text-3xl font-black text-white">{briefs.length}</span>
                                {pendingBriefsCount > 0 && (
                                    <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full">
                                        {pendingBriefsCount} Pending
                                    </span>
                                )}
                            </div>
                            <Link href={route('briefs.index')} className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-lime mt-4 hover:underline relative z-10">
                                <span>Manage Briefs</span>
                                <ArrowRight size={13} />
                            </Link>
                        </div>

                        {/* KPI 2: Active Pipelines */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-brand-blue/40 transition-all group relative overflow-hidden">
                            <div className="absolute -right-6 -bottom-6 w-20 h-20 rounded-full bg-brand-blue/10 blur-lg group-hover:bg-brand-blue/20 transition-all" />
                            <div className="flex items-center justify-between mb-3 relative z-10">
                                <span className="text-xs font-bold text-white/50 uppercase tracking-wider">Active Pipelines</span>
                                <div className="p-2 rounded-xl bg-brand-blue/10 text-brand-blue">
                                    <Lightning size={20} weight="duotone" />
                                </div>
                            </div>
                            <div className="flex items-baseline justify-between relative z-10">
                                <span className="text-3xl font-black text-white">{pipelines.length}</span>
                                <span className="text-[10px] font-black uppercase tracking-wider bg-brand-blue/10 text-brand-blue border border-brand-blue/20 px-2 py-0.5 rounded-full">
                                    In Build
                                </span>
                            </div>
                            <Link href={route('pipelines.index')} className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-blue mt-4 hover:underline relative z-10">
                                <span>View Pipelines</span>
                                <ArrowRight size={13} />
                            </Link>
                        </div>

                        {/* KPI 3: Portfolio Projects */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-purple-500/40 transition-all group relative overflow-hidden">
                            <div className="absolute -right-6 -bottom-6 w-20 h-20 rounded-full bg-purple-500/10 blur-lg group-hover:bg-purple-500/20 transition-all" />
                            <div className="flex items-center justify-between mb-3 relative z-10">
                                <span className="text-xs font-bold text-white/50 uppercase tracking-wider">Portfolio Showcase</span>
                                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                                    <Briefcase size={20} weight="duotone" />
                                </div>
                            </div>
                            <div className="flex items-baseline justify-between relative z-10">
                                <span className="text-3xl font-black text-white">{portfolios.length}</span>
                                <span className="text-[10px] font-black uppercase tracking-wider bg-purple-500/10 text-purple-300 border border-purple-500/20 px-2 py-0.5 rounded-full">
                                    {featuredPortfoliosCount} Featured
                                </span>
                            </div>
                            <Link href={route('portfolios.index')} className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-400 mt-4 hover:underline relative z-10">
                                <span>Manage Portfolios</span>
                                <ArrowRight size={13} />
                            </Link>
                        </div>

                        {/* KPI 4: System Storage & Status */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-emerald-500/40 transition-all group relative overflow-hidden">
                            <div className="absolute -right-6 -bottom-6 w-20 h-20 rounded-full bg-emerald-500/10 blur-lg group-hover:bg-emerald-500/20 transition-all" />
                            <div className="flex items-center justify-between mb-3 relative z-10">
                                <span className="text-xs font-bold text-white/50 uppercase tracking-wider">System Database</span>
                                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                                    <Database size={20} weight="duotone" />
                                </div>
                            </div>
                            <div className="flex items-baseline justify-between relative z-10">
                                <span className="text-3xl font-black text-white">{dbSize}</span>
                                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                                    SQLite 3.x
                                </span>
                            </div>
                            <Link href={route('live-preview.index')} className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 mt-4 hover:underline relative z-10">
                                <span>Live Website View</span>
                                <ArrowRight size={13} />
                            </Link>
                        </div>

                    </div>

                    {/* Main Content Grid (8/12 & 4/12) */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        
                        {/* Left Column (8/12 Grid) */}
                        <div className="lg:col-span-8 space-y-8">
                            
                            {/* Section 1: Active Pipelines Spotlight */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-black uppercase tracking-wider text-brand-blue flex items-center gap-2">
                                        <Lightning size={18} weight="bold" />
                                        <span>Active Build Pipelines ({pipelines.length})</span>
                                    </h3>
                                    <Link href={route('pipelines.index')} className="text-xs font-bold text-white/50 hover:text-white transition-colors">
                                        View All Pipelines →
                                    </Link>
                                </div>

                                {pipelines.length === 0 ? (
                                    <div className="border border-dashed border-white/10 rounded-2xl p-8 text-center text-white/40 text-xs">
                                        No active pipelines currently running.
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {pipelines.map((pipeline) => (
                                            <div 
                                                key={pipeline.id} 
                                                className="bg-white/5 border border-white/10 hover:border-brand-blue/30 rounded-2xl p-5 transition-all flex flex-col justify-between gap-4 group"
                                            >
                                                <div>
                                                    <div className="flex items-center justify-between gap-2 mb-2">
                                                        <span className="text-xs font-mono text-white/40">Client: {pipeline.client_name}</span>
                                                        <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                                                            pipeline.health === 'nominal' 
                                                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                                                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                        }`}>
                                                            {pipeline.health}
                                                        </span>
                                                    </div>
                                                    <h4 className="text-base font-bold text-white group-hover:text-brand-lime transition-colors">
                                                        {pipeline.project_name}
                                                    </h4>
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-[11px] font-mono text-white/60">
                                                        <span>Phase: <strong className="text-white uppercase">{pipeline.phase}</strong></span>
                                                        <span className="text-brand-lime">{pipeline.budget}</span>
                                                    </div>

                                                    <div className="flex flex-wrap gap-1">
                                                        {(pipeline.tech_stack || []).slice(0, 4).map((tech, idx) => (
                                                            <span key={idx} className="text-[9px] font-mono text-white/70 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                                                                {tech}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Section 2: Inbound Client Briefs */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-black uppercase tracking-wider text-brand-lime flex items-center gap-2">
                                        <EnvelopeSimple size={18} weight="bold" />
                                        <span>Inbound Client Briefs ({briefs.length})</span>
                                    </h3>
                                    <span className="text-xs text-white/40 font-mono">Real-time SQLite DB</span>
                                </div>

                                <div className="space-y-4">
                                    {briefs.length === 0 ? (
                                        <div className="border border-dashed border-white/10 rounded-2xl p-12 text-center flex flex-col items-center gap-3 bg-white/[0.01]">
                                            <EnvelopeSimple className="w-10 h-10 text-white/20" />
                                            <h4 className="text-sm font-bold text-white/80">No Inbound Briefs Yet</h4>
                                            <p className="text-xs text-white/40 max-w-sm leading-relaxed">
                                                Client briefs submitted via the public contact form will automatically land here.
                                            </p>
                                        </div>
                                    ) : (
                                        briefs.map((brief) => {
                                            const stack = Array.isArray(brief.tech_stack) ? brief.tech_stack : [];

                                            return (
                                                <div 
                                                    key={brief.id} 
                                                    className="bg-white/5 hover:bg-white/[0.07] border border-white/10 hover:border-brand-blue/30 rounded-2xl p-6 transition-all duration-300 relative overflow-hidden group"
                                                >
                                                    <div className="flex flex-col gap-4 relative z-10">
                                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                                            <div>
                                                                <h4 className="text-lg font-bold text-white group-hover:text-brand-lime transition-colors">
                                                                    {brief.company || 'Personal Project'}
                                                                </h4>
                                                                <span className="text-xs text-white/50">
                                                                    Contact: {brief.name} ({brief.email})
                                                                </span>
                                                            </div>

                                                            <div className="flex items-center gap-2">
                                                                <span className="bg-white/5 text-white/70 border border-white/10 font-bold px-3 py-1 rounded-full text-[10px] uppercase tracking-wider">
                                                                    {brief.budget || 'N/A'}
                                                                </span>
                                                                <span className={`font-black px-3 py-1 rounded-full text-[10px] uppercase tracking-wider border ${
                                                                    brief.status === 'approved' 
                                                                        ? 'bg-brand-lime/10 text-brand-lime border-brand-lime/20' 
                                                                        : brief.status === 'discussion'
                                                                            ? 'bg-brand-blue/10 text-brand-blue border-brand-blue/20'
                                                                            : 'bg-white/5 text-white/50 border-white/10'
                                                                }`}>
                                                                    {brief.status}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">
                                                            {brief.message}
                                                        </p>

                                                        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/5 pt-4 mt-2">
                                                            <div className="flex items-center gap-2">
                                                                <Code className="w-3.5 h-3.5 text-white/40" />
                                                                <div className="flex flex-wrap gap-1.5">
                                                                    {stack.map((tech, idx) => (
                                                                        <span key={idx} className="text-[10px] font-mono text-brand-lime/80 bg-brand-lime/5 px-2 py-0.5 rounded border border-brand-lime/10">
                                                                            {tech}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-[10px] text-white/30 font-mono">{formatDate(brief.created_at)}</span>
                                                                <div className="flex items-center gap-2 border-l border-white/10 pl-3">
                                                                    <button
                                                                        onClick={() => {
                                                                            setSelectedBriefId(brief.id);
                                                                            if (brief.ai_blueprint) {
                                                                                setBlueprintFocus(brief.ai_blueprint.focus || 'speed');
                                                                            }
                                                                        }}
                                                                        className="px-2 py-0.5 rounded bg-brand-blue/10 hover:bg-brand-blue text-white border border-brand-blue/20 text-[9px] font-black uppercase tracking-wider transition-all flex items-center gap-1 group/btn"
                                                                        title="AI Blueprint Console"
                                                                    >
                                                                        <Sparkle className="w-3 h-3 text-brand-lime group-hover/btn:rotate-45 transition-transform" weight="fill" />
                                                                        Blueprint
                                                                    </button>
                                                                    {brief.status !== 'approved' && (
                                                                        <button
                                                                            onClick={() => handleUpdateStatus(brief.id, 'approved')}
                                                                            className="px-2 py-0.5 rounded bg-brand-lime/10 hover:bg-brand-lime text-brand-lime hover:text-brand-dark border border-brand-lime/20 text-[9px] font-black uppercase tracking-wider transition-all"
                                                                            title="Approve Brief"
                                                                        >
                                                                            Approve
                                                                        </button>
                                                                    )}
                                                                    <button
                                                                        onClick={() => handleDeleteBrief(brief.id)}
                                                                        className="p-1 rounded hover:bg-red-500/10 text-white/30 hover:text-red-400 border border-transparent hover:border-red-500/20 transition-all"
                                                                        title="Delete Brief"
                                                                    >
                                                                        <Trash className="w-3.5 h-3.5" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>

                        </div>

                        {/* Right Column (4/12 Grid) */}
                        <div className="lg:col-span-4 space-y-6">
                            
                            {/* Quick Navigation Panel */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
                                <span className="text-[10px] font-black uppercase tracking-widest text-brand-lime flex items-center gap-1.5">
                                    <Monitor size={15} /> Quick Navigation
                                </span>
                                <div className="grid grid-cols-1 gap-2 pt-1">
                                    <Link
                                        href={route('live-preview.index')}
                                        className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs font-bold text-white transition-all group"
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <Monitor size={16} className="text-brand-lime" />
                                            <span>Live Website View</span>
                                        </div>
                                        <ArrowUpRight size={14} className="text-white/40 group-hover:text-brand-lime group-hover:translate-x-0.5 transition-all" />
                                    </Link>

                                    <Link
                                        href={route('portfolios.index')}
                                        className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs font-bold text-white transition-all group"
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <Briefcase size={16} className="text-purple-400" />
                                            <span>Portfolio Manager</span>
                                        </div>
                                        <ArrowUpRight size={14} className="text-white/40 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all" />
                                    </Link>

                                    <Link
                                        href={route('pipelines.index')}
                                        className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs font-bold text-white transition-all group"
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <Lightning size={16} className="text-brand-blue" />
                                            <span>Pipelines Control</span>
                                        </div>
                                        <ArrowUpRight size={14} className="text-white/40 group-hover:text-brand-blue group-hover:translate-x-0.5 transition-all" />
                                    </Link>
                                </div>
                            </div>

                            {/* Database & Specs Block */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                                <span className="text-[10px] font-black uppercase tracking-widest text-brand-blue flex items-center gap-1.5">
                                    <IdentificationCard size={16} /> System Infrastructure
                                </span>
                                
                                <div className="space-y-2.5 text-xs">
                                    <div className="flex justify-between py-1 border-b border-white/5">
                                        <span className="text-white/40">Framework</span>
                                        <span className="font-mono font-bold text-white">Laravel 13.x</span>
                                    </div>
                                    <div className="flex justify-between py-1 border-b border-white/5">
                                        <span className="text-white/40">PHP Version</span>
                                        <span className="font-mono font-bold text-white">PHP 8.3</span>
                                    </div>
                                    <div className="flex justify-between py-1 border-b border-white/5">
                                        <span className="text-white/40">Vite Dev Server</span>
                                        <span className={`font-mono text-[10px] font-black uppercase ${
                                            viteStatus === 'active' ? 'text-brand-lime' : 'text-red-400'
                                        }`}>
                                            {viteStatus}
                                        </span>
                                    </div>
                                    <div className="flex justify-between py-1 border-b border-white/5">
                                        <span className="text-white/40">Open Design Daemon</span>
                                        <span className={`font-mono text-[10px] font-black uppercase ${
                                            openDesignStatus === 'active' ? 'text-brand-lime' : 'text-red-400'
                                        }`}>
                                            {openDesignStatus}
                                        </span>
                                    </div>
                                    <div className="flex justify-between py-1 border-b border-white/5">
                                        <span className="text-white/40">Build Commit</span>
                                        <span className="font-mono text-[10px] text-white/60 truncate max-w-[140px]" title={gitCommit}>
                                            {gitCommit}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Security Audit Log */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                                <span className="text-[10px] font-black uppercase tracking-widest text-brand-lime flex items-center gap-1.5">
                                    <Terminal size={16} /> Security Audit Trail
                                </span>
                                
                                <div className="space-y-3">
                                    {auditLogs.length === 0 ? (
                                        <span className="text-[10px] text-white/30 italic">No logs recorded</span>
                                    ) : (
                                        auditLogs.map((log) => {
                                            const timeStr = log.created_at 
                                                ? new Date(log.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                                                : 'Recent';
                                            return (
                                                <div key={log.id} className="flex flex-col gap-1 text-[11px] border-l-2 border-brand-lime/40 pl-3">
                                                    <span className="font-bold text-white">{log.event}</span>
                                                    <div className="flex justify-between text-white/40 text-[9px] font-mono">
                                                        <span>Source: {log.ip}</span>
                                                        <span>{timeStr}</span>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>

                        </div>

                    </div>

                </div>
            </AdminLayout>

            {/* AI Blueprint Modal Overlay */}
            {activeBrief && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-dark/80 backdrop-blur-md">
                    <div className="w-full max-w-4xl h-[85vh] bg-brand-dark/95 border border-white/10 rounded-[24px] shadow-2xl overflow-hidden flex flex-col relative">
                        {/* Modal Header */}
                        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between shrink-0 relative z-10 bg-brand-dark/50">
                            <div className="flex flex-col gap-0.5">
                                <span className="text-[9px] font-black uppercase tracking-widest text-brand-lime flex items-center gap-1.5">
                                    <Sparkle weight="fill" className="w-3 h-3 text-brand-lime" /> AI Blueprint Engine v1.0
                                </span>
                                <h3 className="text-lg font-black tracking-tight text-white font-sans">
                                    {activeBrief.company || 'Personal Project'} <span className="font-serif italic font-normal text-white/50 ml-1">Architect Console</span>
                                </h3>
                            </div>
                            <button 
                                onClick={() => setSelectedBriefId(null)}
                                className="p-2 rounded-full border border-white/10 hover:bg-white/5 text-white/50 hover:text-white transition-all"
                            >
                                <X className="w-4 h-4" weight="bold" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-y-auto p-6 relative z-10 flex flex-col md:flex-row gap-6">
                            
                            {/* Left Side: Brief Specs & Options */}
                            <div className="w-full md:w-80 shrink-0 flex flex-col gap-5">
                                <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col gap-2">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Raw Input Message</span>
                                    <p className="text-[11px] text-white/70 leading-relaxed max-h-[150px] overflow-y-auto font-sans pr-1">
                                        "{activeBrief.message}"
                                    </p>
                                </div>

                                <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col gap-3">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Architecture Focus</span>
                                    <div className="flex flex-col gap-2">
                                        {[
                                            { id: 'speed', label: 'Speed & Scale', desc: 'Pre-bundled assets & edge routing' },
                                            { id: 'security', label: 'Strict Security', desc: 'Octane isolation & audit logs' },
                                            { id: 'budget', label: 'Optimized Budget', desc: 'Resource-efficient monolith container' }
                                        ].map((item) => (
                                            <button
                                                key={item.id}
                                                onClick={() => setBlueprintFocus(item.id)}
                                                className={`text-left p-2.5 rounded-xl border text-[11px] font-bold transition-all ${
                                                    blueprintFocus === item.id 
                                                        ? 'bg-white/10 border-white/20 text-white shadow-sm' 
                                                        : 'bg-transparent border-transparent text-white/40 hover:bg-white/5 hover:text-white/70'
                                                }`}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <span>{item.label}</span>
                                                    {blueprintFocus === item.id && <span className="w-1.5 h-1.5 rounded-full bg-brand-lime shadow-[0_0_8px_#b5ff00]" />}
                                                </div>
                                                <p className="text-[9px] font-normal text-white/30 mt-0.5">{item.desc}</p>
                                            </button>
                                        ))}
                                    </div>
                                    
                                    <button
                                        onClick={() => handleGenerateBlueprint(activeBrief.id)}
                                        disabled={isGenerating}
                                        className="mt-2 w-full py-2.5 bg-brand-blue hover:bg-brand-blue/80 disabled:bg-brand-blue/30 text-white font-black rounded-xl text-[10px] uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-1.5"
                                    >
                                        {isGenerating ? (
                                            <>
                                                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Scanning...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkle className="w-3.5 h-3.5" weight="fill" />
                                                Architect System
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Right Side: Blueprint Preview Tabs */}
                            <div className="flex-1 flex flex-col min-w-0 bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
                                {!activeBrief.ai_blueprint ? (
                                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center gap-4">
                                        <Sparkle className="w-12 h-12 text-white/10" />
                                        <div className="flex flex-col gap-1">
                                            <h4 className="text-base font-bold text-white/80">No Blueprint Generated Yet</h4>
                                            <p className="text-xs text-white/40 max-w-sm leading-relaxed">
                                                Click 'Architect System' to run the AI engine.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex-1 flex flex-col min-w-0 h-full">
                                        <div className="flex border-b border-white/5 bg-black/20 shrink-0 overflow-x-auto">
                                            {[
                                                { id: 'architecture', label: 'Stack & Architecture', icon: Cpu },
                                                { id: 'timeline', label: 'Project Timeline', icon: CalendarBlank },
                                                { id: 'risks', label: 'Risks & Mitigations', icon: Warning },
                                                { id: 'pitch', label: 'Email Client Pitch', icon: EnvelopeSimple }
                                            ].map((tab) => {
                                                const Icon = tab.icon;
                                                return (
                                                    <button
                                                        key={tab.id}
                                                        onClick={() => setBlueprintActiveTab(tab.id)}
                                                        className={`px-4 py-3 text-[10px] font-black uppercase tracking-wider border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${
                                                            blueprintActiveTab === tab.id
                                                                ? 'border-brand-lime text-brand-lime bg-white/[0.02]'
                                                                : 'border-transparent text-white/40 hover:text-white/70'
                                                        }`}
                                                    >
                                                        <Icon className="w-3.5 h-3.5" weight={blueprintActiveTab === tab.id ? "fill" : "bold"} />
                                                        {tab.label}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        <div className="flex-1 overflow-y-auto p-5">
                                            {blueprintActiveTab === 'architecture' && (
                                                <div className="flex flex-col gap-4">
                                                    <div className="flex flex-col gap-1">
                                                        <h4 className="text-xs font-black uppercase tracking-widest text-white/30">System Classification</h4>
                                                        <div className="text-sm font-bold text-white flex items-center gap-2">
                                                            <span className="w-2 h-2 rounded-full bg-brand-lime" />
                                                            {activeBrief.ai_blueprint.system_type}
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                        {[
                                                            { label: 'Frontend Interface', value: activeBrief.ai_blueprint.architecture.frontend },
                                                            { label: 'Backend Engine', value: activeBrief.ai_blueprint.architecture.backend },
                                                            { label: 'Database & Caching', value: activeBrief.ai_blueprint.architecture.database },
                                                            { label: 'Cloud Infrastructure', value: activeBrief.ai_blueprint.architecture.hosting }
                                                        ].map((spec, i) => (
                                                            <div key={i} className="bg-white/5 border border-white/5 rounded-xl p-3 flex flex-col gap-1">
                                                                <span className="text-[9px] font-black uppercase text-white/30">{spec.label}</span>
                                                                <span className="text-[11px] font-bold text-white/90 font-mono">{spec.value}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {blueprintActiveTab === 'pitch' && (
                                                <div className="flex flex-col gap-4">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-[9px] font-black uppercase text-white/30">Email Response Pitch</span>
                                                        <button
                                                            onClick={() => copyToClipboard(activeBrief.ai_blueprint.pitch)}
                                                            className="flex items-center gap-1.5 px-3 py-1 bg-white/10 text-white font-bold rounded-lg text-[10px] uppercase"
                                                        >
                                                            {copied ? 'Copied!' : 'Copy Pitch'}
                                                        </button>
                                                    </div>
                                                    <div className="bg-black/30 border border-white/5 rounded-xl p-4 text-[11px] text-white/80 font-mono whitespace-pre-wrap">
                                                        {activeBrief.ai_blueprint.pitch}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Confirmation Modal */}
            <BrandConfirmModal
                isOpen={deleteBriefId !== null}
                title="Purge System Brief Node"
                message="Are you sure you want to permanently delete this client brief?"
                confirmLabel="Purge Brief"
                cancelLabel="Abort"
                onConfirm={confirmDeleteBrief}
                onCancel={() => setDeleteBriefId(null)}
                variant="danger"
            />
        </>
    );
}
