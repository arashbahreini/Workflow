using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using workflow.Core.Service.Contracts;

namespace Workflow.Core.Service.Contracts
{
    
    public class WorkflowPendingTaskModel
    {
        
        public bool IsWorkflowFinished { get; set; }
        
        public long TaskId { get; set; }
        
        public string TaskName { get; set; }
        
        public long TaskIndex { get; set; }
        
        public long RequestId { get; set; }
        
        public long EmployeeId { get; set; }
    }
}
