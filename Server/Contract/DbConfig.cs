using System;
using System.Collections.Generic;
using System.Text;

namespace Contract
{
    public class WorkflowConfig
    {
        public DatabaseConfig DbConfig { get; set; }
        public SystemConfig SystemConfig { get; set; }
    }
    public class DatabaseConfig
    {
        public string UserName { get; set; }
        public string Password { get; set; }
        public string DatabaseName { get; set; }
        public string ServerAdderss { get; set; }
    }

    public class SystemConfig
    {
        public int TimeIntervalSecond { get; set; }
    }
}
