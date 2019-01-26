using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using workflow.Core.Service.Contracts;

namespace Workflow.Core.Service.Contracts
{
    [DataContract]
    public class SinglePageLog
    {
        [DataMember]
        public WorkflowInfo WorkflowInfo { get; set; }
        [DataMember]
        public List<long> TraversedIndexes { get; set; }
        [DataMember]
        public long StockedIndex { get; set; }
        [DataMember]
        public bool HasStockedIndexError { get; set; }
    }
}
