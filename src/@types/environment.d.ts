declare namespace NodeJS {
  export interface ProcessEnv {
    TOKEN: string;
    NODE_ENV: "development" | "production";
    ICAL_URL: string;
    DB_HOST: string;
    DB_USER: string;
    DB_PASS: string;
    DB_NAME: string;
  }
}
