using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TableConnect
{
    public class Glass
    {
       
        private int centerX;
        private int centerY;
      
        private Boolean visited = true;
        private float radius;

        private const int torelanceX = 10;
        private const int toleranceY = 10;

        private string color;


        public Glass(int centerX, int centerY, float radius, string color){
          
            this.centerX = centerX;
            this.centerY = centerY;
           
            this.radius = radius;
            this.color = color;
        }

        public Boolean IsTheSameGlass(Glass glass)
        {

            float differenceX = Math.Abs(this.centerX - glass.GetCenterX());
            float differenceY = Math.Abs(this.centerY - glass.GetCenterY());
          
            if(differenceX<= torelanceX && differenceY <= toleranceY){ //on estime que le verre est le meme (à la tolérance près)
                return true;
            }else{
                return false;
            }
        }

        public int GetCenterX()
        {
            return this.centerX;
        }
        public int GetCenterY()
        {
            return this.centerY;
        }
        public void SetVisited(Boolean b)
        {
            this.visited = b;
        }
        public Boolean GetVisited()
        {
            return this.visited;
        }
        public string GetColor()
        {
            return this.color;
        }
    }
}
