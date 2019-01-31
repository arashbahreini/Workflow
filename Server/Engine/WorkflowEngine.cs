using System;
using System.Collections.Generic;
using System.Linq;
using System.Xml.Linq;
using System.Xml.XPath;
using System.IO;
using System.Runtime.CompilerServices;
using System.Threading;
using workflow.Contract;
using workflow.Core.Service.Contracts;
using Newtonsoft.Json;
using Contract.Common;
using Contract;

namespace workflow.Core
{
    /// <summary>
    /// workflow engine.
    /// </summary>
    public class WorkflowEngine
    {
        /// <summary>
        /// Settings file path.
        /// </summary>
        public Configuration _configuration { get; private set; }
        /// <summary>
        /// Workflows folder path.
        /// </summary>
        public string WorkflowsFolder { get; private set; }
        public string WorkflowsHistoryFolder { get; private set; }
        /// <summary>
        /// Trash folder path.
        /// </summary>
        public string TrashFolder { get; private set; }
        /// <summary>
        /// Temp folder path.
        /// </summary>
        public string TempFolder { get; private set; }
        /// <summary>
        /// XSD path.
        /// </summary>
        public string XsdPath { get; private set; }
        /// <summary>
        /// Tasks names file path.
        /// </summary>
        public string TasksNamesFile { get; private set; }
        /// <summary>
        /// Tasks settings file path.
        /// </summary>
        public string TasksSettingsFile { get; private set; }
        /// <summary>
        /// List of the Workflows loaded by workflow engine.
        /// </summary>
        public IList<Workflow> Workflows { get; private set; }

        private readonly Dictionary<int, List<workflowTimer>> _workflowTimers;

        public DbConfig _dbConfig;
        /// <summary>
        /// Creates a new instance of workflow engine.
        /// </summary>
        /// <param name="settingsFile">Settings file path.</param>
        public WorkflowEngine(Configuration configuration, DbConfig dbConfig, bool? doLoadHistory = null)
        {
            _dbConfig = dbConfig;
            _configuration = configuration;
            Workflows = new List<Workflow>();
            _workflowTimers = new Dictionary<int, List<workflowTimer>>();

            Logger.Info("");
            Logger.Info("Starting workflow Engine");

            LoadSettings();
            LoadWorkflows(doLoadHistory);
        }

        void LoadSettings()
        {
            //var xdoc = XDocument.Load(SettingsFile);
            WorkflowsFolder = _configuration.WorkflowsFolder;
            WorkflowsHistoryFolder = _configuration.WorkflowsHistoryFolder;
            TrashFolder = _configuration.TrashFolder;
            TempFolder = _configuration.TempFolder;
            if (!Directory.Exists(TempFolder)) Directory.CreateDirectory(TempFolder);
            XsdPath = _configuration.Xsd;
            TasksNamesFile = _configuration.TasksNamesFile;
            TasksSettingsFile = _configuration.TasksSettingsFile;
        }

        //string GetworkflowSetting(XDocument xdoc, string name)
        //{
        //    try
        //    {
        //        var xValue = xdoc.XPathSelectElement(string.Format("/workflow/Setting[@name='{0}']", name)).Attribute("value");
        //        if (xValue == null) throw new Exception("workflow Setting Value attribute not found.");
        //        return xValue.Value;
        //    }
        //    catch (Exception e)
        //    {
        //        Logger.ErrorFormat("An error occured when reading workflow settings: Setting[@name='{0}']", e, name);
        //        return string.Empty;
        //    }
        //}

