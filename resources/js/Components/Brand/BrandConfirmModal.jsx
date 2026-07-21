import { motion, AnimatePresence } from 'framer-motion';
import { X, Warning } from '@phosphor-icons/react';
import BrandButton from './BrandButton';

export default function BrandConfirmModal({
    isOpen,
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed with this operation?',
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    onConfirm,
    onCancel,
    variant = 'danger' // 'danger', 'primary', 'warning'
}) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-dark/85 backdrop-blur-md">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="w-full max-w-md bg-brand-dark/95 border border-white/10 rounded-[24px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6)] overflow-hidden relative flex flex-col"
                    >
                        {/* Subtle red/warning glow in top right */}
                        <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl pointer-events-none ${
                            variant === 'danger' ? 'bg-red-500/10' : 'bg-brand-lime/10'
                        }`} />
                        
                        {/* Header */}
                        <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between z-10 bg-black/25">
                            <span className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
                                variant === 'danger' ? 'text-red-400' : 'text-brand-lime'
                            }`}>
                                <Warning className="w-3.5 h-3.5" weight="bold" /> Warning Node
                            </span>
                            <button 
                                onClick={onCancel}
                                className="p-1 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-colors"
                            >
                                <X className="w-4 h-4" weight="bold" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 flex flex-col gap-3 z-10">
                            <h4 className="text-base font-bold text-white leading-tight font-sans">
                                {title}
                            </h4>
                            <p className="text-xs text-white/50 leading-relaxed font-sans">
                                {message}
                            </p>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 bg-black/10 border-t border-white/5 flex justify-end gap-3 z-10">
                            <BrandButton 
                                variant="secondary" 
                                onClick={onCancel}
                                className="py-2! px-4!"
                            >
                                {cancelLabel}
                            </BrandButton>
                            <BrandButton 
                                variant={variant === 'danger' ? 'danger' : 'primary'} 
                                onClick={onConfirm}
                                className="py-2! px-4!"
                            >
                                {confirmLabel}
                            </BrandButton>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
