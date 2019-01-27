using System;
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace workflow.Core.Service.Contracts
{
    [DataContract]
    public class GraphModel
    {
        [DataMember]
        public string GraphJson { get; set; }
        [DataMember]
        public int WorkflowId { get; set; }
        [DataMember]
        public long WorkflowVersion { get; set; }
        [DataMember]
        public List<NodeDataArray> nodeDataArray { get; set; } = new List<NodeDataArray>();
        [DataMember]
        public List<LinkDataArray> linkDataArray { get; set; } = new List<LinkDataArray>();
        [DataMember]
        public List<WhileModel> whileGroups { get; set; }
    }

    [DataContract]
    public class WhileModel
    {
        [DataMember]
        public List<int> taskIds { get; set; }
        [DataMember]
        public int whileKey { get; set; }
    }
    [DataContract]
    public class LogDataModel
    {
        [DataMember]
        public string RequestNumber { get; set; }
        [DataMember]
        public string UniqKey { get; set; }
    }

    [DataContract]
    public class NodeDataArray
    {
        [DataMember]
        public string StartDate { get; set; }
        [DataMember]
        public string EndDate { get; set; }
        [DataMember]
        public string Status { get; set; }
        [DataMember]
        public List<LogDataModel> DoneDataModels { get; set; }
        [DataMember]
        public List<LogDataModel> PendingDataModels { get; set; }
        [DataMember]
        public List<LogDataModel> StopDataModels { get; set; }
        [DataMember]
        public int key { get; set; }
        [DataMember]
        public bool isRoot { get; set; }
        [DataMember]
        public string text { get; set; }
        [DataMember]
        public string color { get; set; }
        [DataMember]
        public int taskId { get; set; }
        [DataMember]
        public string loc { get; set; }
        [DataMember]
        public bool isIf { get; set; }
        [DataMember]
        public bool isSwitch { get; set; }
        [DataMember]
        public string caseValue { get; set; }
        [DataMember]
        public int doNodeId { get; set; }
        [DataMember]
        public int elseNodeId { get; set; }
        [DataMember]
        public bool isInWhile { get; set; }
        [DataMember]
        public bool isInSwitch { get; set; }
        [DataMember]
        public bool isWhile { get; set; }
        [DataMember]
        public bool? IsCommon { get; set; }
        [DataMember]
        public bool? isDefault { get; set; }
        [DataMember]
        public int pendingNumber { get; set; }
        [DataMember]
        public int doneNumber { get; set; }
        [DataMember]
        public int stopNumber { get; set; }
        [DataMember]
        public int DeadLine { get; set; }
        [DataMember]
        public string description { get; set; }

    }

    [DataContract]
    public class LinkDataArray
    {
        [DataMember]
        public int from { get; set; }
        [DataMember]
        public int to { get; set; }
        [DataMember]
        public string text { get; set; }
        [DataMember]
        public List<float> points { get; set; }

    }
}
