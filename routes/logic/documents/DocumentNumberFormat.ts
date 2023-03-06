/**
 * Helper function to format Costs
 * TODO the thousandsSeparator and decimalSeparator are different for some countries, so it should be translated
 * @author Ronny Brandt
 * @function
 * @param amount
 * @param currencySymbol
 */
export function formatCostAmount(amount: number, currencySymbol: string){
    const thousandsSeparator = '.';
    const decimalSeparator = ',';
    const amountString = String(amount);

    const fullCur = amountString.split('.')[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);

    let fracCur = amountString.split('.')[1] ? amountString.split('.')[1].padEnd(2, '0') : '00';

    return fullCur + decimalSeparator + fracCur + ' ' + currencySymbol;
}

/**
 * Helper function to format weight amounts
 * TODO the decimal separator is different for some countries, so it should be translated
 * @author Ronny Brandt
 * @function
 * @param weight
 */
export function formatWeight(weight: number){
    const decimalSeparator = ',';

    const weightString = String(weight.toFixed(2));

    return weightString.replace('.', decimalSeparator);
}
