using System;
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace workflow.Core.Service.Contracts
{
    [DataContract(Name = "LaunchType")]
    public enum LaunchType
    {
        [EnumMember]
        Startup,
        [EnumMember]
        Trigger,
        [EnumMember]
        Periodic
    }

    
    public class WorkflowInfo : IComparable
    {
        
        public int Id { get; set; }

        
        public int? NewId { get; set; }

        
        public long Version { get; set; }

        
        public string Name { get; set; }
        
        public LaunchType LaunchType { get; set; }
        
        public bool IsEnabled { get; set; }
        
        public string Description { get; set; }
        
        public bool IsRunning { get; set; }
        
        public bool IsPaused { get; set; }
        
        public string Period { get; set; }
        
        public long DeadLine { get; set; }
        
        public string Path { get; set; }
        
        public bool IsExecutionGraphEmpty { get; set; }
        
        public List<TaskInfo> Tasks { get; set; }
        
        public GraphModel Graph { get; set; }
        
        public string JsonGraph { get; set; }
        
        public bool NewVersion { get; set; }

        
        public string VersionDescription { get; set; }
        public int CompareTo(object obj)
        {
            var wfi = (WorkflowInfo)obj;
            var ttt = wfi.Id.CompareTo(Id);
            return ttt;
        }
    }
}
