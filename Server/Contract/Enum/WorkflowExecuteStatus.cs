using System.Runtime.Serialization;

namespace workflow.Core.Service.Contracts.Enum
{
    [DataContract(Name = "WorkflowExecuteStatus")]
    public enum WorkflowExecuteStatus
    {
        [EnumMember]
        Run = 1,
        [EnumMember]
        Stop = 2,
        [EnumMember]
        Pause = 3
    }
}
