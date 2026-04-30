import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ContentService } from 'src/services/contentService';

@Injectable()
export abstract class BaseContentComponent implements OnDestroy {
  public content: any;
  protected contentSub: Subscription = Subscription.EMPTY;
  private destroyed = false;

  constructor(protected contentService: ContentService) {}

  /**
   * Initialize content subscription for the given section name
   * Call this method in ngOnInit() of child components
   */
  protected initContent(sectionName: string, onContentReceived?: (content: any) => void): void {
    this.contentSub = this.contentService.watchContent(sectionName).subscribe(c => {
      if (c) {
        setTimeout(() => {
          if (this.destroyed) {
            return;
          }
          this.content = c;
          if (onContentReceived) {
            onContentReceived(c);
          }
        }, 0);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    if (this.contentSub && !this.contentSub.closed) {
      this.contentSub.unsubscribe();
    }
  }
}
