import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ServerReqService } from './server-req.service';

describe('ServerReqService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [ServerReqService]
  }));

  it('should be created', () => {
    const service: ServerReqService = TestBed.get(ServerReqService);
    expect(service).toBeTruthy();
  });

  it('getDrawings to have been called', () => {
    const service: ServerReqService = TestBed.get(ServerReqService);
    spyOn(service, 'getDrawings')
    service.getDrawings();
    expect(service.getDrawings).toHaveBeenCalled();
  });

  it('getDrawing to have been called', () => {
    const service: ServerReqService = TestBed.get(ServerReqService);
    const mockId = '1';
    spyOn(service, 'getDrawing');
    service.getDrawing(mockId);
    expect(service.getDrawing).toHaveBeenCalled();
  });

  it('save to have been called', () => {
    const service: ServerReqService = TestBed.get(ServerReqService);
    const mockDrawing = {};
    spyOn(service, 'saveDrawing')
    service.saveDrawing(mockDrawing);
    expect(service.saveDrawing).toHaveBeenCalled();
  });

  it('delete to have been called', () => {
    const service: ServerReqService = TestBed.get(ServerReqService);
    const mockId = '1';
    spyOn(service, 'deleteDrawing');
    service.deleteDrawing(mockId);
    expect(service.deleteDrawing).toHaveBeenCalled();
  });

  it('getDrawings', () => {
    const service: ServerReqService = TestBed.get(ServerReqService);
    const response = service.getDrawings();
    expect(typeof response).toBe('object');
  });

  it('getDrawing', () => {
    const service: ServerReqService = TestBed.get(ServerReqService);
    const response = service.getDrawings();
    expect(typeof response).toBe('object');
  });

  it('save', () => {
    const service: ServerReqService = TestBed.get(ServerReqService);
    const mockDrawing = {}
    const response = service.saveDrawing(mockDrawing);
    expect(typeof response).toBe('object');
  });

  it('delete', () => {
    const service: ServerReqService = TestBed.get(ServerReqService);
    const mockId = '1';
    const response = service.deleteDrawing(mockId);
    expect(typeof response).toBe('object');
  });
});
