import {Component, HostListener, Input, ViewChild} from '@angular/core';
import {TableDataService} from '../../../_services/table-data.service';
import {TranslateItPipe} from '../../../shared/pipes/translate-it.pipe';
import {FormGroup} from '@angular/forms';
import {ConstantsService, ViewQueryTypes} from '../../../_services/constants.service';
import {HelperService} from '../../../_services/helper.service';
import {AttributesNamesItem} from '../../../interfaces/attributes-names-item';
import {MessagesService} from '../../../_services/messages.service';

interface Attr {
  id: string,
  name: string
}

@Component({
  selector: 'app-attribute-p-dialog',
  templateUrl: './attribute-p-dialog.component.html',
  styleUrls: ['./attribute-p-dialog.component.css'],
  providers: [TranslateItPipe]
})

/**
 * AttributePDialogComponent - articles primeng dialog to add new attribute
 *
 * Used by: ArticlesComponent
 */
export class AttributePDialogComponent {

  @ViewChild(FormGroup) dialogForm: FormGroup;

  refTableAttributeNames = this.CONSTANTS.REFTABLE_ATTRIBUTE_NAMES;
  @Input() attrViewUpdate: Function;

  dialogWidth: string = '550px';
  dialogHeight: string = '50vh';

  showDialog: boolean;
  display: boolean = false;
  title: string;
  fieldNames: any[];
  fieldsNumber: number;

  selectedAttributeName: Attr;
  selectedAttributeData: any;
  selectedAttributeCheckBoxData: boolean;

  // possible new attributes, that can be added to article...
  possibleNewAttributes: Attr[];
  dataAttributes: AttributesNamesItem[];
  attributesNames: String[];
  articleAttributesNames: String[];

  showInputAttrData: boolean;
  showCheckboxAttrData: boolean;
  showDropdownAttrData: boolean;
  disableDropdown: boolean;

  constructor(private tableDataService: TableDataService,
              private CONSTANTS: ConstantsService,
              public translatePipe: TranslateItPipe,
              public helperService: HelperService,
              public messagesService: MessagesService) {
    this.title = 'CREATE_NEW_ATTRIBUTE';
    this.resetFields();
  }

  /**
   * load attribute names - called, before dialog appears, from articles component > createAttributeItem function
   *
   * @param userAttributes
   */
  async loadAttributeNames(userAttributes: any[]): Promise<boolean> {
    let dbData = await this.tableDataService.getFormDataByCustomersNumber(this.refTableAttributeNames,
      undefined, undefined, undefined, undefined, false);
    if (!dbData) {
      return false;
    }
    this.possibleNewAttributes = [];
    let attrFound: boolean = false;
    for (let item in dbData['formConfig']) {
      if (dbData['formConfig'].hasOwnProperty(item)) {
        let oneItem: Attr = {id: '', name: ''};
        for (let item2 in dbData['formConfig'][item]) {
          if (dbData['formConfig'][item].hasOwnProperty(item2)) {
            if (dbData['formConfig'][item][item2].label === 'ID') {
              oneItem['id'] = dbData['formConfig'][item][item2].value;
            } else if (dbData['formConfig'][item][item2].name === 'ATTRIBUTE_NAME') {
              oneItem['name'] = this.translatePipe.transform(dbData['formConfig'][item][item2].value) +
                ' (' + dbData['formConfig'][item][item2].value + ')';
              this.attributesNames.push(dbData['formConfig'][item][item2].value);
            }
          }
        }
        // check if current attribute is already in users attributes
        attrFound = false;
        for (let userAttrItem in userAttributes) {
          if (userAttributes.hasOwnProperty(userAttrItem)) {
            if (oneItem.name.indexOf(userAttributes[userAttrItem]['ATTRIBUTE_NAME']) !== -1) {
              attrFound = true;
              break;
            }
          }
        }
        // check if current attribute is default one
        if (!attrFound) {
          for (let defAttrItem in this.CONSTANTS.ARTICLE_DEFAULT_ATTRIBUTES) {
            if (oneItem.name.indexOf(this.CONSTANTS.ARTICLE_DEFAULT_ATTRIBUTES[defAttrItem]) !== -1) {
              attrFound = true;
              break;
            }
          }
        }
        if (!attrFound) {
          this.possibleNewAttributes.push(oneItem);
        }
      }
    }
    if (!this.possibleNewAttributes || this.possibleNewAttributes.length === 0) {
      this.messagesService.showInfoMessage('Keine Attribute zum Hinzufügen vorhanden!');
      this.disableDropdown = true;
    }
    return true;
  }

