import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { shareReplay, take } from 'rxjs';
import { Tenant } from 'src/app/models/tenant';
import { CurrentUserService } from 'src/app/services/current-user-service';
import { HeirarchyService } from 'src/app/services/heirarchy.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { SharedEventService } from 'src/app/services/shared-event.service';

@Component({
  selector: 'app-info-heirarchy',
  templateUrl: './info-heirarchy.component.html',
  styleUrls: ['./info-heirarchy.component.scss']
})
export class InfoHeirarchyComponent implements OnInit {
  heirarchyId: string;
  constructor(private sharedService: SharedEventService,private heirarchyService: HeirarchyService, private toastr: ToastrService, private modalService: NgbModal,private currentUserService: CurrentUserService,private router : Router,private route:ActivatedRoute,private localStorageService: LocalStorageService,) { }
  tenant$ = this.localStorageService.tenantData$;
  tenant: Tenant;
  userCanDeleteElements = false;
  userCanAddNewElement = false;
  userCanEditElement = false;
  hierarchyName:string;
  currentView: string = 'view';
  ngOnInit(): void {
    this.heirarchyId = this.route.snapshot.parent.params['heirarchyId'];
    this.sharedService.hierarchyName.subscribe(res=>{
      this.hierarchyName = res;
    })
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
          }
        }
      });
    });
  }
  editHeirarchyItem(){
    this.router.navigate(['/heirarchy/edit/'+this.heirarchyId])
  }
  opendeleteModal(deletecontact) {
    this.open(deletecontact);
  }
  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
    }, (reason) => {
    });
  }
  DeleteHeirarchy(){
    this.heirarchyService.deleteHeirarchy([this.heirarchyId])
    .subscribe({
      next: (res) => {
        this.toastr.success('Hierarchy Successfully Deleted');
        this.router.navigate(['/all-heirarchy'])
        this.modalService.dismissAll()
      },
      error: (err) => {
        this.toastr.error('Something went wrong');
        this.modalService.dismissAll();
      }
    })
  }
  
}
