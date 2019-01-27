using System.Collections.Generic;
using System.Runtime.Serialization;

namespace workflow.Core.Service.Contracts
{
    
    public class TaskInfo
    {
        
        public int Id { get; set; }
        
        public string Name { get; set; }
        
        public string PersianName { get; set; }
        
        public long DeadLine { get; set; }
        
        public string Description { get; set; }
        
        public bool IsEnabled { get; set; }
        
        public List<SettingInfo> Settings { get; set; }
        
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
