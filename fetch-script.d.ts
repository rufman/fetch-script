declare module 'fetch-script' {
  interface Script {
    url: string;
    options: RequestInit;
  }

  function fetchScript(scripts: Script[], promise?: Promise<void>): Promise<void>;

  export = fetchScript;
}
