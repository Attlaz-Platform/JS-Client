import {State} from '../State.js';
import {StateAware} from '../StateAware.js';
import {Utils} from '../../Utils.js';
import {ApiRecord} from '../ApiRecord.js';

export class PlatformImage implements StateAware {
    public id: string;
    public platformId: string;
    public image: string;
    public name: string;
    public version: string;
    public languageVersion: string;
    public buildDate: Date;
    public state: State = State.Active;

    public static parse(raw: ApiRecord): PlatformImage {
        const platformImage: PlatformImage = new PlatformImage();
        platformImage.id = raw.id as string;
        platformImage.platformId = raw.platform as string;
        platformImage.name = raw.name as string;
        platformImage.image = raw.image as string;
        platformImage.version = raw.version as string;
        platformImage.languageVersion = raw.language_version as string;
        platformImage.buildDate = Utils.parseRawDate(raw.build_date as Date);
        platformImage.state = State.fromString(raw.state as string);
        return platformImage;
    }
}
