import React, { useState } from "react";
import axios from "axios";
import { Button } from "@material-tailwind/react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const UserForm = ({ onUserAdded, fetchTable }) => {
  const [nombreEquipo, setNombreEquipo] = useState("");
  const [grupoEquipo, setGrupoEquipo] = useState("");
  const MySwal = withReactContent(Swal);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:4000/api/equipo", { nombreEquipo, grupoEquipo })
      .then((response) => {
        console.log("Equipo created successfully:", response.data);
        onUserAdded();
        setNombreEquipo("");
        setGrupoEquipo("");
        fetchTable();

        MySwal.fire({
          position: "top-end",
          icon: "success",
          title: "Equipo creado correctamente",
          showConfirmButton: false,
          timer: 2000,
        });
      })
      .catch((error) => {
        console.error("Error creating equipo:", error);

        MySwal.fire({
          position: "top-end",
          icon: "error",
          title: "Oops...",
          text: "Error al crear elequipo",
          showConfirmButton: false,
          timer: 3000,
        });
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nombre equipo"
        value={nombreEquipo}
        onChange={(e) => setNombreEquipo(e.target.value)}
        className="border border-gray-300 rounded-md p-2 mb-2"
      />
      <input
        type="text"
        placeholder="Grupo Equipo"
        value={grupoEquipo}
        onChange={(e) => setGrupoEquipo(e.target.value)}
        className="border border-gray-300 rounded-md p-2 mb-2"
      />

      <Button className="mx-2" type="submit" variant="gradient">
        Crear equipo
      </Button>
    </form>
  );
};

export default UserForm;
