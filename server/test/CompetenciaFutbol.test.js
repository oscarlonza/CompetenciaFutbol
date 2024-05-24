import request from 'supertest';
import { expect as _expect } from 'chai';

import { app } from '../index.js';

const expect = _expect;

const mockTeamSeed = Date.now();
const mockTeamName = `Equipo ${mockTeamSeed}`;
const mockGroupName = `Grupo ${mockTeamSeed}`;
let mockTeamId = -1;

describe('Get /', () => {
    it('Expected result 404', () => {
        request(app)
            .get('/')
            .end((err, res) => {
                expect(res.status).to.equal(404);
            });
    });
});

describe('Pruebas de creación de Equipo > Post /api/equipo', () => {
    it('Error porque falta el nombre de equipo', () => {
        const equipoData = { nombreEquipo: '', grupoEquipo: 'Grupo 1', };

        request(app)
            .post('/api/equipo')
            .send(equipoData)
            .end((err, res) => {
                expect(res.status).to.equal(400);
                const { message } = JSON.parse(res.text);
                expect(message).to.equal("Se requieren nombre del equipo y grupo del equipo");
            });
    });

    it('Error porque falta el nombre de grupo', () => {
        const equipoData = { nombreEquipo: 'Equipo 1', grupoEquipo: '', };

        request(app)
            .post('/api/equipo')
            .send(equipoData)
            .end((err, res) => {
                expect(res.status).to.equal(400);
                const { message } = JSON.parse(res.text);
                expect(message).to.equal("Se requieren nombre del equipo y grupo del equipo");
            });
    });

    it('Error porque faltan ambos, nombre de equipo y nombre de grupo', () => {
        const equipoData = { nombreEquipo: '', grupoEquipo: '', };

        request(app)
            .post('/api/equipo')
            .send(equipoData)
            .end((err, res) => {
                expect(res.status).to.equal(400);
                const { message } = JSON.parse(res.text);
                expect(message).to.equal("Se requieren nombre del equipo y grupo del equipo");
            });
    });

    it(`Creación de equipo "${mockTeamName}" de grupo ${mockGroupName} `, () => {
        const equipoData = { nombreEquipo: mockTeamName, grupoEquipo: mockGroupName, };

        request(app)
            .post('/api/equipo')
            .send(equipoData)
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.text).to.contains(mockTeamName);
                expect(res.text).to.contains(mockGroupName);
            });
    });
});

describe('Pruebas lista de Equipos > Get /api/data', () => {

    it('Se espera resultado de lista de equipos', () => {
        request(app)
            .get('/api/data')
            .end((err, res) => {
                const { status, text } = res;
                expect(status).to.equal(200);
                expect(Array.isArray(JSON.parse(text))).to.equal(true);
            });
    });

    it(`Se espera resultado de lista de equipos y contiene el equipo ${mockTeamName}`, () => {
        request(app)
            .get('/api/data')
            .end((err, res) => {
                const { status, text } = res;
                expect(status).to.equal(200);
                expect(text).to.contains(mockTeamName);
                expect(text).to.contains(mockGroupName);
                const list = JSON.parse(text);
                expect(Array.isArray(list)).to.equal(true);
                const team = list.find(x => x.nombreEquipo === mockTeamName && x.grupoEquipo === mockGroupName);
                console.log(`>> TeamDBInfo ${JSON.stringify(team)}`);
                if (team == null)
                    throw expect(`The ${mockTeamName} was not found`);
                console.log(`>> TeamId ${team.idEquipo}`);
                mockTeamId = team.idEquipo;
            });
    });
});

