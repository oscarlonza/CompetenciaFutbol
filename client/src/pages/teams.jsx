import React, { useState } from "react";
import { Button } from "@material-tailwind/react";
import TeamsTable from "../components/TeamsTable";
export default function Teams() {
  const [refreshList, setRefreshList] = useState(false);

  const handleUserAdded = () => {
    setRefreshList(!refreshList);
  };
  const handleUserDeleted = () => {
    setRefreshList(!refreshList);
  };

  return (
    <div>
      <TeamsTable
        onUserDeleted={handleUserDeleted}
        onUserAdded={handleUserAdded}
      />
    </div>
  );
}
