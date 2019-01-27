﻿using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Xml;
using System.Xml.Linq;
using workflow.Core.Service.Contracts;
using Workflow.Core.Service.Contracts;

namespace GraphCompatibility
{
    public class GraphCompatibility
    {
        public static List<TaskNameModel> _taskNames;
        public static List<TaskInfo> _tasks;
        public XNamespace xn = "urn:workflow-schema";
        public int ifId = 1000;
        //public int whileId = 5000;
        public int switchId = 8000;
        public static XElement xGraph;
        public string _WorkflowPath;
        public string _WorkflowName;
        //public List<WhileModel> _whileGroups;
        public GraphModel _model;
        public GraphCompatibility(
            List<TaskNameModel> taskNames,
            List<TaskInfo> tasks,
            string workflowPath,
            string workflowName)
        {
            _taskNames = taskNames;
            _tasks = tasks;
            xGraph = new XElement(xn + "ExecutionGraph");
            _WorkflowPath = workflowPath;
            _WorkflowName = workflowName;
        }
        public XElement DesignExecutionGraph(GraphModel model)
        {
            // TO MAKE A COPY OF MODEL
            _model = JsonConvert.DeserializeObject<GraphModel>(JsonConvert.SerializeObject(model));

            // TO DESIGN ROOT
            DesignRoot(model.nodeDataArray.Where(x => x.isRoot == true).FirstOrDefault());

            if (model.linkDataArray != null)
            {
                model.linkDataArray = model.linkDataArray.OrderBy(x => x.to).ToList();
                foreach (var item in model.linkDataArray)
                {
                    if (item.from != 0 && item.to != 0)
                    {
                        var fromNode = model.nodeDataArray.Where(x => x.key == item.from).FirstOrDefault();
                        var toNode = model.nodeDataArray.Where(x => x.key == item.to).FirstOrDefault();
                        if (toNode.isIf) XmlIfGenerator(toNode, fromNode);
                        // else if (toNode.isWhile) XmlWhileGenerator(toNode, fromNode);
                        else if (toNode.isSwitch) XmlSwitchGenerator(toNode, fromNode);
                        else XmlTaskGenerator(toNode, fromNode);
                    }
                }
            }
            return xGraph;
        }
        public void DesignRoot(NodeDataArray root)
        {
            //if (root.isWhile)
            //{
            //    XmlWhileGenerator(root, null);
            //}
            if (root.isSwitch)
            {
                XmlSwitchGenerator(root, null);
            }
            else if (root.isIf)
            {
                XmlIfGenerator(root, null);
            }
            else
            {
                XmlTaskGenerator(root, null);
            }
        }
        public void XmlSwitchGenerator(NodeDataArray node = null, NodeDataArray parent = null)
        {
            if (parent == null) parent = new NodeDataArray();
            if (parent.isIf)
            {
                if (parent.doNodeId == node.key)
                {
                    var xRoot = new XElement(xn + "Switch",
                        new XAttribute("id", switchId++),
                        new XAttribute("parent", "-1"),
                        new XAttribute("switch", node.taskId),
                        new XAttribute("index", node.key));
                    xGraph.Descendants()
                         .Where(x => (string)x.Attribute("index") == parent.key.ToString())
                         .FirstOrDefault()
                         .Element(xn + "Do")
                         .Add(xRoot);
                }
                else if (parent.elseNodeId == node.key)
                {
                    var xRoot = new XElement(xn + "Switch",
                        new XAttribute("id", switchId++),
                        new XAttribute("parent", "-1"),
                        new XAttribute("switch", node.taskId),
                        new XAttribute("index", node.key));
                    xGraph.Descendants()
                         .Where(x => (string)x.Attribute("index") == parent.key.ToString())
                         .FirstOrDefault()
                         .Element(xn + "Else")
                         .Add(xRoot);
                }
                else
                {
                    var xRoot = new XElement(xn + "Switch",
                        new XAttribute("id", switchId++),
                        new XAttribute("parent", ifId - 1),
                        new XAttribute("switch", node.taskId),
                        new XAttribute("index", node.key));
                    xGraph.Descendants()
                         .Where(x => (string)x.Attribute("index") == parent.key.ToString())
                         .FirstOrDefault()
                         .AddAfterSelf(xRoot);
                }
            }
            //else if (parent.isWhile && node.isInWhile)
            //{
            //    var xRoot = new XElement(xn + "Switch",
            //        new XAttribute("id", switchId++),
            //        new XAttribute("parent", "-1"),
            //        new XAttribute("switch", node.taskId),
            //        new XAttribute("index", node.key));

            //    xGraph.Descendants()
            //     .Where(x => (string)x.Attribute("index") == parent.key.ToString())
            //     .FirstOrDefault()
            //     .Add(xRoot);
            //}
            //else if (parent.isWhile && !node.isInWhile)
            //{
            //    var xRoot = new XElement(xn + "Switch",
            //        new XAttribute("id", switchId++),
            //        new XAttribute("parent", whileId - 1),
            //        new XAttribute("switch", node.taskId),
            //        new XAttribute("index", node.key));

            //    xGraph.Descendants()
            //     .Where(x => (string)x.Attribute("index") == parent.key.ToString())
            //     .FirstOrDefault()
            //     .Add(xRoot);
            //}
            else
            {
                if (parent.key != 0)
                {
                    var xRoot = new XElement(xn + "Switch",
                        new XAttribute("id", switchId++),
                        new XAttribute("parent", parent.taskId.ToString()),
                        new XAttribute("switch", node.taskId),
                        new XAttribute("index", node.key));
                    xGraph.Descendants()
                         .Where(x => (string)x.Attribute("index") == parent.key.ToString())
                         .FirstOrDefault()
                         .AddAfterSelf(xRoot);
                }
                else
                {
                    var xRoot = new XElement(xn + "Switch",
                        new XAttribute("id", switchId++),
                        new XAttribute("parent", "-1"),
                        new XAttribute("switch", node.taskId),
                        new XAttribute("index", node.key));
                    xGraph.Add(xRoot);
                }
            }
        }
        //public void XmlWhileGenerator(NodeDataArray node = null, NodeDataArray parent = null)
        //{
        //    if (parent == null) parent = new NodeDataArray();
        //    if (parent.isIf)
        //    {
        //        if (parent.doNodeId == node.key)
        //        {
        //            var xRoot = new XElement(xn + "While",
        //                new XAttribute("id", whileId++),
        //                new XAttribute("parent", "-1"),
        //                new XAttribute("while", node.taskId),
        //                new XAttribute("index", node.key));
        //            xGraph.Descendants()
        //                 .Where(x => (string)x.Attribute("index") == parent.key.ToString())
        //                 .FirstOrDefault()
        //                 .Element(xn + "Do")
        //                 .Add(xRoot);
        //        }
        //        if (parent.elseNodeId == node.key)
        //        {
        //            var xRoot = new XElement(xn + "While",
        //                new XAttribute("id", whileId++),
        //                new XAttribute("parent", "-1"),
        //                new XAttribute("while", node.taskId),
        //                new XAttribute("index", node.key));
        //            xGraph.Descendants()
        //                 .Where(x => (string)x.Attribute("index") == parent.key.ToString())
        //                 .FirstOrDefault()
        //                 .Element(xn + "Else")
        //                 .Add(xRoot);
        //        }
        //    }
        //    else if (parent.isWhile)
        //    {

