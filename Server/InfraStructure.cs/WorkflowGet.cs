using Contract;
using Contract.Common;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using workflow.Core;
using workflow.Core.Service.Contracts;
using Workflow.Core.Service.Contracts;

namespace InfraStructure.cs
{
    public class WorkflowGet
    {
        private static Configuration _configuration;
        public WorkflowConfig _workflowConfig;
        public WorkflowGet(Configuration configuration, WorkflowConfig workflowConfig)
        {
            _workflowConfig = workflowConfig;
            _configuration = configuration;
        }

        public ResultModel<List<WorkflowInfo>> GetLatestWorkflows()
        {
            var result = new ResultModel<List<WorkflowInfo>>();
            try
            {
                var workflowEngine = new WorkflowEngine(_configuration, _workflowConfig);
                var workflowList = workflowEngine.Workflows.Select(
                    wf => new WorkflowInfo
                    {
                        Id = wf.Id,
                        Name = wf.Name,
                        LaunchType = (workflow.Core.Service.Contracts.LaunchType)wf.LaunchType,
                        IsEnabled = wf.IsEnabled,
                        Description = wf.Description,
                        IsRunning = wf.IsRunning,
                        IsPaused = wf.IsPaused,
                        Period = wf.Period.ToString(@"dd\.hh\:mm\:ss"),
                        Path = wf.WorkflowFilePath,
                        DeadLine = wf.DeadLine,
                        IsExecutionGraphEmpty = wf.IsExecutionGraphEmpty,
                        Version = wf.Version,
                        VersionDescription = wf.VersionDescription
                    }).OrderBy(x => x.Id).ToArray();
                result.Data = new List<WorkflowInfo>();
                result.Succeed = true;
                result.Data.AddRange(workflowList);
            }
            catch (Exception ex)
            {
                result.Succeed = false;
                result.ErrorMessage = ex.Message.ToString();
            }
            return result;
        }

        public ResultModel<List<WorkflowInfo>> GetHistoryWorkflows(int id)
        {
            var result = new ResultModel<List<WorkflowInfo>>();
            try
            {
                var workflowEngine = new WorkflowEngine(_configuration, _workflowConfig,true);
                var workflowList = workflowEngine.Workflows.Where(x => x.Id == id).Select(
                    wf => new WorkflowInfo
                    {
                        Id = wf.Id,
                        Name = wf.Name,
                        LaunchType = (workflow.Core.Service.Contracts.LaunchType)wf.LaunchType,
                        IsEnabled = wf.IsEnabled,
                        Description = wf.Description,
                        IsRunning = wf.IsRunning,
                        IsPaused = wf.IsPaused,
                        Period = wf.Period.ToString(@"dd\.hh\:mm\:ss"),
                        Path = wf.WorkflowFilePath,
                        DeadLine = wf.DeadLine,
                        IsExecutionGraphEmpty = wf.IsExecutionGraphEmpty,
                        Version = wf.Version,
                        VersionDescription = wf.VersionDescription
                    }).OrderBy(x => x.Id).ToList();
                result.Data = new List<WorkflowInfo>();

                foreach (var item in workflowList.GroupBy(x => x.Id))
                {
                    workflowList.Remove(workflowList.Where(x => x.Id == item.Key).OrderByDescending(x => x.Version).FirstOrDefault());
                }
                result.Succeed = true;
                result.Data.AddRange(workflowList);
            }
            catch (Exception ex)
            {
                result.Succeed = false;
                result.ErrorMessage = ex.Message;
            }
            return result;
        }

        public List<NameIdModel> GetAllLastVersionWorkflows()
        {
            var result = new ResultModel<List<NameIdModel>>();
            var workflowEngine = new WorkflowEngine(_configuration, _workflowConfig, true);
            return workflowEngine.GetAllLastVersionWorkflows();
        }

        public ResultModel<WorkflowInfo> GetWorkflow(int id, long version)
        {
            var result = new ResultModel<WorkflowInfo>();
            try
            {
                var workflowEngine = new WorkflowEngine(_configuration, _workflowConfig,true);
                var wf = workflowEngine.GetWorkflow(id, version);
                if (wf != null)
                {
                    var workflowInfo = new WorkflowInfo
                    {
                        Id = wf.Id,
                        Name = wf.Name,
                        LaunchType = (workflow.Core.Service.Contracts.LaunchType)wf.LaunchType,
                        IsEnabled = wf.IsEnabled,
                        Description = wf.Description,
                        IsRunning = wf.IsRunning,
                        IsPaused = wf.IsPaused,
                        Period = wf.Period.ToString(@"dd\.hh\:mm\:ss"),
                        Path = wf.WorkflowFilePath,
                        IsExecutionGraphEmpty = wf.IsExecutionGraphEmpty,
                        DeadLine = wf.DeadLine,
                        Version = wf.Version,
                        VersionDescription = wf.VersionDescription,
                        Graph = workflowEngine.GetJsonGraph(wf.Name + "_" + version + ".json"),
                        Tasks = wf.Tasks.Select(x => new TaskInfo
                        {
                            Description = x.Description,
                            Id = x.Id,
                            IsCommon = x.IsCommon,
                            IsEnabled = x.IsEnabled,
                            Name = x.Name,
                            DeadLine = x.DeadLine,
                            Settings = x.Settings.Select(y => new SettingInfo
                            {
                                Name = y.Name,
                                Value = y.Value
                            }).ToList()
                        }).ToList()
                    };
                    result.Data = workflowInfo;
                }
            }
            catch (Exception ex)
            {
                result.Succeed = false;
                result.ErrorMessage = ex.Message.ToString();
            }
            return result;
        }

