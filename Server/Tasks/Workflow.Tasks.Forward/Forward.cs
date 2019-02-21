using Contract;
using System;
using System.Xml.Linq;
using TaskRunnerLogic;
using workflow.Contract;
using workflow.Core;

namespace Workflow.Tasks.Forward
{
    public class Forward : Task
    {
        public Forward(XElement xe, workflow.Core.Workflow wf) : base(xe, wf)
        {
        }

        public override TaskStatus Run(WorkflowConfig workflowConfig, RequestModel model = null)
        {
            return new RunTask().Run(
                GetSetting("پارامتر"),
                GetSetting("مشخصات سرویس"),
                this,
                workflowConfig,
                model);
        }
    }
}
