import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import "./styles.css";
import { configureEcho } from '@laravel/echo-react';

configureEcho({
    broadcaster: 'reverb',
});

const appName = import.meta.env.VITE_APP_NAME || 'The Knower OS';

import AppLayout from './Layouts/AppLayout';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './mocks/store';
import { Toaster } from 'sonner';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        const pages = import.meta.glob('./Pages/**/*.tsx', { eager: true }) as Record<string, any>;
        const page = pages[`./Pages/${name}.tsx`];
        if (name !== 'Login' && page.default) {
            page.default.layout = page.default.layout || ((page: any) => <AppLayout>{page}</AppLayout>);
        }
        return page;
    },
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <QueryClientProvider client={queryClient}>
                <App {...props} />
                <Toaster />
            </QueryClientProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
