import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import studentReducer from "../features/student/studentSlice";
import companyReducer from "../features/company/companySlice";
import internshipReducer from "../features/internship/internshipSlice";
import applicationReducer from "../features/application/applicationSlice";
import notificationReducer from "../features/notification/notificationSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    student: studentReducer,
    company: companyReducer,
    internship: internshipReducer,
    application: applicationReducer,
    notification: notificationReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
