import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-heirarchy',
  templateUrl: './add-heirarchy.component.html',
  styleUrls: ['./add-heirarchy.component.scss']
})
export class AddHeirarchyComponent implements OnInit {
  currentView: string = 'add';
  constructor() { }
  
  ngOnInit(): void {
  }

}
