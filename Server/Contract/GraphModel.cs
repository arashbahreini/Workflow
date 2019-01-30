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
        
        public List<NodeDataArray> NodeDataArray { get; set; } = new List<NodeDataArray>();
        
        public List<LinkDataArray> LinkDataArray { get; set; } = new List<LinkDataArray>();
        
        public List<WhileModel> WhileGroups { get; set; }
    }

    
    public class WhileModel
    {
        
        public List<int> TaskIds { get; set; }
        
        public int WhileKey { get; set; }
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
        
        public int Key { get; set; }
        
        public bool IsRoot { get; set; }
        
        public string Text { get; set; }
        
        public string Color { get; set; }
        
        public int TaskId { get; set; }
        
        public string Loc { get; set; }
        
        public bool IsIf { get; set; }
        
        public bool IsSwitch { get; set; }
        
        public string CaseValue { get; set; }
        
        public int DoNodeId { get; set; }
        
        public int ElseNodeId { get; set; }
        
        public bool IsInWhile { get; set; }
        
        public bool IsInSwitch { get; set; }
        
        public bool IsWhile { get; set; }
        
        public bool? IsCommon { get; set; }
        
        public bool? IsDefault { get; set; }
        
        public int PendingNumber { get; set; }
        
        public int DoneNumber { get; set; }
        
        public int StopNumber { get; set; }
        
        public int DeadLine { get; set; }
        
        public string Description { get; set; }

    }

    
    public class LinkDataArray
    {
        
        public int From { get; set; }
        
        public int To { get; set; }
        
        public string Text { get; set; }
        
        public List<float> Points { get; set; }

    }
}
