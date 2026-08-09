import {ApiRecord} from './ApiRecord.js';

/**
 * A timezone the platform accepts, as reported by the API.
 *
 * The list comes from the server rather than from the browser's own `Intl`: the two run different
 * tz database versions, so a browser-built list can offer a zone the API then rejects, or spell one
 * differently from the name the API stores.
 */
export class Timezone {
    public name: string;

    /**
     * Offset from UTC in minutes at the moment the API answered — positive east of Greenwich, and
     * not a whole number of hours everywhere (Asia/Katmandu is 345). It follows daylight saving, so
     * it is a value to display, never one to store or to compare zones by.
     */
    public utcOffsetMinutes: number;

    public static parse(raw: ApiRecord): Timezone {
        const timezone: Timezone = new Timezone();
        timezone.name = raw.name as string;
        timezone.utcOffsetMinutes = raw.utc_offset_minutes as number;

        return timezone;
    }
}
