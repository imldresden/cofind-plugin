import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.css']
})
export class CreateGroupComponent implements OnInit {

  url = 'http://localhost:3000';
  users = [];
  uiMode = ['auto', 'explicit', 'snapshot'];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadUsers();
  }


  /**
   * load groups from server to view
   */
  loadUsers = function () {
    this.users = [];
    this.http.get(this.url+'/users').toPromise().then(data => {
      for (let user in data) {
        if (data.hasOwnProperty(user)) {
          this.users.push(data[user]);
        }
      }
    });
  }

  /**
   * create a new group
   * if group created -> show success alert
   * if group not created -> show warning alert
   */
  submitGroup = function () {
    let username = (<HTMLInputElement>document.getElementById('selectOwner')).value;
    console.log(username);
    let userId;
    for(let i = 0; i < this.users.length; i++){
      if(this.users[i].username === username){
        userId = this.users[i]._id;
      }
    }
    let reqGroup =
      {
        name: (<HTMLInputElement>document.getElementById('groupName')).value,
        description: (<HTMLInputElement>document.getElementById('description')).value,
        user: userId
        // , uiMode: (<HTMLInputElement>document.getElementById('selectMode')).value
      };
    console.log(reqGroup);

    //send http post request
    this.http.post(this.url+'/groups', reqGroup).toPromise().then(data => {
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
