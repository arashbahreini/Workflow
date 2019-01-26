import { RuleTypeModel } from './rule-type.model';
import { ProvinceModel } from './province.model';
import { OperatorModel } from './operator.model';
import { BussinessCategoryModel } from './Bussiness-category.model';
import { BrandModel } from './brand.model';
import { BankModel } from './bank.model';
import { ConnectionTypeModel } from './connection-type.model';

export class RuleGroupModel {
  public Id: number;
  public CartableType: number;
  public Description: string;
  public IsActive: boolean;
  public Name: string;
  public RuleItems: RuleItemModel[];
  public StartDate: string;
  public EndDate: string;
  public select?: boolean;
  public RuleExceptions: RuleExceptionModel[];
  constructor() {
    this.RuleItems = [];
    this.IsActive = true;
    this.RuleExceptions = [];
  }
}

export class RuleExceptionModel {
  public TerminalNumber: number;
  public NationalCode: number;
  public AcceptorNumber: number;
  public Iban: number;
}

export class RuleItemModel {
  public Id: number;
  public RuleGroupId: number;
  public BodyObj: RuleItemBody;
  public Body: string;
  public Province: ProvinceModel;
  public ProvinceId: number;
  public BussinessCategory: BussinessCategoryModel;
  public BussinessCategoryId: number;
  public Brand: BrandModel;
  public BrandId: number;
  public Bank: BankModel;
  public ConnectionType: ConnectionTypeModel;
  public BankId: number;
  public RuleType: RuleTypeModel;
  public Operator: OperatorModel;
  public StartDate: string;

  // CLIENT ITEMS
  public addMode: boolean;
  constructor() {
    this.BodyObj = new RuleItemBody();
    this.Province = new ProvinceModel();
    this.BussinessCategory = new BussinessCategoryModel();
    this.Brand = new BrandModel();
    this.Bank = new BankModel();
  }
}

export class RuleItemBody {
  public LeftOperand: string;
  public Operator: string;
  public RightOperand: any[];

  constructor() {
    this.RightOperand = [];
  }
}
