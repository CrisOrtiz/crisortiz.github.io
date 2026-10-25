import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // 
import { TranslateModule } from '@ngx-translate/core'; 
import { ContentService } from '../../../services/contentService'; 
import { BaseContentComponent } from '../../base-content.component';
import { RevealDirective } from '../../shared/reveal.directive';
import { CountUpDirective } from '../../shared/count-up.directive';

const SECTION_NAME = 'about';

@Component({
    selector: 'app-about',
    imports: [
        CommonModule,
        TranslateModule,
        RevealDirective,
        CountUpDirective
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
    setTimeout(() => {
      this.initContent(SECTION_NAME);
    }, 0);
  }  

  xpYears: number = new Date().getFullYear() - 2020;
}