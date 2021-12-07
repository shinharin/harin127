import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  users: any; //users라는 array 선언

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.getList().subscribe((users) => {
      this.users = users;
    });
  }

}
