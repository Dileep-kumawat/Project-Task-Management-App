import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    tasks: [],
    loading: true
}

export const tasksSlice = createSlice({
    name: "tasks",
    initialState,
    reducers: {
        setTasks: (state, action) => {
            state.tasks = action.payload;
            state.loading = false;
        },
        addTask: (state, action) => {
            state.tasks.push(action.payload);
        },
        updateTask: (state, action) => {
            state.tasks = state.tasks.map(t => {
                return (t.id === action.payload.id) ?
                    { ...t, ...action.payload } :
                    t;
            });
        },
        deleteTask: (state, action) => {
            state.tasks = state.tasks.filter(t => t.id !== action.payload);
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        }
    }
});

export const { setTasks, addTask, updateTask, deleteTask, setLoading } = tasksSlice.actions;

export default tasksSlice.reducer;