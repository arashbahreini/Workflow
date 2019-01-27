using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace Workflow.Core.Service.Contracts
{
    
    public class PendingAndDoneTaskDetails
    {
        
        public string workflowName { get; set; }
        
        public List<RequestNumberUser> doneRequestNumberUsers { get; set; }
        
        public List<RequestNumberUser> pendingRequestNumberUsers { get; set; }
        
        public List<RequestNumberUser> stopRequestNumberUsers { get; set; }
    }
    
    public class RequestNumberUser
    {
        
        public string RequestNumber { get; set; }
        
        public string UserFullName { get; set; }
        
        public long? UserId { get; set; }
        
        public string UniqKey { get; set; }
    }
}
