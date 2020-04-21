// tslint:disable:no-magic-numbers
// tslint:disable:no-console

import "reflect-metadata";
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { Application } from '../app/app';
import { DrawingController } from './controllers/drawing.controller';
import { MailController } from './controllers/mail.controller';
import { DatabaseService } from '../app/services/database.service'
import { MailService } from '../app/services/mail.service';
//import { ObjectID } from "mongodb";

chai.should();
chai.use(chaiHttp);

describe('A starting set of test examples to showcase test-suite behaviour', () => {
    let databaseService = new DatabaseService();
    let mailService = new MailService();
    let drawingCon = new DrawingController(databaseService);
    let mailCon = new MailController(mailService)
    let application: Application;

    before(()=> {
        application = new Application(drawingCon, mailCon);
    });

    context('Requests to Drawing Controller', () => {

        it('getAll() and getCount()', ()=> {
            chai.request(application.app).get('/api/drawing/count')
            .then((res: any)=> {
                chai.request(application.app).get('/api/drawing')
                .then((res2: any)=> {
                    chai.expect(res).to.be(res2.length);
                });
            })
            .catch((e: any)=> {
                console.log(e);
            });
        });

        it('Post a new drawing and delete it', () => {

            let drawingMock = {
                name: null,
                width: null,
                height: null,
                backgroundColor: null,
                shapes: null,
                labels: null,
                types: null,
                png: null
            }

            chai.request(application.app).post('api/drawing')
            .send(drawingMock)
            .then((res: any)=> {
                chai.expect(res).to.be('Drawing Saved')
                chai.request(application.app).delete('api')
                .send('12345')
                .then((res2: any) => {
                    chai.expect(res2).to.be('Drawing Deleted');
                })
                .catch((err: any)=> {
                    console.log(err);
                });
            })
            .catch((err: any)=> {
                console.log(err)
            });
            
        });

        
    });

    context('Requests To Mail Controller', ()=> {
        it('response 200', ()=> {
            let mailMock = {
                email: 'yajoliot@gmail.com',
                image: 'data:image/png;base64,iVBORw0',
                fileName: 'name'
            }
            chai.request(application.app).post('api/mail')
            .send(mailMock)
            .then((res)=> {
                chai.expect(res.status).to.be('200');
            });
        });

        it('response 400', ()=> {
            let mailMock = {
                email: 'invalidEmail',
                image: 'data:image/png;base64,iVBORw0',
                fileName: 'name'
            }
            chai.request(application.app).post('api/mail')
            .send(mailMock)
            .then((res)=> {
                chai.expect(res.status).to.be('200');
            });
        });
        

    });
    
});
