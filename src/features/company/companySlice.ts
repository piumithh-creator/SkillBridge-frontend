import { createSlice } from "@reduxjs/toolkit";
import { createApiThunk } from "../../app/thunk";
import { companyService, type CompanyDashboard } from "../../services/company.service";
import type { CompanyProfile } from "../../types";

interface CompanyState {
  profile: CompanyProfile | null;
  dashboard: CompanyDashboard | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
}

const initialState: CompanyState = { profile: null, dashboard: null, loading: false, saving: false, error: null };

export const fetchCompanyProfile = createApiThunk("company/profile", () => companyService.profile());
export const updateCompanyProfile = createApiThunk("company/updateProfile", (b: Partial<CompanyProfile>) => companyService.updateProfile(b));
export const uploadCompanyLogo = createApiThunk("company/uploadLogo", (f: File) => companyService.uploadLogo(f));
export const fetchCompanyDashboard = createApiThunk("company/dashboard", () => companyService.dashboard());

const slice = createSlice({
  name: "company",
  initialState,
  reducers: { resetCompany: () => initialState },
  extraReducers: (b) => {
    b.addCase(fetchCompanyProfile.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchCompanyProfile.fulfilled, (s, a) => { s.loading = false; s.profile = a.payload; })
      .addCase(fetchCompanyProfile.rejected, (s, a) => { s.loading = false; s.error = a.payload ?? null; })
      .addCase(updateCompanyProfile.pending, (s) => { s.saving = true; s.error = null; })
      .addCase(updateCompanyProfile.fulfilled, (s, a) => { s.saving = false; s.profile = { ...s.profile, ...a.payload }; })
      .addCase(updateCompanyProfile.rejected, (s, a) => { s.saving = false; s.error = a.payload ?? null; })
      .addCase(uploadCompanyLogo.fulfilled, (s, a) => { if (s.profile) s.profile.logo = a.payload.logo; })
      .addCase(fetchCompanyDashboard.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchCompanyDashboard.fulfilled, (s, a) => { s.loading = false; s.dashboard = a.payload; })
      .addCase(fetchCompanyDashboard.rejected, (s, a) => { s.loading = false; s.error = a.payload ?? null; });
  }
});

export const { resetCompany } = slice.actions;
export default slice.reducer;
