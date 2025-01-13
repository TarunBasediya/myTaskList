import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice.ts";
import taskReducer from "./taskSlice.ts";

const store = configureStore({
  reducer: {
    user: userReducer,
    task: taskReducer,
  },
});

// Export RootState based on the store's state structure
export type RootState = ReturnType<typeof store.getState>;

export default store;
