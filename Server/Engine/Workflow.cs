using Newtonsoft.Json;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Xml;
using System.Xml.Linq;
using System.Xml.Schema;
using System.Xml.XPath;
using workflow.Contract;
using workflow.Core.ExecutionGraph;
using workflow.Core.ExecutionGraph.Flowchart;
using workflow.Core.Service.Contracts.Enum;

namespace workflow.Core
{
    /// <summary>
    /// Worflow.
    /// </summary>
    public class Workflow
    {
        /// <summary>
        /// Default parent node id to start with in the execution graph.
        /// </summary>
        public const int StartId = -1;

        /// <summary>
        /// Workflow file path.
        /// </summary>
        public string WorkflowFilePath { get; private set; }
        /// <summary>
        /// workflow temp folder.
        /// </summary>
        public string workflowTempFolder { get; private set; }
        /// <summary>
        /// Workflow temp folder.
        /// </summary>
        public string WorkflowTempFolder { get; private set; }
        /// <summary>
        /// XSD path.
        /// </summary>
        public string XsdPath { get; private set; }
        /// <summary>
        /// Workflow Id.
        /// </summary>
        public int Id { get; private set; }
        /// <summary>
        /// Workflow name.
        /// </summary>
        public string Name { get; private set; }
        /// <summary>
        /// Workflow verison.
        /// </summary>
        public long Version { get; private set; }
        /// <summary>
        /// Workflow description.
        /// </summary>
        public string Description { get; private set; }
        /// <summary>
        /// Workflow lanch type.
        /// </summary>
        public LaunchType LaunchType { get; private set; }

        /// <summary>
        /// Workflow period.
        /// </summary>
        public TimeSpan Period { get; private set; }
        /// <summary>
        /// Time set to complete the flow
        /// </summary>
        public long DeadLine { get; private set; }

        public string VersionDescription { get; set; }
        /// <summary>
        /// Shows whether this workflow is enabled or not.
        /// </summary>
        public bool IsEnabled { get; private set; }
        /// <summary>
        /// Shows whether this workflow is running or not.
        /// </summary>
        public bool IsRunning { get; private set; }
        /// <summary>
        /// Shows whether this workflow is suspended or not.
        /// </summary>
        public bool IsPaused { get; private set; }
        /// <summary>
        /// Workflow tasks.
        /// </summary>
        public List<Task> Tasks { get; private set; }
        /// <summary>
        /// Workflow files.
        /// </summary>
        public Dictionary<int, List<FileInf>> FilesPerTask { get; private set; }
        /// <summary>
        /// Workflow entities.
        /// </summary>
        public Dictionary<int, List<Entity>> EntitiesPerTask { get; private set; }
        /// <summary>
        /// Job Id.
        /// </summary>
        public int JobId { get; private set; }
        /// <summary>
        /// Log tag.
        /// </summary>
        public string LogTag { get { return string.Format("[{0} / {1}]", Name, JobId); } }
        /// <summary>
        /// Xml Namespace Manager.
        /// </summary>
        public XmlNamespaceManager XmlNamespaceManager { get; private set; }
        /// <summary>
        /// Execution graph.
        /// </summary>
        public Graph ExecutionGraph { get; private set; }
        /// <summary>
        /// Workflow XDocument.
        /// </summary>
        public XDocument XDoc { get; private set; }

        public XDocument XWorkflowDocument { get; set; }
        /// <summary>
        /// XNamespace.
        /// </summary>
        public XNamespace XNamespaceWf { get; private set; }
        /// <summary>
        /// Shows whether the execution graph is empty or not.
        /// </summary>
        public bool IsExecutionGraphEmpty { get; private set; }
        /// <summary>
        /// Hashtable used as shared memory for tasks.
        /// </summary>
        public Hashtable Hashtable { get; private set; }


        private System.Threading.Tasks.Task _task;
        //private CancellationTokenSource Canceller { get; set; }

        /// <summary>
        /// Creates a new workflow.
        /// </summary>
        /// <param name="path">Workflow file path.</param>
        /// <param name="workflowTempFolder">workflow temp folder.</param>
        /// <param name="xsdPath">XSD path.</param>
        public Workflow(string path, string workflowTempFolder, string xsdPath)
        {
            JobId = 1;
            _task = null;
            WorkflowFilePath = path;
            XsdPath = xsdPath;
            FilesPerTask = new Dictionary<int, List<FileInf>>();
            EntitiesPerTask = new Dictionary<int, List<Entity>>();
            Hashtable = new Hashtable();
            Check();
            Load();
        }

        /// <summary>
        /// Returns informations about this workflow.
        /// </summary>
        /// <returns>Informations about this workflow.</returns>
        public override string ToString()
        {
            return string.Format("{{id: {0}, name: {1}, enabled: {2}, launchType: {3}}}", Id, Name, IsEnabled, LaunchType);
        }

        void Check()
        {
            Thread.Sleep(10);
            var schemas = new XmlSchemaSet();
            schemas.Add("urn:workflow-schema", XsdPath);
            var doc = XDocument.Load(WorkflowFilePath);
            string msg = string.Empty;
            doc.Validate(schemas, (o, e) =>
            {
                msg += e.Message + Environment.NewLine;
            });

            if (!string.IsNullOrEmpty(msg))
            {
                throw new Exception("The workflow XML document is not valid. Error: " + msg);
            }
        }

