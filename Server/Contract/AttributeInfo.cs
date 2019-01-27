using System.Runtime.Serialization;

namespace workflow.Core.Service.Contracts
{
    
    public class AttributeInfo
    {
        
        public string Name { get; set; }
        
        public string Value { get; set; }

        public AttributeInfo(string name, string value)
        {
            Name = name;
            Value = value;
        }

        public AttributeInfo()
        {

        }
    }
}
