import { expect } from 'chai';
import 'mocha';
import { HttpRequester } from './http';

describe('Requester Base', () => {
    it('test dns resolve', (async () => {
        // Arrange
        const httpRequester = new HttpRequester("www.google.de");

        // Act
        await httpRequester.performDnsResolve();

        // Assert
        // Assert the host ip is a valid ipaddress
        expect(httpRequester.getHostIp()).to.match(new RegExp('^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$'));
    }));
});