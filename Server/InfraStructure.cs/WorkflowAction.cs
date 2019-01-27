using Contract;
using System;
using System.Collections.Generic;
using System.Text;
using workflow.Contract;
using workflow.Core;

namespace InfraStructure
{
    public class WorkflowAction
    {
        private static string _config;
        private static int _taskLoopInterval;
        public WorkflowAction(string workflowSettingsFile, int taskLoopInterval)
        {
            _config = workflowSettingsFile;
            _taskLoopInterval = taskLoopInterval;
        }
        public ResultModel StartCustomWorkFlow(int flowID, string dataContract, int? taskIndex)
        {
            var result = new ResultModel();
            try
            {
                var workflowEngine = new WorkflowEngine(_config);
                var runResult = workflowEngine.StartWorkflowModel(
                    new RequestModel
                    {
                        Id = flowID,
                        TaskModel = dataContract,
                        TaskIndex = taskIndex,
                        UniqKey = Guid.NewGuid().ToString("N"),
                        TaskLoopInterval = _taskLoopInterval == 0 ? _taskLoopInterval : 5
                    });
                if (!runResult)
                {
                    return new ResultModel
                    {
                        Succeed = false,
                        ErrorMessage = "Workflow " + flowID + " not found."
                    };
                }
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
