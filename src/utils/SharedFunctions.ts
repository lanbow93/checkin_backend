import express from "express"


export function successfulRequest(response: express.Response, status: string, message: string, data: object | string): express.Response {
    return response.status(200).json({
        status: status,
        message: message,
        data: data
    })
}

export function failedRequest(response: express.Response, status: string, message: string, error: object | string): express.Response {
    return response.status(400).json({
        status: status,
        message: message,
        error: error
    })
}