        void LoadWorkflows(bool? doLoadHistory)
        {
            if (!Directory.Exists(WorkflowsHistoryFolder)) Directory.CreateDirectory(WorkflowsHistoryFolder);
            if (!Directory.Exists(WorkflowsFolder)) Directory.CreateDirectory(WorkflowsFolder);
            var directories = Directory.GetFiles(doLoadHistory == true ? WorkflowsHistoryFolder : WorkflowsFolder, "*.xml");
            foreach (string file in directories)
            {
                var workflow = LoadWorkflowFromFile(file);
                if (workflow != null)
                {
                    Workflows.Add(workflow);
                }
            }

            var watcher = new FileSystemWatcher(WorkflowsFolder, "*.xml")
            {
                EnableRaisingEvents = true,
                IncludeSubdirectories = false
            };

            watcher.Created += (_, args) =>
            {
                var workflow = LoadWorkflowFromFile(args.FullPath);
                if (workflow != null)
                {
                    Workflows.Add(workflow);
                    ScheduleWorkflow(workflow);
                }
            };

            watcher.Deleted += (_, args) =>
            {
                var removedWorkflow = Workflows.SingleOrDefault(wf => wf.WorkflowFilePath == args.FullPath);
                if (removedWorkflow != null)
                {
                    Logger.InfoFormat("Workflow {0} is stopped and removed because its definition file {1} was deleted",
                        removedWorkflow.Name, removedWorkflow.WorkflowFilePath);
                    removedWorkflow.Stop();
                    Workflows.Remove(removedWorkflow);
                }
            };

            watcher.Changed += (_, args) =>
            {
                try
                {
                    //Logger.Debug($"Workflows: {Workflows?.Select(wf => wf.WorkflowFilePath).Aggregate((wf1, wf2) => wf1 + " " + wf2) ?? "'Workflows' is null"}");
                    if (Workflows != null)
                    {
                        var changedWorkflow = Workflows.SingleOrDefault(wf => wf.WorkflowFilePath == args.FullPath);

                        if (changedWorkflow != null)
                        {
                            // the existing file might have caused an error during loading, so there may be no corresponding
                            // workflow to the changed file
                            changedWorkflow.Stop();
                            Workflows.Remove(changedWorkflow);
                            Logger.InfoFormat("A change in the definition file {0} of workflow {1} has been detected. The workflow will be reloaded", changedWorkflow.WorkflowFilePath, changedWorkflow.Name);
                        }
                    }
                }
                catch (Exception e)
                {
                    Logger.Error("Error during workflow reload", e);
                }

                var reloaded = LoadWorkflowFromFile(args.FullPath);
                if (reloaded != null)
                {
                    var duplicateId = Workflows.SingleOrDefault(wf => wf.Id == reloaded.Id && wf.Version == reloaded.Version);
                    if (duplicateId != null)
                    {
                        Logger.ErrorFormat(
                            "An error occured while loading the workflow : {0}. The workflow Id {1} is already assgined in {2}",
                            args.FullPath, reloaded.Id, duplicateId.WorkflowFilePath);
                    }
                    else
                    {
                        Workflows.Add(reloaded);
                        ScheduleWorkflow(reloaded);
                    }
                }
            };
        }

