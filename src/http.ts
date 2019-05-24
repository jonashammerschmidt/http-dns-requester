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

  protected async request<T>(path: string, method: string, body: any): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const req = http.request(this.getHttpOptions(path, method), (res: any) => {
        this.HandleResponse(res, (resBody: T) => {
          resolve(resBody);
        });
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
