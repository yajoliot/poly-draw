import axios from 'axios';
import { injectable } from 'inversify';

import * as FormData from 'form-data';

const SVG_MIME_TYPE = 'image/svg+xml';
const JPEG_MIME_TYPE = 'image/jpeg';
const PNG_MIME_TYPE = 'image/png';

const SVG_FILE_EX = '.svg';
const JPEG_FILE_EX = '.jpeg';
const PNG_FILE_EX = '.png'

const BASE64 = 'base64';

@injectable()
export class MailService {

    private apiKey: string;
    private apiUrl: string;
    private mime: string;
    private fname: string;

    constructor() {
        this.apiKey = '2bfb0275-26d5-4755-a9d3-f564f031ba06';
        this.apiUrl = 'https://log2990.step.polymtl.ca/email';
    }

    async sendMail(data: any, dryRun: boolean): Promise<any> {

        return new Promise((resolve: any, reject: any) => {

            this.fname = data.fileName;
            const buff = this.getBuffer(data.image);

            if (this.mime === SVG_MIME_TYPE) {
                this.fname += SVG_FILE_EX;
            } else if (this.mime === JPEG_MIME_TYPE) {
                this.fname += JPEG_FILE_EX;
            } else if (this.mime === PNG_MIME_TYPE) {
                this.fname += PNG_FILE_EX;

            }

            const formData: FormData = new FormData();
            formData.append('to', data.email);
            formData.append('payload', buff, {
                contentType: this.mime,
                filename: this.fname,
                knownLength: buff.byteLength
            });

            const formHeaders = formData.getHeaders();
            const config = {
                headers: {
                    'x-team-key': this.apiKey,
                    ...formHeaders
                }
            }

            if (dryRun) {
                config['params'] = { dry_run: true }
            }

            axios.post(this.apiUrl, formData, config)
            .then((res: any) => {
                console.log(res.status);
                resolve(res);
            })
            .catch((err) => {
                console.log(err.status)
                reject(err);
            });
        });
    }

    getBuffer(dataUrl: string): Buffer {
        const arr = dataUrl.split(`;${BASE64},`);
        let buff: Buffer;

        this.mime = arr[0].split(':')[1];
        buff = Buffer.from(arr[1], BASE64)

        return buff;
    }

}
