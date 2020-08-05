import { Procedure, Method, utils } from '../src';

describe('Utils', () => {
    @Procedure('fake')
    class Fake {

        @Method('test')
        public method() { }
    }

    const fakeInstance = new Fake();

    it('isProcedure util', () => {
        expect(utils.isProcedure(Fake)).toBeTruthy();
    });

    it('isMethod util', () => {
        expect(utils.isProcedure(Fake)).toBeTruthy();
        expect(utils.isMethod(fakeInstance.method)).toBeTruthy();
    });

    it('Success response transform', () => {
        const shouldBe = { jsonrpc: '2.0', result: { foo: 'bar' }, id: 1 };
        const response = utils.SuccessResponseTransform({ foo: 'bar'}, 1);

        expect(response).toMatchObject(shouldBe);
    });

    it('Error response transform', () => {
        const shouldBe = { jsonrpc: '2.0', error: { code: -32601, message: 'Method not found' }, id: 1 };
        const response = utils.ErrorResponseTransform({ code: -32601, message: 'Method not found' }, 1);

        expect(response).toMatchObject(shouldBe);
    });

    it('Response sanitizer', () => {
        const testCase1 = utils.sanitizeResponse('', '');
        const testCase2 = utils.sanitizeResponse(['', ''], '');
        const testCase3 = utils.sanitizeResponse(['', { a: 2 }], '');
        expect(testCase1).toBeFalsy();
        expect(testCase2).toBeFalsy();
        expect(testCase3).toEqual([{ a: 2 }]);
    });
})
