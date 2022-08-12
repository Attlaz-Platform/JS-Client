import {State} from '../State';
import {StateAware} from '../StateAware';
import {Utils} from '../../Utils';

export class PlatformImage implements StateAware {
    public id: number;
    public platformId: number;
    public image: string;
    public version: string;
    public languageVersion: string;
    public buildDate: Date;
    public state: State = State.Active;

    public static parse(raw: any): PlatformImage {
        const platformImage: PlatformImage = new PlatformImage();
        platformImage.id = raw.id;
        platformImage.platformId = raw.platformId;
        platformImage.image = raw.image;
        platformImage.version = raw.version;
        platformImage.languageVersion = raw.languageVersion;
        platformImage.buildDate = Utils.parseRawDate(raw.buildDate);
        platformImage.state = State.fromString(raw.state);
        return platformImage;
    }

}
