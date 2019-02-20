using Contract;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Reflection.Metadata;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Dynamic;

namespace ServiceLogic.cs
{
    public class CallServiceLogic
    {
        // static HttpClient client = new HttpClient();
        public async Task<string> CallAsync(RestService url, string stringParameters)
        {
            HttpClient client = new HttpClient();
            var parameters = JsonConvert.DeserializeObject<List<ParameterModel>>(stringParameters);
            string serviceInput = "{";
            foreach (var param in parameters)
            {
                serviceInput += "''" + param.Name + "'':''" + param.Value + "'',";
            }

            serviceInput += "}";

            client.BaseAddress = new Uri(url.value.url);
            var response = await client.PostAsJsonAsync("api/Common/Insert", serviceInput);
            // TOKNOW. CORS PROBLEM.
            return "";
        }
    }
}
