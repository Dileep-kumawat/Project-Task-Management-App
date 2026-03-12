import { configureStore } from '@reduxjs/toolkit';
import projectReducer from './features/projects/projectsSlice.js';

export const store = configureStore({
    reducer: {
        project: projectReducer
    }
});