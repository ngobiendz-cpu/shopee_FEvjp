import { Component, OnInit, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit {
  // Tìm kiếm
  searchQuery: string = '';

  // Trạng thái Bật/Tắt các Modal Popup
  isCartOpen: boolean = false;
  isAddProductOpen: boolean = false;
  isOrdersOpen: boolean = false;
  isDetailOpen: boolean = false;
  isCheckoutOpen: boolean = false;

  // Dữ liệu Giỏ hàng & Đơn hàng
  cartItems: any[] = [];
  ordersList: any[] = [];
  selectedOrderTrack: any = null;

  // Dữ liệu tạm khi xem Chi tiết sản phẩm
  selectedProduct: any = null;
  chosenSize: string = '';
  chosenColor: string = '';
  detailQuantity: number = 1;

  // Form Đăng bán sản phẩm mới
  newProduct = {
    name: '',
    price: null as number | null,
    category: 'Giày dép',
    image: '',
    description: ''
  };

  // Form Thông tin Thanh toán
  checkoutInfo = {
    name: '',
    phone: '',
    address: '',
    paymentMethod: 'COD'
  };

  // ==================== BỔ SUNG CẤU HÌNH PHÂN TRANG ====================
  // 1. Phân trang Đơn hàng (Orders)
  ordersCurrentPage: number = 1;
  ordersPageSize: number = 5; // Hiển thị 5 đơn hàng mỗi trang

  constructor() {}

  ngOnInit(): void {
    this.loadCartFromStorage();
    this.loadOrdersFromStorage();
  }

  // Đọc giỏ hàng từ localStorage
  private loadCartFromStorage(): void {
    const data = localStorage.getItem('shop_fbi_cart');
    this.cartItems = data ? JSON.parse(data) : [];
  }

  // Đọc danh sách đơn hàng từ localStorage
  private loadOrdersFromStorage(): void {
    const data = localStorage.getItem('shop_fbi_orders');
    this.ordersList = data ? JSON.parse(data) : [];
  }

  // Lưu giỏ hàng vào localStorage và thông báo thay đổi
  private saveCartToStorage(): void {
    localStorage.setItem('shop_fbi_cart', JSON.stringify(this.cartItems));
    window.dispatchEvent(new Event('cartUpdated'));
  }

  // Tự động nhận diện mỗi khi giỏ hàng hoặc đơn hàng được cập nhật ở bất kỳ đâu
  @HostListener('window:cartUpdated')
  onCartUpdated(): void {
    this.loadCartFromStorage();
  }

  @HostListener('window:ordersUpdated')
  onOrdersUpdated(): void {
    this.loadOrdersFromStorage();
  }

  // ==================== TÌM KIẾM & LOGO ====================
  onSearch(): void {
    localStorage.setItem('shop_fbi_search', this.searchQuery.trim());
    window.dispatchEvent(new Event('searchUpdated'));
  }

  resetCategory(): void {
    this.searchQuery = '';
    localStorage.removeItem('shop_fbi_search');
    localStorage.removeItem('shop_fbi_category');
    window.dispatchEvent(new Event('searchUpdated'));
  }

  selectCategory(category: string): void {
    if (!category || category === 'all' || category === 'Tất cả') {
      localStorage.removeItem('shop_fbi_category');
    } else {
      localStorage.setItem('shop_fbi_category', category);
    }
    window.dispatchEvent(new Event('searchUpdated'));
  }

  // ==================== BẬT / TẮT MODAL ====================
  openCartModal(e?: Event): void {
    e?.stopPropagation();
    this.loadCartFromStorage();
    this.isCartOpen = true;
  }

  closeCartModal(): void {
    this.isCartOpen = false;
  }

  openAddProductModal(e?: Event): void {
    e?.stopPropagation();
    this.isAddProductOpen = true;
  }

  closeAddProductModal(): void {
    this.isAddProductOpen = false;
  }

  openOrdersModal(e?: Event): void {
    e?.stopPropagation();
    this.loadOrdersFromStorage();
    this.ordersCurrentPage = 1; // Reset về trang 1 khi mở modal
    this.isOrdersOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeOrdersModal(): void {
    this.isOrdersOpen = false;
    this.selectedOrderTrack = null;
    document.body.style.overflow = 'auto';
  }

  // ==================== THAO TÁC PHÂN TRANG ĐƠN HÀNG ====================
  // Danh sách đơn hàng đã cắt theo trang hiện tại
  get pagedOrders(): any[] {
    const startIndex = (this.ordersCurrentPage - 1) * this.ordersPageSize;
    return this.ordersList.slice(startIndex, startIndex + this.ordersPageSize);
  }

  // Tổng số trang
  get totalOrdersPages(): number {
    return Math.ceil(this.ordersList.length / this.ordersPageSize) || 1;
  }

  // Chuyển trang
  changeOrdersPage(page: number): void {
    if (page >= 1 && page <= this.totalOrdersPages) {
      this.ordersCurrentPage = page;
    }
  }

  // Mảng các số trang [1, 2, 3...]
  get ordersPageNumbers(): number[] {
    return Array.from({ length: this.totalOrdersPages }, (_, i) => i + 1);
  }

  // ==================== THAO TÁC GIỎ HÀNG ====================
  increaseQty(item: any): void {
    item.quantity = (item.quantity || 1) + 1;
    this.saveCartToStorage();
  }

  decreaseQty(item: any): void {
    if (item.quantity > 1) {
      item.quantity--;
      this.saveCartToStorage();
    }
  }

  removeFromCart(index: number): void {
    this.cartItems.splice(index, 1);
    this.saveCartToStorage();
  }

  getCartTotal(): number {
    return this.cartItems.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
  }

  // ==================== ĐĂNG BÁN SẢN PHẨM ====================
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.newProduct.image = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  submitNewProduct(): void {
    if (!this.newProduct.name || !this.newProduct.price) {
      alert('Vui lòng điền tên và giá sản phẩm!');
      return;
    }

    const localProds = localStorage.getItem('shop_fbi_products');
    let productsList = localProds ? JSON.parse(localProds) : [];

    const createdProduct = {
      id: Date.now(),
      name: this.newProduct.name,
      category: this.newProduct.category,
      price: Number(this.newProduct.price),
      image: this.newProduct.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
      description: this.newProduct.description || '',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Tiêu chuẩn']
    };

    productsList.unshift(createdProduct);
    localStorage.setItem('shop_fbi_products', JSON.stringify(productsList));
    window.dispatchEvent(new Event('searchUpdated'));

    alert(`Đăng bán thành công sản phẩm: ${this.newProduct.name}`);
    this.closeAddProductModal();

    this.newProduct = {
      name: '',
      price: null,
      category: 'Giày dép',
      image: '',
      description: ''
    };
  }

  // ==================== THANH TOÁN & ĐƠN HÀNG ====================
  openCheckoutModal(): void {
    if (this.cartItems.length === 0) {
      alert('Giỏ hàng của bạn đang trống!');
      return;
    }
    this.isCartOpen = false;
    this.isCheckoutOpen = true;
  }

  closeCheckoutModal(): void {
    this.isCheckoutOpen = false;
  }

  processCheckout(): void {
    if (!this.checkoutInfo.name || !this.checkoutInfo.phone || !this.checkoutInfo.address) {
      alert('Vui lòng nhập đầy đủ thông tin giao hàng!');
      return;
    }

    const code = 'SP' + Math.floor(100000 + Math.random() * 900000);

    const newOrder = {
      id: code,
      orderCode: code,
      status: 'Đang xử lý',
      customer: { ...this.checkoutInfo },
      items: [...this.cartItems],
      total: this.getCartTotal(),
      totalPrice: this.getCartTotal(),
      createdAt: new Date()
    };

    this.loadOrdersFromStorage();
    this.ordersList.unshift(newOrder);
    localStorage.setItem('shop_fbi_orders', JSON.stringify(this.ordersList));
    window.dispatchEvent(new Event('ordersUpdated'));

    this.cartItems = [];
    localStorage.removeItem('shop_fbi_cart');
    window.dispatchEvent(new Event('cartUpdated'));

    this.checkoutInfo = { name: '', phone: '', address: '', paymentMethod: 'COD' };
    this.closeCheckoutModal();
    alert(`🎉 Đặt hàng thành công! Mã đơn của bạn là: ${code}`);
  }

  trackOrder(order: any): void {
    this.selectedOrderTrack = order;
  }

  // ==================== MODAL CHI TIẾT SẢN PHẨM ====================
  closeDetailModal(): void {
    this.isDetailOpen = false;
    this.selectedProduct = null;
  }

  increaseDetailQty(): void {
    this.detailQuantity++;
  }

  decreaseDetailQty(): void {
    if (this.detailQuantity > 1) {
      this.detailQuantity--;
    }
  }

  addToCartFromDetail(): void {
    if (this.selectedProduct) {
      let currentCart = this.cartItems;
      const size = this.chosenSize || 'Free';
      const color = this.chosenColor || 'Tiêu chuẩn';

      const existingIndex = currentCart.findIndex(
        (item: any) =>
          String(item.id) === String(this.selectedProduct.id) &&
          item.finalSize === size &&
          item.finalColor === color
      );

      if (existingIndex > -1) {
        currentCart[existingIndex].quantity += this.detailQuantity;
      } else {
        currentCart.push({
          ...this.selectedProduct,
          finalSize: size,
          finalColor: color,
          selectedSize: size,
          selectedColor: color,
          quantity: this.detailQuantity
        });
      }

      this.saveCartToStorage();
      alert('Đã thêm vào giỏ hàng thành công!');
      this.closeDetailModal();
    }
  }

  buyNowFromDetail(): void {
    this.addToCartFromDetail();
    this.openCheckoutModal();
  }

  trackByItem(index: number, item: any): any {
    return item.id || item.name || index;
  }

  // ==================== ALIAS BẢO VỆ HTML ====================
  get showAddProductModal(): boolean { return this.isAddProductOpen; }
  set showAddProductModal(val: boolean) { this.isAddProductOpen = val; }

  addNewProduct(e?: Event): void {
    if (e) e.preventDefault();
    this.submitNewProduct();
  }
}