import { Injectable } from '@angular/core';
import { PointService } from '../point/point.service';

@Injectable({
  providedIn: 'root'
})

export class SvgWorkerService {

  line(destination: PointService): string {
    return 'L' + Math.floor(destination.getPositionX()) + ',' + Math.floor(destination.getPositionY());
  }
  move(destination: PointService): string {
    return 'M' + Math.floor(destination.getPositionX()) + ',' + Math.floor(destination.getPositionY());
  }
  hemiLeftArc(radius: PointService, destination: PointService): string {
    return ' A' + Math.floor(radius.getPositionX()) + ' , ' + Math.floor(radius.getPositionY()) + ' 0 0, 1 '
                + Math.floor(destination.getPositionX()) + ' ' + Math.floor(destination.getPositionY()) + ' ';
  }
  hemiRightArc(radius: PointService, destination: PointService): string {
    return ' A' + Math.floor(radius.getPositionX()) + ' , ' + Math.floor(radius.getPositionY()) + ' 0 0, 0 '
                + Math.floor(destination.getPositionX()) + ' ' + Math.floor(destination.getPositionY()) + ' ';
  }
  rotatedHemiLeftArc(radius: PointService, destination: PointService, rotation: number): string {
    return ' A' + radius.getPositionX() + ' , ' + radius.getPositionY() + ' ' + rotation + ' 1, 0 '
                + destination.getPositionX() + ' ' + destination.getPositionY() + ' ';
  }
  rotatedHemiRightArc(radius: PointService, destination: PointService, rotation: number): string {
    return ' A' + radius.getPositionX() + ' , ' + radius.getPositionY() + ' ' + rotation + ' 0, 0 '
                + destination.getPositionX() + ' ' + destination.getPositionY() + ' ';
  }
  noFloorMove(destination: PointService): string {
    return 'M' + destination.getPositionX() + ',' + destination.getPositionY();
  }
}
