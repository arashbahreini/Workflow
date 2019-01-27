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

        public ResultModel<List<WorkflowInfo>> GetWorkFlows()
        {
            return new WorkflowGet(_config.Value.WorkflowSettingsFile).GetLatestWorkflows();
        }
        public ResultModel<List<WorkflowInfo>> GetHistoryWorkflows(WorkflowRequestModel model)
        {
            return new WorkflowGet(_config.Value.WorkflowSettingsFile).GetHistoryWorkflows(model.Id);
        }
        [HttpPost]
        public ResultModel StartCustomWorkFlow(StartRequestModel model)
        {
            return new WorkflowAction(_config.Value.WorkflowSettingsFile,_config.Value.TaskLoopInterval).StartCustomWorkFlow(model.Id, model.TaskModel, model.TaskIndex);
        }

        [HttpPost]
        public ResultModel<WorkflowInfo> GetWorkflow(WorkflowRequestModel model)
        {
            return new WorkflowGet(_config.Value.WorkflowSettingsFile).GetWorkflow(model.Id, model.Version);
        }

        [HttpPost]
        public ResultModel<WorkflowInfo> GetLastVersionWorkflow(WorkflowRequestModel model)
        {
            return new WorkflowGet(_config.Value.WorkflowSettingsFile).GetLastVersionWorkflow(model.Id);
        }
        [HttpPost]
        public ResultModel<List<string>> GetSettings(string name)
        {
            return new WorkflowGet(_config.Value.WorkflowSettingsFile).GetSettings(name);
        }
        [HttpPost]
        public ResultModel<IdVersionModel> SaveWorkFlow(WorkflowInfo workFlow)
        {
            return new WorkflowModify(_config.Value.WorkflowSettingsFile).SaveWorkflow(workFlow);
        }
        [HttpPost]
        public ResultModel<GraphModel> GetExecutionGraph(WorkflowRequestModel workFlow)
        {
            return new WorkflowGet(_config.Value.WorkflowSettingsFile).GetExecutionGraph(workFlow.Id, workFlow.Version);
        }

        public ResultModel<List<TaskNameModel>> GetTaskNames()
        {
            return new WorkflowGet(_config.Value.WorkflowSettingsFile).GetTaskNames();
        }
        public ResultModel DeleteWorkflow(WorkflowRequestModel model)
        {
            return new WorkflowGet(_config.Value.WorkflowSettingsFile).DeleteWorkflow(model.Id, model.Version);
        }
    }
}
