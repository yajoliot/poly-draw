import {expect} from 'chai';
import 'reflect-metadata';
import * as sinon from 'sinon';

import { MailService } from './mail.service';

describe('Database Service', () => {

    let mailService: MailService;
    let clock: sinon.SinonFakeTimers;

    beforeEach(() => {
        mailService = new MailService();
        clock = sinon.useFakeTimers();
    })

    afterEach(()=>{
        clock.restore();
    })

    it ('database document count and getAll', () => {
        mailService['apiKey'] = 'lol';

    });

    it('png', () => {
        const dataMock = {
            email: 'yajoliot@gmail.com',
            image: 'data:image/png;base64,iVBORw0',
            fileName: 'name'
        }

        mailService.sendMail(dataMock, true);
        expect(mailService['fname']).to.equal('name.png');
        expect(mailService['mime']).to.equal('image/png');
    });

    it('jpeg', () => {
        const dataMock = {
            email: 'yajoliot@gmail.com',
            image: 'data:image/jpeg;base64,iVBORw0',
            fileName: 'name'
        }

        mailService.sendMail(dataMock, true);
        expect(mailService['fname']).to.equal('name.jpeg');
        expect(mailService['mime']).to.equal('image/jpeg');
    });

    it('svg', () => {
        const dataMock = {
            email: 'yajoliot@gmail.com',
            image: 'data:image/svg+xml;base64,iVBORw0',
            fileName: 'name'
        }

        mailService.sendMail(dataMock, true);
        expect(mailService['fname']).to.equal('name.svg');
        expect(mailService['mime']).to.equal('image/svg+xml');
    });

    it('getBuffer', () => {
        mailService.getBuffer('data:image/jpeg;base64,iVBORw0');

        expect(mailService['mime']).to.equal('image/jpeg');
    });

});
