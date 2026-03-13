export const selectTasksByProject = (state, projectId) => {
    return state.tasks.tasks.filter(task => task.projectId === projectId);
}