using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Contract.Common
{
    public class Configuration
    {
        public int TaskLoopInterval { get; set; }
        public string WorkflowsFolder { get; set; }
        public string WorkflowsHistoryFolder { get; set; }
        public string TrashFolder { get; set; }
        public string TempFolder { get; set; }
        public string Xsd { get; set; }
        public string TasksNamesFile { get; set; }
        public string TasksSettingsFile { get; set; }
    }
}
