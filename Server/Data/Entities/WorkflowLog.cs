using Data.Common;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Text;

namespace Data.Entities
{
    public class WorkflowLog : ICommon
    {
        public ObjectId Id { get; set; }
        public DateTime CreationDate { get; set; }
        public int WorkflowId { get; set; }
        public string Name { get; set; }
        public string UniqKey { get; set; }
        public long WorkflowVersion { get; set; }
        public List<WorkflowAction> Actions { get; set; }
        public WorkflowLog()
        {
            this.CreationDate = DateTime.Now;
        }
    }

    public class WorkflowAction
    {
        public DateTime CreationDate { get; set; }
        public int Action { get; set; }
        /// <summary>
        /// Parameters to pass into any service
        /// </summary>
        public string ServiceParameters { get; set; }
        /// <summary>
        /// Service URL
        /// </summary>
        public string ServiceUrl { get; set; }
        public string TaskName { get; set; }
        public string ServiceResponse { get; set; }
        public int TaskId { get; set; }
        public long TaskIndex { get; set; }
        public int TaskStatus { get; set; }
        public int TaskType { get; set; }
        public bool? TaskResult { get; set; }
    }
}
