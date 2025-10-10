import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../../backend/config/firbase-config";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../../../backend/config/firbase-config";
export const signUpWithEmail = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up
      const user = userCredential.user;
      // ...
      const docRef = doc(db, "users", user.uid);
      setDoc(
        docRef,
        {
          name: user.displayName,
          email: user.email,
          uid: user.uid,
        },
        { merge: true }
      );
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });
