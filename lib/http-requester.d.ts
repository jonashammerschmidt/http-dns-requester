export declare class HttpRequester {
    private host;
    private hostIP;
    private port;
    constructor(host: string, port: string);
    get(path: string, body?: any): Promise<any>;
    post(path: string, body?: any): Promise<any>;
    put(path: string, body?: any): Promise<any>;
    delete(path: string, body?: any): Promise<any>;
    performDnsResolve(onDone: (hostname: string) => void): void;
    private httpRequest;
    private getHttpOptions;
}