        void Load()
        {
            using (var xmlReader = XmlReader.Create(WorkflowFilePath))
            {
                var xmlNameTable = xmlReader.NameTable;
                if (xmlNameTable != null)
                {
                    XmlNamespaceManager = new XmlNamespaceManager(xmlNameTable);
                    XmlNamespaceManager.AddNamespace("wf", "urn:workflow-schema");
                }
                else
                {
                    throw new Exception("xmlNameTable of " + WorkflowFilePath + " is null");
                }

                // Loading settings
                var xdoc = XDocument.Load(WorkflowFilePath);
                XDoc = xdoc;
                XNamespaceWf = "urn:workflow-schema";

                Id = int.Parse(GetWorkflowAttribute(xdoc, "id"));
                Name = GetWorkflowAttribute(xdoc, "name");
                Description = GetWorkflowAttribute(xdoc, "description");
                DeadLine = Convert.ToInt64(GetWorkflowSetting(xdoc, "deadLine"));
                Version = Convert.ToInt64(GetWorkflowSetting(xdoc, "version"));
                LaunchType = (LaunchType)Enum.Parse(typeof(LaunchType), GetWorkflowSetting(xdoc, "launchType"), true);
                VersionDescription = GetWorkflowSetting(xdoc, "versionDescription");
                if (LaunchType == LaunchType.Periodic) Period = TimeSpan.Parse(GetWorkflowSetting(xdoc, "period"));
                IsEnabled = bool.Parse(GetWorkflowSetting(xdoc, "enabled"));

                if (xdoc.Root != null)
                {
                    var xExecutionGraph = xdoc.Root.Element(XNamespaceWf + "ExecutionGraph");
                    IsExecutionGraphEmpty = xExecutionGraph == null || !xExecutionGraph.Elements().Any();
                }
                // Loading tasks
                var tasks = new List<Task>();
                var tasksList = xdoc.XPathSelectElements("/wf:Workflow/wf:Tasks/wf:Task", XmlNamespaceManager);
                foreach (var xTask in xdoc.XPathSelectElements("/wf:Workflow/wf:Tasks/wf:Task", XmlNamespaceManager))
                {
                    var xAttribute = xTask.Attribute("name");
                    if (xAttribute != null)
                    {
                        var name = xAttribute.Value;
                        var assemblyName = "Workflow.Tasks." + name;
                        var typeName = "Workflow.Tasks." + name + "." + name + ", " + assemblyName;
                        var type = Type.GetType(typeName);

                        if (type != null)
                        {
                            var task = (Task)Activator.CreateInstance(type, xTask, this);
                            if (xTask.Descendants().Any(node => (string)node.Attribute("name") == "زمان لازم"))
                            {
                                if (!string.IsNullOrEmpty(
                                     xTask.Descendants()
                                    .Where(node => (string)node.Attribute("name") == "زمان لازم")
                                    .Select(attribute => attribute.Attribute("value"))
                                    .First().Value))
                                    task.DeadLine = xTask.Descendants()
                                        .Where(node => (string)node.Attribute("name") == "زمان لازم")
                                        .Select(attribute => (long)attribute.Attribute("value"))
                                        .First();
                            }

                            tasks.Add(task);
                        }
                        else
                        {
                            throw new Exception("The type of the task " + name + " could not be loaded.");
                        }
                    }
                    else
                    {
                        throw new Exception("Name attribute of the task " + xTask + " does not exist.");
                    }
                }
                Tasks = tasks.ToList();

                // Loading execution graph
                var xExectionGraph = xdoc.XPathSelectElement("/wf:Workflow/wf:ExecutionGraph", XmlNamespaceManager);
                if (xExectionGraph != null)
                {
                    var taskNodes = GetTaskNodes(xExectionGraph).ToList();

                    // Check startup node, parallel tasks and infinite loops
                    if (taskNodes.Any()) CheckStartupNode(taskNodes, "Startup node with parentId=-1 not found in ExecutionGraph execution graph.");
                    CheckParallelTasks(taskNodes, "Parallel tasks execution detected in ExecutionGraph execution graph.");
                    CheckInfiniteLoop(taskNodes, "Infinite loop detected in ExecutionGraph execution graph.");

                    // OnSuccess
                    GraphEvent onSuccess = null;
                    var xOnSuccess = xExectionGraph.XPathSelectElement("wf:OnSuccess", XmlNamespaceManager);
                    if (xOnSuccess != null)
                    {
                        var onSuccessNodes = GetTaskNodes(xOnSuccess).ToList();
                        CheckStartupNode(onSuccessNodes, "Startup node with parentId=-1 not found in OnSuccess execution graph.");
                        CheckParallelTasks(onSuccessNodes, "Parallel tasks execution detected in OnSuccess execution graph.");
                        CheckInfiniteLoop(onSuccessNodes, "Infinite loop detected in OnSuccess execution graph.");
                        onSuccess = new GraphEvent(onSuccessNodes);
                    }

                    // OnWarning
                    GraphEvent onWarning = null;
                    var xOnWarning = xExectionGraph.XPathSelectElement("wf:OnWarning", XmlNamespaceManager);
                    if (xOnWarning != null)
                    {
                        var onWarningNodes = GetTaskNodes(xOnWarning).ToList();
                        CheckStartupNode(onWarningNodes, "Startup node with parentId=-1 not found in OnWarning execution graph.");
                        CheckParallelTasks(onWarningNodes, "Parallel tasks execution detected in OnWarning execution graph.");
                        CheckInfiniteLoop(onWarningNodes, "Infinite loop detected in OnWarning execution graph.");
                        onWarning = new GraphEvent(onWarningNodes);
                    }

                    // OnError
                    GraphEvent onError = null;
                    var xOnError = xExectionGraph.XPathSelectElement("wf:OnError", XmlNamespaceManager);
                    if (xOnError != null)
                    {
                        var onErrorNodes = GetTaskNodes(xOnError).ToList();
                        CheckStartupNode(onErrorNodes, "Startup node with parentId=-1 not found in OnError execution graph.");
                        CheckParallelTasks(onErrorNodes, "Parallel tasks execution detected in OnError execution graph.");
                        CheckInfiniteLoop(onErrorNodes, "Infinite loop detected in OnError execution graph.");
                        onError = new GraphEvent(onErrorNodes);
                    }

                    ExecutionGraph = new Graph(taskNodes, onSuccess, onWarning, onError);
                }
            }
        }

