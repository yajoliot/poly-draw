import {expect} from 'chai';
import "reflect-metadata";
import * as sinon from 'sinon';
import {DatabaseService} from './database.service';
import { MongoClient, ObjectID } from 'mongodb';


describe('Database Service', () => {

    const mockId: ObjectID = new ObjectID();
    let databaseService: DatabaseService;
    let clock: sinon.SinonFakeTimers;

    beforeEach(() => {
        databaseService = new DatabaseService();
        clock = sinon.useFakeTimers();
    })

    afterEach(() => {
        clock.restore();
    })

    it ('database document count and getAll', ()=> {
        databaseService.getCount().then((res: any) => {
            databaseService.getAll().then((res2: any) => {
                expect(res).to.equal(res2.length);
            });
        });
    });

    it('database getAll', async () => {
        const url: string = 'mongodb+srv://polydraw:polydraw123@poly-draw-cluster-lxvp6.mongodb.net/test?retryWrites=true&w=majority';
        const res = await databaseService.getAll();
        const res2 = await new Promise(async(resolve:any, reject:any)=>{
            MongoClient.connect(url, { useUnifiedTopology: true }, async(err: any, client: any) => {
                if (err) {
                    console.log(err)
                }
                client.db('polydraw').collection('drawing').find({}).toArray((err: any, res: any)=> {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                    client.close();
                });
            });
        });
        expect(res).to.eql(res2);
    });

    it('database save and delete', async () => {

            const mockDrawing = { _id: mockId.toString()}
            databaseService.save(mockDrawing).then((res: any) => {
                expect(res).to.equal('Drawing Saved');
                databaseService.delete(mockDrawing._id.toString()).then((res2) => {
                    expect(res2).to.equal('Drawing Deleted');
                });
            });
    });
});