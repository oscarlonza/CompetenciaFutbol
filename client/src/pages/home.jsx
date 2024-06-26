import React, { useState } from "react";
import { Button } from "@material-tailwind/react";
import PositionTable from "../components/PositionTable";
export default function Home() {
  const [refreshList, setRefreshList] = useState(false);

  const handleUserAdded = () => {
    setRefreshList(!refreshList);
  };
  const handleUserDeleted = () => {
    setRefreshList(!refreshList);
  };

  return (
    <div>
      <PositionTable
        onUserDeleted={handleUserDeleted}
        onUserAdded={handleUserAdded}
      />
    </div>
  );
}
