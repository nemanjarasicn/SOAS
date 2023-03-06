import {formatCostAmount, formatWeight} from "./DocumentNumberFormat";
import {SequelizeModel} from "../constants/constants";
import {DocumentData, DocumentName, TextStack} from "./DocumentData";

interface PositionData {
    id: number,
    positionId: number,
    itm: string,
    comps: string[],
    qty: number,
    deliveredQty: number,
    priceNet: number,
    priceBru: number,
    description: string,
    parentLineId: number,
    weightPerItem: number
}
interface LineAmounts {
    quantity: string,
    lineSingle: string,
    lineTotal: string
}

/**
 * This function will return all amounts for a single position item.
 * On delivery notes it returns weights and delivered qty,
 * on orders and invoices it returns prices and ordered / invoiced qty
 * @author Ronny Brandt
 * @function
 * @param avisName
 * @param pos
 * @param currencySymbol
 */
function getLineAmounts(avisName: DocumentName, pos: PositionData, currencySymbol: string): LineAmounts{
    let lineSingle: string = formatCostAmount(pos.priceBru, currencySymbol);
    let lineTotal: string = formatCostAmount(pos.priceBru * pos.qty, currencySymbol);
    let quantity: string = String(pos.qty);
    if(avisName === DocumentName.DELIVERY_NOTE){
        lineSingle = formatWeight(pos.weightPerItem);
        lineTotal = formatWeight(pos.weightPerItem * pos.deliveredQty);
        quantity = String(pos.deliveredQty);
    }
    return {quantity: quantity, lineSingle: lineSingle, lineTotal: lineTotal};
}

/**
 * Describes a single position table row item.
 * TODO could be replaced with a class if we want to make this more dynamic
 * @author Ronny Brandt
 * @function
 * @param counter
 * @param pos
 * @param lineAmounts
 */
function getPositionTableRow(counter: number, pos: PositionData, lineAmounts: LineAmounts): TextStack[]{
    return [
        {text: String(counter), style: 'top_margin'},
        {
            stack: [
                {text: pos.itm, style: 'bold'},
                {text: 'Dieser Artikel enthält:'},
                {text: pos.comps.join(', '), style: 'smaller'}
            ],
            style: 'top_margin'
        },
        {text: lineAmounts.quantity, style: 'top_margin'},
        {text: lineAmounts.lineSingle, style: 'top_margin'},
        {text: lineAmounts.lineTotal, style: 'top_margin'}
    ];
}

/**
 * A function to return the table body array for the positions
 * @author Ronny Brandt
 * @function
 * @param avisName
 * @param data
 * @param headers
 * @param currencySymbol
 */
function buildDocumentPositionsBody(
        avisName: DocumentName,
        data: PositionData[],
        headers: string[],
        currencySymbol: string): Object[]{

    const body = [];
    const head = [];

    for(const h of headers) head.push({text: h, style: 'tableHeader'});

    body.push(head);

    // the array of positions will be sorted by positionID,
    // so we can use a counter here to mark positions
    let counter = 0;
    for(const pos of data){
        counter++;
        const lineAmounts: LineAmounts = getLineAmounts(avisName, pos, currencySymbol);
        body.push(getPositionTableRow(counter, pos, lineAmounts));
    }

    return body;
}

/**
 * Extracts PositionData from SequelizeModel[] and sorts the output based on the positionId.
 * On some inputs not all values will be filled,
 * when the values don't exist in their corresponding models (like deliveredQty dos not exist in InvoicePositions).
 * However, those values are only used in templates where the values exist by definition
 * @author Ronny Brandt
 * @function
 * @param positions
 */
function compileDocumentPositions(positions: SequelizeModel[]): PositionData[]{
    let posData = [];
    for(const position of positions){
        posData.push({
            id: position.getDataValue('ID'),
            positionId: position.getDataValue('POSITION_ID') / 1000,
            itm: position.getDataValue('ITMNUM'),
            comps: [],
            qty: position.getDataValue('ORDER_QTY'),
            deliveredQty: position.getDataValue('DELIVERY_QTY'),
            priceNet: position.getDataValue('PRICE_NET'),
            priceBru: position.getDataValue('PRICE_BRU'),
            description: position.getDataValue('ITMDES'),
            parentLineId: position.getDataValue('PARENT_LINE_ID'),
            weightPerItem: position.getDataValue('WEIGHT_PER')
        });
    }

    let setPositions = posData.filter(pos => !pos.parentLineId);
    for(const setPosition of setPositions){
        for(const pos of posData){
            if(setPosition.id === pos.parentLineId)
                setPosition.comps.push(pos.itm);
        }
    }

    // sort all positions based on their positionIds
    setPositions.sort((a, b) => a.positionId < b.positionId ? 0 : 1);
    return setPositions;
}

/**
 * Returns the table headers based on the DocumentName property of the related DocumentData
 * @author Ronny Brandt
 * @function
 * @param avisName
 */
function getPositionTableHeaders(avisName: DocumentName){
    let headers = ['Pos', 'Bezeichnung', 'Menge', 'Einzelpreis', 'Betrag'];
    if(avisName === DocumentName.DELIVERY_NOTE)
        headers = ['Pos', 'Bezeichnung', 'Menge', 'Einzelgewicht', 'Gesamtgewicht'];
    return headers;
}

/**
 * Collects data and passes it along to the other functions in this file
 * to generate the position table body
 * @author Ronny Brandt
 * @function
 * @param docData
 */
export function getDocumentPositions(docData: DocumentData): Object[]{
    const positions = docData.avis.getDataValue(docData.positionModel)
    const currencySymbol = docData.avis.getDataValue('Currency').getDataValue('CURRENCY_SYMBOL');
    const headers = getPositionTableHeaders(docData.avisName);

    const data: PositionData[] = compileDocumentPositions(positions);
    return buildDocumentPositionsBody(docData.avisName, data, headers, currencySymbol);
}
