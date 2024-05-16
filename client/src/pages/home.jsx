import React, { useState } from "react";
import { Button } from "@material-tailwind/react";
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
      <h1 className="">Hello World</h1>
      <Button>Button</Button>
    </div>
  );
}
