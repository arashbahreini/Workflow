using Contract;
using Newtonsoft.Json;
using ServiceLogic.cs;
using System;
using System.Xml.Linq;
using workflow.Contract;
using workflow.Core;

namespace Workflow.Tasks.Insert
{
    public class Insert : Task
    {
        public Insert(XElement xe, workflow.Core.Workflow wf) : base(xe, wf)
        {
        }

        public override TaskStatus Run(DbConfig dbConfig, RequestModel model = null)
        {
            var url = JsonConvert.DeserializeObject<RestService>(this.GetSetting("مشخصات سرویس"));
            var parameters = this.GetSetting("پارامتر");
            var serviceResult = new CallServiceLogic().Call(url, parameters);
            return new TaskStatus(Status.Success, this, model, "", dbConfig);
        }
    }
}
