import { useDispatch, useSelector } from "react-redux";
import { projectsApi } from "../api/projectsApi";
import { useEffect } from "react";
import { addProject, setProjects, deleteProject as removeProject } from "../projectsSlice";

export function useProjects() {
  const { projects, loading } = useSelector(state => state.projects);
  const dispatch = useDispatch();

  useEffect(() => {
    const data = projectsApi.list();
    dispatch(setProjects(data));
  }, [dispatch]);

  const createProject = (data) => {
    const p = projectsApi.create(data);
    dispatch(addProject(p));
    return p;
  };

  const deleteProject = (id) => {
    projectsApi.delete(id);
    dispatch(removeProject(id));
  };

  return { projects, loading, createProject, deleteProject };
}