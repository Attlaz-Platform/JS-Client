export class Job {

    public id: number;
    public branch: number;
    public label: number;
    public active: boolean;
    // private _testclass: TestClass;
    //
    constructor(id: number, branch: number) {
        this.id = id;
        this.branch = branch;
    }
}