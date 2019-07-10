import * as http from 'http';
import { Requester } from './requester';
const HttpProxyAgent = require('http-proxy-agent');

export class HttpRequester extends Requester {

  constructor(host: string, port?: string) {
    super(host, port || "80");
  }

  public useProxy(proxyUrl: string): void {
    super.useProxy(new HttpProxyAgent(proxyUrl));
  }

  protected async request(path: string, method: string, body: string, json: boolean): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const req = http.request(this.getHttpOptions(path, method, body, json), (res: any) => {
        this.HandleResponse(res, (response: any) => {
          resolve(response);
        });
      });
      req.on('error', reject);
      if (body) {
        req.write(body);
      }
      req.end();
    });
  }

  private getHttpOptions(path: string, method: string, body: string, json: boolean): http.RequestOptions {
    const contentHeader = (json) ? {
      'Content-Length': Buffer.byteLength(body),
      'Content-Type': 'application/json'
    } : {
      'Content-Length': (body) ? Buffer.byteLength(body) : 0
    };

    const options: http.RequestOptions = {
      headers: {
        ...contentHeader,
        ...this.header
      },
      host: this.hostIP,
      method,
      path,
      port: this.port
    };

    if (this.isProxyInUse) {
      options.agent = this.proxyAgent;
    }

    return options;
  }
}
