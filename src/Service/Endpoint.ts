import {HttpClient} from "..";

export abstract class Endpoint {
    protected httpClient: HttpClient;

    public constructor(httpClient: HttpClient) {
        this.httpClient = httpClient;
    }
}