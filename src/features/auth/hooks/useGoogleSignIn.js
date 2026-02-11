import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function useGoogleSignIn() {
  const navigate = useNavigate();
  const { signInWithGoogle } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate("/dashboard"); // Navigate to dashboard after sign in
    } catch (error) {
      // handle error (show message, etc.)
      console.error("Sign in failed:", error);
    }
  };

  return { handleGoogleSignIn };
}
