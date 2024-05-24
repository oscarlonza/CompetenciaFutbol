import request from 'supertest';
import { expect as _expect } from 'chai';

import { app } from '../index.js';

const expect = _expect;

describe('Get /', () => {
    it('Expected result 404', () => {
        request(app)
            .get('/')
            .end((err, res) => {
                expect(res.status).to.equal(404);
            });
    });
});

describe('Prueba de Equipos ', () => {
    it('Se espera resultado de lista de equipos > Get /api/data', () => {
        request(app)
            .get('/api/data')
            .end((err, res) => {
                expect(res.status).to.equal(200);
                console.log(JSON.stringify(res));
            });
    });
    
});