  /**
   * on attribute name has changed event
   *
   * @param event
   */
  attrNameChanged(event) {
    this.showInputAttrData = false;
    this.showCheckboxAttrData = false;
    this.showDropdownAttrData = false;
    this.selectedAttributeCheckBoxData = false;
    this.selectedAttributeData = undefined;
    if (event && event.value && event.value.name) {
      let attrName = this.helperService.getStringInBrackets(event.value.name);
      if (attrName === 'ATTR_YOUTUBE') {
        // input
        this.showInputAttrData = true;
      } else if (attrName === 'ATTR_SHOP_ACTIVE' || attrName === 'ATTR_CRAFT') {
        // checkbox
        this.loadAttributesDataArray(attrName);
        this.showCheckboxAttrData = true;
      } else {
        // dropdown
        this.loadAttributesDataArray(attrName);
        this.showDropdownAttrData = true;
      }
    } else {
      this.selectedAttributeData = undefined;
    }
  }

  /**
   * load attributes data array
   *
   * @param attributeName
   * @private
   */
  private async loadAttributesDataArray(attributeName: string) {
    // ToDo: Don't empty dataAttributes by (this.dataAttributes = [];), otherwise p-dropdown not displays new [options]
    // this.dataAttributes = [];
    let newDataAttrArray = [];
    let itemBasisId = localStorage.getItem(this.CONSTANTS.LS_SEL_ITEM_ID);
    let dbData = await this.tableDataService.checkTableData('checkAttributes',
      {itemBasisId, attributeName}, false);
    if (!dbData) {
      return;
    }
    if (dbData && dbData['result']) {
      if (dbData['result'].length === 0) {
        let attrNamesDbData;
        if (attributeName === 'ATTR_SHOP_ACTIVE' || attributeName === 'ATTR_CRAFT') {
          this.dataAttributes = await this.getAttributeNames();
        } else {
          attrNamesDbData = await this.tableDataService.getTableDataById(this.CONSTANTS.REFTABLE_ATTRIBUTES,
            ViewQueryTypes.DETAIL_TABLE, 'ATTRIBUTE_NAME', attributeName);
          if (!attrNamesDbData) {
            return [];
          }
          if (attrNamesDbData && attrNamesDbData['table'] && attrNamesDbData['table'][1]) {
            for (let item in attrNamesDbData['table'][1]) {
              if (attrNamesDbData['table'][1].hasOwnProperty(item)) {
                let oneItem: Attr = {id: '', name: ''};
                if (attrNamesDbData['table'][1][item].hasOwnProperty('ID')) {
                  oneItem['id'] = attrNamesDbData['table'][1][item]['ID'];
                }
                if (attrNamesDbData['table'][1][item].hasOwnProperty('ATTRIBUTE_DATA')) {
                  // @ToDo: Replace the 'empty' text in the options with translation.
                  oneItem['name'] = (attrNamesDbData['table'][1][item]['ATTRIBUTE_DATA']) ?
                    attrNamesDbData['table'][1][item]['ATTRIBUTE_DATA'] : '';
                }
                if (!this.helperService.isObjectInArray(newDataAttrArray, oneItem)) {
                  newDataAttrArray.push(oneItem);
                }
              }
            }
          }
          this.dataAttributes = newDataAttrArray;
        }
      } else {
        this.messagesService.showErrorMessage('Attribute is already existing for current article!');
      }
    } else {
      // Wrong params ?!
    }
  }

  setShowDialog(showDialog: boolean) {
    this.showDialog = showDialog;
  }

