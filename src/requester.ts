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
        if(hostSplit.length === 2) {
            this.host = hostSplit[0];
            this.port = hostSplit[1];
        }
        
        this.hostIP = host;
    }

    public async get(path: string, body?: any): Promise<any> {
        return this.request(path, 'GET', body);
    }

    public async post(path: string, body?: any): Promise<any> {
        return this.request(path, 'POST', body);
    }

    public async put(path: string, body?: any): Promise<any> {
        return this.request(path, 'PUT', body);
    }

    public async delete(path: string, body?: any): Promise<any> {
        return this.request(path, 'DELETE', body);
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

    protected abstract async request(path: string, method: string, body: any): Promise<any>;

    protected HandleResponse(res: any, resolve: (resBody: any) => void) {
        const chunks: any = [];
        res.on('data', (data: any) => chunks.push(data))
        res.on('end', () => {
            let resBody = Buffer.concat(chunks).toString();
            if (res.headers['content-type'].includes('application/json')) {
                resBody = JSON.parse(resBody);
            }
            resolve(resBody);
        })
    }
}