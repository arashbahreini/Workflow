using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace Workflow.Core.Service.Contracts
{
    [DataContract]
    public class TaskNameModel
    {
        [DataMember]
        public string Name { get; set; }
        [DataMember]
        public string PersianName { get; set; }
        [DataMember]
        public string Type { get; set; }
    }
}
