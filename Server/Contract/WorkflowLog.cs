using System;
using System.Runtime.Serialization;
using workflow.Core.Service.Contracts.Enum;

namespace workflow.Core.Service.Contracts
{
    [DataContract]
    public class WorkflowLogModel
    {
        [DataMember]
        public long Id { get; set; }
        [DataMember]
        public long WorkflowId { get; set; }
        [DataMember]
        public string WorkflowName { get; set; }
        [DataMember]
        public string WorkflowTimeStatus { get; set; }
        [DataMember]
        public string TaskTimeStatus { get; set; }
        [DataMember]
        public long WorkflowVersion { get; set; }
        [DataMember]
        public WorkflowStatus? Action { get; set; }
        [DataMember]
        public long TaskId { get; set; }
        [DataMember]
        public bool IsCurrentTask { get; set; }
        [DataMember]
        public long CurrentTaskId { get; set; }
        [DataMember]
        public string CurrentTaskName { get; set; }
        [DataMember]
        public long TaskIndex { get; set; }
        [DataMember]
        public TaskStatus? TaskStatus { get; set; }
        [DataMember]
        public TaskType? TaskType { get; set; }
        [DataMember]
        public DateTime CreationDate { get; set; } = DateTime.Now;
        [DataMember]
        public long? UserId { get; set; }
        [DataMember]
        public DateTime WorkflowStartTime { get; set; }
        [DataMember]
        public int WorkflowRemainTime { get; set; }
        [DataMember]
        public DateTime TaskStartTime { get; set; }
        [DataMember]
        public int TaskRemainTime { get; set; }
        [DataMember]
        public long RequestId { get; set; }
        [DataMember]
        public bool? TaskResult { get; set; }
        [DataMember]
        public string UniqKey { get; set; }
        [DataMember]
        public double TimeWasted { get; set; }
        [DataMember]
        public string TaskDataModel { get; set; }
        [DataMember]
        public string TaskName { get; set; }
        [DataMember]
        public string RequestNumber { get; set; }
        [DataMember]
        public string ServiceRequestAction { get; set; }
        [DataMember]
        public string ServiceRequestBody { get; set; }
        [DataMember]
        public string ServiceResponseBody { get; set; }
    }
}
