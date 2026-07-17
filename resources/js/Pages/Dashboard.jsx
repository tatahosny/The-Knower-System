import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

// ── Stat Card ──────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, color = 'blue', trend }) {
    return (
        <div className={`stat-card stat-card--${color}`}>
            <div className="stat-card__icon">{icon}</div>
            <div className="stat-card__body">
                <p className="stat-card__label">{label}</p>
                <p className="stat-card__value">{value?.toLocaleString() ?? '—'}</p>
                {sub && <p className="stat-card__sub">{sub}</p>}
            </div>
            {trend && (
                <div className={`stat-card__trend stat-card__trend--${trend > 0 ? 'up' : 'down'}`}>
                    {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
                </div>
            )}
        </div>
    );
}

// ── Mini Bar Chart ─────────────────────────────────────────────────────────────
function MiniBarChart({ data }) {
    const max = Math.max(...data.map(d => d.revenue), 1);
    return (
        <div className="mini-chart">
            {data.map((d, i) => (
                <div key={i} className="mini-chart__bar-wrap">
                    <div
                        className="mini-chart__bar"
                        style={{ height: `${(d.revenue / max) * 100}%` }}
                        title={`${d.month}: ${Number(d.revenue).toLocaleString()} EGP`}
                    />
                    <span className="mini-chart__label">{d.month.split(' ')[0]}</span>
                </div>
            ))}
        </div>
    );
}

