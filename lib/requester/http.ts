import * as http from 'http';
import { Requester } from './requester';
const HttpProxyAgent = require('http-proxy-agent');

export class HttpRequester extends Requester {

  constructor(host: string, port: string) {
    super(host, port);
  }

  public useProxy(proxyUrl: string): void {
    super.useProxy(new HttpProxyAgent(proxyUrl));
  }

  protected async request(path: string, method: string, body: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      var req = http.request(this.getHttpOptions(path, method), (res: any) => {
        this.HandleResponse(res, (resBody) => {
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
