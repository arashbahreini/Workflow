﻿using workflow.Contract;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Xml.Linq;
using System.Xml.XPath;
using Contract;

namespace workflow.Core
{

    public abstract class Task
    {
        public int Id { get; private set; }
        public string Name { get; private set; }
        public bool IsCommon { get; set; }
        public long TaskIndex { get; set; }
        public string Description { get; private set; }
        public bool IsEnabled { get; private set; }
        public long DeadLine { get; set; }
        public List<Setting> Settings { get; private set; }
        public Workflow Workflow { get; private set; }
        public List<FileInf> Files
        {
            get
            {
                return Workflow.FilesPerTask[Id];
            }
        }
        public List<Entity> Entities
        {
            get
            {
                return Workflow.EntitiesPerTask[Id];
            }
        }
        public Hashtable Hashtable
        {
            get { return Workflow.Hashtable; }
        }
        readonly XElement _xElement;

        protected Task(XElement xe, Workflow wf)
        {
            _xElement = xe;

            var xId = xe.Attribute("id");
            if (xId == null) throw new Exception("Task id attribute not found.");
            Id = int.Parse(xId.Value);

            var xName = xe.Attribute("name");
            if (xName == null) throw new Exception("Task name attribute not found.");
            Name = xName.Value;

            var xDesc = xe.Attribute("description");
            if (xDesc == null) throw new Exception("Task description attribute not found.");
            Description = xDesc.Value;

            var xEnabled = xe.Attribute("enabled");
            if (xEnabled == null) throw new Exception("Task enabled attribute not found.");
            IsEnabled = bool.Parse(xEnabled.Value);

            var xIsCommon = xe.Attribute("isCommon");
            if (xIsCommon != null)
            {
                IsCommon = bool.Parse(xIsCommon.Value);
            }


            Workflow = wf;
            Workflow.FilesPerTask.Add(Id, new List<FileInf>());
            Workflow.EntitiesPerTask.Add(Id, new List<Entity>());

            // settings
            IList<Setting> settings = new List<Setting>();

            foreach (var xSetting in xe.XPathSelectElements("wf:Setting", Workflow.XmlNamespaceManager))
            {
                // setting name
                var xSettingName = xSetting.Attribute("name");
                if (xSettingName == null) throw new Exception("Setting name not found");
                string settingName = xSettingName.Value;

                // setting value
                var xSettingValue = xSetting.Attribute("value");
                string settingValue = string.Empty;
                if (xSettingValue != null) settingValue = xSettingValue.Value;

                // setting attributes
                IList<Attribute> attributes = new List<Attribute>();

                foreach (var xAttribute in xSetting.Attributes().Where(attr => attr.Name.LocalName != "name" && attr.Name.LocalName != "value"))
                {
                    Attribute attr = new Attribute(xAttribute.Name.LocalName, xAttribute.Value);
                    attributes.Add(attr);
                }

                Setting setting = new Setting(settingName, settingValue, attributes.ToList());
                settings.Add(setting);
            }

            Settings = settings.ToList();
        }

        /// <summary>
        /// Starts the task.
        /// </summary>
        /// <returns>Task status.</returns>
        public abstract TaskStatus Run(WorkflowConfig workflowConfig, RequestModel model = null);

        /// <summary>
        /// Returns a setting value from its name.
        /// </summary>
        /// <param name="name">Setting name.</param>
        /// <returns>Setting value.</returns>
        public string GetSetting(string name)
        {
            var xNode = _xElement.XPathSelectElement(string.Format("wf:Setting[@name='{0}']", name), Workflow.XmlNamespaceManager);
            if (xNode != null)
            {
                var xSetting = xNode.Attribute("value");
                if (xSetting == null)
                {
                    throw new Exception("Setting " + name + " value attribute not found.");
                }
                return xSetting.Value;
            }
            return string.Empty;
            //var result =  Settings.Where(x => x.Name == name).FirstOrDefault().Value;
            //return result;
        }

        /// <summary>
        /// Returns a setting value from its name and returns a default value if the setting value is not found.
        /// </summary>
        /// <param name="name">Setting name.</param>
        /// <param name="defaultValue">Default value.</param>
        /// <returns>Setting value.</returns>
        public string GetSetting(string name, string defaultValue)
        {
            var returnValue = GetSetting(name);

            if (string.IsNullOrEmpty(returnValue))
            {
                return defaultValue;
            }

            return returnValue;
        }

        /// <summary>
        /// Returns a list of setting values from a setting name.
        /// </summary>
        /// <param name="name">Setting name.</param>
        /// <returns>A list of setting values.</returns>
        public string[] GetSettings(string name)
        {
            return _xElement.XPathSelectElements(string.Format("wf:Setting[@name='{0}']", name), Workflow.XmlNamespaceManager).Select(xe =>
            {
                var xAttribute = xe.Attribute("value");
                if (xAttribute == null)
                {
                    throw new Exception("Setting " + name + " value attribute not found.");
                }

                return xAttribute.Value;
            }).ToArray();
        }

        /// <summary>
        /// Returns a list of integers from a setting name.
        /// </summary>
        /// <param name="name">Setting name.</param>
        /// <returns>A list of integers.</returns>
        public int[] GetSettingsInt(string name)
        {
            return GetSettings(name).Select(int.Parse).ToArray();
        }

