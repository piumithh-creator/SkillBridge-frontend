import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { createApiThunk } from "../../app/thunk";
import { setAccessToken } from "../../services/api";
import { authService, type RegisterPayload } from "../../services/auth.service";
import type { AuthUser } from "../../types";

interface AuthState {
  user: AuthUser | null;
  /** true once the initial silent refresh attempt has finished (prevents route flicker) */
  initialized: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = { user: null, initialized: false, loading: false, error: null };

export const bootstrapAuth = createApiThunk("auth/bootstrap", async () => {
  const { user } = await authService.restore();
  return user;
});
export const loginUser = createApiThunk("auth/login", async (p: { email: string; password: string }) => {
  const res = await authService.login(p.email, p.password);
  setAccessToken(res.accessToken);
  return res.user;
});
export const registerUser = createApiThunk("auth/register", async (p: RegisterPayload) => {
  const res = await authService.register(p);
  setAccessToken(res.accessToken);
  return res.user;
});
export const logoutUser = createApiThunk("auth/logout", async () => {
  try { await authService.logout(); } finally { setAccessToken(null); }
});

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    sessionExpired(state) { state.user = null; setAccessToken(null); },
    clearAuthError(state) { state.error = null; },
    userUpdated(state, action: PayloadAction<Partial<AuthUser>>) { if (state.user) state.user = { ...state.user, ...action.payload }; }
  },
  extraReducers: (b) => {
    b.addCase(bootstrapAuth.fulfilled, (s, a) => { s.user = a.payload; s.initialized = true; })
      .addCase(bootstrapAuth.rejected, (s) => { s.user = null; s.initialized = true; });
    for (const t of [loginUser, registerUser]) {
      b.addCase(t.pending, (s) => { s.loading = true; s.error = null; })
        .addCase(t.fulfilled, (s, a) => { s.loading = false; s.user = a.payload; })
        .addCase(t.rejected, (s, a) => { s.loading = false; s.error = a.payload ?? "Request failed"; });
    }
    b.addCase(logoutUser.fulfilled, (s) => { s.user = null; })
      .addCase(logoutUser.rejected, (s) => { s.user = null; });
  }
});

export const { sessionExpired, clearAuthError, userUpdated } = slice.actions;
export default slice.reducer;
