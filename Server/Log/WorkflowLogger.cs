using Contract;
using Data;
using Data.Entities;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Log
{
    public class WorkflowLogger
    {
        private static DbConfig _dbDonfig;

        public WorkflowLogger(DbConfig dbConfig)
        {
            _dbDonfig = dbConfig;
        }
        public async Task<ResultModel> AddLog(WorkflowLog model)
        {
            await new MongoDbContext(_dbDonfig.ServerAdderss, _dbDonfig.DatabaseName)
                .AddOne<WorkflowLog>(model);
            return new ResultModel();
        }
    }
}
