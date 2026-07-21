export default function BrandInput({
    label,
    error,
    type = 'text',
    className = '',
    ...props
}) {
    return (
        <div className="flex flex-col gap-1.5 w-full">
            {label && (
                <label className="text-[10px] font-black uppercase tracking-widest text-white/50 pl-1 select-none">
                    {label}
                </label>
            )}
            <input
                type={type}
                className={`brand-input ${error ? 'border-red-500/50 focus:border-red-500/80' : ''} ${className}`}
                {...props}
            />
            {error && (
                <span className="text-[10px] font-semibold text-red-400 pl-1 mt-0.5">
                    {error}
                </span>
            )}
        </div>
    );
}
