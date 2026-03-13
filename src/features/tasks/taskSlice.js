import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    tasks: [
        {
            id: "task id",
            title: "task",
            projectId: "demo id",
            status: "todo | in-progress | done",
            priority: "low | medium | high"
        }
    ]
}

const tasksSlice = createSlice({
    name: "Tasks",
    initialState,
    reducers: {
        addTask: (state, action) => {
            state.tasks.push(action.payload);
        },
        editTask: (state, action) => {
            state.tasks = state.tasks.map(task => {
                return task.id === action.payload.id ?
                    { ...task, ...action.payload } :
                    task
            });
        },
        deleteTask: (state, action) => {
            state.tasks = state.tasks.filter(task => {
                return task.id !== action.payload.id
            });
        }
    }
});

export const { addTask, deleteTask, editTask } = tasksSlice.actions;

export default tasksSlice.reducer;