// ── Donut Chart (CSS-based) ────────────────────────────────────────────────────
function TaskDonut({ tasksByStatus }) {
    const total = Object.values(tasksByStatus).reduce((a, b) => a + b, 0) || 1;
    const segments = [
        { key: 'done', label: 'Done', color: '#10b981' },
        { key: 'in_progress', label: 'In Progress', color: '#3b82f6' },
        { key: 'review', label: 'In Review', color: '#f59e0b' },
        { key: 'todo', label: 'To Do', color: '#6b7280' },
    ];

    let cumulativePct = 0;
    const slices = segments.map(seg => {
        const pct = (tasksByStatus[seg.key] ?? 0) / total * 100;
        const slice = { ...seg, pct, start: cumulativePct };
        cumulativePct += pct;
        return slice;
    });

    const gradientStops = slices.map(s =>
        `${s.color} ${s.start.toFixed(1)}% ${(s.start + s.pct).toFixed(1)}%`
    ).join(', ');

    return (
        <div className="donut-wrap">
            <div
                className="donut"
                style={{ background: `conic-gradient(${gradientStops})` }}
            >
                <div className="donut__hole">
                    <span className="donut__total">{total}</span>
                    <span className="donut__total-label">Tasks</span>
                </div>
            </div>
            <div className="donut__legend">
                {slices.map(s => (
                    <div key={s.key} className="donut__legend-item">
                        <span className="donut__dot" style={{ background: s.color }} />
                        <span className="donut__legend-label">{s.label}</span>
                        <span className="donut__legend-count">{tasksByStatus[s.key] ?? 0}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── Status Badge ───────────────────────────────────────────────────────────────
function Badge({ status }) {
    const map = {
        active: 'badge--green', planning: 'badge--blue', completed: 'badge--gray',
        on_hold: 'badge--yellow', cancelled: 'badge--red',
        open: 'badge--red', in_progress: 'badge--blue', resolved: 'badge--green', closed: 'badge--gray',
        high: 'badge--orange', urgent: 'badge--red', medium: 'badge--blue', low: 'badge--gray',
    };
    return (
        <span className={`badge ${map[status] ?? 'badge--gray'}`}>
            {status?.replace('_', ' ')}
        </span>
    );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────────
export default function Dashboard({ stats, recentProjects, recentTickets, revenueChart, tasksByStatus }) {
    const [activeTab, setActiveTab] = useState('projects');

    return (
        <AppLayout title="Command Center">
            <Head title="Dashboard — The Knower OS" />

            <div className="dashboard">

                {/* ── Hero greeting ────────────────────────────────────── */}
                <div className="dashboard__hero">
                    <div>
                        <h2 className="dashboard__greeting">Good day, Admin 👋</h2>
                        <p className="dashboard__date">
                            {new Date().toLocaleDateString('en-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                    <div className="dashboard__quick-actions">
                        <button className="btn btn--primary">+ New Project</button>
                        <button className="btn btn--secondary">+ New Client</button>
                        <button className="btn btn--ghost">+ New Invoice</button>
                    </div>
                </div>

                {/* ── KPI Grid ────────────────────────────────────────── */}
                <div className="kpi-grid">
                    <StatCard icon="👥" label="Total Clients" value={stats?.total_clients} color="blue" />
                    <StatCard icon="🆕" label="New This Month" value={stats?.new_clients_this_month} color="cyan" />
                    <StatCard icon="🚀" label="Active Projects" value={stats?.active_projects} color="indigo" />
                    <StatCard icon="✅" label="Completed Projects" value={stats?.completed_projects} color="green" />
                    <StatCard icon="⚠️" label="Overdue Projects" value={stats?.overdue_projects} color="orange" />
                    <StatCard icon="📋" label="Pending Tasks" value={stats?.pending_tasks} color="blue" />
                    <StatCard icon="🔴" label="Overdue Tasks" value={stats?.overdue_tasks} color="red" />
                    <StatCard
                        icon="💰"
                        label="Monthly Revenue"
                        value={`${Number(stats?.monthly_revenue ?? 0).toLocaleString()} EGP`}
                        color="green"
                    />
                    <StatCard
                        icon="📄"
                        label="Unpaid Invoices"
                        value={stats?.unpaid_invoices}
                        sub={`${Number(stats?.unpaid_invoices_amount ?? 0).toLocaleString()} EGP`}
                        color="yellow"
                    />
                    <StatCard icon="🎧" label="Open Tickets" value={stats?.open_tickets} color="purple" />
                    <StatCard icon="🟢" label="Online Now" value={stats?.online_employees} color="teal" sub="employees" />
                    <StatCard icon="🌐" label="Domains Expiring" value={stats?.domains_expiring_soon} color="orange" sub="next 30 days" />
                    <StatCard icon="🖥️" label="Hosting Expiring" value={stats?.hosting_expiring_soon} color="red" sub="next 30 days" />
                </div>

                {/* ── Charts Row ───────────────────────────────────────── */}
                <div className="charts-row">
                    <div className="chart-card">
                        <div className="chart-card__header">
                            <h3 className="chart-card__title">Revenue — Last 6 Months</h3>
                        </div>
                        <div className="chart-card__body">
                            <MiniBarChart data={revenueChart ?? []} />
                        </div>
                    </div>
                    <div className="chart-card">
                        <div className="chart-card__header">
                            <h3 className="chart-card__title">Tasks Overview</h3>
                        </div>
                        <div className="chart-card__body">
                            <TaskDonut tasksByStatus={tasksByStatus ?? {}} />
                        </div>
                    </div>
                </div>

                {/* ── Recent Activity Tabs ─────────────────────────────── */}
                <div className="activity-card">
                    <div className="activity-card__tabs">
                        <button
                            className={`activity-card__tab ${activeTab === 'projects' ? 'activity-card__tab--active' : ''}`}
                            onClick={() => setActiveTab('projects')}
                        >
                            🚀 Recent Projects
                        </button>
                        <button
                            className={`activity-card__tab ${activeTab === 'tickets' ? 'activity-card__tab--active' : ''}`}
                            onClick={() => setActiveTab('tickets')}
                        >
                            🎧 Recent Tickets
                        </button>
                    </div>

                    {activeTab === 'projects' && (
                        <div className="activity-table-wrap">
                            <table className="activity-table">
                                <thead>
                                    <tr>
                                        <th>Project</th>
                                        <th>Client</th>
                                        <th>Status</th>
                                        <th>Priority</th>
                                        <th>Deadline</th>
                                        <th>Progress</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(recentProjects ?? []).map(p => (
                                        <tr key={p.id}>
                                            <td className="activity-table__name">{p.name}</td>
                                            <td>{p.client?.name ?? '—'}</td>
                                            <td><Badge status={p.status} /></td>
                                            <td><Badge status={p.priority} /></td>
                                            <td>{p.deadline ?? '—'}</td>
                                            <td>
                                                <div className="progress-bar">
                                                    <div
                                                        className="progress-bar__fill"
                                                        style={{ width: `${p.progress}%` }}
                                                    />
                                                    <span className="progress-bar__label">{p.progress}%</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {!recentProjects?.length && (
                                        <tr><td colSpan={6} className="activity-table__empty">No projects yet</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'tickets' && (
                        <div className="activity-table-wrap">
                            <table className="activity-table">
                                <thead>
                                    <tr>
                                        <th>Subject</th>
                                        <th>Client</th>
                                        <th>Status</th>
                                        <th>Priority</th>
                                        <th>Created</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(recentTickets ?? []).map(t => (
                                        <tr key={t.id}>
                                            <td className="activity-table__name">{t.subject}</td>
                                            <td>{t.client?.name ?? '—'}</td>
                                            <td><Badge status={t.status} /></td>
                                            <td><Badge status={t.priority} /></td>
                                            <td>{t.created_at ? new Date(t.created_at).toLocaleDateString() : '—'}</td>
                                        </tr>
                                    ))}
                                    {!recentTickets?.length && (
                                        <tr><td colSpan={5} className="activity-table__empty">No tickets yet</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </div>
        </AppLayout>
    );
}
