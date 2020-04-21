import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import { inject, injectable } from 'inversify';
import * as logger from 'morgan';
import { DrawingController } from './controllers/drawing.controller';
import { MailController } from './controllers/mail.controller';
import Types from './types';

@injectable()
export class Application {
    private readonly internalError: number = 500;
    app: express.Application;

    constructor(
        @inject(Types.DrawingController) private drawingController: DrawingController,
        @inject(Types.MailController) private mailController: MailController
    ) {
        this.app = express();

        this.config();

        this.bindRoutes();
    }

    private config(): void {
        // Middlewares configuration
        this.app.use(logger('dev'));
        this.app.use(bodyParser.json({limit: '50mb'}));
        this.app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
        this.app.use(cookieParser());
        this.app.use((req, res, next) => {
            res.append('Access-Control-Allow-Origin', ['*']);
            res.append('Access-Control-Allow-Methods', '*');
            res.append('Access-Control-Allow-Headers', 'Content-Type');
            next();
        });
    }

    bindRoutes(): void {
        this.app.use('/api/drawing', this.drawingController.router);
        this.app.use('/api/mail', this.mailController.router);
        this.errorHandling();
    }

    private errorHandling(): void {
        // When previous handlers have not served a request: path wasn't found
        this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
            const err: Error = new Error('Not Found');
            next(err);
        });

        // development error handler
        // will print stacktrace
        if (this.app.get('env') === 'development') {
            // tslint:disable-next-line:no-any
            this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
                res.status(err.status || this.internalError);
                res.send({
                    message: err.message,
                    error: err,
                });
            });
        }

        // production error handler
        // no stacktraces leaked to user (in production env only)
        // tslint:disable-next-line:no-any
        this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
            res.status(err.status || this.internalError);
            res.send({
                message: err.message,
                error: {},
            });
        });
    }
}

