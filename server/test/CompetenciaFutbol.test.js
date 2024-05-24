import request from 'supertest';
import { expect as _expect } from 'chai';
import moment from 'moment';

import { app } from '../index.js';

const expect = _expect;

const getMockTeam = () => {
    const mockTeamSeed = Date.now();
    const mockTeamName = `Equipo ${mockTeamSeed}`;
    const mockGroupName = `Grupo ${mockTeamSeed}`;
    return { nombreEquipo: mockTeamName, grupoEquipo: mockGroupName };
}

async function getNewTeamValidated(equipoData, useValidation = true) {

    if (equipoData == null) equipoData = getMockTeam();

    const postResult = await request(app)
        .post('/api/equipo')
        .send(equipoData);

    if (useValidation)
        expect(postResult.status).to.equal(200);

    const res = await request(app)
        .get('/api/data');

    const { status, text } = res;
    if (useValidation) {
        expect(status).to.equal(200);
        expect(text).to.contains(equipoData.nombreEquipo);
        expect(text).to.contains(equipoData.grupoEquipo);
    }
    const list = JSON.parse(text);
    if (useValidation)
        expect(Array.isArray(list)).to.equal(true);
    const team = list.find(x => x.nombreEquipo === equipoData.nombreEquipo && x.grupoEquipo === equipoData.grupoEquipo);
    if (useValidation)
        expect(team).to.not.equal(null);

    return team;
}

describe('Get /', () => {
    it('Expected result 404', async function () {
        const res = await request(app)
            .get('/');

        expect(res.status).to.equal(404);
    });
});

describe('Pruebas de creación de Equipo > Post /api/equipo', () => {

    it('Error porque falta el nombre de equipo', async function () {
        const equipoData = { nombreEquipo: '', grupoEquipo: 'Grupo 1', };

        const res = await request(app)
            .post('/api/equipo')
            .send(equipoData);

        expect(res.status).to.equal(400);
        const { message } = JSON.parse(res.text);
        expect(message).to.equal("Se requieren nombre del equipo y grupo del equipo");
    });

    it('Error porque falta el nombre de grupo', async function () {
        const equipoData = { nombreEquipo: 'Equipo 1', grupoEquipo: '', };

        const res = await request(app)
            .post('/api/equipo')
            .send(equipoData)

        expect(res.status).to.equal(400);
        const { message } = JSON.parse(res.text);
        expect(message).to.equal("Se requieren nombre del equipo y grupo del equipo");
    });

    it('Error porque faltan ambos, nombre de equipo y nombre de grupo', async function () {
        const equipoData = { nombreEquipo: '', grupoEquipo: '', };

        const res = await request(app)
            .post('/api/equipo')
            .send(equipoData)

        expect(res.status).to.equal(400);
        const { message } = JSON.parse(res.text);
        expect(message).to.equal("Se requieren nombre del equipo y grupo del equipo");

    });

    const equipoData = getMockTeam();
    it(`Creación de equipo "${equipoData.nombreEquipo}" de grupo ${equipoData.grupoEquipo} `, async function () {

        const res = await request(app)
            .post('/api/equipo')
            .send(equipoData);

        expect(res.status).to.equal(200);
        expect(res.text).to.contains(equipoData.nombreEquipo);
        expect(res.text).to.contains(equipoData.grupoEquipo);
    });
});

describe('Pruebas lista de Equipos > Get /api/data', () => {

    it('Se espera resultado de lista de equipos', async function () {

        const res = await request(app)
            .get('/api/data');

        const { status, text } = res;
        expect(status).to.equal(200);
        expect(Array.isArray(JSON.parse(text))).to.equal(true);
    });

    const equipoData = getMockTeam();

    it(`Se espera resultado de lista de equipos y contiene el equipo ${equipoData.nombreEquipo}`, async function () {

        const result = await getNewTeamValidated(equipoData);

    });
});

describe('Pruebas Obtener equipo por Id > Get /api/posiciones/:id', () => {

    it('Error porque el id no existe', async function () {

        const res = await request(app)
            .get(`/api/posiciones/-1`);

        expect(res.status).to.equal(404);
        const { message } = JSON.parse(res.text);
        expect(message).to.equal("Equipo no encontrado");
    });


    let equipoData = getMockTeam();

    it(`Se espera resultado con equipo para ${equipoData.nombreEquipo} `, async function () {

        const teamFromList = await getNewTeamValidated(equipoData);

        const res = await request(app)
            .get(`/api/posiciones/${teamFromList.idEquipo}`);

        const { status, text } = res;
        expect(status).to.equal(200);
        const team = JSON.parse(text);

        if (team == null) throw exception(`The team ${equipoData.nombreEquipo} was not found`);

        expect(team.idEquipo).to.equal(teamFromList.idEquipo);
        expect(team.nombreEquipo).to.equal(equipoData.nombreEquipo);
        expect(team.grupoEquipo).to.equal(equipoData.grupoEquipo);

    });
});

