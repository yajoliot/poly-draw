import { TestBed } from '@angular/core/testing';

import { ToolUtilService } from './toolUtil.service';

describe('ColorService', () => {

  beforeEach(() =>
  TestBed.configureTestingModule({})
  );

  it('should be created', () => {
    const service: ToolUtilService = TestBed.get(ToolUtilService);
    expect(service).toBeTruthy();
  });

  it('addPrimary', () => {
    const toolUtil: ToolUtilService = TestBed.get(ToolUtilService);
    toolUtil.colors = ['rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)',
    'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)',
     'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)'];
    toolUtil.addPrimaryColor('rgb(255,255,255,1)')
    expect(toolUtil.colors)
    .toEqual([ 'rgb(255,255,255,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)',
    'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)',
     'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)' ]);
  });

  it('addPrimary 2 times', () => {
    const toolUtil: ToolUtilService = TestBed.get(ToolUtilService);
    toolUtil.colors = ['rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)',
    'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)',
    'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)'];
    toolUtil.addPrimaryColor('rgb(255,255,255,1)');
    toolUtil.addPrimaryColor('rgb(255,255,255,1)');

    expect(toolUtil.colors)
    .toEqual([ 'rgb(255,255,255,1)', 'rgb(0,0,0,1)', 'rgb(255,255,255,1)', 'rgb(0,0,0,1)',
    'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)' ]);
  });

  it('addSecondary', () => {
    const toolUtil: ToolUtilService = TestBed.get(ToolUtilService);
    toolUtil.colors = ['rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)',
    'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)'];
    toolUtil.addSecondaryColor('rgb(255,255,255,1)');
    expect(toolUtil.colors)
    .toEqual([ 'rgb(0,0,0,1)', 'rgb(255,255,255,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)',
    'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)' ]);
  });

  it('addPrimary then addSecondary then addPrimary', () => {
    const toolUtil: ToolUtilService = TestBed.get(ToolUtilService);
    toolUtil.colors = ['rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)',
    'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)'];
    toolUtil.addPrimaryColor('rgb(255,255,255,1)');
    toolUtil.addSecondaryColor('rgb(100,100,100,1)');
    toolUtil.addPrimaryColor('rgb(200,200,200,1)');

    expect(toolUtil.colors)
    .toEqual([ 'rgb(200,200,200,1)', 'rgb(100,100,100,1)', 'rgb(255,255,255,1)', 'rgb(0,0,0,1)',
     'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)' ]);
  });

  it('add then getprimary', () => {
    const toolUtil: ToolUtilService = TestBed.get(ToolUtilService);
    toolUtil.colors = ['rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)',
    'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)'];
    toolUtil.addPrimaryColor('rgb(200,200,200,1)');
    expect(toolUtil.getPrimaryColor()).toBe('rgb(200,200,200,1)');
  });

  it('add then getsecondary', () => {
    const toolUtil: ToolUtilService = TestBed.get(ToolUtilService);
    toolUtil.colors = ['rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)',
    'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)'];
    toolUtil.addSecondaryColor('rgb(200,200,200,1)');
    expect(toolUtil.getSecondaryColor()).toBe('rgb(200,200,200,1)');
  });

  it('undefined getprimary', () => {
    const toolUtil: ToolUtilService = TestBed.get(ToolUtilService);
    toolUtil.colors = [];
    expect(toolUtil.getPrimaryColor()).toBe('rgb(0,0,0,1)');
  });

  it('if secondary color is undefined return black', () => {
    const TOOLUTIL = new ToolUtilService();
    TOOLUTIL.colors = [];
    expect(TOOLUTIL.getSecondaryColor()).toBe('rgb(0,0,0,1)');
  });
  it('set brush type and get', () => {
    const toolUtil: ToolUtilService = TestBed.get(ToolUtilService);
    toolUtil.setBrushType('Type1');
    expect(toolUtil.getBrushType()).toBe('Type1');
  });

  it('switch', () => {
    const toolUtil: ToolUtilService = TestBed.get(ToolUtilService);
    toolUtil.colors = ['rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)',
    'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)', 'rgb(0,0,0,1)'];
    toolUtil.addPrimaryColor('rgb(100,100,100,1)');
    toolUtil.addSecondaryColor('rgb(200,200,200,1)');
    toolUtil.switch();
    expect(toolUtil.colors[0]).toBe('rgb(200,200,200,1)');
    expect(toolUtil.colors[1]).toBe('rgb(100,100,100,1)')
  })

  it('getPrimaryColorEllipse', () => {
    const toolUtil: ToolUtilService = TestBed.get(ToolUtilService);
    toolUtil.typeEllipse = 'plein';
    toolUtil.getPrimaryColorEllipse();
    toolUtil.getSecondaryColorEllipse();

    toolUtil.typeEllipse = 'contour';
    toolUtil.getPrimaryColorEllipse();
    toolUtil.getSecondaryColorEllipse();

  });


});
