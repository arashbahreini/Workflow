using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace workflow.Core.Service.Contracts.Enum
{
    public enum TaskType
    {
        Null = 0,
        Task = 1,
        If = 2,
        While = 3,
        SwitchCase = 4,
    }
}
