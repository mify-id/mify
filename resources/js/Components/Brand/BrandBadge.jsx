import { motion } from 'framer-motion';

export default function BrandBadge({
    children,
    variant = 'lime', // 'lime', 'blue', 'neutral', 'danger', 'ghost'
    sticker = false, // if true, adds rotate & translate animation on hover
    className = '',
    icon: Icon,
    ...props
}) {
    const baseStyles = "inline-flex items-center gap-1.5 font-bold rounded-full select-none transition-all duration-200";
    
    const variants = {
        lime: "bg-brand-lime text-brand-dark px-3 py-1.5 text-xs shadow-md border border-brand-dark/5",
        blue: "bg-brand-blue text-white px-3.5 py-1.5 text-xs shadow-md border border-white/5 uppercase tracking-wider",
        neutral: "bg-white/5 text-white/70 border border-white/10 px-3 py-1 text-[10px] uppercase tracking-wider",
        danger: "bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1 text-[10px] uppercase tracking-wider",
        ghost: "bg-transparent text-white/50 border border-white/10 hover:border-white/20 px-3 py-1 text-[10px] uppercase tracking-wider"
    };

    const Wrapper = sticker ? motion.span : 'span';
    const animationProps = sticker
        ? {
            whileHover: { y: -2, rotate: 1 },
            whileTap: { y: 0, scale: 0.95 },
            transition: { duration: 0.2 }
          }
        : {};

    return (
        <Wrapper
            className={`${baseStyles} ${variants[variant] || variants.lime} ${className}`}
            {...animationProps}
            {...props}
        >
            {Icon && <Icon className="w-3.5 h-3.5" weight="bold" />}
            {children}
        </Wrapper>
    );
}
