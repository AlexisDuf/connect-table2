using System;
using System.Collections.Generic;
using System.Data;
using System.Drawing;
using System.Drawing.Imaging;
using System.Windows.Forms;
using System.Reflection;
using AForge;
using AForge.Imaging;
using AForge.Imaging.Filters;
using AForge.Math;
using AForge.Math.Geometry;
using Emgu.CV;
using Emgu.CV.Structure;
using Emgu.CV.Util;
using Emgu.Util;
using Emgu.CV.UI;
using Microsoft.AspNet.SignalR;

namespace TableConnect
{
    class AnalyserPicture
    {

        private static List<List<IntPoint>> shapes = new List<List<IntPoint>>();
        private static List<Glass> glasses = new List<Glass>();

        // Methods


        public static void Analyse(List<Circle> shapes, Bitmap image)
        {
            tagAllGlasses(false);//tag all shape as not visited yet


            for (var i = 0; i < shapes.Count; i++)
            {
                float none = 0;
                int noneInt = 0;


                Image<Bgr, Byte> myImage = new Image<Bgr, Byte>(image);
                int beginX = shapes[i].GetCenterX() - 10; //TODO check the radius
                int beginY = shapes[i].GetCenterY() - 10; //TODO bis

                Rectangle area = new Rectangle(beginX, beginY, 20, 20);

                myImage.ROI = area; //the part of the picture where the glass is


                //after we check the ROI to find the glass'color

                Bitmap myImageBitmap = myImage.ToBitmap();
                String color = checkGlassColor(myImageBitmap); //need a bitmap in arg
                
                Glass currentGlass = new Glass(shapes[i].GetCenterX(), shapes[i].GetCenterY(), shapes[i].GetRadius(), color);
                Boolean newGlass = true;
                if (glasses.Count > 0)
                {

                    for (var j = 0; j < glasses.Count; j++)
                    {
                        if (glasses[j].IsTheSameGlass(currentGlass))//si c'est le même verre, alors on ne l'ajoutera pas à liste des verres
                        {
                            glasses[j].SetVisited(true);
                            newGlass = false;
                        }
                    }
                    if (newGlass)
                    {
                        glasses.Add(currentGlass);
                        Console.WriteLine("new Glass " + currentGlass.GetColor());

                        var context = GlobalHost.ConnectionManager.GetHubContext<SignalRHub>();
                        context.Clients.All.glassStatusChanged(currentGlass.GetColor(), currentGlass.GetCenterX(), currentGlass.GetCenterY(), true);
                       
                    }
                }
                else
                {
                    glasses.Add(currentGlass);
                    var context = GlobalHost.ConnectionManager.GetHubContext<SignalRHub>();
                    context.Clients.All.glassStatusChanged(currentGlass.GetColor(), currentGlass.GetCenterX(), currentGlass.GetCenterY(), true);
                }

                
            }
            removeGlasses(); 
        }
     

        private static void tagAllGlasses(Boolean b){
            for (var i = 0; i < glasses.Count; i++)
            {
                glasses[i].SetVisited(b);
            }
        }

        private static void removeGlasses()
        {
            for (var i = 0; i < glasses.Count; i++)
            {
                if (!glasses[i].GetVisited())
                {
                    Glass removedGlass = glasses[i];
                  
                    var context = GlobalHost.ConnectionManager.GetHubContext<SignalRHub>();
                    context.Clients.All.glassStatusChanged(removedGlass.GetColor(), removedGlass.GetCenterX(), removedGlass.GetCenterY(), false);

                    //SignalRHub.getInstance().GlassStatusChanged(removeGlassEvent);

                    glasses.RemoveAt(i);
                    Console.WriteLine("A glass less");
                }
            }
        }
        private static String checkGlassColor(Bitmap image){

            Bitmap image1 = image.Clone(new Rectangle(0,0,image.Width,image.Height),image.PixelFormat);
            Bitmap image2 = image.Clone(new Rectangle(0, 0, image.Width, image.Height), image.PixelFormat);
            Bitmap image3 = image.Clone(new Rectangle(0, 0, image.Width, image.Height), image.PixelFormat);
            Bitmap image4 = image.Clone(new Rectangle(0, 0, image.Width, image.Height), image.PixelFormat);

            
            PictureModificator mpmB = new PictureModificator(image1);
            PictureModificator mpmR = new PictureModificator(image2);
            PictureModificator mpmG = new PictureModificator(image3);
            PictureModificator mpmW = new PictureModificator(image4);

            short radius = 200;

            int rectB = mpmB.EuclideanFilter(0, 0, 255, radius);
            int rectR = mpmR.EuclideanFilter(255, 0, 0, radius);
            int rectG = mpmG.EuclideanFilter(0, 255, 0, radius);
            int rectW = mpmW.EuclideanFilter(255, 255, 255, radius);


            if (rectR > 0)
            {
                Console.WriteLine("Red Glass");
                return "red";
            }
            else if (rectG>0)
            {
                Console.WriteLine("Green Glass");
                return "green";
            }
            else if (rectB > 0)
            {
                Console.WriteLine("Blue Glass");
                return "blue";
            }
            else if (rectW > 0)
            {
                Console.WriteLine("Write Glass");
                return "white";
            }
            else
            {
                return "other";
            }
       

        }
            
    }
}