using Contract;
using Contract.Common;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using workflow.Core;

namespace Host.Controllers
{
    public class HomeController : Controller
    {
        private static IOptions<Configuration> _config;
        private static IOptions<WorkflowConfig> _workflowConfig;
        public HomeController(IOptions<Configuration> config, IOptions<WorkflowConfig> workflowConfig)
        {
            _config = config;
            _workflowConfig = workflowConfig;
        }
        public IActionResult Index()
        {
            new WorkflowEngine(_config.Value, _workflowConfig.Value, true).Run();
            return View();
        }
    }
}
