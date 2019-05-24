import * as dns from 'dns';

export abstract class Requester {

    protected host: string;
    protected hostIP: string;
    protected port: string;

    protected proxyAgent: any;
    protected isProxyInUse = false;

    constructor(host: string, port?: string) {
        this.host = host;
        this.port = port!;

        // If port is contained in host
        const hostSplit = this.host.split(':');
        if (hostSplit.length === 2) {
            this.host = hostSplit[0];
            this.port = hostSplit[1];
        }

        this.hostIP = host;
    }

    public async get<T>(path: string, body?: any): Promise<T> {
        return this.request<T>(path, 'GET', body);
    }

    public async post<T>(path: string, body?: any): Promise<T> {
        return this.request<T>(path, 'POST', body);
    }

    public async put<T>(path: string, body?: any): Promise<T> {
        return this.request<T>(path, 'PUT', body);
    }

    public async delete<T>(path: string, body?: any): Promise<T> {
        return this.request<T>(path, 'DELETE', body);
    }

    public useProxy(proxyAgent: any): void {
        this.isProxyInUse = true;
        this.proxyAgent = proxyAgent;
    }

    public performDnsResolve(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            if (!this.host) {
                reject("Please provide a container name");
            }

            if (this.host !== this.host.toLowerCase()) {
                console.log("Warning: Your output base url contains some uppercase letters. The dns lookup may struggle with it.");
            }

            dns.lookup(this.host, (err, address) => {
                if (err !== undefined) {
                    this.hostIP = address;
                    resolve(address);
                } else {
                    reject(err);
                }
            });
        });
    }

    public getHostIp(): string {
        return this.hostIP;
    }

    protected abstract async request<T>(path: string, method: string, body: any): Promise<T>;

    protected HandleResponse(res: any, resolve: (resBody: any) => void) {
        const chunks: any = [];
        res.on('data', (data: any) => chunks.push(data))
        res.on('end', () => {
            const resBody = Buffer.concat(chunks).toString();
            console.log(res.headers);
            if (res && res.headers &&
                res.headers['content-type'] &&
                res.headers['content-type'].includes('application/json')) {
                resolve(JSON.parse(resBody));
            } else {
                resolve(resBody);
            }
        })
    }
}