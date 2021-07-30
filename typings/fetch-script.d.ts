declare module 'fetch-script' {
  interface Script {
    nonce: string;
    options: RequestInit;
    url: string;
  }

  function fetchScript(scripts: Script[], promise?: Promise<void>): Promise<void>;

  export = fetchScript;
}
