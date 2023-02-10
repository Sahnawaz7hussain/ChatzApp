import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./features/userSlice";
import appApi from "./services/appApi";

// persisit our store.
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import thunk from "redux-thunk";

// reducers
const reducer = combineReducers({
  user: userSlice,
  [appApi.reducerPath]: appApi.reducer,
});

const persistConfig = {
  key: "root",
  storage,
  blackList: [appApi.reducerPath],
};

// persist our store.

// const persistReducer = pers