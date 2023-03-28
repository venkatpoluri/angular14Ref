import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NodeHierarchy } from 'src/app/models/Node';
import { HeirarchyService } from 'src/app/services/heirarchy.service';
import * as uuid from 'uuid';

@Component({
  selector: 'app-new-category',
  templateUrl: './new-category.component.html',
  styleUrls: ['./new-category.component.scss']
})
export class NewCategoryComponent implements OnInit, OnChanges {
  @ViewChild('errorModal', { static: false }) private errorModal;
  @Input() currentView: string;

  @Input() heirarchyId: string;
  @Input() levelId: number;
  @Input() nodeId: string;
  @Input() categoryName: string;

  @Input() nodeIds: any[];
  createErrors:any[];

  @Output() heirarchyCat=new EventEmitter();

  CategoryHeading: string;
  AddUpdateButton: string;
  constructor(private modalService: NgbModal,private heirarchyService: HeirarchyService,private toastr: ToastrService,private offcanvasService: NgbOffcanvas) { }
  heirarchyCategoryForm: NodeHierarchy = {
    id: '',
    name: '',
    status: 'Active',
    children:[]
  };

  ngOnInit(): void {

  }
  ngOnChanges() {
    this.CategoryHeading = this.currentView == "add" ? "Add New Category" : "Edit Category";
    this.AddUpdateButton = this.currentView == "add" ? "Add" : "Update";
    this.heirarchyCategoryForm.name = this.currentView == "add" ? "" : this.categoryName;
    this.heirarchyCategoryForm.id = this.currentView == "add" ? uuid.v4() : this.nodeId;
}
  onSubmit(form: any){
    if (this.heirarchyCategoryForm.name == '' || this.heirarchyCategoryForm.name == undefined) {
      return
    }
    if(this.levelId == undefined || this.levelId == null){
      this.levelId = 1;
    }
    else if(this.levelId == 1){
      this.levelId = 2;
    }
    this.nodeId = this.levelId == 1 ? "00000000-0000-0000-0000-000000000000" : this.nodeId;
    this.heirarchyService.createHierarchyCategories(this.heirarchyId,this.nodeId,this.levelId,this.heirarchyCategoryForm).subscribe({
      next: res =>{
        this.toastr.success("Hierarchy Category has been added successfully.");
        this.heirarchyCat.emit({form:this.heirarchyCategoryForm, isAdding:true, node_id:this.nodeId, level_id:this.levelId});
        this.closeCanvas();
      },
      error: e =>{
        this.createErrors=[]
        if (e.error.status == 500) {
          this.createErrors.push("Sorry an error occurred processing your request");
        } else {
          this.createErrors.push(e.error?.errors['Name']);
          this.createErrors.push(e.error?.errors['ConceptId']);
        }
        this.modalService.open(this.errorModal);
      }

    })
  }
  editCategory(form: any){
    if (this.heirarchyCategoryForm.name == '' || this.heirarchyCategoryForm.name == undefined) {
      return
    }
    this.heirarchyService.updateHierarchyCategoryById(this.heirarchyId,this.nodeId,this.heirarchyCategoryForm).subscribe({
      next: res =>{
        this.toastr.success("Hierarchy Category has been updated successfully.");
        this.heirarchyCat.emit({form:this.heirarchyCategoryForm, isAdding:false, node_id:this.nodeId, level_id:this.levelId});
        this.closeCanvas();

      },
      error: e =>{
        this.createErrors=[]
        if (e.error.status == 500) {
          this.createErrors.push("Sorry an error occurred processing your request");
        } else {
          this.createErrors.push(e.error?.errors['Name']);
          this.createErrors.push(e.error?.errors['ConceptId']);
        }
        this.modalService.open(this.errorModal);
      }

    })
  }

  closeCanvas() {
    this.offcanvasService.dismiss('Cross click');
  }

  windowReload(){
    window.location.reload();
  }
}
