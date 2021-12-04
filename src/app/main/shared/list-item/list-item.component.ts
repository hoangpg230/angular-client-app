import { Component, Input, OnInit } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';
import { UtilityService } from 'src/app/core/services/utility.service';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.css']
})
export class ListItemComponent implements OnInit {

  constructor(
    private dataService: DataService,
    private utilityService: UtilityService
  ) { }

  filter: string = ''

  arrayPage: any[] = []
  perPage: number = 5
  currentPage: number = 1
  start: number = 0
  end: number = 0
  toTalPages: number = 0

  setTime: any

  @Input() products: any = []

  priceSale(price: number, percent: number) {
    return this.utilityService.priceSale(price, percent)
  }

  ngOnChanges() {
    let time = (() => {
      setTimeout(() => {
        this.toTalPages = Math.ceil(this.products.length / this.perPage)
        this.renderPage(this.toTalPages)
      }, 100)
    })()
    this.setTime = time
  }

  ngDoCheck() {
    if (this.products.length > 0 && this.setTime) {
      clearTimeout(this.setTime)
      this.setTime = null
    }
  }

  ngOnInit(): void {
    this.end = this.perPage
  }

  handleFilter(value: string) {
    if (this.filter == value) {
      return
    }
    this.filter = value
    switch (value) {
      case 'Phổ biến':
        this.products = [...this.sortProducts('views', -1)]
        break
      case 'Mới nhất':
        this.products = [...this.sortProducts('productId', -1)]
        break
      case 'Bán chạy':
        this.products = [...this.sortProducts('sold', -1)]
        break
      case 'asc':
        this.products = [...this.sortProducts('price', 1)]
        break
      case 'desc':
        this.products = [...this.sortProducts('price', -1)]
        break
      default:
    }
    this.handlePageChange(false, 1)
    this.renderPage(this.toTalPages)

  }

  sortProducts(type: string, sortBy: number) {
    return this.products.sort((a: any, b: any) => {
      if (a[type] > b[type]) return sortBy
      return sortBy * -1
    })
  }


  renderPage(pages: any) {
    let dotsInitial = '...'
    let dotsLeft = '... '
    let dotsRight = ' ...'
    this.arrayPage = [1]
    for (let i = 2; i <= pages; i++) {
      this.arrayPage.push(i)
    }

    if (pages < 6) {
      this.arrayPage = [...this.arrayPage]
    }

    else if (this.currentPage >= 1 && this.currentPage <= 3) {
      this.arrayPage = [1, 2, 3, 4, dotsInitial, pages]
    }

    else if (this.currentPage >= 4 && this.currentPage < pages - 2) {
      const sliced1 = this.arrayPage.slice(this.currentPage - 2, this.currentPage)
      const sliced2 = this.arrayPage.slice(this.currentPage, this.currentPage + 1)
      this.arrayPage = [1, dotsLeft, ...sliced1, ...sliced2, dotsRight, pages]

    }
    else if (this.currentPage > pages - 3) {
      const sliced = this.arrayPage.slice(pages - 4)
      this.arrayPage = [1, dotsLeft, ...sliced]
    }
  }

  getCurrentPage(currentPage: any) {
    this.start = (currentPage - 1) * this.perPage;
    this.end = currentPage * this.perPage

  }

  handlePageChange(e: any, page: any) {
    if (page == 0 || page > this.toTalPages) {
      return
    }
    if (e) {
      e.preventDefault()
    }
    this.currentPage = page
    this.getCurrentPage(page)

    this.renderPage(this.toTalPages)
  }
}
