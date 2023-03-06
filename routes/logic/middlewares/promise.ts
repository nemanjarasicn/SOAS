/**
 * Promise middleware
 *
 * Using custom error handler
 *
 * Based on:
 * https://www.toptal.com/express-js/routes-js-promises-error-handling
 * https://github.com/vssenko/express-promises-example
 */

import {errorHandler} from "../utils/ErrorHandler";

const handleResponse = (res, data) => res.status(200).send({
    status: 200,
    error: false,
    message: 'OK',
    data: [data]
});

module.exports = function promiseMiddleware() {
    return (req, res, next) => {
        res.promise = (p) => {
            let promiseToResolve;
            if (p.then && p.catch) {
                promiseToResolve = p;
            } else if (typeof p === 'function') {
                promiseToResolve = Promise.resolve().then(() => p());
            } else {
                promiseToResolve = Promise.resolve(p);
            }

            return promiseToResolve
                .then((data) => {
                    handleResponse(res, data)
                })
                .catch(async (e) => {
                    await errorHandler.handleError(e, res); // utils error handler > handle error function
                });
        };

        return next();
    };
}
