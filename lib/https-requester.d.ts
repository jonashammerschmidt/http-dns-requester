export declare class HttpsRequester {
    private host;
    private hostIP;
    private port;
    private CAs;
    private isCAInUse;
    constructor(host: string, port: string);
    get(path: string, body?: any): Promise<any>;
    post(path: string, body?: any): Promise<any>;
    put(path: string, body?: any): Promise<any>;
    delete(path: string, body?: any): Promise<any>;
    useCAs(CAs: string[]): void;
    performDnsResolve(onDone: (hostname: string) => void): void;
    private httpsRequest;
    private getHttpsOptions;
}
