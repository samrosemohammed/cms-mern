import { Navigate } from "react-router-dom";
import { useAuth } from "../utlis/AuthContext";

interface ProtectedRouteProps {
  element: JSX.Element;
}
export const ProtectedRoute = ({ element }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? element : <Navigate to="/login" />;
};
