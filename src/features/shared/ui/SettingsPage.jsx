function SettingsPage() {
    return (
        <div className="projects-page">
            <div className="projects-header">
                <h2 className="projects-title">Settings</h2>
            </div>
            <div style={{
                background: "var(--color-surface)", border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-xl)", padding: 32, maxWidth: 480
            }}>
                <h3 style={{ fontWeight: 600, marginBottom: 16, fontSize: 14 }}>Workspace</h3>
                <div className="form-group" style={{ marginBottom: 14 }}>
                    <label className="form-label">Workspace name</label>
                    <input className="form-input" defaultValue="My Workspace" />
                </div>
                <div className="form-group">
                    <label className="form-label">Default assignee</label>
                    <select className="form-select">
                        <option>JS — Jamie S.</option>
                        <option>AK — Anita K.</option>
                    </select>
                </div>
                <div style={{ marginTop: 20 }}>
                    <button className="btn btn-primary">Save changes</button>
                </div>
            </div>
        </div>
    );
}

export default SettingsPage;