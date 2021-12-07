import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  //card 변수 선언
  username: string;
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

  constructor(
    //셋 다 import 잘 하기
    private flashMessage: FlashMessagesService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void { // 기존의 명함정보가 있는 경우 로컬스토리지에서 읽어옴
    const userNoPW: any = localStorage.getItem('userNoPW');
    //username은 동일한 정보 이용. 수정 불가
    this.username = JSON.parse(userNoPW).username;
    let cardInfo: any = localStorage.getItem('card');
    if (cardInfo !== null) {
      const card = JSON.parse(cardInfo);
      this.name = card.name;
      this.org = card.org;
      this.title = card.title;
      this.tel = card.tel;
      this.fax = card.fax;
      this.mobile = card.mobile;
      this.email = card.email;
      this.homepage = card.homepage;
      this.address = card.address;
      this.zip = card.zip;
    }
  }

  onRegisterCardSubmit() {
    //사용자가 업데이트한 명함정보 card 객체 생성
    const card: any = {
      username: this.username,
      name: this.name,
      org: this.org,
      title: this.title,
      tel: this.tel,
      fax: this.fax,
      mobile: this.mobile,
      email: this.email,
      homepage: this.homepage,
      address: this.address,
      zip: this.zip
    };

    //서버에 명함 등록 요청/응답
    // 명함정보 card를 서버에 보내고 새로 등록/업데이트
    this.authService.registerCard(card).subscribe((data) => {
      if(data.success) {
        this.flashMessage.show(data.msg, {
          cssClass: 'alert-success',
          timeout: 3000,
        });
        this.router.navigate(['/dashboard']);
      } else {
        this.flashMessage.show(data.msg, {
          cssClass: 'alert-danger',
          timeout:3000,
        });
        this.router.navigate(['/card']);
      }
    })

  }



}
