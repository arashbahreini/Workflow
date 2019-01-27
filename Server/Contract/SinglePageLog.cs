using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using workflow.Core.Service.Contracts;

namespace Workflow.Core.Service.Contracts
{
    
    public class SinglePageLog
    {
        
        public WorkflowInfo WorkflowInfo { get; set; }
        
        public List<long> TraversedIndexes { get; set; }
        
        public long StockedIndex { get; set; }
        
        public bool HasStockedIndexError { get; set; }
    }
}
