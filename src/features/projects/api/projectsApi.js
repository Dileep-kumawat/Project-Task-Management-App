import { uid } from "../../shared/utils/uid";

function defaultProjects() {
    return [
        {
            id: "proj_1", name: "Website Redesign 2024",
            description: "Integrated marketing strategy for the upcoming holiday season.",
            status: "active", accent: "accent-green", taskCount: 24,
            createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
        },
        {
            id: "proj_2", name: "Mobile App Redesign",
            description: "Overhauling the user interface to improve onboarding conversion rates.",
            status: "planning", accent: "accent-blue", taskCount: 12,
            createdAt: new Date(Date.now() - 5 * 3600000).toISOString()
        },
        {
            id: "proj_3", name: "Q4 Marketing Campaign",
            description: "End-of-year campaign planning for product launches and promotions.",
            status: "active", accent: "accent-amber", taskCount: 8,
            createdAt: new Date(Date.now() - 86400000).toISOString()
        },
    ];
}

export const projectsApi = {
    list() {
        return JSON.parse(localStorage.getItem("tf_projects") || "null") || defaultProjects();
    },
    create(data) {
        const projects = JSON.parse(localStorage.getItem("tf_projects") || "null") || defaultProjects();
        const newProject = { id: uid(), ...data, createdAt: new Date().toISOString(), taskCount: 0 };
        const updated = [...projects, newProject];
        localStorage.setItem("tf_projects", JSON.stringify(updated));
        return newProject;
    },
    delete(id) {
        const projects = JSON.parse(localStorage.getItem("tf_projects") || "null") || defaultProjects();
        const updated = projects.filter(p => p.id !== id);
        localStorage.setItem("tf_projects", JSON.stringify(updated));
    }
};