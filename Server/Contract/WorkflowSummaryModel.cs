using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace Workflow.Core.Service.Contracts
{
    [DataContract]
    public class WorkflowSummaryModel
    {
        [DataMember]
        public string workflowName { get; set; }
        [DataMember]
        public int WorkflowId { get; set; }
        [DataMember]
        public List<string> labels { get; set; }
        [DataMember]
        public List<DataSet> datasets { get; set; }
    }
    [DataContract]
    public class DataSet
    {
        [DataMember]
        public List<int> data { get; set; }
        [DataMember]
        public List<string> backgroundColor { get; set; }
        [DataMember]
        public List<string> hoverBackgroundColor { get; set; }
    }
}
