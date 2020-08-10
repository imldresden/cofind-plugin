const assert = require('assert');
const expect = require('chai').expect;
const chaiAssert = require('chai').assert;
const request = require('supertest');
const app = require('../index');

let reqDevice;
let deviceId;

before(function () {
    let val = Math.floor(Math.random() * (1000000000000 - 0 + 1) + 0);
    reqDevice =
        {
            name: 'ThinkPad T450s',
            mac: `ICHBINEINEMAC${val}`
        };
})

describe('Unit testing the /devices route', function () {

    it('POST: /devices', function () {
        return request(app)
            .post('/devices')
            .send(reqDevice)
            .expect('Content-Type', /json/)
            .then(function (response) {
                chaiAssert.isObject(response.body);
                deviceId = response.body._id;
            })
    });

    it('GET: /devices', function () {
        return request(app)
            .get('/devices')
            .expect('Content-Type', /json/)
            .then(function (response) {
                chaiAssert.isArray(response.body);
            });
    });

    it('GET: /devices/:__id', function () {
        return request(app)
            .get(`/devices/${deviceId}`)
            .expect('Content-Type', /json/)
            .then(function (response) {
                chaiAssert.isObject(response.body);
                assert(response.body._id, deviceId);
            });
    });

});
