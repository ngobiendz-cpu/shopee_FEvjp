import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {

  // =========================================
  // DANH SÁCH ĐƠN HÀNG
  // =========================================

  orders: any[] = [];


  // =========================================
  // PHÂN TRANG
  // =========================================

  currentPage: number = 1;

  pageSize: number = 5;


  // =========================================
  // ĐƠN HÀNG ĐANG XEM CHI TIẾT
  // =========================================

  selectedOrder: any = null;

  showDetail: boolean = false;


  // =========================================
  // KHỞI TẠO
  // =========================================

  ngOnInit(): void {

    this.loadOrders();

  }


  // =========================================
  // LẤY ĐƠN HÀNG TỪ LOCAL STORAGE
  // =========================================

  loadOrders(): void {

    const data =
      localStorage.getItem('shop_fbi_orders');


    if (data) {

      try {

        this.orders = JSON.parse(data);

      } catch (error) {

        console.error(
          'Lỗi đọc đơn hàng:',
          error
        );

        this.orders = [];

      }

    } else {

      this.orders = [];

    }

    console.log(
      'Danh sách đơn hàng:',
      this.orders
    );

  }


  // =========================================
  // PHÂN TRANG
  // =========================================

  get totalPages(): number {

    return Math.ceil(
      this.orders.length / this.pageSize
    );

  }


  get pagedOrders(): any[] {

    const startIndex =
      (this.currentPage - 1) *
      this.pageSize;

    const endIndex =
      startIndex + this.pageSize;

    return this.orders.slice(
      startIndex,
      endIndex
    );

  }


  get pageNumbers(): number[] {

    return Array.from(
      {
        length: this.totalPages
      },
      (_, index) => index + 1
    );

  }


  changePage(page: number): void {

    if (page < 1) {
      return;
    }

    if (page > this.totalPages) {
      return;
    }

    this.currentPage = page;

  }


  // =========================================
  // XEM CHI TIẾT ĐƠN HÀNG
  // =========================================

  viewOrderDetail(order: any): void {

    this.selectedOrder = order;

    this.showDetail = true;

  }


  // =========================================
  // ĐÓNG CHI TIẾT
  // =========================================

  closeOrderDetail(): void {

    this.showDetail = false;

    this.selectedOrder = null;

  }


  // =========================================
  // LẤY DANH SÁCH SẢN PHẨM TRONG ĐƠN
  // =========================================

  getOrderItems(order: any): any[] {

    if (!order) {
      return [];
    }


    if (Array.isArray(order.items)) {

      return order.items;

    }


    if (Array.isArray(order.products)) {

      return order.products;

    }


    return [];

  }


  // =========================================
  // LẤY TÊN SẢN PHẨM
  // =========================================

  getItemName(item: any): string {

    return (
      item?.name ||
      item?.product?.name ||
      'Sản phẩm'
    );

  }


  // =========================================
  // LẤY HÌNH ẢNH
  // =========================================

  getItemImage(item: any): string {

    return (
      item?.image ||
      item?.product?.image ||
      ''
    );

  }


  // =========================================
  // LẤY SỐ LƯỢNG
  // =========================================

  getItemQuantity(item: any): number {

    return (
      Number(item?.quantity) ||
      1
    );

  }


  // =========================================
  // LẤY GIÁ SẢN PHẨM
  // =========================================

  getItemPrice(item: any): number {

    return Number(
      item?.price ??
      item?.product?.price ??
      0
    );

  }


  // =========================================
  // XÁC NHẬN ĐƠN HÀNG
  // =========================================

  confirmOrder(): void {

    if (!this.selectedOrder) {
      return;
    }


    if (
      this.selectedOrder.status ===
      'Đã xác nhận'
    ) {

      alert(
        'Đơn hàng này đã được xác nhận rồi!'
      );

      return;

    }


    const confirmed = confirm(
      `Bạn có chắc muốn xác nhận đơn hàng #${this.selectedOrder.orderCode}?`
    );


    if (!confirmed) {
      return;
    }


    // Đổi trạng thái

    this.selectedOrder.status =
      'Đã xác nhận';


    // Tìm đơn thật trong mảng

    const index =
      this.orders.findIndex(
        order =>
          order.orderCode ===
          this.selectedOrder.orderCode
      );


    if (index !== -1) {

      this.orders[index].status =
        'Đã xác nhận';

    }


    // Lưu lại localStorage

    localStorage.setItem(
      'shop_fbi_orders',
      JSON.stringify(this.orders)
    );


    alert(
      'Đã xác nhận đơn hàng thành công!'
    );

  }


  // =========================================
  // XÓA ĐƠN HÀNG
  // =========================================

  deleteOrder(index: number): void {

    const realIndex =
      (this.currentPage - 1) *
      this.pageSize +
      index;


    const order =
      this.orders[realIndex];


    if (!order) {
      return;
    }


    const confirmed = confirm(
      `Bạn có chắc muốn xóa đơn hàng ${order.orderCode}?`
    );


    if (!confirmed) {
      return;
    }


    this.orders.splice(
      realIndex,
      1
    );


    localStorage.setItem(
      'shop_fbi_orders',
      JSON.stringify(this.orders)
    );


    // Nếu xóa hết sản phẩm
    // ở trang hiện tại

    if (
      this.currentPage > this.totalPages &&
      this.totalPages > 0
    ) {

      this.currentPage =
        this.totalPages;

    }


    // Nếu đang xem đơn bị xóa

    if (
      this.selectedOrder?.orderCode ===
      order.orderCode
    ) {

      this.closeOrderDetail();

    }

  }

}