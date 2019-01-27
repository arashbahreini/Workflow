using System.Collections.Generic;
using System.Linq;

namespace workflow.Core.ExecutionGraph.Flowchart
{
    /// <summary>
    /// While flowchart node.
    /// </summary>
    public class While : Node
    {
        /// <summary>
        /// While Id.
        /// </summary>
        public int WhileId { get; private set; }
        /// <summary>
        /// Nodes.
        /// </summary>
        public List<Node> Nodes { get; private set; }
        public int? Index { get; set; }

        /// <summary>
        /// Creates a new While flowchart node.
        /// </summary>
        /// <param name="id">Id.</param>
        /// <param name="parentId">Parent Id.</param>
        /// <param name="whileId">While Id.</param>
        /// <param name="nodes">Nodes.</param>
        public While(int id, int parentId, int whileId, IEnumerable<Node> nodes, int? index = null) : base(id, parentId, null, null, null, index)
        {
            WhileId = whileId;
            if (nodes != null) Nodes = nodes.ToList();
            Index = index;
        }
    }
}
