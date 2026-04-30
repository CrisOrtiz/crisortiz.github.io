import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import Typed from 'typed.js';
import { typeoptions } from '../constant';
import { ContentService } from '../../../services/contentService';
import { BaseContentComponent } from '../../base-content.component';
import { TranslateModule } from '@ngx-translate/core';

const SECTION_NAME = 'home_section';

@Component({
    selector: 'app-home',
    imports: [
        CommonModule,
        TranslateModule
    ],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent extends BaseContentComponent implements OnInit, OnDestroy {
  xpYears: number = new Date().getFullYear() - 2020;
  private typedInstance?: Typed;

  constructor(
    contentService: ContentService
  ) {
    super(contentService);
  }

  ngOnInit(): void {
    this.initContent(SECTION_NAME, (content: any) => {
      this.initTypedWithContent(content);
    });
  }

  private initTypedWithContent(content: any) {
    // destroy previous instance to avoid duplicates/leaks
    if (this.typedInstance) {
      try { this.typedInstance.destroy(); } catch {}
      this.typedInstance = undefined;
    }

    const typedTarget = document.querySelector('.typed-element');
    if (!typedTarget) {
      // View may not be rendered yet when content arrives.
      return;
    }

    const strings = content?.typedStrings?.length ? content.typedStrings : typeoptions.strings;
    this.typedInstance = new Typed(typedTarget as HTMLElement, { ...typeoptions, strings });
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    if (this.typedInstance) {
      try { this.typedInstance.destroy(); } catch {}
    }
  }
}
