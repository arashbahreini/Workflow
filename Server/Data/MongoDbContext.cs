using Data.Entities;
using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
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

        public async Task<T> GetOneByUniqKey<T>(string uniqKey)
        {
            var filter = Builders<T>.Filter.Eq("UniqKey", uniqKey);
            var collection = _db.GetCollection<T>(typeof(T).Name);
            var result = await collection.Find(filter).FirstOrDefaultAsync();
            return result;
        }

        public async Task<List<T>> GetManyByIdAndVersion<T>(int id, long version)
        {
            var filter = Builders<T>.Filter.Eq("WorkflowId", id);
            filter = filter & Builders<T>.Filter.Eq("WorkflowVersion", version);
            var collection = _db.GetCollection<T>(typeof(T).Name);
            var result = await collection.Find(filter).ToListAsync();
            return result;
        }

        public async Task UpdateOne<T, TUpdate>(string uniqKey, string fieldName, TUpdate updateValue)
        {
            var filter = Builders<T>.Filter.Eq("UniqKey", uniqKey);
            var update = Builders<T>.Update.Set(fieldName , updateValue);

            var collection = _db.GetCollection<T>(typeof(T).Name);
            var result = await collection.UpdateOneAsync(filter, update);
        }
    }
}
