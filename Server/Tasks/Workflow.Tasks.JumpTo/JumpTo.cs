﻿using Contract;
using System;
using System.Xml.Linq;
using workflow.Contract;
using workflow.Core;

namespace Workflow.Tasks.JumpTo
{
    public class JumpTo : Task
    {
        public JumpTo(XElement xe, workflow.Core.Workflow wf) : base(xe, wf)
        {
        }

        public override TaskStatus Run(WorkflowConfig workflowConfig, RequestModel model = null)
        {
            return new TaskStatus(Status.Success, this, model, "", workflowConfig);
        }
    }
}
