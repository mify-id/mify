export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-white/20 bg-white/5 text-brand-lime shadow-sm focus:ring-brand-lime focus:ring-offset-brand-dark ' +
                className
            }
        />
    );
}