describe('Pruebas Obtener equipo por Id > Get /api/posiciones/:id', () => {

    it('Error porque el id no existe', () => {
        request(app)
            .get(`/api/posiciones/-1`)
            .end((err, res) => {
                expect(res.status).to.equal(404);
                const { message } = JSON.parse(res.text);
                expect(message).to.equal("Equipo no encontrado");
            });
    });

    it(`Se espera resultado con equipo de id ${mockTeamId}`, () => {
        request(app)
            .get(`/api/posiciones/${mockTeamId}`)
            .end((err, res) => {
                const { status, text } = res;
                expect(status).to.equal(200);
                const team = JSON.parse(text);
                if (team == null)
                    throw exception(`The team ${mockTeamId} was not found`);
                expect(team.idEquipo).to.equal(mockTeamId);
                expect(team.nombreEquipo).to.equal(mockTeamName);
                expect(team.grupoEquipo).to.equal(mockGroupName);
            });
    });
});

describe('Pruebas de edición de Equipo > Put /api/equipo/:id', () => {

    it('Error porque falta el nombre de equipo', () => {
        const equipoData = { nombreEquipo: '', grupoEquipo: mockGroupName };

        request(app)
            .put(`/api/equipo/${mockTeamId}`)
            .send(equipoData)
            .end((err, res) => {
                expect(res.status).to.equal(400);
                const { message } = JSON.parse(res.text);
                expect(message).to.equal("Se requieren nombre del equipo o grupo a actualizar");
            });
    });

    it('Error porque falta el nombre de grupo', () => {
        const equipoData = { nombreEquipo: mockTeamName, grupoEquipo: '' };

        request(app)
            .put(`/api/equipo/${mockTeamId}`)
            .send(equipoData)
            .end((err, res) => {
                expect(res.status).to.equal(400);
                const { message } = JSON.parse(res.text);
                expect(message).to.equal("Se requieren nombre del equipo o grupo a actualizar");
            });
    });

    it('Error porque faltan ambos, nombre de equipo y nombre de grupo', () => {
        const equipoData = { nombreEquipo: '', grupoEquipo: '', };

        request(app)
            .put(`/api/equipo/${mockTeamId}`)
            .send(equipoData)
            .end((err, res) => {
                expect(res.status).to.equal(400);
                const { message } = JSON.parse(res.text);
                expect(message).to.equal("Se requieren nombre del equipo o grupo a actualizar");
            });
    });

    it(`Modificar el equipo ${mockTeamId} de nombre "${mockTeamName}" en grupo ${mockGroupName} `, () => {
        const equipoData = { nombreEquipo: `${mockTeamName} Editado`, grupoEquipo: `${mockGroupName} Editado`, };

        request(app)
            .put(`/api/equipo/${mockTeamId}`)
            .send(equipoData)
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(JSON.parse(res.text).message).to.equal("Equipo actualizado correctamente");
            });

        request(app)
            .get(`/api/posiciones/${mockTeamId}`)
            .end((err, res) => {
                const { status, text } = res;
                expect(status).to.equal(200);
                const team = JSON.parse(text);
                if (team == null)
                    throw exception(`The team ${mockTeamId} was not found`);
                expect(team.idEquipo).to.equal(mockTeamId);
                expect(team.nombreEquipo).to.equal(equipoData.nombreEquipo);
                expect(team.grupoEquipo).to.equal(equipoData.grupoEquipo);
            });
    });
});

describe('Pruebas Eliminar equipo > Delete /api/equipo/:id', () => {

    it(`Se espera Eliminar equipo con id ${mockTeamId}`, () => {
        request(app)
            .delete(`/api/equipo/${mockTeamId}`)
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(JSON.parse(res.text).message).to.equal("Equipo eliminado correctamente");
                                
            });
    });
    
    it(`Error porque el equipo con id ${mockTeamId} fue eliminado`, () => {
        request(app)
            .get(`/api/posiciones/${mockTeamId}`)
            .end((err, res) => {
                expect(res.status).to.equal(404);
                const { message } = JSON.parse(res.text);
                expect(message).to.equal("Equipo no encontrado");
            });
    });
});

/*
// Rutas para los equipos

// Rutas para los partidos
router.get("/api/partidos", getPartidos);
router.post("/api/partidos", createPartido);
router.delete("/api/partidos/:id", deletePartido);
router.put("/api/partidos/:id", updatePartido);
router.get("/api/participaciones", getParticipaciones);
router.get("/api/tabla-posiciones", getTablaPosiciones);*/


