// TrayPanel — the main column panel anchored bottom-right.
// Implemented in Task 5.
import React from "react";

const TrayPanel: React.FC = () => {
  return (
    <div className="tray-panel">
      <p style={{ color: "var(--color-text-secondary)", padding: "var(--spacing-md)" }}>
        Quota Tracker — Task 5
      </p>
    </div>
  );
};

export default TrayPanel;
