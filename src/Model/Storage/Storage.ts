import {StorageType} from './StorageType';

export class Storage {
    name: string;
    type: StorageType;
    pools: string[];
    size_current: number;
    size_total: number;
}
