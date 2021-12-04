import { Component, OnInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(private elementRef: ElementRef) { }

  ngAfterViewInit() {
    const script = document.createElement('script');
    script.src = 'assets/script/auth.js'
    this.elementRef.nativeElement.appendChild(script);
  }

  ngOnInit(): void {
  }

}
