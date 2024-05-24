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

async function getNewMatchValidated(equipoLocal, equipoVisitante, resultadoLocal, resultadoVisitante, useValidation = true) {

    const getResult = await request(app)
        .get('/api/partidos');

    if (useValidation)
        expect(getResult.status).to.equal(200);
    let listMatches = JSON.parse(getResult.text);
    if (useValidation)
        expect(Array.isArray(listMatches)).to.equal(true);

    let idPartido = listMatches.length == 0 ? 0 : Math.max(...listMatches.map(o => o.idPartido));

    const getLocalTeam = await getNewTeamValidated({ nombreEquipo: equipoLocal.nombreEquipo, grupoEquipo: equipoLocal.grupoEquipo }, useValidation);
    const getQuestTeam = await getNewTeamValidated({ nombreEquipo: equipoVisitante.nombreEquipo, grupoEquipo: equipoVisitante.grupoEquipo }, useValidation);

    const mockMatch = {
        idPartido: (idPartido + 1),
        equipoLocal: getLocalTeam.nombreEquipo,
        equipoVisitante: getQuestTeam.nombreEquipo,
        resultadoLocal: resultadoLocal,
        resultadoVisitante: resultadoVisitante,
        fechaPartido: moment().format(),
    };

    const postResult = await request(app)
        .post(`/api/partidos`)
        .send(mockMatch);

    if (useValidation) {
        expect(postResult.status).to.equal(200);
        expect(JSON.parse(postResult.text).message).to.equal("Partido y participaciones creadas correctamente");
    }
    const res = await request(app)
        .get('/api/partidos');

    const { status, text } = res;
    if (useValidation)
        expect(status).to.equal(200);
    listMatches = JSON.parse(text);
    if (useValidation)
        expect(Array.isArray(listMatches)).to.equal(true);

    const match = listMatches.find(x => x.idPartido === mockMatch.idPartido);
    if (useValidation) {
        expect(match).to.not.equal(null);
        expect(match.equipoLocal).to.equal(mockMatch.equipoLocal);
        expect(match.equipoVisitante).to.equal(mockMatch.equipoVisitante);
        expect(match.resultadoLocal).to.equal(mockMatch.resultadoLocal);
        expect(match.resultadoVisitante).to.equal(mockMatch.resultadoVisitante);
        expect(match.fechaPartido.Day).to.equal(mockMatch.fechaPartido.Day);
        expect(match.fechaPartido.Month).to.equal(mockMatch.fechaPartido.Month);
        expect(match.fechaPartido.Year).to.equal(mockMatch.fechaPartido.Year);
    }

    return match;
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

describe('Pruebas lista de Partidos > Get /api/partidos', () => {

    it('Se espera resultado de lista de equipos', async function () {

        const res = await request(app)
            .get('/api/partidos');

        const { status, text } = res;
        expect(status).to.equal(200);
        expect(Array.isArray(JSON.parse(text))).to.equal(true);
    });

    it(`Se agrega partido Envigado 3 vs 5 Junior y se espera que esté contendido en lista de partidos`, async function () {

        const result = await getNewMatchValidated({ nombreEquipo: "Envigado", grupoEquipo: "A" }, { nombreEquipo: "Junior", grupoEquipo: "A" }, 3, 5);

    });
});

describe('Pruebas de edición de Partido > Put /api/partidos/:id', () => {


    it('Error porque falta la fecha de partido', async function () {
        const lastMatchAdded = await getNewMatchValidated({ nombreEquipo: 'Santa Fe', grupoEquipo: 'A' }, { nombreEquipo: 'Junior', grupoEquipo: 'A' }, 1, 2, true);
        const matchData = { grupoPartido: 'A' };

        const res = await request(app)
            .put(`/api/partidos/${lastMatchAdded.idPartido}`)
            .send(matchData);

        expect(res.status).to.equal(400);
        const { message } = JSON.parse(res.text);
        expect(message).to.equal("Todos los campos son requeridos para actualizar un partido");
    });

    it('Error porque falta el grupo del partido', async function () {
        const lastMatchAdded = await getNewMatchValidated({ nombreEquipo: 'Santa Fe', grupoEquipo: 'A' }, { nombreEquipo: 'Junior', grupoEquipo: 'A' }, 2, 1, true);
        const matchData = { fechaPartido: moment().format() };

        const res = await request(app)
            .put(`/api/partidos/${lastMatchAdded.idPartido}`)
            .send(matchData);

        expect(res.status).to.equal(400);
        const { message } = JSON.parse(res.text);
        expect(message).to.equal("Todos los campos son requeridos para actualizar un partido");
    });

    it('Error porque faltan ambos, fehca de partido y grupo de partido', async function () {
        const lastMatchAdded = await getNewMatchValidated({ nombreEquipo: 'Santa Fe', grupoEquipo: 'A' }, { nombreEquipo: 'Junior', grupoEquipo: 'A' }, 2, 2, true);
        const matchData = {};

        const res = await request(app)
            .put(`/api/partidos/${lastMatchAdded.idPartido}`)
            .send(matchData);

        expect(res.status).to.equal(400);
        const { message } = JSON.parse(res.text);
        expect(message).to.equal("Todos los campos son requeridos para actualizar un partido");

    });

    it(`Modificar un partido correctamente`, async function () {

        const lastMatchAdded = await getNewMatchValidated({ nombreEquipo: 'Santa Fe', grupoEquipo: 'A' }, { nombreEquipo: 'Junior', grupoEquipo: 'A' }, 0, 0, true);
        const matchData = { fechaPartido: moment().format(), grupoPartido: 'A' };

        const putResult = await request(app)
            .put(`/api/partidos/${lastMatchAdded.idPartido}`)
            .send(matchData);

        expect(putResult.status).to.equal(200);
        expect(JSON.parse(putResult.text).message).to.equal("Partido actualizado correctamente");

        const res = await request(app)
            .get('/api/partidos');

        const { status, text } = res;
        expect(status).to.equal(200);
        const listMatches = JSON.parse(text);
        expect(Array.isArray(listMatches)).to.equal(true);

        const match = listMatches.find(x => x.idPartido === lastMatchAdded.idPartido);
        expect(match).to.not.equal(null);
        expect(match.grupoPartido).to.equal(matchData.grupoPartido);
        expect(match.fechaPartido.Day).to.equal(matchData.fechaPartido.Day);
        expect(match.fechaPartido.Month).to.equal(matchData.fechaPartido.Month);
        expect(match.fechaPartido.Year).to.equal(matchData.fechaPartido.Year);

    });

});

describe('Pruebas Eliminar partido > Delete /api/partidos/:id', () => {

    it(`Se espera Eliminar un partido`, async function () {
        const lastMatchAdded = await getNewMatchValidated(
            await getNewTeamValidated(),
            await getNewTeamValidated(), 8, 2, true);

        const res = await request(app)
            .delete(`/api/partidos/${lastMatchAdded.idPartido}`);

        expect(res.status).to.equal(200);
        expect(JSON.parse(res.text).message).to.equal("Partido eliminado correctamente");
    });

    it(`Error al buscar un partido que ya no existe`, async function () {
        const lastMatchAdded = await getNewMatchValidated(
            await getNewTeamValidated(),
            await getNewTeamValidated(), 8, 2, true);

        const deleteResult = await request(app)
            .delete(`/api/partidos/${lastMatchAdded.idPartido}`);

        expect(deleteResult.status).to.equal(200);
        expect(JSON.parse(deleteResult.text).message).to.equal("Partido eliminado correctamente");

        const res = await request(app)
            .get('/api/partidos');

        const { status, text } = res;
        expect(status).to.equal(200);
        listMatches = JSON.parse(text);
        expect(Array.isArray(listMatches)).to.equal(true);

        const match = listMatches.find(x => x.idPartido === lastMatchAdded.idPartido);
        expect(match).to.equal(null);
    });

});

describe('Pruebas lista de participaciones > Get /api/participaciones', () => {
    it('Se espera resultado de lista de participaciones', async function () {

        const res = await request(app)
            .get('/api/participaciones');

        expect(res.status).to.equal(200);
        const list = JSON.parse(res.text);
        expect(Array.isArray(list)).to.equal(true);
    });
});

describe('Pruebas de la tabla de posiciones > Get /api/tabla-posiciones', () => {
    //Estructura de resultado de la tabla de posiciones
    //{nombreEquipo, grupoEquipo, puntos, pj, pg, pp, pe, gf, gc}

    it('Se crea 1 partido entre dos nuevos equipos y el resultado es una victoria para el local (8-2)', async function () {

        const localTeam = await getNewTeamValidated();
        const guestTeam = await getNewTeamValidated();

        const lastMatchAdded = await getNewMatchValidated(localTeam, guestTeam, 8, 2, true);

        console.log(`Match created ${lastMatchAdded.idPartido} > ${lastMatchAdded.equipoLocal} (${lastMatchAdded.resultadoLocal}) VS (${lastMatchAdded.resultadoVisitante}) ${lastMatchAdded.equipoVisitante} `);

        const res = await request(app)
            .get('/api/tabla-posiciones');

        expect(res.status).to.equal(200);
        const table = JSON.parse(res.text);
        const localTable = table.find(x => x.nombreEquipo == localTeam.nombreEquipo);

        expect(localTable).to.not.equal(null);
        expect(localTable.puntos, 'Puntos de equipo local').to.equal('3');
        expect(localTable.PJ, 'Partidos jugados de equipo local').to.equal(1);
        expect(localTable.PG, 'Partidos ganados de equipo local').to.equal('1');
        expect(localTable.PP, 'Partidos perdidos de equipo local').to.equal('0');
        expect(localTable.PE, 'Partidos empatados de equipo local').to.equal('0');
        expect(localTable.GF, 'Goles a favor de equipo local').to.equal('8');
        expect(localTable.GC, 'Goles en contra de equipo local').to.equal('2');

        const guestTable = table.find(x => x.nombreEquipo == guestTeam.nombreEquipo);
        expect(guestTable).to.not.equal(null);
        expect(guestTable.puntos, 'Puntos de equpo visitante').to.equal('0');
        expect(guestTable.PJ, 'Partidos jugados de equpo visitante').to.equal(1);
        expect(guestTable.PG, 'Partidos ganados de equpo visitante').to.equal('0');
        expect(guestTable.PP, 'Partidos perdidos de equpo visitante').to.equal('1');
        expect(guestTable.PE, 'Partidos empatados de equpo visitante').to.equal('0');
        expect(guestTable.GF, 'Goles a favor de equipo visitante').to.equal('2');
        expect(guestTable.GC, 'Goles en contra de equipo visitante').to.equal('8');

    });

    it('Se crea 1 partido entre dos nuevos equipos y el resultado es una victoria para el visitante (3-5)', async function () {
        const localTeam = await getNewTeamValidated();
        const guestTeam = await getNewTeamValidated();

        const lastMatchAdded = await getNewMatchValidated(localTeam, guestTeam, 3, 5, true);

        console.log(`Match created ${lastMatchAdded.idPartido} > ${lastMatchAdded.equipoLocal} (${lastMatchAdded.resultadoLocal}) VS (${lastMatchAdded.resultadoVisitante}) ${lastMatchAdded.equipoVisitante} `);

        const res = await request(app)
            .get('/api/tabla-posiciones');

        expect(res.status).to.equal(200);
        const table = JSON.parse(res.text);
        const localTable = table.find(x => x.nombreEquipo == localTeam.nombreEquipo);
        expect(localTable).to.not.equal(null);
        expect(localTable.puntos, 'Puntos de equipo local').to.equal('0');
        expect(localTable.PJ, 'Partidos jugados de equipo local').to.equal(1);
        expect(localTable.PG, 'Partidos ganados de equipo local').to.equal('0');
        expect(localTable.PP, 'Partidos perdidos de equipo local').to.equal('1');
        expect(localTable.PE, 'Partidos empatados de equipo local').to.equal('0');
        expect(localTable.GF, 'Goles a favor de equipo local').to.equal('3');
        expect(localTable.GC, 'Goles en contra de equipo local').to.equal('5');

        const guestTable = table.find(x => x.nombreEquipo == guestTeam.nombreEquipo);
        expect(guestTable).to.not.equal(null);
        expect(guestTable.puntos, 'Puntos de equpo visitante').to.equal('3');
        expect(guestTable.PJ, 'Partidos jugados de equpo visitante').to.equal(1);
        expect(guestTable.PG, 'Partidos ganados de equpo visitante').to.equal('1');
        expect(guestTable.PP, 'Partidos perdidos de equpo visitante').to.equal('0');
        expect(guestTable.PE, 'Partidos empatados de equpo visitante').to.equal('0');
        expect(guestTable.GF, 'Goles a favor de equipo visitante').to.equal('5');
        expect(guestTable.GC, 'Goles en contra de equipo visitante').to.equal('3');
    });

    it('Se crea 1 partido entre dos nuevos equipos y el resultado es un empate (2-2)', async function () {
        const localTeam = await getNewTeamValidated();
        const guestTeam = await getNewTeamValidated();

        const lastMatchAdded = await getNewMatchValidated(localTeam, guestTeam, 2, 2, true);

        console.log(`Match created ${lastMatchAdded.idPartido} > ${lastMatchAdded.equipoLocal} (${lastMatchAdded.resultadoLocal}) VS (${lastMatchAdded.resultadoVisitante}) ${lastMatchAdded.equipoVisitante} `);

        const res = await request(app)
            .get('/api/tabla-posiciones');

        expect(res.status).to.equal(200);
        const table = JSON.parse(res.text);
        const localTable = table.find(x => x.nombreEquipo == localTeam.nombreEquipo);
        expect(localTable).to.not.equal(null);
        expect(localTable.puntos, 'Puntos de equipo local').to.equal('1');
        expect(localTable.PJ, 'Partidos jugados de equipo local').to.equal(1);
        expect(localTable.PG, 'Partidos ganados de equipo local').to.equal('0');
        expect(localTable.PP, 'Partidos perdidos de equipo local').to.equal('0');
        expect(localTable.PE, 'Partidos empatados de equipo local').to.equal('1');
        expect(localTable.GF, 'Goles a favor de equipo local').to.equal('2');
        expect(localTable.GC, 'Goles en contra de equipo local').to.equal('2');

        const guestTable = table.find(x => x.nombreEquipo == guestTeam.nombreEquipo);
        expect(guestTable).to.not.equal(null);
        expect(guestTable.puntos, 'Puntos de equpo visitante').to.equal('1');
        expect(guestTable.PJ, 'Partidos jugados de equpo visitante').to.equal(1);
        expect(guestTable.PG, 'Partidos ganados de equpo visitante').to.equal('0');
        expect(guestTable.PP, 'Partidos perdidos de equpo visitante').to.equal('0');
        expect(guestTable.PE, 'Partidos empatados de equpo visitante').to.equal('1');
        expect(guestTable.GF, 'Goles a favor de equipo visitante').to.equal('2');
        expect(guestTable.GC, 'Goles en contra de equipo visitante').to.equal('2');
    });

    const localTeamName = `Chelsea ${Date.now()}`;
    const guestTeamName = `Arsenal ${Date.now()}`;
    it(`Se crean 10 partidos entre dos nuevos equipos, ${localTeamName} y ${guestTeamName}, todos los partidos los gana Chelsea y en todos los partidos quedan (4-3)`, async function () {
        const localTeam = await getNewTeamValidated({ nombreEquipo: localTeamName, grupoEquipo: 'B' });
        const guestTeam = await getNewTeamValidated({ nombreEquipo: guestTeamName, grupoEquipo: 'B' });

        let matches = [];
        const totalMatches = 10;
        for (let i = 0; i < totalMatches; i++) {
            const lastMatchAdded = await getNewMatchValidated(localTeam, guestTeam, 4, 3, true);
            console.log(`Match created ${lastMatchAdded.idPartido} > ${lastMatchAdded.equipoLocal} (${lastMatchAdded.resultadoLocal}) VS (${lastMatchAdded.resultadoVisitante}) ${lastMatchAdded.equipoVisitante} `);        
            
            matches.push(lastMatchAdded);
        }
        
        const res = await request(app)
            .get('/api/tabla-posiciones');

        expect(res.status).to.equal(200);
        const table = JSON.parse(res.text);
        const localTable = table.find(x => x.nombreEquipo == localTeam.nombreEquipo);
        expect(localTable).to.not.equal(null);
        expect(localTable.puntos, 'Puntos de equipo local').to.equal((3*totalMatches).toString());
        expect(localTable.PJ, 'Partidos jugados de equipo local').to.equal(totalMatches);
        expect(localTable.PG, 'Partidos ganados de equipo local').to.equal(totalMatches.toString());
        expect(localTable.PP, 'Partidos perdidos de equipo local').to.equal('0');
        expect(localTable.PE, 'Partidos empatados de equipo local').to.equal('0');
        expect(localTable.GF, 'Goles a favor de equipo local').to.equal((4*totalMatches).toString());
        expect(localTable.GC, 'Goles en contra de equipo local').to.equal((3*totalMatches).toString());

        const guestTable = table.find(x => x.nombreEquipo == guestTeam.nombreEquipo);
        expect(guestTable).to.not.equal(null);
        expect(guestTable.puntos, 'Puntos de equpo visitante').to.equal('0');
        expect(guestTable.PJ, 'Partidos jugados de equpo visitante').to.equal(totalMatches);
        expect(guestTable.PG, 'Partidos ganados de equpo visitante').to.equal('0');
        expect(guestTable.PP, 'Partidos perdidos de equpo visitante').to.equal(totalMatches.toString());
        expect(guestTable.PE, 'Partidos empatados de equpo visitante').to.equal('0');
        expect(guestTable.GF, 'Goles a favor de equipo visitante').to.equal((3*totalMatches).toString());
        expect(guestTable.GC, 'Goles en contra de equipo visitante').to.equal((4*totalMatches).toString());
    });
});

/*
// Rutas para los equipos

// Rutas para los partidos
router.get("/api/tabla-posiciones", getTablaPosiciones);*/


