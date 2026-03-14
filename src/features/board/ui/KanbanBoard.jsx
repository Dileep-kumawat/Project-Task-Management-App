import { useState } from "react";
import { useTasks } from "../../tasks/hooks/useTasks";
import KanbanColumn from "./KanbanColumn";
import CreateTaskModal from "../../tasks/ui/CreateTaskModal";
import EditTaskModal from "../../tasks/ui/EditTaskModal";
import ConfirmModal from "../../shared/ui/ConfirmModal";

function BoardPage({ project, onBack, toast }) {
    const { tasksByStatus, stats, loading, createTask, updateTask, deleteTask, moveTask } = useTasks(project.id);
    const [showCreate, setShowCreate] = useState(false);
    const [createStatus, setCreateStatus] = useState("todo");
    const [editTask, setEditTask] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const handleAddTask = (status) => { setCreateStatus(status); setShowCreate(true); };
    const handleCreate = async (data) => {
        await createTask(data);
        toast.show("Task created");
    };
    const handleEdit = async (taskId, patch) => {
        await updateTask(taskId, patch);
        toast.show("Task updated");
    };
    const handleDelete = async () => {
        await deleteTask(deleteConfirm);
        setDeleteConfirm(null);
        toast.show("Task deleted", "error");
    };
    const handleMove = async (taskId, status) => {
        await moveTask(taskId, status);
        toast.show(`Moved to ${status === "inprogress" ? "In Progress" : status === "done" ? "Done" : "To Do"}`);
    };

    const donePercent = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

    return (
        <>
            <div className="topbar">
                <div className="topbar-left">
                    <button className="back-btn" onClick={onBack}>←</button>
                    <div>
                        <div className="topbar-title">{project.name}</div>
                        <div className="topbar-subtitle">{project.description}</div>
                    </div>
                </div>
                <div className="topbar-actions">
                    <button className="btn btn-primary" onClick={() => handleAddTask("todo")}>
                        + Add Task
                    </button>
                </div>
            </div>

            <div className="analytics-bar">
                <div className="stat-card">
                    <div className="stat-label">Total</div>
                    <div className="stat-value">{stats.total}</div>
                    <div className="progress-bar-wrap">
                        <div className="progress-bar-fill" style={{ width: `${donePercent}%` }} />
                    </div>
                </div>
                <div className="stat-card todo">
                    <div className="stat-label">To Do</div>
                    <div className="stat-value">{stats.todo}</div>
                </div>
                <div className="stat-card inprogress">
                    <div className="stat-label">In Progress</div>
                    <div className="stat-value">{stats.inprogress}</div>
                </div>
                <div className="stat-card done">
                    <div className="stat-label">Done</div>
                    <div className="stat-value">{stats.done}</div>
                </div>
            </div>

            <div className="board-area">
                {loading ? (
                    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-muted)" }}>
                        Loading…
                    </div>
                ) : (
                    <>
                        <KanbanColumn id="todo" title="To Do" tasks={tasksByStatus.todo}
                            countClass="count-todo" onAddTask={handleAddTask}
                            onEdit={setEditTask} onDelete={setDeleteConfirm} onMove={handleMove} />
                        <KanbanColumn id="inprogress" title="In Progress" tasks={tasksByStatus.inprogress}
                            countClass="count-inprogress" onAddTask={handleAddTask}
                            onEdit={setEditTask} onDelete={setDeleteConfirm} onMove={handleMove} />
                        <KanbanColumn id="done" title="Done" tasks={tasksByStatus.done}
                            countClass="count-done" onAddTask={handleAddTask}
                            onEdit={setEditTask} onDelete={setDeleteConfirm} onMove={handleMove} />
                    </>
                )}
            </div>

            {showCreate && (
                <CreateTaskModal initialStatus={createStatus}
                    onClose={() => setShowCreate(false)} onSave={handleCreate} />
            )}
            {editTask && (
                <EditTaskModal task={editTask}
                    onClose={() => setEditTask(null)} onSave={handleEdit} />
            )}
            {deleteConfirm && (
                <ConfirmModal
                    title="Delete task"
                    message="This task will be permanently removed. This action cannot be undone."
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteConfirm(null)} />
            )}
        </>
    );
}

export default BoardPage;