import { Component, OnInit } from '@angular/core';
import {MemberService} from "../../services/member.service";
import {LinksService} from "../../services/links.service";
import {ActivatedRoute, Router} from "@angular/router";
import {LinksGroup} from "../../models/groupLinksModel";
import {Link} from "../../models/linksModel";

@Component({
  selector: 'app-links-group',
  templateUrl: './links-group.page.html',
  styleUrls: ['./links-group.page.scss'],
})
export class LinksGroupPage implements OnInit {
  groupLinksList!:LinksGroup[];
  linksList!:Link[];
  groupLinksName!:string;
  id!:number;
  linksListNgModel!:Link[];
  errorDelete: boolean = false;

  constructor(
    private ar : ActivatedRoute,
    private _memberService : MemberService,
    private _linksService : LinksService,
    private _router : Router
  ) { }

  ngOnInit() {
    this.id = this.ar.snapshot.params['id'];
    this.isConnectedResolver();
    this.getGroupListResolver();
    this.getLinksListResolver();
    this.getEmitter();
  }

  isConnectedResolver() {
    this.ar.data.subscribe(({isConnectedResolver}) => {});
  }

  getGroupListResolver() {
    this.ar.data.subscribe(({linksGroupResolver}) => {
      this.groupLinksList = linksGroupResolver.results.linksGroup.filter((v: { id: number; }) => v.id == this.id);
      this.groupLinksName = this.groupLinksList[0].name;
    })
  }

  getLinksListResolver() {
    this.ar.data.subscribe(({linksResolver}) => {
      this.linksList = linksResolver.results.links.filter((v: { linksGroupId: number; }) => v.linksGroupId == this.id);
      this.linksListNgModel = JSON.parse(JSON.stringify(this.linksList));
    })
  }

  getEmitter() {
    this._linksService.getLinksUpdateEmitter().subscribe( {
      next: () => {
        this.getGroupList();
        this.getLinksList();
      }
    })
  }

  getGroupList() {
    this._linksService.getGroupLinksList().subscribe({
      next: (data) => {
        this.groupLinksList = data.results.linksGroup.filter(v => v.id == this.id);
        this.groupLinksName = this.groupLinksList[0].name;
      }
    })
  }

  getLinksList() {
    this._linksService.getLinksList().subscribe({
      next: (data) => {
        this.linksList = data.results.links.filter(v => v.linksGroupId == this.id);
        this.linksListNgModel = JSON.parse(JSON.stringify(this.linksList));
      }
    })
  }

  updateLink(id:number) {
    const link = this.linksListNgModel.find(link => link.id === id);
    if (link) {
      this._linksService.updateLink(link.id, link.name, link.link).subscribe({})
    }
  }

  deleteLink(id:number) {
    this._linksService.deleteLink(id).subscribe({})
  }

  updateGroupLinksName() {
    this._linksService.updateGroupLinksName(this.id, this.groupLinksName).subscribe({})
  }

  deleteGroupLinks() {
    if (this.linksList.length === 0) {
      this._linksService.deleteGroupLinks(this.id).subscribe({});
      this.errorDelete = false;
      this._router.navigate(['home/']);

      return;
    }

    this.errorDelete = true;
  }

}
