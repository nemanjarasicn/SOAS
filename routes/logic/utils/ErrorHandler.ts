/**
 * Custom error handler
 *
 * Based on:
 *
 * https://www.toptal.com/nodejs/node-js-error-handling
 */

import {CustomError} from "../classes/CustomError";
import {logger} from "./Logger";

class ErrorHandler {
    public async handleError(err: { status: number, message: string, httpCode: number }, res): Promise<void> {
        // console.log('NEW ERROR OCCURRED: ', err);
        // ToDo: Generate and add unique ID (Datetime+User+ErrorType) to error message to log it later for user communication
        if (err)
            await logger.error(
                'Error message from ErrorHandler: \n',
                err
            );

        // optional...
        // await sendMailToAdminIfCritical();
        // await sendEventsToSentry();

        res.status(err.status || err.httpCode || 500).send({
            status: err.status || err.httpCode || 500,
            error: true,
            message: 'something went wrong',
            data: [{message: err.message}]
        });
    }

    /**
     * warning example
     */
    public async handleWarning(msg: string): Promise<void> {
        await logger.warn('Error Warning');
    }

    public isTrustedError(error: { status: number, message: string }) {
        if (error instanceof CustomError) {
            return error.isOperational;
        }
        return false;
    }
}
export const errorHandler = new ErrorHandler();
