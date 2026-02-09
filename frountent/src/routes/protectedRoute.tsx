import { Routes, Route } from "react-router-dom";
import ProjectBoard from "../pages/ProjectBoard";
import ProtectedRoute from "./ProtectedRoute";

export default function ProjectRoutes() {
  return (
    <Routes>
      <Route
        path="/projects/:id"
        element={
          <ProtectedRoute>
            <ProjectBoard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

