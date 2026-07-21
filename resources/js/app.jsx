import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { LanguageProvider } from '@/Contexts/LanguageContext';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    // Title dikelola sepenuhnya oleh <Head> di AppLayout.jsx
    // Menghapus callback ini untuk mencegah double-wrapping title
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <LanguageProvider>
                <App {...props} />
            </LanguageProvider>
        );
    },
    progress: {
        color: '#b5ff00', // brand-lime
    },
});
