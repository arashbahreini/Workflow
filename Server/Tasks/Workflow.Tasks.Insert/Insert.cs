using Contract;
using Newtonsoft.Json;
using System.Xml.Linq;
using TaskRunnerLogic;
using workflow.Contract;
using workflow.Core;

namespace Workflow.Tasks.Insert
{
    public class Insert : Task
    {
        public Insert(XElement xe, workflow.Core.Workflow wf) : base(xe, wf)
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
