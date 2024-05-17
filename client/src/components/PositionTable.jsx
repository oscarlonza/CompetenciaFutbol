import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import EditUserModal from "./EditUserModal";
import PositionForm from "./PositionForm";
import MatchManagement from "./MatchManagement";
import ImageIcon from "../../public/919510.png";
import {
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/outline";
import { PencilIcon, UserPlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  CardFooter,
  Tabs,
  TabsHeader,
  Tab,
  Avatar,
  Tooltip,
} from "@material-tailwind/react";

const TABS = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Monitored",
    value: "monitored",
  },
];

const TABLE_HEAD = [
  "Grupo",

  "Equipo",
  "Puntos",
  "PJ",
  "PG",
  "PE",
  "PP",
  "GF",
  "GC",
];

const UserManagement = ({ onUserDeleted, onUserAdded }) => {
  const [table, setTable] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editedUsers, setEditedUsers] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTable();
  }, []);

  const fetchTable = () => {
    axios
      .get("http://localhost:4000/api/tabla-posiciones")
      .then((response) => {
        setTable(response.data);
      })
      .catch((error) => {
        console.error("Error fetching Table:", error);
      });
  };

  const handleInputChange = (e, id) => {
    const { name, value } = e.target;
    setEditedUsers((prevEditedUsers) => ({
      ...prevEditedUsers,
      [id]: {
        ...prevEditedUsers[id],
        [name]: value,
      },
    }));
  };

  return (
    <Card className="h-full w-full justify-center mb-10">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-8 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray">
              Tabla de posiciones
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              Se muestra toda la informacion de toda la liga
            </Typography>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Button
              onClick={() => navigate("/teams")}
              variant="outlined"
              size="sm"
            >
              Ver todos los equipos
            </Button>
            <Button
              onClick={() => setIsFormOpen(true)}
              className="flex items-center gap-3"
              size="sm"
            >
              <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Add Partido
            </Button>

            {isFormOpen && (
              <PositionForm
                onUserAdded={() => {
                  setIsFormOpen(false);
                  onUserAdded();
                }}
                fetchTable={fetchTable}
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
              />
            )}
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <Tabs value="all" className="w-full md:w-max">
            <TabsHeader>
              {TABS.map(({ label, value }) => (
                <Tab key={value} value={value}>
                  &nbsp;&nbsp;{label}&nbsp;&nbsp;
                </Tab>
              ))}
            </TabsHeader>
          </Tabs>
          <div className="w-full md:w-72">
            <Input
              onChange={(e) => setSearchTerm(e.target.value)}
              label="Search"
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            />
          </div>
        </div>
      </CardHeader>
      <CardBody className="overflow-scroll px-0">
        <table className="mt-4 w-full min-w-max table-auto text-center ">
          <thead>
            <tr>
              {TABLE_HEAD.map((head, index) => (
                <th
                  key={head}
                  className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50 "
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                  >
                    {head}{" "}
                    {index !== TABLE_HEAD.length - 1 && (
                      <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />
                    )}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {table
              .filter((table) =>
                table.nombreEquipo
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
              )
              .map((table, index) => (
                <tr key={index}>
                  <td className="p-4 border-b border-blue-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {table.grupoEquipo}
                        </Typography>
                        {editedUsers[table.id] && (
                          <EditUserModal
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            user={table}
                            onUpdateUser={() => handleUpdateUser(table.id)}
                            handleInputChange={(e) =>
                              handleInputChange(e, table.id)
                            }
                            onUpdateEditedUser={handleUpdateEditedUser}
                          />
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="p-4 border-b border-blue-gray-50">
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={ImageIcon}
                        alt={table.nombreEquipo}
                        size="sm"
                      />
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {table.nombreEquipo}
                      </Typography>
                    </div>
                  </td>
                  <td className="p-4 border-b border-blue-gray-50">
                    <div className="flex flex-col">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {table.puntos}
                      </Typography>
                    </div>
                  </td>
                  <td className="p-4 border-b border-blue-gray-50">
                    <div className="flex flex-col">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {table.PJ}
                      </Typography>
                    </div>
                  </td>
                  <td className="p-4 border-b border-blue-gray-50">
                    <div className="flex flex-col">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {table.PG}
                      </Typography>
                    </div>
                  </td>
                  <td className="p-4 border-b border-blue-gray-50">
                    <div className="flex flex-col">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {table.PE}
                      </Typography>
                    </div>
                  </td>
                  <td className="p-4 border-b border-blue-gray-50">
                    <div className="flex flex-col">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {table.PP}
                      </Typography>
                    </div>
                  </td>
                  <td className="p-4 border-b border-blue-gray-50">
                    <div className="flex flex-col">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {table.GF}
                      </Typography>
                    </div>
                  </td>
                  <td className="p-4 border-b border-blue-gray-50">
                    <div className="flex flex-col">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {table.GC}
                      </Typography>
                    </div>
                  </td>
                  {/*  <td className="p-4 border-b border-blue-gray-50">
                    <Tooltip content="Edit User">
                      <Button
                        onClick={() => handleEdit(table.id)}
                        variant="text"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                    </Tooltip>
                    <Tooltip content="Delet User">
                      <Button
                        onClick={() => handleDelete(table.id)}
                        variant="text"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </Tooltip>
                  </td> */}
                </tr>
              ))}
          </tbody>
        </table>
      </CardBody>
      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
        <Typography variant="small" color="blue-gray" className="font-normal">
          {`Equipos totales ${table.length}`}
        </Typography>
        <div className="flex gap-2">
          <Button variant="outlined" size="sm">
            Previous
          </Button>
          <Button variant="outlined" size="sm">
            Next
          </Button>
        </div>
      </CardFooter>
      <MatchManagement></MatchManagement>
    </Card>
  );
};

export default UserManagement;
