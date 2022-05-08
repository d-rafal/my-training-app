import { useQuery } from "react-query";
import { User } from "../interfaces/authInterf";

const useQueryUser = () => {
  return useQuery<User, Error, User, string>("user", {
    enabled: false,
    refetchOnWindowFocus: false,
    useErrorBoundary: false,
  });
};

export default useQueryUser;
