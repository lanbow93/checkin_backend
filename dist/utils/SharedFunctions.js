"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.failedRequest = exports.successfulRequest = void 0;
function successfulRequest(response, status, message, data) {
    return response.status(200).json({
        status: status,
        message: message,
        data: data
    });
}
exports.successfulRequest = successfulRequest;
function failedRequest(response, status, message, error) {
    return response.status(400).json({
        status: status,
        message: message,
        error: error
    });
}
exports.failedRequest = failedRequest;
//# sourceMappingURL=SharedFunctions.js.map