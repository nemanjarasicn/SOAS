export function getDocStyles(): Object{
    return {
        prices_table: {
            alignment: 'right',
            margin: [0, 0, 5, 0]
        },
        prices_table_bold: {
            alignment: 'right',
            margin: [0, 0, 5, 0],
            bold: true
        },
        total_sum:{
            fontSize: 13,
            bold: true
        },
        total_sum_value:{
            fontSize: 13,
            bold: true,
            margin: [0, 0, 5, 0],
            alignment: 'right'
        },
        document_meta_description: {
            bold: true,
            margin: [0, 0, 5, 0],
            fontSize: 9
        },
        top_margin: {
            margin: [0, 5, 0, 0]
        },
        bold: {
            bold: true
        },
        tableHeader: {
            bold: true
        },
        underlined: {
            decoration: 'underline'
        },
        larger: {
            fontSize: 15
        },
        smaller: {
            fontSize: 9,
            lineHeight: 1.1
        }
    }
}
