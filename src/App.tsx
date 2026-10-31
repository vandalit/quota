import React, { useEffect } from "react";
import TrayPanel from "./components/TrayPanel";
import { runMigrations } from "./services/db";
import "./theme/base.css";
import "./theme/themes/default.css";
import "./app.css";

const App: React.FC = () => {
  useEffect(() => {
    runMigrations().catch(console.error);
  }, []);

  return <TrayPanel />;
};

export default App;
