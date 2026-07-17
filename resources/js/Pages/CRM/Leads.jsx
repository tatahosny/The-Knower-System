import React from 'react';
import { Head } from '@inertiajs/react';

export default function Leads() {
    return (
        <div className="bg-obsidian-base min-h-screen text-on-background">
            <Head title="Leads (Opportunities) - CRM" />
            <div className="p-8">
                <h1 className="text-display-lg text-primary mb-4">Sales Pipeline</h1>
                <p className="text-on-surface-variant">Manage B2B Sales Opportunities via Kanban Board or Data Table.</p>
                {/* Kanban / Table implementation connected to /api/v1/leads */}
            </div>
        </div>
    );
}
