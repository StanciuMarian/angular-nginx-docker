import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  users: User[];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getAllBooks();
  }

  getAllBooks() {
    this.http.get<User[]> (`/user-app/users`, {})
        .subscribe(users => this.users = users)
  }
}

class User {
  firstName: string;
  lastName: string;
  email: string;
}
