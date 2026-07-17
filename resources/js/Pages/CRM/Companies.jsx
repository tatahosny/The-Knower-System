import React from 'react';
import { Head } from '@inertiajs/react';

export default function Companies() {
    return (
        <div className="bg-obsidian-base min-h-screen text-on-background">
            <Head title="Companies (B2B) - CRM" />
            <div className="p-8">
                <h1 className="text-display-lg text-primary mb-4">Enterprise Companies</h1>
                <p className="text-on-surface-variant">B2B CRM Entities. Manage accounts, metadata, AI scoring, and relationships.</p>
                {/* Table implementation connected to /api/v1/companies */}
            </div>
        </div>
    );
}
