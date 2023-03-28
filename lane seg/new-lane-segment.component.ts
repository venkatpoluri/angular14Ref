import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { ItemService } from 'src/app/services/items-service/item.service';

@Component({
  selector: 'app-new-lane-segment',
  templateUrl: './new-lane-segment.component.html',
  styleUrls: ['./new-lane-segment.component.scss']
})
export class NewLaneSegmentComponent implements OnInit {

  newLaneSubject: Subject<void> = new Subject<void>();
  itemId;
  item:any = {};
  newLaneSegmentBeginDateHeader:Date;
  newLaneSegmentEndDateHeader:Date;
  newLaneSegmentType:string;
  newLaneSegmentPricingType:string;
  newLaneSegmentUOM:string;
  constructor(private itemService:ItemService, private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.route.parent.parent.params.subscribe(p => {
      this.itemId = p['itemId'];
    this.itemService.getItemById(this.itemId).subscribe(data => {
      this.item = data;
    });
  });
  }
  openNewLane() {
    this.newLaneSubject.next(null);
  }
}
