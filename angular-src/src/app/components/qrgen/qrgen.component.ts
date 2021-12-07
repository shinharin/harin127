import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-qrgen',
  templateUrl: './qrgen.component.html',
  styleUrls: ['./qrgen.component.scss']
})
export class QrgenComponent implements OnInit {
  //변수선언
  card: any;
  username: string;
  elementType: any = 'text';
  value: string;

  constructor() { }

  ngOnInit(): void {
    let userNoPW: any = localStorage.getItem('userNoPW');
    this.username = JSON.parse(userNoPW).username;
    let cardInfo: any = localStorage.getItem('card');
    this.card = cardInfo;
    this.value = this.card;
  }

}
