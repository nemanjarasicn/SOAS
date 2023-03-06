import {fakeAsync, TestBed} from '@angular/core/testing';

import { MessagesService } from './messages.service';
import {Confirmation, ConfirmationService, MessageService} from 'primeng/api';
import {TranslateItPipe} from '../shared/pipes/translate-it.pipe';
import {TestingModule} from '../testing/testing.module';

describe('MessagesService', () => {
  let service: MessagesService;
  let translate: TranslateItPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [TranslateItPipe],
      providers: [MessageService, TranslateItPipe]
    });
    service = TestBed.inject(MessagesService);
    translate = TestBed.inject(TranslateItPipe);
    service.setTranslatePipe(translate);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('showInfoDialog show dialog', () => {

    // Arrange
    const service: MessagesService = TestBed.inject(MessagesService);
    window['CONSTANTS'] = 'nonavigation'; // declare constants

    // Act
    service.showInfoDialog(service, 'description', 'text');

    // Assert
    expect(service.dialog).toBeTruthy();
  });

  it('showConfirmationDialog show confirmation dialog with accept and returns true', fakeAsync(() => {

    // Arrange
    const service: MessagesService = TestBed.inject(MessagesService);
    const confirmationService: ConfirmationService = TestBed.inject(ConfirmationService);
    const tableServiceResponse = true;
    spyOn(confirmationService, "confirm").and.callFake((confirmation: Confirmation) => confirmation.accept());

    // Act & Assert
    expectAsync(service.showConfirmationDialog( 'dialogTitle', 'dialogMessage', 'buttonYesText',
      'buttonNoText')).toBeResolvedTo(tableServiceResponse);
  }));

  it('showConfirmationDialog show confirmation dialog with reject and returns false', fakeAsync(() => {

    // Arrange
    const service: MessagesService = TestBed.inject(MessagesService);
    const confirmationService: ConfirmationService = TestBed.inject(ConfirmationService);
    const tableServiceResponse = false;
    spyOn(confirmationService, "confirm").and.callFake((confirmation: Confirmation) => confirmation.reject());

    // Act & Assert
    expectAsync(service.showConfirmationDialog( 'dialogTitle', 'dialogMessage', 'buttonYesText',
      'buttonNoText')).toBeRejectedWith(tableServiceResponse);
  }));

  it('showSuccessMessage returns true (show success message) if messageService is set', () => {

    // Arrange
    let message: MessageService = TestBed.inject(MessageService);

    // Act
    let result: boolean = service.showSuccessMessage('message');

    // Assert
    expect(result).toBeTruthy();
  })

  it('showInfoMessage returns true (show info message) if messageService is set', () => {

    // Arrange
    let message: MessageService = TestBed.inject(MessageService);

    // Act
    let result: boolean = service.showInfoMessage('message');

    // Assert
    expect(result).toBeTruthy();
  })

  it('showErrorMessage returns true (show error message) if messageService is set', () => {

    // Arrange
    let message: MessageService = TestBed.inject(MessageService);

    // Act
    let result: boolean = service.showErrorMessage('message');

    // Assert
    expect(result).toBeTruthy();
  })

  it('showErrorMessage returns true (show error message) if messageService is set and close message', () => {

    // Arrange
    let message: MessageService = TestBed.inject(MessageService);

    // Act
    let result: boolean = service.showErrorMessage('message', true);

    // Assert
    expect(result).toBeTruthy();
  })

  it('setMessageService returns true if messageService is set', () => {

    // Arrange
    let message: MessageService = TestBed.inject(MessageService);

    // Act
    let result: boolean =  service.isMessageServiceSet();

    // Assert
    expect(result).toEqual(true);
  })

  it('setTranslatePipe returns false if translatePipe is not set', () => {

    // Arrange

    // Act
    service.setTranslatePipe(undefined);

    // Assert
    expect(service['translatePipe']).toEqual(undefined);
  })

  it('setTranslatePipe returns true (show error message) if translatePipe is set', () => {

    // Arrange

    // Act
    service.setTranslatePipe(translate);

    // Assert
    expect(service['translatePipe']).toEqual(translate);
  })

  it ('clearMessages should be called for clearing messages', () => {

    // Arrange
    let message: MessageService = TestBed.inject(MessageService);
    spyOn(service, 'clearMessages').and.callThrough();

    // Act
    let messageResult: boolean = service.isMessageServiceSet();
    service.clearMessages();

    // Assert
    expect(messageResult).toEqual(true);
    expect(service.clearMessages).toHaveBeenCalled();
  })

  it('should return translated error message', () => {

    // Arrange
    const errorText: string = 'MUST_BE_A_PRICE';
    const fieldValue: string = 'abc';
    const fieldName: string = 'PRICE_NET';
    const translatePipe = TestBed.inject(TranslateItPipe);
    service.setTranslatePipe(translatePipe);
    const expectedResult: string = errorText;

    // Act
    const result: string = service.getErrorMessage(errorText, fieldValue, fieldName);

    // Assert
    expect(result).toEqual(expectedResult);
  });

});
