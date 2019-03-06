using Contract;
using Data;
using Data.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson.Serialization.Conventions;
using workflow.Core.Service.Contracts;
using Workflow.Core.Service.Contracts;

namespace Log
{
    public class LogSummaryProvider
    {
        private static WorkflowConfig _workflowConfig;
        public LogSummaryProvider(WorkflowConfig workflowConfig)
        {
            _workflowConfig = workflowConfig;
        }

        public async Task<WorkflowInfo> GetPendingTasksByWorkflowId(int workflowId, WorkflowInfo workflow)
        {
            var result = new List<WorkflowInfo>();
            var logs = (await new MongoDbContext(
                    _workflowConfig.DbConfig.ServerAdderss,
                    _workflowConfig.DbConfig.DatabaseName)
                .GetManyById<WorkflowLog>(workflowId)).Where(x => x.WorkflowVersion == workflow.Version);

            var doneLogs = logs
                .Where(x => x.Actions.Where(y => y.TaskId == 0).GroupBy(y => y.Action).Count() == 2).ToList();

            var pendingLogs = logs
                .Where(x => x.Actions.Where(y => y.TaskId == 0).GroupBy(y => y.Action).Count() == 1).ToList();

            foreach (var item in workflow.Graph.NodeDataArray)
            {
                item.PendingNumber = 0;
                item.DoneNumber = 0;
                item.PendingNumber = pendingLogs.Where(x => x.Actions.LastOrDefault().TaskIndex == item.Key).Count();
                item.DoneNumber = doneLogs.Where(x => x.Actions.Where(y => y.TaskId != 0).Last().TaskIndex == item.Key)
                    .Count();
            }
            return workflow;
        }

        public async Task<WorkflowSummaryModel> GetWorkflowSummary(WorkflowInfo model)
        {
            var result = new WorkflowSummaryModel();
            var logs = (await new MongoDbContext(
                    _workflowConfig.DbConfig.ServerAdderss,
                    _workflowConfig.DbConfig.DatabaseName)
                .GetManyById<WorkflowLog>(model.Id)).Where(x => x.WorkflowVersion == model.Version);

            result.Labels = new List<string> { "انجام شده", "در حال انجام" };
            result.WorkflowId = model.Id;
            result.WorkflowName = model.Name;

            var tempDataSet = new DataSet();
            tempDataSet.BackgroundColor = new List<string> { "#FF6384", "#36A2EB" };
            tempDataSet.HoverBackgroundColor = new List<string> { "#FF6384", "#36A2EB" };

            int inProgress = 0;
            int done = 0;

            foreach (var log in logs)
            {
                if (log.Actions.Where(x => x.TaskId == 0).Count() == 2)
                {
                    done++;
                }
                if (log.Actions.Where(x => x.TaskId == 0).Count() == 1)
                {
                    inProgress++;
                }
            }
            tempDataSet.Data = new List<int> { done, inProgress };
            result.Datasets = new List<DataSet>();
            result.Datasets.Add(tempDataSet);
            return result;
        }
    }
}
