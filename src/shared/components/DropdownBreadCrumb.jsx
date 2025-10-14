import React, { useState, useRef, useEffect } from "react";

// Drop down menu component
export function DropdownMenu({ actions, trigger }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="dropdown" ref={menuRef}>
      <button className="dropdown-trigger" onClick={() => setOpen((o) => !o)}>
        {trigger || "⋮"}
      </button>
      {open && (
        <div className="dropdown-content">
          {actions.map((action, index) => (
            <button
              key={index}
              className="dropdown-item"
              onClick={(e) => {
                action.onClick(e);
                setOpen(false);
              }}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
