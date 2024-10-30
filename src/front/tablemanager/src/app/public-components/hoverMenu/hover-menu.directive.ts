import { Directive, ElementRef, HostListener } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';

@Directive({
  selector: '[appHoverMenu]'
})
export class HoverMenuDirective {
  private openTimeout: any;
  private closeTimeout: any;

  constructor(private trigger: MatMenuTrigger, private el: ElementRef) {}

  @HostListener('mouseenter') onMouseEnter() {
    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout);
    }
    this.openTimeout = setTimeout(() => this.trigger.openMenu(), 100);
  }

  @HostListener('mouseleave') onMouseLeave() {
    if (this.openTimeout) {
      clearTimeout(this.openTimeout);
    }
    this.closeTimeout = setTimeout(() => {
      if (!this.isMenuHovered()) {
        this.trigger.closeMenu();
      }
    }, 5000);
  }

  private isMenuHovered(): boolean {
    const menuElement = this.el.nativeElement.querySelector('.mat-menu-panel');
    return menuElement ? menuElement.matches(':hover') : false;
  }
}