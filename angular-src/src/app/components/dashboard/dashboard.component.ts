import { Component, OnInit } from '@angular/core';
import { UserNoPW } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  userString: any;
  userNoPW: UserNoPW;
  name: string;
  token: any;
  card: any;

  constructor(private authService: AuthService) { } //서버에 연결

  ngOnInit(): void {
    this.userString = localStorage.getItem('userNoPW');
    this.userNoPW = JSON.parse(this.userString);
    this.name = this.userNoPW.name;
    this.token = localStorage.getItem('authToken');

    this.authService 
      .getCard({ username: this.userNoPW.username })
      .subscribe((data) => {
        if(data.success) {
          this.card = data.card;
          localStorage.setItem('card', this.card);
        } else {
          return;
        }
      });
  }
}
