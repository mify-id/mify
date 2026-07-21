export default function BrandIconBox({
    icon: Icon,
    variant = 'lime', // 'lime', 'blue'
    className = '',
    ...props
}) {
    const boxStyles = "brand-icon-box transition-all duration-300 relative select-none shrink-0";
    
    return (
        <div 
            className={`${boxStyles} ${variant === 'blue' ? 'brand-icon-box-blue text-brand-blue' : 'text-brand-lime'} ${className}`}
            {...props}
        >
            {Icon && <Icon className="w-5.5 h-5.5" weight="bold" />}
        </div>
    );
}
