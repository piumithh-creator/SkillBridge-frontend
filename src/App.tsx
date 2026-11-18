import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useAppDispatch } from "./app/hooks";
import { bootstrapAuth, sessionExpired } from "./features/auth/authSlice";
import { AppRouter } from "./routes";

export default function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    void dispatch(bootstrapAuth()); // silently restore the session from the HTTP-only refresh cookie
    const onExpired = () => dispatch(sessionExpired());
    window.addEventListener("auth:expired", onExpired);
    return () => window.removeEventListener("auth:expired", onExpired);
  }, [dispatch]);

  return (
    <>
      <AppRouter />
      <Toaster position="top-right" toastOptions={{ style: { borderRadius: "12px", fontSize: "14px" } }} />
    </>
  );
}
