using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Threading.Tasks;

namespace Data
{
    public class MongoDbContext
    {
        public IMongoDatabase _db;
        public MongoDbContext(string Url, string databaseName)
        {
            var client = new MongoClient(Url);
            _db = client.GetDatabase(databaseName);
        }

        public async Task AddOne<T>(T model)
        {
            var col = _db.GetCollection<T>(typeof(T).Name);
            await col.InsertOneAsync(model); 
        }
    }
}
