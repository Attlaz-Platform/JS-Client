export class Branch {
    public id: string;
    public code: string;
    public name: string;
    public default: boolean = false;
    public active: boolean = true;

    constructor(id: string, code: string, name: string) {
        this.id = id;
        this.code = code;
        this.name = name;
    }

    public static parse(rawBranch: any): Branch {
        let branch: Branch = new Branch(rawBranch.id, rawBranch.code, rawBranch.name);
        branch.default = (rawBranch.default.toString() === '1');
        branch.active = (rawBranch.active.toString() === '1');
        return branch;
    }
}
