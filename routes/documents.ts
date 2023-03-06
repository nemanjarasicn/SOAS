import express from 'express';
import {TradeDocument} from "./logic/documents/TradeDocument";

const router = express.Router();

router.get('/generate', function(req, res){
    const queryParams = req.query;
    console.log(queryParams);

    if(queryParams.hasOwnProperty('documentNumber') &&
        typeof queryParams.documentNumber === 'string') {

        const document = new TradeDocument(queryParams.documentNumber);
        document.createDocument()
            .then(r => res.send({docUri: r}))
            .catch(err => {throw err});

    }else throw new Error('documentNumber was not provided or is not a string');
});

module.exports = router;
