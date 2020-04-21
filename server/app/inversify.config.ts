import { Container } from 'inversify';
import "reflect-metadata";
import { Application } from './app';

import { Server } from './server';

import Types from './types';

import { MailController } from './controllers/mail.controller';
import { MailService } from './services/mail.service';

import { DrawingController } from './controllers/drawing.controller';
import { DatabaseService} from './services/database.service';

const container: Container = new Container();

container.bind(Types.Server).to(Server);
container.bind(Types.Application).to(Application);

container.bind(Types.MailController).to(MailController);
container.bind(Types.MailService).to(MailService);

container.bind(Types.DrawingController).to(DrawingController);
container.bind(Types.DatabaseService).to(DatabaseService);


export { container };
