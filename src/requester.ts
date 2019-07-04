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

    public async get(path: string, body?: string): Promise<any> {
        return this.request(path, 'GET', (body) ? body : "", false);
    }

    public async post(path: string, body?: string): Promise<any> {
        return this.request(path, 'POST', (body) ? body : "", false);
    }

    public async put(path: string, body?: string): Promise<any> {
        return this.request(path, 'PUT', (body) ? body : "", false);
    }

    public async delete(path: string, body?: string): Promise<any> {
        return this.request(path, 'DELETE', (body) ? body : "", false);
    }

    public async getJSON(path: string, body: any): Promise<any> {
        return this.request(path, 'GET', JSON.stringify(body), true);
    }

    public async postJSON(path: string, body: any): Promise<any> {
        return this.request(path, 'POST', JSON.stringify(body), true);
    }

    public async putJSON(path: string, body: any): Promise<any> {
        return this.request(path, 'PUT', JSON.stringify(body), true);
    }

    public async deleteJSON(path: string, body: any): Promise<any> {
        return this.request(path, 'DELETE', JSON.stringify(body), true);
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

    protected abstract async request(path: string, method: string, body: string, json: boolean): Promise<any>;

    protected HandleResponse(res: any, resolve: (resBody: any) => void) {
        const chunks: any = [];
        res.on('data', (data: any) => chunks.push(data))
        res.on('end', () => {
            const resBody = Buffer.concat(chunks).toString();
            if (res && res.headers &&
                res.headers['content-type'] &&
                res.headers['content-type'].includes('application/json')) {
                res.body = JSON.parse(resBody);
            } else {
                res.body = resBody;
            }
            resolve(res);
        })
    }
}