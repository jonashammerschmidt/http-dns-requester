import * as dns from 'dns';
import * as http from 'http';
import * as https from 'https';
const HttpProxyAgent = require('http-proxy-agent');
const HttpsProxyAgent = require('https-proxy-agent');

export class HttpRequester {

  private host: string;
  private hostIP: string;
  private port: string;

  private proxyAgent: any;
  private isProxyInUse = false;

  constructor(host: string, port: string) {
    this.host = host;
    this.port = port;
    this.hostIP = host;
  }

  public async get(path: string, body?: any): Promise<any> {
    return this.httpRequest(path, 'GET', body);
  }

  public async post(path: string, body?: any): Promise<any> {
    return this.httpRequest(path, 'POST', body);
  }

  public async put(path: string, body?: any): Promise<any> {
    return this.httpRequest(path, 'PUT', body);
  }

  public async delete(path: string, body?: any): Promise<any> {
    return this.httpRequest(path, 'DELETE', body);
  }

  public useProxy(proxyUrl: string): void {
    this.isProxyInUse = true;
    this.proxyAgent = new HttpProxyAgent(proxyUrl);
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

  private async httpRequest(path: string, method: string, body: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      var req = http.request(this.getHttpOptions(path, method), (res: any) => {
        const chunks: any = [];
        res.on('data', (data: any) => chunks.push(data))
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

    if (this.isProxyInUse) {
      options.agent = this.proxyAgent;
    }

    return options;
  }
}

export class HttpsRequester {

  private host: string;
  private hostIP: string;
  private port: string;

  private CAs: string[] = [];
  private isCAInUse = false;

  private proxyAgent: any;
  private isProxyInUse = false;

  constructor(host: string, port: string) {
    this.host = host;
    this.port = port;
    this.hostIP = host;
  }

  public async get(path: string, body?: any): Promise<any> {
    return this.httpsRequest(path, 'GET', body);
  }

  public async post(path: string, body?: any): Promise<any> {
    return this.httpsRequest(path, 'POST', body);
  }

  public async put(path: string, body?: any): Promise<any> {
    return this.httpsRequest(path, 'PUT', body);
  }

  public async delete(path: string, body?: any): Promise<any> {
    return this.httpsRequest(path, 'DELETE', body);
  }

  public useCAs(CAs: string[]) {
    this.isCAInUse = true;
    this.CAs = CAs;
  }

  public useProxy(proxyUrl: string): void {
    this.isProxyInUse = true;
    this.proxyAgent = new HttpsProxyAgent(proxyUrl);
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

  private async httpsRequest(path: string, method: string, body: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      var req = https.request(this.getHttpsOptions(path, method), (res: any) => {
        const chunks: any[] = [];
        res.on('data', (data: any) => chunks.push(data))
        res.on('end', () => {
          let resBody = Buffer.concat(chunks).toString();
          if (res.headers['content-type'].includes('application/json')) {
            resBody = JSON.parse(resBody);
          }
          resolve(resBody)
        })
      });
      req.on('error', reject);
      if (body) {
        req.write(body);
      }
      req.end();
    });
  }

  private getHttpsOptions(path: string, method: string): https.RequestOptions {
    const options: https.RequestOptions = {
      host: this.hostIP,
      path: path,
      method: method,
      port: this.port,
      rejectUnauthorized: this.isCAInUse
    };

    if (this.isCAInUse) {
      options.ca = this.CAs;
    }

    if (this.isProxyInUse) {
      options.agent = this.proxyAgent;
    }

    return options;
  }
}