import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../../backend/config/firbase-config";
import { useAuth } from "../../auth/context/AuthContext";

export function useUserPrograms() {
  const [userPrograms, setUserPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, loading: loadingAuth } = useAuth();

  useEffect(() => {
    if (loadingAuth) return;
    async function fetchPrograms() {
      try {
        if (!user) {
          setError("Not logged in");
          setLoading(false);
          return;
        }
        const q = query(
          collection(db, "programs"),
          where("createdBy", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        const programs = [];
        querySnapshot.forEach((doc) => {
          programs.push({ id: doc.id, ...doc.data() });
        });
        setUserPrograms(programs);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPrograms();
  }, [user, loadingAuth]);

  return { userPrograms, loading: loading || loadingAuth, error };
}
