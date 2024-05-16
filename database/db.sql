CREATE TABLE Equipos (
    idEquipo INTEGER PRIMARY KEY AUTO_INCREMENT,
    nombreEquipo VARCHAR(200) NOT NULL,
    grupoEquipo VARCHAR(300),
    puntos INTEGER DEFAULT 0,
    partidosJugados INTEGER DEFAULT 0,
    partidosGanados INTEGER DEFAULT 0,
    partidosEmpatados INTEGER DEFAULT 0,
    partidosPerdidos INTEGER DEFAULT 0,
    golesFavor INTEGER DEFAULT 0,
    golesContra INTEGER DEFAULT 0,
    createAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE Partidos (
    idPartido INTEGER PRIMARY KEY AUTO_INCREMENT,
    equipoLocal VARCHAR(200) NOT NULL,
    equipoVisitante VARCHAR(200) NOT NULL,
    resultadoLocal INTEGER DEFAULT 0,
    resultadoVisitante INTEGER DEFAULT 0,
    fechaPartido DATE NOT NULL,
    grupoPartido VARCHAR(300),
    createAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE Participacion (
    idParticipacion INTEGER PRIMARY KEY AUTO_INCREMENT,
    idPartido INTEGER,
    idEquipo INTEGER,
    local BOOLEAN,
    FOREIGN KEY (idPartido) REFERENCES Partidos(idPartido),
    FOREIGN KEY (idEquipo) REFERENCES Equipos(idEquipo),
    UNIQUE (idPartido, idEquipo),
    createAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE Usuarios (
    idUsuario INTEGER PRIMARY KEY AUTO_INCREMENT,
    nombreUsuario VARCHAR(200) NOT NULL,
    correo VARCHAR(200) NOT NULL UNIQUE,
    createAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    
);

