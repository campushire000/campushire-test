import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomizerSettingsService {

  private isDarkTheme = new BehaviorSubject<boolean>(false);
  isDarkTheme$ = this.isDarkTheme.asObservable();

  private isRtlEnabled = new BehaviorSubject<boolean>(false);
  isRtlEnabled$ = this.isRtlEnabled.asObservable();

  constructor() {
    document.body.classList.add('light-theme');
    document.body.classList.add('ltr-enabled');
  }

  toggleTheme() {
    this.isDarkTheme.next(!this.isDarkTheme.value);
    if (this.isDarkTheme.value) {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
  }

  isDark() {
    return this.isDarkTheme.value;
  }

  toggleRTLEnabledTheme() {
    this.isRtlEnabled.next(!this.isRtlEnabled.value);
    if (this.isRtlEnabled.value) {
      document.body.classList.add('rtl-enabled');
      document.body.classList.remove('ltr-enabled');
    } else {
      document.body.classList.add('ltr-enabled');
      document.body.classList.remove('rtl-enabled');
    }
  }

  isRTLEnabled() {
    return this.isRtlEnabled.value;
  }

  // Card Border
  private isCardBorderTheme = new BehaviorSubject<boolean>(false);
  isCardBorderTheme$ = this.isCardBorderTheme.asObservable();

  toggleCardBorderTheme() {
    this.isCardBorderTheme.next(!this.isCardBorderTheme.value);
    document.body.classList.toggle('card-borderd-theme');
  }

  isCardBorder() {
    return this.isCardBorderTheme.value;
  }

  // Card Border Radius
  private isCardBorderRadiusTheme = new BehaviorSubject<boolean>(false);
  isCardBorderRadiusTheme$ = this.isCardBorderRadiusTheme.asObservable();

  toggleCardBorderRadiusTheme() {
    this.isCardBorderRadiusTheme.next(!this.isCardBorderRadiusTheme.value);
    document.body.classList.toggle('card-border-radius-theme');
  }

  isCardBorderRadius() {
    return this.isCardBorderRadiusTheme.value;
  }

  // Right Sidebar
  private isRightSidebarTheme = new BehaviorSubject<boolean>(false);
  isRightSidebarTheme$ = this.isRightSidebarTheme.asObservable();

  toggleRightSidebarTheme() {
    this.isRightSidebarTheme.next(!this.isRightSidebarTheme.value);
    document.body.classList.toggle('right-sidebar-enabled');
  }

  isRightSidebar() {
    return this.isRightSidebarTheme.value;
  }

  // Hide Sidebar
  private isHideSidebarTheme = new BehaviorSubject<boolean>(false);
  isHideSidebarTheme$ = this.isHideSidebarTheme.asObservable();

  toggleHideSidebarTheme() {
    this.isHideSidebarTheme.next(!this.isHideSidebarTheme.value);
    document.body.classList.toggle('hide-sidebar-enabled');
  }

  isHideSidebar() {
    return this.isHideSidebarTheme.value;
  }

  // Header Dark
  private isHeaderDarkTheme = new BehaviorSubject<boolean>(false);
  isHeaderDarkTheme$ = this.isHeaderDarkTheme.asObservable();

  toggleHeaderTheme() {
    this.isHeaderDarkTheme.next(!this.isHeaderDarkTheme.value);
    document.body.classList.toggle('header-dark-theme');
  }

  isHeaderDark() {
    return this.isHeaderDarkTheme.value;
  }

  // Sidebar Dark
  private isSidebarDarkTheme = new BehaviorSubject<boolean>(false);
  isSidebarDarkTheme$ = this.isSidebarDarkTheme.asObservable();

  toggleSidebarTheme() {
    this.isSidebarDarkTheme.next(!this.isSidebarDarkTheme.value);
    document.body.classList.toggle('sidebar-dark-theme');
  }

  isSidebarDark() {
    return this.isSidebarDarkTheme.value;
  }
}
