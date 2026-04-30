import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import Typed from 'typed.js';
import { typeoptions } from '../constant';
import { ContentService } from '../../../services/contentService';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

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
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  xpYears: number = new Date().getFullYear() - 2020;
  homeContent$!: Observable<any>;
  private typedInstance?: Typed;
  private typedSub: Subscription = Subscription.EMPTY;

  constructor(
    private contentService: ContentService
  ) {}

  ngOnInit(): void {
    this.homeContent$ = this.contentService.watchContent(SECTION_NAME).pipe(
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }

  ngAfterViewInit(): void {
    this.typedSub = this.homeContent$.subscribe((content: any) => {
      // Allow async-pipe render to flush before querying typed target.
      setTimeout(() => this.initTypedWithContent(content), 0);
    });
  }

  private initTypedWithContent(content: any, attempts = 0) {
    // destroy previous instance to avoid duplicates/leaks
    if (this.typedInstance) {
      try { this.typedInstance.destroy(); } catch {}
      this.typedInstance = undefined;
    }

    const typedTarget = document.querySelector('.typed-element');
    if (!typedTarget) {
      // Retry once on the next tick if the element was not rendered yet.
      if (attempts < 1) {
        setTimeout(() => this.initTypedWithContent(content, attempts + 1), 0);
      }
      return;
    }

    const strings = content?.typedStrings?.length ? content.typedStrings : typeoptions.strings;
    this.typedInstance = new Typed(typedTarget as HTMLElement, { ...typeoptions, strings });
  }

  ngOnDestroy(): void {
    if (this.typedSub && !this.typedSub.closed) {
      this.typedSub.unsubscribe();
    }
    if (this.typedInstance) {
      try { this.typedInstance.destroy(); } catch {}
    }
  }
}
