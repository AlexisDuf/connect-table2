using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TableConnect
{
    public class GlassEvent
    {
        private int positionX;
        private int positionY;
        private string glassColor;
        private Boolean status;

        public GlassEvent(int positionX, int positionY, string color, Boolean status){
            this.positionX = positionX;
            this.positionY = positionY;
            this.glassColor = color;
            this.status = status;
        }
        public GlassEvent(Glass currentGlass, Boolean status)
        {
            this.positionX = currentGlass.GetCenterX();
            this.positionY = currentGlass.GetCenterY();
            this.glassColor = currentGlass.GetColor();
            this.status = status;
        }

    
    }
}