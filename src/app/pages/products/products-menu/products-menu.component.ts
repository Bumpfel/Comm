import { Component, OnInit } from '@angular/core';
import { ProductCategory } from '../../../interfaces/product';

@Component({
  selector: 'app-products-menu',
  templateUrl: './products-menu.component.html',
  styleUrls: ['./products-menu.component.css']
})
export class ProductsMenuComponent implements OnInit {

  categories: ProductCategory[] = new Array(); // mock

  constructor() { }

  ngOnInit() {

    this.categories.push({ id: 1,  name: "Graphics cards" })
    this.categories.push({ id: 2,  name: "Computers" })
  }

}
