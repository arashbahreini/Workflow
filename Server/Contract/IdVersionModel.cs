using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace Workflow.Core.Service.Contracts
{
    [DataContract]
    public class IdVersionModel
    {
        [DataMember]
        public string Id { get; set; }
        [DataMember]
        public string Version { get; set; }
    }
}
