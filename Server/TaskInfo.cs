using System.Collections.Generic;
using System.Runtime.Serialization;

namespace workflow.Core.Service.Contracts
{
    [DataContract]
    public class TaskInfo
    {
        [DataMember]
        public int Id { get; set; }
        [DataMember]
        public string Name { get; set; }
        [DataMember]
        public string PersianName { get; set; }
        [DataMember]
        public long DeadLine { get; set; }
        [DataMember]
        public string Description { get; set; }
        [DataMember]
        public bool IsEnabled { get; set; }
        [DataMember]
        public List<SettingInfo> Settings { get; set; }
        [DataMember]
        public bool? IsCommon { get; set; }

        public TaskInfo(int id, string name, string desc, bool isEnabled, List<SettingInfo> settings, bool? isCommon = null)
        {
            Id = id;
            Name = name;
            Description = desc;
            IsEnabled = isEnabled;
            Settings = settings;
            IsCommon = isCommon;
        }

        public TaskInfo()
        {

        }
    }
}
