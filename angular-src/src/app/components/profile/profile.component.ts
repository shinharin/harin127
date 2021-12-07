import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  name: string;
  username: string;
  email: string;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    //프로필 페이지 들어오는 순간에 사용할 기능
    this.authService.getProfile().subscribe(
      (profile) => {
        // = profile.*이름*.name(/username/email)에서 *이름*은 /routes/users.js 의 3번 res.json({ *이름*:{}과 같아야함.!!!! })
        this.name = profile.userNoPW.name;
        this.username = profile.userNoPW.username;
        this.email = profile.userNoPW.email;
      }, 
      (err) => {
        console.log(err);
        return false;
      }
    );
  }

}
