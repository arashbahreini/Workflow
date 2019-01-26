export class SettingModel {
    public workflowId?: number;
    public Attributes: any[];
    public Name: string;
    public Value: any;
    public Users?: string[];
    public Roles?: string[];
    public Rules?: number[];
    public isNewSetting?: boolean;

    constructor() {
        this.Users = [];
        this.Rules = [];
    }
}

