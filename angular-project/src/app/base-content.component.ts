import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ContentService } from 'src/services/contentService';

@Injectable()
export abstract class BaseContentComponent implements OnDestroy {
  public content: any;
  protected contentSub: Subscription = Subscription.EMPTY;

  constructor(protected contentService: ContentService) {}

  /**
   * Initialize content subscription for the given section name
   * Call this method in ngOnInit() of child components
   */
  protected initContent(sectionName: string, onContentReceived?: (content: any) => void): void {
    this.contentSub = this.contentService.watchContent(sectionName).subscribe(c => {
      if (c) {
        this.content = c;
        if (onContentReceived) {
          onContentReceived(c);
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.contentSub && !this.contentSub.closed) {
      this.contentSub.unsubscribe();
    }
  }
}