        Workflow LoadWorkflowFromFile(string file)
        {
            try
            {
                var wf = new Workflow(file, TempFolder, XsdPath, _dbConfig);
                Logger.InfoFormat("Workflow loaded: {0} ({1})", wf, file);
                return wf;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        /// <summary>
        /// Starts workflow engine.
        /// </summary>
        public void Run()
        {
            foreach (Workflow workflow in Workflows)
            {
                ScheduleWorkflow(workflow);
            }
        }

        //public void RunPendingTasks()
        //{
        //    var result = new WorkflowLogProxy().GetPendingTasks();

        //    foreach (var item in result)
        //    {
        //        StartWorkflowModel(new RequestModel
        //        {
        //            Id = (int)item.WorkflowId,
        //            TaskIndex = (int)item.TaskIndex,
        //            TaskModel = item.TaskDataModel,
        //            UniqKey = item.UniqKey,
        //            UserId = item.UserId,
        //            Version = item.WorkflowVersion,
        //            IsRunningFromPending = true,
        //        });
        //    }
        //}

        private void ScheduleWorkflow(Workflow wf)
        {
            if (wf.IsEnabled)
            {
                if (wf.LaunchType == LaunchType.Startup)
                {
                    wf.Start();
                }
                else if (wf.LaunchType == LaunchType.Periodic)
                {
                    Action<object> callback = o =>
                    {
                        var workflow = o as Workflow;
                        if (workflow != null && !workflow.IsRunning)
                        {
                            workflow.Start();
                        }
                    };

                    var timer = new workflowTimer(new TimerCallback(callback), wf, wf.Period);

                    if (!_workflowTimers.ContainsKey(wf.Id))
                    {
                        _workflowTimers.Add(wf.Id, new List<workflowTimer> { timer });
                    }
                    else
                    {
                        foreach (var wt in _workflowTimers[wf.Id])
                        {
                            wt.Stop();
                        }
                        _workflowTimers[wf.Id].Add(timer);
                    }
                    timer.Start();
                }
            }
        }

        /// <summary>
        /// Stops workflow engine.
        /// </summary>
        public void Stop()
        {
            foreach (var wts in _workflowTimers.Values)
            {
                foreach (var wt in wts)
                {
                    wt.Stop();
                }
            }

            foreach (var wf in Workflows)
            {
                if (wf.IsRunning)
                {
                    wf.Stop();
                }
            }
        }

        /// <summary>
        /// Gets a workflow.
        /// </summary>
        /// <param name="workflowId">Workflow Id.</param>
        /// <returns></returns>
        // public Workflow GetWorkflow(int workflowId, int? version)
        public Workflow GetWorkflow(int workflowId, long version)
        {
            return Workflows.FirstOrDefault(wf => wf.Id == workflowId && wf.Version == version);
        }

        public string SetWorkflowVersion(int workflowId)
        {
            var result = (Workflows.OrderByDescending(x => x.Version).FirstOrDefault(wf => wf.Id == workflowId).Version + 1).ToString();
            return result;
        }

        public GraphModel GetJsonGraph(string workflowName)
        {
            if (!File.Exists(WorkflowsHistoryFolder + "\\" + workflowName))
            {
                return new GraphModel();
            }
            using (StreamReader r = new StreamReader(WorkflowsHistoryFolder + "\\" + workflowName))
            {
                var result = r.ReadToEnd().ToString();
                return JsonConvert.DeserializeObject<GraphModel>(result);
            }
        }

        /// <summary>
        /// Gets last version of a workflow.
        /// </summary>
        /// <param name="workflowId">Workflow Id.</param>
        /// <returns></returns>
        public Workflow GetLastVersionWorkflow(int workflowId)
        {
            return Workflows.OrderByDescending(x => x.Version).FirstOrDefault(wf => wf.Id == workflowId);
        }

        public List<Workflow> GetAllVersionWorkflowsById(int workflowId)
        {
            return Workflows.Where(wf => wf.Id == workflowId).ToList();
        }

        public string GetLastId()
        {
            if (!Workflows.Any())
            {
                return "0";
            }
            return Workflows.OrderByDescending(x => x.Id).FirstOrDefault().Id.ToString();
        }

        public bool StartWorkflowModel(RequestModel model)
        {
            var wf = GetLastVersionWorkflow(model.Id);
            if (wf == null)
            {
                Logger.ErrorFormat("Workflow {0} not found.", model.Id);
                throw new Exception("Workflow not found.");
            }
            else
            {
                model.WorkflowName = wf.Name;
                model.Version = wf.Version;
                if (wf.IsEnabled) wf.Start(model, wf);
            }
            return true;
        }

        public void StartLastVersionWorkflowModel(RequestModel model)
        {
            var wf = GetLastVersionWorkflow(model.Id);
            if (wf == null)
            {
                Logger.ErrorFormat("Workflow {0} not found.", model.Id);
            }
            else
            {
                if (wf.IsEnabled) wf.Start(model);
            }
        }

        /// <summary>
        /// Stops a workflow.
        /// </summary>
        /// <param name="workflowId">Workflow Id.</param>
        // public void StopWorkflow(int workflowId, int? workflowVersion)
        //public void StopWorkflow(RequestModel model)
        //{
        //    var wf = GetLastVersionWorkflow(model.Id);

        //    if (wf == null)
        //    {
        //        Logger.ErrorFormat("Workflow {0} not found.", model.Id);
        //    }
        //    else
        //    {
        //        if (wf.IsEnabled) wf.Stop(wf, model);
        //    }
        //}

        public void StopLastVersionWorkflow(int workflowId)
        {
            var wf = GetLastVersionWorkflow(workflowId);

            if (wf == null)
            {
                Logger.ErrorFormat("Workflow {0} not found.", workflowId);
            }
            else
            {
                if (wf.IsEnabled) wf.Stop();
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="model"></param>
        public void StopWorkflowModel(RequestModel model)
        {
            var wf = GetWorkflow(model.Id, model.Version);

            if (wf == null)
            {
                Logger.ErrorFormat("Workflow {0} not found.", model.Id);
            }
            else
            {
                if (wf.IsEnabled) wf.Stop();
            }
        }

        public void StopLastVersionWorkflowModel(RequestModel model)
        {
            var wf = GetLastVersionWorkflow(model.Id);

            if (wf == null)
            {
                Logger.ErrorFormat("Workflow {0} not found.", model.Id);
            }
            else
            {
                if (wf.IsEnabled) wf.Stop();
            }
        }
    }
}
