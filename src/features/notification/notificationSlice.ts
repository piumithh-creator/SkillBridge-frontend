import { createSlice } from "@reduxjs/toolkit";
import { createApiThunk } from "../../app/thunk";
import { notificationService } from "../../services/notification.service";
import type { AppNotification, PageMeta } from "../../types";

interface NotificationState {
  items: AppNotification[];
  meta: PageMeta | null;
  unreadCount: number;
  loading: boolean;
  error: string | null;
}

const initialState: NotificationState = { items: [], meta: null, unreadCount: 0, loading: false, error: null };

export const fetchNotifications = createApiThunk("notification/list", (p: { page?: number; limit?: number; unreadOnly?: boolean }) => notificationService.list(p));
export const fetchUnreadCount = createApiThunk("notification/unread", () => notificationService.unreadCount());
export const markNotificationRead = createApiThunk("notification/read", (id: string) => notificationService.markRead(id));
export const markAllNotificationsRead = createApiThunk("notification/readAll", () => notificationService.markAllRead());

const slice = createSlice({
  name: "notification",
  initialState,
  reducers: { resetNotifications: () => initialState },
  extraReducers: (b) => {
    b.addCase(fetchNotifications.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchNotifications.fulfilled, (s, a) => {
        s.loading = false;
        s.items = a.payload.items;
        s.meta = a.payload.meta;
        if (a.payload.meta.unreadCount !== undefined) s.unreadCount = a.payload.meta.unreadCount;
      })
      .addCase(fetchNotifications.rejected, (s, a) => { s.loading = false; s.error = a.payload ?? null; })
      .addCase(fetchUnreadCount.fulfilled, (s, a) => { s.unreadCount = a.payload.unreadCount; })
      .addCase(markNotificationRead.fulfilled, (s, a) => {
        const was = s.items.find((n) => n._id === a.payload._id);
        if (was && !was.isRead) s.unreadCount = Math.max(0, s.unreadCount - 1);
        s.items = s.items.map((n) => (n._id === a.payload._id ? a.payload : n));
      })
      .addCase(markAllNotificationsRead.fulfilled, (s) => { s.items = s.items.map((n) => ({ ...n, isRead: true })); s.unreadCount = 0; });
  }
});

export const { resetNotifications } = slice.actions;
export default slice.reducer;
