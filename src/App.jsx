import { useDispatch, useSelector } from "react-redux"
import { addTask, deleteTask, editTask } from "./features/tasks/taskSlice";
import { selectTasksByProject } from "./features/tasks/taskSelectors";

const App = () => {
    const tasks = useSelector(state => selectTasksByProject(state, "demo id"));
    const dispatch = useDispatch();
    console.log(tasks);
    return (
        <div>
            {JSON.stringify(tasks)} <br />
            <button
                onClick={() => {
                    dispatch(addTask({
                        id: "task id 2",
                        title: "task",
                        projectId: "demo id",
                        status: "todo | in-progress | done",
                        priority: "low | medium | high"
                    }));
                }}
            >Add Task</button>
            <button
                onClick={() => { dispatch(deleteTask({ id: "task id 2" })); }}
            >Remove Task</button>
            <button
                onClick={() => {
                    dispatch(editTask({
                        id: "task id 2",
                        title: "task 2"
                    }));
                }}
            >update Task</button>
        </div>
    )
}

export default App;