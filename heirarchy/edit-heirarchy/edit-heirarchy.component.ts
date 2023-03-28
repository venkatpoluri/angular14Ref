import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-edit-heirarchy',
  templateUrl: './edit-heirarchy.component.html',
  styleUrls: ['./edit-heirarchy.component.scss']
})
export class EditHeirarchyComponent implements OnInit {
  currentView: string = 'edit';
  heirarchyId: string
  constructor(private router : Router,private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.heirarchyId = params['heirarchyId'];
      }
    );
    
  }

}
