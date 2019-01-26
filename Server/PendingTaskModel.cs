using System.Collections.Generic;
using System.Runtime.Serialization;

namespace Workflow.Core.Service.Contracts
{
    [DataContract]
    public class PendingAndDoneTaskModel
    {
        [DataMember]
        public List<PendingTaskModel> PendingTasks { get; set; }
        [DataMember]
        public List<PendingTaskModel> DoneTasks { get; set; }
        [DataMember]
        public List<PendingTaskModel> StopTasks { get; set; }
    }
    [DataContract]
    public class PendingTaskModel
    {
        [DataMember]
        public int TaskIndex { get; set; }
        [DataMember]
        public int PendingNumber { get; set; }
        [DataMember]
        public List<DataModel> PendingDataModels { get; set; }
    }
    [DataContract]
    public class DataModel
    {
        [DataMember]
        public string RequestNumber { get; set; }
        [DataMember]
        public string UniqKey { get; set; }
    }
}
