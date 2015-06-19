using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;


namespace TableConnect
{
    //Class which represent an url
    public class Url
    {
        //Url to turn on a device
        public String On { get; set; }

        //Url to turn off a device
        public String Off { get; set; }

        //Constructor
        public Url(String On, String Off)
        {
            this.On = On;
            this.Off = Off;
        }
    }
}