        public ResultModel<WorkflowInfo> GetLastVersionWorkflow(int id)
        {
            var result = new ResultModel<WorkflowInfo>();
            try
            {
                var workflowEngine = new WorkflowEngine(_configuration, _workflowConfig,true);
                var wf = workflowEngine.GetLastVersionWorkflow(id);
                if (wf != null)
                {
                    var workflowInfo = new WorkflowInfo
                    {
                        Id = wf.Id,
                        Name = wf.Name,
                        LaunchType = (workflow.Core.Service.Contracts.LaunchType)wf.LaunchType,
                        IsEnabled = wf.IsEnabled,
                        Description = wf.Description,
                        IsRunning = wf.IsRunning,
                        IsPaused = wf.IsPaused,
                        Period = wf.Period.ToString(@"dd\.hh\:mm\:ss"),
                        Path = wf.WorkflowFilePath,
                        IsExecutionGraphEmpty = wf.IsExecutionGraphEmpty,
                        DeadLine = wf.DeadLine,
                        Version = wf.Version,
                        VersionDescription = wf.VersionDescription,
                        Graph = workflowEngine.GetJsonGraph(wf.Name + "_" + wf.Version + ".json"),
                        Tasks = wf.Tasks.Select(x => new TaskInfo
                        {
                            Description = x.Description,
                            Id = x.Id,
                            IsCommon = x.IsCommon,
                            IsEnabled = x.IsEnabled,
                            Name = x.Name,
                            DeadLine = x.DeadLine,
                            Settings = x.Settings.Select(y => new SettingInfo
                            {
                                Name = y.Name,
                                Value = y.Value
                            }).ToList()
                        }).ToList()
                    };
                    result.Data = workflowInfo;
                }
            }
            catch (Exception ex)
            {
                result.Succeed = false;
                result.ErrorMessage = ex.Message.ToString();
            }
            return result;
        }

        public ResultModel<List<string>> GetSettings(string taskName)
        {
            var result = new ResultModel<List<string>>();
            try
            {
                var workflowEngine = new WorkflowEngine(_configuration, _workflowConfig);
                JObject o = JObject.Parse(File.ReadAllText(workflowEngine.TasksSettingsFile));
                var token = o.SelectToken(taskName);
                var resultString = token != null ? token.ToObject<string[]>().OrderBy(x => x).ToArray() : new string[] { };
                result.Data = new List<string>();
                result.Data.AddRange(resultString);
            }
            catch (Exception ex)
            {
                result.Succeed = false;
                result.ErrorMessage = ex.Message.ToString();
            }
            return result;
        }

        public ResultModel<GraphModel> GetExecutionGraph(int id, long version)
        {
            var result = new ResultModel<GraphModel>();
            try
            {
                var workflowEngine = new WorkflowEngine(_configuration, _workflowConfig);
                var wf = workflowEngine.GetWorkflow(id, version);

                using (var r = new StreamReader(wf.WorkflowFilePath))
                {

                }
            }
            catch (Exception ex)
            {
                result.Succeed = false;
                result.ErrorMessage = ex.Message.ToString();
            }
            return result;
        }

        public ResultModel<List<TaskNameModel>> GetTaskNames()
        {
            var result = new ResultModel<List<TaskNameModel>>();
            try
            {
                var workflowEngine = new WorkflowEngine(_configuration, _workflowConfig,true);
                result.Data = new List<TaskNameModel>();
                result.Data.AddRange(JsonConvert.DeserializeObject<List<TaskNameModel>>(File.ReadAllText(workflowEngine.TasksNamesFile)));
            }
            catch (Exception ex)
            {
                result.Succeed = false;
                result.ErrorMessage = ex.Message.ToString();
            }
            return result;
        }
        public ResultModel DeleteWorkflow(int id, long version)
        {
            var result = new ResultModel();
            try
            {
                var workflowEngine = new WorkflowEngine(_configuration, _workflowConfig);
                var wf = workflowEngine.GetWorkflow(id, version);
                if (wf != null)
                {
                    string destJsonGraphPath = Path.Combine(workflowEngine.TrashFolder, wf.Name + "_" + version + ".json");
                    string destPath = Path.Combine(workflowEngine.TrashFolder, Path.GetFileName(wf.WorkflowFilePath));
                    if (File.Exists(destPath))
                    {
                        destPath = Path.Combine(workflowEngine.TrashFolder
                            , Path.GetFileNameWithoutExtension(destPath) + "_" + DateTime.Now.ToString("yyyyMMddHHmmss") + Path.GetExtension(destPath));
                    }

                    if (File.Exists(destJsonGraphPath))
                    {
                        destJsonGraphPath = Path.Combine(workflowEngine.TrashFolder
                            , Path.GetFileNameWithoutExtension(destJsonGraphPath) + "_" + DateTime.Now.ToString("yyyyMMddHHmmss") + Path.GetExtension(destJsonGraphPath));
                    }

                    File.Move(wf.WorkflowFilePath, destPath);
                    var temp = workflowEngine.WorkflowsFolder + "\\" + wf.Name + "_" + version + ".json";
                    if (File.Exists(workflowEngine.WorkflowsFolder + "\\" + wf.Name + "_" + version + ".json"))
                    {
                        File.Move(workflowEngine.WorkflowsFolder + "\\" + wf.Name + "_" + version + ".json", destJsonGraphPath);
                    }
                } 
            }
            catch (Exception ex)
            {
                result.Succeed = false;
                result.ErrorMessage = ex.Message.ToString();
            }
            return result;
        }
    }
}
