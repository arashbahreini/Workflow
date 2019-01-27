import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { BasicInformationService } from './services/basic-information.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public menus: any[] = [];
  public hasRole: boolean = null;
  public hideHeader: boolean;
  public isSinglePageLog: boolean;

  constructor(
    private titleService: Title,
    private location: Location,
    private basicInformationService: BasicInformationService,
    private router: Router) {
    this.menus = [
      { name: 'داشبورد', url: 'dashboard' },
      { name: 'مدیریت اجرای فرایند', url: 'manager' },
      { name: 'تنظیم کردن فرایند', url: 'designer' },
      { name: 'گزارش', url: 'log' },
      { name: 'موتور قوانین', url: 'rule-engine' },
    ];
    this.hideHeader = location.path().includes('single-workflow-log');
    this.isSinglePageLog = location.path().includes('single-workflow-log');
    this.titleService.setTitle('مدیریت فرایند ها');
  }

  ngOnInit() {
  }
}
