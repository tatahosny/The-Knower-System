import './bootstrap';
import './styles.css';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { ThemeProvider } from './components/theme-provider';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';

import { FileQuestion, ArrowLeft, Home } from "lucide-react";

const NotFound = () => (
  <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
    <div className="mx-auto flex max-w-lg flex-col items-center text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 blur-3xl opacity-20 bg-blue-500"></div>
        <div className="relative text-blue-500">
          <FileQuestion className="h-24 w-24" />
        </div>
      </div>
      <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
        404 Not Found
      </h1>
      <p className="mt-6 text-base leading-7 text-muted-foreground">
        The server cannot find the requested URL. This usually means the page was deleted, the link is broken, or there is a typo in the address.
      </p>
      <div className="mt-10 flex items-center justify-center gap-x-4">
        <a href="/" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 px-8 gap-2">
          <Home className="h-4 w-4" />
          Return Home
        </a>
        <button onClick={() => window.history.back()} className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground h-10 px-8 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </button>
      </div>
    </div>
  </div>
);

const router = createRouter({ 
  routeTree,
  defaultNotFoundComponent: NotFound 
});

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/mocks/store';

const rootElement = document.getElementById('app');
if (rootElement && !rootElement.innerHTML) {
  const root = createRoot(rootElement);
  root.render(
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <RouterProvider router={router} />
        </ThemeProvider>
      </I18nextProvider>
    </QueryClientProvider>
  );
}
