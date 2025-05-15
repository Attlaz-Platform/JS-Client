import {State} from '../State.js';
import {StateAware} from '../StateAware.js';
import {Utils} from '../../Utils.js';

export class PlatformImage implements StateAware {
    public id: string;
    public platformId: string;
    public image: string;
    public name: string;
    public version: string;
    public languageVersion: string;
    public buildDate: Date;
    public state: State = State.Active;

    public static parse(raw: any): PlatformImage {
        const platformImage: PlatformImage = new PlatformImage();
        platformImage.id = raw.id;
        platformImage.platformId = raw.platform;
        platformImage.name = raw.name;
        platformImage.image = raw.image;
        platformImage.version = raw.version;
        platformImage.languageVersion = raw.language_version;
        platformImage.buildDate = Utils.parseRawDate(raw.build_date);
        platformImage.state = State.fromString(raw.state);
        return platformImage;
    }
}
