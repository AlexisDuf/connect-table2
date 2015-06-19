using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Runtime.Serialization.Json;
using System.Runtime.Serialization;

namespace APIYoutube
{
    [DataContract]
    public class ChannelYoutube : YoutubeObject
    {
        [DataMember]
        public string typeOfClass { get; set; }
        public ChannelYoutube(string title, string id, string url) : base(title, id, url) {
            typeOfClass = this.GetType().ToString();
        }
    }
}
