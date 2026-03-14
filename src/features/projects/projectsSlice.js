import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    projects: [],
    loading: true
}

export const projectsSlice = createSlice({
    name: "projects",
    initialState,
    reducers: {
        setProjects: (state, action) => {
            state.projects = action.payload;
            state.loading = false;
        },
        addProject: (state, action) => {
            state.projects.push(action.payload);
        },
        deleteProject: (state, action) => {
            state.projects = state.projects.filter(p => p.id !== action.payload);
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        }
    }
});

export const { setProjects, addProject, deleteProject, setLoading } = projectsSlice.actions;

export default projectsSlice.reducer;