import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AuthService } from 'src/app/services/auth.service';
import { Login, UserNoPW } from 'src/app/models/User';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  //사용자가 입력한 값이 아래 username과 password안에 들어옴. 
  username: string;
  password: string;

  // 로그인 서비스안에서 사용할 서비스 등록하기.
  constructor(
    private authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService
  ) { }

  ngOnInit(): void {
  }

  onLoginSubmit() {
    // this.username, this.password는 사용자가 입력한 값이 들어와있는 정보
    const login: Login = {
      username: this.username,
      password: this.password
    };

    this.authService.authenticateUser(login).subscribe(
      data => {
        console.log(data);
        if(data.success) {
          this.authService.storeUserData(data.token, data.userNoPW);
          this.flashMessage.show('로그인 성공', {
            cssClass: 'alert-success',
            timeout: 3000,
          });
          this.router.navigate(['dashboard']);
        } else {
          this.flashMessage.show(data.msg, {
            cssClass: 'alert-danger',
            timeout: 5000,
          });
          this.router.navigate(['login']);
        }
      });
  }

}
