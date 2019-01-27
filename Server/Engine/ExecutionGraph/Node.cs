using System.Collections.Generic;

namespace workflow.Core.ExecutionGraph
{
    /// <summary>
    /// Node.
    /// </summary>
    public class Node
    {
        /// <summary>
        /// Node Id.
        /// </summary>
        public int Id { get; set; }

        public List<Node> DoNodes { get; private set; }
        public List<Node> ElseNodes { get; private set; }

        /// <summary>
        /// Task id which is conditon
        /// </summary>
        public int? IfId { get; private set; }
        /// <summary>
        /// Node parent Id.
        /// </summary>
        public int ParentId { get; private set; }

        public int? Index { get; private set; }
        /// <summary>
        /// Creates a new node.
        /// </summary>
        /// <param name="id">Node id.</param>
        /// <param name="parentId">Node parent id.</param>
        public Node(int id, int parentId, int? ifId = null, List<Node> doNodes = null, List<Node> elseNodes = null, int? index = null)
        {
            Id = id;
            ParentId = parentId;
            IfId = ifId;
            DoNodes = doNodes;
            ElseNodes = elseNodes;
            Index = index;
        }

        public Node()
        {

        }
    }
}
