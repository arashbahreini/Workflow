using System;
using System.Runtime.Serialization;
using workflow.Core.Service.Contracts.Enum;

namespace workflow.Core.Service.Contracts
{
    
    public class WorkflowLogModel
    {
        
        public long Id { get; set; }
        
        public long WorkflowId { get; set; }
        
        public string WorkflowName { get; set; }
        
        public string WorkflowTimeStatus { get; set; }
        
        public string TaskTimeStatus { get; set; }
        
        public long WorkflowVersion { get; set; }
        
        public WorkflowStatus? Action { get; set; }
        
        public long TaskId { get; set; }
        
        public bool IsCurrentTask { get; set; }
        
        public long CurrentTaskId { get; set; }
        
        public string CurrentTaskName { get; set; }
        
        public long TaskIndex { get; set; }
        
        public TaskStatus? TaskStatus { get; set; }
        
        public TaskType? TaskType { get; set; }
        
        public DateTime CreationDate { get; set; } = DateTime.Now;
        
        public long? UserId { get; set; }
        
        public DateTime WorkflowStartTime { get; set; }
        
        public int WorkflowRemainTime { get; set; }
        
        public DateTime TaskStartTime { get; set; }
        
        public int TaskRemainTime { get; set; }
        
        public long RequestId { get; set; }
        
        public bool? TaskResult { get; set; }
        
        public string UniqKey { get; set; }
        
        public double TimeWasted { get; set; }
        
        public string TaskDataModel { get; set; }
        
        public string TaskName { get; set; }
        
        public string RequestNumber { get; set; }
        
        public string ServiceRequestAction { get; set; }
        
        public string ServiceRequestBody { get; set; }
        
        public string ServiceResponseBody { get; set; }
    }
}
