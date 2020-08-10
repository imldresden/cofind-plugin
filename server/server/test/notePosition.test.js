const assert = require('assert');
const expect = require('chai').expect;
const chaiAssert = require('chai').assert;
const request = require('supertest');
const app = require('../index');

let reqNotePos;
let notePosId;

before(function () {
    let val = Math.floor(Math.random() * (1000000000000 - 0 + 1) + 0);
    reqNotePos =
        {
            startElementOffsetOfSameType: 123451,
            startElementType: 'test-startElementType',
            startElementInnerOffset: 123452,
            startElementInnerText: 'test-startElementInnerText',
            endElementOffsetOfSameType: 123453,
            endElementType: 'test-endElementType',
            endElementInnerOffset: 123454,
            endElementInnerText: 'test-endElementInnerText'
        };
})

describe('Unit testing the /note-positions route', function () {

    it('POST: /note-positions', function () {
        return request(app)
            .post('/note-positions')
            .send(reqNotePos)
            .expect('Content-Type', /json/)
            .then(function (response) {
                chaiAssert.isObject(response.body);
                notePosId = response.body._id;
            })
    });

    it('GET: /note-positions', function () {
        return request(app)
            .get('/note-positions')
            .expect('Content-Type', /json/)
            .then(function (response) {
                chaiAssert.isArray(response.body);
            });
    });

    it('GET: /note-positions/:__id', function () {
        return request(app)
            .get(`/note-positions/${notePosId}`)
            .expect('Content-Type', /json/)
            .then(function (response) {
                chaiAssert.isObject(response.body);
                assert(response.body._id, notePosId);
            });
    });

});
