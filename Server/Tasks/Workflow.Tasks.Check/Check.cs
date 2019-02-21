using System;
using System.Xml.Linq;
using Contract;
using workflow.Contract;
using workflow.Core;

namespace Workflow.Tasks.Check
{
    public class Check : Task
    {
        public Check(XElement xe, workflow.Core.Workflow wf) : base(xe, wf)
        {
        }

        public override TaskStatus Run(WorkflowConfig workflowConfig, RequestModel model = null)
        {
            return new TaskStatus(Status.Success, this, model, "", workflowConfig);
        }
    }
}
