import { configureStore } from "@reduxjs/toolkit";
import projectsReducer from '../features/projects/projectsSlice.js';
import tasksReducer from '../features/tasks/taskSlice.js';

export const store = configureStore({
    reducer: {
        projects: projectsReducer,
        tasks: tasksReducer
    }
});