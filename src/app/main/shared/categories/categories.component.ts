import { Component, HostListener, OnInit } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  constructor(
    private router: Router,
    
    private dataService: DataService,
  ) { }
  currentRoute = this.router.url
  ngOnInit(): void {
    this.getAll()
    if(this.router.url.includes('/all')) {
      localStorage.setItem("id-category", JSON.stringify([]))
    }
  }

  getAll() {
    this.dataService.GET("api/category/getAll").subscribe(this.dynamicMenu)
  }

  dynamicMenu(response: any) {
    response.forEach((val: any) => {
      val.children = []
      response.forEach((val1: any) => {
        if (val.categoryId == val1.parentId) {
          val.children.push(val1)
        }
      })
    })
    var menus = response.filter((e: any) => { return e.parentId == 0 });

    function buildMenu(parent: any, items: any) {
      items.forEach((e: any) => {
        var li = `<a href="/danh-muc/${e.slug}" class="shop-search-page__menu-link routerlink data-${e.categoryId}" data-id=${e.categoryId}>
                    ${e.name}
                  </a>`;
        if (e.children && e.children.length > 0) {
          li = `<a href="/danh-muc/${e.slug}" class="shop-search-page__menu-link routerlink data-${e.categoryId}" data-id=${e.categoryId}>
                    ${e.name}
                    <i class="fas fa-chevron-right routerlink"></i>
                </a>`;
        }
        var temp = document.createElement('li');
        temp.classList.add('shop-search-page__menu-item')
        temp.innerHTML = li;
        parent.appendChild(temp);

        if (e.children && e.children.length > 0) {
          var ul = document.createElement('ul')
          ul.classList.add('shop-search-page__menu-list', 'sub-nav');
          temp.appendChild(ul);
          buildMenu(ul, e.children);
        }
      })
    }
    buildMenu(document.querySelector('.shop-search-page__menu-list'), menus)
    let $: any = document.querySelector.bind(document)
    let listActive = JSON.parse(localStorage.getItem('id-category') as string) || []

    if (listActive.every((e: any) => e != null)) {
      listActive.forEach((val: any) => {
        $(`.data-${val}`).classList.add('active')
      })
    }
  }

  handleActiveLink(e: any) {

    let element = e.target
    let listActive = []
    if (element.classList.contains('all')) {
      localStorage.setItem("id-category", JSON.stringify([]))
      return

    }
    if (element.matches('.shop-search-page__menu-link')) {
      listActive.push(element.dataset.id)
      while (element.parentElement) {
        if (element.parentElement.matches('.shop-search-page__menu-item')) {
          listActive.push(element.parentElement.querySelector('.shop-search-page__menu-link').dataset.id)
        }
        element = element.parentElement
      }
      localStorage.setItem("id-category", JSON.stringify(listActive))
    }

  }

  ngDestroy() {
    localStorage.setItem("id-category", JSON.stringify([]))
  }

}
