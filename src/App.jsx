import { useState } from "react";
import { useToast } from "./features/shared/hooks/useToast";
import BoardPage from "./features/board/ui/KanbanBoard";
import ProjectsPage from "./features/projects/ui/ProjectList";
import AnalyticsPage from "./features/shared/ui/AnalyticsPage";
import SettingsPage from "./features/shared/ui/SettingsPage";
import ToastContainer from "./features/shared/ui/Toast";
import Sidebar from "./features/shared/ui/Sidebar";

export default function App() {
  const toast = useToast();
  const [activeNav, setActiveNav] = useState("projects");
  const [activeProject, setActiveProject] = useState(null);

  const handleOpenProject = (project) => {
    setActiveProject(project);
    setActiveNav("board");
  };

  const handleBackToProjects = () => {
    setActiveProject(null);
    setActiveNav("projects");
  };

  const renderContent = () => {
    if (activeProject) {
      return <BoardPage project={activeProject} onBack={handleBackToProjects} toast={toast} />;
    }
    if (activeNav === "projects") return <ProjectsPage onOpen={handleOpenProject} toast={toast} />;
    if (activeNav === "analytics") return <AnalyticsPage />;
    if (activeNav === "settings") return <SettingsPage />;
  };

  return (
    <>
      <div className="app-shell">
        <Sidebar activeNav={activeProject ? "board" : activeNav} onNav={nav => { setActiveNav(nav); setActiveProject(null); }} />
        <div className="main-area">
          {renderContent()}
        </div>
      </div>
      <ToastContainer toasts={toast.toasts} />
    </>
  );
}