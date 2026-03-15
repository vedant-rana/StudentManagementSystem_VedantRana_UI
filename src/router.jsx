import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Students from "./pages/Students";
import Classes from "./pages/Classes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/students" replace />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/students",
    element: (
      <ProtectedRoute>
        <Students />
      </ProtectedRoute>
    ),
  },
  {
    path: "/classes",
    element: (
      <ProtectedRoute>
        <Classes />
      </ProtectedRoute>
    ),
  },
]);

export default router;
