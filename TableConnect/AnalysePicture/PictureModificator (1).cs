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


namespace TableConnect
{
    class PictureModificator
    {
        private Bitmap currentImage;
        private List<List<IntPoint>> shapes = new List<List<IntPoint>>();
        private List<Circle> circles = new List<Circle>();
        public PictureModificator(Bitmap currentImage)
        {
            this.currentImage = currentImage;

        }

        public PictureModificator()
        {
            this.currentImage = null;
        }
        public List<List<IntPoint>> getShapes()
        {
            return this.shapes;
        }
        public List<Circle> getCircle()
        {
            return this.circles;
        }

        public bool applySobelEdgeFilter()
        {
            if (currentImage != null)
            {
                try
                {
                    // create filter
                    SobelEdgeDetector filter = new SobelEdgeDetector();
                    // apply the filter
                    filter.ApplyInPlace(currentImage);
                    return true;
                }
                catch (Exception e)
                {

                }
            }
            return false;
        }

        public bool applyGrayscale()
        {
            if (currentImage != null)
            {
                try
                {
                    // create grayscale filter (BT709)
                    Grayscale filter = new Grayscale(0.2125, 0.7154, 0.0721);
                    // apply the filter
                    currentImage = filter.Apply(currentImage);
                    return true;
                }
                catch (Exception e)
                { }
            }
            return false;
        }

        public bool markKnownForms()
        {
            if (currentImage != null)
            {
                try
                {
                    Bitmap image = new Bitmap(this.currentImage);
                    // lock image
                    BitmapData bmData = image.LockBits(
                        new Rectangle(0, 0, image.Width, image.Height),
                        ImageLockMode.ReadWrite, image.PixelFormat);

                    // turn background to black
                    ColorFiltering cFilter = new ColorFiltering();
                    cFilter.Red = new IntRange(0, 64);
                    cFilter.Green = new IntRange(0, 64);
                    cFilter.Blue = new IntRange(0, 64);
                    cFilter.FillOutsideRange = false;
                    cFilter.ApplyInPlace(bmData);


                    // locate objects
                    BlobCounter bCounter = new BlobCounter();

                    bCounter.FilterBlobs = true;
                    bCounter.MinHeight = 10;
                    bCounter.MinWidth = 30;

                    bCounter.ProcessImage(bmData);
                    Blob[] baBlobs = bCounter.GetObjectsInformation();
                    image.UnlockBits(bmData);

                    // coloring objects
                    SimpleShapeChecker shapeChecker = new SimpleShapeChecker();

                    Graphics g = Graphics.FromImage(image);
                    Pen yellowPen = new Pen(Color.Yellow, 2); // circles
                    Pen redPen = new Pen(Color.Red, 2);       // quadrilateral
                    Pen brownPen = new Pen(Color.Brown, 2);   // quadrilateral with known sub-type
                    Pen greenPen = new Pen(Color.Green, 2);   // known triangle
                    Pen bluePen = new Pen(Color.Blue, 2);     // triangle



                    this.shapes.Clear();



                    for (int i = 0, n = baBlobs.Length; i < n; i++)
                    {
                        List<IntPoint> edgePoints = bCounter.GetBlobsEdgePoints(baBlobs[i]);
                        
                        AForge.Point center;
                        float radius;

                        // is circle ?

                        if (shapeChecker.IsCircle(edgePoints, out center, out radius))
                        {
                            Circle currentCircle = new Circle((int)center.X, (int)center.Y, (float)radius);

                            this.circles.Add(currentCircle);
                            g.DrawEllipse(yellowPen,
                                (float)(center.X - radius), (float)(center.Y - radius),
                                (float)(radius * 2), (float)(radius * 2));
                        }
                        else
                        {
                            List<IntPoint> corners;

                            // is triangle or quadrilateral
                            if (shapeChecker.IsConvexPolygon(edgePoints, out corners))
                            {
                                PolygonSubType subType = shapeChecker.CheckPolygonSubType(corners);
                                Pen pen;
                                if (subType == PolygonSubType.Unknown)
                                {
                                    pen = (corners.Count == 4) ? redPen : bluePen;
                                }
                                else
                                {
                                    pen = (corners.Count == 4) ? brownPen : greenPen;
                                }
                                 if (corners.Count == 4) //is a rectangle ! 
                                 {
                                     this.shapes.Add(corners);
                                 }
                                g.DrawPolygon(pen, ToPointsArray(corners));
                            }
                        }
                    }
                    yellowPen.Dispose();
                    redPen.Dispose();
                    greenPen.Dispose();
                    bluePen.Dispose();
                    brownPen.Dispose();
                    g.Dispose();
                    this.currentImage = image;
                    return true;
                }
                catch (Exception e)
                {

                }
            }
            return false;
        }
        public void tactileAnalyse()
        {
            this.applyGrayscale();
            this.applySobelEdgeFilter();
        }

        private System.Drawing.Point[] ToPointsArray(List<IntPoint> points)
        {
            System.Drawing.Point[] array = new System.Drawing.Point[points.Count];

            for (int i = 0, n = points.Count; i < n; i++)
            {
                array[i] = new System.Drawing.Point(points[i].X, points[i].Y);
            }

            return array;
        }

        public void setCurrentImage(Bitmap currentImage)
        {
            this.currentImage = currentImage;
        }

        public Bitmap getCurrentImage()
        {
            return currentImage;
        }
        public int EuclideanFilter(byte r, byte g, byte b, short radius)
        {
            Bitmap EuclideanPictureTemp = this.currentImage;

            EuclideanColorFiltering filter = new EuclideanColorFiltering();
            //set center colol and radius
            filter.CenterColor = new AForge.Imaging.RGB(r, g, b);

            filter.Radius = radius;
            // apply the filter

            filter.ApplyInPlace(EuclideanPictureTemp);

            BitmapData objectsData = EuclideanPictureTemp.LockBits(new Rectangle(0, 0, EuclideanPictureTemp.Width, EuclideanPictureTemp.Height), ImageLockMode.ReadOnly, EuclideanPictureTemp.PixelFormat);
            // grayscaling
            Grayscale grayFilter = new Grayscale(0.2125, 0.7154, 0.0721);
            UnmanagedImage grayImage = grayFilter.Apply(new UnmanagedImage(objectsData));
            // unlock image
            this.currentImage.UnlockBits(objectsData);

            BlobCounter blobCounter = new BlobCounter(EuclideanPictureTemp);
            blobCounter.MinWidth = 5;
            blobCounter.MinHeight = 10;
            blobCounter.FilterBlobs = true;
            //blobCounter.ProcessImage(grayImage);
            Rectangle[] rects = blobCounter.GetObjectsRectangles();
            foreach (Rectangle objectRect in rects)
            {
                if (rects.Length > 0)
                {
                    {
                        Graphics ga = Graphics.FromImage(EuclideanPictureTemp);
                        using (Pen pen = new Pen(Color.FromArgb(160, 255, 160), 5))
                        {
                            ga.DrawRectangle(pen, objectRect);
                        }

                        ga.Dispose();
                    }

                }
            }
            return rects.Length;
        }
    }
}