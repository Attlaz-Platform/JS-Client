export class StorageInformation {
    bytes: number;
    bytes_limit: number;
    items: number;
    pools: {
        name: string;
        bytes: number;
        items: number;
    }[];
}
