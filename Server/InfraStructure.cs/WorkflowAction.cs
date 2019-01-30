using Contract;
using Contract.Common;
using System;
using workflow.Contract;
using workflow.Core;

namespace InfraStructure
{
    public class WorkflowAction
    {
        private static Configuration _configuration;
        private static int _taskLoopInterval;
        public WorkflowAction(Configuration configuration, int taskLoopInterval)
        {
            _configuration = configuration;
            _taskLoopInterval = taskLoopInterval;
        }
        public ResultModel StartCustomWorkFlow(int flowID, string dataContract, int? taskIndex)
        {
            var result = new ResultModel();
            try
            {
                var workflowEngine = new WorkflowEngine(_configuration);
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
                throw new Exception(ex.Message);
            }
            return result;
        }
    }
}
