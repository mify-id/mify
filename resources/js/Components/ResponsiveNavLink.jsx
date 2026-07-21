import { Link } from '@inertiajs/react';

export default function ResponsiveNavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={`flex w-full items-start border-l-4 py-2 pe-4 ps-3 ${
                active
                    ? 'border-brand-lime bg-brand-lime/10 text-brand-lime'
                    : 'border-transparent text-white/50 hover:bg-white/5 hover:text-white/80 focus:bg-white/5 focus:text-white/80'
            } text-base font-semibold transition duration-150 ease-in-out focus:outline-none ${className}`}
        >
            {children}
        </Link>
    );
}
