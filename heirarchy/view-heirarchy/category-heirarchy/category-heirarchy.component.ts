import { Component, OnInit,Injectable, AfterViewInit, ViewChild } from '@angular/core';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTree, MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import { HeirarchyService } from 'src/app/services/heirarchy.service';
import { ActivatedRoute } from '@angular/router';
import { ItemService } from 'src/app/services/items-service/item.service';
import { MenuItemService } from 'src/app/services/items-service/menu-item.service';
import { ToastrService } from 'ngx-toastr';
import { NodeHierarchy } from 'src/app/models/Node';
import { SharedEventService } from 'src/app/services/shared-event.service';
import { NewCategoryComponent } from './new-category/new-category.component';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { Tenant } from 'src/app/models/tenant';
import { shareReplay, take } from 'rxjs';
import { CurrentUserService } from 'src/app/services/current-user-service';

  /** Flat node with expandable and level information */
  let nodeCatList=[]
  interface ExampleFlatNode {
    expandable: boolean;
    name: string;
    level: number;
    id:string;
  }
@Component({
  selector: 'app-category-heirarchy',
  templateUrl: './category-heirarchy.component.html',
  styleUrls: ['./category-heirarchy.component.scss']
})
export class CategoryHeirarchyComponent implements OnInit {
    heirarchyId:string;
    isLeafNode:boolean;
    noDelete:boolean = false;
    pagination: any;
    items:any;
    currentNode:any;
    tenant:Tenant;
    tenant$ = this.localStorageService.tenantData$;
    currentNodeName:string;
    classificationType:any;
    mainHeirarchyName:string;
    showMore:boolean=true;
    currentView: string;
    subItemsList: any[] = [];
    search: any = { searchData: "", pageNumber: 1, pageSize: 10, total: 0 };
    @ViewChild('wholeTree') tree: MatTree<any>;

    categoryName: string;
    nodeId: string;
    nodesIds:any[] = [];
    levelId: number;
    categoryId : string;
    deleteCategoryNames: string[] =[];
    userCanDeleteElements = true;
    userCanAddNewElement = true;
    userCanEditElement = true;
    mainHeirarchShow:number;
    childNode:number=0;
    catToInsert=[];
    prevExpansionModel=[]

    private _transformer = (node: NodeHierarchy, level: number) => {
        return {
          expandable: !!node.children && node.children.length > 0,
          name: node.name,
          level: level,
          id: node.id,
          node:node
        };
      };

      treeControl = new FlatTreeControl<ExampleFlatNode>(
        node => node.level,
        node => node.expandable,
      );

      treeFlattener = new MatTreeFlattener(
        this._transformer,
        node => node.level,
        node => node.expandable,
        node => node.children
      );

      dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  constructor(private localStorageService: LocalStorageService,private offcanvasService: NgbOffcanvas, private currentUserService:CurrentUserService, private modalService: NgbModal,private sharedService: SharedEventService,private heirarchyService:HeirarchyService,private route:ActivatedRoute,private itemService:ItemService,private menuItemService: MenuItemService,private toastr:ToastrService ) {
    //this.dataSource.data = TREE_DATA;
  }
  hasChild = (_: number, node: ExampleFlatNode) => node.level !=this.childNode-2;

