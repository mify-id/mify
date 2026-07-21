import { Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-semibold leading-5 transition duration-150 ease-in-out focus:outline-none ' +
                (active
                    ? 'border-brand-lime text-white'
                    : 'border-transparent text-white/50 hover:border-white/20 hover:text-white/80 focus:border-white/20 focus:text-white/80') +
                className
            }
        >
            {children}
        </Link>
    );
}
