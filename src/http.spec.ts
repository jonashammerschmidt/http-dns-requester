import { HttpRequester } from './http';
import 'mocha';
import { expect } from 'chai';

describe('HttpRequester', () => {
    it('http test connection', ((done) => {
        const httpRequester = new HttpRequester("www.google.de");
        const result = httpRequester.get("/imghp").then(() => {
            expect(result).not.to.be.null;
            done();
        });
    }));
});