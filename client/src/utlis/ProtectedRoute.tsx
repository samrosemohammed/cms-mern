import { Navigate } from "react-router-dom";
import { useAuth } from "../utlis/AuthContext";
import Cookies from "js-cookie";

interface ProtectedRouteProps {
  element: JSX.Element;
}
export const ProtectedRoute = ({ element }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();
  const token = Cookies.get("token");
  return isAuthenticated && token ? element : <Navigate to="/login" />;
};
