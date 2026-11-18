import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { createApiThunk } from "../../app/thunk";
import { internshipService, type InternshipInput } from "../../services/internship.service";
import type { Internship, InternshipFilters, PageMeta } from "../../types";

interface InternshipState {
  items: Internship[];
  meta: PageMeta | null;
  mine: Internship[];
  mineMeta: PageMeta | null;
  current: Internship | null;
  filters: InternshipFilters;
  loading: boolean;
  saving: boolean;
  error: string | null;
}

export const defaultFilters: InternshipFilters = { page: 1, limit: 9, sort: "newest" };

const initialState: InternshipState = {
  items: [], meta: null, mine: [], mineMeta: null, current: null, filters: defaultFilters, loading: false, saving: false, error: null
};

export const fetchInternships = createApiThunk("internship/list", (f: Partial<InternshipFilters>) => internshipService.list(f));
export const fetchMyInternships = createApiThunk("internship/mine", (p: { page?: number; limit?: number; status?: string; search?: string }) => internshipService.mine(p));
export const fetchInternship = createApiThunk("internship/get", (id: string) => internshipService.get(id));
export const createInternship = createApiThunk("internship/create", (b: Partial<InternshipInput>) => internshipService.create(b));
export const updateInternship = createApiThunk("internship/update", (p: { id: string; body: Partial<InternshipInput> }) => internshipService.update(p.id, p.body));
export const deleteInternship = createApiThunk("internship/delete", async (id: string) => { await internshipService.remove(id); return id; });

const slice = createSlice({
  name: "internship",
  initialState,
  reducers: {
    setFilters(state, action: PayloadAction<Partial<InternshipFilters>>) { state.filters = { ...state.filters, ...action.payload }; },
    resetFilters(state) { state.filters = defaultFilters; },
    clearCurrent(state) { state.current = null; },
    markApplied(state, action: PayloadAction<{ applicationId: string }>) {
      if (state.current) { state.current.hasApplied = true; state.current.applicationId = action.payload.applicationId; state.current.applicationStatus = "PENDING"; }
    },
    markWithdrawn(state) {
      if (state.current) { state.current.hasApplied = false; state.current.applicationId = undefined; state.current.applicationStatus = undefined; }
    }
  },
  extraReducers: (b) => {
    b.addCase(fetchInternships.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchInternships.fulfilled, (s, a) => { s.loading = false; s.items = a.payload.items; s.meta = a.payload.meta; })
      .addCase(fetchInternships.rejected, (s, a) => { s.loading = false; s.error = a.payload ?? null; })
      .addCase(fetchMyInternships.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchMyInternships.fulfilled, (s, a) => { s.loading = false; s.mine = a.payload.items; s.mineMeta = a.payload.meta; })
      .addCase(fetchMyInternships.rejected, (s, a) => { s.loading = false; s.error = a.payload ?? null; })
      .addCase(fetchInternship.pending, (s) => { s.loading = true; s.error = null; s.current = null; })
      .addCase(fetchInternship.fulfilled, (s, a) => { s.loading = false; s.current = a.payload; })
      .addCase(fetchInternship.rejected, (s, a) => { s.loading = false; s.error = a.payload ?? null; })
      .addCase(createInternship.pending, (s) => { s.saving = true; s.error = null; })
      .addCase(createInternship.fulfilled, (s) => { s.saving = false; })
      .addCase(createInternship.rejected, (s, a) => { s.saving = false; s.error = a.payload ?? null; })
      .addCase(updateInternship.pending, (s) => { s.saving = true; s.error = null; })
      .addCase(updateInternship.fulfilled, (s, a) => { s.saving = false; s.mine = s.mine.map((i) => (i._id === a.payload._id ? { ...i, ...a.payload } : i)); })
      .addCase(updateInternship.rejected, (s, a) => { s.saving = false; s.error = a.payload ?? null; })
      .addCase(deleteInternship.fulfilled, (s, a) => { s.mine = s.mine.filter((i) => i._id !== a.payload); });
  }
});

export const { setFilters, resetFilters, clearCurrent, markApplied, markWithdrawn } = slice.actions;
export default slice.reducer;
