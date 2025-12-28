import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@backend/config/firebase-config";

export function loginWithEmailAndPassword(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}
