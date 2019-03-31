export class SwaggerModel {
  public data: any;
  public prefixes: string[];
  public controllers: string[];
  public actions: string[];
  public parts: string[];
  public https: string[];
  public isUsed: boolean;

  getPrefixes() {
    this.prefixes = [];
    Object.keys(this.data.paths).forEach(element => {
      const prefix = element.split('/')[1];
      if (!this.prefixes.find(x => x === prefix)) {
        this.prefixes.push(prefix);
      }
    });
  }

  getControllers(prefix: string) {
    this.controllers = [];
    Object.keys(this.data.paths).forEach(element => {
      if (element.split('/')[1] === prefix) {
        const controller = element.split('/')[2];
        if (!this.controllers.find(x => x === controller)) {
          this.controllers.push(controller);
        }
      }
    });
  }

  getActions(controller: string) {
    this.actions = [];
    Object.keys(this.data.paths).forEach(element => {
      if (element.split('/')[2] === controller) {
        const action = element.split('/')[3];
        if (!this.actions.find(x => x === action)) {
          this.actions.push(action);
        }
      }
    });
  }

  getHttps(fullPath: string) {
    this.https = [];
    Object.keys(this.data.paths[fullPath]).forEach(element => {
      this.https.push(element);
    });
  }
}
