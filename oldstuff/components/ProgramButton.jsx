import React from "react";

function ProgramButton({ children, onClick, className }) {
  // This component is a button that can be used to navigate to different program page.
  return <button className={className}>{children}</button>;
}

export default ProgramButton;