        List<Node> GetTaskNodes(XElement xExectionGraph)
        {
            var nodes = xExectionGraph
                .Elements()
                .Where(xe => xe.Name.LocalName != "OnSuccess" && xe.Name.LocalName != "OnWarning" && xe.Name.LocalName != "OnError")
                .Select(XNodeToNode)
                .ToList();
            return nodes;
        }

        If XIfToIf(XElement xIf)
        {
            int xIfIndex = 0;
            if (xIf.Attribute("index") != null)
            {
                xIfIndex = int.Parse(xIf.Attribute("index").Value);
            }


            var xId = xIf.Attribute("id");
            if (xId == null) throw new Exception("If id attribute not found.");
            var id = int.Parse(xId.Value);
            var xParent = xIf.Attribute("parent");
            if (xParent == null) throw new Exception("If parent attribute not found.");
            var parentId = int.Parse(xParent.Value);
            var xIfId = xIf.Attribute("if");
            if (xIfId == null) throw new Exception("If attribute not found.");
            var ifId = int.Parse(xIfId.Value);


            // Do nodes
            var doNodes = xIf.XPathSelectElement("wf:Do", XmlNamespaceManager)
                .Elements()
                .Select(XNodeToNode)
                .ToList();


            CheckStartupNode(doNodes, "Startup node with parentId=-1 not found in DoIf>Do execution graph.");
            CheckParallelTasks(doNodes, "Parallel tasks execution detected in DoIf>Do execution graph.");
            CheckInfiniteLoop(doNodes, "Infinite loop detected in DoIf>Do execution graph.");

            // Otherwise nodes
            List<Node> elseNodes = null;
            var xElse = xIf.XPathSelectElement("wf:Else", XmlNamespaceManager);
            if (xElse != null)
            {
                elseNodes = xElse
                    .Elements()
                    .Select(XNodeToNode)
                    .ToList();

                CheckStartupNode(elseNodes, "Startup node with parentId=-1 not found in DoIf>Otherwise execution graph.");
                CheckParallelTasks(elseNodes, "Parallel tasks execution detected in DoIf>Otherwise execution graph.");
                CheckInfiniteLoop(elseNodes, "Infinite loop detected in DoIf>Otherwise execution graph.");
            }

            return new If(id, parentId, ifId, doNodes, elseNodes, xIfIndex);
        }

        While XWhileToWhile(XElement xWhile)
        {
            //var xTaskIndex = xNode.Attribute("index");
            //if (xTaskIndex == null) throw new Exception("Task index not found.");
            //var taskIndex = int.Parse(xTaskIndex.Value);

            var xId = xWhile.Attribute("id");
            if (xId == null) throw new Exception("While Id attribute not found.");
            var id = int.Parse(xId.Value);

            var xWhileIndex = xWhile.Attribute("index");
            if (xWhileIndex == null) throw new Exception("While Id attribute not found.");
            var index = int.Parse(xWhileIndex.Value);

            var xParent = xWhile.Attribute("parent");
            if (xParent == null) throw new Exception("While parent attribute not found.");
            var parentId = int.Parse(xParent.Value);
            var xWhileId = xWhile.Attribute("while");
            if (xWhileId == null) throw new Exception("While attribute not found.");
            var whileId = int.Parse(xWhileId.Value);

            var doNodes = xWhile
                .Elements()
                .Select(XNodeToNode)
                .ToList();

            CheckStartupNode(doNodes, "Startup node with parentId=-1 not found in DoWhile>Do execution graph.");
            CheckParallelTasks(doNodes, "Parallel tasks execution detected in DoWhile>Do execution graph.");
            CheckInfiniteLoop(doNodes, "Infinite loop detected in DoWhile>Do execution graph.");

            return new While(id, parentId, whileId, doNodes, index);
        }

        Switch XSwitchToSwitch(XElement xSwitch)
        {
            var xId = xSwitch.Attribute("id");
            if (xId == null) throw new Exception("Switch Id attribute not found.");
            var id = int.Parse(xId.Value);

            var xswitchIndex = xSwitch.Attribute("index");
            if (xswitchIndex == null) throw new Exception("Task index not found.");
            var switchIndex = int.Parse(xswitchIndex.Value);

            var xParent = xSwitch.Attribute("parent");
            if (xParent == null) throw new Exception("Switch parent attribute not found.");
            var parentId = int.Parse(xParent.Value);

            var xSwitchId = xSwitch.Attribute("switch");
            if (xSwitchId == null) throw new Exception("Switch attribute not found.");
            var switchId = int.Parse(xSwitchId.Value);

            var cases = xSwitch
                .XPathSelectElements("wf:Case", XmlNamespaceManager)
                .Select(xCase =>
                {
                    var xValue = xCase.Attribute("value");
                    if (xValue == null) throw new Exception("Case value attribute not found.");
                    var val = xValue.Value;

                    var nodes = xCase
                        .Elements()
                        .Select(XNodeToNode)
                        .ToList();

                    var nodeName = string.Format("Switch>Case(value={0})", val);
                    CheckStartupNode(nodes, "Startup node with parentId=-1 not found in " + nodeName + " execution graph.");
                    CheckParallelTasks(nodes, "Parallel tasks execution detected in " + nodeName + " execution graph.");
                    CheckInfiniteLoop(nodes, "Infinite loop detected in " + nodeName + " execution graph.");

                    return new Case(val, nodes);
                });

            var xDefault = xSwitch.XPathSelectElement("wf:Default", XmlNamespaceManager);
            if (xDefault == null) return new Switch(id, parentId, switchId, cases, null, switchIndex);
            var @default = xDefault
                .Elements()
                .Select(XNodeToNode)
                .ToList();

            if (@default.Count > 0)
            {
                CheckStartupNode(@default,
                    "Startup node with parentId=-1 not found in Switch>Default execution graph.");
                CheckParallelTasks(@default, "Parallel tasks execution detected in Switch>Default execution graph.");
                CheckInfiniteLoop(@default, "Infinite loop detected in Switch>Default execution graph.");
            }

            return new Switch(id, parentId, switchId, cases, @default, switchIndex);
        }

