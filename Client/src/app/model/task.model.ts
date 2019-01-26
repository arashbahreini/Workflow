import { SettingModel } from './setting.model';

export class TaskModel {
    public Description: string;
    public description: string;
    public Id: number;
    public IsEnabled: boolean;
    public Name: string;
    public Settings: SettingModel[];
    public PersianName: string;
    public IsCommon?: boolean;
    public type: string;
    public parentTask: TaskModel;
    public isIf: boolean;
    public isTask: boolean;
    public isSwitch: boolean;
    public isInSwitch: boolean;
    public caseValue: string;
    public caseLinkValue: string;
    public isInWhile: boolean;
    public isWhile: boolean;
    public ifResult: boolean;
    public whileResult: boolean;
    public key: number;
    public text: string;
    public doNodeId: number;
    public elseNodeId: number;
    public doWhileKeys: number[];
    public elseWhileKeys: number[];
    public taskId: number;
    public isRoot: boolean;
    public goToWhile: boolean;
    public isDefault: boolean;
    public isDefaultInSwitch: boolean;

    constructor() {
        this.IsEnabled = true;
        this.Description = '';
        this.Settings = [];
        this.IsCommon = false;
    }
}
