# Log Informationen:

## Die Logs werden per winston ausgegeben und in die log-Dateien vom /logs Ordner geschrieben.
Bei logger.info ist es wichtig für die richtige Formattierung die Nutzung von "+" anstelle ",".

Anbindung:

		let logger = require('./config/winston');

Logging per:

        logger.info('Alle OK !!!');
        
        logger.info('Description: ' + activeBatches[i]['BATCH_DESCRIPTION']);
        
        logger.warn('Maybe important error: ', new Error('Error passed as meta'));
        
        logger.error(new Error('Error as info'));
