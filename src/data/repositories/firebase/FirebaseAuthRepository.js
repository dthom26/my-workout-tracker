import { AuthRepository } from "../../interfaces/AuthRepository";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "@backend/config/firebase-config";

export class FirebaseAuthRepository extends AuthRepository {
  constructor() {
    super();
    this.googleProvider = new GoogleAuthProvider();
  }

  /**
   * Sign in with email and password
   */
  async signInWithEmail(email, password) {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  }

  /**
   * Sign up with email and password
   */
  async signUpWithEmail(email, password) {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result.user;
  }

  /**
   * Sign in with Google
   */
  async signInWithGoogle() {
    const result = await signInWithPopup(auth, this.googleProvider);
    return result.user;
  }

  /**
   * Sign out current user
   */
  async signOut() {
    await firebaseSignOut(auth);
  }

  /**
   * Get current user
   */
  getCurrentUser() {
    return auth.currentUser;
  }

  /**
   * Subscribe to auth state changes
   */
  onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, callback);
  }
}
