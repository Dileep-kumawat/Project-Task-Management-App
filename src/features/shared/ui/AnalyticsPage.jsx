import { useSelector } from "react-redux";

function AnalyticsPage() {
    const { tasks } = useSelector(state => state.tasks);
    const { projects } = useSelector(state => state.projects);

    const total = tasks.length;
    const done = tasks.filter(t => t.status === "done").length;
    const high = tasks.filter(t => t.priority === "high").length;

    return (
        <div className="projects-page">
            <div className="projects-header" style={{ marginBottom: 24 }}>
                <h2 className="projects-title">Analytics</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
                {[
                    { label: "Total Projects", value: projects.length },
                    { label: "Total Tasks", value: total },
                    { label: "Completion Rate", value: total ? `${Math.round((done / total) * 100)}%` : "—" },
                    { label: "High Priority", value: high },
                    { label: "Completed", value: done },
                    { label: "Pending", value: total - done },
                ].map(s => (
                    <div key={s.label} className="stat-card" style={{ flex: "unset" }}>
                        <div className="stat-label">{s.label}</div>
                        <div className="stat-value" style={{ fontSize: 22 }}>{s.value}</div>
                    </div>
                ))}
            </div>
            <div style={{
                background: "var(--color-surface)", border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-xl)", padding: 24, color: "var(--color-text-muted)",
                textAlign: "center", fontSize: 13
            }}>
                Detailed charts and team reports coming soon.
            </div>
        </div>
    );
}

export default AnalyticsPage;