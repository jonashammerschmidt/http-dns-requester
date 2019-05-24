import { HttpRequester } from './http';
import 'mocha';
import { expect } from 'chai';

describe('HttpRequester', () => {
    it('http test connection', (async () => {
        // Arrange
        const httpRequester = new HttpRequester("www.google.de");

        // Act
        const result: string = await httpRequester.get<string>("/imghp");

        // Assert
        // Assert the resultbody not to be null
        expect(result).not.to.be.null;
    }));
});