using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Management;
using System.IO;
using Newtonsoft.Json;
using Microsoft.AspNet.SignalR;

namespace TableConnect
{

    class UsbDetection
    {
        public String UsbPort { get; set; }
        public String DestNameForMusics { get; set; }
        public String DestNameForVideos { get; set; }
        public String DestNameForImages { get; set; }

        public List<String> Musics { get; set; }
        public List<String> Videos { get; set; }
        public List<String> Images { get; set; }
        public List<String> MusicsWithoutExtension { get; set; }
        public List<String> VideosWithoutExtension { get; set; }
        public List<String> ImagesWithoutExtension { get; set; }

        public ManagementEventWatcher w = null;

        public Boolean Inserted { get; set; }

        //Constructeur de notre objet
        public UsbDetection()
        {
            Inserted = false;
            UsbPort = @"E:\";
            DestNameForImages = @"C:\Users\Matt\Documents\Visual Studio 2013\Projects\connect-table2\WebApplication1\Ressources\pictures";
            DestNameForMusics = @"C:\Users\Matt\Documents\Visual Studio 2013\Projects\connect-table2\WebApplication1\Ressources\musics";
            DestNameForVideos = @"";

            Musics = new List<string>();
            Videos = new List<string>();
            Images = new List<string>();
            MusicsWithoutExtension = new List<string>();
            VideosWithoutExtension = new List<string>();
            ImagesWithoutExtension = new List<string>();

        }

        //Permet d'ajouter ou supprimer le handler qui gère l'USB
        public void AddRemoveUSBHandler()
        {

            WqlEventQuery q;
            ManagementScope scope = new ManagementScope("root\\CIMV2");
            scope.Options.EnablePrivileges = true;


            try
            {

                q = new WqlEventQuery();
                q.EventClassName = "__InstanceDeletionEvent";
                q.WithinInterval = new TimeSpan(0, 0, 3);
                q.Condition = "TargetInstance ISA 'Win32_USBControllerdevice'";
                w = new ManagementEventWatcher(scope, q);
                w.EventArrived += USBRemoved;

                w.Start();
            }
            catch (Exception e)
            {


                Console.WriteLine(e.Message);
                if (w != null)
                {
                    w.Stop();

                }
            }

        }

        //Fonction qui sert à détecter l'ajout de clef usb
        public void AddInsertUSBHandler()
        {

            WqlEventQuery q;
            ManagementScope scope = new ManagementScope("root\\CIMV2");
            scope.Options.EnablePrivileges = true;

            try
            {

                q = new WqlEventQuery();
                q.EventClassName = "__InstanceCreationEvent";
                q.WithinInterval = new TimeSpan(0, 0, 3);
                q.Condition = "TargetInstance ISA 'Win32_USBControllerdevice'";
                w = new ManagementEventWatcher(scope, q);
                w.EventArrived += USBInserted;

                w.Start();
            }
            catch (Exception e)
            {

                Console.WriteLine(e.Message);
                if (w != null)
                {
                    w.Stop();

                }
            }

        }

        //Fonction que l'on appelle lorsque l'utilisateur insert une clef usb
        public void USBInserted(object sender, EventArgs e)
        {

            if (!Inserted)
            {
                Console.WriteLine("A USB device inserted");
                Inserted = true;

                readFiles();
            }

        }

        //Fonction que l'on appelle lorsque l'on retire une clef usb
        public void USBRemoved(object sender, EventArgs e)
        {
            if (Inserted)
            {
                Console.WriteLine("A USB device removed");
                Inserted = false;
            }

        }

