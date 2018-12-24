class Algorithm {
  constructor(){
    this.stations = [];
    this.canvas = new CanvasHandler();
  }
  
  addStation(station){
    this.stations.push(station);
    console.log(station);
    this.canvas.drawStation(station.location.x, station.location.y);
  }
  
  calcByNearest(){
    const distanceArray = this.stations.map(station => {
      return [station.location.x, station.location.y];
    });

    const sortedIndex = [];
    const result = distanceArray.map((d, index) => {
      if(index === 0){
        sortedIndex.push(0);
        return d;
      }
      
      const origin = distanceArray[sortedIndex[sortedIndex.length - 1]];

      const notConnectedIndex = distanceArray.filter((d, index) => {
        return sortedIndex.indexOf(index) === -1;
      })
      
      const sorted = notConnectedIndex.sort((a, b) => {
        const distanceA = Math.hypot(
          origin[0] - a[0],
          origin[1] - a[1]
        );
        
        const distanceB = Math.hypot(
          origin[0] - b[0],
          origin[1] - b[1]
        );
        
        return distanceA - distanceB;
      });
      
      sortedIndex.push(distanceArray.indexOf(sorted[0]));
      return sorted[0];
    });
    
    this.canvas.drawPath(result);
  }
}

class CanvasHandler {
  drawStation(x, y){
    const ctx = document.getElementById('cv').getContext('2d');
    const SIZE = 10;
    const MAP = [
      x - SIZE / 2,
      y - SIZE / 2
    ]
    
    ctx.beginPath();
    ctx.fillStyle = '#f0f0f0';
    ctx.arc(MAP[0], MAP[1], SIZE, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.stroke();
  }
  
  drawPath(locationArray){
    const ctx = document.getElementById('cv').getContext('2d');

    ctx.beginPath();
    locationArray.forEach(location => {
      ctx.lineTo(location[0], location[1]);
    });
    
    ctx.lineTo(locationArray[0][0], locationArray[0][1]);
    ctx.stroke();
  }
}

class Station {
  constructor(x, y){
    this.location = { x, y };
  }
}

const alg = new Algorithm();
const app = new Vue({
  el: '#app',
  methods: {
    onClicked(event) {
      alg.addStation(new Station(event.clientX, event.clientY));
    },
    calcByNearest() {
      alg.calcByNearest();
    }
  }  
});