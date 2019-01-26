using System.Collections.Generic;
using System.Runtime.Serialization;

namespace workflow.Core.Service.Contracts
{
    [DataContract]
    public class SettingInfo
    {
        [DataMember]
        public string Name { get; set; }
        [DataMember]
        public string Value { get; set; }
        [DataMember]
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
