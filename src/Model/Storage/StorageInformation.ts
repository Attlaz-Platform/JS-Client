export class StorageInformation {
    bytes: number;
    // null = explicitly unlimited at some scope in the configuration chain.
    bytes_limit: number | null;
    items: number;
    pools: {
        name: string;
        bytes: number;
        items: number;
    }[];
}
