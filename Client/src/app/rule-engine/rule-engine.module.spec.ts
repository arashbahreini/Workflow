import { RuleEngineModule } from './rule-engine.module';

describe('RuleEngineModule', () => {
  let ruleEngineModule: RuleEngineModule;

  beforeEach(() => {
    ruleEngineModule = new RuleEngineModule();
  });

  it('should create an instance', () => {
    expect(ruleEngineModule).toBeTruthy();
  });
});
