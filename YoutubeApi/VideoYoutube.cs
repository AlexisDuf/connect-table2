using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace APIYoutube
{
    [DataContract]
    public class VideoYoutube : YoutubeObject
    {
        [DataMember]
        public string typeOfClass { get; set; }
        public VideoYoutube(string title, string id, string urlImage) : base(title, id, urlImage) {
            typeOfClass = this.GetType().ToString();
        }        
    }
}
