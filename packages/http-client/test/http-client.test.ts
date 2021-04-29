import axios from "axios";
import { assert } from "chai";
import http from "http";
import sinon from "sinon";
import { JSONRPCException } from "@theta-rpc/json-rpc";
import { HTTPClient } from "../src";

function collectBody(req: http.IncomingMessage) {
  return new Promise((resolve) => {
    let data: any = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      resolve(data);
    });
  });
}

describe("HTTP client", () => {
  const fakeReqHandler = sinon.stub();
  const server = http.createServer(fakeReqHandler);
  const client = new HTTPClient("http://localhost:1024/");

  before((cb) => {
    server.listen(1024, cb);
  });

  afterEach(() => {
    sinon.reset();
  });

  it("attach()", async () => {
    const client2 = HTTPClient.attach(
      axios.create({ baseURL: "http://localhost:1024/" })
    );
    let incomingMsg: any;
    fakeReqHandler.callsFake(async (req, res) => {
      incomingMsg = await collectBody(req);
      res.setHeader("content-type", "application/json");
      res.end('{"jsonrpc": "2.0", "result": "test", "id": 1}');
    });

    const result = await client2.call("test");
    assert.equal(fakeReqHandler.called, true);
    assert.equal(incomingMsg, '{"jsonrpc":"2.0","method":"test","id":1}');
    assert.equal(result, "test");
  });

  describe("call()", () => {
    it("should call a method", async () => {
      let incomingMsg: any;
      fakeReqHandler.callsFake(async (req, res) => {
        incomingMsg = await collectBody(req);
        res.setHeader("content-type", "application/json");
        res.end('{"jsonrpc": "2.0", "result": "test", "id": 1}');
      });

      const result = await client.call("test", { foo: "bar" });
      assert.equal(fakeReqHandler.called, true);
      assert.equal(
        incomingMsg,
        '{"jsonrpc":"2.0","method":"test","params":{"foo":"bar"},"id":1}'
      );
      assert.equal(result, "test");
    });

    it('should throw "JSONRPCException" when the server returns an error response', async () => {
      let incomingMsg: any;
      fakeReqHandler.callsFake(async (req, res) => {
        incomingMsg = await collectBody(req);
        res.setHeader("content-type", "application/json");
        res.end(
          '{"jsonrpc": "2.0", "error": {"code": -32600, "message": "Invalid Request"}, "id": 1}'
        );
      });

      let result;
      try {
        result = await client.call("test");
      } catch (e) {
        assert.instanceOf(e, JSONRPCException);
      } finally {
        if (result) assert.fail("should throw an error");
      }
      assert.isTrue(fakeReqHandler.called);
      assert.equal(incomingMsg, '{"jsonrpc":"2.0","method":"test","id":1}');
    });
  });

  describe("notify()", () => {
    it("should send a notification request", async () => {
      let incomingMsg: any;
      fakeReqHandler.callsFake(async (req, res) => {
        incomingMsg = await collectBody(req);
        res.setHeader("content-type", "application/json");
        res.end();
      });

      const result = await client.notify("test", { foo: "bar" });
      assert.isTrue(fakeReqHandler.called);
      assert.equal(
        incomingMsg,
        '{"jsonrpc":"2.0","method":"test","params":{"foo":"bar"}}'
      );
      assert.isUndefined(result);
    });
  });

  describe("batch()", () => {
    it("should send a batch request", async () => {
      let incomingMsg: any;
      fakeReqHandler.callsFake(async (req, res) => {
        incomingMsg = await collectBody(req);
        res.setHeader("content-type", "application/json");
        res.end('[{"jsonrpc": "2.0", "result": "test1", "id": 1 }]');
      });

      const result = await client.batch([
        { method: "test_method1", params: { foo: "bar" } },
        { method: "test_method2", notify: true },
      ]);
      assert.isTrue(fakeReqHandler.called);
      assert.equal(
        incomingMsg,
        '[{"jsonrpc":"2.0","method":"test_method1","params":{"foo":"bar"},"id":1},{"jsonrpc":"2.0","method":"test_method2"}]'
      );
      assert.deepEqual(result, [{ result: "test1" }]);
    });

    it("when the server returns an error response", async () => {
      let incomingMsg: any;
      fakeReqHandler.callsFake(async (req, res) => {
        incomingMsg = await collectBody(req);
        res.setHeader("content-type", "application/json");
        res.end(
          '[{"jsonrpc": "2.0", "result": "test1", "id": 1 }, {"jsonrpc": "2.0", "error": {"code": -32600, "message": "Invalid Request"}, "id": 2 }]'
        );
      });

      const result = await client.batch([
        { method: "test_method1", params: { foo: "bar" } },
        { method: "test_method2" },
      ]);
      assert.isTrue(fakeReqHandler.called);
      assert.equal(
        incomingMsg,
        '[{"jsonrpc":"2.0","method":"test_method1","params":{"foo":"bar"},"id":1},{"jsonrpc":"2.0","method":"test_method2","id":2}]'
      );
      assert.deepEqual(result, [
        { result: "test1" },
        { error: { code: -32600, message: "Invalid Request" } },
      ]);
    });
  });

  it("setHeader()", async () => {
    let incomingMsg: any;
    let headers: any;
    fakeReqHandler.callsFake(async (req, res) => {
      incomingMsg = await collectBody(req);
      headers = req.headers;
      res.setHeader("content-type", "application/json");
      res.end('{"jsonrpc": "2.0", "result": "Test", "id": 1}');
    });

    const result = await client.setHeader("myheader", "123").call("test");
    assert.isTrue(fakeReqHandler.called);
    assert.equal(incomingMsg, '{"jsonrpc":"2.0","method":"test","id":1}');
    assert.equal(result, "Test");
    assert.propertyVal(headers, "myheader", "123");
  });

  it("ping()", async () => {
    let incomingMsg: any;
    fakeReqHandler.callsFake(async (req, res) => {
      incomingMsg = await collectBody(req);
      res.setHeader("content-type", "application/json");
      res.end('{"jsonrpc": "2.0", "result": "pong", "id": 1}');
    });

    const result = await client.ping();
    assert.isTrue(fakeReqHandler.called);
    assert.equal(incomingMsg, '{"jsonrpc":"2.0","method":"rpc.ping","id":1}');
    assert.equal(result, "pong");
  });

  describe("proxify()", () => {
    it("should call a method", async () => {
      let incomingMsg: any;
      fakeReqHandler.callsFake(async (req, res) => {
        incomingMsg = await collectBody(req);
        res.setHeader("content-type", "application/json");
        res.end('{"jsonrpc": "2.0", "result": "Test", "id": 1}');
      });

      const result = await client.proxify().test_method(1, 2, 3);
      assert.isTrue(fakeReqHandler.called);
      assert.equal(
        incomingMsg,
        '{"jsonrpc":"2.0","method":"test_method","params":[1,2,3],"id":1}'
      );
      assert.equal(result, "Test");
    });

    it("when the type of the method is not a string", async () => {
      let result;
      try {
        result = await client.proxify()[Symbol("test")]();
      } catch (e) {
        assert.instanceOf(e, Error);
      } finally {
        if (result) assert.fail("should throw an error");
      }
    });
  });

  after((cb) => {
    server.close(cb);
  });
});
