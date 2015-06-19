using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace APIYoutube
{
    [DataContract]
    public abstract class YoutubeObject
    {
        [DataMember]
        public string Title { get; set; }
        [DataMember]
        public string Id { get; set; }
        [DataMember]
        public string UrlImage { get; set; }

        public YoutubeObject(string title, string id, string urlImage)
        {
            this.Title = title;
            this.Id = id;
            this.UrlImage = urlImage;
        }

        public override string ToString()
        {
            return string.Format("{0} : Title : {1} , Id : {2} , Url image : {3} ",
                                    this.GetType().ToString(),
                                    this.Title,
                                    this.Id,
                                    this.UrlImage);
        }
    }
}
