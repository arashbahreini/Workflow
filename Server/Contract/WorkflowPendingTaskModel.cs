using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using workflow.Core.Service.Contracts;

namespace Workflow.Core.Service.Contracts
{
    [DataContract]
    public class WorkflowPendingTaskModel
    {
        [DataMember]
        public bool IsWorkflowFinished { get; set; }
        [DataMember]
        public long TaskId { get; set; }
        [DataMember]
        public string TaskName { get; set; }
        [DataMember]
        public long TaskIndex { get; set; }
        [DataMember]
        public long RequestId { get; set; }
        [DataMember]
        public long EmployeeId { get; set; }
    }
}
