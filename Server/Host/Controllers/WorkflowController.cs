using Contract;
using Contract.Common;
using InfraStructure;
using InfraStructure.cs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using workflow.Core;
using workflow.Core.Service.Contracts;
using Workflow.Core.Service.Contracts;

namespace Host.Controllers
{
    public class WorkflowController : Controller
    {
        private static IOptions<Configuration> _config;
        public WorkflowController(IOptions<Configuration> config)
        {
            _config = config;
        }
        public List<WorkflowInfo> GetWorkFlows()
        {
            return new WorkflowGet(_config.Value).GetLatestWorkflows().Data;
        }
        public List<WorkflowInfo> GetHistoryWorkflows(WorkflowRequestModel model)
        {
            return new WorkflowGet(_config.Value).GetHistoryWorkflows(model.Id).Data;
        }
        [HttpPost]
        public void StartCustomWorkFlow(StartRequestModel model)
        {
            new WorkflowAction(_config.Value, _config.Value.TaskLoopInterval).StartCustomWorkFlow(model.Id, model.TaskModel, model.TaskIndex);
        }
        [HttpPost]
        public WorkflowInfo GetWorkflow(WorkflowRequestModel model)
        {
            return new WorkflowGet(_config.Value).GetWorkflow(model.Id, model.Version).Data;
        }
        [HttpPost]
        public WorkflowInfo GetLastVersionWorkflow(WorkflowRequestModel model)
        {
            return new WorkflowGet(_config.Value).GetLastVersionWorkflow(model.Id).Data;
        }
        [HttpPost]
        public List<string> GetSettings(string name)
        {
            return new WorkflowGet(_config.Value).GetSettings(name).Data;
        }
        [HttpPost]
        public IdVersionModel SaveWorkFlow([FromBody]WorkflowInfo workFlow)
        {
            return new WorkflowModify(_config.Value).SaveWorkflow(workFlow).Data;
        }
        [HttpPost]
        public GraphModel GetExecutionGraph(WorkflowRequestModel workFlow)
        {
            return new WorkflowGet(_config.Value).GetExecutionGraph(workFlow.Id, workFlow.Version).Data;
        }
        public List<TaskNameModel> GetTaskNames()
        {
            return new WorkflowGet(_config.Value).GetTaskNames().Data;
        }
        public void DeleteWorkflow(WorkflowRequestModel model)
        {
            new WorkflowGet(_config.Value).DeleteWorkflow(model.Id, model.Version);
        }
    }
}
