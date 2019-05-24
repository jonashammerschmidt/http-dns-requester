import { HttpsRequester } from './https';
import 'mocha';
import { expect } from 'chai';

describe('HttpsRequester', () => {
    it('https test connection', (async () => {
        // Arrange
        const httpsRequester = new HttpsRequester("www.google.de");

        // Act
        const result = await httpsRequester.get("/imghp");

        // Assert
        // Assert the resultbody not to be null
        expect(result).not.to.be.null;
    }));
});