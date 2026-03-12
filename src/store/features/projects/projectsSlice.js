import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    projects: []
}

export const projectsSlice = createSlice({
    name: "projects",
    initialState,
    reducers: {
        addProject: (state, action) => {
            state.projects.push(action.payload);
        },
        removeProject: (state, action) => {
            state.projects = state.projects.filter(e => {
                return e !== action.payload;
            });
        }
    }
});

export const { addProject, removeProject } = projectsSlice.actions;

export default projectsSlice.reducer;