import { API_ENDPOINT, cookies } from "../globals";
import { SerializeURI } from "../Utils/StringUtils";

export enum ErrorCode {
    InvalidUser = 401,
}

export declare interface IErrorResponse {
    code: ErrorCode;
    message: string;
}

export enum Method {
    GET = "GET",
    POST = "POST",
}

export class APIRequest<T> {
    protected Method: Method = Method.GET;
    protected Endpoint: string = "";
    protected Body: undefined | object = undefined;
    protected Query: undefined | object = undefined;

    public async Perform() {
        const requestUri = `${API_ENDPOINT}${this.Endpoint}` + (this.Query ? "?" + SerializeURI(this.Query) : "");
        const response = await fetch(requestUri, {
            body: JSON.stringify(this.Body),
            headers: {
                Authorization: "Bearer " + cookies.get("AUTH_TOKEN"),
            },
            method: this.Method,
        });

        const jsonResponse = await response.json();

        if ((jsonResponse as IErrorResponse).code) {
            throw jsonResponse as IErrorResponse;
        }

        return jsonResponse as T;
    }
}
