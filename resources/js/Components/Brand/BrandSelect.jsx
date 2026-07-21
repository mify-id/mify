import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CaretDown } from '@phosphor-icons/react';

export default function BrandSelect({
    label,
    value,
    options = [], // [{ value: '...', label: '...' }]
    onChange,
    error,
    placeholder = 'Select option',
    className = '',
    disabled = false,
    ...props
}) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Format options as objects
    const formattedOptions = options.map(opt => 
        typeof opt === 'string' ? { value: opt, label: opt } : opt
    );

    const selectedOption = formattedOptions.find(opt => opt.value === value);

    const handleSelect = (val) => {
        if (onChange) onChange(val);
        setIsOpen(false);
    };

    return (
        <div ref={containerRef} className="flex flex-col gap-1.5 w-full relative">
            {label && (
                <span className="text-[10px] font-black uppercase tracking-widest text-white/50 pl-1 select-none">
                    {label}
                </span>
            )}
            
            {/* Toggle Button */}
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`brand-input flex items-center justify-between text-left text-xs transition-all duration-200 select-none ${
                    isOpen ? 'border-brand-lime/50 ring-1 ring-brand-lime/20' : ''
                } ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
                disabled={disabled}
                {...props}
            >
                <span className={selectedOption ? 'text-white' : 'text-white/40'}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                
                {/* Custom animated caret arrow */}
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-white/40 shrink-0"
                >
                    <CaretDown className="w-3.5 h-3.5" weight="bold" />
                </motion.div>
            </button>

            {/* Dropdown Menu Options */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -4, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -4, scale: 0.98 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute left-0 right-0 top-[102%] z-50 bg-brand-dark/95 backdrop-blur-md border border-white/10 rounded-2xl shadow-[0_15px_30px_rgba(0,0,0,0.5)] overflow-hidden max-h-60 overflow-y-auto"
                    >
                        {/* Subtle noise texture */}
                        <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.02]"
                            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }}
                        />
                        
                        <div className="p-1 relative z-10 flex flex-col gap-0.5">
                            {formattedOptions.length === 0 ? (
                                <span className="p-3 text-[11px] text-white/30 italic">No options available</span>
                            ) : (
                                formattedOptions.map((opt) => {
                                    const isSelected = opt.value === value;
                                    return (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => handleSelect(opt.value)}
                                            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                                                isSelected 
                                                    ? 'bg-brand-lime text-brand-dark shadow-[0_4px_12px_rgba(181,255,0,0.15)]' 
                                                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                                            }`}
                                        >
                                            <div className="flex justify-between items-center">
                                                <span>{opt.label}</span>
                                                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-brand-dark" />}
                                            </div>
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {error && (
                <span className="text-[10px] font-semibold text-red-400 pl-1 mt-0.5">
                    {error}
                </span>
            )}
        </div>
    );
}
