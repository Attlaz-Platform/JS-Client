import {State} from '../State';
import {StateAware} from '../StateAware';

export class WorkerImage implements StateAware {
    public id: number;
    public name: string;
    public image: string;
    public version: string;
    public language: string;
    public languageVersion: string;
    public buildDate: Date;
    public state: State = State.Active;

    public static parse(raw: any): WorkerImage {
        const worker: WorkerImage = new WorkerImage();
        worker.id = raw.id;
        worker.name = raw.name;
        worker.image = raw.image;
        worker.version = raw.version;
        worker.language = raw.language;
        worker.languageVersion = raw.languageVersion;
        worker.buildDate = raw.buildDate;
        worker.state = State.fromString(raw.state);

        return worker;
    }

}
