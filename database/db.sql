CREATE TABLE CompetenciaFutbol (
    idEquipo INTEGER PRIMARY KEY AUTO_INCREMENT,
    nombreEquipo VARCHAR(200) NOT NULL,
    grupoEquipo VARCHAR(300),
    idPartido INTEGER NOT NULL,
    equipoLocal VARCHAR(300),
    equipoVisitante VARCHAR(300),
    resultadoLocal INTEGER,
    resultadoVisitante INTEGER,
    posicion INTEGER,
    partidosJugados INTEGER,
    partidosGanados INTEGER,
    partidosPerdidos INTEGER,
    golesFavor INTEGER,
    golesContra INTEGER,
    createAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
