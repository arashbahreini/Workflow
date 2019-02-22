using Contract;
using Contract.Common;
using InfraStructure.cs;
using Log;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using workflow.Core.Service.Contracts;
using Workflow.Core.Service.Contracts;

namespace Host.Controllers
{
    public class WorkflowLogController : Controller
    {
        private static IOptions<Configuration> _config;
        private static IOptions<WorkflowConfig> _dbConfig;
        public WorkflowLogController(IOptions<Configuration> config, IOptions<WorkflowConfig> dbConfig)
        {
            _config = config;
            _dbConfig = dbConfig;
        }

        [HttpGet]
        public List<NameIdModel> GetWorkflowNames()
        {
            return new WorkflowGet(_config.Value, _dbConfig.Value).GetAllLastVersionWorkflows();
        }

        [HttpPost]
        public async Task<WorkflowSummaryModel> GetWorkflowSummaryModels(WorkflowInfo model)
        {
            var result = await new LogSummaryProvider(_dbConfig.Value).GetWorkflowSummary(model);
            return result;
        }
    }
}
