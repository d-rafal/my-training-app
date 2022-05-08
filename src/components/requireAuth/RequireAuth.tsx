import { Navigate, useLocation } from "react-router-dom";
import useQueryUser from "../../react-query-hooks/useQueryUser";

const RequireAuth = ({ children }: { readonly children: React.ReactNode }) => {
  const { data: user } = useQueryUser();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace={true} />;
  }
  return <>{children}</>;
};

export default RequireAuth;
