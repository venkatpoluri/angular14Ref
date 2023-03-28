import { Component, OnInit } from '@angular/core';
import { Tenant } from './models/tenant';
import { LocalStorageService } from './services/local-storage.service';
import { SharedEventService } from './services/shared-event.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'RSI2';

  constructor(private localStorageService:LocalStorageService, private sharedEvent:SharedEventService){}
  tenant$ = this.localStorageService.tenantData$;
  tenant: Tenant;

  ngOnInit(){
    this.localStorageService.loadTenant();
    this.tenant$.subscribe(tenant => {
      this.tenant = tenant;
      switch(this.tenant.region){
        case 'MEXICO':
          return this.sharedEvent.dateBasedOnRegion.emit('dd/MM/yyyy');
        case 'CANADA':
          return this.sharedEvent.dateBasedOnRegion.emit('MM/dd/yyyy');
        default:
          return this.sharedEvent.dateBasedOnRegion.emit('MM/dd/yyyy');
      }
    });
  }

}
