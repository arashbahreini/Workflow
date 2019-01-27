using Contract;
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
        private static string _workflowSettingsFile;
        public WorkflowModify(string workflowSettingsFile)
        {
            _workflowSettingsFile = workflowSettingsFile;
        }

        public ResultModel<IdVersionModel> SaveWorkflow(WorkflowInfo model)
        {
            var result = new ResultModel<IdVersionModel>();
            try
            {
                var workflowEngine = new WorkflowEngine(_workflowSettingsFile);
                if (model.Id == 0)
                {
                    result.Data = new SaveWorkflowLogic(_workflowSettingsFile).AddNewWorkflow(model, workflowEngine, GetTaskNames().Data);
                }
                else
                {
                    if (model.NewVersion)
                    {
                        result.Data = new SaveWorkflowLogic(_workflowSettingsFile).AddNewVersionWorkflow(model, workflowEngine, GetTaskNames().Data);
                    }
                    else
                    {
                        result.Data = new SaveWorkflowLogic(_workflowSettingsFile).EditWorkflow(model, workflowEngine, GetTaskNames().Data);
                    }
                }
            }
            catch (Exception ex)
            {
                result.Succeed = false;
                result.ErrorMessage = ex.Message.ToString();
            }
            return result;
        }

        public ResultModel<List<TaskNameModel>> GetTaskNames()
        {
            var result = new ResultModel<List<TaskNameModel>>();
            try
            {
                var workflowEngine = new WorkflowEngine(_workflowSettingsFile, true);
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
