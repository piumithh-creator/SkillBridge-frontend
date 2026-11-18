import { Bell, CheckCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Button } from "../../components/common/Button";
import { Card } from "../../components/common/Card";
import { EmptyState } from "../../components/common/EmptyState";
import { ErrorState } from "../../components/common/ErrorState";
import { PageHeader } from "../../components/common/PageHeader";
import { Pagination } from "../../components/common/Pagination";
import { TableSkeleton } from "../../components/common/Skeleton";
import { fetchNotifications, markAllNotificationsRead, markNotificationRead } from "../../features/notification/notificationSlice";
import { timeAgo } from "../../utils/format";

export default function Notifications() {
  const dispatch = useAppDispatch();
  const { items, meta, unreadCount, loading, error } = useAppSelector((s) => s.notification);
  const [page, setPage] = useState(1);
  const [unreadOnly, setUnreadOnly] = useState(false);
  useEffect(() => { void dispatch(fetchNotifications({ page, limit: 15, unreadOnly })); }, [dispatch, page, unreadOnly]);

  return (
    <div>
      <PageHeader title="Notifications" subtitle={`${unreadCount} unread`}
        actions={<>
          <Button variant="outline" size="sm" onClick={() => { setUnreadOnly(!unreadOnly); setPage(1); }}>{unreadOnly ? "Show all" : "Unread only"}</Button>
          <Button size="sm" disabled={!unreadCount} onClick={() => void dispatch(markAllNotificationsRead())}><CheckCheck className="h-4 w-4" />Mark all read</Button>
        </>} />
      {error ? <ErrorState message={error} onRetry={() => dispatch(fetchNotifications({ page, limit: 15, unreadOnly }))} />
        : loading && !items.length ? <Card><TableSkeleton /></Card>
        : !items.length ? <EmptyState icon={Bell} title="You're all caught up" message="New activity will show up here." />
        : (
          <Card className="divide-y divide-slate-100">
            {items.map((n) => (
              <div key={n._id} className={`flex items-start gap-3 p-4 ${n.isRead ? "" : "bg-primary-50/50"}`}>
                <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${n.isRead ? "bg-slate-300" : "bg-primary"}`} aria-label={n.isRead ? "Read" : "Unread"} />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{n.title}</p>
                  <p className="text-sm text-slate-600">{n.message}</p>
                  <p className="mt-1 text-xs text-slate-400">{timeAgo(n.createdAt)}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  {n.link && <Link to={n.link} onClick={() => !n.isRead && void dispatch(markNotificationRead(n._id))} className="text-sm font-semibold text-primary hover:underline">View</Link>}
                  {!n.isRead && <button className="text-sm font-semibold text-slate-500 hover:text-secondary" onClick={() => void dispatch(markNotificationRead(n._id))}>Mark read</button>}
                </div>
              </div>
            ))}
          </Card>
        )}
      <Pagination meta={meta} onPage={setPage} />
    </div>
  );
}
