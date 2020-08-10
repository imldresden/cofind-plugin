import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {

  url = 'http://localhost:3000/users/';

  constructor(private http: HttpClient) {
  }

  ngOnInit() {

  }

  /**
   * create a new user if username not already exists
   * if user created -> show success alert
   * if user not created -> show warning alert
   */
  submitUser = function () {
    let reqUser =
      {
        username: (<HTMLInputElement>document.getElementById('username')).value,
        password: (<HTMLInputElement>document.getElementById('password')).value
      };

    //send http post request
    this.http.post(this.url, reqUser).toPromise().then(data => {
      console.log("response:");
      console.log(data);
      //if user created -> show success alert
      if (data.createdAt) {
        let success = document.getElementById('createSuccess');
        success.setAttribute("style", "display:block");
        let warning = document.getElementById('createWarning');
        warning.setAttribute("style", "display:none");
      }
    }, error => {
      //if user not created -> show warning alert
      let success = document.getElementById('createSuccess');
      success.setAttribute("style", "display:none");
      let warning = document.getElementById('createWarning');
      warning.setAttribute("style", "display:block");
    });
  }
}
