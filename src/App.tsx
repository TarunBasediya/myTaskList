import React from "react";
import { Provider } from "react-redux";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import store from "../src/redux/store.ts";
import TaskList from "./components/TaskList.tsx";
import TaskForm from "./components/TaskForm.tsx";
import Login from "./pages/Login.tsx";
import Header from "./components/Header.tsx";
import Profile from "./components/Profile.tsx"; // Import the Profile component
import { RootState } from "./redux/store";
import "./App.css";
import TaskListBoard from "./components/TaskListBoard.tsx";

const App: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.user); // Get user state

  const handleUpdateProfile = (updatedData: {
    displayName: string;
    email: string;
  }) => {
    // Assuming there's an action to update the user in the Redux store
    console.log("Profile Updated:", updatedData);
    // Dispatch the updated user data here
  };

  return (
    <Provider store={store}>
      <Router>
        <div>
          <Header user={user} />
          <main>
            <Routes>
              <Route
                path="/"
                element={user ? <TaskList /> : <Navigate to="/login" />}
              />
              <Route
                path="/create-task"
                element={user ? <TaskForm /> : <Navigate to="/login" />}
              />
              <Route
                path="/board-view"
                element={user ? <TaskListBoard /> : <Navigate to="/login" />}
              />
              <Route
                path="/edit-task/:id"
                element={user ? <TaskForm /> : <Navigate to="/login" />}
              />
              <Route
                path="/profile"
                element={
                  user ? (
                    <Profile
                      user={user}
                      onUpdateProfile={handleUpdateProfile}
                    />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route path="/login" element={<Login />} />
            </Routes>
          </main>
        </div>
      </Router>
    </Provider>
  );
};

export default App;
