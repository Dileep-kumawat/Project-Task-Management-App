import { useDispatch, useSelector } from "react-redux"
import { addProject, removeProject } from "./features/projects/projectsSlice";

const App = () => {
    const { projects } = useSelector(state => state.projects);
    const dispatch = useDispatch();
    return (
        <div>
            App
            {projects}
            <button
                onClick={() => { dispatch(addProject("hey")); }}
            >Add project</button>
            <button
                onClick={() => { dispatch(removeProject("hey")); }}
            >Remove project</button>
        </div>
    )
}

export default App
