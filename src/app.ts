// entry file of app
// setupDb.tsx and setupServer .tsx are not included in the bundle app.ts
import express, { Express } from 'express';
import { SocialScamServer } from './setupServer';
import connectDB from './setupDb';
import { config } from './config';
class Application {
  public initialize(): void {
    this.loadConfig();
    connectDB();
    const app: Express = express();
    const server: SocialScamServer = new SocialScamServer(app);
    server.start();
  }

  private loadConfig(): void {
    config.validateConfig();
  }
}

const application: Application = new Application();
application.initialize();
// error start need -> npm i ts-node -D inope ope
// replace of import file path string like this "../node_modules/" with this "@/nodemodule" -> npm i tsconfig-paths
// error install "npm i @socket.io/redis-adapter redis socket.io" -> run this on cmd inside the root project folder
