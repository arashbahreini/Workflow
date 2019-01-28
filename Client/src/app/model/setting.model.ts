export class SettingModel {
    public workflowId?: number;
    public attributes: any[];
    public name: string;
    public value: any;
    public users?: string[];
    public roles?: string[];
    public rules?: number[];
    public isNewSetting?: boolean;

    constructor() {
        this.users = [];
        this.rules = [];
    }
}

