import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import BrandConfirmModal from '@/Components/Brand/BrandConfirmModal';
import { Head, router } from '@inertiajs/react';
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
    Warning
} from '@phosphor-icons/react';

export default function Dashboard({ 
    briefs = [], 
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

    const activeBrief = briefs.find(b => b.id === selectedBriefId);

    const handleUpdateStatus = (id, newStatus) => {
        router.patch(route('briefs.update-status', id), { status: newStatus }, {
            preserveScroll: true
        });
    };

    const [deleteBriefId, setDeleteBriefId] = useState(null);

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
            <AdminLayout activeTab="overview" title={<>System Control <span className="font-serif italic font-normal text-brand-lime">&amp; Operations</span></>}>
                <Head title="System Dashboard" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Column Left: Inbound Client Briefs (8/12) */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-brand-lime flex items-center gap-1.5 select-none">
                            <EnvelopeSimple className="w-4 h-4" weight="bold" /> Inbound Client <span className="font-serif italic font-normal lowercase tracking-normal text-white/90 ml-1">briefs</span> ({briefs.length})
                        </span>
                        <span className="text-xs text-white/40">Real-time DB Connection</span>
                    </div>

                    <div className="flex flex-col gap-6">
                        {briefs.length === 0 ? (
                            <div className="border border-dashed border-white/10 rounded-[24px] p-12 text-center flex flex-col items-center gap-4 bg-white/[0.01]">
                                <EnvelopeSimple className="w-12 h-12 text-white/20" />
                                <h4 className="text-base font-bold text-white/80">No Inbound Briefs Yet</h4>
                                <p className="text-xs text-white/40 max-w-sm leading-relaxed">
                                    When clients submit their project briefs through the homepage contact form, they will appear here in real-time.
                                </p>
                            </div>
                        ) : (
                            briefs.map((brief) => {
                                const stack = Array.isArray(brief.tech_stack) 
                                    ? brief.tech_stack 
                                    : [];

                                return (
                                    <div 
                                        key={brief.id} 
                                        className="bg-white/5 hover:bg-white/[0.07] border border-white/10 hover:border-brand-blue/30 rounded-[24px] p-6 transition-all duration-300 relative overflow-hidden group"
                                    >
                                        {/* Subtle blue glow on card hover */}
                                        <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-brand-blue/5 blur-xl group-hover:bg-brand-blue/15 transition-all" />

                                        <div className="flex flex-col gap-4 relative z-10">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                                <div className="flex flex-col min-w-0">
                                                    <h4 className="text-lg font-bold text-white group-hover:text-brand-lime transition-colors truncate">
                                                        {brief.company || 'Personal Project'}
                                                    </h4>
                                                    <span className="text-xs text-white/50 truncate">
                                                        Contact: {brief.name} // {brief.email}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2 shrink-0">
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
                                                        {brief.status === 'pending' && (
                                                            <button
                                                                onClick={() => handleUpdateStatus(brief.id, 'discussion')}
                                                                className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 text-[9px] font-black uppercase tracking-wider transition-all"
                                                                title="Mark as In Discussion"
                                                            >
                                                                Discuss
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

                {/* Column Right: System Specs & Audit Logs (4/12) */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    
                    {/* Database Specs Block */}
                    <div className="brand-panel flex flex-col gap-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-brand-blue flex items-center gap-1.5 select-none">
                            <Database className="w-4 h-4" /> System <span className="font-serif italic font-normal lowercase tracking-normal text-white/90 ml-1">storage</span>
                        </span>
                        
                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-center text-xs py-1.5 border-b border-white/5">
                                <span className="text-white/40">Database Engine</span>
                                <span className="font-bold">SQLite 3.x</span>
                            </div>
                            <div className="flex justify-between items-center text-xs py-1.5 border-b border-white/5">
                                <span className="text-white/40">Database File</span>
                                <span className="font-mono text-brand-lime">database.sqlite</span>
                            </div>
                            <div className="flex justify-between items-center text-xs py-1.5 border-b border-white/5">
                                <span className="text-white/40">File Size</span>
                                <span className="font-mono text-brand-lime text-xs">{dbSize}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs py-1.5">
                                <span className="text-white/40">Registered Admins</span>
                                <span className="font-mono text-brand-lime text-xs">{adminCount} Active</span>
                            </div>
                        </div>
                    </div>

                    {/* Environment Specs Block */}
                    <div className="brand-panel flex flex-col gap-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-brand-blue flex items-center gap-1.5 select-none">
                            <IdentificationCard className="w-4 h-4" /> Engine <span className="font-serif italic font-normal lowercase tracking-normal text-white/90 ml-1">specs</span>
                        </span>
                        
                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-center text-xs py-1.5 border-b border-white/5">
                                <span className="text-white/40">Laravel Framework</span>
                                <span className="font-mono text-white/90">v13.x</span>
                            </div>
                            <div className="flex justify-between items-center text-xs py-1.5 border-b border-white/5">
                                <span className="text-white/40">PHP Runtime</span>
                                <span className="font-mono text-white/90">PHP 8.3</span>
                            </div>
                            <div className="flex justify-between items-center text-xs py-1.5 border-b border-white/5">
                                <span className="text-white/40">Vite Dev Compiler</span>
                                <span className={`font-black uppercase tracking-wider text-[10px] ${
                                    viteStatus === 'active' ? 'text-brand-lime' : 'text-red-500'
                                }`}>
                                    {viteStatus}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-xs py-1.5 border-b border-white/5">
                                <span className="text-white/40">Open Design Daemon</span>
                                <span className={`font-black uppercase tracking-wider text-[10px] ${
                                    openDesignStatus === 'active' ? 'text-brand-lime' : 'text-red-500'
                                }`}>
                                    {openDesignStatus}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-xs py-1.5 border-b border-white/5">
                                <span className="text-white/40">Build Commit</span>
                                <span className="font-mono text-[9px] text-white/50 truncate max-w-[150px]" title={gitCommit}>
                                    {gitCommit}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-xs py-1.5">
                                <span className="text-white/40">Environment Mode</span>
                                <span className="font-bold text-brand-lime">Local</span>
                            </div>
                        </div>
                    </div>

                    {/* Security Audit Log */}
                    <div className="brand-panel flex flex-col gap-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-brand-blue flex items-center gap-1.5 select-none">
                            <Terminal className="w-4 h-4" /> Security Audit <span className="font-serif italic font-normal lowercase tracking-normal text-white/90 ml-1">trail</span>
                        </span>
                        
                        <div className="flex flex-col gap-4">
                            {auditLogs.length === 0 ? (
                                <span className="text-[10px] text-white/30 italic">No logs recorded</span>
                            ) : (
                                auditLogs.map((log) => {
                                    const timeStr = log.created_at 
                                        ? new Date(log.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                                        : 'Recent';
                                    return (
                                        <div key={log.id} className="flex flex-col gap-1 text-[11px] border-l-2 border-brand-lime/30 pl-3">
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
        </AdminLayout>

        {/* AI Blueprint Modal Overlay */}
        {activeBrief && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-dark/80 backdrop-blur-md">
                    <div className="w-full max-w-4xl h-[85vh] bg-brand-dark/95 border border-white/10 rounded-[24px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col relative">
                        {/* Lapis 1: Subtle noise texture overlay */}
                        <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.03]"
                            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }}
                        />
                        {/* Lapis 2: Subtle neon glows inside the modal */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/10 blur-[100px] pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-lime/5 blur-[100px] pointer-events-none" />

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
                                {/* Raw message section */}
                                <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col gap-2">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Raw Input Message</span>
                                    <p className="text-[11px] text-white/70 leading-relaxed max-h-[150px] overflow-y-auto font-sans pr-1">
                                        "{activeBrief.message}"
                                    </p>
                                </div>

                                {/* Architecture Priorities Selector */}
                                <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col gap-3">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Architecture Focus</span>
                                    <div className="flex flex-col gap-2">
                                        {[
                                            { id: 'speed', label: 'Speed & Scale', desc: 'Pre-bundled assets & edge routing', color: 'text-brand-blue border-brand-blue/30' },
                                            { id: 'security', label: 'Strict Security', desc: 'Octane isolation & audit logs', color: 'text-brand-lime border-brand-lime/30' },
                                            { id: 'budget', label: 'Optimized Budget', desc: 'Resource-efficient monolith container', color: 'text-white border-white/30' }
                                        ].map((item) => (
                                            <button
                                                key={item.id}
                                                onClick={() => setBlueprintFocus(item.id)}
                                                className={`text-left p-2.5 rounded-xl border text-[11px] font-bold transition-all ${
                                                    blueprintFocus === item.id 
                                                        ? 'bg-white/10 border-white/20 text-white shadow-[0_2px_10px_rgba(255,255,255,0.02)]' 
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
                                        className="mt-2 w-full py-2.5 bg-brand-blue hover:bg-brand-blue/80 disabled:bg-brand-blue/30 text-white font-black rounded-xl text-[10px] uppercase tracking-widest transition-all duration-200 shadow-[0_4px_15px_rgba(30,74,233,0.25)] flex items-center justify-center gap-1.5"
                                    >
                                        {isGenerating ? (
                                            <>
                                                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Scanning...
                                            </>
                                        ) : activeBrief.ai_blueprint ? (
                                            <>
                                                <Sparkle className="w-3.5 h-3.5" weight="fill" />
                                                Regenerate Blueprint
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
                                
                                {/* Blueprint Details View */}
                                {!activeBrief.ai_blueprint ? (
                                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center gap-4">
                                        {isGenerating ? (
                                            <div className="flex flex-col items-center gap-3">
                                                {/* Matrix-like Scanning Loop Animation */}
                                                <div className="relative w-16 h-16 rounded-full border border-brand-lime/20 flex items-center justify-center overflow-hidden">
                                                    <div className="absolute inset-0 bg-gradient-to-t from-brand-lime/10 to-transparent animate-pulse" />
                                                    <Cpu className="w-7 h-7 text-brand-lime animate-bounce" />
                                                    <div className="absolute inset-x-0 top-0 h-0.5 bg-brand-lime/50 animate-scan" />
                                                </div>
                                                <h4 className="text-sm font-bold text-white font-mono uppercase tracking-widest">Analyzing Client Specs...</h4>
                                                <p className="text-[10px] text-white/40 max-w-xs font-mono leading-relaxed">
                                                    Running dynamic taxonomy maps, evaluating scope bounds & selecting cloud topology stacks.
                                                </p>
                                            </div>
                                        ) : (
                                            <>
                                                <Sparkle className="w-12 h-12 text-white/10" />
                                                <div className="flex flex-col gap-1">
                                                    <h4 className="text-base font-bold text-white/80">No Blueprint Generated Yet</h4>
                                                    <p className="text-xs text-white/40 max-w-sm leading-relaxed">
                                                        Click 'Architect System' to run the AI engine. It will analyze company metadata, budget tiers, and construct a tailor-made system design layout.
                                                    </p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex-1 flex flex-col min-w-0 h-full">
                                        {/* Tabs Selector Header */}
                                        <div className="flex border-b border-white/5 bg-black/20 shrink-0 overflow-x-auto scrollbar-none">
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

                                        {/* Tab Contents */}
                                        <div className="flex-1 overflow-y-auto p-5">
                                            
                                            {/* Tab 1: Architecture */}
                                            {blueprintActiveTab === 'architecture' && (
                                                <div className="flex flex-col gap-5">
                                                    <div className="flex flex-col gap-1.5">
                                                        <h4 className="text-xs font-black uppercase tracking-widest text-white/30">System Classification</h4>
                                                        <div className="text-sm font-bold text-white flex items-center gap-2">
                                                            <span className="w-2 h-2 rounded-full bg-brand-lime" />
                                                            {activeBrief.ai_blueprint.system_type}
                                                        </div>
                                                        <p className="text-[11px] text-white/50 italic">{activeBrief.ai_blueprint.description}</p>
                                                    </div>

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                                                        {[
                                                            { label: 'Frontend Interface', value: activeBrief.ai_blueprint.architecture.frontend },
                                                            { label: 'Backend Engine', value: activeBrief.ai_blueprint.architecture.backend },
                                                            { label: 'Database & Caching', value: activeBrief.ai_blueprint.architecture.database },
                                                            { label: 'Cloud Infrastructure', value: activeBrief.ai_blueprint.architecture.hosting }
                                                        ].map((spec, i) => (
                                                            <div key={i} className="bg-white/5 border border-white/5 rounded-xl p-3.5 flex flex-col gap-1.5">
                                                                <span className="text-[9px] font-black uppercase tracking-widest text-white/30">{spec.label}</span>
                                                                <span className="text-[11px] font-bold text-white/90 leading-relaxed font-mono">{spec.value}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Tab 2: Timeline */}
                                            {blueprintActiveTab === 'timeline' && (
                                                <div className="flex flex-col gap-4">
                                                    {activeBrief.ai_blueprint.timeline.map((phase, idx) => (
                                                        <div key={idx} className="bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col gap-2 relative">
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-xs font-bold text-white">{phase.phase}</span>
                                                                <span className="font-mono text-[10px] text-brand-lime bg-brand-lime/10 px-2 py-0.5 rounded border border-brand-lime/10">
                                                                    {phase.duration}
                                                                </span>
                                                            </div>
                                                            <ul className="list-disc list-inside text-[11px] text-white/60 leading-relaxed space-y-1">
                                                                {phase.tasks.map((task, tIdx) => (
                                                                    <li key={tIdx}>{task}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Tab 3: Risks */}
                                            {blueprintActiveTab === 'risks' && (
                                                <div className="flex flex-col gap-4">
                                                    {activeBrief.ai_blueprint.risks.map((risk, idx) => (
                                                        <div key={idx} className="bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col gap-2">
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-xs font-bold text-white">{risk.title}</span>
                                                                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${
                                                                    risk.severity === 'High' 
                                                                        ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                                                                        : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                                                }`}>
                                                                    {risk.severity} Severity
                                                                </span>
                                                            </div>
                                                            <p className="text-[11px] text-white/60 leading-relaxed pl-1 border-l-2 border-brand-blue/30">
                                                                <span className="font-bold text-white/80 block mb-0.5 text-[10px] uppercase tracking-wider">Mitigation Plan:</span>
                                                                {risk.mitigation}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Tab 4: Client Pitch Email */}
                                            {blueprintActiveTab === 'pitch' && (
                                                <div className="flex flex-col gap-4 h-full min-h-[300px]">
                                                    <div className="flex justify-between items-center shrink-0">
                                                        <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Email Response Pitch Copy</span>
                                                        <button
                                                            onClick={() => copyToClipboard(activeBrief.ai_blueprint.pitch)}
                                                            className="flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg text-[10px] uppercase tracking-wider transition-all"
                                                        >
                                                            {copied ? (
                                                                <>
                                                                    <Check className="w-3.5 h-3.5 text-brand-lime" weight="bold" /> Copied!
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Copy className="w-3.5 h-3.5" /> Copy Pitch
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>
                                                    <div className="flex-1 bg-black/30 border border-white/5 rounded-xl p-4 text-[11px] text-white/80 leading-relaxed font-mono whitespace-pre-wrap select-all overflow-y-auto">
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
                message="Are you sure you want to permanently delete this client brief? This action will completely wipe the entry and all AI-calculated blueprint designs from the operations database."
                confirmLabel="Purge Brief"
                cancelLabel="Abort"
                onConfirm={confirmDeleteBrief}
                onCancel={() => setDeleteBriefId(null)}
                variant="danger"
            />
        </>
    );
}
