export default function ApplicationLogo({ className = '', ...props }) {
    return (
        <div className={`flex items-center gap-2 ${className}`} {...props}>
            <span className="w-10 h-10 rounded-xl bg-brand-lime flex items-center justify-center text-brand-dark font-black text-sm shadow-md font-mono select-none">
                &lt;/&gt;
            </span>
            <span className="font-extrabold text-2xl tracking-tight text-brand-dark dark:text-white">
                mify<span className="text-brand-lime">.id</span>
            </span>
        </div>
    );
}
