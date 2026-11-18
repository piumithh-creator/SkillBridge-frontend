import { Bell } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchUnreadCount } from "../../features/notification/notificationSlice";

export const NotificationBell = ({ to }: { to: string }) => {
  const dispatch = useAppDispatch();
  const count = useAppSelector((s) => s.notification.unreadCount);
  useEffect(() => {
    void dispatch(fetchUnreadCount());
    const id = window.setInterval(() => void dispatch(fetchUnreadCount()), 60000); // light polling
    return () => window.clearInterval(id);
  }, [dispatch]);
  return (
    <Link to={to} aria-label={`Notifications${count ? `, ${count} unread` : ""}`} className="relative rounded-xl p-2.5 text-slate-600 hover:bg-slate-100">
      <Bell className="h-5 w-5" />
      {count > 0 && <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">{count > 99 ? "99+" : count}</span>}
    </Link>
  );
};
