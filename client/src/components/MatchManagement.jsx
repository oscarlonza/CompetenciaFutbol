import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Button,
} from "@material-tailwind/react";

const TABLE_HEAD = [
  "ID Partido",
  "Equipo Local",
  "Equipo Visitante",
  "Resultado Local",
  "Resultado Visitante",
  "Fecha Partido",
];

const MatchManagement = () => {
  const [matches, setMatches] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = () => {
    axios
      .get("http://localhost:4000/api/partidos")
      .then((response) => {
        setMatches(response.data);
        fetchMatches();
      })
      .catch((error) => {
        console.error("Error fetching Matches:", error);
      });
  };

  return (
    <Card className="h-full w-full justify-center ">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-8 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray">
              Lista de Partidos
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              Se muestra toda la información de los partidos
            </Typography>
          </div>
          <div className="w-full md:w-72">
            <Input
              onChange={(e) => setSearchTerm(e.target.value)}
              label="Buscar"
            />
          </div>
        </div>
      </CardHeader>
      <CardBody className="overflow-scroll px-0">
        <table className="mt-4 w-full min-w-max table-auto text-center ">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50 "
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matches
              .filter(
                (match) =>
                  match.equipoLocal
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                  match.equipoVisitante
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
              )
              .map((match) => (
                <tr key={match.idPartido}>
                  <td className="p-4 border-b border-blue-gray-50">
                    {match.idPartido}
                  </td>
                  <td className="p-4 border-b border-blue-gray-50">
                    {match.equipoLocal}
                  </td>
                  <td className="p-4 border-b border-blue-gray-50">
                    {match.equipoVisitante}
                  </td>
                  <td className="p-4 border-b border-blue-gray-50">
                    {match.resultadoLocal}
                  </td>
                  <td className="p-4 border-b border-blue-gray-50">
                    {match.resultadoVisitante}
                  </td>
                  <td className="p-4 border-b border-blue-gray-50">
                    {new Date(match.fechaPartido).toLocaleDateString()}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </CardBody>
      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
        <Typography variant="small" color="blue-gray" className="font-normal">
          Total de partidos: {matches.length}
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
    </Card>
  );
};

export default MatchManagement;
