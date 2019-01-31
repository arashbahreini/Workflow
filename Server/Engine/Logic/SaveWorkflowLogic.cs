using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Xml.Linq;
using System.Xml.XPath;
using workflow.Core.Service.Contracts;
using Workflow.Core.Service.Contracts;
using System.Configuration;
using Contract.Common;
using Contract;

namespace workflow.Core.Logic
{
    public class SaveWorkflowLogic
    {
        public Configuration _configuration { get; set; }
        public DbConfig _dbConfig;
        public SaveWorkflowLogic(Configuration configuration, DbConfig dbConfig)
        {
            _dbConfig = dbConfig;
            _configuration = configuration;
        }
        public static XNamespace xn = "urn:workflow-schema";
        public IdVersionModel AddNewWorkflow(WorkflowInfo model, WorkflowEngine workflowEngine, List<TaskNameModel> taskNames)
        {
            var xtasks = new XElement(xn + "Tasks");

            if (model.Tasks != null)
            {
                foreach (var task in model.Tasks)
                {
                    int taskId = task.Id;
                    string taskName = string.IsNullOrEmpty(task.Name) ? string.Empty : task.Name;
                    string taskDesc = string.IsNullOrEmpty(task.Description) ? string.Empty : task.Description;
                    bool isTaskEnabled = task.IsEnabled;

                    var xtask = new XElement(xn + "Task"
                        , new XAttribute("id", taskId)
                        , new XAttribute("name", taskName)
                        , new XAttribute("description", taskDesc)
                        , new XAttribute("enabled", isTaskEnabled.ToString().ToLower())
                        , new XAttribute("isCommon", task.IsCommon == null ? false : task.IsCommon)
                    );

                    var settings = task.Settings;
                    if (settings != null)
                    {
                        foreach (var setting in settings)
                        {
                            string settingName = string.IsNullOrEmpty(setting.Name) ? string.Empty : setting.Name;
                            string settingValue = string.IsNullOrEmpty(setting.Value) ? string.Empty : setting.Value;

                            var xsetting = new XElement(xn + "Setting"
                                , new XAttribute("name", settingName)
                            );

                            if (!string.IsNullOrEmpty(settingValue))
                            {
                                xsetting.SetAttributeValue("value", settingValue);
                            }

                            if (settingName == "selectFiles" || settingName == "selectAttachments")
                            {
                                if (!string.IsNullOrEmpty(settingValue))
                                {
                                    xsetting.SetAttributeValue("value", settingValue);
                                }
                            }
                            else
                            {
                                xsetting.SetAttributeValue("value", settingValue);
                            }

                            xtask.Add(xsetting);
                        }
                    }
                    xtasks.Add(xtask);
                }
            }

            var xGraph = new XElement(xn + "ExecutionGraph");
            if (model.Graph.NodeDataArray != null)
            {
                xGraph = new GraphCompatibility.GraphCompatibility(
                    taskNames,
                    model.Tasks,
                    workflowEngine.WorkflowsFolder,
                    model.Name)
                .DesignExecutionGraph(model.Graph);
                SaveJsonGraph(model.Graph, workflowEngine.WorkflowsFolder, model.Name + "_0");
            }

            var xwf = new XElement(xn + "Workflow"
                , new XAttribute("id", (Convert.ToInt64(GetLastWorkflowId()) + 1).ToString())
                , new XAttribute("name", model.Name)
                , new XAttribute("description", string.IsNullOrEmpty(model.Description) ? string.Empty : model.Description)
                    , new XElement(xn + "Settings"
                        , new XElement(xn + "Setting"
                            , new XAttribute("name", "launchType")
                            , new XAttribute("value", model.LaunchType.ToString().ToLower()))
                        , new XElement(xn + "Setting"
                            , new XAttribute("name", "enabled")
                            , new XAttribute("value", model.IsEnabled.ToString().ToLower()))
                        , new XElement(xn + "Setting"
                            , new XAttribute("name", "period")
                            , new XAttribute("value", TimeSpan.Parse(string.IsNullOrEmpty(model.Period) ? "00.00:00:00" : model.Period).ToString(@"dd\.hh\:mm\:ss")))
                        , new XElement(xn + "Setting"
                            , new XAttribute("name", "version")
                            , new XAttribute("value", 0))
                       , new XElement(xn + "Setting"
                            , new XAttribute("name", "deadLine")
                            , new XAttribute("value", model.DeadLine.ToString()))
                                )
                    , xtasks, xGraph
            );
            var xdoc = new XDocument();
            xwf.Save(_configuration.WorkflowsHistoryFolder + model.Name + "_" + "0" + ".xml");
            xwf.Save(_configuration.WorkflowsFolder + model.Name + "_" + "0" + ".xml");

            return new IdVersionModel
            {
                Version = "0",
                Id = GetLastWorkflowId()
            };
        }
        public IdVersionModel AddNewVersionWorkflow(WorkflowInfo model, WorkflowEngine workflowEngine, List<TaskNameModel> taskNames)
        {
            var wf = workflowEngine.GetWorkflow(model.Id, model.Version);
            if (wf != null)
            {
                var xdoc = wf.XDoc;

                xdoc.Root.Attribute("id").Value = model.Id.ToString();
                xdoc.Root.Attribute("name").Value = model.Name;
                xdoc.Root.Attribute("description").Value = model.Description == null ? string.Empty : model.Description;

                TimeSpan workflowPeriod = TimeSpan.Parse(string.IsNullOrEmpty(model.Period) ? "00.00:00:00" : model.Period);

                xdoc.Root.XPathSelectElement("wf:Settings/wf:Setting[@name='enabled']", wf.XmlNamespaceManager).Attribute("value").Value = model.IsEnabled.ToString().ToLower();
                xdoc.Root.XPathSelectElement("wf:Settings/wf:Setting[@name='launchType']", wf.XmlNamespaceManager).Attribute("value").Value = model.LaunchType.ToString().ToLower();
                xdoc.Root.XPathSelectElement("wf:Settings/wf:Setting[@name='version']", wf.XmlNamespaceManager).Attribute("value").Value = (workflowEngine.SetWorkflowVersion(model.Id));
                xdoc.Root.XPathSelectElement("wf:Settings/wf:Setting[@name='deadLine']", wf.XmlNamespaceManager).Attribute("value").Value = model.DeadLine.ToString();
                xdoc.Root.XPathSelectElement("wf:Settings/wf:Setting[@name='period']", wf.XmlNamespaceManager).Attribute("value").Value = workflowPeriod.ToString(@"dd\.hh\:mm\:ss");

                if (xdoc.Root.XPathSelectElement("wf:Settings/wf:Setting[@name='versionDescription']", wf.XmlNamespaceManager) != null)
                    xdoc.Root.XPathSelectElement("wf:Settings/wf:Setting[@name='versionDescription']", wf.XmlNamespaceManager).Attribute("value").Value = model.VersionDescription != null ? model.VersionDescription : "";
                else
                {
                    if (model.VersionDescription != null)
                    {
                        var xAttribute = new XElement(xn + "Setting"
                                , new XAttribute("name", "versionDescription")
                                , new XAttribute("value", model.VersionDescription));
                        xdoc.Root.Descendants().FirstOrDefault().Add(xAttribute);
                    }
                }

                var xtasks = xdoc.Root.Element(wf.XNamespaceWf + "Tasks");
                xtasks.Elements(wf.XNamespaceWf + "Task").Remove();

                if (model.Tasks != null)
                {
                    foreach (var task in model.Tasks)
                    {
                        int taskId = task.Id;
                        string taskName = string.IsNullOrEmpty(task.Name) ? string.Empty : task.Name;
                        string taskDesc = string.IsNullOrEmpty(task.Description) ? string.Empty : task.Description;
                        bool isTaskEnabled = task.IsEnabled;

                        var xtask = new XElement(wf.XNamespaceWf + "Task"
                            , new XAttribute("id", taskId)
                            , new XAttribute("name", taskName)
                            , new XAttribute("description", taskDesc)
                            , new XAttribute("enabled", isTaskEnabled.ToString().ToLower())
                            , new XAttribute("isCommon", task.IsCommon)
                        );

                        if (task.Settings != null)
                        {
                            foreach (var setting in task.Settings)
                            {
                                string settingName = string.IsNullOrEmpty(setting.Name) ? string.Empty : setting.Name;
                                string settingValue = string.IsNullOrEmpty(setting.Value) ? string.Empty : setting.Value;

                                var xsetting = new XElement(wf.XNamespaceWf + "Setting", new XAttribute("name", settingName));
                                xsetting.SetAttributeValue("value", settingValue);
                                xtask.Add(xsetting);
                            }
                        }
                        xtasks.Add(xtask);
                    }
                }

                var xGraph = xdoc.Root.Element(xn + "ExecutionGraph");
                if (model.Graph.NodeDataArray.Any())
                {
                    if (xGraph != null)
                        xGraph.Remove();
                    xGraph = new GraphCompatibility.GraphCompatibility(taskNames, model.Tasks, workflowEngine.WorkflowsFolder, model.Name + "_" + (model.Version))
                        .DesignExecutionGraph(model.Graph);
                    xdoc.Root.Add(xGraph);
                    SaveJsonGraph(model.Graph, workflowEngine.WorkflowsFolder, model.Name + "_" + workflowEngine.SetWorkflowVersion(model.Id));
                }

                var path = workflowEngine.WorkflowsFolder + "\\" + model.Name + "_" + workflowEngine.SetWorkflowVersion(model.Id) + ".xml";
                var oldVersionPath = workflowEngine.WorkflowsFolder + "\\" + model.Name + "_" + model.Version + ".xml";
                var oldVersionPathJson = workflowEngine.WorkflowsFolder + "\\" + model.Name + "_" + model.Version + ".json";
                using (var outStream = System.IO.File.CreateText(path))
                {
                    xdoc.Save(outStream);
                    if (File.Exists(oldVersionPath))
                    {
                        File.Delete(oldVersionPath);
                    }

                    if (File.Exists(oldVersionPathJson))
                    {
                        File.Delete(oldVersionPathJson);
                    }
                }

                var historyPath = _configuration.WorkflowsHistoryFolder + model.Name + "_" + workflowEngine.SetWorkflowVersion(model.Id) + ".xml";
                using (var historyOutStream = System.IO.File.CreateText(historyPath))
                {
                    xdoc.Save(historyOutStream);
                }
            }


            return new IdVersionModel
            {
                Id = model.Id.ToString(),
                Version = workflowEngine.SetWorkflowVersion(model.Id)
            };
        }
        public IdVersionModel EditWorkflow(WorkflowInfo model, WorkflowEngine workflowEngine, List<TaskNameModel> taskNames)
        {
            var wf = workflowEngine.GetWorkflow(model.Id, model.Version);
            if (wf != null)
            {
                var xdoc = wf.XDoc;

                xdoc.Root.Attribute("id").Value = model.Id.ToString();
                xdoc.Root.Attribute("name").Value = model.Name;
                xdoc.Root.Attribute("description").Value = model.Description == null ? string.Empty : model.Description;

                TimeSpan workflowPeriod = TimeSpan.Parse(string.IsNullOrEmpty(model.Period) ? "00.00:00:00" : model.Period);

                xdoc.Root.XPathSelectElement("wf:Settings/wf:Setting[@name='enabled']", wf.XmlNamespaceManager).Attribute("value").Value = model.IsEnabled.ToString().ToLower();
                xdoc.Root.XPathSelectElement("wf:Settings/wf:Setting[@name='launchType']", wf.XmlNamespaceManager).Attribute("value").Value = model.LaunchType.ToString().ToLower();
                xdoc.Root.XPathSelectElement("wf:Settings/wf:Setting[@name='version']", wf.XmlNamespaceManager).Attribute("value").Value = (model.Version).ToString();
                xdoc.Root.XPathSelectElement("wf:Settings/wf:Setting[@name='deadLine']", wf.XmlNamespaceManager).Attribute("value").Value = model.DeadLine.ToString(); ;
                xdoc.Root.XPathSelectElement("wf:Settings/wf:Setting[@name='period']", wf.XmlNamespaceManager).Attribute("value").Value = workflowPeriod.ToString(@"dd\.hh\:mm\:ss");

                var xtasks = xdoc.Root.Element(wf.XNamespaceWf + "Tasks");
                xtasks.Elements(wf.XNamespaceWf + "Task").Remove();

                if (model.Tasks != null)
                {
                    foreach (var task in model.Tasks)
                    {
                        int taskId = task.Id;
                        string taskName = string.IsNullOrEmpty(task.Name) ? string.Empty : task.Name;
                        string taskDesc = string.IsNullOrEmpty(task.Description) ? string.Empty : task.Description;
                        bool isTaskEnabled = task.IsEnabled;

                        var xtask = new XElement(wf.XNamespaceWf + "Task"
                            , new XAttribute("id", taskId)
                            , new XAttribute("name", taskName)
                            , new XAttribute("description", taskDesc)
                            , new XAttribute("enabled", isTaskEnabled.ToString().ToLower())
                            , new XAttribute("isCommon", task.IsCommon)
                        );

                        if (task.Settings != null)
                        {
                            foreach (var setting in task.Settings)
                            {
                                string settingName = string.IsNullOrEmpty(setting.Name) ? string.Empty : setting.Name;
                                string settingValue = string.IsNullOrEmpty(setting.Value) ? string.Empty : setting.Value;

                                var xsetting = new XElement(wf.XNamespaceWf + "Setting", new XAttribute("name", settingName));
                                xsetting.SetAttributeValue("value", settingValue);
                                xtask.Add(xsetting);
                            }
                        }
                        xtasks.Add(xtask);
                    }
                }

                var xGraph = xdoc.Root.Element(xn + "ExecutionGraph");
                if (model.Graph.NodeDataArray.Any())
                {
                    if (xGraph != null)
                        xGraph.Remove();
                    xGraph = new GraphCompatibility.GraphCompatibility(taskNames, model.Tasks, workflowEngine.WorkflowsFolder, model.Name + "_" + (model.Version))
                        .DesignExecutionGraph(model.Graph);
                    xdoc.Root.Add(xGraph);
                    SaveJsonGraph(model.Graph, workflowEngine.WorkflowsFolder, model.Name + "_" + model.Version);
                }
                var outStream = System.IO.File.CreateText(model.Path);
                xdoc.Save(outStream);
                var path = workflowEngine.WorkflowsFolder + "\\" + model.Name + "_" + model.Version + ".xml";
                var outStreamRoot = System.IO.File.CreateText(path);
                xdoc.Save(outStreamRoot);
                outStreamRoot.Close();
                outStream.Close();
            }

            return new IdVersionModel
            {
                Id = model.Id.ToString(),
                Version = (model.Version).ToString()
            };
        }
        public string GetLastWorkflowId()
        {
            return new WorkflowEngine(_configuration, _dbConfig).GetLastId();
        }
        public void SaveJsonGraph(GraphModel graph, string path, string fileName)
        {
            if (System.IO.File.Exists(_configuration.WorkflowsFolder + "\\" + fileName + ".json"))
            {
                System.IO.File.Delete(_configuration.WorkflowsFolder + "\\" + fileName + ".json");
            }

            //if (System.IO.File.Exists("C:\\workflow\\Workflows\\History\\" + fileName + ".json"))
            //{
            //    System.IO.File.Delete("C:\\workflow\\Workflows\\History\\" + fileName + ".json");
            //}

            if(System.IO.File.Exists(_configuration.WorkflowsHistoryFolder + fileName + ".json"))
            {
                System.IO.File.Delete(_configuration.WorkflowsHistoryFolder + fileName + ".json");
            }

            System.IO.File.WriteAllText(path + "\\" + fileName + ".json", JsonConvert.SerializeObject(graph));
            //System.IO.File.WriteAllText("C:\\workflow\\Workflows\\History\\" + fileName + ".json", JsonConvert.SerializeObject(graph));
            System.IO.File.WriteAllText(_configuration.WorkflowsHistoryFolder + fileName + ".json", JsonConvert.SerializeObject(graph));
        }
    }
}
