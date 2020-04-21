
import { NextFunction, Request, Response, Router } from 'express';
import { inject , injectable } from 'inversify';

import { MailService } from '../services/mail.service';
import Types from '../types';

@injectable()
export class MailController {
    router: Router;

    constructor(@inject(Types.MailService) private mail: MailService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.post('/', (req: Request, res: Response, next: NextFunction) => {

            this.mail.sendMail(req.body, false)
            .then((result: any) => {
                res.json(result)
            })
            .catch((err: any) => {
                res.json(err)
            });

        });

    }
}
