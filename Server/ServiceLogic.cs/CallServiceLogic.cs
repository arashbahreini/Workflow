using Contract;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Dynamic;

namespace ServiceLogic.cs
{
    public class CallServiceLogic
    {
        public async Task<bool> CallAsync(RestService url, string stringParameters)
        {
            HttpClient client = new HttpClient();
            var uri = url.url + "/" + (string.IsNullOrEmpty(url.prefix) ? "" : url.prefix) + "/" + url.controller + "/" + url.action;
            var parameterObject = new ServiceParameterCreator().Create(stringParameters);
            var response = await client.PostAsJsonAsync(uri, parameterObject);
            var content = response.Content.ReadAsAsync<Boolean>().Result;
            return content;
        }
    }
}
