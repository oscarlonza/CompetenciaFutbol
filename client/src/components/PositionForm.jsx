import React, { useState } from "react";
import axios from "axios";
import {
  Dialog,
  Button,
  Card,
  CardBody,
  CardFooter,
} from "@material-tailwind/react";

const UserForm = ({ onUserAdded, fetchTable, isOpen, onClose }) => {
  const [numeroPartido, setNumeroPartido] = useState("");
  const [equipoLocal, setEquipoLocal] = useState("");
  const [equipoVisitante, setEquipoVisitante] = useState("");
  const [resultadoLocal, setResultadoLocal] = useState("");
  const [resultadoVisitante, setResultadoVisitante] = useState("");
  const [fechaPartido, setFechaPartido] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const partidoData = {
      idPartido: numeroPartido ? numeroPartido : null,
      equipoLocal,
      equipoVisitante,
      resultadoLocal: parseInt(resultadoLocal),
      resultadoVisitante: parseInt(resultadoVisitante),
      fechaPartido,
    };

    axios
      .post("http://localhost:4000/api/partidos", partidoData)
      .then((response) => {
        console.log("Partido creado exitosamente:", response.data);
        onUserAdded();
        resetForm();
        fetchTable();
        onClose();
      })
      .catch((error) => {
        console.error("Error al crear el partido:", error);
        alert("Error al crear el partido");
      });
  };

  const resetForm = () => {
    setNumeroPartido("");
    setEquipoLocal("");
    setEquipoVisitante("");
    setResultadoLocal("");
    setResultadoVisitante("");
    setFechaPartido("");
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
          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <label
                htmlFor="numeroPartido"
                className="text-sm font-medium text-gray-700"
              >
                Número del Partido
              </label>
              <input
                type="text"
                id="numeroPartido"
                value={numeroPartido}
                onChange={(e) => setNumeroPartido(e.target.value)}
                className="border border-gray-300 rounded-md p-2 w-full"
              />
            </div>
            <input
              type="text"
              placeholder="Equipo Local"
              value={equipoLocal}
              onChange={(e) => setEquipoLocal(e.target.value)}
              className="border border-gray-300 rounded-md p-2 mb-2 w-full"
            />
            <input
              type="text"
              placeholder="Equipo Visitante"
              value={equipoVisitante}
              onChange={(e) => setEquipoVisitante(e.target.value)}
              className="border border-gray-300 rounded-md p-2 mb-2 w-full"
            />
            <input
              type="number"
              placeholder="Resultado Local"
              value={resultadoLocal}
              onChange={(e) => setResultadoLocal(e.target.value)}
              className="border border-gray-300 rounded-md p-2 mb-2 w-full"
            />
            <input
              type="number"
              placeholder="Resultado Visitante"
              value={resultadoVisitante}
              onChange={(e) => setResultadoVisitante(e.target.value)}
              className="border border-gray-300 rounded-md p-2 mb-2 w-full"
            />
            <input
              type="date"
              placeholder="Fecha del Partido"
              value={fechaPartido}
              onChange={(e) => setFechaPartido(e.target.value)}
              className="border border-gray-300 rounded-md p-2 mb-2 w-full"
            />
          </form>
        </CardBody>

        <CardFooter className="pt-0 flex justify-between">
          <Button variant="gradient" onClick={handleSubmit}>
            Crear
          </Button>
          <Button variant="outlined" onClick={onClose}>
            Cancelar
          </Button>
        </CardFooter>
      </Card>
    </Dialog>
  );
};

export default UserForm;
