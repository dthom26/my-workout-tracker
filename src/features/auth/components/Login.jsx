import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginWithEmailAndPassword } from "../utils/signInWithPasswordAndEmail";

const Login = ({ className }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginWithEmailAndPassword(email, password);
      navigate("/ListOfUsersPrograms"); // Redirect after successful login
    } catch (error) {
      // handle error (show message, etc.)
      console.error("Login failed:", error);
      alert("Login failed: " + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
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
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