        /// <summary>
        /// Returns a list of setting values as XElements from a setting name.
        /// </summary>
        /// <param name="name">Setting name.</param>
        /// <returns>A list of setting values as XElements.</returns>
        public XElement[] GetXSettings(string name)
        {
            return _xElement.XPathSelectElements(string.Format("wf:Setting[@name='{0}']", name), Workflow.XmlNamespaceManager).ToArray();
        }

        /// <summary>
        /// Returns a list of the files loaded by this task through selectFiles setting.
        /// </summary>
        /// <returns>A list of the files loaded by this task through selectFiles setting.</returns>
        public FileInf[] SelectFiles()
        {
            var files = new List<FileInf>();
            foreach (var xSelectFile in GetXSettings("selectFiles"))
            {
                var xTaskId = xSelectFile.Attribute("value");
                if (xTaskId != null)
                {
                    var taskId = int.Parse(xTaskId.Value);

                    var qf = QueryFiles(Workflow.FilesPerTask[taskId], xSelectFile).ToArray();

                    files.AddRange(qf);
                }
                else
                {
                    var qf = (from lf in Workflow.FilesPerTask.Values
                              from f in QueryFiles(lf, xSelectFile)
                              select f).Distinct().ToArray();

                    files.AddRange(qf);
                }
            }
            return files.ToArray();
        }

        /// <summary>
        /// Filters a list of files from the tags in selectFiles setting.
        /// </summary>
        /// <param name="files">Files to filter.</param>
        /// <param name="xSelectFile">selectFile as an XElement</param>
        /// <returns>A list of files from the tags in selectFiles setting.</returns>
        public IEnumerable<FileInf> QueryFiles(IEnumerable<FileInf> files, XElement xSelectFile)
        {
            var fl = new List<FileInf>();

            if (xSelectFile.Attributes().Count(t => t.Name != "value") == 1)
            {
                return files;
            }

            foreach (var file in files)
            {
                // Check file tags
                bool ok = true;
                foreach (var xa in xSelectFile.Attributes())
                {
                    if (xa.Name != "name" && xa.Name != "value")
                    {
                        ok &= file.Tags.Any(tag => tag.Key == xa.Name && tag.Value == xa.Value);
                    }
                }

                if (ok)
                {
                    fl.Add(file);
                }
            }

            return fl;
        }

        /// <summary>
        /// Returns a list of the entities loaded by this task through selectEntities setting.
        /// </summary>
        /// <returns>A list of the entities loaded by this task through selectEntities setting.</returns>
        public Entity[] SelectEntities()
        {
            var entities = new List<Entity>();
            foreach (string id in GetSettings("selectEntities"))
            {
                var taskId = int.Parse(id);
                entities.AddRange(Workflow.EntitiesPerTask[taskId]);
            }
            return entities.ToArray();
        }

        /// <summary>
        /// Returns an object from the Hashtable through selectObject setting.
        /// </summary>
        /// <returns>An object from the Hashtable through selectObject setting.</returns>
        public object SelectObject()
        {
            var key = GetSetting("selectObject");
            if (Hashtable.ContainsKey(key))
            {
                return Hashtable[key];
            }
            return null;
        }

        private string BuildLogMsg(string msg)
        {
            return string.Format("{0} [{1}] {2}", Workflow.LogTag, GetType().Name, msg);
        }

        /// <summary>
        /// Logs an information message.
        /// </summary>
        /// <param name="msg">Log message.</param>
        public void Info(string msg)
        {
            Logger.Info(BuildLogMsg(msg));
        }

        /// <summary>
        /// Logs a formatted information message.
        /// </summary>
        /// <param name="msg">Formatted log message.</param>
        /// <param name="args">Arguments.</param>
        public void InfoFormat(string msg, params object[] args)
        {
            Logger.InfoFormat(BuildLogMsg(msg), args);
        }

        /// <summary>
        /// Logs a Debug log message.
        /// </summary>
        /// <param name="msg">Log message.</param>
        public void Debug(string msg)
        {
            Logger.Debug(BuildLogMsg(msg));
        }

        /// <summary>
        /// Logs a formatted debug message.
        /// </summary>
        /// <param name="msg">Log message.</param>
        /// <param name="args">Arguments.</param>
        public void DebugFormat(string msg, params object[] args)
        {
            Logger.DebugFormat(BuildLogMsg(msg), args);
        }

        /// <summary>
        /// Logs an error log message.
        /// </summary>
        /// <param name="msg">Log message.</param>
        public void Error(string msg)
        {
            Logger.Error(BuildLogMsg(msg));
        }

        /// <summary>
        /// Logs a formatted error message.
        /// </summary>
        /// <param name="msg">Log message.</param>
        /// <param name="args">Arguments.</param>
        public void ErrorFormat(string msg, params object[] args)
        {
            Logger.ErrorFormat(BuildLogMsg(msg), args);
        }

        /// <summary>
        /// Logs an error message and an exception.
        /// </summary>
        /// <param name="msg">Log message.</param>
        /// <param name="e">Exception.</param>
        public void Error(string msg, Exception e)
        {
            Logger.Error(BuildLogMsg(msg), e);
        }

        /// <summary>
        /// Logs a formatted log message and an exception.
        /// </summary>
        /// <param name="msg">Formatted log message.</param>
        /// <param name="e">Exception.</param>
        /// <param name="args">Arguments.</param>
        public void ErrorFormat(string msg, Exception e, params object[] args)
        {
            Logger.Error(string.Format(BuildLogMsg(msg), args), e);
        }
    }
}
