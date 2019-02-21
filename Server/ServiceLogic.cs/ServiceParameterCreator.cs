using Contract;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Text;

namespace ServiceLogic.cs
{
    public class ServiceParameterCreator
    {
        public ExpandoObject Create(string stringParameters)
        {
            var parameters = JsonConvert.DeserializeObject<List<ParameterModel>>(stringParameters);

            var dynamicObject = new ExpandoObject() as IDictionary<string, Object>;
            foreach (var property in parameters)
            {
                dynamicObject.Add(property.Name, property.Value);
            }
            return dynamicObject as ExpandoObject;
        }
    }
}
