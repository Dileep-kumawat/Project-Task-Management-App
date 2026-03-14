import { useState } from "react";

function NewProjectModal({ onClose, onSave }) {
    const [form, setForm] = useState({ name: "", description: "", status: "active" });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) return;
        setSaving(true);
        await onSave(form);
        setSaving(false);
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="modal">
                <div className="modal-header">
                    <span className="modal-title">New Project</span>
                    <button className="btn-icon" onClick={onClose}>✕</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-group">
                            <label className="form-label">Project name *</label>
                            <input className="form-input" placeholder="e.g. Website Redesign 2025"
                                value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                autoFocus required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea className="form-textarea" rows={3} placeholder="What is this project about?"
                                value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Status</label>
                            <select className="form-select" value={form.status}
                                onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                                <option value="active">Active</option>
                                <option value="planning">Planning</option>
                                <option value="paused">Paused</option>
                            </select>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={saving}>
                            {saving ? "Creating…" : "Create project"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default NewProjectModal;