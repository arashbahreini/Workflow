using System.Collections.Generic;
using System.Runtime.Serialization;

namespace Workflow.Core.Service.Contracts
{
    
    public class PendingAndDoneTaskModel
    {
        
        public List<PendingTaskModel> PendingTasks { get; set; }
        
        public List<PendingTaskModel> DoneTasks { get; set; }
        
        public List<PendingTaskModel> StopTasks { get; set; }
    }
    
    public class PendingTaskModel
    {
        
        public int TaskIndex { get; set; }
        
        public int PendingNumber { get; set; }
        
        public List<DataModel> PendingDataModels { get; set; }
    }
    
    public class DataModel
    {
        
        public string RequestNumber { get; set; }
        
        public string UniqKey { get; set; }
    }
}
