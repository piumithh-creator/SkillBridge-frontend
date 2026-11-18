import api, { unwrap, unwrapPage } from "./api";
import type { AppNotification } from "../types";

export const notificationService = {
  list: (params: { page?: number; limit?: number; unreadOnly?: boolean }) =>
    unwrapPage<AppNotification>(api.get("/notifications", { params: { ...params, unreadOnly: params.unreadOnly ? "true" : undefined } })),
  unreadCount: () => unwrap<{ unreadCount: number }>(api.get("/notifications/unread-count")),
  markRead: (id: string) => unwrap<AppNotification>(api.patch(`/notifications/${id}/read`)),
  markAllRead: () => unwrap<{ modified: number }>(api.patch("/notifications/read-all"))
};
