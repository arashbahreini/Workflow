using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace Workflow.Core.Service.Contracts
{
    [DataContract]
    public class WorkflowErrorLogModel
    {
        [DataMember]
        public int Id { get; set; }
        [DataMember]
        public string RequestBody { get; set; }
        [DataMember]
        public string ExceptionMessage { get; set; }
        [DataMember]
        public int ExceptionCode { get; set; }
        [DataMember]
        public int WorkflowId { get; set; }
        [DataMember]
        public long WorkflowVersion { get; set; }
        [DataMember]
        public int TaskId { get; set; }
        [DataMember]
        public DateTime CreationDate { get; set; }
        [DataMember]
        public string UniqKey { get; set; }
        [DataMember]
        public int RequestId { get; set; }
        [DataMember]
        public string TaskName { get; set; }
        [DataMember]
        public string WorkflowName { get; set; }
    }
}
