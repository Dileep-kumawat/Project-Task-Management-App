function Sidebar({ activeNav, onNav }) {
    const navItems = [
        { id: "projects", icon: "📂", label: "Projects" },
        { id: "analytics", icon: "📊", label: "Analytics" },
        { id: "settings", icon: "⚙", label: "Settings" },
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <h1>Project <span>Manager</span></h1>
            </div>
            <nav className="sidebar-nav">
                {navItems.map(item => (
                    <button key={item.id}
                        className={`nav-item ${activeNav === item.id ? "active" : ""}`}
                        onClick={() => onNav(item.id)}>
                        <span className="nav-icon">{item.icon}</span>
                        {item.label}
                    </button>
                ))}
            </nav>
            <div className="sidebar-footer">
                <div className="user-chip">
                    <div className="user-avatar">JS</div>
                    <span className="user-name">Jamie S.</span>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;