  /**
   * save form 2 types of data to save:
   * 1. checkbox (true/false) : ATTR_SHOP_ACTIVE, ATTR_CRAFT
   * 2. dropdown (select) :
   * 3: input (text) : ATTR_YOUTUBE
   *
   */
  async saveForm() {
    let attributeId: string;
    let attributeName: string;
    // required data to save new attribute:
    // 1. Extract attribute name: ATTR_CRAFT
    let selAttributeData: { attributeName: string, attrNameWithBrackets: string } = await this.getAttributeName();
    attributeName = selAttributeData.attributeName;
    if (this.showDropdownAttrData) {
      attributeId = this.selectedAttributeData.id;
    } else {
      // 2. Load attributes data:
      let attributeToSaveData = await this.tableDataService.getTableDataById(this.CONSTANTS.REFTABLE_ATTRIBUTES,
        ViewQueryTypes.DETAIL_TABLE, 'ATTRIBUTE_NAME', attributeName);
      // 3. Extract the right id of the selected attribute and his value
      attributeId = this.getAttributeId(attributeName, attributeToSaveData);
    }
    if (this.articleAttributesNames.indexOf(attributeName) < 0) {
      // if selected attribute is not available in article attributes...
      let itemBasisId = localStorage.getItem(this.CONSTANTS.LS_SEL_ITEM_ID);
      if (this.attributesNames.indexOf(attributeName) >= 0) {
        let dataArray: {} = {
          ATTRIBUTE_NAME: attributeName,
          ATTRIBUTE_DATA: this.selectedAttributeData
        };
        let primaryKey: string = 'ITEM_BASIS_ID';
        let primaryValue: string = itemBasisId;
        let secondaryKey: string = undefined;
        let secondaryValue: string = undefined;
        let thirdKey: string = undefined;
        let thirdValue: string = undefined;
        // 1. Save name - data pair to Attributes table
        // @ToDo: Check if attribute should be saved or not: Only inputs (Youtube Link) should be saved.
        if (attributeName === 'ATTR_YOUTUBE') {
          const dbData: { result: { success: boolean, message: string, data: [] } } =
            await this.tableDataService.setTableData({
              refTable: this.CONSTANTS.REFTABLE_ATTRIBUTES,
              tableName: this.CONSTANTS.REFTABLE_ATTRIBUTE_RELATIONS_TITLE,
              dataArray: dataArray, primaryKey: primaryKey,
              primaryValue: primaryValue, isIdentity: false, newItemMode: true,
              secondaryKey: secondaryKey, secondaryValue: secondaryValue, thirdKey: thirdKey, thirdValue: thirdValue
            });
          if (dbData && dbData.result && dbData.result.success) {
            // 2. Get ID of the saved attribute.
            let idDbData = await this.tableDataService.getLastIdOfTable('ATTRIBUTES', 'ID');
            if (idDbData && idDbData['id']) {
              await this.saveAttrData(idDbData['id'], itemBasisId, primaryKey, primaryValue,
                secondaryKey, secondaryValue, thirdKey, thirdValue, attributeName);
            } else {
              console.log('ERROR: Last inserted ID was not found...');
            }
          } else {
            this.messagesService.showErrorMessage(dbData.result.message);
          }
        } else {
          await this.saveAttrData(attributeId, itemBasisId, primaryKey, primaryValue,
            secondaryKey, secondaryValue, thirdKey, thirdValue, attributeName);
        }
      } else {
        console.log('Extracted attribute name \'' + attributeName + '\' not exists in attributesNames: ',
          this.attributesNames);
      }
    } else {
      console.log('Attribute name \'' + attributeName + '\' already exists in attributes names select for current article!');
      this.messagesService.showErrorMessage('Attribute \'' + attributeName + '\' existiert bereits für diesen Artikel!');
    }
    //
    // } else {
    //   this.formService.showErrorMessage('Attribute Daten sind fehlerhaft!');
    // }
  }

