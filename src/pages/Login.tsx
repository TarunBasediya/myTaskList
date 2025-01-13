import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store.ts";
import { signInWithGoogle, logOut } from "../firebase/auth.ts";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Import the CSS file

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    if (user) {
      navigate("/"); // Redirect to Task List after login
    }
  }, [user, navigate]);

  const handleGoogleSignIn = () => {
    signInWithGoogle(dispatch);
  };

  const handleLogout = () => {
    logOut(dispatch);
  };

  return (
    <div className="login-page">
      {user ? (
        <div className="login-welcome-message">
          <h2 className="login-user-name">Welcome, {user.displayName}</h2>
          <button className="login-logout-button" onClick={handleLogout}>
            Log out
          </button>
        </div>
      ) : (
        <button className="login-signin-button" onClick={handleGoogleSignIn}>
          Sign in with Google
        </button>
      )}
    </div>
  );
};

export default Login;
