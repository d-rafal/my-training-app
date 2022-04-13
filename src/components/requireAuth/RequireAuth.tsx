import { Navigate, useLocation } from "react-router-dom";
import { useSelectUser } from "../../store/features/auth/authSlice";

const RequireAuth = ({ children }: { readonly children: React.ReactNode }) => {
  const user = useSelectUser();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace={true} />;
  }
  return <>{children}</>;
};

export default RequireAuth;
