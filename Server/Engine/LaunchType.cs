﻿namespace workflow.Core
{
    /// <summary>
    /// Launch type.
    /// </summary>
    public enum LaunchType
    {
        /// <summary>
        /// The workflow starts when workflow engine starts.
        /// </summary>
        Startup,
        /// <summary>
        /// The workflow must be triggered manually to start.
        /// </summary>
        Trigger,
        /// <summary>
        /// The workflow starts periodically.
        /// </summary>
        Periodic
    }
}