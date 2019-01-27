using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using workflow.Core;

namespace Host.Controllers
{
    public class HomeController : Controller
    {
        private static IOptions<Configuration> _config;
        public HomeController(IOptions<Configuration> config)
        {
            _config = config;
        }
        public IActionResult Index()
        {
            new WorkflowEngine(_config.Value.WorkflowSettingsFile, true).Run();
            return View();
        }
    }
}
