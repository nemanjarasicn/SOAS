import { Warehousing } from './warehousing';

describe('Warehousing', () => {
  it('should create an instance', () => {
    expect(new Warehousing(7712,'101','Testartikel_20210301_Komponente_1',
      'LO71011010433', 'HXA757', 'A',5,4,'2021-06-03 08:50:00')).toBeTruthy();
  });
});
