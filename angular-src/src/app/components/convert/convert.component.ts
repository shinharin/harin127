import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-convert',
  templateUrl: './convert.component.html',
  styleUrls: ['./convert.component.scss']
})
export class ConvertComponent implements OnInit {
  amountFrom: number=1; //바꿀 금액
  amountTo: number; // 바뀐 금액
  from: string = 'USD'; // 바꿀 통화명
  to: string = 'KRW'; // 바뀐 통화명
  rates: { [key: string]: number }; // 전체 통화별 환율정보
  rate: number; // 현재 선택된 통화끼리의 환율

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.loadRates();
  } 

  // 페이지 로드 시 초기 환율정보 얻어옴
  loadRates(){
    this.authService.getRate().subscribe((data) => {
      console.log(data);
      this.rates = data.rates;
      this.rate = this.rates[this.to] / this.rates[this.from];
      this.convert();
    });
  }

  getAllCurrencies(): string[] {
    return Object.keys(this.rates);
  }

  //통화를 변경시 환율을 바꾸고 환전
  changeCurrency(){
    this.rate = this.rates[this.to] / this.rates[this.from];
    this.convert();
  }

  //현재 선택된 통화끼리 환전
  convert(): void{
    this.amountTo = this.amountFrom * this.rate;
  }

  //현재 선택된 통화끼리 역환전
  convertR(): void{
    this.amountFrom = this.amountTo / this.rate;
  }

}
