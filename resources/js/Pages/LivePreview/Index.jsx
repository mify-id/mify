import { useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    Monitor, 
    DeviceTablet, 
    DeviceMobile, 
    ArrowSquareOut, 
    ArrowClockwise, 
    ShieldCheck, 
    Lightning, 
    Briefcase, 
    EnvelopeSimple,
    Globe
} from '@phosphor-icons/react';

export default function LivePreviewIndex({ siteUrl, totalPortfolios = 0, totalBriefs = 0, totalPipelines = 0 }) {
    const [device, setDevice] = useState('desktop'); // 'desktop', 'tablet', 'mobile'
    const [iframeKey, setIframeKey] = useState(0);

    const handleRefresh = () => {
        setIframeKey(prev => prev + 1);
    };

    const getViewportWidth = () => {
        switch (device) {
            case 'mobile':
                return 'w-[375px] h-[667px]';
            case 'tablet':
                return 'w-[768px] h-[900px]';
            case 'desktop':
            default:
                return 'w-full h-[850px]';
        }
    };

    return (
        <AdminLayout activeTab="live_preview" title="Live Site Overview — MiFy Admin">
            <Head title="Live Site Overview | MiFy Admin" />

            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
                    <div>
                        <div className="flex items-center gap-2 text-brand-lime text-xs font-mono tracking-wider uppercase mb-1">
                            <Monitor size={16} weight="duotone" />
                            <span>Live Application Viewport</span>
                        </div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Website Overview</h1>
                        <p className="text-sm text-white/60 mt-1">
                            Interactive real-time preview of the MiFy landing page and public application components.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <a
                            href={siteUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 bg-white/5 border border-white/15 hover:bg-white/10 text-white px-4 py-2.5 rounded-xl font-bold text-xs transition-colors"
                        >
                            <ArrowSquareOut size={16} />
                            <span>Open in New Tab</span>
                        </a>

                        <button
                            onClick={handleRefresh}
                            className="inline-flex items-center gap-2 bg-brand-blue text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-brand-blue/20 hover:bg-brand-blue/90 transition-all active:scale-95"
                        >
                            <ArrowClockwise size={16} className="animate-spin-once" />
                            <span>Reload Preview</span>
                        </button>
                    </div>
                </div>

                {/* Control Bar & Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    {/* Viewport Device Switcher */}
                    <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-xl p-3 flex items-center justify-between">
                        <span className="text-xs font-bold text-white/70 uppercase tracking-wider pl-2">
                            Viewport Mode
                        </span>
                        
                        <div className="flex items-center gap-1 bg-brand-dark/80 p-1 rounded-lg border border-white/10">
                            <button
                                onClick={() => setDevice('desktop')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                                    device === 'desktop' 
                                        ? 'bg-brand-lime text-brand-dark shadow-sm' 
                                        : 'text-white/60 hover:text-white'
                                }`}
                            >
                                <Monitor size={15} />
                                <span>Desktop</span>
                            </button>

                            <button
                                onClick={() => setDevice('tablet')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                                    device === 'tablet' 
                                        ? 'bg-brand-lime text-brand-dark shadow-sm' 
                                        : 'text-white/60 hover:text-white'
                                }`}
                            >
                                <DeviceTablet size={15} />
                                <span>Tablet</span>
                            </button>

                            <button
                                onClick={() => setDevice('mobile')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                                    device === 'mobile' 
                                        ? 'bg-brand-lime text-brand-dark shadow-sm' 
                                        : 'text-white/60 hover:text-white'
                                }`}
                            >
                                <DeviceMobile size={15} />
                                <span>Mobile</span>
                            </button>
                        </div>
                    </div>

                    {/* Quick Stat Pill 1 */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 flex items-center gap-3">
                        <div className="p-2.5 rounded-lg bg-brand-lime/10 text-brand-lime">
                            <Briefcase size={20} weight="duotone" />
                        </div>
                        <div>
                            <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider block">Portfolios</span>
                            <span className="text-base font-extrabold text-white">{totalPortfolios} Active Projects</span>
                        </div>
                    </div>

                    {/* Quick Stat Pill 2 */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 flex items-center gap-3">
                        <div className="p-2.5 rounded-lg bg-brand-blue/10 text-brand-blue">
                            <Lightning size={20} weight="duotone" />
                        </div>
                        <div>
                            <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider block">System Status</span>
                            <span className="text-base font-extrabold text-brand-lime flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-brand-lime animate-pulse" />
                                Live Nominal
                            </span>
                        </div>
                    </div>
                </div>

                {/* Device Frame & Live Iframe Container */}
                <div className="bg-brand-dark/90 border border-white/15 rounded-2xl p-4 sm:p-8 flex justify-center items-start overflow-x-auto min-h-[600px] shadow-2xl relative">
                    {/* Device Container Frame */}
                    <div className={`transition-all duration-500 ease-out bg-slate-900 border-4 border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col ${getViewportWidth()}`}>
                        
                        {/* Browser Top Bar Mock */}
                        <div className="bg-slate-950 px-4 py-2.5 border-b border-white/10 flex items-center justify-between shrink-0 select-none">
                            <div className="flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                            </div>

                            <div className="flex items-center gap-2 bg-brand-dark/80 px-3 py-1 rounded-md border border-white/10 text-[11px] text-white/70 max-w-md w-full justify-center">
                                <ShieldCheck size={13} className="text-brand-lime" />
                                <span className="truncate font-mono">{siteUrl}</span>
                            </div>

                            <div className="text-[10px] font-mono text-white/40 uppercase">
                                {device === 'desktop' ? '100% Width' : device === 'tablet' ? '768px' : '375px'}
                            </div>
                        </div>

                        {/* Live Iframe Embed */}
                        <iframe 
                            key={iframeKey}
                            src={siteUrl}
                            title="Live Website Overview"
                            className="w-full h-full border-0 bg-brand-dark"
                            loading="lazy"
                        />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
