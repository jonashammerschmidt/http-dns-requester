import { expect } from 'chai';
import 'mocha';
import { HttpsRequester } from './https';

describe('HttpsRequester', () => {
    it('https test connection', (async () => {
        // Arrange
        const httpsRequester = new HttpsRequester("www.google.de");

        // Act
        const result: string = await httpsRequester.get("/imghp");

        // Assert
        // Assert the resultbody not to be null
        expect(result).not.to.be.null;
    }));
});