import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { useTranslation } from '@/Contexts/LanguageContext';
import { CustomCursor } from '@/Layouts/AppLayout';
import { 
    Layout, 
    Lightning, 
    EnvelopeSimple, 
    Gear, 
    Terminal, 
    SignOut, 
    House, 
    List, 
    X, 
    Circle, 
    User,
    Shield,
    ShoppingCart,
    Briefcase,
    Globe,
    Monitor
} from '@phosphor-icons/react';

export default function AdminLayout({ children, activeTab = 'overview', title = 'Admin Panel' }) {
    const user = usePage().props.auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { locale, toggleLocale, t } = useTranslation();

    // Sidebar navigation items
    const navItems = [
        {
            id: 'overview',
            label: t('common.dashboard'),
            icon: Layout,
            href: route('dashboard'),
        },
        {
            id: 'pipelines',
            label: t('common.pipelines'),
            icon: Lightning,
            href: route('pipelines.index'),
            badge: t('common.active'),
        },
        {
            id: 'briefs',
            label: t('common.briefs'),
            icon: EnvelopeSimple,
            href: route('briefs.index'),
            badge: 'New',
        },
        {
            id: 'portfolios',
            label: t('common.portfolios'),
            icon: Briefcase,
            href: route('portfolios.index'),
            badge: 'Live',
        },
        {
            id: 'live_preview',
            label: t('common.live_preview'),
            icon: Monitor,
            href: route('live-preview.index'),
            badge: 'Site',
        },
        {
            id: 'settings',
            label: t('common.settings'),
            icon: Gear,
            href: '#', // placeholder for settings
        }
    ];

    return (
        <div className="min-h-screen bg-brand-dark text-white font-sans selection:bg-brand-lime selection:text-brand-dark relative overflow-x-hidden flex">
            
            {/* Lapis 1: Subtle noise texture overlay */}
            <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.03]"
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }}
            />

            {/* Lapis 2: Subtle Neon ambient glow in background */}
            <div className="brand-glow top-0 left-0 w-[500px] h-[500px] bg-brand-lime/[0.02] blur-[150px] pointer-events-none absolute" />
            <div className="brand-glow bottom-0 right-0 w-[500px] h-[500px] bg-brand-blue/[0.03] blur-[150px] pointer-events-none absolute" />

            {/* Custom Cursor follower */}
            <CustomCursor />

            {/* SIDEBAR - Desktop (Fixed) & Mobile (Drawer) */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-brand-dark/95 border-r border-white/5 flex flex-col justify-between transition-transform duration-300 xl:translate-x-0 xl:static ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                
                <div className="flex flex-col gap-8 py-6 px-5">
                    {/* Sidebar Header Logo */}
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2.5">
                            <span className="w-7 h-7 rounded-lg bg-brand-lime flex items-center justify-center text-brand-dark font-black text-xs font-mono select-none">
                                &lt;/&gt;
                            </span>
                            <span className="font-extrabold text-lg tracking-tight text-white">
                                mify
                            </span>
                        </Link>
                        {/* Close button for mobile sidebar */}
                        <button 
                            onClick={() => setSidebarOpen(false)}
                            className="xl:hidden p-1 rounded hover:bg-white/5 text-white/60 hover:text-white"
                        >
                            <X className="w-5 h-5" weight="bold" />
                        </button>
                    </div>

                    {/* Navigation Section */}
                    <div className="flex flex-col gap-1.5 mt-4">
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/30 px-3 mb-2 block">
                            Management console
                        </span>
                        
                        {navItems.map((item) => {
                            const IconComponent = item.icon;
                            const isActive = activeTab === item.id;
                            
                            return (
                                <Link
                                    key={item.id}
                                    href={item.href}
                                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all group ${
                                        isActive 
                                            ? 'bg-brand-lime/10 text-brand-lime border border-brand-lime/10 shadow-[0_4px_15px_rgba(181,255,0,0.05)]' 
                                            : 'text-white/50 hover:bg-white/5 hover:text-white border border-transparent'
                                    }`}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <IconComponent className={`w-4 h-4 ${isActive ? 'text-brand-lime' : 'text-white/40 group-hover:text-white/70'}`} weight="bold" />
                                        <span>{item.label}</span>
                                    </div>
                                    {item.badge && (
                                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-black tracking-wide uppercase ${
                                            isActive 
                                                ? 'bg-brand-lime/20 text-brand-lime' 
                                                : 'bg-white/10 text-white/60 group-hover:bg-white/20'
                                        }`}>
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Sidebar Footer */}
                <div className="p-5 border-t border-white/5 flex items-center justify-between text-xs relative z-10">
                    <div className="flex flex-col min-w-0">
                        <span className="font-bold text-white truncate">{user.name}</span>
                        <span className="text-[10px] text-white/40 truncate mt-0.5">{user.email}</span>
                    </div>
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="p-2 rounded-lg hover:bg-red-500/10 text-white/40 hover:text-red-400 transition-colors shrink-0"
                        title="Log Out"
                    >
                        <SignOut className="w-4 h-4" weight="bold" />
                    </Link>
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div 
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm xl:hidden"
                />
            )}

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
                
                {/* Topbar Navigation Header */}
                <header className="h-16 border-b border-white/5 px-6 flex items-center justify-between shrink-0 relative z-30 bg-brand-dark/20 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        {/* Mobile Hamburger toggle */}
                        <button 
                            onClick={() => setSidebarOpen(true)}
                            className="xl:hidden p-2 rounded-xl border border-white/10 hover:bg-white/5 text-white"
                        >
                            <List className="w-5 h-5" weight="bold" />
                        </button>

                    </div>

                    {/* Right utilities */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={toggleLocale}
                            className="px-2.5 py-1 rounded-full border border-white/10 hover:bg-white/5 text-[10px] font-black uppercase tracking-widest text-brand-lime hover:text-brand-lime/80 transition-colors"
                            title={locale === 'en' ? 'Switch to Indonesian' : 'Ganti ke Bahasa Inggris'}
                        >
                            {locale === 'en' ? 'EN' : 'ID'}
                        </button>
                        <Link 
                            href="/"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 hover:bg-white/5 text-[10px] font-black uppercase tracking-widest text-white/70 hover:text-white transition-colors"
                        >
                            <House className="w-3.5 h-3.5" weight="bold" /> {t('common.view_site')}
                        </Link>
                    </div>
                </header>

                {/* Content Shell wrapper */}
                <main className="flex-1 p-6 relative z-10">
                    <div className="max-w-7xl mx-auto flex flex-col gap-6">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-black uppercase tracking-widest text-brand-lime">Console Root</span>
                                <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">{title}</h1>
                            </div>
                        </div>
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
