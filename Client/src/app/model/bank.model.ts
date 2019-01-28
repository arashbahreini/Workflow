import { BranchModel } from './branch.model';

export class BankModel {
    public Id: number;
    public Title: string;
    public branches: BranchModel[];

    constructor() {
        this.branches = [];
    }
}
