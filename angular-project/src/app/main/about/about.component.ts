import { Component, inject } from '@angular/core';
import { ContentService } from '../../../services/contentService';

const SECTION_NAME = 'about';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {
  readonly content = inject(ContentService).contentSignal(SECTION_NAME);
  readonly xpYears: number = new Date().getFullYear() - 2020;
}
