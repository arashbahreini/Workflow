using System;
using System.Collections.Generic;
using System.Text;

namespace Contract
{
    public class ResultModel<TData>
    {
        public ResultModel()
        {
            this.Succeed = true;
        }
        public string ErrorMessage { get; set; }
        public TData Data { get; set; }
        public bool Succeed { get; set; } 
    }

    public class ResultModel
    {
        public ResultModel()
        {
            this.Succeed = true;
        }
        public string ErrorMessage { get; set; }
        public bool Succeed { get; set; }
    }
}
