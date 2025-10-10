import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../../backend/config/firbase-config";

export function loginWithEmailAndPassword(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}
