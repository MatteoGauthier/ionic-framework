import { LocationStrategy } from '@angular/common';
import { ElementRef, OnChanges, OnInit, Directive, HostListener, Input, Optional } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AnimationBuilder, RouterDirection } from '@ionic/core';

import { NavController } from '../../providers/nav-controller';

@Directive({
  selector: '[routerLink]',
})
export class RouterLinkDelegateDirective implements OnInit, OnChanges {
  @Input()
  routerDirection: RouterDirection = 'forward';

  @Input()
  routerAnimation?: AnimationBuilder;

  constructor(
    private locationStrategy: LocationStrategy,
    private navCtrl: NavController,
    private elementRef: ElementRef,
    private router: Router,
    @Optional() private routerLink?: RouterLink
  ) {}

  ngOnInit(): void {
    this.updateTargetUrlAndHref();
  }

  ngOnChanges(): void {
    this.updateTargetUrlAndHref();
  }

  private updateTargetUrlAndHref() {
    if (this.routerLink?.urlTree) {
      const href = this.locationStrategy.prepareExternalUrl(this.router.serializeUrl(this.routerLink.urlTree));
      this.elementRef.nativeElement.href = href;
    }
  }

  /**
   * @internal
   */
  @HostListener('click', ['$event'])
  onClick(ev: MouseEvent): void {
    if (ev.button === 0 && (ev.ctrlKey || ev.metaKey)) {
      /**
       * Ignore click events that include holding the meta (⌘) or ctrl key,
       * which open the page in a new tab.
       */
      return;
    }
    this.navCtrl.setDirection(this.routerDirection, undefined, undefined, this.routerAnimation);
    ev.preventDefault();
  }
}
