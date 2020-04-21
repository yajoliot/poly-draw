import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const DRAWING_ROUTE = 'http://localhost:3000/api/drawing';
const MAIL_ROUTE = 'http://localhost:3000/api/mail';

@Injectable({
  providedIn: 'root'
})
export class ServerReqService {

  constructor(private http: HttpClient) { }

  getDrawings(): Observable<any> {
    return this.http.get(DRAWING_ROUTE);
  }

  getDrawing(id: string): Observable<any> {
    return this.http.get(`${DRAWING_ROUTE}/${id}`);
  }

  saveDrawing(drawing: any): Observable<any> {
    return this.http.post(DRAWING_ROUTE, drawing);
  }

  deleteDrawing(id: string): Observable<any> {
    return this.http.delete(`${DRAWING_ROUTE}/${id}`);
  }

  sendMail(data: object): Observable<any> {
    return this.http.post(MAIL_ROUTE, data);
  }
}
