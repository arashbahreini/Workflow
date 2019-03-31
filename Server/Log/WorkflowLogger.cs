using Contract;
using Data;
using Data.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using workflow.Contract;

namespace Log
{
    public class WorkflowLogger
    {
        private static WorkflowConfig _workflowConfig;

        public WorkflowLogger(WorkflowConfig workflowConfig)
        {
            _workflowConfig = workflowConfig;
        }
        public async Task<ResultModel> StartWorkflowLogger(WorkflowLog model)
        {
            if (model.Actions == null)
            {
                model.Actions = new List<WorkflowAction>();
                model.Actions.Add(new WorkflowAction
                {
                    Action = 1,
                    CreationDate = DateTime.Now,
                });
            }
            await new MongoDbContext(_workflowConfig.DbConfig.ServerAdderss, _workflowConfig.DbConfig.DatabaseName)
                .AddOne<WorkflowLog>(model);
            return new ResultModel();
        }

        public async Task<ResultModel> AddTaskLogger(RequestModel requestModel, WorkflowAction workflowAction)
        {
            var item = await new MongoDbContext(_workflowConfig.DbConfig.ServerAdderss, _workflowConfig.DbConfig.DatabaseName)
                .GetOneByUniqKey<WorkflowLog>(requestModel.UniqKey);

            if (item.Actions == null) item.Actions = new List<WorkflowAction>();
            item.Actions.Add(workflowAction);

            await new MongoDbContext(_workflowConfig.DbConfig.ServerAdderss, _workflowConfig.DbConfig.DatabaseName)
                .UpdateOne<WorkflowLog, List<WorkflowAction>>(requestModel.UniqKey, "Actions" ,item.Actions);
            return new ResultModel();
        }
    }
}
