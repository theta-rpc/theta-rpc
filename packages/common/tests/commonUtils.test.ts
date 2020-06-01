import { Procedure, Method, CommonUtils } from '../src';

describe('CommonUtils', () => {
    @Procedure()
    class TestProcedure {

        @Method('test')
        public method() { }
    }

    const procedure = new TestProcedure();


    it('isProcedure function', () => {
        expect(CommonUtils.isProcedure(TestProcedure)).toBeTruthy();
    });

    it('isMethod function', () => {
        expect(CommonUtils.isProcedure(TestProcedure)).toBeTruthy();
        expect(CommonUtils.isMethod(procedure.method)).toBeTruthy();
    });
})