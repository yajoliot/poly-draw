import { injectable } from 'inversify';
import { MongoClient, ObjectID } from 'mongodb';

@injectable()
export class DatabaseService {
    private url: string;

    constructor() {
        this.url = 'mongodb+srv://polydraw:polydraw123@poly-draw-cluster-lxvp6.mongodb.net/test?retryWrites=true&w=majority';

        this.getCount().then((res: any) => {
            console.log('document count: ' + res);
        }).catch((err: any) => {
            console.log('error getting document count' + err);
        })
    }

    async getCount(): Promise<any> {
        return new Promise(async (resolve: any, reject: any) => {
            MongoClient.connect(this.url, { useUnifiedTopology: true }, (err: any, client: any) => {
                if (err) {
                    reject(err);
                }
                const collection = client.db('polydraw').collection('drawing');

                collection.countDocuments().then((res: any) => {
                    resolve(res);
                });
                client.close();
             });
        });
    }

    async getAll(): Promise<any> {
        return new Promise(async (resolve: any, reject: any) => {
            MongoClient.connect(this.url, { useUnifiedTopology: true }, async (err: any, client: any) => {
                if (err) {
                    console.log(err)
                }
                client.db('polydraw').collection('drawing').find({}).toArray((error: any, res: any) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(res);
                    }
                    client.close();
                });
            });
        });
    }

    async save(drawing: any): Promise<any> {
        return new Promise((resolve: any, reject: any) => {
            MongoClient.connect(this.url, { useUnifiedTopology: true }, (err: any, client: any) => {
                if (err) {
                    reject(err);
                }

                const collection = client.db('polydraw').collection('drawing');

                collection.insertOne({
                    name: drawing.name,
                    width: drawing.width,
                    height: drawing.height,
                    backgroundColor: drawing.backgroundColor,
                    shapes: drawing.shapes,
                    labels: drawing.labels,
                    types: drawing.types,
                    png: drawing.png,
                    instructions: drawing.instructions
                });

                client.close();
                resolve('Drawing Saved');
            });
        })
    }

    async delete(id: string): Promise<any> {
        return new Promise((resolve: any, reject: any) => {
            MongoClient.connect(this.url, { useUnifiedTopology: true }, async (err: any, client: any) => {
                if (err) {
                    reject(err);
                }
                const oid = new ObjectID(id);
                client.db('polydraw').collection('drawing').deleteOne({_id: oid});

                resolve('Drawing Deleted');
            });
        });
    }
}
