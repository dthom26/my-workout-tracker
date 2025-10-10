import React from "react";
import ProgramButton from "../ProgramButton";
import GraphPresentational from "../GraphPresentational";

const HomePagePresentational = () => {
  return (
    <main className="homepage-container">
      <header className="header-container">
        <h1>Welcome User</h1>
        <button>Logout</button>
      </header>
      <section className="graph-container">
        <GraphPresentational className={"progress-graph"}></GraphPresentational>
        <GraphPresentational className={"progress-graph"}></GraphPresentational>
      </section>
      <section className="program-buttons-container">
        <ProgramButton className={"program-button"}>
          Current Program
        </ProgramButton>
        <ProgramButton className={"program-button"}>New Program</ProgramButton>
        <ProgramButton className={"program-button"}>All Programs</ProgramButton>
      </section>
    </main>
  );
};

export default HomePagePresentational;
