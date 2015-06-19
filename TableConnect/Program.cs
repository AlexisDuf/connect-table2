using System;
using Microsoft.AspNet.SignalR;
using Microsoft.Owin.Hosting;
using Owin;
using Microsoft.Owin.Cors;
using APIYoutube;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;
using System.Threading;
using AForge.Video;
using AForge.Video.DirectShow;
using Emgu.CV;
using Emgu.CV.Structure;
using Emgu.CV.Util;
using Emgu.CV.CvEnum;
using Emgu.Util;
using Emgu.CV.UI;

namespace TableConnect
{
    class Program
    {

        public static Webcam webcam=null;
        static void Main(string[] args)
        {
            string url = "http://localhost:8080";
            using (WebApp.Start(url))
            {
                Console.WriteLine("Server running on {0}", url);
                Program.webcam = new Webcam(new Size(480, 240), 30);
                Program.webcam.Start();
                Thread camThread = new Thread(new ThreadStart(Loop));
                camThread.Start();

                
                /*
                 *  Comments because methods use a complete path 
                 */

                /*VoiceRecognition vr = new VoiceRecognition();
                SignalRHub.setVoiceRecognition(vr);

                UsbDetection usbDet = new UsbDetection();
                usbDet.AddInsertUSBHandler();
                usbDet.AddRemoveUSBHandler();*/
                

                Console.ReadLine();
            }

            Console.WriteLine("Press any key to continue...");
            Console.ReadKey();
        }

        public static void Loop()
        {
            Program.webcam.startCapture();
        }
        
    }
    class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.UseCors(CorsOptions.AllowAll);
            app.MapSignalR();
        }
    }
    public class SignalRHub : Hub
    {
        private static SignalRHub instance = null;
        private static VoiceRecognition voiceRecognition;

        public SignalRHub()
        {

        }

        public static SignalRHub getInstance(){
            if (instance == null)
            {
                instance = new SignalRHub();
            }
            return instance;
        }

        /*****************************************/
        /* ******* NOTIFY CLIENTS METHODS ********/
        /* ***************************************/



        /*
         *  This method notify all clients that glasse was detect
         * */
        public void GlassStatusChanged(String color, int centerX, int centerY, Boolean onTheTable)
        {
            Clients.All.glasseStatutChanged(color,centerX, centerY, onTheTable);
        }

        /*
         * This method notify all clients that a light's statut changed
         * */
        public void LightStatutChanged(GlassEvent ev)
        {
            Clients.All.lightStatutChanged(ev);
        }

        /*
         * This methode notify all clients that an USB device was detect
         */
        public void UsbMemoryWasDetect(GlassEvent ev)
        {
            Clients.All.usbMemoryWasDetect(ev);
        }




        /*****************************************/
        /* ***** METHODS CALLED BY CLIENTS *******/
        /* ***************************************/

        /*
         * This method was called by client for add newUser
         */
        public void ActivateVoiceRecognition()
        {
            if(SignalRHub.voiceRecognition != null){
                SignalRHub.voiceRecognition.startRecognition();
            }
        }

        public void TurnOnDomoticElement(int id)
        {
            if (SignalRHub.voiceRecognition != null)
            {
                SignalRHub.voiceRecognition.switchOn(id);
            }
        }

        public void TurnOffDomoticElement(int id)
        {
            if (SignalRHub.voiceRecognition != null)
            {
                SignalRHub.voiceRecognition.switchOff(id);
            }
        }

        public void SearchYoutube(String search, int nbSearch, String userKey)
        {
            var result = YoutubeApi.callSearch(search, nbSearch);
            var context = GlobalHost.ConnectionManager.GetHubContext<SignalRHub>();
            context.Clients.All.returnYoutubeSearch(result, userKey);
        }


        /*
        ** Utils functions
         **/

        public static void setVoiceRecognition(VoiceRecognition vr)
        {
            SignalRHub.voiceRecognition = vr;
        }

    }
}