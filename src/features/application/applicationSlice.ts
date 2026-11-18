import { createSlice } from "@reduxjs/toolkit";
import { createApiThunk } from "../../app/thunk";
import { applicationService } from "../../services/application.service";
import type { Application, ApplicationStatus, PageMeta } from "../../types";

interface ApplicationState {
  mine: Application[];
  mineMeta: PageMeta | null;
  received: Application[];
  receivedMeta: PageMeta | null;
  loading: boolean;
  submitting: boolean;
  error: string | null;
}

const initialState: ApplicationState = { mine: [], mineMeta: null, received: [], receivedMeta: null, loading: false, submitting: false, error: null };

export const fetchMyApplications = createApiThunk("application/mine", (p: { page?: number; limit?: number; status?: ApplicationStatus }) => applicationService.mine(p));
export const fetchReceivedApplications = createApiThunk("application/received", (p: { page?: number; limit?: number; status?: ApplicationStatus; internshipId?: string }) => applicationService.received(p));
export const submitApplication = createApiThunk("application/submit", (p: { internshipId: string; coverLetter?: string }) => applicationService.apply(p.internshipId, p.coverLetter));
export const withdrawApplication = createApiThunk("application/withdraw", async (id: string) => { await applicationService.withdraw(id); return id; });
export const changeApplicationStatus = createApiThunk("application/status", (p: { id: string; status: ApplicationStatus }) => applicationService.updateStatus(p.id, p.status));

const slice = createSlice({
  name: "application",
  initialState,
  reducers: { resetApplications: () => initialState },
  extraReducers: (b) => {
    b.addCase(fetchMyApplications.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchMyApplications.fulfilled, (s, a) => { s.loading = false; s.mine = a.payload.items; s.mineMeta = a.payload.meta; })
      .addCase(fetchMyApplications.rejected, (s, a) => { s.loading = false; s.error = a.payload ?? null; })
      .addCase(fetchReceivedApplications.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchReceivedApplications.fulfilled, (s, a) => { s.loading = false; s.received = a.payload.items; s.receivedMeta = a.payload.meta; })
      .addCase(fetchReceivedApplications.rejected, (s, a) => { s.loading = false; s.error = a.payload ?? null; })
      .addCase(submitApplication.pending, (s) => { s.submitting = true; s.error = null; })
      .addCase(submitApplication.fulfilled, (s) => { s.submitting = false; })
      .addCase(submitApplication.rejected, (s, a) => { s.submitting = false; s.error = a.payload ?? null; })
      .addCase(withdrawApplication.fulfilled, (s, a) => { s.mine = s.mine.filter((x) => x._id !== a.payload); })
      .addCase(changeApplicationStatus.pending, (s) => { s.submitting = true; })
      .addCase(changeApplicationStatus.fulfilled, (s, a) => {
        s.submitting = false;
        s.received = s.received.map((x) => (x._id === a.payload._id ? { ...x, status: a.payload.status, statusHistory: a.payload.statusHistory } : x));
      })
      .addCase(changeApplicationStatus.rejected, (s, a) => { s.submitting = false; s.error = a.payload ?? null; });
  }
});

export const { resetApplications } = slice.actions;
export default slice.reducer;
