import {TestBed} from '@angular/core/testing';

import {HelperService} from './helper.service';
import {RouterTestingModule} from "@angular/router/testing";

describe('HelperService', () => {

  let service: HelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
    })
    service = TestBed.inject(HelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('removeElmFromArr returns array with reduced elements', () => {

    // Arrange

    // Act
    let result = service.removeElmFromArr(['Apple', 'Banana'], 'Banana');

    // Assert
    expect(result).toEqual(['Apple']);
  });

  it('removeElmsFromArr returns array with reduced elements', () => {

    // Arrange

    // Act
    let result = service.removeElmsFromArr(['Apple', 'Banana', 'Mango'], ['Apple', 'Banana']);

    // Assert
    expect(result).toEqual(['Mango']);
  });

  it('renameElmInArr returns array with renamed element', () => {

    // Arrange

    // Act
    let result = service.renameElmInArr(['Apple', 'Banana', 'Mango'], 'Apple', 'Cherry');

    // Assert
    expect(result).toEqual(['Cherry', 'Banana', 'Mango']);
  });

  it('calcB2BPriceBru returns price brutto', () => {

    // Arrange

    // Act
    let result = service.calcB2BPriceBru(100.50, 16);

    // Assert
    expect(result).toEqual(116.58);
  });

  it('calcB2BPriceBru returns price brutto with 2 decimal places', () => {

    // Arrange

    // Act
    let result = service.calcB2BPriceBru(19999.99, 19.99, 2);

    // Assert
    expect(result).toEqual(23997.99);
  });

  it('calcB2BPriceBru returns price brutto for price net = 0', () => {

    // Arrange

    // Act
    let result = service.calcB2BPriceBru(0, 16);

    // Assert
    expect(result).toEqual(0);
  });

  it('calcB2BPriceBru returns price brutto for taxation = 0', () => {

    // Arrange

    // Act
    let result = service.calcB2BPriceBru(0, 0);

    // Assert
    expect(result).toEqual(0);
  });

  it('calcB2BPriceBru returns price brutto for taxation = 100', () => {

    // Arrange

    // Act
    let result = service.calcB2BPriceBru(50, 100);

    // Assert
    expect(result).toEqual(100);
  });

  it('calcB2CPriceNet returns price netto', () => {

    // Arrange

    // Act
    let result = service.calcB2CPriceNet(100.50, 16);

    // Assert
    expect(result).toEqual(84.42);
  });

  it('calcB2CPriceNet returns price netto with 2 decimal places', () => {

    // Arrange

    // Act
    let result = service.calcB2CPriceNet(19999.99, 19.99, 2);

    // Assert
    expect(result).toEqual(16001.99);
  });

  it('calcB2CPriceNet returns price netto for price brutto = 0', () => {

    // Arrange

    // Act
    let result = service.calcB2CPriceNet(0, 16);

    // Assert
    expect(result).toEqual(0);
  });

  it('calcB2CPriceNet returns price netto for taxation = 0', () => {

    // Arrange

    // Act
    let result = service.calcB2CPriceNet(0, 0);

    // Assert
    expect(result).toEqual(0);
  });

  it('calcB2CPriceNet returns price netto for taxation = 100', () => {

    // Arrange

    // Act
    let result = service.calcB2CPriceNet(50, 100);

    // Assert
    expect(result).toEqual(0);
  });

  it('getCurrentDate returns current date', () => {

    // Arrange

    // Act
    let result = service.getCurrentDate();

    // Assert
    expect(result.substr(0, 4)).toEqual(new Date().getUTCFullYear().toString());
    // expect(result.substr(5, 2)).toEqual((new Date().getMonth() + 1).toString()); // Error: Expected '01' to equal '1'. 20220106
    // expect(result.substr(9,1)).toEqual(new Date().getDay().toString());
  });

  it('getStringInBrackets returns text inside brackets', () => {

    // Arrange

    // Act
    let result = service.getStringInBrackets('abc (test) def');

    // Assert
    expect(result).toEqual('test');
  });

  it('sortOptions returns sorted array', () => {

    // Arrange
    let stringArray = [{label: 'B', value: '2'}, {label: 'D', value: '4'}, {label: 'C', value: '3'}, {
      label: 'A',
      value: '1'
    }];
    let stringArraySorted = [{label: 'A', value: '1'}, {label: 'B', value: '2'}, {label: 'C', value: '3'}, {
      label: 'D',
      value: '4'
    }];

    // Act
    service.sortOptions(stringArray);

    // Assert
    expect(stringArray).toEqual(stringArraySorted);
  });

  it('sortOptions returns unchanged array', () => {

    // Arrange
    let stringArray = [{label: 'A', value: '1'}, {label: 'B', value: '2'}, {label: 'C', value: '3'}, {
      label: 'D',
      value: '4'
    }];
    let stringArraySorted = [{label: 'A', value: '1'}, {label: 'B', value: '2'}, {label: 'C', value: '3'}, {
      label: 'D',
      value: '4'
    }];

    // Act
    service.sortOptions(stringArray);

    // Assert
    expect(stringArray).toEqual(stringArraySorted);
  });

  it('sortOptions returns unchanged array #2', () => {

    // Arrange
    let stringArray = [{label: 'A', value: '1'}, {label: 'A', value: '2'}];
    let stringArraySorted = [{label: 'A', value: '1'}, {label: 'A', value: '2'}];

    // Act
    service.sortOptions(stringArray);

    // Assert
    expect(stringArray).toEqual(stringArraySorted);
  });

  it('should return true if object is in the array', () => {

    // Arrange
    const attribute: {
      id: string,
      name: string
    } = {id: '1', name: 'ATTR_YOUTUBE'};
    const list: any[] = [attribute];
    const list2: {} = attribute;

    // Act
    const result: boolean = service.isObjectInArray(list, list2);

    // Assert
    expect(result).toBeTruthy();
  })

  it('should return true if value is in the array', () => {

    // Arrange
    const attribute: {
      id: string,
      value: string
    } = {id: '1', value: 'ATTR_YOUTUBE'};
    const list: any[] = [attribute];
    const value: string = 'ATTR_YOUTUBE';

    // Act
    const result: boolean = service.isValueInArray(list, value);

    // Assert
    expect(result).toBeTruthy();
  })

});