        Node XNodeToNode(XElement xNode)
        {
            switch (xNode.Name.LocalName)
            {
                case "Task":
                    var xId = xNode.Attribute("id");
                    if (xId == null) throw new Exception("Task id not found.");
                    var id = int.Parse(xId.Value);

                    var xTaskIndex = xNode.Attribute("index");
                    if (xTaskIndex == null) throw new Exception("Task index not found.");
                    var taskIndex = int.Parse(xTaskIndex.Value);

                    var xParentId = xNode.XPathSelectElement("wf:Parent", XmlNamespaceManager)
                        .Attribute("id");

                    if (xParentId == null) throw new Exception("Parent id not found.");
                    var parentId = int.Parse(xParentId.Value);

                    var node = new Node(id, parentId, null, null, null, taskIndex);
                    return node;
                case "If":
                    return XIfToIf(xNode);
                case "While":
                    return XWhileToWhile(xNode);
                case "Switch":
                    return XSwitchToSwitch(xNode);
                default:
                    throw new Exception(xNode.Name.LocalName + " is not supported.");
            }
        }

        void CheckStartupNode(List<Node> nodes, string errorMsg)
        {
            if (nodes == null) throw new ArgumentNullException(); // new ArgumentNullException(nameof(nodes))
            if (nodes.All(n => n.ParentId != StartId)) throw new Exception(errorMsg);
        }

        void CheckParallelTasks(List<Node> taskNodes, string errorMsg)
        {
            bool parallelTasksDetected = false;
            foreach (var taskNode in taskNodes)
            {
                if (taskNodes.Count(n => n.ParentId == taskNode.Id) > 1)
                {
                    parallelTasksDetected = true;
                    break;
                }
            }

            if (parallelTasksDetected)
            {
                throw new Exception(errorMsg);
            }
        }

        void CheckInfiniteLoop(List<Node> taskNodes, string errorMsg)
        {
            var startNode = taskNodes.FirstOrDefault(n => n.ParentId == StartId);

            if (startNode != null)
            {
                var infiniteLoopDetected = CheckInfiniteLoop(startNode, taskNodes);

                if (!infiniteLoopDetected)
                {
                    foreach (var taskNode in taskNodes.Where(n => n.Id != startNode.Id).ToList())
                    {
                        infiniteLoopDetected |= CheckInfiniteLoop(taskNode, taskNodes);

                        if (infiniteLoopDetected) break;
                    }
                }

                if (infiniteLoopDetected)
                {
                    throw new Exception(errorMsg);
                }
            }
        }

        bool CheckInfiniteLoop(Node startNode, List<Node> taskNodes)
        {
            foreach (var taskNode in taskNodes.Where(n => n.ParentId != startNode.ParentId))
            {
                if (taskNode.Id == startNode.Id)
                {
                    return true;
                }
            }

            return false;
        }

        string GetWorkflowAttribute(XDocument xdoc, string attr)
        {
            var xAttribute = xdoc.XPathSelectElement("/wf:Workflow", XmlNamespaceManager).Attribute(attr);
            if (xAttribute != null)
            {
                return xAttribute.Value;
            }
            throw new Exception("Workflow attribute " + attr + "not found.");
        }

        string GetWorkflowSetting(XDocument xdoc, string name)
        {
            if (xdoc.XPathSelectElement(string.Format("/wf:Workflow[@id='{0}']/wf:Settings/wf:Setting[@name='{1}']", Id, name), XmlNamespaceManager) != null)
            {
                var xAttribute = xdoc
                    .XPathSelectElement(
                        string.Format("/wf:Workflow[@id='{0}']/wf:Settings/wf:Setting[@name='{1}']", Id, name),
                        XmlNamespaceManager)
                    .Attribute("value");
                if (xAttribute != null)
                {
                    return xAttribute.Value;
                }
            }
            else
            {
                return string.Empty;
            }


            throw new Exception("Workflow setting " + name + " not found.");
        }

