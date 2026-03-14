import { useState } from "react";
import { formatDate } from "../utils/formatDate";
import MoveMenu from "./MoveMenu";

function TaskCard({ task, onEdit, onDelete, onMove }) {
    const [dragging, setDragging] = useState(false);

    const avatarColors = {
        JS: "#2d4a3e", AK: "#3d6ea8", ML: "#7a5020", RN: "#6b3570"
    };

    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "done";

    return (
        <article
            className={`task-card ${task.status === "done" ? "done-card" : ""} ${dragging ? "dragging" : ""}`}
            draggable
            onDragStart={e => { setDragging(true); e.dataTransfer.setData("taskId", task.id); }}
            onDragEnd={() => setDragging(false)}
        >
            <div className="task-card-top">
                <span className={`priority-badge priority-${task.priority}`}>{task.priority}</span>
                <div className="task-card-actions">
                    <button className="btn-icon" title="Edit" onClick={() => onEdit(task)}
                        style={{ width: 26, height: 26, fontSize: 12 }}>✏</button>
                    <button className="btn-icon" title="Delete" onClick={() => onDelete(task.id)}
                        style={{ width: 26, height: 26, fontSize: 12, color: "#9b3535" }}>✕</button>
                </div>
            </div>

            <h4 className={`task-title ${task.status === "done" ? "completed" : ""}`}>{task.title}</h4>
            {task.description && <p className="task-desc">{task.description}</p>}

            <div className="task-card-bottom">
                <div className="task-meta">
                    <div className="task-assignee"
                        style={{ background: avatarColors[task.assignee] || "#555" }}>
                        {task.assignee}
                    </div>
                    {task.dueDate && (
                        <span className={`task-date ${isOverdue ? "overdue" : ""}`}>
                            📅 {formatDate(task.dueDate)}
                        </span>
                    )}
                </div>
                <MoveMenu task={task} onMove={onMove} />
            </div>
        </article>
    );
}

export default TaskCard;