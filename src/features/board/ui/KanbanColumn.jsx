import { useState } from "react";
import TaskCard from "../../tasks/ui/TaskCard";

function KanbanColumn({ id, title, tasks, countClass, onAddTask, onEdit, onDelete, onMove }) {
    const [dragOver, setDragOver] = useState(false);

    const handleDrop = (e) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData("taskId");
        if (taskId) onMove(taskId, id);
        setDragOver(false);
    };

    return (
        <div className="kanban-column"
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}>
            <div className="column-header">
                <div className="column-header-left">
                    <div className={`status-dot ${id}`} />
                    <span className="column-title">{title}</span>
                    <span className={`column-count ${countClass}`}>{tasks.length}</span>
                </div>
                <button className="btn-icon" title={`Add to ${title}`}
                    onClick={() => onAddTask(id)} style={{ fontSize: 18 }}>+</button>
            </div>
            <div className="column-body">
                {tasks.map(task => (
                    <TaskCard key={task.id} task={task}
                        onEdit={onEdit} onDelete={onDelete} onMove={onMove} />
                ))}
                <div className={`drop-zone ${dragOver ? "drag-over" : ""}`}>
                    {tasks.length === 0 ? "Drop tasks here" : ""}
                </div>
            </div>
        </div>
    );
}

export default KanbanColumn;