        /// <summary>
        /// Starts this workflow.
        /// </summary>
        public void Start(RequestModel model = null, Workflow workflow = null)
        {
            Logger.InfoFormat("Action Name = workflow.Core.Workflow.Start Parameters are model = {0} ---- workflow = {1}.", JsonConvert.SerializeObject(model), JsonConvert.SerializeObject(workflow.Id));
            model.cancellerToken = new CancellationTokenSource();
            var task = new System.Threading.Tasks.Task(() =>
                {
                    try
                    {
                        IsRunning = true;
                        Logger.InfoFormat("{0} Workflow started.", LogTag);
                        if (model.IsRunningFromPending == false)
                        {
                            //new WorkflowLogProxy().AddLog(new Service.Contracts.WorkflowLogModel
                            //{
                            //    WorkflowId = workflow.Id,
                            //    Action = WorkflowStatus.Start,
                            //    RequestId = model.TaskModel != null ? JsonConvert.DeserializeObject<InnerRequestModel>(model.TaskModel).RequestID : 0,
                            //    UniqKey = model.UniqKey,
                            //    UserId = model.UserId,
                            //    WorkflowVersion = model.Version,
                            //    TaskDataModel = model.TaskModel,
                            //    WorkflowName = model.WorkflowName,
                            //    RequestNumber = JsonConvert.DeserializeObject<InnerRequestModel>(model.TaskModel).RequestNumber
                            //});
                        }

                        CreateTempFolder();

                        // Run the tasks
                        if (ExecutionGraph == null)
                        {
                            bool success = true;
                            bool warning = false;
                            bool error = false;
                            RunSequentialTasks(Tasks, ref success, ref warning, ref error, model);
                        }
                        else
                        {
                            XWorkflowDocument = workflow.XDoc;
                            var status = RunTasks(ExecutionGraph.Nodes, Tasks, model);

                            switch (status)
                            {
                                case Status.Success:
                                    if (ExecutionGraph.OnSuccess != null)
                                    {
                                        var successTasks = NodesToTasks(ExecutionGraph.OnSuccess.Nodes);
                                        RunTasks(ExecutionGraph.OnSuccess.Nodes, successTasks, model);
                                    }
                                    break;
                                case Status.Warning:
                                    if (ExecutionGraph.OnWarning != null)
                                    {
                                        var warningTasks = NodesToTasks(ExecutionGraph.OnWarning.Nodes);
                                        RunTasks(ExecutionGraph.OnWarning.Nodes, warningTasks, model);
                                    }
                                    break;
                                case Status.Error:
                                    if (ExecutionGraph.OnError != null)
                                    {
                                        var errorTasks = NodesToTasks(ExecutionGraph.OnError.Nodes);
                                        RunTasks(ExecutionGraph.OnError.Nodes, errorTasks, model);
                                    }
                                    break;
                            }
                        }
                    }
                    catch (ThreadAbortException)
                    {
                    }
                    catch (Exception e)
                    {
                        Logger.ErrorFormat("An error occured while running the workflow. Error: {0}", e.Message, this);
                    }
                    finally
                    {
                        Logger.InfoFormat("{0} Workflow finished.", LogTag);
                        //new WorkflowLogProxy().AddLog(new Service.Contracts.WorkflowLogModel
                        //{
                        //    Action = model.IsStoped ? WorkflowStatus.Stop : WorkflowStatus.Finish,
                        //    RequestId = model.TaskModel != null ? JsonConvert.DeserializeObject<InnerRequestModel>(model.TaskModel).RequestID : 0,
                        //    UniqKey = model.UniqKey,
                        //    WorkflowId = model.Id,
                        //    UserId = model.UserId,
                        //    WorkflowVersion = model.Version,
                        //    TaskDataModel = model.TaskModel,
                        //    WorkflowName = model.WorkflowName,
                        //    RequestNumber = JsonConvert.DeserializeObject<InnerRequestModel>(model.TaskModel).RequestNumber
                        //});
                        foreach (List<FileInf> files in FilesPerTask.Values) files.Clear();
                        foreach (List<Entity> entities in EntitiesPerTask.Values) entities.Clear();
                        //_task.Start();
                        IsRunning = false;
                        GC.Collect();
                        JobId++;

                    }
                }, model.cancellerToken.Token);

            if (model != null)
            {
                model._task = task;
                model._task.Start();
            }
        }

        public void Abort(RequestModel model)
        {
            model.cancellerToken.Cancel();
        }

        List<Task> NodesToTasks(List<Node> nodes)
        {
            var tasks = new List<Task>();

            if (nodes == null) return tasks.ToList();

            foreach (var node in nodes)
            {
                var @if = node as If;
                if (@if != null)
                {
                    var doTasks = NodesToTasks(@if.DoNodes);
                    var otherwiseTasks = NodesToTasks(@if.ElseNodes);

                    var ifTasks = new List<Task>(doTasks);
                    foreach (var task in otherwiseTasks)
                    {
                        if (ifTasks.All(t => t.Id != task.Id))
                        {
                            ifTasks.Add(task);
                        }
                    }

                    tasks.AddRange(ifTasks);
                }
                else if (node is While)
                {
                    tasks.AddRange(NodesToTasks(((While)node).Nodes));
                }
                else if (node is Switch)
                {
                    var @switch = (Switch)node;
                    tasks.AddRange(NodesToTasks(@switch.Default).Where(task => tasks.All(t => t.Id != task.Id)));
                    tasks.AddRange(NodesToTasks(@switch.Cases.SelectMany(@case => @case.Nodes).ToList()).Where(task => tasks.All(t => t.Id != task.Id)));
                }
                else
                {
                    var task = GetTask(node.Id);
                    task.TaskIndex = (int)node.Index;
                    if (task != null)
                    {
                        if (tasks.All(t => t.Id != task.Id))
                        {
                            tasks.Add(task);
                        }
                    }
                    else
                    {
                        throw new Exception("Task " + node.Id + " not found.");
                    }
                }
            }

            return tasks.ToList();
        }

