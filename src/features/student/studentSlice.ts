import { createSlice } from "@reduxjs/toolkit";
import { createApiThunk } from "../../app/thunk";
import { studentService, type StudentDashboard } from "../../services/student.service";
import type { StudentProfile } from "../../types";

interface StudentState {
  profile: StudentProfile | null;
  dashboard: StudentDashboard | null;
  savedIds: string[];
  loading: boolean;
  saving: boolean;
  error: string | null;
}

const initialState: StudentState = { profile: null, dashboard: null, savedIds: [], loading: false, saving: false, error: null };

export const fetchStudentProfile = createApiThunk("student/profile", () => studentService.profile());
export const updateStudentProfile = createApiThunk("student/updateProfile", (b: Partial<StudentProfile>) => studentService.updateProfile(b));
export const uploadStudentCv = createApiThunk("student/uploadCv", (f: File) => studentService.uploadCv(f));
export const uploadStudentImage = createApiThunk("student/uploadImage", (f: File) => studentService.uploadImage(f));
export const fetchStudentDashboard = createApiThunk("student/dashboard", () => studentService.dashboard());
export const fetchSavedIds = createApiThunk("student/savedIds", () => studentService.savedIds());
export const toggleSaved = createApiThunk("student/toggleSaved", async (p: { id: string; saved: boolean }) => {
  if (p.saved) await studentService.unsave(p.id);
  else await studentService.save(p.id);
  return { id: p.id, nowSaved: !p.saved };
});

const slice = createSlice({
  name: "student",
  initialState,
  reducers: { resetStudent: () => initialState },
  extraReducers: (b) => {
    b.addCase(fetchStudentProfile.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchStudentProfile.fulfilled, (s, a) => { s.loading = false; s.profile = a.payload; })
      .addCase(fetchStudentProfile.rejected, (s, a) => { s.loading = false; s.error = a.payload ?? null; })
      .addCase(updateStudentProfile.pending, (s) => { s.saving = true; s.error = null; })
      .addCase(updateStudentProfile.fulfilled, (s, a) => { s.saving = false; s.profile = { ...s.profile, ...a.payload }; })
      .addCase(updateStudentProfile.rejected, (s, a) => { s.saving = false; s.error = a.payload ?? null; })
      .addCase(uploadStudentCv.pending, (s) => { s.saving = true; })
      .addCase(uploadStudentCv.fulfilled, (s, a) => {
        s.saving = false;
        if (s.profile) s.profile = { ...s.profile, cvOriginalName: a.payload.cvOriginalName, cvUploadedAt: a.payload.cvUploadedAt, hasCv: true };
      })
      .addCase(uploadStudentCv.rejected, (s, a) => { s.saving = false; s.error = a.payload ?? null; })
      .addCase(uploadStudentImage.fulfilled, (s, a) => { if (s.profile) s.profile.profileImage = a.payload.profileImage; })
      .addCase(fetchStudentDashboard.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchStudentDashboard.fulfilled, (s, a) => { s.loading = false; s.dashboard = a.payload; })
      .addCase(fetchStudentDashboard.rejected, (s, a) => { s.loading = false; s.error = a.payload ?? null; })
      .addCase(fetchSavedIds.fulfilled, (s, a) => { s.savedIds = a.payload; })
      .addCase(toggleSaved.fulfilled, (s, a) => {
        s.savedIds = a.payload.nowSaved ? [...new Set([...s.savedIds, a.payload.id])] : s.savedIds.filter((i) => i !== a.payload.id);
      });
  }
});

export const { resetStudent } = slice.actions;
export default slice.reducer;
