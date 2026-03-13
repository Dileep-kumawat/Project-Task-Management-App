import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    projects: [
        {
            id: "demo id",
            title: "demo",
            description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Illo, minus aliquam earum atque consequuntur quis placeat, ratione fuga consequatur minima neque possimus excepturi esse error quia hic? Nisi, quae, temporibus amet eaque quisquam in modi error accusantium reiciendis adipisci sapiente voluptate dolor doloremque officiis exercitationem est optio. Sapiente, assumenda eaque?"
        }
    ]
}

const projectsSlice = createSlice({
    name: "projects",
    initialState,
    reducers: {
        addProject: (state, action) => {
            state.projects.push(action.payload);
        },
        removeProject: (state, action) => {
            state.projects = state.projects.filter(e => e !== action.payload);
        }
    }
});

export const { addProject, removeProject } = projectsSlice.actions;

export default projectsSlice.reducer;