        Status RunTasks(List<Node> nodes, List<Task> tasks, RequestModel model = null)
        {
            var success = true;
            var warning = false;
            var atLeastOneSucceed = false;

            if (nodes.Any())
            {
                Node startNode;
                if (model.TaskIndex == null)
                {
                    startNode = GetStartupNode(nodes);
                }
                else
                {
                    startNode = GetStartupNode(nodes, model.TaskIndex);
                }

                var @if = startNode as If;
                if (@if != null)
                {
                    var doIf = @if;
                    RunIf(tasks, nodes, doIf, ref success, ref warning, ref atLeastOneSucceed, model);
                }
                else if (startNode is While)
                {
                    var doWhile = (While)startNode;
                    RunWhile(tasks, nodes, doWhile, ref success, ref warning, ref atLeastOneSucceed, model);
                }
                else
                {
                    if (startNode.ParentId == StartId)
                    {
                        RunTasks(tasks, nodes, startNode, ref success, ref warning, ref atLeastOneSucceed, model);
                    }
                    //RunTasks(tasks, nodes, startNode, ref success, ref warning, ref atLeastOneSucceed, model);
                    //if (model.TaskIndex != null)
                    //{
                    //    RunTasks(tasks, nodes, startNode, ref success, ref warning, ref atLeastOneSucceed, model);
                    //}
                }
            }

            if (success)
            {
                return Status.Success;
            }

            if (atLeastOneSucceed || warning)
            {
                return Status.Warning;
            }

            return Status.Error;
        }

        private static void RunSequentialTasks(IEnumerable<Task> tasks, ref bool success, ref bool warning, ref bool atLeastOneSucceed, RequestModel model = null)
        {
            foreach (var task in tasks)
            {
                if (!task.IsEnabled && success) continue;
                var status = task.Run(model);
                success &= status.Status == Status.Success;
                warning |= status.Status == Status.Warning;
                if (!atLeastOneSucceed && status.Status == Status.Success) atLeastOneSucceed = true;
            }
        }

        void RunTaskLog(long taskId, long taskIndex, TaskType taskType, RequestModel model = null)
        {
            var log = new Service.Contracts.WorkflowLogModel();

            if (model.IsRunningFromPending == false)
            {
                log.TaskType = taskType;
                log.WorkflowId = model.Id;
                log.Action = WorkflowStatus.Start;
                log.TaskId = taskId;
                log.TaskIndex = taskIndex;
                log.RequestId = model.TaskModel != null ? JsonConvert.DeserializeObject<InnerRequestModel>(model.TaskModel).RequestID : 0;
                log.UniqKey = model.UniqKey;
                log.WorkflowVersion = model.Version;
                log.TaskDataModel = model.TaskModel;
                log.WorkflowName = model.WorkflowName;
                log.TaskName = GetTask((int)taskId).Name;
                if (model.TaskModel != null)
                    log.RequestNumber = JsonConvert.DeserializeObject<InnerRequestModel>(model.TaskModel).RequestNumber;
                // new WorkflowLogProxy().AddLog(log);
            }
            else
            {
                model.IsRunningFromPending = false;
            }
        }

        Node GetChileNode(List<Node> nodes, Node node, RequestModel model)
        {
            if (model.TaskIndex == null)
            {
                return nodes.FirstOrDefault(n => n.ParentId == node.Id);
            }
            else
            {
                var parent = GetParentNodeByChildId(node.Id);
                if (parent != null)
                    if (parent.IfId != null) model.TaskIndex = null;
                return parent;
            }
            return null;
        }

        void RunTasks(List<Task> tasks, List<Node> nodes, Node node, ref bool success, ref bool warning, ref bool atLeastOneSucceed, RequestModel model = null)
        {
            if (node != null)
            {
                if (node is If || node is While || node is Switch)
                {
                    var if1 = node as If;
                    if (if1 != null)
                    {
                        var @if = if1;
                        RunIf(tasks, nodes, @if, ref success, ref warning, ref atLeastOneSucceed, model);
                    }
                    else if (node is While)
                    {
                        var @while = (While)node;
                        RunWhile(tasks, nodes, @while, ref success, ref warning, ref atLeastOneSucceed, model);
                    }
                    else
                    {
                        var @switch = (Switch)node;
                        RunSwitch(tasks, nodes, @switch, ref success, ref warning, ref atLeastOneSucceed, model);
                    }
                }
                else
                {
                    var task = GetTask(tasks, node.Id);
                    task.TaskIndex = (int)node.Index;
                    if (task != null)
                    {
                        if (task.IsEnabled && success)
                        {
                            task.TaskIndex = (long)node.Index;
                            RunTaskLog(node.IfId != null ? (int)node.IfId : node.Id, (long)node.Index, TaskType.Task, model);
                            var status = task.Run(model);

                            success &= status.Status == Status.Success;
                            warning |= status.Status == Status.Warning;
                            if (!atLeastOneSucceed && status.Status == Status.Success) atLeastOneSucceed = true;

                            var childNode = GetChileNode(nodes, node, model);

                            if (childNode != null)
                            {
                                var if1 = childNode as If;
                                if (if1 != null)
                                {
                                    var @if = if1;
                                    RunIf(tasks, nodes, @if, ref success, ref warning, ref atLeastOneSucceed, model);
                                }
                                else if (childNode is While)
                                {
                                    var @while = (While)childNode;
                                    RunWhile(tasks, nodes, @while, ref success, ref warning, ref atLeastOneSucceed, model);
                                }
                                else if (childNode is Switch)
                                {
                                    var @switch = (Switch)childNode;
                                    RunSwitch(tasks, nodes, @switch, ref success, ref warning, ref atLeastOneSucceed, model);
                                }
                                else
                                {
                                    var childTask = GetTask(tasks, childNode.Id);
                                    if (childTask != null)
                                    {
                                        if (childTask.IsEnabled && success)
                                        {
                                            RunTaskLog(childTask.Id, (long)childTask.TaskIndex, TaskType.Task, model);
                                            var childStatus = childTask.Run(model);

                                            success &= childStatus.Status == Status.Success;
                                            warning |= childStatus.Status == Status.Warning;
                                            if (!atLeastOneSucceed && status.Status == Status.Success) atLeastOneSucceed = true;

                                            // Recusive call
                                            var ccNode = nodes.FirstOrDefault(n => n.ParentId == childNode.Id);

                                            var node1 = ccNode as If;
                                            if (node1 != null)
                                            {
                                                var @if = node1;
                                                RunIf(tasks, nodes, @if, ref success, ref warning, ref atLeastOneSucceed, model);
                                            }
                                            else if (ccNode is While)
                                            {
                                                var @while = (While)ccNode;
                                                RunWhile(tasks, nodes, @while, ref success, ref warning, ref atLeastOneSucceed, model);
                                            }
                                            else if (ccNode is Switch)
                                            {
                                                var @switch = (Switch)ccNode;
                                                RunSwitch(tasks, nodes, @switch, ref success, ref warning, ref atLeastOneSucceed, model);
                                            }
                                            else
                                            {
                                                RunTasks(tasks, nodes, ccNode, ref success, ref warning, ref atLeastOneSucceed, model);
                                            }
                                        }
                                    }
                                    else
                                    {
                                        throw new Exception("Task " + childNode.Id + " not found.");
                                    }
                                }
                            }
                        }
                    }
                    else
                    {
                        throw new Exception("Task " + node.Id + " not found.");
                    }
                }
            }
        }

