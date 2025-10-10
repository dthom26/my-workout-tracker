import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUpWithEmail } from "../utils/authService";

const SignUp = ({ className }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signUpWithEmail(email, password);
      navigate("/ListOfUsersPrograms"); // Redirect after successful signup
    } catch (error) {
      // handle error (show message, etc.)
      console.error("Sign up failed:", error);
      alert("Sign up failed: " + error.message);
    }
  };

  return (
    <form className={className} onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default SignUp;
