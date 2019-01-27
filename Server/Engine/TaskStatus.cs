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

        //void AddEndTaskLog(Task task, RequestModel model, Status status, TaskType taskType, string serviceResponse, bool? taskResult = null)
        //{
        //    new WorkflowLogProxy().AddLog(new Service.Contracts.WorkflowLogModel
        //    {
        //        TaskId = task.Id,
        //        TaskIndex = task.TaskIndex,
        //        TaskStatus = (Service.Contracts.Enum.TaskStatus)Enum.Parse(typeof(Service.Contracts.Enum.TaskStatus), status.ToString()),
        //        RequestId = model.TaskModel != null ? JsonConvert.DeserializeObject<InnerRequestModel>(model.TaskModel).RequestID : 0,
        //        WorkflowId = model.Id,
        //        UniqKey = model.UniqKey,
        //        Action = status == Status.Error ? WorkflowStatus.Stop : WorkflowStatus.Finish,
        //        TaskType = taskType,
        //        WorkflowVersion = model.Version,
        //        TaskResult = taskResult,
        //        TaskDataModel = model.TaskModel,
        //        WorkflowName = model.WorkflowName,
        //        TaskName = task.Name,
        //        RequestNumber = JsonConvert.DeserializeObject<InnerRequestModel>(model.TaskModel).RequestNumber,
        //        ServiceResponseBody = serviceResponse
        //    });
        //    model.IsStoped = status == Status.Error ? true : false;
        //}
        public TaskStatus(Status status, Task task, RequestModel model, string serviceResponse)
        {
            // AddEndTaskLog(task, model, status, TaskType.Task, serviceResponse);
            Status = status;
        }

        /// <summary>
        /// Creates a new TaskStatus. This constructor is designed for If/While flowchart tasks.
        /// </summary>
        /// <param name="status">Status.</param>
        /// <param name="condition">Condition value.</param>
        public TaskStatus(Status status, bool condition, Task task, RequestModel model, string serviceResponse) //: this(status, task, model)
        {
            // AddEndTaskLog(task, model, Status, TaskType.If, serviceResponse, condition);
            Condition = condition;
        }

        /// <summary>
        /// Creates a new TaskStatus. This constructor is designed for Switch flowchart tasks.
        /// </summary>
        /// <param name="status">Status.</param>
        /// <param name="switchValue">Switch value.</param>
        public TaskStatus(Status status, string switchValue, Task task, RequestModel model, string serviceResponse) //: this(status, task, model)
        {
            // AddEndTaskLog(task, model, Status, TaskType.SwitchCase, serviceResponse);
            SwitchValue = switchValue;
        }

        /// <summary>
        /// Creates a new TaskStatus. This constructor is designed for If/While and Switch flowchart tasks.
        /// </summary>
        /// <param name="status">Status.</param>
        /// <param name="condition">Condition value.</param>
        /// <param name="switchValue">Switch value.</param>
        public TaskStatus(Status status, bool condition, string switchValue, Task task, RequestModel model, string serviceResponse)
        {
            // AddEndTaskLog(task, model, Status, TaskType.While, serviceResponse);
            Condition = condition;
            SwitchValue = switchValue;
        }
    }
}