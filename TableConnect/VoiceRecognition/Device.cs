using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net;

namespace TableConnect
{

    //Class which represent one device
    public class Device
    {
        public String name { get; set; } //name of our device
        public String protocol { get; set; } //which is the protocol

        public Url url { get; set; } //url to call to do the associate action

        //Constructor of our class
        public Device(String name, String protocol, Url url)
        {
            this.name = name;
            this.protocol = protocol;
            this.url = url;
        }


        //Function to call when we want to turn off a device
        public void turnOn()
        {
            try
            {
                WebRequest.Create(this.url.On).GetResponse();
            }
            catch (System.Net.WebException)
            { }

        }

        //Function to call when we want to turn off device
        public void turnOff()
        {
            try
            {
                WebRequest.Create(this.url.Off).GetResponse();
            }
            catch (System.Net.WebException)
            { }
        }
    }
}
