import React from "react";

function GraphPresentational({ children, className }) {
  return (
    <div className="progess-graph-flex-container">
      <div className="graph-ui-component">
        <div style={{ fontWeight: "bold", marginBottom: "1rem" }}>
          Dummy Graph
        </div>
        <svg width="320" height="120">
          <rect x="10" y="80" width="30" height="30" fill="#6366f1" />
          <rect x="50" y="60" width="30" height="50" fill="#8B5CF6" />
          <rect x="90" y="40" width="30" height="70" fill="#EC4899" />
          <rect x="130" y="20" width="30" height="90" fill="#F59E42" />
          <rect x="170" y="60" width="30" height="50" fill="#10B981" />
          <rect x="210" y="90" width="30" height="20" fill="#F43F5E" />
          <rect x="250" y="70" width="30" height="40" fill="#3B82F6" />
        </svg>
        <div style={{ marginTop: "1rem", color: "#aaa" }}>
          (This is a placeholder graph)
        </div>
      </div>
      <select name="" id="">
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
        <option value="3">Option 3</option>
        <option value="4">Option 4</option>
        <option value="5">Option 5</option>
      </select>
    </div>
  );
}

export default GraphPresentational;
