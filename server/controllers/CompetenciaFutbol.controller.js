import { pool } from "../db.js";

export const getData = async (req, res) => {
  try {
    const [result] = await pool.query(
      "SELECT * FROM Equipos ORDER BY createAt ASC"
    );
    res.json(result);
  } catch (error) {
    console.error("Error al obtener equipos:", error);
    res.status(500).json({ message: "Error al obtener equipos" });
  }
};

export const getEquipoById = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query(
      "SELECT * FROM Equipos WHERE idEquipo = ?",
      [id]
    );
    if (result.length === 0) {
      return res.status(404).json({ message: "Equipo no encontrado" });
    }
    res.json(result[0]);
  } catch (error) {
    console.error("Error al obtener equipo por ID:", error);
    res.status(500).json({ message: "Error al obtener equipo por ID" });
  }
};

export const createEquipo = async (req, res) => {
  try {
    const { nombreEquipo, grupoEquipo } = req.body;

    if (!nombreEquipo || !grupoEquipo) {
      return res
        .status(400)
        .json({ message: "Se requieren nombre del equipo y grupo del equipo" });
    }
    const [result] = await pool.query(
      "INSERT INTO Equipos(nombreEquipo, grupoEquipo) VALUES (?, ?)",
      [nombreEquipo, grupoEquipo]
    );
    res.json({
      nombreEquipo,
      grupoEquipo,
    });
  } catch (error) {
    console.error("Error al crear equipo:", error);
    res.status(500).json({ message: "Error al crear equipo" });
  }
};

export const deleteEquipo = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM Equipos WHERE idEquipo = ?", [id]);
    res.json({ message: "Equipo eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar equipo:", error);
    res.status(500).json({ message: "Error al eliminar equipo" });
  }
};

export const updateEquipo = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombreEquipo, grupoEquipo } = req.body;

    if (!nombreEquipo || !grupoEquipo) {
      return res.status(400).json({
        message: "Se requieren nombre del equipo o grupo a actualizar",
      });
    }
    await pool.query(
      "UPDATE Equipos SET nombreEquipo = ?, grupoEquipo = ? WHERE idEquipo = ?",
      [nombreEquipo, grupoEquipo, id]
    );
    res.json({ message: "Equipo actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar equipo:", error);
    res.status(500).json({ message: "Error al actualizar equipo" });
  }
};

export const getPartidos = async (req, res) => {
  try {
    const [result] = await pool.query(
      "SELECT * FROM Partidos ORDER BY fechaPartido ASC"
    );
    res.json(result);
  } catch (error) {
    console.error("Error al obtener partidos:", error);
    res.status(500).json({ message: "Error al obtener partidos" });
  }
};

export const createPartido = async (req, res) => {
  try {
    const {
      idPartido,
      equipoLocal,
      equipoVisitante,
      resultadoLocal,
      resultadoVisitante,
      fechaPartido,
    } = req.body;

    // Convertir los resultados a números enteros
    const resultadoLocalInt = parseInt(resultadoLocal);
    const resultadoVisitanteInt = parseInt(resultadoVisitante);

    if (
      !idPartido ||
      !equipoLocal ||
      !equipoVisitante ||
      isNaN(resultadoLocalInt) || // Verificar si es un número válido
      isNaN(resultadoVisitanteInt) || // Verificar si es un número válido
      !fechaPartido
    ) {
      return res.status(400).json({
        message:
          "Todos los campos son requeridos y los resultados deben ser números enteros",
      });
    }

    // Obtener los identificadores de equipo
    const [equipoLocalRow] = await pool.query(
      "SELECT idEquipo FROM Equipos WHERE nombreEquipo = ?",
      [equipoLocal]
    );
    const [equipoVisitanteRow] = await pool.query(
      "SELECT idEquipo FROM Equipos WHERE nombreEquipo = ?",
      [equipoVisitante]
    );

    const idEquipoLocal = equipoLocalRow[0].idEquipo;
    const idEquipoVisitante = equipoVisitanteRow[0].idEquipo;

    // Insertar el partido
    await pool.query(
      "INSERT INTO Partidos(idPartido, equipoLocal, equipoVisitante, resultadoLocal, resultadoVisitante, fechaPartido) VALUES (?,?,?,?,?,?)",
      [
        idPartido,
        equipoLocal,
        equipoVisitante,
        resultadoLocalInt,
        resultadoVisitanteInt,
        fechaPartido,
      ]
    );

    // Insertar las participaciones para el equipo local y visitante
    await pool.query(
      "INSERT INTO Participacion(idPartido, idEquipo, local) VALUES (?, ?, ?), (?, ?, ?)",
      [
        idPartido,
        idEquipoLocal,
        true, // Marcar como local
        idPartido,
        idEquipoVisitante,
        false, // Marcar como visitante
      ]
    );

    res.json({ message: "Partido y participaciones creadas correctamente" });
  } catch (error) {
    console.error("Error al crear partido:", error);
    res.status(500).json({ message: "Error al crear partido" });
  }
};

