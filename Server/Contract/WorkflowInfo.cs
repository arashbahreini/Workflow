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

    [DataContract]
    public class WorkflowInfo : IComparable
    {
        [DataMember]
        public int Id { get; set; }

        [DataMember]
        public int? NewId { get; set; }

        [DataMember]
        public long Version { get; set; }

        [DataMember]
        public string Name { get; set; }
        [DataMember]
        public LaunchType LaunchType { get; set; }
        [DataMember]
        public bool IsEnabled { get; set; }
        [DataMember]
        public string Description { get; set; }
        [DataMember]
        public bool IsRunning { get; set; }
        [DataMember]
        public bool IsPaused { get; set; }
        [DataMember]
        public string Period { get; set; }
        [DataMember]
        public long DeadLine { get; set; }
        [DataMember]
        public string Path { get; set; }
        [DataMember]
        public bool IsExecutionGraphEmpty { get; set; }
        [DataMember]
        public List<TaskInfo> Tasks { get; set; }
        [DataMember]
        public GraphModel Graph { get; set; }
        [DataMember]
        public string JsonGraph { get; set; }
        [DataMember]
        public bool NewVersion { get; set; }

        [DataMember]
        public string VersionDescription { get; set; }
        public int CompareTo(object obj)
        {
            var wfi = (WorkflowInfo)obj;
            var ttt = wfi.Id.CompareTo(Id);
            return ttt;
        }
    }
}
