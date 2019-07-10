import * as https from 'https';
import { Requester } from './requester';
const HttpsProxyAgent = require('https-proxy-agent');

export class HttpsRequester extends Requester {

  private CAs: string[] = [];
  private isCAInUse = false;

  private rejectUnauthorized = true;

  constructor(host: string, port?: string) {
    super(host, port || "443");
  }

  public useCAs(CAs: string[]) {
    this.isCAInUse = true;
    this.CAs = CAs;
  }

  public useProxy(proxyUrl: string): void {
    super.useProxy(new HttpsProxyAgent(proxyUrl));
  }

  public setRejectUnauthorized(value: boolean) {
    this.rejectUnauthorized = value;
  }

  protected async request(path: string, method: string, body: string, json: boolean): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const req = https.request(this.getHttpsOptions(path, method, body, json), (res: any) => {
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

  private getHttpsOptions(path: string, method: string, body: string, json: boolean): https.RequestOptions {
    const contentHeader = (json) ? {
      'Content-Length': Buffer.byteLength(body),
      'Content-Type': 'application/json'
    } : {
      'Content-Length': (body) ? Buffer.byteLength(body) : 0
    };

    const options: https.RequestOptions = {
      headers: {
        ...contentHeader,
        ...this.header
      },
      host: this.hostIP,
      method,
      path,
      port: this.port,
      rejectUnauthorized: this.rejectUnauthorized
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