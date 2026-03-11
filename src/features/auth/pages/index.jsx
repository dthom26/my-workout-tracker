import React, { useState } from "react";
import { useGoogleSignIn } from "../hooks/useGoogleSignIn";
import Login from "../components/Login";
import SignUp from "../components/SignUp";
import "../styles/index.css";
import "../styles/form.css";

const Auth = () => {
  const { handleGoogleSignIn } = useGoogleSignIn();
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-title">{showLogin ? "Login" : "Sign Up"}</div>
        <div className="auth-form-wrapper">
          {/* <Login className={`auth-form${showLogin ? " active" : ""}`} />
          <SignUp className={`auth-form${!showLogin ? " active" : ""}`} /> */}
          App is currently in beta and only supports Google Sign-In. Please use
          the button below to sign in with your Google account.
        </div>
        <button
          className="auth-btn auth-btn-google"
          onClick={handleGoogleSignIn}
        >
          Sign in with Google
        </button>
        <div className="auth-switch">
          {showLogin ? (
            <>
              Don't have an account?
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setShowLogin(false);
                }}
              >
                Sign Up
              </a>
            </>
          ) : (
            <>
              Already have an account?
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setShowLogin(true);
                }}
              >
                Login
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
