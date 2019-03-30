export class ServiceUrlModel {
  public url: string;
  public controller: string;
  public prefix: string;
  public action: string;
  public http: string;
  public swaggerUrl: string;

  getControllerAddress() {
    let result = '';
    if (this.prefix) {
      result += '/' + this.prefix;
    }
    if (this.controller) {
      result += '/' + this.controller;
    }

    if (this.action) {
      result += '/' + this.action;
    }
    return result;
  }
}
