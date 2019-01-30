using System;
using System.Xml.Linq;
using workflow.Contract;
using workflow.Core;

namespace Workflow.Tasks.Check
{
    public class Check : Task
    {
        public Check(XElement xe, workflow.Core.Workflow wf) : base(xe, wf)
        {
        }

        public override TaskStatus Run(RequestModel model = null)
        {
            return new TaskStatus(Status.Success, this, new RequestModel(), "");
        }
    }
}
