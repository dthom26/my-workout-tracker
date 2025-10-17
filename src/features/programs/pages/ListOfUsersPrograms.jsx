import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserPrograms } from "../hooks/useUserPrograms";
import { DropdownMenu } from "../../../shared/components/DropdownBreadCrumb";
import "./ListOfUsersPrograms.css";

const ListOfUsersPrograms = () => {
  const { userPrograms, loading, error } = useUserPrograms();
  const navigate = useNavigate();

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
                navigate("/ListOfUsersPrograms");
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
                navigate("/ListOfUsersPrograms"); // Adjust the route as needed
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
                  label: "Home",
                  onClick: (e) => {
                    e.stopPropagation();
                    navigate("/ListOfUsersPrograms");
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
                    navigate("/ListOfUsersPrograms"); // Adjust the route as needed
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
