import { useNavigate } from "react-router-dom";
import { signInWithGoogle } from "../utils/SignIn";

export function useGoogleSignIn() {
  const navigate = useNavigate();

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
