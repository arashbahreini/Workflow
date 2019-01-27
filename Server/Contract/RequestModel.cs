using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Threading;
using System.Threading.Tasks;

namespace workflow.Contract
{
    
    public class RequestModel
    {
        
        public List<long> requestedUser { get; set; }

        
        public int Id { get; set; }
        
        public int? TaskIndex { get; set; }
        
        public long Version { get; set; }
        
        public string WorkflowName { get; set; }
        
        public string TaskModel { get; set; }
        [IgnoreDataMember]
        public Task _task { get; set; }
        [IgnoreDataMember]
        public CancellationTokenSource cancellerToken { get; set; }
        
        public string UniqKey { get; set; }
        
        public long? UserId { get; set; }
        
        public string UserIp { get; set; }
        
        public bool IsRunningFromPending { get; set; }
        public bool IsStoped { get; set; }
        public int TaskLoopInterval { get; set; }
    }
}
