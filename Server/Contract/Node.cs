﻿namespace workflow.Core.Service.Contracts
{

    public class Node
    {
        
        public string Id { get; private set; }
        
        public string Name { get; private set; }
        
        public string ParentId { get; private set; }

        public Node(string id, string name, string parentId)
        {
            Id = id;
            Name = name;
            ParentId = parentId;
        }
    }
}
