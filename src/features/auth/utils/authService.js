import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "@backend/config/firebase-config";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@backend/config/firebase-config";
import { COLLECTIONS } from "@/data/constants";

/**
 * Sign up a new user with email and password
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise} - Resolves with user credential
 */
export const signUpWithEmail = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;

  // Create user document in Firestore
  const docRef = doc(db, COLLECTIONS.USERS, user.uid);
  await setDoc(
    docRef,
    {
      name: user.displayName,
      email: user.email,
      uid: user.uid,
      createdAt: new Date().toISOString(),
    },
    { merge: true }
  );

  return userCredential;
};

/**
 * Sign out the current user
 * @returns {Promise} - Resolves when sign out is complete
 */
export const signOutUser = async () => {
  await signOut(auth);
};
