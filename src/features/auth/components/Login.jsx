import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useGoogleSignIn } from "../hooks/useGoogleSignIn";

const Login = ({ className }) => {
  /*
  // Email/password login temporarily disabled — use Google sign-in instead.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  */
  const navigate = useNavigate();
  // use Google sign-in flow
  const { handleGoogleSignIn } = useGoogleSignIn();
  const { signInWithEmail } = useAuth();

  /*
  // Original email/password submit handler (commented out)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmail(email, password);
      navigate("/dashboard"); // Redirect after successful login
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };
  */

  const handleGoogleClick = async (e) => {
    e.preventDefault();
    try {
      await handleGoogleSignIn();
    } catch (error) {
      alert("Google sign-in failed: " + error.message);
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} className={className}>
      {/*
        Email/password login temporarily removed from UI.
        The original fields are commented out above.
      */}
      <div className="form-group">
        <button type="button" onClick={handleGoogleClick}>
          Sign in with Google
        </button>
      </div>
    </form>
  );
};

export default Login;
