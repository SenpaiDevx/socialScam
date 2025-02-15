// setup config
// process ENV variable, use to different part of web app files
import dotenv from 'dotenv';
import bunyan from 'bunyan';
dotenv.config({});
class Config {
  public DATABASE_URL: string | undefined;
  public JWT_TOKEN: string | undefined;
  public NODE_ENV: string | undefined;
  public SECRET_KEY_ONE: string | undefined;
  public SECRET_KEY_TWO: string | undefined;
  public CLIENT_URL: string | undefined;
  public REDIS_HOST: string | undefined;
  private readonly DEFAULT_DB = 'mongodb://localhost:27017/socialScam-db';
  constructor() {
    this.DATABASE_URL = process.env.DATABASE_URL || this.DEFAULT_DB;
    this.JWT_TOKEN = process.env.JWT_TOKEN || '';
    this.NODE_ENV = process.env.NODE_ENV || '';
    this.CLIENT_URL = process.env.CLIENT_URL || '';
    this.SECRET_KEY_ONE = process.env.SECRET_KEY_ONE || '';
    this.SECRET_KEY_TWO = process.env.SECRET_KEY_TWO || '';
    this.REDIS_HOST = process.env.REDIS_HOST || '';
  }

  public createLogger(name: string): bunyan {
    return bunyan.createLogger({ name, level: 'debug' });
  }

  public validateConfig(): void {
    // "this" keyword is used to access the class properties as object type
    for (const [key, value] of Object.entries(this)) {
      if (value === undefined) {
        throw new Error(`Configuration key ${value} is undefined and take a look`);
      }
    }
  }
}

export const config: Config = new Config();