        void RunIf(List<Task> tasks, List<Node> nodes, If @if, ref bool success, ref bool warning, ref bool atLeastOneSucceed, RequestModel model = null)
        {
            var ifTask = GetTask(@if.IfId);
            ifTask.TaskIndex = (int)@if.Index;

            if (ifTask != null)
            {
                if (ifTask.IsEnabled && success)
                {
                    RunTaskLog(@if.IfId, (long)@if.Index, TaskType.If, model);
                    var status = ifTask.Run(model);

                    success &= status.Status == Status.Success;
                    warning |= status.Status == Status.Warning;

                    if (!atLeastOneSucceed && status.Status == Status.Success) atLeastOneSucceed = true;

                    if (status.Status == Status.Success && status.Condition)
                    {
                        if (@if.DoNodes.Count > 0)
                        {
                            // Build Tasks
                            var doIfTasks = NodesToTasks(@if.DoNodes);

                            // Run Tasks
                            var doIfStartNode = GetStartupNode(@if.DoNodes);

                            if (doIfStartNode.ParentId == StartId)
                            {
                                RunTasks(doIfTasks, @if.DoNodes, doIfStartNode, ref success, ref warning, ref atLeastOneSucceed, model);
                            }
                        }
                    }
                    else if (status.Status == Status.Success && status.Condition == false)
                    {
                        if (@if.ElseNodes.Count > 0)
                        {
                            // Build Tasks
                            var elseTasks = NodesToTasks(@if.ElseNodes);

                            // Run Tasks
                            var elseStartNode = GetStartupNode(@if.ElseNodes);

                            RunTasks(elseTasks, @if.ElseNodes, elseStartNode, ref success, ref warning, ref atLeastOneSucceed, model);
                        }
                    }

                    // Child node
                    var childNode = nodes.FirstOrDefault(n => n.ParentId == @if.Id);

                    if (childNode != null)
                    {
                        RunTasks(tasks, nodes, childNode, ref success, ref warning, ref atLeastOneSucceed, model);
                    }
                }
            }
            else
            {
                throw new Exception("Task " + @if.Id + " not found.");
            }
        }

        void RunWhile(List<Task> tasks, List<Node> nodes, While @while, ref bool success, ref bool warning, ref bool atLeastOneSucceed, RequestModel model = null)
        {

            var whileTask = GetTask(@while.WhileId);
            whileTask.TaskIndex = (int)@while.Index;
            if (whileTask != null)
            {
                if (whileTask.IsEnabled && success)
                {
                    RunTaskLog(@while.WhileId, (long)@while.Index, TaskType.If, model);
                    while (true)
                    {
                        var status = whileTask.Run(model);

                        success &= status.Status == Status.Success;
                        warning |= status.Status == Status.Warning;
                        if (!atLeastOneSucceed && status.Status == Status.Success) atLeastOneSucceed = true;

                        if (status.Status == Status.Success && status.Condition)
                        {
                            if (@while.Nodes.Count > 0)
                            {
                                // Build Tasks
                                var doWhileTasks = NodesToTasks(@while.Nodes);

                                // Run Tasks
                                var doWhileStartNode = GetStartupNode(@while.Nodes);

                                RunTasks(doWhileTasks, @while.Nodes, doWhileStartNode, ref success, ref warning, ref atLeastOneSucceed, model);
                            }
                        }
                        else if (status.Condition == false)
                        {
                            break;
                        }
                    }

                    // Child node
                    var childNode = nodes.FirstOrDefault(n => n.ParentId == @while.Id);

                    if (childNode != null)
                    {
                        RunTasks(tasks, nodes, childNode, ref success, ref warning, ref atLeastOneSucceed, model);
                    }
                }
            }
            else
            {
                throw new Exception("Task " + @while.Id + " not found.");
            }
        }

