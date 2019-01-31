using Contract;
using System;
using System.Xml.Linq;
using workflow.Contract;
using workflow.Core;

namespace Workflow.Tasks.Forward
{
    public class Forward : Task
    {
        public Forward(XElement xe, workflow.Core.Workflow wf) : base(xe, wf)
        {
        }

        public override TaskStatus Run(DbConfig dbConfig, RequestModel model = null)
        {
            return new TaskStatus(Status.Success, this, model, "", dbConfig);
        }
    }
}
