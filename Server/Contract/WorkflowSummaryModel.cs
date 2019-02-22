using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace Workflow.Core.Service.Contracts
{
    public class WorkflowSummaryModel
    {
        public string WorkflowName { get; set; }
        public int WorkflowId { get; set; }
        public List<string> Labels { get; set; }
        public List<DataSet> Datasets { get; set; }
    }
    
    public class DataSet
    {
        public List<int> Data { get; set; }
        public List<string> BackgroundColor { get; set; }
        public List<string> HoverBackgroundColor { get; set; }
    }
}
