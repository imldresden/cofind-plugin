import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  create_user;
  create_group;

  constructor() { }

  ngOnInit() {
    this.create_user = true;
    this.create_group = false;
  }

  showCreateUser(){
    this.create_user = true;
    this.create_group = false;

    let user = document.getElementById('showCreateUser');
    user.className = "active";
    let group = document.getElementById('showCreateGroup');
    group.className = "";
  }

  showCreateGroup(){
    this.create_user = false;
    this.create_group = true;

    let user = document.getElementById('showCreateUser');
    user.className = "";
    let group = document.getElementById('showCreateGroup');
    group.className = "active";
  }


}
