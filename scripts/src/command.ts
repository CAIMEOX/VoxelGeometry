export class Sandbox {
  sandbox: Object;
  // boxProxy: Object;
  constructor(sandbox: Object) {
    this.sandbox = sandbox;
    // this.boxProxy = new Proxy(this.sandbox, {});
  }

  eval(code: string): any {
    let body = `with(inside) { ${code} }`;
    let fn = new Function("inside", body);
    return fn(this.sandbox);
  }

  updateEnv(...env: Object[]) {
    Object.assign(this.sandbox, ...env);
  }
}
