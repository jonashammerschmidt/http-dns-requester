import * as dns from 'dns';
import * as http from 'http';

export class HttpRequester {

  private host: string;
  private hostIP: string;
  private port: string;

  constructor(host: string, port: string) {
    this.host = host;
    this.port = port;
    this.hostIP = host;
  }

  public async get(path, body?: any): Promise<any> {
    return this.httpRequest(path, 'GET', body);
  }

  public async post(path, body?: any): Promise<any> {
    return this.httpRequest(path, 'POST', body);
  }

  public async put(path, body?: any): Promise<any> {
    return this.httpRequest(path, 'PUT', body);
  }

  public async delete(path, body?: any): Promise<any> {
    return this.httpRequest(path, 'DELETE', body);
  }

  public performDnsResolve(onDone: (hostname: string) => void) {
    if (!this.host) {
      throw "Please provide a container name";
    }

    if (this.host !== this.host.toLowerCase()) {
      console.log("Warning: Your output base url contains some uppercase letters. The dns lookup may struggle with it.");
    }

    dns.lookup(this.host, (err, address) => {
      if (err !== undefined) {
        this.hostIP = address;
        onDone(address);
      }
    });
  }

  private async httpRequest(path, method, body: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      var req = http.request(this.getHttpOptions(path, method), (res: any) => {
        const chunks = [];
        res.on('data', data => chunks.push(data))
        res.on('end', () => {
          let resBody = Buffer.concat(chunks).toString();
          if (res.headers['content-type'].includes('application/json')) {
            resBody = JSON.parse(resBody);
          }
          resolve(resBody);
        })
      });
      req.on('error', reject);
      if (body) {
        req.write(body);
      }
      req.end();
    });
  }

  private getHttpOptions(path: string, method: string): http.RequestOptions {
    const options: http.RequestOptions = {
      host: this.hostIP,
      path: path,
      method: method,
      port: this.port
    };

    return options;
  }
}