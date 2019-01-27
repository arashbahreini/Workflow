using System.Collections.Generic;
using System.Linq;

namespace workflow.Core.ExecutionGraph.Flowchart
{
    /// <summary>
    /// If flowchart node.
    /// </summary>
    public class If : Node
    {
        /// <summary>
        /// If Id.
        /// </summary>
        public int IfId { get; private set; }
        /// <summary>
        /// Do Nodes.
        /// </summary>
        public List<Node> DoNodes { get; private set; }
        /// <summary>
        /// Else nodes.
        /// </summary>
        public List<Node> ElseNodes { get; private set; }

        public int? Index { get; set; }

        /// <summary>
        /// Creates a new If flowchart node.
        /// </summary>
        /// <param name="id">Id.</param>
        /// <param name="parentId">Parent Id.</param>
        /// <param name="ifId">If Id.</param>
        /// <param name="doNodes">Do nodes.</param>
        /// <param name="elseNodes">Else nodes.</param>
        public If(int id, int parentId, int ifId, List<Node> doNodes, List<Node> elseNodes, int? index = null)
            :base(id, parentId, ifId, doNodes, elseNodes, index)
        {
            IfId = ifId;
            DoNodes = doNodes;
            ElseNodes = elseNodes;
            if (doNodes != null) DoNodes = doNodes.ToList();
            if (elseNodes != null) ElseNodes = elseNodes.ToList();
            Index = index;
        }
    }
}