  ngOnInit(): void {
    const tenantObs$ = this.localStorageService.tenantData$.pipe(take(1));
    tenantObs$.subscribe((tenant) => {
      this.tenant = tenant;
      this.currentUserService.loadCurrentUser();
      const userObs$ = this.currentUserService.currentUser$.pipe(shareReplay());
      userObs$.subscribe(user => {
        const currentConcept = this.tenant?.conceptKey;
        for (var i = 0; i < user?.tenants.length; i++) {
          const tenant = user.tenants[i];
          if (tenant.conceptKey === currentConcept && (tenant.role === "ADMIN" || tenant.role === "BUYER")) {
            this.userCanDeleteElements = true;
          }
          if (tenant.conceptKey === currentConcept && (tenant.role === "ADMIN" || tenant.role === "BUYER")) {
            this.userCanEditElement = true;
            this.userCanAddNewElement = true;
          }
        }
      });
    });
    this.heirarchyId = this.route.snapshot.parent.params['heirarchyId'];
    this.heirarchyService.getHeirarchyById(this.heirarchyId).subscribe(res=>{
        this.childNode = res.levels;
        this.classificationType = res.classificationType;
        this.mainHeirarchyName=res.name;
        this.mainHeirarchShow=0;
        this.dataSource.data = res.hierarchyDocument?.nodes;
      })

  }
  catagoryList=[];
  nodeIdforCategory;
  getNode(data){
    nodeCatList.push(data);
    this.mainHeirarchShow++;
    this.catagoryList=data.node?.children;

    this.isLeafNode=false;

    this.nodeIdforCategory = data.id;

    this.categoryName = data.name;
    this.levelId = data.level + 1;

    this.categoryId = data.id;
  }
  ids=[];
  selectedCategories=[];
  getNodeId(category, event: Event){
    this.selectedCategories=[];
    // this.noDelete = false;
    // if(category.children!=undefined && category.children.length > 0){
    //   this.noDelete = true;
    // };

    // //for edit
    // this.nodeId = category.id;
    // this.categoryName = category.name;

    //for delete
    // const ischecked = (<HTMLInputElement>event.target).checked;
    // if(!ischecked){
    //   this.nodesIds = this.nodesIds.filter(function (str) { return !str.includes(category.id); });
    //   this.deleteCategoryNames = this.deleteCategoryNames.filter(function (str) { return !str.includes(category.name); });
    // }
    // else{
    //   this.deleteCategoryNames.push(category.name);
    //   this.nodesIds.push(category.id);
    // }
    for(let i=0;i<this.catagoryList.length;i++){
      let doc = document.getElementById('checked'+i) as HTMLInputElement;
      if(doc.checked){
        this.selectedCategories.push(this.catagoryList[i]);
      }
    }
    //for edit
    if(this.selectedCategories.length ==1){
      this.nodeId = this.selectedCategories[0].id;
      this.categoryName = this.selectedCategories[0].name;
    }
  }

  DeleteAll(event){
    var deleteObject={
      hierarchyId: this.heirarchyId,
      nodeId:this.currentNode,
      ids:event
    }
    var searchTerm = "?hierarchyId=" + this.heirarchyId + "&nodeId=" +this.nodeId + "&Filters= " + this.search.searchData + "&PageNumber=" + this.search.pageNumber + "&PageSize=" + this.search.pageSize;

    if(this.classificationType=='Menu Items'){
      this.menuItemService.RemoveMultipleMenuItemHierarchyAssociationsById(deleteObject).subscribe({
        next: (res)=>{
          this.toastr.success('Menu Item(s) Removed Succesfully');
          this.menuItemService.GetMenuItemsInLeafCategory(searchTerm).subscribe({
            next:async data=>{
              this.pagination = JSON.parse(data.headers.get('X-Pagination'));
              var viewData = await this.menuItemService.getLogicalMenuItemsInLeafCategory(data.body);
              this.items=viewData;
            },error: e=>{
              if(e.error.status==404){
                this.items=[];
              }
              if(e.error.status==500){
                this.toastr.error('Something Went Wrong')
              }
            }
          })

        },error: e=>{
          this.toastr.error('Something went wrong');
        }
      })
    }
    if(this.classificationType == 'Items'){
      this.itemService.RemoveMultipleItemHierarchyAssociationById(deleteObject).subscribe({
        next: res=>{
          this.toastr.success('Item(s) Removed Succesfully');
          this.itemService.GetItemsInLeafCategory(searchTerm).subscribe({
            next: async data=>{
              this.pagination = JSON.parse(data.headers.get('X-Pagination'));
              var viewData = await this.itemService.getLogicalItemsInLeafCategory(data.body)
              this.items=viewData;
              this.items.forEach(element => {
                this.subItemsList.push(element[1].value);
              });
              if(this.items.length<=0 || this.items ==undefined || this.items ==null){
              };

            },error : async e=>{
              if(e.error.status==404){
                this.items=[];
              }
              if(e.error.status==500){
                this.toastr.error('Something Went Wrong')
              }
            }
            }
          )
        },error: e=>{
          this.toastr.error('Something went wrong');
        }
      })
    }

  }

