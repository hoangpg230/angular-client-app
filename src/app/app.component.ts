import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from './core/services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(
    private router: Router
  ) { }

  @HostListener('document:click', ['$event'])
  public handleClick(event: Event): void {
    if (event.target instanceof HTMLAnchorElement) {
      const element = event.target as HTMLAnchorElement;
      if (element.className.indexOf('routerlink')) {
        event.preventDefault();
        const route = element?.getAttribute('href');
        if (route) {
          this.router.navigate([`/${route}`]);
        }
      }
    }
  }

  
  ngOnInit() {
    
  }
}
