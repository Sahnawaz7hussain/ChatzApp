import { createSlice } from "@reduxjs/toolkit";
import appApi from "../services/appApi";

export const userSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    addNotifications: (state, { payload }) => {},
    sendNotifications: (state, { payload }) => {},
  },

  extraReducers: (builder) => {
    // save user after signup.
    builder.addMatcher(
      appApi.endpoints.signupUser.matchFulfilled,
      (state, { payload }) => payload
    );
    // save user after login
    builder.addMatcher(
      appApi.endpoints.loginUser.matchFulfilled,
      (state, { payload }) => payload
    );
    // logout :destroy user session.
    builder.addMatcher(
      appApi.endpoints.logoutUser.matchFulfilled,
      (state) => null
    );
  },
});

export const { addNotifications, sendNotifications } = userSlice.actions;
export default userSlice.reducer;
