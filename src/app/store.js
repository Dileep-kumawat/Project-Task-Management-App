import { configureStore } from "@reduxjs/toolkit";
import projectsReducer from '../features/projects/projectsSlice.js';

export const store = configureStore({
    reducer: {
        projects: projectsReducer
    }
});