export const updatePartido = async (req, res) => {
  try {
    const { id } = req.params;
    const { fechaPartido, grupoPartido } = req.body;

    if (!fechaPartido || !grupoPartido) {
      return res.status(400).json({
        message: "Todos los campos son requeridos para actualizar un partido",
      });
    }

    // Actualizar el partido
    await pool.query(
      "UPDATE Partidos SET fechaPartido = ?, grupoPartido = ? WHERE idPartido = ?",
      [fechaPartido, grupoPartido, id]
    );

    res.json({ message: "Partido actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar partido:", error);
    res.status(500).json({ message: "Error al actualizar partido" });
  }
};

export const deletePartido = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM Partidos WHERE idPartido = ?", [id]);
    res.json({ message: "Partido eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar partido:", error);
    res.status(500).json({ message: "Error al eliminar partido" });
  }
};

export const getParticipaciones = async (req, res) => {
  try {
    const [result] = await pool.query("SELECT * FROM Participacion");
    res.json(result);
  } catch (error) {
    console.error("Error al obtener participaciones:", error);
    res.status(500).json({ message: "Error al obtener participaciones" });
  }
};

export const getTablaPosiciones = async (req, res) => {
  try {
    const query = `
      SELECT 
          Equipos.nombreEquipo, 
          Equipos.grupoEquipo, 
          SUM(CASE WHEN Participacion.local AND Partidos.resultadoLocal > Partidos.resultadoVisitante THEN 3 
                   WHEN Participacion.local AND Partidos.resultadoLocal = Partidos.resultadoVisitante THEN 1 
                   WHEN NOT Participacion.local AND Partidos.resultadoVisitante > Partidos.resultadoLocal THEN 3
                   WHEN NOT Participacion.local AND Partidos.resultadoVisitante = Partidos.resultadoLocal THEN 1 
                   ELSE 0 END) AS puntos,
          COUNT(*) AS PJ,
          SUM(CASE WHEN Participacion.local THEN 1 ELSE 0 END) AS PG,
          SUM(CASE WHEN NOT Participacion.local THEN 1 ELSE 0 END) AS PP,
          SUM(CASE WHEN Participacion.local AND Partidos.resultadoLocal = Partidos.resultadoVisitante THEN 1 
                   WHEN NOT Participacion.local AND Partidos.resultadoVisitante = Partidos.resultadoLocal THEN 1 
                   ELSE 0 END) AS PE,
          SUM(CASE WHEN Participacion.local THEN Partidos.resultadoLocal ELSE Partidos.resultadoVisitante END) AS GF,
          SUM(CASE WHEN Participacion.local THEN Partidos.resultadoVisitante ELSE Partidos.resultadoLocal END) AS GC
      FROM 
          Participacion
      JOIN Equipos ON Participacion.idEquipo = Equipos.idEquipo
      JOIN Partidos ON Participacion.idPartido = Partidos.idPartido
      WHERE
          Partidos.idPartido IS NOT NULL
          AND Equipos.nombreEquipo IS NOT NULL AND Equipos.nombreEquipo <> ''
      GROUP BY 
          Equipos.nombreEquipo, Equipos.grupoEquipo
      ORDER BY 
          Equipos.grupoEquipo, puntos DESC, GF DESC;
    `;
    const [result] = await pool.query(query);
    res.json(result);
  } catch (error) {
    console.error("Error al obtener tabla de posiciones:", error);
    res.status(500).json({ message: "Error al obtener tabla de posiciones" });
  }
};
