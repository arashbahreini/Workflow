import { Component, OnInit } from '@angular/core';
import { CommonServicesService } from '../services/common-services.service';

@Component({
  selector: 'app-rule-engine',
  templateUrl: './rule-engine.component.html',
  styleUrls: ['./rule-engine.component.css']
})
export class RuleEngineComponent implements OnInit {

  public menus: any[] = [];
  constructor(
    private commonService: CommonServicesService
  ) {
    this.menus = [];
  }

  ngOnInit() {
    this.getCartableTypes();
  }

  getCartableTypes() {
    this.commonService.getCartableTypes().forEach(element => {
      this.menus.push({
        name: element.persianName,
        url: element.name.toLowerCase(),
        id: element.id
      })
    });
  }
}
