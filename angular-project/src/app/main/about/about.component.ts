import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // 
import { TranslateModule } from '@ngx-translate/core'; 
import { ContentService } from '../../../services/contentService'; 
import { BaseContentComponent } from '../../base-content.component';

const SECTION_NAME = 'aboutme_section';

@Component({
    selector: 'app-about',
    imports: [
        CommonModule,
        TranslateModule
    ],
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss']
})
export class AboutComponent extends BaseContentComponent implements OnInit {
  
  constructor(
    contentService: ContentService
  ) {
    super(contentService);
  }
  
  ngOnInit(): void {
    this.initContent(SECTION_NAME);
  }  

  xpYears: number = new Date().getFullYear() - 2020;
}