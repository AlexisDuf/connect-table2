using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Speech.Recognition;
using System.Speech.Synthesis;
using System.Globalization;
using System.Threading;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;
using Newtonsoft.Json;
using System.IO;
using Microsoft.AspNet.SignalR;

namespace TableConnect
{

    //Class which represent our voice recognition
    public class VoiceRecognition
    {
        private Grammar gram; //represent our dictionnary
        public Boolean recognitionOn { get; set; } //to know if the computer listen to the user
        public List<Device> Devices { get; set; } //list of all the devices which can be use


        private SpeechRecognitionEngine SpeechEngine = new SpeechRecognitionEngine();
        private SpeechSynthesizer alberto = new SpeechSynthesizer();

        //Constructor of our class
        public VoiceRecognition()
        {

            recognitionOn = false;

            //  SpeechEngine.LoadGrammar(new DictationGrammar());
            loadJson(@"C:\Users\Matt\decouverte_majeure\devices.json");

            Choices list = new Choices(new string[] { 
                "turn on the light", "turn off the light", 
                "what time is it"            
            });
            gram = new Grammar(list);
            SpeechEngine.LoadGrammar(gram);
            SpeechEngine.SpeechRecognized += new EventHandler<SpeechRecognizedEventArgs>(SpeechEngine_SpeechRecognized);
            SpeechEngine.SetInputToDefaultAudioDevice();
            SpeechEngine.MaxAlternates = 2;

        }

        //Fonction which is call when the computer recognize a voice
        void SpeechEngine_SpeechRecognized(object sender, SpeechRecognizedEventArgs e)
        {
            String speech = e.Result.Text.ToString().ToLower();

            if (speech == "turn on the light")
            {
                Console.WriteLine("I just turned on the light for you !");
                this.Devices[0].turnOn();
                alberto.Speak("I just, turned on the light, for you");
            }

            if (speech == "turn off the light")
            {
                Console.WriteLine("Ok, I turn off the light");
                alberto.Speak("Ok, I, turn off the light");
                this.Devices[0].turnOff();
            }

            if (speech == "what time is it")
            {
                alberto.Speak("No problem, It is, " + DateTime.Now.Hour.ToString() + "o'clock and " + DateTime.Now.Minute.ToString() + "minutes.");
            }

            this.stopRecognition();
        }

        //use when we want to save on memory all things
        private void loadJson(String path)
        {

            string json = File.ReadAllText(path);
            this.Devices = JsonConvert.DeserializeObject<List<Device>>(json);


        }

        //call when we want to start the recognition
        public void startRecognition()
        {
            Console.WriteLine("Recognition");
            recognitionOn = true;
            SpeechEngine.RecognizeAsync(RecognizeMode.Multiple);
        }

        //call when we want to stop the recognition
        public void stopRecognition()
        {
            recognitionOn = false;
            SpeechEngine.RecognizeAsyncStop();
            var context = GlobalHost.ConnectionManager.GetHubContext<SignalRHub>();
            context.Clients.All.voiceRecognitionStatusChanged(false);
        }

        //to find a device from his name
        private Device getDeviceFromName(string name)
        {

            foreach (var device in Devices)
            {
                if (device.name == name)
                {
                    return device;
                }
            }

            return null;
        }

        //call to turn on a device from his id
        public void switchOn(int id)
        {
            this.Devices[id].turnOn();
        }

        //call to turn off a device from his id
        public void switchOff(int id)
        {
            this.Devices[id].turnOff();
        }
    }
}
