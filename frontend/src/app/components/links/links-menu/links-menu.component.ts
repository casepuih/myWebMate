import {Component, OnInit, SecurityContext} from '@angular/core';
import {MemberService} from "../../../services/member.service";
import {LinksService} from "../../../services/links.service";
import {LinksGroup} from "../../../models/groupLinksModel";
import {Link} from "../../../models/linksModel";
import {MenuDisplay, TryToAddALink, AddALink} from "../../../models/linksUtilsModel";
import {Router} from "@angular/router";
import {ErrorService} from "../../../services/error.service";

@Component({
  selector: 'app-links-menu',
  templateUrl: './links-menu.component.html',
  styleUrls: ['./links-menu.component.scss'],
})

export class LinksMenuComponent implements OnInit {
  isCreateForm:boolean = false;
  addGroupLinksClass:string = "groupLinksCard";
  createGroupLinksTitle!:string;
  groupLinksList!:LinksGroup[];
  linksList!:Link[];
  isMenuDisplay:MenuDisplay[] = [];
  isTryToAddALink:TryToAddALink[] = [];
  addLink:AddALink[] = [];
  scrollingMenu!:boolean;

  constructor(
    private _memberService : MemberService,
    private _linksService : LinksService,
    private _router : Router,
    private _errorService : ErrorService
  ) { }

  ngOnInit() {
   this.getGroupList();
   this.getLinksList();
   this.getEmitter();
  }

  getEmitter() {
    this._linksService.getLinksUpdateEmitter().subscribe( {
      next: () => {
        this.getGroupList();
        this.getLinksList();
      },
      error: (error) => {
        this._errorService.errorHandler(error);
      }
    })
  }

  getGroupList() {
    this._linksService.getGroupLinksList().subscribe({
      next: (data) => {
        this.groupLinksList = data.results.linksGroup;

        for (let element of this.groupLinksList) {
          this.isMenuDisplay.push({id:element.id, display:false});
          this.isTryToAddALink.push({id:element.id, display:false});
          this.addLink.push({name:"", link:"", linksGroupId:element.id});
        }
      },
      error: (error) => {
        this._errorService.errorHandler(error);
      }
    })
  }

  getLinksList() {
    this._linksService.getLinksList().subscribe({
      next: (data) => {
        this.linksList = data.results.links;
      },
      error: (error) => {
        this._errorService.errorHandler(error);
      }
    })
  }

  createForm() {
    this.isCreateForm = true;
    this.addGroupLinksClass = "addGroupLinksCard";
  }

  addGroupLinks() {
    this._linksService.createGroupLinks(this.createGroupLinksTitle).subscribe({
      next: (data:any) => {
        this.isCreateForm = false;
        this.createGroupLinksTitle = "";
        this.addGroupLinksClass = "groupLinksCard";
      },
      error: (error) => {
        this._errorService.errorHandler(error);
      }
    })
  }

  menuDisplay(id:number) {
    const menu = this.isMenuDisplay.find(menu => menu.id === id);
    if(menu) {
      menu.display = !menu.display;
    }
  }

  isThatMenuDisplay(id:number) {
    const menu = this.isMenuDisplay.find(menu => menu.id === id);
    if (menu) {
      return menu.display;
    }

    return false;
  }

  isTryingToAddALink(id:number) {
    const formForAdd = this.isTryToAddALink.find(menu => menu.id === id);
    if (formForAdd) {
      return formForAdd.display;
    }

    return false;
  }

  tryAddALink(id:number) {
    const menu = this.isMenuDisplay.find(menu => menu.id === id);
    const formForAdd = this.isTryToAddALink.find(menu => menu.id === id);

    if (menu) {
      menu.display = false;
    }

    if (formForAdd) {
      formForAdd.display = true;
    }
  }

  closeAddLink(id:number) {
    const formForAdd = this.isTryToAddALink.find(menu => menu.id === id);

    if (formForAdd) {
      formForAdd.display = false;
    }
  }

  selectAddLink(id:number) {
    const link = this.addLink.find(result => result.linksGroupId === id);

    if (link) {
      return link;
    }

    return {name:"", link:"", linksGroupId:0};
  }

  checkIfCanCreateLink(id:number) {
    const link = this.addLink.find(result => result.linksGroupId === id);
    if (link) {
      return link.name === "" || link.link === "";
    }

    return true;
  }

  createLink(id:number) {
    const link = this.addLink.find(result => result.linksGroupId === id);
    if (link) {
      this._linksService.createLink(link.name, link.link, link.linksGroupId).subscribe({
        next: () => {
          const formForAdd = this.isTryToAddALink.find(menu => menu.id === id);
          const link = this.addLink.find(result => result.linksGroupId === id);

          if (formForAdd) {
            formForAdd.display = false;
          }

          if (link) {
            link.link="";
            link.name="";
          }
        },
        error: (error) => {
          this._errorService.errorHandler(error);
        }
      })
    }
  }

  adminGroupLinks(id:number) {
    const menu = this.isMenuDisplay.find(menu => menu.id === id);

    if (menu) {
      menu.display = false;
    }

    if (id) {
      this._router.navigate(['links-group/' + id]);
    }
  }

  displayScrollingMenu() {
    this.scrollingMenu = !this.scrollingMenu;
  }

  displayAll() {
    this._router.navigate(['my-links']);
    this.scrollingMenu = false;
  }
}
