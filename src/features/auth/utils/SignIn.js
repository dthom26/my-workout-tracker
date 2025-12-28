import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "@backend/config/firebase-config";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@backend/config/firebase-config";
import { COLLECTIONS } from "@/data/constants";

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, provider);
  userInfoLocal(result);
  const docRef = doc(db, COLLECTIONS.USERS, result.user.uid);
  setDoc(
    docRef,
    {
      name: result.user.displayName,
      email: result.user.email,
      uid: result.user.uid,
    },
    { merge: true }
  );
  return result;
};

function userInfoLocal(result) {
  const info = {
    name: result.user.displayName,
    isAuthenticated: true,
  };
  localStorage.setItem("user", JSON.stringify(info));
}