        //fonction de trie qui permet de stocker les chemins pour accéder aux fichiers de la clef usb
        public void readFiles()
        {

            //For our musics
            try
            {
                Musics.AddRange(Directory.GetFiles(UsbPort, "*.mp3", SearchOption.AllDirectories));
            }
            catch (Exception e)
            {
            }

            //For our musics
            try
            {
                Musics.AddRange(Directory.GetFiles(UsbPort, "*.flac", SearchOption.AllDirectories));
            }
            catch (Exception e)
            {
            }

            //For our musics
            try
            {
                Musics.AddRange(Directory.GetFiles(UsbPort, "*.wav", SearchOption.AllDirectories));
            }
            catch (Exception e)
            {
            }

            //For our musics
            try
            {
                Musics.AddRange(Directory.GetFiles(UsbPort, "*.ogg", SearchOption.AllDirectories));
            }
            catch (Exception e)
            {
            }

            //For our videos
            try
            {
                Videos.AddRange(Directory.GetFiles(UsbPort, "*.mp4", SearchOption.AllDirectories));
            }
            catch (Exception e)
            {
            }

            //For our videos
            try
            {
                Videos.AddRange(Directory.GetFiles(UsbPort, "*.mkv", SearchOption.AllDirectories));
            }
            catch (Exception e)
            {
            }


            //For our videos
            try
            {
                Videos.AddRange(Directory.GetFiles(UsbPort, "*.mov", SearchOption.AllDirectories));
            }
            catch (Exception e)
            {
            }

            //For our videos
            try
            {
                Videos.AddRange(Directory.GetFiles(UsbPort, "*.avi", SearchOption.AllDirectories));
            }
            catch (Exception e)
            {
            }

            //For our videos
            try
            {
                Videos.AddRange(Directory.GetFiles(UsbPort, "*.wmd", SearchOption.AllDirectories));
            }
            catch (Exception e)
            {
            }

            //For our images
            try
            {
                Images.AddRange(Directory.GetFiles(UsbPort, "*.jpg", SearchOption.AllDirectories));
            }
            catch (Exception e)
            {
            }

            //For our images
            try
            {
                Images.AddRange(Directory.GetFiles(UsbPort, "*.jpeg", SearchOption.AllDirectories));
            }
            catch (Exception e)
            {
            }

            //For our images
            try
            {
                Images.AddRange(Directory.GetFiles(UsbPort, "*.png", SearchOption.AllDirectories));
            }
            catch (Exception e)
            {
            }

            //For our images
            try
            {
                Images.AddRange(Directory.GetFiles(UsbPort, "*.bmp", SearchOption.AllDirectories));
            }
            catch (Exception e)
            {
            }


            initializeListWithoutExtension(Musics, Images, Videos);
            moveFile(Musics, DestNameForMusics);
            //moveFile(Videos, DestNameForVideos);
            moveFile(Images, DestNameForImages);

            serializeIt(MusicsWithoutExtension,Musics, ImagesWithoutExtension, Images);
       
        }

        //Créé d'autres listes de chaînes de charactères contenant uniquement le nom des fichiers sans leur extension ni le chemin dans le fichiers
        public void initializeListWithoutExtension(params List<String>[] values)
        {
            List<List<String>> listOfList = new List<List<string>>();
            listOfList.Add(MusicsWithoutExtension);
            listOfList.Add(ImagesWithoutExtension);
            listOfList.Add(VideosWithoutExtension);

            for (int i = 0; i < values.Length; i++)
            {
                foreach (String path in values[i])
                {
                    listOfList[i].Add(Path.GetFileNameWithoutExtension(path));
                }

            }
        }

        //Fonction permettant de bouger les fichiers d'un dossier à un autre
        public void moveFile(List<String> list, String destName)
        {

            String fileName = "";
            String dest = "";


            foreach (String source in list)
            {
                fileName = Path.GetFileName(source);
                dest = destName + @"\" + fileName;
                File.Copy(source, dest, true);
            }

        }

        //Permet de sérialiser les listes de fichiers que l'on souhaite
        public void serializeIt(params List<String>[] values)
        {
            var context = GlobalHost.ConnectionManager.GetHubContext<SignalRHub>();
            context.Clients.All.usbWasDetect(JsonConvert.SerializeObject(values, Formatting.Indented));
        }

    }
}
