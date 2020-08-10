import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ReportsService} from "./reports.service";
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
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  url = 'http://localhost:3000/groups';
  groups = [];

  constructor(private http: HttpClient, private reportsService: ReportsService) {
    this.http.get(this.url).toPromise().then(data => {
      for (let group in data) {
        if (data.hasOwnProperty(group)) {
          this.groups.push(data[group]);
        }
      }
    });
  }

  ngOnInit() {

  }

  /**
   * load groups from server to view
   */
  loadGroups = function () {
    this.count = 0;
    this.groups = [];
    this.http.get(this.url).toPromise().then(data => {
      this.groups = data;
      for (let group in data) {
        this.count += 1;
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

  exportGroup = function (group) {
    let txt = JSON.stringify(group);
    let blob = new Blob([txt], {type: "text/plain;charset=utf-8"});
    FileSaver.saveAs(blob, `cofind_group_${group._id}.txt`);
  }

  /**
   * fetch group by id
   * write group to json-file
   * store group-json at client side
   * @param groupId
   */
  exportGroupDyId = function (groupId) {
    this.http.get(this.url+'/'+groupId+'/all').toPromise().then(data => {
      let txt = JSON.stringify(data);
      let blob = new Blob([txt], {type: "text/plain;charset=utf-8"});
      FileSaver.saveAs(blob, `cofind_group_${groupId}.txt`);
    });
  }


}
