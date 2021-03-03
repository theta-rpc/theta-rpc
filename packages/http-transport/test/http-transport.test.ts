import axios from 'axios';
import { assert } from 'chai';
import express from 'express';
import sinon from 'sinon';
import { ThetaTransport } from '@theta-rpc/transport';
import { HTTPTransport } from '../src';
import { HTTPTransportContext } from '../src/http.transport-context';

function makeRequest() {
  return axios.post('http://localhost:1024', { test: true }, { headers: { 'Content-Type': 'application/json' }})
}

describe('HTTP transport', () => {
  const transport = new HTTPTransport({ port: 1024, cors: { origin: '*' } });
  const fakeCb = sinon.stub();
  transport.onRequest(fakeCb);

  before( async () => {
    await transport.start();
  });

  it('should be a subclass of ThetaTransport', () => {
    assert.instanceOf(transport, ThetaTransport);
  });

  it('should respond to the request with correct headers', async () => {
    fakeCb.callsFake(async(data: Buffer, transportContext: HTTPTransportContext) => {
      await transport.reply(data.toString(), transportContext);
    })

    const response = await makeRequest();
    assert.instanceOf(fakeCb.args[0][0], Buffer);
    assert.instanceOf(fakeCb.args[0][1], HTTPTransportContext);
    assert.equal(response.status, 200);
    assert.deepEqual(response.data, { test: true });
    assert.propertyVal(response.headers, 'content-type', 'application/json; charset=utf-8');
    // Cors
    assert.propertyVal(response.headers, 'access-control-allow-origin', '*');
  });

  it('should close the connection with status code 204 when response data is null', async () => {
    fakeCb.callsFake(async(data: Buffer, transportContext: HTTPTransportContext) => {
      await transport.reply(null, transportContext);
    })

    const response = await makeRequest();
    assert.instanceOf(fakeCb.args[0][0], Buffer);
    assert.instanceOf(fakeCb.args[0][1], HTTPTransportContext);
    assert.equal(response.status, 204);
    assert.propertyVal(response.headers, 'connection', 'close')
  });


  it('custom express instance', async () => {
    const expressApp = express();
    expressApp.get('/route', (req, res) => {
      res.send('ok');
    });

    const transport2 = new HTTPTransport({ express: expressApp, port: 1025 });
    await transport2.start();
    const response = await axios.get('http://localhost:1025/route');
    assert.equal(response.status, 200);
    assert.equal(response.data, 'ok');
    await transport2.stop();
  });

  after( async () => {
    await transport.stop();
  });

});
