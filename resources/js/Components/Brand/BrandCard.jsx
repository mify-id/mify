import { motion } from 'framer-motion';

export default function BrandCard({
    children,
    variant = 'default', // 'default', 'accent'
    glowColor = 'blue', // 'blue', 'lime', 'none'
    className = '',
    onClick,
    animate = true,
    ...props
}) {
    const isClickable = typeof onClick === 'function';

    const cardStyles = variant === 'accent'
        ? "brand-card-accent flex flex-col justify-between group relative overflow-hidden"
        : "brand-card hover:border-brand-blue/30 flex flex-col justify-between group relative overflow-hidden";

    // Glow colors configurations
    const glows = {
        blue: "absolute -right-8 -top-8 w-24 h-24 rounded-full bg-brand-blue/10 blur-xl group-hover:bg-brand-blue/20 transition-all duration-300 pointer-events-none",
        lime: "absolute -right-8 -top-8 w-24 h-24 rounded-full bg-brand-lime/15 blur-xl group-hover:bg-brand-lime/25 transition-all duration-300 pointer-events-none",
        none: ""
    };

    const Wrapper = animate ? motion.div : 'div';
    const animationProps = animate && isClickable
        ? {
            whileHover: { scale: 1.01 },
            whileTap: { scale: 0.99 },
            transition: { duration: 0.2, ease: "easeOut" }
          }
        : {};

    return (
        <Wrapper
            onClick={onClick}
            className={`${cardStyles} ${isClickable ? 'cursor-pointer' : ''} ${className}`}
            {...animationProps}
            {...props}
        >
            {/* Ambient Accent Glow inside card */}
            {glowColor !== 'none' && <div className={glows[glowColor]} />}
            
            {/* Subtle card-level noise texture */}
            <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.015]"
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }}
            />

            <div className="relative z-10 flex flex-col flex-1 h-full w-full">
                {children}
            </div>
        </Wrapper>
    );
}
