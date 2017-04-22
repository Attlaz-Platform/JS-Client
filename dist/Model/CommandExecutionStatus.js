"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CommandExecutionStatus;
(function (CommandExecutionStatus) {
    CommandExecutionStatus[CommandExecutionStatus["PENDING"] = "pending"] = "PENDING";
    CommandExecutionStatus[CommandExecutionStatus["RUNNING"] = "running"] = "RUNNING";
    CommandExecutionStatus[CommandExecutionStatus["COMPLETE"] = "complete"] = "COMPLETE";
})(CommandExecutionStatus || (CommandExecutionStatus = {}));
exports.default = CommandExecutionStatus;
