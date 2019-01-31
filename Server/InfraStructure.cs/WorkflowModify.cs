using Contract;
using Contract.Common;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using workflow.Core;
using workflow.Core.Logic;
using workflow.Core.Service.Contracts;
using Workflow.Core.Service.Contracts;

namespace InfraStructure.cs
{
    public class WorkflowModify
    {
        private static Configuration _configuration;
        public DbConfig _dbConfig;
        public WorkflowModify(Configuration configuration, DbConfig dbConfig)
        {
            _dbConfig = dbConfig;
            _configuration = configuration;
        }

        public ResultModel<IdVersionModel> SaveWorkflow(WorkflowInfo model)
        {
            var result = new ResultModel<IdVersionModel>();
            var workflowEngine = new WorkflowEngine(_configuration, _dbConfig);
            if (model.Id == 0)
            {
                result.Data = new SaveWorkflowLogic(_configuration, _dbConfig).AddNewWorkflow(model, workflowEngine, GetTaskNames().Data);
            }
            else
            {
                if (model.NewVersion)
                {
                    result.Data = new SaveWorkflowLogic(_configuration, _dbConfig).AddNewVersionWorkflow(model, workflowEngine, GetTaskNames().Data);
                }
                else
                {
                    result.Data = new SaveWorkflowLogic(_configuration,_dbConfig).EditWorkflow(model, workflowEngine, GetTaskNames().Data);
                }
            }

            return result;
        }

        public ResultModel<List<TaskNameModel>> GetTaskNames()
        {
            var result = new ResultModel<List<TaskNameModel>>();
            try
            {
                var workflowEngine = new WorkflowEngine(_configuration, _dbConfig,true);
                result.Data = new List<TaskNameModel>();
                result.Data.AddRange(JsonConvert.DeserializeObject<List<TaskNameModel>>(File.ReadAllText(workflowEngine.TasksNamesFile)));
            }
            catch (Exception ex)
            {
                result.Succeed = false;
                result.ErrorMessage = ex.Message.ToString();
            }
            return result;
        }

    }
}
