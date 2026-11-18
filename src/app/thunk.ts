import { createAsyncThunk } from "@reduxjs/toolkit";
import { getErrorMessage } from "../services/api";

/** createAsyncThunk wrapper: every thunk rejects with a plain string message for the slices' `error` field. */
export const createApiThunk = <Returned, Arg = void>(type: string, fn: (arg: Arg) => Promise<Returned>) =>
  createAsyncThunk<Returned, Arg, { rejectValue: string }>(type, async (arg, { rejectWithValue }) => {
    try {
      return await fn(arg);
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  });
