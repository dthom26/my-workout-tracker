import { AuthRepository } from "../../interfaces/AuthRepository";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "@backend/config/firebase-config";

export class FirebaseAuthRepository extends AuthRepository {}
