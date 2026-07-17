import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

const navItems = [
    {
        label: 'Command Center',
        icon: '⚡',
        href: '/dashboard',
        name: 'dashboard',
    },
    { label: 'CRM', icon: '👥', href: '/crm', name: 'crm', children: [
        { label: 'Leads', href: '/leads' },
        { label: 'Clients', href: '/clients' },
        { label: 'Companies', href: '/companies' },
        { label: 'Quotations', href: '/quotations' },
        { label: 'Contracts', href: '/contracts' },
    ]},
    { label: 'Projects', icon: '🚀', href: '/projects', name: 'projects', children: [
        { label: 'All Projects', href: '/projects' },
        { label: 'Tasks', href: '/tasks' },
        { label: 'Milestones', href: '/milestones' },
        { label: 'Bugs', href: '/bugs' },
    ]},
    { label: 'Finance', icon: '💰', href: '/finance', name: 'finance', children: [
        { label: 'Invoices', href: '/invoices' },
        { label: 'Payments', href: '/payments' },
        { label: 'Expenses', href: '/expenses' },
    ]},
    { label: 'Hosting', icon: '🌐', href: '/hosting', name: 'hosting', children: [
        { label: 'Domains', href: '/domains' },
        { label: 'Hosting Accounts', href: '/hosting-accounts' },
        { label: 'Servers', href: '/servers' },
        { label: 'SSL Certificates', href: '/ssl' },
    ]},
    { label: 'Support', icon: '🎧', href: '/tickets', name: 'support' },
    { label: 'HR', icon: '🏢', href: '/employees', name: 'hr', children: [
        { label: 'Employees', href: '/employees' },
        { label: 'Attendance', href: '/attendance' },
        { label: 'Leaves', href: '/leaves' },
    ]},
    { label: 'Reports', icon: '📊', href: '/reports', name: 'reports' },
    { label: 'AI Assistant', icon: '🤖', href: '/ai', name: 'ai' },
    { label: 'Settings', icon: '⚙️', href: '/settings', name: 'settings' },
];

export default function AppLayout({ children, title = 'The Knower OS' }) {
    const { auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [expandedMenus, setExpandedMenus] = useState({});
    const [notificationsOpen, setNotificationsOpen] = useState(false);

    const toggleMenu = (name) => {
        setExpandedMenus(prev => ({ ...prev, [name]: !prev[name] }));
    };

    return (
        <div className="app-layout">
            {/* ── Sidebar ───────────────────────────────────────────── */}
            <aside className={`sidebar ${sidebarOpen ? 'sidebar--open' : 'sidebar--collapsed'}`}>
                <div className="sidebar__brand">
                    <div className="sidebar__logo">
                        <span className="sidebar__logo-icon">⚡</span>
                        {sidebarOpen && (
                            <div className="sidebar__logo-text">
                                <span className="sidebar__logo-title">The Knower</span>
                                <span className="sidebar__logo-sub">OS</span>
                            </div>
                        )}
                    </div>
                    <button className="sidebar__toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
                        {sidebarOpen ? '◀' : '▶'}
                    </button>
                </div>

                <nav className="sidebar__nav">
                    {navItems.map((item) => (
                        <div key={item.name} className="sidebar__group">
                            {item.children ? (
                                <>
                                    <button
                                        className="sidebar__item sidebar__item--parent"
                                        onClick={() => toggleMenu(item.name)}
                                    >
                                        <span className="sidebar__icon">{item.icon}</span>
                                        {sidebarOpen && (
                                            <>
                                                <span className="sidebar__label">{item.label}</span>
                                                <span className="sidebar__arrow">
                                                    {expandedMenus[item.name] ? '▾' : '▸'}
                                                </span>
                                            </>
                                        )}
                                    </button>
                                    {sidebarOpen && expandedMenus[item.name] && (
                                        <div className="sidebar__children">
                                            {item.children.map(child => (
                                                <Link key={child.href} href={child.href} className="sidebar__child">
                                                    {child.label}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <Link href={item.href} className="sidebar__item">
                                    <span className="sidebar__icon">{item.icon}</span>
                                    {sidebarOpen && <span className="sidebar__label">{item.label}</span>}
                                </Link>
                            )}
                        </div>
                    ))}
                </nav>

                {sidebarOpen && auth?.user && (
                    <div className="sidebar__user">
                        <div className="sidebar__avatar">
                            {auth.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="sidebar__user-info">
                            <span className="sidebar__user-name">{auth.user.name}</span>
                            <span className="sidebar__user-role">{auth.user.roles?.[0]?.name ?? 'User'}</span>
                        </div>
                    </div>
                )}
            </aside>

            {/* ── Main content ──────────────────────────────────────── */}
            <div className="main-content">
                {/* Topbar */}
                <header className="topbar">
                    <div className="topbar__left">
                        <h1 className="topbar__title">{title}</h1>
                    </div>
                    <div className="topbar__right">
                        <div className="topbar__search">
                            <input type="text" placeholder="Search anything..." className="topbar__search-input" />
                            <span className="topbar__search-icon">🔍</span>
                        </div>
                        <button
                            className="topbar__btn"
                            onClick={() => setNotificationsOpen(!notificationsOpen)}
                        >
                            🔔
                            <span className="topbar__badge">3</span>
                        </button>
                        <Link href="/profile" className="topbar__btn">👤</Link>
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="topbar__btn topbar__btn--danger"
                        >
                            ⏻
                        </Link>
                    </div>
                </header>

                {/* Page content */}
                <main className="page-content">
                    {children}
                </main>
            </div>
        </div>
    );
}
