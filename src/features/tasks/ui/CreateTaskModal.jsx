import { useState } from "react";

function CreateTaskModal({ onClose, onSave, initialStatus = "todo" }) {
    const [form, setForm] = useState({
        title: "", description: "", priority: "medium",
        status: initialStatus, assignee: "JS", dueDate: ""
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title.trim()) return;
        setSaving(true);
        await onSave(form);
        setSaving(false);
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="modal">
                <div className="modal-header">
                    <span className="modal-title">New Task</span>
                    <button className="btn-icon" onClick={onClose}>✕</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-group">
                            <label className="form-label">Task title *</label>
                            <input className="form-input" placeholder="What needs to be done?"
                                value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                autoFocus required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea className="form-textarea" rows={3} placeholder="Add details..."
                                value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Priority</label>
                                <select className="form-select" value={form.priority}
                                    onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Status</label>
                                <select className="form-select" value={form.status}
                                    onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                                    <option value="todo">To Do</option>
                                    <option value="inprogress">In Progress</option>
                                    <option value="done">Done</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Assignee</label>
                                <select className="form-select" value={form.assignee}
                                    onChange={e => setForm(f => ({ ...f, assignee: e.target.value }))}>
                                    <option value="JS">JS — Jamie S.</option>
                                    <option value="AK">AK — Anita K.</option>
                                    <option value="ML">ML — Marcus L.</option>
                                    <option value="RN">RN — Riya N.</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Due date</label>
                                <input className="form-input" type="date" value={form.dueDate}
                                    onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} />
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={saving}>
                            {saving ? "Saving…" : "Create task"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateTaskModal;