declare namespace NodeJS {
  export interface ProcessEnv {
    TOKEN: string;
    NODE_ENV: "developer" | "production";
    DB_HOST: string;
    DB_USER: string;
    DB_PASS: string;
    DB_NAME: string;
  }
}
