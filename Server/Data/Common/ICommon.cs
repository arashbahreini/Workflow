using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Text;

namespace Data.Common
{
    public interface ICommon
    {
        ObjectId Id { get; set; }
        DateTime CreationDate { get; set; }

    }
}
