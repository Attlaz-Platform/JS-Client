export class Branch {
    public id: string;
    public code: string;
    public name: string;

    constructor(id: string, code: string, name: string) {
        this.id = id;
        this.code = code;
        this.name = name;
    }

    public static parse(rawBranch: any): Branch {
        return new Branch(rawBranch.id, rawBranch.code, rawBranch.name);
    }
}
