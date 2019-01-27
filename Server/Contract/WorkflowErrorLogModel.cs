using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace Workflow.Core.Service.Contracts
{
    
    public class WorkflowErrorLogModel
    {
        
        public int Id { get; set; }
        
        public string RequestBody { get; set; }
        
        public string ExceptionMessage { get; set; }
        
        public int ExceptionCode { get; set; }
        
        public int WorkflowId { get; set; }
        
        public long WorkflowVersion { get; set; }
        
        public int TaskId { get; set; }
        
        public DateTime CreationDate { get; set; }
        
        public string UniqKey { get; set; }
        
        public int RequestId { get; set; }
        
        public string TaskName { get; set; }
        
        public string WorkflowName { get; set; }
    }
}
