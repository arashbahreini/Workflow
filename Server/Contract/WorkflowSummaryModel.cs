using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace Workflow.Core.Service.Contracts
{
    
    public class WorkflowSummaryModel
    {
        
        public string workflowName { get; set; }
        
        public int WorkflowId { get; set; }
        
        public List<string> labels { get; set; }
        
        public List<DataSet> datasets { get; set; }
    }
    
    public class DataSet
    {
        
        public List<int> data { get; set; }
        
        public List<string> backgroundColor { get; set; }
        
        public List<string> hoverBackgroundColor { get; set; }
    }
}
