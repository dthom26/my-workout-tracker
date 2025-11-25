// import { useState, useEffect, useCallback } from "react";
// import {
//   collection,
//   query,
//   where,
//   getDocs,
//   onSnapshot,
// } from "firebase/firestore";
// import { db } from "../../../../backend/config/firbase-config";
// import { useAuth } from "../../auth/context/AuthContext";

// export function useUserPrograms() {
//   const [userPrograms, setUserPrograms] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { user, loading: loadingAuth } = useAuth();

//   // refetch function to manually reload programs (useful after deletes)
//   const refetchPrograms = useCallback(async () => {
//     if (!user) return;
//     setLoading(true);
//     try {
//       const q = query(
//         collection(db, "programs"),
//         where("createdBy", "==", user.uid)
//       );
//       const querySnapshot = await getDocs(q);
//       const programs = [];
//       querySnapshot.forEach((doc) => {
//         programs.push({ id: doc.id, ...doc.data() });
//       });
//       setUserPrograms(programs);
//     } catch (err) {
//       setError(err.message || String(err));
//     } finally {
//       setLoading(false);
//     }
//   }, [user]);

//   useEffect(() => {
//     if (loadingAuth) return;

//     if (!user) {
//       setError("Not logged in");
//       setLoading(false);
//       return;
//     }

//     // Real-time listener keeps UI in sync; also perform initial fetch
//     const q = query(
//       collection(db, "programs"),
//       where("createdBy", "==", user.uid)
//     );

//     const unsubscribe = onSnapshot(
//       q,
//       (querySnapshot) => {
//         const programs = [];
//         querySnapshot.forEach((doc) => {
//           programs.push({ id: doc.id, ...doc.data() });
//         });
//         setUserPrograms(programs);
//         setLoading(false);
//       },
//       (err) => {
//         setError(err.message);
//         setLoading(false);
//       }
//     );

//     // Also ensure we have an initial full fetch in case listener timing
//     refetchPrograms();

//     // Cleanup
//     return () => unsubscribe();
//   }, [refetchPrograms, loadingAuth, user]);

//   return {
//     userPrograms,
//     loading: loading || loadingAuth,
//     error,
//     refetchPrograms,
//   };
// }

// src/features/programs/hooks/useUserPrograms.js
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../auth/context/AuthContext";
import { repositoryFactory } from "../../../data/factory/repositoryFactory";

export function useUserPrograms() {
  const [userPrograms, setUserPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, loading: loadingAuth } = useAuth();

  // Get the repository from the factory
  const programRepository = repositoryFactory.programRepository;

  // Refetch function now uses repository
  const refetchPrograms = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    try {
      const programs = await programRepository.getUserPrograms(user.uid);
      setUserPrograms(programs);
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }, [user, programRepository]);

  useEffect(() => {
    if (loadingAuth) return;

    if (!user) {
      setError("Not logged in");
      setLoading(false);
      return;
    }

    // Use repository for real-time updates
    const unsubscribe = programRepository.watchUserPrograms(
      user.uid,
      (programs) => {
        setUserPrograms(programs);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    // Also ensure we have initial data
    refetchPrograms();

    // Cleanup
    return () => unsubscribe();
  }, [refetchPrograms, loadingAuth, user, programRepository]);

  return {
    userPrograms,
    loading: loading || loadingAuth,
    error,
    refetchPrograms,
  };
}
