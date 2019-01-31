using Contract;
using Data.Entities;
using Log;
using Newtonsoft.Json;
using System;
using workflow.Contract;
using workflow.Core.Service.Contracts.Enum;

namespace workflow.Core
{
    /// <summary>
    /// Task status.
    /// </summary>
    public class TaskStatus
    {
        public DbConfig _dbConfig;
        /// <summary>
        /// Status.
        /// </summary>
        public Status Status { get; set; }
        /// <summary>
        /// If and While condition.
        /// </summary>
        public bool Condition { get; set; }
        /// <summary>
        /// Switch/Case value.
        /// </summary>
        public string SwitchValue { get; set; }

        /// <summary>
        /// Creates a new TaskStatus. This constructor is designed for sequential tasks.
        /// </summary>
        /// <param name="status">Status.</param>

        void AddEndTaskLog(Task task, RequestModel model, Status status, TaskType taskType, string serviceResponse, bool? taskResult = null)
        {
            new WorkflowLogger(_dbConfig).AddLog(new WorkflowLog
            {
                TaskId = task.Id,
                TaskIndex = task.TaskIndex,
                TaskStatus = (int)Enum.Parse(typeof(Service.Contracts.Enum.TaskStatus), status.ToString()),
                WorkflowId = model.Id,
                UniqKey = model.UniqKey,
                Action = status == Status.Error ? (int)WorkflowStatus.Stop : (int)WorkflowStatus.Finish,
                TaskType = (int)taskType,
                WorkflowVersion = model.Version,
                TaskResult = taskResult,
                Name = model.WorkflowName,
                TaskName = task.Name,
                ServiceResponse = serviceResponse,
            }).Wait();
            model.IsStoped = status == Status.Error ? true : false;
        }
        public TaskStatus(Status status, Task task, RequestModel model, string serviceResponse, DbConfig dbConfig)
        {
            _dbConfig = dbConfig;
            AddEndTaskLog(task, model, status, TaskType.Task, serviceResponse);
            Status = status;
        }

        /// <summary>
        /// Creates a new TaskStatus. This constructor is designed for If/While flowchart tasks.
        /// </summary>
        /// <param name="status">Status.</param>
        /// <param name="condition">Condition value.</param>
        public TaskStatus(Status status, bool condition, Task task, RequestModel model, string serviceResponse, DbConfig dbConfig) //: this(status, task, model)
        {
            _dbConfig = dbConfig;
            AddEndTaskLog(task, model, Status, TaskType.If, serviceResponse, condition);
            Condition = condition;
        }

        /// <summary>
        /// Creates a new TaskStatus. This constructor is designed for Switch flowchart tasks.
        /// </summary>
        /// <param name="status">Status.</param>
        /// <param name="switchValue">Switch value.</param>
        public TaskStatus(Status status, string switchValue, Task task, RequestModel model, string serviceResponse, DbConfig dbConfig) //: this(status, task, model)
        {
            _dbConfig = dbConfig;
            AddEndTaskLog(task, model, Status, TaskType.SwitchCase, serviceResponse);
            SwitchValue = switchValue;
        }

        /// <summary>
        /// Creates a new TaskStatus. This constructor is designed for If/While and Switch flowchart tasks.
        /// </summary>
        /// <param name="status">Status.</param>
        /// <param name="condition">Condition value.</param>
        /// <param name="switchValue">Switch value.</param>
        public TaskStatus(Status status, bool condition, string switchValue, Task task, RequestModel model, string serviceResponse, DbConfig dbConfig)
        {
            _dbConfig = dbConfig;
            AddEndTaskLog(task, model, Status, TaskType.While, serviceResponse);
            Condition = condition;
            SwitchValue = switchValue;
        }
    }
}