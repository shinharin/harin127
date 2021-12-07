import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService
  ) { }

  ngOnInit(): void {
    //navbar 처음 실행할때 무조건 실행.
  }

  onLogoutClick() {
    this.authService.logout();
    this.flashMessage.show('로그아웃 되었습니다.', {
      cssClass: 'alert-success',
      timeout: 3000,
    });
    this.router.navigate(['/login']);
    // /login 루트로 강제 이동,.
  }

  checkLoggedIn(): boolean{ //boolean은 참 거짓으로 응답하는것.
    return this.authService.loggedIn();
  }

}
