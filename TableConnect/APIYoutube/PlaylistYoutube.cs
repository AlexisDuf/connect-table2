using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace APIYoutube
{
    [DataContract]
    public class PlaylistYoutube : YoutubeObject
    {
        [DataMember]
        public string typeOfClass { get; set; }
        public PlaylistYoutube(string title, string id, string url) : base(title, id, url) {
            typeOfClass = this.GetType().ToString();
        }
    }
}
