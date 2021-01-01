import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { AccountService } from '../../services';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Input()
  user: User;

  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
  }

  logout() {
    this.accountService.logout();
  }
}
