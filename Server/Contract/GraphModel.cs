using System;
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace workflow.Core.Service.Contracts
{
    
    public class GraphModel
    {
        
        public string GraphJson { get; set; }
        
        public int WorkflowId { get; set; }
        
        public long WorkflowVersion { get; set; }
        
        public List<NodeDataArray> nodeDataArray { get; set; } = new List<NodeDataArray>();
        
        public List<LinkDataArray> linkDataArray { get; set; } = new List<LinkDataArray>();
        
        public List<WhileModel> whileGroups { get; set; }
    }

    
    public class WhileModel
    {
        
        public List<int> taskIds { get; set; }
        
        public int whileKey { get; set; }
    }
    
    public class LogDataModel
    {
        
        public string RequestNumber { get; set; }
        
        public string UniqKey { get; set; }
    }

    
    public class NodeDataArray
    {
        
        public string StartDate { get; set; }
        
        public string EndDate { get; set; }
        
        public string Status { get; set; }
        
        public List<LogDataModel> DoneDataModels { get; set; }
        
        public List<LogDataModel> PendingDataModels { get; set; }
        
        public List<LogDataModel> StopDataModels { get; set; }
        
        public int key { get; set; }
        
        public bool isRoot { get; set; }
        
        public string text { get; set; }
        
        public string color { get; set; }
        
        public int taskId { get; set; }
        
        public string loc { get; set; }
        
        public bool isIf { get; set; }
        
        public bool isSwitch { get; set; }
        
        public string caseValue { get; set; }
        
        public int doNodeId { get; set; }
        
        public int elseNodeId { get; set; }
        
        public bool isInWhile { get; set; }
        
        public bool isInSwitch { get; set; }
        
        public bool isWhile { get; set; }
        
        public bool? IsCommon { get; set; }
        
        public bool? isDefault { get; set; }
        
        public int pendingNumber { get; set; }
        
        public int doneNumber { get; set; }
        
        public int stopNumber { get; set; }
        
        public int DeadLine { get; set; }
        
        public string description { get; set; }

    }

    
    public class LinkDataArray
    {
        
        public int from { get; set; }
        
        public int to { get; set; }
        
        public string text { get; set; }
        
        public List<float> points { get; set; }

    }
}
