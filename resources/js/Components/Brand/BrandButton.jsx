import { motion } from 'framer-motion';

export default function BrandButton({ 
    children, 
    variant = 'primary', 
    type = 'button', 
    onClick, 
    disabled = false,
    className = '',
    isLoading = false,
    ...props 
}) {
    const baseStyles = "px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-200 shrink-0 select-none flex items-center justify-center gap-1.5";
    
    const variants = {
        primary: "bg-brand-lime text-brand-dark shadow-[0_4px_20px_rgba(181,255,0,0.2)]",
        secondary: "bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20",
        danger: "bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20",
        blue: "bg-brand-blue text-white shadow-[0_4px_20px_rgba(30,74,233,0.2)]"
    };

    return (
        <motion.button
            whileHover={disabled || isLoading ? {} : { scale: variant === 'primary' || variant === 'blue' ? 1.03 : 1.02 }}
            whileTap={disabled || isLoading ? {} : { scale: 0.97 }}
            type={type}
            onClick={onClick}
            disabled={disabled || isLoading}
            className={`${baseStyles} ${variants[variant] || variants.primary} ${disabled ? 'opacity-40 cursor-not-allowed' : ''} ${className}`}
            {...props}
        >
            {isLoading && (
                <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
            )}
            {children}
        </motion.button>
    );
}
