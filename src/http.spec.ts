import { expect } from 'chai';
import 'mocha';
import { HttpRequester } from './http';

describe('HttpRequester', () => {
    it('http test connection', (async () => {
        // Arrange
        const httpRequester = new HttpRequester("www.google.de");

        // Act
        const result: string = await httpRequester.get("/imghp");

        // Assert
        // Assert the resultbody not to be null
        expect(result).not.to.be.null;
    }));
});