  /**
   * save attribute data
   *
   * @param attributeId
   * @param itemBasisId
   * @param primaryKey
   * @param primaryValue
   * @param secondaryKey
   * @param secondaryValue
   * @param thirdKey
   * @param thirdValue
   * @param attrName
   * @private
   */
  private async saveAttrData(attributeId: string, itemBasisId: string, primaryKey: string, primaryValue: string,
                             secondaryKey: string, secondaryValue: string, thirdKey: string, thirdValue: string,
                             attrName: string) {
    if (attributeId) {
      // Only not default attributes
      let relDataArray: {} = {ITEM_BASIS_ID: itemBasisId, ATTRIBUTE_ID: attributeId};
      // Check, if for current article an attribute with same id already exists...
      let checkDbData = await this.tableDataService.checkTableData('checkAttributes',
        relDataArray, true);
      if (!checkDbData['result']) {
        // 3. Save Attribute_Relation (ID and ITEM_ID)
        const dbData: { result: { success: boolean, message: string, data: [] } } =
          await this.tableDataService.setTableData({
            refTable: this.CONSTANTS.REFTABLE_ATTRIBUTE_RELATIONS,
            tableName: this.CONSTANTS.REFTABLE_ATTRIBUTE_RELATIONS_TITLE,
            dataArray: relDataArray,
            primaryKey: primaryKey,
            primaryValue: primaryValue,
            isIdentity: false,
            newItemMode: true,
            secondaryKey: secondaryKey,
            secondaryValue: secondaryValue
          });
        if (dbData && dbData.result && dbData.result.success) {
          this.messagesService.showSuccessMessage('SAVEDSUCCESS');
        } else {
          this.messagesService.showErrorMessage(dbData.result.message);
        }
        this.resetFields();
        await this.cancelDialog();
        this.attrViewUpdate();
      } else {
        this.messagesService.showInfoMessage('Attribute \'' + attrName + '\' already exists for selected article.');
      }
    } else {
      this.messagesService.showErrorMessage('Attribute ID was not found...');
    }
  }

  async cancelDialog() {
    this.resetFields();
    let self = this;
    await this.loadAttributeNames([]);
    self.setShowDialog(false);
  }

  setArticleAttributesNames(articleAttributesNames) {
    this.articleAttributesNames = articleAttributesNames;
  }

  /**
   * Manage set field 'ATTRIBUTE_DATA' to lower case
   */
  @HostListener('keyup') onKeyUp() {
    // ToDo: Manage lower case only for input
    if (this.selectedAttributeData) {
      this.selectedAttributeData = this.selectedAttributeData.toLowerCase();
    }
  }

  getDisabled() {
    if(this.showCheckboxAttrData) {
      return !this.selectedAttributeName;
    } else {
      return !this.selectedAttributeName || !this.selectedAttributeData;
    }
  }

  private resetFields() {
    this.showDialog = false;
    this.fieldsNumber = 2;
    this.selectedAttributeName = undefined;
    this.selectedAttributeCheckBoxData = false;
    this.possibleNewAttributes = [];
    this.attributesNames = [];
    this.dataAttributes = [];
    this.showInputAttrData = false;
    this.showCheckboxAttrData = false;
    this.showDropdownAttrData = false;
    this.disableDropdown = false;
  }

  newAttribute($event: MouseEvent) {
    this.tableDataService.openNewWindow($event, this.CONSTANTS.REFTABLE_ATTRIBUTE_NAMES);
  }

