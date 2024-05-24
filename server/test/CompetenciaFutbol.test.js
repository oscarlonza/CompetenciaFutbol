import request from 'supertest';
import { expect as _expect } from 'chai';

import { app } from '../index.js';

const expect = _expect;

const mockTeamSeed = Date.now();
const mockTeamName = `Equipo ${mockTeamSeed}`;
const mockGroupName = `Grupo ${mockTeamSeed}`;

describe('Get /', () => {
    it('Expected result 404', () => {
        request(app)
            .get('/')
            .end((err, res) => {
                expect(res.status).to.equal(404);
            });
    });
});

describe('Pruebas de creación de Equipo', () => {
    it('Error porque falta el nombre de equipo', () => {
        const equipoData = { nombreEquipo: '', grupoEquipo: 'Grupo 1', };

        request(app)
            .post('/api/equipo')
            .send(equipoData)
            .end((err, res) => {
                expect(res.status).to.equal(400);
                const {message} = JSON.parse(res.text);
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
                const {message} = JSON.parse(res.text);
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
                const {message} = JSON.parse(res.text);
                expect(message).to.equal("Se requieren nombre del equipo y grupo del equipo");
            });
    });

    it(`Creación de equipo "${mockTeamName}" de grupo ${mockGroupName} `, () => {
        const equipoData = { nombreEquipo: mockTeamName, grupoEquipo: mockGroupName, };

        request(app)
            .post('/api/equipo')
            .send(equipoData)
            .end((err, res) => {
                expect(res.status).to.equal(201);
                expect(res.text).to.contains(mockTeamName);
                expect(res.text).to.contains(mockGroupName);
            });
    });
})

describe('Prueba de Equipos ', () => {
    
    it('Se espera resultado de lista de equipos > Get /api/data', () => {
        request(app)
            .get('/api/data')
            .end((err, res) => {
                const { status, text } = res;
                expect(status).to.equal(200);
                //expect(text).to.contains(mockTeamName);
                expect(Array.isArray(JSON.parse(text))).to.equal(true);
            });
    });
});


/*
// Rutas para los equipos
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
router.get("/api/tabla-posiciones", getTablaPosiciones);*/


