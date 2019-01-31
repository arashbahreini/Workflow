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
        private static IOptions<DbConfig> _dbConfig;
        public HomeController(IOptions<Configuration> config, IOptions<DbConfig> dbConfig)
        {
            _config = config;
            _dbConfig = dbConfig;
        }
        public IActionResult Index()
        {
            new WorkflowEngine(_config.Value, _dbConfig.Value, true).Run();
            return View();
        }
    }
}
