import React from 'react';
import { Conversation } from '@/mocks/support';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, User, FileText, CreditCard, ExternalLink, Calendar, Server } from 'lucide-react';
import { Link } from '@inertiajs/react';

export function ContextPanel({ conversation }: { conversation: Conversation }) {
  // In a real app, this would fetch from the CRM based on contactId
  return (
    <div className="w-80 border-l bg-muted/10 h-full flex flex-col shrink-0 overflow-y-auto">
      <div className="p-6 border-b">
        <h3 className="font-semibold text-lg mb-1">Customer Context</h3>
        <p className="text-sm text-muted-foreground">Linked CRM records</p>
      </div>

      <div className="p-4 space-y-6">
        {/* Contact Info */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold flex items-center gap-2"><User className="w-4 h-4 text-primary" /> Contact</h4>
            <Button variant="ghost" size="sm" className="h-6 text-xs px-2">Edit</Button>
          </div>
          <Card className="p-4 bg-background shadow-sm border-border/50">
            <div className="font-medium text-sm">{conversation.customerName || 'Guest User'}</div>
            <div className="text-xs text-muted-foreground mt-1">{conversation.customerEmail}</div>
            <div className="text-xs text-muted-foreground mt-1">+1 (555) 123-4567</div>
            <div className="flex gap-2 mt-3">
              <Badge variant="secondary" className="text-[10px]">VIP</Badge>
              <Badge variant="secondary" className="text-[10px]">Enterprise</Badge>
            </div>
          </Card>
        </section>

        {/* Company Info */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold flex items-center gap-2"><Building2 className="w-4 h-4 text-blue-500" /> Company</h4>
          </div>
          <Card className="p-4 bg-background shadow-sm border-border/50 group hover:border-blue-500/50 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium text-sm">Acme Corporation</div>
                <div className="text-xs text-muted-foreground mt-1">Client since 2024</div>
              </div>
              <Button size="icon" variant="ghost" className="h-6 w-6 opacity-0 group-hover:opacity-100" asChild>
                <Link href="/crm/clients"><ExternalLink className="w-3 h-3" /></Link>
              </Button>
            </div>
          </Card>
        </section>

        {/* Recent Invoices */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold flex items-center gap-2"><CreditCard className="w-4 h-4 text-emerald-500" /> Invoices</h4>
          </div>
          <Card className="divide-y divide-border/50 bg-background shadow-sm border-border/50">
            <div className="p-3 flex justify-between items-center hover:bg-muted/50">
              <div>
                <div className="text-xs font-medium">INV-2026-001</div>
                <div className="text-[10px] text-muted-foreground">Due 2 days ago</div>
              </div>
              <Badge variant="destructive" className="text-[10px]">Unpaid</Badge>
            </div>
            <div className="p-3 flex justify-between items-center hover:bg-muted/50">
              <div>
                <div className="text-xs font-medium">INV-2025-089</div>
                <div className="text-[10px] text-muted-foreground">Paid Mar 15</div>
              </div>
              <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-200 bg-emerald-50">Paid</Badge>
            </div>
          </Card>
        </section>

        {/* Hosting / Subscriptions */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold flex items-center gap-2"><Server className="w-4 h-4 text-purple-500" /> Hosting</h4>
          </div>
          <Card className="p-3 bg-background shadow-sm border-border/50 hover:bg-muted/50">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-sm font-medium">acmecorp.com</span>
              </div>
              <ExternalLink className="w-3 h-3 text-muted-foreground" />
            </div>
            <div className="text-xs text-muted-foreground mt-2 flex items-center justify-between">
              <span>Pro VPS Plan</span>
              <span>Exp: Dec 2026</span>
            </div>
          </Card>
        </section>

        {/* Past Tickets */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold flex items-center gap-2"><FileText className="w-4 h-4 text-amber-500" /> Recent Tickets</h4>
          </div>
          <div className="space-y-2">
            <div className="text-xs border border-border/50 rounded bg-background p-2 hover:bg-muted/50 cursor-pointer">
              <div className="font-medium truncate mb-1">Cannot access admin panel</div>
              <div className="flex justify-between text-muted-foreground">
                <span>CONV-998</span>
                <span>Resolved</span>
              </div>
            </div>
            <div className="text-xs border border-border/50 rounded bg-background p-2 hover:bg-muted/50 cursor-pointer">
              <div className="font-medium truncate mb-1">Billing question</div>
              <div className="flex justify-between text-muted-foreground">
                <span>CONV-950</span>
                <span>Closed</span>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
