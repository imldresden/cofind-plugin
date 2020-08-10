import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ModifyService} from "./modify.service";
import FileSaver from "file-saver";

interface Group {
  isActive: boolean,
  isDeleted: boolean,
  members: [string],
  websiteVisits: [string],
  websiteProposals: [string],
  messages: [string],
  _id: string,
  user: string,
  name: string,
  description: string,
  createdAt: string,
  updatedAt: string,
  __v: number
}


@Component({
  selector: 'app-modify',
  templateUrl: './modify.component.html',
  styleUrls: ['./modify.component.css']
})

export class ModifyComponent implements OnInit {

  url = 'http://localhost:3000/groups';
  groups = [];

  constructor(private http: HttpClient, private modifyService: ModifyService) {
    this.loadGroups();
  }

  ngOnInit() {

  }

  /**
   * load groups from server to view
   */
  loadGroups = function () {
    this.groups = [];
    this.http.get(this.url).toPromise().then(data => {
      for (let group in data) {
        if (data.hasOwnProperty(group)) {
          this.groups.push(data[group]);
        }
      }
    });
  }

  getGroupById = function (groupId) {
    let groupObject = JSON.parse(this.group);
    for (let group in groupObject) {
      if (group.hasOwnProperty("_id")) {
        let g = JSON.parse(group);
        if (g._id == groupId) {
          return group;
        }
      }
    }
  }

  /**
   * not used
   * @param groupId
   */
  activateGroupById = function (groupId) {
    this.http.put(this.url + '/' + groupId + '/activate').toPromise().then(data => {
      this.loadGroups();
    });
  }

  /**
   * not used
   * @param groupId
   */
  deactivateGroupById = function (groupId) {
    this.http.put(this.url + '/' + groupId + '/deactivate').toPromise().then(data => {
      this.loadGroups();
    });
  }

  /**
   * revive a deleted group
   * set isDeleted = false
   * reload groups to view
   * @param groupId
   */
  reviveGroupById = function (groupId) {
    this.http.put(this.url + '/' + groupId + '/revive').toPromise().then(data => {
      this.loadGroups();
    });
  }

  /**
   * delete an existing group
   * set isDeleted = true
   * reload groups to view
   * @param groupId
   */
  deleteGroupById = function (groupId) {
    this.http.put(this.url + '/' + groupId + '/delete').toPromise().then(data => {
      this.loadGroups();
    });
  }
}

