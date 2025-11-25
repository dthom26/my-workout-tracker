import { Route, Routes } from "react-router-dom";
import Auth from "./features/auth/pages/index.jsx";
import Dashboard from "./features/dashboard/Dashboard.jsx";
import CreateProgram from "./features/programs/pages/CreateProgram.jsx";
import ExecuteProgram from "./features/programs/pages/ExecuteProgram.jsx";
import CurrentSession from "./features/workouts/pages/CurrentSession.jsx";
import ListOfUsersPrograms from "./features/programs/pages/ListOfUsersPrograms.jsx";
import { AuthProvider } from "./features/auth/context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/CreateProgram" element={<CreateProgram />} />
        <Route path="/ExecuteProgram/:programId" element={<ExecuteProgram />} />
        <Route
          path="/CurrentSession/:programId/:workoutId"
          element={<CurrentSession />}
        />
        <Route
          path="/CurrentSession/:programId/:workoutId/:week"
          element={<CurrentSession />}
        />
        <Route path="/ListOfUsersPrograms" element={<ListOfUsersPrograms />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
