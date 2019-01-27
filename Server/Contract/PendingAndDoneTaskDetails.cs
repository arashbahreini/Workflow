using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace Workflow.Core.Service.Contracts
{
    [DataContract]
    public class PendingAndDoneTaskDetails
    {
        [DataMember]
        public string workflowName { get; set; }
        [DataMember]
        public List<RequestNumberUser> doneRequestNumberUsers { get; set; }
        [DataMember]
        public List<RequestNumberUser> pendingRequestNumberUsers { get; set; }
        [DataMember]
        public List<RequestNumberUser> stopRequestNumberUsers { get; set; }
    }
    [DataContract]
    public class RequestNumberUser
    {
        [DataMember]
        public string RequestNumber { get; set; }
        [DataMember]
        public string UserFullName { get; set; }
        [DataMember]
        public long? UserId { get; set; }
        [DataMember]
        public string UniqKey { get; set; }
    }
}
