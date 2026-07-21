import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { CustomCursor } from '@/Layouts/AppLayout';
import { List, X, CaretDown, User, SignOut, Layout } from '@phosphor-icons/react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="scroll-container bg-brand-dark text-white font-sans selection:bg-brand-lime selection:text-brand-dark relative overflow-x-hidden min-h-screen">
            
            {/* Lapis 1: Subtle noise texture overlay */}
            <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.03]"
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }}
            />

            {/* Lapis 2: Subtle Ambient glow */}
            <div className="brand-glow top-0 left-1/2 -translate-x-1/2 w-[70vw] h-[300px] bg-brand-blue/[0.08] blur-[120px] pointer-events-none" />

            {/* Custom Cursor follower */}
            <CustomCursor />

            {/* Pill-shaped Floating Navbar */}
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 relative z-50">
                <nav className="bg-brand-dark/40 backdrop-blur-md border border-white/5 rounded-2xl md:rounded-full px-6 py-3 flex items-center justify-between shadow-lg">
                    <div className="flex items-center gap-8">
                        <div className="flex shrink-0 items-center">
                            <Link href="/">
                                <ApplicationLogo className="h-8 w-auto" />
                            </Link>
                        </div>

                        {/* Navigation Links */}
                        <div className="hidden space-x-6 md:flex">
                            <NavLink
                                href={route('dashboard')}
                                active={route().current('dashboard')}
                            >
                                <Layout className="w-4 h-4 mr-1.5 text-brand-lime" weight="bold" /> Dashboard
                            </NavLink>
                        </div>
                    </div>

                    {/* Right side Profile Dropdown */}
                    <div className="hidden md:flex items-center gap-4">
                        <div className="relative">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button
                                        type="button"
                                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-white/10 bg-white/5 text-xs font-black text-white hover:bg-white/10 hover:border-white/20 transition-all duration-200 focus:outline-none"
                                    >
                                        {user.name}
                                        <CaretDown className="w-3.5 h-3.5 text-brand-lime" weight="bold" />
                                    </button>
                                </Dropdown.Trigger>

                                <Dropdown.Content contentClasses="py-2 bg-brand-dark border border-white/10 rounded-xl shadow-2xl w-48">
                                    <Dropdown.Link
                                        href={route('profile.edit')}
                                        className="flex items-center gap-2 hover:text-brand-lime transition-colors"
                                    >
                                        <User className="w-4 h-4" /> Profile
                                    </Dropdown.Link>
                                    <Dropdown.Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="flex items-center gap-2 hover:text-red-400 transition-colors w-full text-left"
                                    >
                                        <SignOut className="w-4 h-4" /> Log Out
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>

                    {/* Mobile Hamburger menu */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setShowingNavigationDropdown((prev) => !prev)}
                            className="inline-flex items-center justify-center rounded-xl p-2 text-white/70 hover:bg-white/5 hover:text-white transition focus:outline-none"
                        >
                            {showingNavigationDropdown ? (
                                <X className="w-6 h-6" weight="bold" />
                            ) : (
                                <List className="w-6 h-6" weight="bold" />
                            )}
                        </button>
                    </div>
                </nav>
            </div>

            {/* Mobile Dropdown Panel */}
            <div className={`md:hidden relative z-40 px-4 mt-2 transition-all duration-300 ${showingNavigationDropdown ? 'block opacity-100' : 'hidden opacity-0'}`}>
                <div className="bg-brand-dark/95 backdrop-blur-md border border-white/5 rounded-2xl p-4 flex flex-col gap-4 shadow-xl">
                    <div className="space-y-1">
                        <ResponsiveNavLink
                            href={route('dashboard')}
                            active={route().current('dashboard')}
                        >
                            Dashboard
                        </ResponsiveNavLink>
                    </div>

                    <div className="border-t border-white/5 pt-4">
                        <div className="px-3 mb-3">
                            <div className="text-sm font-extrabold text-white">
                                {user.name}
                            </div>
                            <div className="text-xs text-white/40">
                                {user.email}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                                className="text-red-400 hover:text-red-300"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </div>

            {/* Header Title Bar */}
            {header && (
                <header className="pt-28 pb-6 border-b border-white/5 relative z-10">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            {/* Main Content Area */}
            <main className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${header ? 'py-12' : 'pt-28 pb-12'}`}>
                {children}
            </main>
        </div>
    );
}
