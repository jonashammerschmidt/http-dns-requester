import { HttpsRequester } from './https';
import 'mocha';
import { expect } from 'chai';

describe('HttpsRequester', () => {
    it('https test connection', ((done) => {
        const httpsRequester = new HttpsRequester("www.google.de");
        const result = httpsRequester.get("/imghp").then(() => {
            expect(result).not.to.be.null;
            done();
        });
    }));
});