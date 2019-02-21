using Contract;
using Contract.Common;
using InfraStructure;
using InfraStructure.cs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using workflow.Core.Service.Contracts;
using Workflow.Core.Service.Contracts;

namespace Host.Controllers
{
    public class WorkflowController : Controller
    {
        private static IOptions<Configuration> _config;
        private static IOptions<WorkflowConfig> _dbConfig;
        public WorkflowController(IOptions<Configuration> config, IOptions<WorkflowConfig> dbConfig)
        {
            _config = config;
            _dbConfig = dbConfig;
        }
        public List<WorkflowInfo> GetWorkFlows()
        {
            return new WorkflowGet(_config.Value,_dbConfig.Value).GetLatestWorkflows().Data;
        }
        public List<WorkflowInfo> GetHistoryWorkflows([FromBody]WorkflowRequestModel model)
        {
            return new WorkflowGet(_config.Value, _dbConfig.Value).GetHistoryWorkflows(model.Id).Data;
        }
        [HttpPost]
        public void StartCustomWorkFlow([FromBody]StartRequestModel model)
        {
            new WorkflowAction(_config.Value, _config.Value.TaskLoopInterval, _dbConfig.Value).StartCustomWorkFlow(model.Id, model.TaskModel, model.TaskIndex);
        }
        [HttpPost]
        public WorkflowInfo GetWorkflow([FromBody]WorkflowRequestModel model)
        { 
            if (model == null) return  new WorkflowInfo();
            return new WorkflowGet(_config.Value, _dbConfig.Value).GetWorkflow(model.Id, model.Version).Data;
        }
        [HttpPost]
        public WorkflowInfo GetLastVersionWorkflow([FromBody]WorkflowRequestModel model)
        {
            return new WorkflowGet(_config.Value,_dbConfig.Value).GetLastVersionWorkflow(model.Id).Data;
        }
        [HttpPost]
        public List<string> GetSettings(string name)
        {
            return new WorkflowGet(_config.Value, _dbConfig.Value).GetSettings(name).Data;
        }
        [HttpPost]
        public IdVersionModel SaveWorkFlow([FromBody]WorkflowInfo workFlow)
        {
            return new WorkflowModify(_config.Value,_dbConfig.Value).SaveWorkflow(workFlow).Data;
        }
        [HttpPost]
        public GraphModel GetExecutionGraph([FromBody]WorkflowRequestModel workFlow)
        {
            return new WorkflowGet(_config.Value, _dbConfig.Value).GetExecutionGraph(workFlow.Id, workFlow.Version).Data;
        }
        public List<TaskNameModel> GetTaskNames()
        {
            return new WorkflowGet(_config.Value, _dbConfig.Value).GetTaskNames().Data;
        }
        public void DeleteWorkflow([FromBody]WorkflowRequestModel model)
        {
            new WorkflowGet(_config.Value, _dbConfig.Value).DeleteWorkflow(model.Id, model.Version);
        }
    }
}
