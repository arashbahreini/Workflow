using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Host.Models;
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
            new workflowEngine(_config.Value.WorkflowSettingsFile, true).Run();
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
