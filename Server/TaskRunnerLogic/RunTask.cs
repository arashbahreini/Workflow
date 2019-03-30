using Contract;
using Newtonsoft.Json;
using ServiceLogic.cs;
using System;
using System.Threading;
using workflow.Contract;
using workflow.Core;

namespace TaskRunnerLogic
{
    public class RunTask
    {
        private RestService url = new RestService();
        private string parameters = "";
        private System.Threading.Tasks.Task<bool> serviceResult;

        public TaskStatus Run(string serviceParameters, string serviceUrl, Task task, WorkflowConfig workflowConfig, RequestModel model = null)
        {
            while (true)
            {

                switch (task.Name)
                {
                    case "Insert":
                        url = JsonConvert.DeserializeObject<RestService>(serviceUrl);
                        parameters = serviceParameters;
                        serviceResult = new CallServiceLogic().CallAsync(this.url, this.parameters);
                        if (this.serviceResult.Result)
                        {
                            return new TaskStatus(Status.Success, task, model, "", workflowConfig);
                        }
                        break;
                    case "Forward":
                        url = JsonConvert.DeserializeObject<RestService>(serviceUrl);
                        parameters = serviceParameters;
                        serviceResult = new CallServiceLogic().CallAsync(url, parameters);
                        if (serviceResult.Result)
                        {
                            return new TaskStatus(Status.Success, task, model, "", workflowConfig);
                        }
                        break;
                    case "Check":
                        url = JsonConvert.DeserializeObject<RestService>(serviceUrl);
                        parameters = serviceParameters;
                        serviceResult = new CallServiceLogic().CallAsync(url, parameters);
                        if (serviceResult.Result == true)
                        {
                            return new TaskStatus(Status.Success, true, task, model, "", workflowConfig);
                        }
                        else if (serviceResult.Result == false)
                        {
                            return new TaskStatus(Status.Success, false, task, model, "", workflowConfig);
                        }
                        break;
                    default:
                        break;
                }
                Thread.Sleep(new TimeSpan(0, 0, workflowConfig.SystemConfig.TimeIntervalSecond));
            }
        }
    }
}
