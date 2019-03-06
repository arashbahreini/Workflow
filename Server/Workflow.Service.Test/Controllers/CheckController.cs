﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Workflow.Service.Test.model;

namespace Workflow.Service.Test.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CheckController : ControllerBase
    {
        [HttpPost]
        public bool Delete(Conditionalmodel model)
        {
            if (model.Value > 10)
            {
                return true;
            }
            return false;
        }
    }
}