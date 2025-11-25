import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserPrograms } from "../hooks/useUserPrograms";
import { DropdownMenu } from "../../../shared/components/DropdownBreadCrumb";
import { deleteProgramFromFirestore } from "../utils/programService";
import { useAuth } from "../../auth/context/AuthContext";
import "./ListOfUsersPrograms.css";

const ListOfUsersPrograms = () => {
  const { userPrograms, loading, error, refetchPrograms } = useUserPrograms();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleSignOut = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Failed to sign out:", error);
      alert("Failed to sign out. Please try again.");
    }
  };

  useEffect(() => {
    if (!loading && userPrograms.length === 0) {
      navigate("/CreateProgram");
    }
  }, [loading, userPrograms, navigate]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="user-programs-container">
      <nav className="breadcrumb">
        <DropdownMenu
          actions={[
            {
              label: "Home",
              onClick: (e) => {
                e.stopPropagation();
                navigate("/dashboard");
              },
            },
            {
              label: "Create Program",
              onClick: (e) => {
                e.stopPropagation();
                navigate("/CreateProgram");
              },
            },
            {
              label: "Sign Out",
              onClick: (e) => {
                e.stopPropagation();
                handleSignOut();
              },
            },
          ]}
          trigger={<span>⋮</span>}
        />
      </nav>
      <h1>Your Programs</h1>
      <section className="user-programs-list">
        {userPrograms.map((program) => (
          <div
            key={program.id}
            className="user-program-card"
            onClick={() => navigate(`/ExecuteProgram/${program.id}`)}
          >
            <DropdownMenu
              actions={[
                {
                  label: "Delete Program",
                  onClick: async (e) => {
                    e.stopPropagation();
                    try {
                      await deleteProgramFromFirestore(program.id);
                      // refetch to update UI
                      if (refetchPrograms) await refetchPrograms();
                    } catch (err) {
                      console.error("Failed to delete program:", err);
                    }
                  },
                },
              ]}
              trigger={<span>⋮</span>}
            />
            <h2>{program.name}</h2>
            <p>{program.description}</p>
            <span>{program.duration} weeks</span>
          </div>
        ))}
      </section>
    </div>
  );
};

export default ListOfUsersPrograms;
