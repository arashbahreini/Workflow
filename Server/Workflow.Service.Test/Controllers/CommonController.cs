using Microsoft.AspNetCore.Mvc;
using Workflow.Service.Test.model;

namespace Workflow.Service.Test.Controllers
{
    [Route("v2/[controller]/[action]")]
    [ApiController]
    public class CommonController : ControllerBase
    {
        // GET api/values
        [HttpPost]
        public bool Insert([FromBody]CommonModel model)
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
