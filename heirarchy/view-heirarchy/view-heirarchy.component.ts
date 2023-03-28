import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-view-heirarchy',
  templateUrl: './view-heirarchy.component.html',
  styleUrls: ['./view-heirarchy.component.scss']
})
export class ViewHeirarchyComponent implements OnInit {
  constructor(private router : Router,private route: ActivatedRoute) { }
  links:any;
  heirarchyId: string
  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.heirarchyId = params['heirarchyId'];
      }
    );
    this.links = [
      { title: 'Info', fragment: '/heirarchy/view/'+this.heirarchyId+'/info'  },
      { title: 'Categories', fragment: '/heirarchy/view/'+this.heirarchyId+'/categories' },
    ];
  }


}
