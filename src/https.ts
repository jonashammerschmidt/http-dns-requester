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

  protected async request<T>(path: string, method: string, body: any): Promise<T> {
    return new Promise<any>((resolve, reject) => {
      const req = https.request(this.getHttpsOptions(path, method), (res: any) => {
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

  private getHttpsOptions(path: string, method: string): https.RequestOptions {
    const options: https.RequestOptions = {
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