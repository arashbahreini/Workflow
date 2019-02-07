using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Workflow.Service.Test.model;

namespace Workflow.Service.Test.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class CommonController : ControllerBase
    {
        // GET api/values
        [HttpPost]
        public bool Insert(CommonModel model)
        {
            if (model.IsInsert)
            {
                return true;
            } else
            {
                return false;
            }
        }

        [HttpPost]
        public bool Forward(CommonModel model)
        {
            if (string.IsNullOrEmpty(model.Value))
            {
                return true;
            }
            return false;
        }
    }
}
