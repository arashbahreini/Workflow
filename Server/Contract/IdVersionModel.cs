using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace Workflow.Core.Service.Contracts
{
    
    public class IdVersionModel
    {
        
        public string Id { get; set; }
        
        public string Version { get; set; }
    }
}
