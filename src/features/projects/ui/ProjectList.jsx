import { useState } from "react";
import { useProjects } from "../hooks/useProjects";
import { timeAgo } from "../utils/timeAgo";
import ConfirmModal from "../../shared/ui/ConfirmModal";
import NewProjectModal from "./NewProjectModal";

const ACCENT_CLASSES = ["accent-green", "accent-amber", "accent-blue", "accent-rose"];

function ProjectsPage({ onOpen, toast }) {
    const { projects, loading, createProject, deleteProject } = useProjects();
    const [showCreate, setShowCreate] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const handleCreate = async (data) => {
        await createProject({ ...data, accent: ACCENT_CLASSES[projects.length % ACCENT_CLASSES.length] });
        toast.show("Project created");
    };
    const handleDelete = async () => {
        await deleteProject(deleteConfirm);
        setDeleteConfirm(null);
        toast.show("Project deleted", "error");
    };

    const statusClass = { active: "status-active", planning: "status-planning", paused: "status-paused" };
    const statusLabel = { active: "Active", planning: "Planning", paused: "Paused" };

    return (
        <div className="projects-page">
            <div className="projects-header">
                <div>
                    <h2 className="projects-title">All Projects</h2>
                    <p style={{ fontSize: 12, color: "var(--color-text-muted)", marginTop: 2 }}>
                        {projects.length} project{projects.length !== 1 ? "s" : ""}
                    </p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowCreate(true)}>+ New Project</button>
            </div>

            {loading ? (
                <div style={{ color: "var(--color-text-muted)", padding: 40, textAlign: "center" }}>Loading…</div>
            ) : (
                <div className="projects-grid">
                    {projects.map(p => (
                        <div key={p.id} className={`project-card ${p.accent || "accent-green"}`}>
                            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                                <span className={`project-status-pill ${statusClass[p.status] || "status-active"}`}>
                                    <span className="status-dot"
                                        style={{
                                            width: 6, height: 6, borderRadius: "50%",
                                            background: p.status === "active" ? "var(--color-inprogress-text)" : p.status === "paused" ? "#7a6020" : "#3d5a7a"
                                        }} />
                                    {statusLabel[p.status] || "Active"}
                                </span>
                                <button className="btn-icon" style={{ color: "#9b3535", fontSize: 13 }}
                                    onClick={e => { e.stopPropagation(); setDeleteConfirm(p.id); }}
                                    title="Delete project">✕</button>
                            </div>
                            <h4 className="project-name" onClick={() => onOpen(p)} style={{ cursor: "pointer" }}>{p.name}</h4>
                            <p className="project-desc">{p.description || "No description."}</p>
                            <div className="project-meta">
                                <span className="project-task-count">
                                    📋 {p.taskCount || 0} tasks
                                </span>
                                <span>{timeAgo(p.createdAt)}</span>
                            </div>
                            <button className="btn btn-ghost" style={{ marginTop: 14, width: "100%", justifyContent: "center" }}
                                onClick={() => onOpen(p)}>
                                Open board →
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {projects.length === 0 && !loading && (
                <div className="empty-state">
                    <div className="empty-icon">📋</div>
                    <div className="empty-text">No projects yet. Create your first one!</div>
                </div>
            )}

            {showCreate && (
                <NewProjectModal onClose={() => setShowCreate(false)} onSave={handleCreate} />
            )}
            {deleteConfirm && (
                <ConfirmModal
                    title="Delete project"
                    message="This project and all its data will be removed. Are you sure?"
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteConfirm(null)} />
            )}
        </div>
    );
}

export default ProjectsPage;