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
  Avatar,
} from "@material-tailwind/react";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import ImageIcon from "../../public/919510.png";
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
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [matchesPerPage] = useState(10);
  const MySwal = withReactContent(Swal);
  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = () => {
    axios
      .get("http://localhost:4000/api/partidos")
      .then((response) => {
        setMatches(response.data);
      })
      .catch((error) => {
        console.error("Error fetching Matches:", error);
      });
  };

  const indexOfLastMatch = currentPage * matchesPerPage;
  const indexOfFirstMatch = indexOfLastMatch - matchesPerPage;
  const currentMatches = matches.slice(indexOfFirstMatch, indexOfLastMatch);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const filterByDate = () => {
    if (!startDate || !endDate) {
      MySwal.fire({
        position: "top-end",
        icon: "warning",
        title: "Por favor, seleccione las fechas",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

    const filteredMatches = matches.filter((match) => {
      const matchDate = new Date(match.fechaPartido);
      return matchDate >= new Date(startDate) && matchDate <= new Date(endDate);
    });

    setMatches(filteredMatches);
    setCurrentPage(1); // Reset page to 1 after filtering
  };

  const clearFilter = () => {
    setStartDate("");
    setEndDate("");
    fetchMatches(); // Reload all matches
  };

  return (
    <Card className="h-full w-full justify-center">
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
          <div className="w-full md:w-1/2 flex flex-col gap-4 mt-10 ">
            <Input
              onChange={(e) => setSearchTerm(e.target.value)}
              label="Buscar"
            />
            <div className="flex w-full gap-4">
              <Input
                type="date"
                label="Desde"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <Input
                type="date"
                label="Hasta"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="flex justify-between">
              <Button onClick={filterByDate}>Filtrar por fecha</Button>
              <Button onClick={clearFilter}>Borrar filtro</Button>
            </div>
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
            {currentMatches
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
                    <div className="flex items-center gap-3">
                      <Avatar src={ImageIcon} size="sm" />
                      {match.equipoLocal}
                    </div>
                  </td>
                  <td className="p-4 border-b border-blue-gray-50">
                    <div className="flex items-center gap-3">
                      <Avatar src={ImageIcon} size="sm" />
                      {match.equipoVisitante}
                    </div>
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
          <Button
            variant="outlined"
            size="sm"
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          <Button
            variant="outlined"
            size="sm"
            onClick={() => paginate(currentPage + 1)}
            disabled={indexOfLastMatch >= matches.length}
          >
            Siguiente
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MatchManagement;
