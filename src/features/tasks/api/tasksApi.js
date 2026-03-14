import { uid } from "../../shared/utils/uid";

function defaultTasks(projectId) {
    const base = [
        {
            status: "todo",
            priority: "high",
            title: "Design system foundation — Typography & Colors",
            description: "Set up the core design tokens for the project.",
            assignee: "JS",
            dueDate: "2024-10-30"
        },
        {
            status: "todo",
            priority: "medium",
            title: "User interview scripts for stakeholder meeting",
            description: "Compile feedback from the last user testing session.",
            assignee: "AK",
            dueDate: "2024-10-24"
        },
        {
            status: "todo",
            priority: "low",
            title: "API documentation review",
            description: "",
            assignee: "ML",
            dueDate: "2024-10-26"
        },
        {
            status: "inprogress",
            priority: "high",
            title: "Homepage Hero Section Development",
            description: "Build the new hero with animation and CTA layout.",
            assignee: "ML",
            dueDate: "2024-10-22"
        },
        {
            status: "inprogress",
            priority: "medium",
            title: "Homepage Redesign",
            description: "",
            assignee: "RN",
            dueDate: "2024-10-22"
        },
        {
            status: "done",
            priority: "low",
            title: "Draft project timeline",
            description: "",
            assignee: "JS",
            dueDate: "2024-10-15"
        },
        {
            status: "done",
            priority: "medium",
            title: "Initial stakeholder kickoff",
            description: "Presented scope and goals to the team.",
            assignee: "AK",
            dueDate: "2024-10-10"
        },
    ];
    return base.map(t => ({ ...t, id: uid(), projectId, createdAt: new Date().toISOString() }));
}

export const tasksApi = {
    list(projectId) {
        const all = JSON.parse(localStorage.getItem(`tf_tasks_${projectId}`) || "null");
        return all || defaultTasks(projectId);
    },
    create(projectId, data) {
        const tasks = JSON.parse(localStorage.getItem(`tf_tasks_${projectId}`) || "null") || defaultTasks(projectId);
        const newTask = { id: uid(), projectId, ...data, createdAt: new Date().toISOString() };
        const updated = [...tasks, newTask];
        localStorage.setItem(`tf_tasks_${projectId}`, JSON.stringify(updated));
        return newTask;
    },
    update(projectId, taskId, patch) {
        const tasks = JSON.parse(localStorage.getItem(`tf_tasks_${projectId}`) || "null") || defaultTasks(projectId);
        const updated = tasks.map(t => t.id === taskId ? { ...t, ...patch } : t);
        localStorage.setItem(`tf_tasks_${projectId}`, JSON.stringify(updated));
        return updated.find(t => t.id === taskId);
    },
    delete(projectId, taskId) {
        const tasks = JSON.parse(localStorage.getItem(`tf_tasks_${projectId}`) || "null") || defaultTasks(projectId);
        const updated = tasks.filter(t => t.id !== taskId);
        localStorage.setItem(`tf_tasks_${projectId}`, JSON.stringify(updated));
    }
};