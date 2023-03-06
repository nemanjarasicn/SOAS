import {TestBed} from '@angular/core/testing';

import {DetailViewTabGroupTabsService} from './detail-view-tab-group-tabs.service';
import {TestingModule} from "../../testing/testing.module";
import {
  ConstantsService,
  SubTabGroupTabNumbers,
  TabGroupTabNames,
  TabGroupTabNumbers
} from "../../_services/constants.service";
import {MatTabGroup} from "@angular/material/tabs";
import {ChangeDetectorRef} from "@angular/core";

describe('DetailViewTabGroupTabsService', () => {
  let service: DetailViewTabGroupTabsService;
  // let fixture: ComponentFixture<DetailViewTabGroupTabsService>;
  let constantsService: ConstantsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [MatTabGroup],
      providers: [ConstantsService, ChangeDetectorRef]
    })
    // fixture = TestBed.createComponent(DetailViewTabGroupTabsService);
    service = TestBed.inject(DetailViewTabGroupTabsService);
    constantsService = TestBed.inject(ConstantsService);
    // fixture.detectChanges();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set selected current tab name', () => {

    // Arrange
    let name: TabGroupTabNames = TabGroupTabNames.ORDER;

    // Act
    service.setSelCurrentTabName(name);

    // Assert
    expect(service.selCurrentTabName).toEqual(name);
  });

  it('should returns selected current tab name', () => {

    // Arrange
    const name: TabGroupTabNames = TabGroupTabNames.ORDER;
    service.selCurrentTabName = name;

    // Act
    let result: string = service.getSelCurrentTabName();

    // Assert
    expect(result).toEqual(name);
  });

  it('should set selected current tab group name', () => {

    // Arrange
    let name: TabGroupTabNames = TabGroupTabNames.ORDER;

    // Act
    service.setSelCurrentTabGroupName(name);

    // Assert
    expect(service.selCurrentTabGroupName).toEqual(name);
  });

  it('should set tab group', () => {

    // Arrange
    let group: MatTabGroup = service.tabGroup;

    // Act
    service.setTabGroup(group);

    // Assert
    expect(service.tabGroup).toEqual(group);
  });

  it('should set customer tab group', () => {

    // Arrange
    let group: MatTabGroup = service.cusTabGroup;

    // Act
    service.setCusTabGroup(group);

    // Assert
    expect(service.cusTabGroup).toEqual(group);
  });

  it('should set order tab group', () => {

    // Arrange
    let group: MatTabGroup = service.ordTabGroup;

    // Act
    service.setOrdTabGroup(group);

    // Assert
    expect(service.ordTabGroup).toEqual(group);
  });

  it('should set delivery note tab group', () => {

    // Arrange
    let group: MatTabGroup = service.delTabGroup;

    // Act
    service.setDelTabGroup(group);

    // Assert
    expect(service.delTabGroup).toEqual(group);
  });

  it('should set invoice tab group', () => {

    // Arrange
    let group: MatTabGroup = service.invTabGroup;

    // Act
    service.setInvTabGroup(group);

    // Assert
    expect(service.invTabGroup).toEqual(group);
  });

  it('should set comments tab group', () => {

    // Arrange
    let group: MatTabGroup = jasmine.createSpyObj('MatTabGroup', ['childMethod']);

    // Act
    service.setComTabGroup(group);

    // Assert
    expect(service.comTabGroup).toEqual(group);
  });

  it('should set cdRef', () => {

    // Arrange
    const cdRef: ChangeDetectorRef = TestBed.inject(ChangeDetectorRef);

    // Act
    service.setCdRef(cdRef);

    // Assert
    expect(service.cdRef).toEqual(cdRef);
  });

  it('should get orders tab by referral table name', () => {

    // Arrange
    const refTable: string = constantsService.REFTABLE_ORDERS;

    // Act
    const result: undefined|TabGroupTabNames = service.getTabByRefTable(refTable);

    // Assert
    expect(result).toEqual(TabGroupTabNames.ORDER);
  });

  it('should get customer tab by referral table name', () => {

    // Arrange
    const refTable: string = constantsService.REFTABLE_CUSTOMER;

    // Act
    const result: undefined|TabGroupTabNames = service.getTabByRefTable(refTable);

    // Assert
    expect(result).toEqual(TabGroupTabNames.CUSTOMER);
  });

  it('should get delivery note tab by referral table name', () => {

    // Arrange
    const refTable: string = constantsService.REFTABLE_DELIVERY_NOTES;

    // Act
    const result: undefined|TabGroupTabNames = service.getTabByRefTable(refTable);

    // Assert
    expect(result).toEqual(TabGroupTabNames.DELIVERY_NOTE);
  });

  it('should get invoice tab by referral table name', () => {

    // Arrange
    const refTable: string = constantsService.REFTABLE_INVOICE;

    // Act
    const result: undefined|TabGroupTabNames = service.getTabByRefTable(refTable);

    // Assert
    expect(result).toEqual(TabGroupTabNames.INVOICE);
  });

  it('should get comments tab by referral table name', () => {

    // Arrange
    const refTable: string = constantsService.REFTABLE_COMMENTS;

    // Act
    const result: undefined|TabGroupTabNames = service.getTabByRefTable(refTable);

    // Assert
    expect(result).toEqual(TabGroupTabNames.COMMENT);
  });

  it('should get undefined tab by referral table name', () => {

    // Arrange
    const refTable: string = undefined;

    // Act
    const result: undefined|TabGroupTabNames = service.getTabByRefTable(refTable);

    // Assert
    expect(result).toEqual(undefined);
  });

  it('should reset new item mode', () => {

    // Arrange
    const refTable: string = undefined;
    const tabIndex: TabGroupTabNumbers = TabGroupTabNumbers.ORDER;
    const subTabGroupIndex: SubTabGroupTabNumbers = SubTabGroupTabNumbers.DETAILS;

    // Act
    const result: boolean = service.shouldResetNewItemMode(refTable, tabIndex, subTabGroupIndex);

    // Assert
    expect(result).toBeTruthy();
  });

  it('should set tab to select', () => {

    // Arrange
    const number: TabGroupTabNumbers = TabGroupTabNumbers.ORDER;

    // Act
    service.setTabToSelect(number);

    // Assert
    expect(service.selTabGroupTab).toEqual(number);
  });

  it('should set sub tab to select', () => {

    // Arrange
    const number: SubTabGroupTabNumbers = SubTabGroupTabNumbers.POSITIONS;

    // Act
    service.setSubTabToSelect(number);

    // Assert
    expect(service.selSubTabGroupTab).toEqual(number);
  });

  // it('should get selected sub tab group index', () => {
  //
  //   // Arrange
  //   const tabTitle: TabGroupTabNames = TabGroupTabNames.ORDER;
  //   // service.ordTabGroup =  fixture.nativeElement.ordTabGroup;
  //   // service.ordTabGroup.selectedIndex = 1;
  //   spyOn(service.ordTabGroup, 'selectedIndex');
  //
  //   // Act
  //   let result: undefined | number = service.getSelectedSubTabGroupIndex(tabTitle);
  //
  //   // Assert
  //   expect(result).toBeDefined();
  // });

  // TypeError: Cannot set properties of undefined (setting 'selectedIndex')
  // it('should select customer tab', () => {
  //
  //   // Arrange
  //   const title: string = constantsService.REFTABLE_ORDERS_TITLE;
  //   const subTabTitle: SubTabGroupTabNames.ORDER_DETAILS = SubTabGroupTabNames.ORDER_DETAILS;
  //   service.tabGroup = fixture.nativeElement.tabGroup;
  //   service.cusTabGroup = fixture.nativeElement.cusTabGroup;
  //   service.cusTabGroup.selectedIndex = 50;
  //   const spyCDR = spyOn((service as any), 'detectChanges' as any);
  //
  //   // Act
  //   service.selectTab(title, subTabTitle);
  //
  //   // Assert
  //   expect(service.tabGroup.selectedIndex).toEqual(TabGroupTabNumbers.ORDER);
  //   expect(spyCDR).toHaveBeenCalled();
  // });

  //  TypeError: Cannot set properties of undefined (setting 'selectedIndex')
  // it('should select customer tab', () => {
  //
  //   // Arrange
  //   service.cusTabGroup = fixture.nativeElement;
  //   service.customerTitle = TabGroupTabNames.CUSTOMER;
  //   // service.cusTabGroup = service.cusTabGroup;
  //   spyOn(service, 'selectTab').and.callThrough();
  //
  //   // Act
  //   service.selectCustomerTab();
  //   fixture.detectChanges();
  //
  //   // Assert
  //   expect(service.selectTab).toHaveBeenCalled();
  // });

  /**
   public selectCustomerTab() {
    // "Customer" tab is selected by default
    this.selCurrentTabName = this.customerTitle;
    this.selectTab(this.customerTitle);
  }
   public selectOrderTab() {
    this.selCurrentTabName = this.ordersTitle;
    this.selectTab(this.ordersTitle);
  }
   public selectOrderPositionsTab() {
    this.selCurrentTabName = this.ordersTitle;
    this.selectTab(this.ordersTitle, SubTabGroupTabNames.ORDER_DETAILS);
  }
   public selectDeliveryNoteTab() {
    this.selCurrentTabName = this.delNotesTitle;
    this.selectTab(this.delNotesTitle);
  }
   public selectInvoiceTab() {
    this.selCurrentTabName = this.invoicesTitle;
    this.selectTab(this.invoicesTitle);
  }
  */



});