describe('Pruebas de edición de Equipo > Put /api/equipo/:id', () => {

    it('Error porque falta el nombre de equipo', async function () {
        const lastTeamAdded = await getNewTeamValidated(null, false);
        const equipoData = { nombreEquipo: '', grupoEquipo: lastTeamAdded.grupoEquipo };

        const res = await request(app)
            .put(`/api/equipo/${lastTeamAdded.idEquipo}`)
            .send(equipoData);

        expect(res.status).to.equal(400);
        const { message } = JSON.parse(res.text);
        expect(message).to.equal("Se requieren nombre del equipo o grupo a actualizar");
    });

    it('Error porque falta el nombre de grupo', async function () {
        const lastTeamAdded = await getNewTeamValidated(null, false);
        const equipoData = { nombreEquipo: lastTeamAdded.nombreEquipo, grupoEquipo: '' };

        const res = await request(app)
            .put(`/api/equipo/${lastTeamAdded.idEquipo}`)
            .send(equipoData);

        expect(res.status).to.equal(400);
        const { message } = JSON.parse(res.text);
        expect(message).to.equal("Se requieren nombre del equipo o grupo a actualizar");
    });

    it('Error porque faltan ambos, nombre de equipo y nombre de grupo', async function () {

        const lastTeamAdded = await getNewTeamValidated(null, false);
        const equipoData = { nombreEquipo: '', grupoEquipo: '', };

        const res = await request(app)
            .put(`/api/equipo/${lastTeamAdded.idEquipo}`)
            .send(equipoData);

        expect(res.status).to.equal(400);
        const { message } = JSON.parse(res.text);
        expect(message).to.equal("Se requieren nombre del equipo o grupo a actualizar");

    });

    it(`Modificar un equipo correctamente`, async function () {

        const lastTeamAdded = await getNewTeamValidated();
        const equipoData = { nombreEquipo: `${lastTeamAdded.nombreEquipo} Editado`, grupoEquipo: `${lastTeamAdded.grupoEquipo} Editado`, };

        const putResult = await request(app)
            .put(`/api/equipo/${lastTeamAdded.idEquipo}`)
            .send(equipoData);

        expect(putResult.status).to.equal(200);
        expect(JSON.parse(putResult.text).message).to.equal("Equipo actualizado correctamente");

        const getResult = await request(app)
            .get(`/api/posiciones/${lastTeamAdded.idEquipo}`);

        const { status, text } = getResult;
        expect(status).to.equal(200);
        const team = JSON.parse(text);
        expect(team).to.not.equal(null);
        expect(team.idEquipo).to.equal(lastTeamAdded.idEquipo);
        expect(team.nombreEquipo).to.equal(equipoData.nombreEquipo);
        expect(team.grupoEquipo).to.equal(equipoData.grupoEquipo);

    });

});

describe('Pruebas Eliminar equipo > Delete /api/equipo/:id', () => {

    it(`Se espera Eliminar un equipo`, async function () {
        const mockTeam = await getNewTeamValidated();

        const res = await request(app)
            .delete(`/api/equipo/${mockTeam.idEquipo}`);

        expect(res.status).to.equal(200);
        expect(JSON.parse(res.text).message).to.equal("Equipo eliminado correctamente");
    });

    it(`Error al buscar un equipo que ya no existe`, async function () {
        const mockTeam = await getNewTeamValidated();

        const deleteResult = await request(app)
            .delete(`/api/equipo/${mockTeam.idEquipo}`);

        expect(deleteResult.status).to.equal(200);
        expect(JSON.parse(deleteResult.text).message).to.equal("Equipo eliminado correctamente");

        const res = await request(app)
            .get(`/api/posiciones/${mockTeam.idEquipo}`);

        expect(res.status).to.equal(404);
        const { message } = JSON.parse(res.text);
        expect(message).to.equal("Equipo no encontrado");
    });

});

