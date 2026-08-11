import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  // =========================
  // DỮ LIỆU DASHBOARD
  // =========================

  totalProducts: number = 0;

  totalOrders: number = 0;

  totalUsers: number = 0;

  totalRevenue: number = 0;

  constructor() { 
    this.loadDashboardData();
  }


  // =========================
  // KHỞI TẠO
  // =========================

  ngOnInit(): void {
    // this.loadDashboardData();
  }


  // =========================
  // ĐỌC DỮ LIỆU
  // =========================

  loadDashboardData(): void {

    // -------------------------
    // 1. TỔNG SẢN PHẨM
    // -------------------------

    const productsData =
      localStorage.getItem('shop_fbi_products');

    if (productsData) {

      try {

        const products = JSON.parse(productsData);

        this.totalProducts = Array.isArray(products)
          ? products.length
          : 0;

      } catch (error) {

        console.error(
          'Lỗi đọc sản phẩm:',
          error
        );

        this.totalProducts = 0;
      }

    } else {

      this.totalProducts = 0;
    }


    // -------------------------
    // 2. TỔNG ĐƠN HÀNG
    // -------------------------

    const ordersData =
      localStorage.getItem('shop_fbi_orders');

    let orders: any[] = [];

    if (ordersData) {

      try {

        const parsedOrders = JSON.parse(ordersData);

        orders = Array.isArray(parsedOrders)
          ? parsedOrders
          : [];

      } catch (error) {

        console.error(
          'Lỗi đọc đơn hàng:',
          error
        );

        orders = [];
      }
    }

    this.totalOrders = orders.length;


    // -------------------------
    // 3. TỔNG NGƯỜI DÙNG
    // -------------------------

    const usersData =
      localStorage.getItem('shop_fbi_users');

    if (usersData) {

      try {

        const users = JSON.parse(usersData);

        this.totalUsers = Array.isArray(users)
          ? users.length
          : 0;

      } catch (error) {

        console.error(
          'Lỗi đọc người dùng:',
          error
        );

        this.totalUsers = 0;
      }

    } else {

      this.totalUsers = 0;
    }


    // -------------------------
    // 4. DOANH THU
    // -------------------------

    this.totalRevenue = orders.reduce(
      (sum: number, order: any) => {

        const amount = Number(
          order.totalPrice ??
          order.total ??
          order.amount ??
          0
        );

        return sum + amount;

      },
      0
    );

  }


  // =========================
  // TỰ ĐỘNG CẬP NHẬT
  // =========================

  @HostListener('window:ordersUpdated')
  onOrdersUpdated(): void {

    this.loadDashboardData();

  }


  @HostListener('window:productsUpdated')
  onProductsUpdated(): void {

    this.loadDashboardData();

  }


  @HostListener('window:usersUpdated')
  onUsersUpdated(): void {

    this.loadDashboardData();

  }

}