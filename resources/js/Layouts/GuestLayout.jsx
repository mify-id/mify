import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { CustomCursor } from '@/Layouts/AppLayout';

export default function GuestLayout({ children }) {
    return (
        <div className="scroll-container bg-brand-dark text-white font-sans selection:bg-brand-lime selection:text-brand-dark relative overflow-x-hidden min-h-screen flex flex-col items-center justify-center p-6">
            
            {/* Lapis 1: Subtle noise texture overlay */}
            <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.03]"
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }}
            />

            {/* Lapis 2: Vibrant Ambient glow in the center */}
            <div className="brand-glow top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-brand-lime/[0.04] blur-[100px] pointer-events-none" />

            {/* Custom Cursor follower */}
            <CustomCursor />

            {/* Logo area */}
            <div className="relative z-10 mb-8 flex flex-col items-center gap-1">
                <Link href="/">
                    {/* Override styling to ensure logo centers text stack vertically if flex-col is passed */}
                    <div className="flex flex-col items-center gap-3 group">
                        <span className="w-12 h-12 rounded-2xl bg-brand-lime flex items-center justify-center text-brand-dark font-black text-2xl shadow-lg border border-brand-lime/20 group-hover:rotate-6 transition-transform duration-300 tracking-tighter font-mono select-none">
                            &lt;/&gt;
                        </span>
                        <span className="font-extrabold text-2xl tracking-tight text-white group-hover:text-brand-lime transition-colors">
                            mify
                        </span>
                    </div>
                </Link>
                <span className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-black mt-2">
                    Secured Access Gateway
                </span>
            </div>

            {/* Login/Register Panel */}
            <div className="relative z-10 w-full sm:max-w-md brand-panel p-8 shadow-2xl">
                {children}
            </div>
        </div>
    );
}