describe('Pruebas de creación de partido > Post /api/partidos', () => {

    const errorMessage = "Todos los campos son requeridos y los resultados deben ser números enteros";
    it(`Error al crear partido sin Id`, async function () {
        const mockMatch = {
            equipoLocal: "Junior",
            equipoVisitante: "Nacional",
            resultadoLocal: 4,
            resultadoVisitante: 2,
            fechaPartido: Date.now(),
        };

        const res = await request(app)
            .post(`/api/partidos`)
            .send(mockMatch);

        expect(res.status).to.equal(400);
        expect(JSON.parse(res.text).message).to.equal(errorMessage);
    });

    it(`Error al crear partido sin equipo local`, async function () {
        const mockMatch = {
            idPartido: 1,
            equipoVisitante: "Nacional",
            resultadoLocal: 4,
            resultadoVisitante: 2,
            fechaPartido: Date.now(),
        };

        const res = await request(app)
            .post(`/api/partidos`)
            .send(mockMatch);

        expect(res.status).to.equal(400);
        expect(JSON.parse(res.text).message).to.equal(errorMessage);
    });

    it(`Error al crear partido sin equipo visitante`, async function () {
        const mockMatch = {
            idPartido: 1,
            equipoLocal: "Junior",
            resultadoLocal: 4,
            resultadoVisitante: 2,
            fechaPartido: Date.now(),
        };

        const res = await request(app)
            .post(`/api/partidos`)
            .send(mockMatch);

        expect(res.status).to.equal(400);
        expect(JSON.parse(res.text).message).to.equal(errorMessage);
    });

    it(`Error al crear partido sin resultado local`, async function () {
        const mockMatch = {
            idPartido: 1,
            equipoLocal: "Junior",
            equipoVisitante: "Nacional",
            resultadoVisitante: 2,
            fechaPartido: Date.now(),
        };

        const res = await request(app)
            .post(`/api/partidos`)
            .send(mockMatch);

        expect(res.status).to.equal(400);
        expect(JSON.parse(res.text).message).to.equal(errorMessage);
    });

    it(`Error al crear partido sin resultado visitante`, async function () {
        const mockMatch = {
            idPartido: 1,
            equipoLocal: "Junior",
            equipoVisitante: "Nacional",
            resultadoLocal: 4,
            fechaPartido: Date.now(),
        };

        const res = await request(app)
            .post(`/api/partidos`)
            .send(mockMatch);

        expect(res.status).to.equal(400);
        expect(JSON.parse(res.text).message).to.equal(errorMessage);
    });

    it(`Error al crear partido sin fecha de partido`, async function () {
        const mockMatch = {
            idPartido: 1,
            equipoLocal: "Junior",
            equipoVisitante: "Nacional",
            resultadoLocal: 4,
            resultadoVisitante: 2,
        };

        const res = await request(app)
            .post(`/api/partidos`)
            .send(mockMatch);

        expect(res.status).to.equal(400);
        expect(JSON.parse(res.text).message).to.equal(errorMessage);
    });

    it(`Creación de partido Junior 4 vs 2 Nacional`, async function () {

        const getResult = await request(app)
            .get('/api/partidos');

        expect(getResult.status).to.equal(200);
        const listMatches = JSON.parse(getResult.text);
        expect(Array.isArray(listMatches)).to.equal(true);
        let idPartido = listMatches.length == 0 ? 0 : Math.max(...listMatches.map(o => o.idPartido));
        const juniorTeam = await getNewTeamValidated({ nombreEquipo: "Junior", grupoEquipo: "A" }, true);
        const nacionalTeam = await getNewTeamValidated({ nombreEquipo: "Nacional", grupoEquipo: "A" }, true);
        
        const mockMatch = {
            idPartido: (idPartido + 1),
            equipoLocal: juniorTeam.nombreEquipo,
            equipoVisitante: nacionalTeam.nombreEquipo,
            resultadoLocal: 4,
            resultadoVisitante: 2,
            fechaPartido: moment().format(),
        };

        const res = await request(app)
            .post(`/api/partidos`)
            .send(mockMatch);
        
        expect(res.status).to.equal(200);
        expect(JSON.parse(res.text).message).to.equal("Partido y participaciones creadas correctamente");
    });

});



/*
// Rutas para los equipos

// Rutas para los partidos
router.get("/api/partidos", getPartidos);
router.delete("/api/partidos/:id", deletePartido);
router.put("/api/partidos/:id", updatePartido);
router.get("/api/participaciones", getParticipaciones);
router.get("/api/tabla-posiciones", getTablaPosiciones);*/


