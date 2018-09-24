import { Component, OnInit } from '@angular/core';
import { Product } from '../../../interfaces/product';
import { ActivatedRoute } from '../../../../../node_modules/@angular/router';

@Component({
  selector: 'app-products-overview',
  templateUrl: './products-overview.component.html',
  styleUrls: ['./products-overview.component.css']
})

export class ProductsOverviewComponent implements OnInit {

  allProducts: Product[] = new Array(); // mock
  products: Product[] = new Array(); // mock

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    // Mock
    this.allProducts.push({ id: 1, parentId: 1, name: "ASUS GeForce GTX 1080 Ti", imgUrl: "https://firebasestorage.googleapis.com/v0/b/comm-ca912.appspot.com/o/products%2Fasus-gf1080ti.jpg?alt=media&token=925e5921-35d8-47fb-b963-e5e94d538b94" });
    this.allProducts.push({ id: 2, parentId: 1, name: "MSI GeForce GTX 1070 Ti", imgUrl: "https://firebasestorage.googleapis.com/v0/b/comm-ca912.appspot.com/o/products%2Fmsi-gf1070ti.jpg?alt=media&token=c8db6903-d8e8-45c7-af39-693acc0be51f" });
    this.allProducts.push({ id: 3, parentId: 1, name: "Gigabyte GeForce GTX 1060", imgUrl: "https://firebasestorage.googleapis.com/v0/b/comm-ca912.appspot.com/o/products%2Fgigabyte-gf1060.jpg?alt=media&token=db491564-5f94-46af-9479-fbf61a9a67bb" });
    this.allProducts.push({ id: 4, parentId: 1, name: "Gigabyte Radeon 570", imgUrl: "https://firebasestorage.googleapis.com/v0/b/comm-ca912.appspot.com/o/products%2Fgigabyte-rad570.jpg?alt=media&token=405fbe55-6be1-4c1e-906b-881304813bdc" });
    this.allProducts.push({ id: 4, parentId: 2, name: "Intel Q9550" });



    this.route.params.subscribe(params => {
      this.products = this.allProducts.filter(product => product.parentId == params["id"]);
    });

  }

}
