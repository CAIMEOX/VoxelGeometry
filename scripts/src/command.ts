export class Sandbox {
  sandbox: object;
  // boxProxy: Object;
  constructor(sandbox: object) {
    this.sandbox = sandbox;
    // this.boxProxy = new Proxy(this.sandbox, {});
  }

  eval(code: string): unknown {
    const body = `with(inside) { ${code} }`;
    const fn = new Function("inside", body);
    return fn(this.sandbox);
  }

  updateEnv(...env: object[]) {
    Object.assign(this.sandbox, ...env);
  }
}
