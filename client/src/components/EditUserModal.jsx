import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
} from "@material-tailwind/react";

const EditUserModal = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
  onUpdateEditedUser,
}) => {
  const [editedUser, setEditedUser] = useState(user);

  useEffect(() => {
    setEditedUser(user);
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
    onUpdateEditedUser(editedUser.id, name, value);
  };

  const handleUpdateUser = () => {
    onUpdateUser(editedUser);
    onClose();
  };

  return (
    <Dialog
      size="xs"
      open={isOpen}
      onClose={onClose}
      className="bg-transparent shadow-none"
    >
      <Card className="mx-auto w-full max-w-[24rem]">
        <CardBody className="flex flex-col gap-4">
          <Typography variant="h4" color="blue-gray">
            Sign In
          </Typography>
          <Typography
            className="mb-3 font-normal"
            variant="paragraph"
            color="gray"
          >
            Enter your email and password to Sign In.
          </Typography>
          <Input
            type="text"
            placeholder="Name"
            name="name"
            value={editedUser.name}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-md p-2 mb-2"
          />
          <Input
            type="text"
            placeholder="Last Name"
            name="lastName"
            value={editedUser.lastName}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-md p-2"
          />
        </CardBody>
        <CardFooter className="pt-0 flex justify-between">
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="gradient" onClick={handleUpdateUser}>
            Save
          </Button>
        </CardFooter>
      </Card>
    </Dialog>
  );
};

export default EditUserModal;
