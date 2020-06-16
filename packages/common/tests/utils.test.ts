import { Procedure, Method, CommonUtils as utils } from '../src';

describe('Common utils', () => {
    @Procedure()
    class TestProcedure {

        @Method('test')
        public method() { }
    }

    const procedure = new TestProcedure();


    it('isProcedure util', () => {
        expect(utils.isProcedure(TestProcedure)).toBeTruthy();
    });

    it('isMethod util', () => {
        expect(utils.isProcedure(TestProcedure)).toBeTruthy();
        expect(utils.isMethod(procedure.method)).toBeTruthy();
    });

    it('Normal response transform', () => {
        const shouldBe = { jsonrpc: '2.0', result: { foo: 'bar' }, id: 1 };
        const response = utils.JsonRPCNormalResponseTransform({ foo: 'bar'}, 1);

        expect(response).toMatchObject(shouldBe);
    });

    it('Error response transform', () => {
        const shouldBe = { jsonrpc: '2.0', error: { code: -32601, message: 'Method not found' }, id: 1 };
        const response = utils.JsonRPCErrorResponseTransform({ code: -32601, message: 'Method not found' }, 1);

        expect(response).toMatchObject(shouldBe);
    })
})
