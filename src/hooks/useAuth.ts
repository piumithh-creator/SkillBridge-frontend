import { useAppSelector } from "../app/hooks";

export const useAuth = () => {
  const { user, initialized, loading, error } = useAppSelector((s) => s.auth);
  return { user, initialized, loading, error, isAuthenticated: !!user };
};
