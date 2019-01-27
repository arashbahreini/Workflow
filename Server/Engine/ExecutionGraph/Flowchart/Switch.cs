using System.Collections.Generic;
using System.Linq;

namespace workflow.Core.ExecutionGraph.Flowchart
{
    /// <summary>
    /// Switch flowchart node.
    /// </summary>
    public class Switch : Node
    {
        /// <summary>
        /// Switch id.
        /// </summary>
        public int SwitchId { get; private set; }
        /// <summary>
        /// Cases.
        /// </summary>
        public Case[] Cases { get; private set; }
        /// <summary>
        /// Default case.
        /// </summary>
        public List<Node> Default { get; private set; }

        public int? Index { get; set; }
        /// <summary>
        /// Creates a new Switch flowchart node.
        /// </summary>
        /// <param name="id">Id.</param>
        /// <param name="parentId">Parent Id.</param>
        /// <param name="switchId">Switch Id.</param>
        /// <param name="cases">Cases.</param>
        /// <param name="default">Default case.</param>
        public Switch(int id, int parentId, int switchId, IEnumerable<Case> cases, IEnumerable<Node> @default,int? index = null) : base(id, parentId, null,null,null,index)
        {
            SwitchId = switchId;
            if (cases != null) Cases = cases.ToArray();
            if (@default != null) Default = @default.ToList();
            Index = index;
        }
    }
}
