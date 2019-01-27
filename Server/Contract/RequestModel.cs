using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Threading;
using System.Threading.Tasks;

namespace workflow.Contract
{
    [DataContract]
    public class RequestModel
    {
        [DataMember]
        public List<long> requestedUser { get; set; }

        [DataMember]
        public int Id { get; set; }
        [DataMember]
        public int? TaskIndex { get; set; }
        [DataMember]
        public long Version { get; set; }
        [DataMember]
        public string WorkflowName { get; set; }
        [DataMember]
        public string TaskModel { get; set; }
        [IgnoreDataMember]
        public Task _task { get; set; }
        [IgnoreDataMember]
        public CancellationTokenSource cancellerToken { get; set; }
        [DataMember]
        public string UniqKey { get; set; }
        [DataMember]
        public long? UserId { get; set; }
        [DataMember]
        public string UserIp { get; set; }
        [DataMember]
        public bool IsRunningFromPending { get; set; }
        public bool IsStoped { get; set; }
        public int TaskLoopInterval { get; set; }
    }
}
