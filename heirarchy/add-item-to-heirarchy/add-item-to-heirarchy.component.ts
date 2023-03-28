import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { ItemService } from 'src/app/services/items-service/item.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MenuItemService } from 'src/app/services/items-service/menu-item.service';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-item-to-heirarchy',
  templateUrl: './add-item-to-heirarchy.component.html',
  styleUrls: ['./add-item-to-heirarchy.component.scss']
})
export class AddItemToHeirarchyComponent implements OnInit,OnChanges {
  @Input() nodeId;
  @Input() type;
  @Output() OnAddItem =new EventEmitter<object>();
  search: any = { searchData: "", pageNumber: 1, pageSize: 10, total: 0 };
  currentHeirarchy: string;
  items:any[];
  pagination: any;
  updateItemHeirarchy:any;
  isLoading=false;

  constructor(private itemService: ItemService,private route: ActivatedRoute, private toastr: ToastrService,private menuItemService: MenuItemService,private offcanvasService: NgbOffcanvas) { }

  ngOnInit(): void {
    this.currentHeirarchy=this.route.snapshot.parent.params['heirarchyId'];
    if(this.type=='Items'){
      this.getUncategorizedItems(this.search)
    }
    if(this.type =='Menu Items'){
      this.getUncategorizedMenuItems(this.search)
    }
  }

  ngOnChanges(){
  }

  ApplyFilter(event){
    var searchEvent = event;
    if(this.type=='Items'){
      this.getUncategorizedItems(searchEvent);
    }else if(this.type =='Menu Items'){
      this.getUncategorizedMenuItems(searchEvent);
    }
  }
  addItems(event){
    this.updateItemHeirarchy={
      hierarchyId:this.currentHeirarchy,
      nodeId:this.nodeId,
      ids:event
    }

  }
  closeCanvas(){
       this.offcanvasService.dismiss('Cross click');
      }
  getUncategorizedItems(search){
    this.isLoading=true;
    var searchTerm = "?hierarchyId=" + this.currentHeirarchy + "&Filters= " + search.searchData + "&PageNumber=" + search.pageNumber + "&PageSize=" + search.pageSize;
    this.itemService.getUncatagorizedItems(searchTerm).subscribe(async data=>{
      this.pagination = JSON.parse(data.headers.get('X-Pagination'));

      let viewData = await this.itemService.getLogicalUncategorizedItems(data.body)
      this.items=viewData;
      this.isLoading=false;
    })
  }
  getUncategorizedMenuItems(search){
    this.isLoading=true;
    var searchTerm = "?hierarchyId=" + this.currentHeirarchy + "&Filters= " + search.searchData + "&PageNumber=" + search.pageNumber + "&PageSize=" + search.pageSize;
    this.menuItemService.getUncatagorizedMenuItems(searchTerm).subscribe(async data=>{
      this.pagination = JSON.parse(data.headers.get('X-Pagination'));
      let viewData = await this.menuItemService.getLogicalUncategorizedMenuItems(data.body)
      this.items=viewData;
      this.isLoading=false;
    })
  }

  addItemHeirarchy(){
    var searchTerm = "?hierarchyId="+ this.currentHeirarchy +"&nodeId="+ this.nodeId+ "&Filters= " + ''+ "&PageNumber=" + 1 + "&PageSize=" +10;
    if(this.type=='Items'){
      this.itemService.CreateMultipleItemHierarchyAssociation(this.updateItemHeirarchy).subscribe({
        next:res=>{
          this.toastr.success('Items added succesfully');
          this.itemService.GetItemsInLeafCategory(searchTerm).subscribe(res=>{
            this.OnAddItem.emit(res);
            this.closeCanvas();
          })

        },error: async e=>{
          this.toastr.error('Something went wrong');
        }
      })
    }
    if(this.type =='Menu Items'){
      this.menuItemService.CreateMultipleMenuItemHierarchyAssociation(this.updateItemHeirarchy).subscribe({
        next:res=>{
          this.toastr.success('Menu Items added succesfully');
          this.menuItemService.GetMenuItemsInLeafCategory(searchTerm).subscribe(res=>{
            this.OnAddItem.emit(res);
            this.closeCanvas();
          })
        },error: e=>{
          this.toastr.error('Something went wrong');
        }
      })
    }
  }

}
