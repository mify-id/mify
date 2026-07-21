export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center justify-center rounded-full border border-transparent bg-brand-lime px-6 py-2.5 text-xs font-black uppercase tracking-widest text-brand-dark transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] focus:outline-none disabled:opacity-50 disabled:pointer-events-none shadow-[0_4px_20px_rgba(181,255,0,0.2)] ${
                    disabled && 'opacity-50'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
