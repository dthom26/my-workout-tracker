import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signUpWithEmail } from "../utils/authService";
import {
  validatePasswordLocal,
  validateEmail,
  isDisposableEmail,
} from "../utils/passwordValidation";

const SignUp = ({ className }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordValidation, setPasswordValidation] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Validate password in real-time
  useEffect(() => {
    if (password) {
      const validation = validatePasswordLocal(password);
      setPasswordValidation(validation);
    } else {
      setPasswordValidation(null);
    }
  }, [password]);

  const handleEmailBlur = () => {
    if (email) {
      const validation = validateEmail(email);
      if (!validation.isValid) {
        setEmailError(validation.message);
      } else if (isDisposableEmail(email)) {
        setEmailError("Disposable email addresses are not allowed");
      } else {
        setEmailError("");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setEmailError(emailValidation.message);
      setIsSubmitting(false);
      return;
    }

    if (isDisposableEmail(email)) {
      setEmailError("Disposable email addresses are not allowed");
      setIsSubmitting(false);
      return;
    }

    // Validate password
    const passwordValidation = validatePasswordLocal(password);
    if (!passwordValidation.isValid) {
      alert(
        "Password does not meet requirements. Please check the requirements below."
      );
      setIsSubmitting(false);
      return;
    }

    try {
      await signUpWithEmail(email, password);
      navigate("/dashboard");
    } catch (error) {
      // Handle specific Firebase errors
      let errorMessage = "Sign up failed. Please try again.";

      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage =
            "This email is already registered. Please login instead.";
          setEmailError(errorMessage);
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email address.";
          setEmailError(errorMessage);
          break;
        case "auth/weak-password":
          errorMessage =
            "Password is too weak. Please choose a stronger password.";
          break;
        case "auth/operation-not-allowed":
          errorMessage =
            "Email/password accounts are not enabled. Please contact support.";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many sign-up attempts. Please try again later.";
          break;
        default:
          errorMessage = error.message || errorMessage;
      }

      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    return email && password && !emailError && passwordValidation?.isValid;
  };

  return (
    <form className={className} onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input
          className="form-input"
          type="email"
          id="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError("");
          }}
          onBlur={handleEmailBlur}
          required
          style={{
            borderColor: emailError ? "#f44336" : undefined,
          }}
        />
        {emailError && <p style={styles.errorText}>{emailError}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="password">Password:</label>
        <div style={styles.passwordContainer}>
          <input
            className="form-input"
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              paddingRight: "60px",
            }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={styles.showButton}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {/* Password Requirements */}
        {password && passwordValidation && (
          <div style={styles.requirementsBox}>
            <p style={styles.requirementsTitle}>Password Requirements:</p>
            <ul style={styles.requirementsList}>
              <li
                style={{
                  ...styles.requirement,
                  color: passwordValidation.status.meetsMinPasswordLength
                    ? "#4CAF50"
                    : "#666",
                }}
              >
                {passwordValidation.status.meetsMinPasswordLength ? "✓" : "○"}{" "}
                At least 8 characters
              </li>
              <li
                style={{
                  ...styles.requirement,
                  color: passwordValidation.status.containsUppercaseLetter
                    ? "#4CAF50"
                    : "#666",
                }}
              >
                {passwordValidation.status.containsUppercaseLetter ? "✓" : "○"}{" "}
                One uppercase letter (A-Z)
              </li>
              <li
                style={{
                  ...styles.requirement,
                  color: passwordValidation.status.containsLowercaseLetter
                    ? "#4CAF50"
                    : "#666",
                }}
              >
                {passwordValidation.status.containsLowercaseLetter ? "✓" : "○"}{" "}
                One lowercase letter (a-z)
              </li>
              <li
                style={{
                  ...styles.requirement,
                  color: passwordValidation.status.containsNumericCharacter
                    ? "#4CAF50"
                    : "#666",
                }}
              >
                {passwordValidation.status.containsNumericCharacter ? "✓" : "○"}{" "}
                One number (0-9)
              </li>
              <li
                style={{
                  ...styles.requirement,
                  color: passwordValidation.status
                    .containsNonAlphanumericCharacter
                    ? "#4CAF50"
                    : "#666",
                }}
              >
                {passwordValidation.status.containsNonAlphanumericCharacter
                  ? "✓"
                  : "○"}{" "}
                One special character
              </li>
            </ul>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={!isFormValid() || isSubmitting}
        style={{
          opacity: isFormValid() && !isSubmitting ? 1 : 0.5,
          cursor: isFormValid() && !isSubmitting ? "pointer" : "not-allowed",
        }}
      >
        {isSubmitting ? "Signing up..." : "Sign Up"}
      </button>
    </form>
  );
};

const styles = {
  errorText: {
    color: "#f44336",
    fontSize: "12px",
    marginTop: "5px",
    marginBottom: 0,
  },
  passwordContainer: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  showButton: {
    position: "absolute",
    right: "10px",
    background: "none",
    border: "none",
    color: "#3498db",
    cursor: "pointer",
    fontSize: "12px",
    padding: "5px 10px",
  },
  requirementsBox: {
    marginTop: "10px",
    padding: "12px",
    backgroundColor: "#f9f9f9",
    borderRadius: "4px",
    border: "1px solid #e0e0e0",
  },
  requirementsTitle: {
    fontSize: "12px",
    fontWeight: "bold",
    marginBottom: "8px",
    marginTop: 0,
    color: "#333",
  },
  requirementsList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  requirement: {
    fontSize: "12px",
    marginBottom: "4px",
    transition: "color 0.2s ease",
  },
};

export default SignUp;
