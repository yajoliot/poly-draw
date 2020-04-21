
import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { DatabaseService } from '../services/database.service';
import Types from '../types';

@injectable()
export class DrawingController {
    router: Router;

    constructor(@inject(Types.DatabaseService) private database: DatabaseService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.get('/', async (req: Request, res: Response, next: NextFunction) => {
            this.database.getAll()
            .then((data) => {
                res.json(data)
            })
            .catch((err) => {
                console.log(err);
            });
        });

        /*this.router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
            let id: string = req.params.id;
            this.database.get(id);
        });*/

        this.router.get('/count', async (req: Request, res: Response, next: NextFunction) => {
            this.database.getCount()
            .then((data) => {
                res.json(data)
            })
            .catch((err) => {
                console.log(err);
            });
        });

        this.router.post('/', (req: Request, res: Response, next: NextFunction) => {
            if (req.body.name == null) {
                res.json('Invalid Name');
            } else {
                this.database.save(req.body)
                .then((data) => {
                    res.json(data)
                })
                .catch((err: any) => {
                    console.log(err)
                })
            }
        });

        this.router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
            const id = req.params.id;
            this.database.delete(id).then((result: boolean) => {
                if (result) {
                    res.json('drawing deleted' + id);
                } else {
                    res.json('error handling the delete');
                }
            });
        });
    }
}
