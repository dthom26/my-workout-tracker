import { useNavigate } from "react-router-dom";
import { signInWithGoogle } from "../utils/SignIn";

export function useGoogleSignIn() {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate("/ListOfUsersPrograms"); // or your desired route
    } catch (error) {
      // handle error (show message, etc.)
      console.error("Sign in failed:", error);
    }
  };

  return { handleGoogleSignIn };
}
