using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TableConnect
{
    class Circle
    {
        private int centerX;
        private int centerY;
        private float radius;

        public Circle(int centerX, int centerY, float radius)
        {
            this.centerX = centerX;
            this.centerY = centerY;
            this.radius = radius;
        }

        public int GetCenterX()
        {
            return this.centerX;
        }

        public int GetCenterY()
        {
            return this.centerY;
        }

        public float GetRadius()
        {
            return this.radius;
        }

    }
}
