using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Serialization.Json;
using System.Text;
using System.Threading.Tasks;




namespace APIYoutube
{
    class Program
    {
        [STAThread]
        static void Main(string[] args)
        {
            Console.WriteLine("YouTube Data API");
            Console.WriteLine("================");

            try
            {
                Console.WriteLine(YoutubeApi.callSearch("eminem", 20));
                
                //new YoutubeApi().CreateNewPlaylist("test", "testDescript", "public").Wait();
                //new YoutubeApi().GetAllPlaylist().Wait();
                //new YoutubeApi().GetPlaylistByName("test1").Wait();
            }
            catch (AggregateException ex)
            {
                foreach (var e in ex.InnerExceptions)
                {
                    Console.WriteLine("Error: " + e.Message);
                }
            }

           

            Console.WriteLine("Press any key to continue...");
            Console.ReadKey();
        }
    }
}