        //    }
        //    else
        //    {
        //        if (parent.key != 0)
        //        {
        //            var xRoot = new XElement(xn + "While",
        //                new XAttribute("id", whileId++),
        //                new XAttribute("parent", parent.key == 0 ? "-1" : parent.taskId.ToString()),
        //                new XAttribute("while", node.taskId),
        //                new XAttribute("index", node.key));
        //            xGraph.Descendants()
        //             .Where(x => (string)x.Attribute("index") == parent.key.ToString())
        //             .FirstOrDefault()
        //             .AddAfterSelf(xRoot);
        //        }
        //        else
        //        {
        //            var xRoot = new XElement(xn + "While",
        //                new XAttribute("id", whileId++),
        //                new XAttribute("parent", parent.key == 0 ? "-1" : parent.taskId.ToString()),
        //                new XAttribute("while", node.taskId),
        //                new XAttribute("index", node.key));
        //            xGraph.Add(xRoot);
        //        }
        //    }
        //}
        public void XmlTaskGenerator(NodeDataArray node = null, NodeDataArray parent = null)
        {
            if (parent == null) parent = new NodeDataArray();
            if (parent.isIf)
            {
                if (parent.doNodeId == node.key)
                {
                    var xRoot = new XElement(xn + "Task",
                        new XAttribute("id", node.taskId),
                        new XAttribute("index", node.key));
                    var xParent = new XElement(xn + "Parent",
                        new XAttribute("id", "-1"));
                    xRoot.Add(xParent);

                    xGraph.Descendants()
                     .Where(x => (string)x.Attribute("index") == parent.key.ToString())
                     .FirstOrDefault()
                     .Element(xn + "Do")
                     .Add(xRoot);
                }
                else if (parent.elseNodeId == node.key)
                {
                    var xRoot = new XElement(xn + "Task",
                        new XAttribute("id", node.taskId),
                        new XAttribute("index", node.key));
                    var xParent = new XElement(xn + "Parent",
                        new XAttribute("id", "-1"));
                    xRoot.Add(xParent);

                    xGraph.Descendants()
                     .Where(x => (string)x.Attribute("index") == parent.key.ToString())
                     .FirstOrDefault()
                     .Element(xn + "Else")
                     .Add(xRoot);
                }
                else
                {
                    var xRoot = new XElement(xn + "Task",
                        new XAttribute("id", node.taskId),
                        new XAttribute("index", node.key));
                    var xParent = new XElement(xn + "Parent",
                        new XAttribute("id", ifId - 1));
                    xRoot.Add(xParent);

                    xGraph.Descendants()
                     .Where(x => (string)x.Attribute("index") == parent.key.ToString())
                     .FirstOrDefault()
                     .AddAfterSelf(xRoot);
                }
            }
            else if (parent.isSwitch && node.isInSwitch)
            {
                if (node.isDefault == true)
                {
                    var xDefault = new XElement(xn + "Default");
                    var xRoot = new XElement(xn + "Task",
                        new XAttribute("id", node.taskId),
                        new XAttribute("index", node.key));
                    var xParent = new XElement(xn + "Parent",
                        new XAttribute("id", "-1"));
                    xRoot.Add(xParent);
                    xDefault.Add(xRoot);
                    xGraph.Descendants()
                     .Where(x => (string)x.Attribute("index") == parent.key.ToString())
                     .FirstOrDefault()
                     .Add(xDefault);
                }
                else
                {
                    var xCase = new XElement(xn + "Case",
                        new XAttribute("value", node.caseValue));
                    var xRoot = new XElement(xn + "Task",
                        new XAttribute("id", node.taskId),
                        new XAttribute("index", node.key));
                    var xParent = new XElement(xn + "Parent",
                        new XAttribute("id", "-1"));
                    xRoot.Add(xParent);
                    xCase.Add(xRoot);
                    xGraph.Descendants()
                     .Where(x => (string)x.Attribute("index") == parent.key.ToString())
                     .FirstOrDefault()
                     .AddFirst(xCase);
                }
            }
            else if (parent.isSwitch && !node.isInSwitch)
            {
                var xRoot = new XElement(xn + "Task",
                    new XAttribute("id", node.taskId),
                    new XAttribute("index", node.key));
                var xParent = new XElement(xn + "Parent",
                    new XAttribute("id", switchId - 1));
                xRoot.Add(xParent);
                xGraph.Descendants()
                 .Where(x => (string)x.Attribute("index") == parent.key.ToString())
                 .FirstOrDefault()
                 .AddAfterSelf(xRoot);
            }
            //else if (parent.isWhile && !node.isInWhile)
            //{
            //    var xRoot = new XElement(xn + "Task",
            //        new XAttribute("id", node.taskId),
            //        new XAttribute("index", node.key));
            //    var xParent = new XElement(xn + "Parent",

            //        new XAttribute("id", whileId - 1));
            //            xRoot.Add(xParent);
            //            xGraph.Descendants()
            //             .Where(x => (string)x.Attribute("index") == parent.key.ToString())
            //             .FirstOrDefault()
            //             .AddAfterSelf(xRoot);
            //}
            //else if (parent.isWhile && node.isInWhile)
            //{
            //    var xRoot = new XElement(xn + "Task",
            //        new XAttribute("id", node.taskId),
            //        new XAttribute("index", node.key));
            //    var xParent = new XElement(xn + "Parent", new XAttribute("id", "-1"));
            //    xRoot.Add(xParent);
            //    xGraph.Descendants()
            //     .Where(x => (string)x.Attribute("index") == parent.key.ToString())
            //     .FirstOrDefault()
            //     .Add(xRoot);
            //}
            else
            {
                if (parent.key != 0)
                {
                    var xRoot = new XElement(xn + "Task",
                        new XAttribute("id", node.taskId),
                        new XAttribute("index", node.key));
                    var xParent = new XElement(xn + "Parent",
                        new XAttribute("id", parent.key == 0 ? "-1" : parent.taskId.ToString()));
                    xRoot.Add(xParent);

                    xGraph.Descendants()
                         .Where(x => (string)x.Attribute("index") == parent.key.ToString())
                         .FirstOrDefault()
                         .AddAfterSelf(xRoot);
                }
                else
                {
                    var xRoot = new XElement(xn + "Task",
                        new XAttribute("id", node.taskId),
                        new XAttribute("index", node.key));
                    var xParent = new XElement(xn + "Parent",
                        new XAttribute("id", parent.key == 0 ? "-1" : parent.taskId.ToString()));
                    xRoot.Add(xParent);
                    xGraph.Add(xRoot);
                }
            }
        }
        public void XmlIfGenerator(NodeDataArray node = null, NodeDataArray parent = null)
        {
            if (parent == null) parent = new NodeDataArray();
            if (parent.isIf)
            {
                if (parent.doNodeId == node.key)
                {
                    var xRoot = new XElement(xn + "If",
                        new XAttribute("id", ifId++),
                        // new XAttribute("parent", parent.key == 0 ? "-1" : parent.taskId.ToString()),
                        new XAttribute("parent", "-1"),
                        new XAttribute("if", node.taskId),
                        new XAttribute("index", node.key));
                    var xDo = new XElement(xn + "Do");
                    var xElse = new XElement(xn + "Else");
                    xRoot.Add(xDo);
                    xRoot.Add(xElse);
                    xGraph.Descendants()
                         .Where(x => (string)x.Attribute("index") == parent.key.ToString())
                         .FirstOrDefault()
                         .Element(xn + "Do")
                         .Add(xRoot);
                }
                else if (parent.elseNodeId == node.key)
                {
                    var xRoot = new XElement(xn + "If",
                        new XAttribute("id", ifId++),
                        // new XAttribute("parent", parent.key == 0 ? "-1" : parent.taskId.ToString()),
                        new XAttribute("parent", "-1"),
                        new XAttribute("if", node.taskId),
                        new XAttribute("index", node.key));
                    var xDo = new XElement(xn + "Do");
                    var xElse = new XElement(xn + "Else");
                    xRoot.Add(xDo);
                    xRoot.Add(xElse);
                    xGraph.Descendants()
                         .Where(x => (string)x.Attribute("index") == parent.key.ToString())
                         .FirstOrDefault()
                         .Element(xn + "Else")
                         .Add(xRoot);
                }
                else
                {
                    var xRoot = new XElement(xn + "If",
                        new XAttribute("id", ifId++),
                        new XAttribute("parent", ifId - 1),
                        new XAttribute("if", node.taskId),
                        new XAttribute("index", node.key));
                    var xDo = new XElement(xn + "Do");
                    var xElse = new XElement(xn + "Else");
                    xRoot.Add(xDo);
                    xRoot.Add(xElse);

                    xGraph.Descendants()
                     .Where(x => (string)x.Attribute("index") == parent.key.ToString())
                     .FirstOrDefault()
                     .AddAfterSelf(xRoot);
                }
            }
            //else if (parent.isWhile && node.isInWhile)
            //{
            //    var xRoot = new XElement(xn + "If",
            //        new XAttribute("id", ifId++),
            //        new XAttribute("parent", "-1"),
            //        new XAttribute("if", node.taskId),
            //        new XAttribute("index", node.key));

            //    var xDo = new XElement(xn + "Do");
            //    var xElse = new XElement(xn + "Else");
            //    xRoot.Add(xDo);
            //    xRoot.Add(xElse);

            //    xGraph.Descendants()
            //     .Where(x => (string)x.Attribute("index") == parent.key.ToString())
            //     .FirstOrDefault()
            //     .Add(xRoot);
            //}
            //else if (parent.isWhile && !node.isInWhile)
            //{
            //    var xRoot = new XElement(xn + "If",
            //        new XAttribute("id", ifId++),
            //        new XAttribute("parent", whileId - 1),
            //        new XAttribute("if", node.taskId),
            //        new XAttribute("index", node.key));

            //    var xDo = new XElement(xn + "Do");
            //    var xElse = new XElement(xn + "Else");
            //    xRoot.Add(xDo);
            //    xRoot.Add(xElse);

            //    xGraph.Descendants()
            //     .Where(x => (string)x.Attribute("index") == parent.key.ToString())
            //     .FirstOrDefault()
            //     .AddAfterSelf(xRoot);
            //}
            else if (parent.isSwitch && node.isInSwitch)
            {
                var xCase = new XElement(xn + "Case",
                    new XAttribute("value", node.caseValue));
                var xRoot = new XElement(xn + "If",
                    new XAttribute("id", ifId++),
                    new XAttribute("parent", "-1"),
                    new XAttribute("if", node.taskId),
                    new XAttribute("index", node.key));

                var xDo = new XElement(xn + "Do");
                var xElse = new XElement(xn + "Else");
                xRoot.Add(xDo);
                xRoot.Add(xElse);
                xCase.Add(xRoot);
                xGraph.Descendants()
                 .Where(x => (string)x.Attribute("index") == parent.key.ToString())
                 .FirstOrDefault()
                 .Add(xCase);
            }
            else
            {
                if (parent.key != 0)
                {
                    var xRoot = new XElement(xn + "If",
                        new XAttribute("id", ifId++),
                        new XAttribute("parent", parent.key == 0 ? "-1" : parent.taskId.ToString()),
                        new XAttribute("if", node.taskId),
                        new XAttribute("index", node.key));

                    var xDo = new XElement(xn + "Do");
                    var xElse = new XElement(xn + "Else");
                    xRoot.Add(xDo);
                    xRoot.Add(xElse);
                    xGraph.Descendants()
                     .Where(x => (string)x.Attribute("index") == parent.key.ToString())
                     .FirstOrDefault()
                     .AddAfterSelf(xRoot);
                }
                else
                {
                    var xRoot = new XElement(xn + "If",
                        new XAttribute("id", ifId++),
                        new XAttribute("parent", parent.key == 0 ? "-1" : parent.taskId.ToString()),
                        new XAttribute("if", node.taskId),
                        new XAttribute("index", node.key));

                    var xDo = new XElement(xn + "Do");
                    var xElse = new XElement(xn + "Else");
                    xRoot.Add(xDo);
                    xRoot.Add(xElse);
                    xGraph.Add(xRoot);
                }
            }

        }
    }
}
