import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTask, setLoading, setTasks } from "../taskSlice";
import { tasksApi } from "../api/tasksApi";

export function useTasks(projectId) {
    const { tasks, loading } = useSelector(state => state.tasks);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!projectId) return;
        dispatch(setLoading(true));
        const data = tasksApi.list(projectId)
        dispatch(setTasks(data));
    }, [projectId, dispatch]);

    const createTask = (data) => {
        const t = tasksApi.create(projectId, data);
        dispatch(addTask(t));
        return t;
    };

    const updateTask = (taskId, patch) => {
        const t = tasksApi.update(projectId, taskId, patch);
        dispatch(updateTask(t));
        return t;
    };

    const deleteTask = (taskId) => {
        tasksApi.delete(projectId, taskId);
        dispatch(deleteTask(taskId));
    };

    const moveTask = (taskId, newStatus) => {
        return updateTask(taskId, { status: newStatus });
    };

    const tasksByStatus = useMemo(() => ({
        todo: tasks.filter(t => t.status === "todo"),
        inprogress: tasks.filter(t => t.status === "inprogress"),
        done: tasks.filter(t => t.status === "done"),
    }), [tasks]);

    const stats = useMemo(() => ({
        total: tasks.length,
        todo: tasks.filter(t => t.status === "todo").length,
        inprogress: tasks.filter(t => t.status === "inprogress").length,
        done: tasks.filter(t => t.status === "done").length,
    }), [tasks]);

    return { tasks, tasksByStatus, stats, loading, createTask, updateTask, deleteTask, moveTask };
}