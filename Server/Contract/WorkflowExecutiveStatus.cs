using System.Runtime.Serialization;
using workflow.Core.Service.Contracts.Enum;

namespace Workflow.Core.Service.Contracts
{
    [DataContract]
    public class WorkflowExecutiveStatus
    {
        [DataMember]
        public WorkflowExecuteStatus Status { get; set; }
    }
}
