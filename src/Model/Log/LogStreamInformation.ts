import {LogLevel} from './LogLevel';
import {DataValueValue} from '../DataValue';
import {LogStreamId} from './LogStreamId';

export class LogStreamInformation {

    logStreamId: LogStreamId;
    logLevels: { logLevel: LogLevel; count: number }[];
    tags: { tag: string; values: { value: DataValueValue; count: number }[] }[];

    public static parse(raw: any): LogStreamInformation {

        const rawData: { log_stream: string; log_levels: { log_level: string, count: number }[], tags: any } | null = raw;
        if (rawData === null || rawData === undefined) {
            throw new Error('Invalid response');
        }

        const result: LogStreamInformation = new LogStreamInformation();
        result.logStreamId = new LogStreamId(rawData.log_stream);

        /**
         * LogLevel
         */
        result.logLevels = [];
        for (const logLevel of rawData.log_levels) {
            result.logLevels.push({logLevel: LogLevel.fromString(logLevel.log_level), count: logLevel.count});
        }
        /**
         * Tags
         */
        result.tags = [];
        for (const tag of rawData.tags) {
            const values: { value: DataValueValue; count: number }[] = [];
            for (const tagValue of tag.values) {
                values.push({value: tagValue.value, count: tagValue.count});
            }
            result.tags.push({tag: tag.tag, values: values});

        }

        // Object.keys(rawData.level_count).forEach((logLevelKey: string, index) => {
        //
        //     const logLevel: LogLevel = LogLevel.fromString(logLevelKey);
        //
        //     const parsedCount: number | null = parseInt(rawData.level_count[logLevelKey], undefined);
        //     if (parsedCount !== null) {
        //         logLevels.set(logLevel, parsedCount);
        //     } else {
        //         console.error('Unserialize log level count: Unable to parse log level count', rawData.level_count[logLevelKey]);
        //     }
        //
        // });

        // const tags: Map<string, DataValueValue[]> = new Map<string, DataValueValue[]>();
        // if (rawData.tags !== null && rawData.tags !== undefined) {
        //
        //     Object.keys(rawData.tags).forEach((tagKey: string, index) => {
        //
        //         const values: DataValueValue[] = rawData.tags[tagKey];
        //
        //         tags.set(tagKey, values);
        //
        //     });
        // }
        // throw new Error('Need update!');
        return result;

    }
}
