using System;
using System.Collections.Generic;
using System.Text;

namespace Contract
{
    public class RestService
    {
        public Body value { get; set; }
    }

    public class Body
    {
        public string url { get; set; }
        public string controller { get; set; }
        public string action { get; set; }
    }
}
