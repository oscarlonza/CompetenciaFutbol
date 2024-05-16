import { Router } from "express";
import {
  getData,
  getEquipoById,
  createEquipo,
  deleteEquipo,
  updateEquipo,
  getPartidos,
  createPartido,
  deletePartido,
  updatePartido,
  getTablaPosiciones,
  getParticipaciones,
} from "../controllers/CompetenciaFutbol.controller.js";

const router = Router();

// Rutas para los equipos
router.get("/api/data", getData);
router.get("/api/posiciones/:id", getEquipoById);
router.post("/api/equipo", createEquipo);
router.delete("/api/equipo/:id", deleteEquipo);
router.put("/api/equipo/:id", updateEquipo);

// Rutas para los partidos
router.get("/api/partidos", getPartidos);
router.post("/api/partidos", createPartido);
router.delete("/api/partidos/:id", deletePartido);
router.put("/api/partidos/:id", updatePartido);
router.get("/api/participaciones", getParticipaciones);
router.get("/api/tabla-posiciones", getTablaPosiciones);

export default router;
