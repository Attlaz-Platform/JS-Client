"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Job_1 = require("./Model/Job");
var Client = (function () {
    function Client(apiEndpoint) {
        this.apiEndpoint = '';
        this.apiEndpoint = apiEndpoint;
    }
    // get name() {
    //     return this._name;
    // }
    //
    // set name(value: string) {
    //     this._name = value;
    // }
    Client.prototype.getJobs = function () {
        return [new Job_1.Job(0, 0)];
    };
    return Client;
}());
exports.Client = Client;