  openLeafNode(node){
    this.nodeId = node.id;
    this.categoryName = node.name;
    this.levelId = node.level + 1;
    this.isLeafNode=true;
    this.currentNode = node.id;
    this.currentNodeName=node.name;
    var searchTerm = "?hierarchyId=" + this.heirarchyId + "&nodeId=" +node.id + "&Filters= " + this.search.searchData + "&PageNumber=" + this.search.pageNumber + "&PageSize=" + this.search.pageSize;
    if(this.classificationType == 'Items'){
      this.itemService.GetItemsInLeafCategory(searchTerm).subscribe({
        next: async data=>{
          this.pagination = JSON.parse(data.headers.get('X-Pagination'));
          var viewData = await this.itemService.getLogicalItemsInLeafCategory(data.body)
          this.items=viewData;
          this.items.forEach(element => {
            this.subItemsList.push(element[1].value);
          });
          if(this.items.length<=0 || this.items ==undefined || this.items ==null){
          };

        },error : async e=>{
          if(e.error.status==404){
            this.items=[];
          }
          if(e.error.status==500){
            this.toastr.error('Something Went Wrong')
          }
        }
        }
      )
    }
    if(this.classificationType =='Menu Items'){
      this.menuItemService.GetMenuItemsInLeafCategory(searchTerm).subscribe({
        next:async data=>{
          this.pagination = JSON.parse(data.headers.get('X-Pagination'));
          var viewData = await this.menuItemService.getLogicalMenuItemsInLeafCategory(data.body);
          this.items=viewData;
        },error: e=>{
          if(e.error.status==404){
            this.items=[];
          }
          if(e.error.status==500){
            this.toastr.error('Something Went Wrong')
          }
        }
      })
    }
  }
  setInputParameter(content,view: any){
    this.currentView = view == 1? "add" : "edit";
    if(this.currentView=='edit'){
      if(this.selectedCategories.length ==1){
        this.offcanvasService.open(content,{position:'end',backdrop:true,keyboard: false})
      }else{
        this.toastr.error('Select any category to edit');
      }
    }
    if(this.currentView == 'add'){
      this.nodeId = this.nodeIdforCategory;
      this.offcanvasService.open(content ,{position:'end',backdrop:true,keyboard: false} )
    }
    // if(this.currentView == "edit" && (this.nodeId=="00000000-0000-0000-0000-000000000000" || this.nodeId==undefined)){
    //   this.toastr.error('Select any category to edit');
    // }
  }
  opendeleteModal(deletecontact) {
    this.noDelete = false;
    if(this.selectedCategories.length ==1){
      for(var i=0;i< this.selectedCategories.length;i++){
        if(this.selectedCategories[0].children!=undefined && this.selectedCategories[0].children.length > 0){
          this.noDelete=true;
        }
      }
      if((this.levelId == this.childNode-2) || (this.levelId == null && this.childNode-2==0)){
        var searchTerm = "?hierarchyId=" + this.heirarchyId + "&nodeId=" +this.selectedCategories[0].id + "&Filters= " + this.search.searchData + "&PageNumber=" + this.search.pageNumber + "&PageSize=" + this.search.pageSize;
        if(this.classificationType == 'Items'){
          this.itemService.GetItemsInLeafCategory(searchTerm).subscribe({
            next: async data=>{
              if(data.body.length>0){
                this.noDelete=true;
              }
              if(this.noDelete){
                this.toastr.error('Can not delete Category with children.');
                return
              }
              if(!this.noDelete){
                this.open(deletecontact);
              }
            },error : async e=>{

            }
            }
          )
        }
        if(this.classificationType =='Menu Items'){
          this.menuItemService.GetMenuItemsInLeafCategory(searchTerm).subscribe({
            next:async data=>{
              if(data.body.length>0){
                this.noDelete=true;
              }
              if(this.noDelete){
                this.toastr.error('Can not delete Category with children.');
                return
              }
              if(!this.noDelete){
                this.open(deletecontact);
              }
            },error: e=>{

            }
          })
        }
      }else{
        if(this.noDelete){
          this.toastr.error('Can not delete Category with children.');
          return
        }
        if(!this.noDelete){
          this.open(deletecontact);
        }
      }

    }
    else{
      this.toastr.error('Select one Category to Delete');
    }
  }
  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
    }, (reason) => {
    });
  }
  DeleteHeirarchyCategory(catName){
    if(this.levelId == undefined || this.levelId == null){
      this.levelId = 1;
      this.categoryId = "00000000-0000-0000-0000-000000000000";
    }
    else{
      this.levelId = this.levelId + 1;
    }
    for (let i = 0; i < nodeCatList[nodeCatList.length - 1].node.children.length; i++) {
      if (nodeCatList[nodeCatList.length - 1].node.children[i].name == catName[0].name) {
        nodeCatList[nodeCatList.length - 1].node.children.splice(i,1);
        break;
      }
    }
    this.prevExpansionModel = this.treeControl.expansionModel.selected;
    this.heirarchyService.deleteMultipleHierarchyCategoriesById(this.heirarchyId,this.categoryId,this.levelId,[this.selectedCategories[0].id]).subscribe({
      next: (res) => {
        this.toastr.success('Hierarchy Category Successfully Deleted');
        
        this.heirarchyService.getHeirarchyById(this.heirarchyId).subscribe(res => {
          this.childNode = res.levels;
          this.classificationType = res.classificationType;
          this.mainHeirarchyName = res.name;
          this.mainHeirarchShow = 0;
          this.dataSource.data = res.hierarchyDocument?.nodes;
          for (let i = 0; i < this.prevExpansionModel.length; i++) {
            for (let j = 0; j < this.treeControl.dataNodes.length; j++) {
              if (this.treeControl.dataNodes[j].name == this.prevExpansionModel[i].name) {
                this.treeControl.expand(this.treeControl.dataNodes[j])
                break;
              }
            }
          }
        })
        this.modalService.dismissAll()
      },
      error: (err) => {
        this.toastr.error('Something went wrong');
        this.modalService.dismissAll();
      }
    })
  }
  showMainMore(){
    this.showMore=!this.showMore;
    if(this.showMore===false){
      this.ngOnInit();
      this.catagoryList=[]
    }else{
      this.catagoryList=this.dataSource.data
    }
    this.nodeId = "00000000-0000-0000-0000-000000000000";
    this.levelId = null;
    if(this.childNode !=1){
      this.isLeafNode=false;
    }
  }
  ApplyFilter(event) {
    event.searchData = event.searchData;
    var searchEvent = event;
    this.getAllLogicalContacts(searchEvent);
  }
  getAllLogicalContacts(search) {
    var searchTerm = "?hierarchyId=" + this.heirarchyId + "&nodeId=" +this.currentNode + "&Filters= " + search.searchData + "&PageNumber=" + search.pageNumber + "&PageSize=" + search.pageSize;
    if(this.classificationType=='Items'){
      this.itemService.GetItemsInLeafCategory(searchTerm).subscribe(async data => {
        this.pagination = JSON.parse(data.headers.get('X-Pagination'));
        let viewData = await this.itemService.getLogicalItemsInLeafCategory(data.body);
        this.items = viewData;
      });
    }else{
      this.menuItemService.GetMenuItemsInLeafCategory(searchTerm).subscribe(async data => {
        this.pagination = JSON.parse(data.headers.get('X-Pagination'));
        let viewData = await this.menuItemService.getLogicalMenuItemsInLeafCategory(data.body);
        this.items = viewData;
      });
    }
  }

  async OnAddItems(event){
    this.pagination = JSON.parse(event.headers.get('X-Pagination'));
    let data=event.body;
    var viewData = await this.itemService.getLogicalItemsInLeafCategory(data);
    this.items=viewData;
  }
  addCatToTree(event) {
    let newNode={
      id:event.form.id,
      node_id:event.node_id,
      name:event.form.name,
      status:event.form.status,
      sequence:nodeCatList[nodeCatList.length - 1].node.children.length+1,
      children:event.form.children
    }

    if (event.isAdding) {
      nodeCatList[nodeCatList.length - 1].node.children.push(newNode)
    } else {
      for (let i = 0; i < nodeCatList[nodeCatList.length - 1].node.children.length; i++) {
        if (nodeCatList[nodeCatList.length - 1].node.children[i].id == event.form.id) {
          nodeCatList[nodeCatList.length - 1].node.children[i] = newNode;
        }
      }
    }
    this.prevExpansionModel=this.treeControl.expansionModel.selected;
    this.heirarchyService.getHeirarchyById(this.heirarchyId).subscribe(res => {
      this.childNode = res.levels;
      this.classificationType = res.classificationType;
      this.mainHeirarchyName = res.name;
      this.mainHeirarchShow = 0;
      this.dataSource.data = res.hierarchyDocument?.nodes;
      for(let i=0;i<this.prevExpansionModel.length;i++){
        for(let j=0;j<this.treeControl.dataNodes.length;j++){
          if(this.treeControl.dataNodes[j].name==this.prevExpansionModel[i].name){
            this.treeControl.expand(this.treeControl.dataNodes[j])
            break;
          }
        }
      }
    })

  }
}
