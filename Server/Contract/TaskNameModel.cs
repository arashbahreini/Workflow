using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace Workflow.Core.Service.Contracts
{
    
    public class TaskNameModel
    {
        
        public string Name { get; set; }
        
        public string PersianName { get; set; }
        
        public string Type { get; set; }
    }
}