  /**
   * get attribute name
   */
  async getAttributeName(): Promise<{ attributeName: string, attrNameWithBrackets: string }> {
    let attributeName: string;
    if ((this.selectedAttributeData && this.selectedAttributeData.id) ||
      (this.showCheckboxAttrData && this.dataAttributes) || (this.showInputAttrData && this.selectedAttributeData)) {
      if (this.showDropdownAttrData) {
        let attrNamesDbData: any[] = await this.getAttributeNames();
        for (let attrNameItem in attrNamesDbData) {
          if (attrNamesDbData[attrNameItem].ID === this.selectedAttributeName.id) {
            attributeName = attrNamesDbData[attrNameItem].ATTRIBUTE_NAME;
            break;
          }
        }
      } else {
        for (let item in this.dataAttributes) {
          if (this.selectedAttributeName.id === this.dataAttributes[item].ID) {
            attributeName = this.dataAttributes[item].ATTRIBUTE_NAME;
            break;
          }
        }
      }
    }
    let attrNameWithBrackets: string = undefined;
    if (this.showDropdownAttrData) {
      attrNameWithBrackets = this.selectedAttributeName['name'];
    } else if (this.showCheckboxAttrData) {
      attrNameWithBrackets = this.selectedAttributeName['name'];
      if (this.dataAttributes && (this.dataAttributes.length > 0) && this.selectedAttributeName) {
        for (let item in this.dataAttributes) {
          if (this.selectedAttributeName['id'] === this.dataAttributes[item].ID) {
            attributeName = this.dataAttributes[item].ATTRIBUTE_NAME;
            break;
          }
        }
      }
      this.selectedAttributeData = this.selectedAttributeCheckBoxData;
    } else if (this.showInputAttrData) {
      attrNameWithBrackets = this.selectedAttributeName['name'];
    }
    return {attributeName, attrNameWithBrackets};
  }

  /**
   * get attribute id for given selected attribute name and data
   * (e.g.: for ATTR_CRAFT the data is value of the checkbox '0' or '1')
   * {ID: 2012, ATTRIBUTE_NAME: 'ATTR_CRAFT', ATTRIBUTE_DATA: '0'}
   * {ID: 2013, ATTRIBUTE_NAME: 'ATTR_CRAFT', ATTRIBUTE_DATA: '1'}
   *
   * @param attributeName
   * @param attributesData
   */
  getAttributeId(attributeName: string, attributesData: {}): undefined|string {
    let attributeId: string;
    let attributeData: string = this.selectedAttributeData ?
      this.selectedAttributeData : this.selectedAttributeCheckBoxData;
    if (attributesData && attributesData['table'] && attributesData['table'][1]) {
      for (let item in attributesData['table'][1]) {
        if (attributesData['table'][1].hasOwnProperty(item)) {
          if ((attributesData['table'][1][item].ATTRIBUTE_NAME === attributeName)
            && (((attributesData['table'][1][item].ATTRIBUTE_DATA === "1") ? 'true' : 'false') ===
              (attributeData ? 'true' : 'false'))) {
            attributeId = attributesData['table'][1][item].ID;
            break;
          }
        }
      }
    }
    return attributeId;
  }

  /**
   * get possible new attributes array
   */
  getPossibleNewAttributes() {
    return this.possibleNewAttributes;
  }

  /**
   * get attribute names - load all items from ATTRIBUTE_NAMES table
   */
  async getAttributeNames(): Promise<AttributesNamesItem[]> {
    let newDataAttrArray: AttributesNamesItem[] = [];
    let attrNamesDbData =
      await this.tableDataService.getFormDataByCustomersNumber(this.CONSTANTS.REFTABLE_ATTRIBUTE_NAMES,
        undefined, undefined, undefined, undefined, false);
    if (!attrNamesDbData) {
      return [];
    }
    if (attrNamesDbData && attrNamesDbData['formConfig']) {
      for (let item in attrNamesDbData['formConfig']) {
        if (attrNamesDbData['formConfig'].hasOwnProperty(item)) {
          let oneItem: AttributesNamesItem = { ID: '', ATTRIBUTE_NAME: '', ATTRIBUTE_FIELD_TYPE: '',
            ATTRIBUTE_DATA_TYPE: ''};
          if (attrNamesDbData['formConfig'][item].hasOwnProperty(0) &&
            attrNamesDbData['formConfig'][item].hasOwnProperty(1)) {
            oneItem.ID = attrNamesDbData['formConfig'][item][0].value;
            oneItem.ATTRIBUTE_NAME = attrNamesDbData['formConfig'][item][1].value;
          }
          if (!this.helperService.isObjectInArray(newDataAttrArray, oneItem)) {
            newDataAttrArray.push(oneItem);
          }
        }
      }
    }
    return newDataAttrArray;
  }
}
