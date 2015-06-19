using System;
using System.IO;
using System.Drawing;
using System.Security;
using System.Threading;
using System.Diagnostics;
using System.Windows.Forms;
using System.Drawing.Imaging;
using AForge.Video;
using AForge.Video.DirectShow;
using AForge.Imaging;
using AForge.Imaging.Filters;
using Emgu.CV;
using Emgu.CV.Structure;
using Emgu.CV.Util;
using Emgu.Util;
using Emgu.CV.UI;
using AForge;
using AForge.Math;
using AForge.Math.Geometry;
using CvEnum = Emgu.CV.CvEnum;
using System.Collections.Generic;
using System.Data;
using System.Reflection;
using Microsoft.AspNet.SignalR;


namespace TableConnect
{
    class Webcam
    {
        private FilterInfoCollection videoDevices = null;       //list of all videosources connected to the pc
        private VideoCaptureDevice videoSource = null;          //the selected videosource
        private Size frameSize;
        private int frameRate;
        private Boolean keepOn = true;
        public Bitmap currentImage;                             //parameter accessible to outside world to capture the current image

        public Webcam(Size framesize, int framerate)
        {
            this.frameSize = framesize;
            this.frameRate = framerate;
            this.currentImage = null;
            
        }

        // get the devices names cconnected to the pc
        private FilterInfoCollection getCamList()
        {
            videoDevices = new FilterInfoCollection(FilterCategory.VideoInputDevice);
            return videoDevices;
        }

        //start the camera
        public void Start()
        {
           
            //raise an exception incase no video device is found
            //or else initialise the videosource variable with the harware device
            //and other desired parameters.
            Console.WriteLine(getCamList().Count);
            if (getCamList().Count == 0)
                throw new Exception("Video device not found");
            else
            {
                videoSource = new VideoCaptureDevice(videoDevices[0].MonikerString);
                videoSource.NewFrame += new NewFrameEventHandler(video_NewFrame);
                videoSource.Start();
            }
            Console.WriteLine("Start");
            Thread.Sleep(1000);
        }

        //dummy method required for Image.GetThumbnailImage() method
        private bool imageconvertcallback()
        {
            return false;
        }

        //eventhandler if new frame is ready
        private void video_NewFrame(object sender, NewFrameEventArgs eventArgs)
        {
            try
            {
                this.currentImage = currentImage = (Bitmap)eventArgs.Frame.Clone();
            }
            catch (Exception e){
                Console.WriteLine(e);
            }
            
        }

        //close the device safely
        public void Stop()
        {
            if (!(videoSource == null))
                if (videoSource.IsRunning)
                {
                    videoSource.SignalToStop();
                    videoSource = null;
                }
        }
        public void stopCapture()
        {
            this.keepOn = false;
            this.Stop();
            
        }
       
        public int startCapture()
        {
             //we stock the previous screenShot
            Bitmap previous = null;

            Image<Bgr, Byte> Frame;
           
           
          
            this.keepOn = true;

            try
            {
                
                do
                {
                    Thread.Sleep(1500);
                    
                    //image is the  current capture from the camera
                    var image = this.currentImage;
                     Frame = new Image<Bgr,byte>(image); //current Frame from camera
                    Locate(image);
                } while (this.keepOn);


            }
            catch (Exception ex)            {
                Console.WriteLine("Error code 7 : " + ex.Message);
                return 1;
            }

            return 0;
        }
        public void Locate(Bitmap image)
        {
            Bitmap imageClone = image.Clone(new Rectangle(0, 0, image.Width, image.Height), image.PixelFormat);
            PictureModificator tactileAnalyser = new PictureModificator(imageClone);
            tactileAnalyser.tactileAnalyse();
             PictureModificator myPicAnalyzer = new PictureModificator(image);
             myPicAnalyzer.applyGrayscale();
             myPicAnalyzer.applySobelEdgeFilter();
             myPicAnalyzer.markKnownForms();
            //analyse all circles we 've found in the picture
             List<Circle> circles = myPicAnalyzer.getCircle();
             AnalyserPicture.Analyse(circles, image);

             Bitmap currentBitmap = myPicAnalyzer.getCurrentImage();
             //currentBitmap.Save("C:/table/screenCamera/currentBitmap.png");

        }  
    }
}