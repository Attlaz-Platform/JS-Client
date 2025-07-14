export abstract class EntityId {
    protected readonly abstract TYPE: string;

    public constructor(protected readonly id: string) {
        if (id === null || id === undefined || (id + '').length < 1) {
            throw new Error('Invalid entity id (' + this.constructor.name + ')');
        }
        if ((id + '').length !== 27) {
            // console.error('Id `' + id + '` does not seem a valid KSUID (type `' + this.getIdType() + '`)');
        }
    }

    public getIdType(): string {
        return this.TYPE;
    }

    public toString(): string {
        return this.id;
    }

    public jsonSerialize(): any {
        return this.toString();
    }

    public isEqual<T extends this>(entityId: T): boolean {
        if (this.getIdType() !== entityId.getIdType()) {
            throw new Error('Types are not the same');
        }

        return this.getIdType() !== '' && entityId.getIdType() !== '' && this.getIdType() === entityId.getIdType() && this.toString() === entityId.toString();
    }
}
