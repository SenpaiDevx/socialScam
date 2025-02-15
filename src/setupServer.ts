// setup application server - starting server, adding global handler
// this contain handler, methods
import { Application, json, urlencoded, Response, Request, NextFunction } from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import compression from 'compression';
import cookieSession from 'cookie-session';
import HTTP_STATUS from 'http-status-codes';
import 'express-async-errors';
import { config } from './config'; // process env variables
import Logger from 'bunyan';
import { Server } from 'socket.io';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import ExpressRoutes from './routes';
import { CustomError, IErrorResponse } from './shared/globals/error-handlers';

const log: Logger = config.createLogger('server'); // replace of console.log() show result with "name" as identifier of log
const SERVER_PORT: number = 5000;
export class SocialScamServer {
  // application is instance express where we can add routes, middleware, post get() set().
  private app: Application;
  constructor(app: Application) {
    this.app = app;
  }

  //
  public start(): void {
    // this is the function middleware
    this.securityMiddleware(this.app); // add other middleware
    this.standardMiddleware(this.app);
    this.routeMiddleware(this.app);
    this.globalErrorHandler(this.app);
    this.startServer(this.app);
  }

  // this function below will apply as setting when we start the server on the command
  private securityMiddleware(app: Application): void {
    // express instance "Application" type this passing to methon to specify the
    // type of param function when it specify you can access the property of that "type" Application
    app.use(
      cookieSession({
        name: 'session', // this properties later use in "load balancer" in AWS cloud
        keys: [config.SECRET_KEY_ONE!, config.SECRET_KEY_TWO!],
        maxAge: 24 * 7 * 3600000, // amount of time to be valid for cookie then if time is pass it wil invalid -> 7 days it renewed every time login and out
        secure: config.NODE_ENV !== 'local-development' // when false it local development, if true for deployment true cloud AWS , CIRCLE CI
      })
    );
    // middleware handler for security purposes
    // app.use() is function to call all middleware
    app.use(hpp());
    app.use(helmet());
    app.use(
      cors({
        origin: config.CLIENT_URL, // this is the url link of your web app,
        credentials: true, // set it true to allow cookie to be sent to client, otherwise it will be blocked by browser
        optionsSuccessStatus: 200, // for older browser
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTION'] // THIS IS THE METHOD ALLOWED TO BE INTERACT TO BACKEND SERVER
      })
    );
  }
  private standardMiddleware(app: Application): void {
    app.use(compression()); // this library helps to compress our request and response
    app.use(
      json(
        { limit: '50mb' } // each parse request it should'nt be exceed to 50mb or else it will be rejected and
        // also vice versa request and send back to client
      )
    );
    app.use(
      urlencoded({
        extended: true, // vice versa from client to server and server to client as urlncoded data
        limit: '50mb'
      })
    );
  }

  private routeMiddleware(app: Application): void {
    ExpressRoutes(app);
  }

  private globalErrorHandler(app: Application): void {
    // express to cathch error that ralated to url link that not available
    // and also url endpoint not found
    app.all('*', (req: Request, res: Response, _next: NextFunction) => {
      res.status(HTTP_STATUS.NOT_FOUND).json({ message: req.originalUrl + ' Route not found' });
    });

    app.use((error: IErrorResponse, _req: Request, res: Response, next: NextFunction) => {
      log.error(error);
      if (error instanceof CustomError) {
        // return related to this condition
        res.status(error.statusCode).json({ message: error.serializeErrors() });
        // return a value as type Pathparams
      }

      next(error);
    });
  }

  private async startServer(app: Application): Promise<void> {
    // startHttpServer() will be called from startServer() method
    try {
      const httpServer: http.Server = new http.Server(app);
      const socketIO: Server = await this.createSocketIO(httpServer);
      this.startHttpServer(httpServer);
      this.socketIOConnection(socketIO);
    } catch (error) {
      log.error(error);
    }
  }

  private async createSocketIO(httpServer: http.Server): Promise<Server> {
    const io: Server = new Server(httpServer, {
      cors: {
        origin: config.CLIENT_URL,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTION']
      }
    });
    const pubClient = createClient({
      url: config.REDIS_HOST
    });
    const subClient = pubClient.duplicate();
    await Promise.all([pubClient.connect(), subClient.connect()]);
    io.adapter(createAdapter(pubClient, subClient));
    return io;
  }

  private startHttpServer(http: http.Server): void {
    log.info(`Server has started with process pid numerb ${process.pid}`);
    http.listen(SERVER_PORT, () => {
      log.info(`UP ON RUNNING AT localhost:${SERVER_PORT}`);
    });
  }

  // this class method define  all socket.io classes

  private socketIOConnection(_io: Server): void {}
}

//npm i cors helmet hpp cookie-session compression express-async-errors http-status-codes
// cors -> security middleware
// helmet hpp ->security middleware
// cookie-session -> standard middleware
// compression -> when request is made it will automatically compresss
// express-async-errors -> this middleware will catch the error and send it to the client -> try catch
