using System.Collections.Generic;
using System.Runtime.Serialization;

namespace workflow.Core.Service.Contracts
{
    
    public class SettingInfo
    {
        
        public string Name { get; set; }
        
        public string Value { get; set; }
        
        public List<AttributeInfo> Attributes { get; set; }

        public SettingInfo(string name, string value, List<AttributeInfo> attributes)
        {
            Name = name;
            Value = value;
            Attributes = attributes;
        }

        public SettingInfo()
        {

        }
    }
}
