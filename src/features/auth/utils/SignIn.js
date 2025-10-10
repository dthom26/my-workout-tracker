import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../../../backend/config/firbase-config";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../../../backend/config/firbase-config";

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, provider);
  userInfoLocal(result);
  const docRef = doc(db, "users", result.user.uid);
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
