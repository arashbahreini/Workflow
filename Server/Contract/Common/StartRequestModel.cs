using System;
using System.Collections.Generic;
using System.Text;

namespace Contract.Common
{
    public class StartRequestModel
    {
        public int Id { get; set; }
        public string TaskModel { get; set; }
        public int? TaskIndex { get; set; }
    }
}
