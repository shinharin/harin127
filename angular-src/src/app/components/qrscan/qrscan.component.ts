import { Component, OnInit } from '@angular/core';
import jsQR, { QRCode } from 'jsqr';

@Component({
  selector: 'app-qrscan',
  templateUrl: './qrscan.component.html',
  styleUrls: ['./qrscan.component.scss']
})
export class QrscanComponent implements OnInit {

  canvasElement: HTMLCanvasElement;
  canvasContext: any;
  video: HTMLVideoElement;
  outputContainer: HTMLDivElement = <HTMLDivElement>(
      document.getElementById('output')
    );
    qrcodeDetected: string; //카메라로 촬영했을때 detect가 되면 그 결과값이 이곳에 들어갈 것.

    name: string;
    org: string;
    title: string;
    tel: string;
    fax: string;
    mobile: string;
    email: string;
    homepage: string;
    address: string;
    zip: string;


  constructor() { }

  ngOnInit(): void {
    this.canvasElement = <HTMLCanvasElement>(
      document.getElementById('scan-canvas')
    );
    this.canvasContext = this.canvasElement.getContext('2d');
    this.video = <HTMLVideoElement>document.createElement('video');
    navigator.mediaDevices //카메라와 관련된 부분
    //jsqr 예제프로그램에서 가져옴
      .getUserMedia({ video: { facingMode: 'environment' } })
      .then(async (stream: MediaStream) => {
        this.video.srcObject = stream;
        this.video.setAttribute('playsinline', 'true');

        //required to tell iOS safari we don't want fullscreen
        await this.video.play();
        requestAnimationFrame(this.tick.bind(this));
      });
      
  }


  drawLine(begin, end, color): void {
    this.canvasContext.beginPath();
    this.canvasContext.moveTo(begin.x, begin.y);
    this.canvasContext.lineTo(end.x, end.y);
    this.canvasContext.lineWidth = 4;
    this.canvasContext.strokeStyle = color;
    this.canvasContext.stroke();
    
  }

  tick(): void {
    if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
      this.canvasElement.hidden = false;
      this.canvasElement.height = this.video.videoHeight;
      this.canvasElement.width = this.video.videoWidth;
      this.canvasContext.drawImage(
        this.video, 0, 0,
        this.canvasElement.width,
        this.canvasElement.height
        );
        
        const imageData: ImageData = this.canvasContext.getImageData(
          0, 0, this.canvasElement.width, this.canvasElement.height
        );
          
        const code = jsQR(imageData.data, imageData.width, imageData.height);
          
        if (code) {
          this.drawLine(
            code.location.topLeftCorner,
            code.location.topRightCorner,
            '#FF3B58'
          );
              
          this.drawLine(
            code.location.topRightCorner,
            code.location.bottomRightCorner,
            '#FF3B58'
          );
                
          this.drawLine(
            code.location.bottomRightCorner,
            code.location.bottomLeftCorner,
            '#FF3B58'
          );
            
          this.drawLine(
            code.location.bottomLeftCorner,
            code.location.topLeftCorner,
            '#FF3B58'
          );
            
          this.qrcodeDetected = code.data;
          let card = JSON.parse(this.qrcodeDetected);
          this.name = card.name;
          this.org = card.org;
          this.title= card.title;
          this.tel = card.tel;
          this.fax= card.fax;
          this.mobile= card.mobile;
          this.email= card.email;
          this.homepage= card.homepage;
          this.address= card.address;
          this.zip = card.zip;
        } else {

        }
      }
      requestAnimationFrame(this.tick.bind(this));
    }
  }