        void RunSwitch(List<Task> tasks, List<Node> nodes, Switch @switch, ref bool success, ref bool warning, ref bool atLeastOneSucceed, RequestModel model = null)
        {
            var switchTask = GetTask(@switch.SwitchId);
            switchTask.TaskIndex = (int)@switch.Index;
            if (switchTask != null)
            {
                if (switchTask.IsEnabled && success)
                {
                    RunTaskLog(@switch.SwitchId, (long)@switch.Index, TaskType.If, model);
                    var status = switchTask.Run(model);

                    success &= status.Status == Status.Success;
                    warning |= status.Status == Status.Warning;
                    if (!atLeastOneSucceed && status.Status == Status.Success) atLeastOneSucceed = true;

                    if (status.Status == Status.Success)
                    {
                        bool aCaseHasBeenExecuted = false;
                        foreach (var @case in @switch.Cases)
                        {
                            if (@case.Value == status.SwitchValue)
                            {
                                if (@case.Nodes.Count > 0)
                                {
                                    // Build Tasks
                                    var switchTasks = NodesToTasks(@case.Nodes);

                                    // Run Tasks
                                    var switchStartNode = GetStartupNode(@case.Nodes);

                                    RunTasks(switchTasks, @case.Nodes, switchStartNode, ref success, ref warning, ref atLeastOneSucceed, model);
                                }
                                aCaseHasBeenExecuted = true;
                                break;
                            }
                        }

                        if (!aCaseHasBeenExecuted && @switch.Default != null && @switch.Default.Any())
                        {
                            // Build Tasks
                            var defalutTasks = NodesToTasks(@switch.Default);

                            // Run Tasks
                            var defaultStartNode = GetStartupNode(@switch.Default);

                            RunTasks(defalutTasks, @switch.Default, defaultStartNode, ref success, ref warning, ref atLeastOneSucceed, model);
                        }

                        // Child node
                        var childNode = nodes.FirstOrDefault(n => n.ParentId == @switch.Id);

                        if (childNode != null)
                        {
                            RunTasks(tasks, nodes, childNode, ref success, ref warning, ref atLeastOneSucceed);
                        }
                    }
                }
            }
        }

        /// <summary>
        /// Stops this workflow.
        /// </summary>
        public void Stop(Workflow wf = null, RequestModel model = null)
        {
            if (IsRunning)
            {
                try
                {
                    //new WorkflowLogProxy().AddLog(new Service.Contracts.WorkflowLogModel
                    //{
                    //    WorkflowId = model.Id,
                    //    Action = WorkflowStatus.Stop,
                    //    RequestId = model.TaskModel != null ? JsonConvert.DeserializeObject<InnerRequestModel>(model.TaskModel).RequestID : 0,
                    //    UniqKey = model.UniqKey,
                    //    UserId = model.UserId,
                    //    WorkflowVersion = model.Version,
                    //    TaskDataModel = model.TaskModel,
                    //});
                    Abort(model);
                }
                catch (Exception e)
                {
                    Logger.ErrorFormat("An error occured while stopping the workflow : {0}", e, this);
                }
            }
        }
        /// <summary>
        /// Resumes this workflow.
        /// </summary>
        public void Resume()
        {
            if (IsPaused)
            {
                try
                {
#pragma warning disable 618
                    //_thread.Resume();
#pragma warning restore 618
                }
                catch (Exception e)
                {
                    Logger.ErrorFormat("An error occured while resuming the workflow : {0}", e, this);
                }
                finally
                {
                    IsPaused = false;
                }
            }
        }

        void CreateTempFolder()
        {
            //// WorkflowId/dd-MM-yyyy/HH-mm-ss-fff
            //var wfTempFolder = Path.Combine(workflowTempFolder, Id.ToString(CultureInfo.CurrentCulture));
            //if (!Directory.Exists(wfTempFolder)) Directory.CreateDirectory(wfTempFolder);

            //var wfDayTempFolder = Path.Combine(wfTempFolder, string.Format("{0:yyyy-MM-dd}", DateTime.Now));
            //if (!Directory.Exists(wfDayTempFolder)) Directory.CreateDirectory(wfDayTempFolder);

            //var wfJobTempFolder = Path.Combine(wfDayTempFolder, string.Format("{0:HH-mm-ss-fff}", DateTime.Now));
            //if (!Directory.Exists(wfJobTempFolder)) Directory.CreateDirectory(wfJobTempFolder);

            //WorkflowTempFolder = wfJobTempFolder;
        }

        Node GetStartupNode(IEnumerable<Node> nodes, int? index = null)
        {

            if (index == null)
            {
                return nodes.First(n => n.ParentId == StartId);
            }
            else
            {
                return GetNodeByIndex(index);
            }

        }

        Node GetNodeByIndex(int? index)
        {
            foreach (var item in XWorkflowDocument.Root.Descendants().ToList())
            {
                if (item.Attribute("index") != null)
                    if (int.Parse(item.Attribute("index").Value) == index)
                    {
                        return XNodeToNode(item);
                    }
            }
            return new Node();
        }

        Node GetParentNodeByChildId(int? id)
        {
            // var xExecutionGraph = xdoc.Root.Element(XNamespaceWf + "ExecutionGraph");

            foreach (var item in XWorkflowDocument.Root.Element(XNamespaceWf + "ExecutionGraph").Descendants().ToList())
            {
                if (item.Attribute("parent") != null)
                {
                    if (int.Parse(item.Attribute("parent").Value) == id)
                    {
                        return XNodeToNode(item);
                    }
                }
                else
                {
                    if (item.Element(XNamespaceWf + "Parent") != null)
                        if (int.Parse(item.Element(XNamespaceWf + "Parent").Attribute("id").Value) == id)
                        {
                            return XNodeToNode(item);
                        }
                }
            }
            return null;
        }

        Task GetTask(int id)
        {
            return Tasks.FirstOrDefault(t => t.Id == id);
        }

        Task GetTask(IEnumerable<Task> tasks, int id)
        {
            return tasks.FirstOrDefault(t => t.Id == id);
        }
    }
}
