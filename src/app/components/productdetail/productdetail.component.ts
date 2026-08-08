import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-productdetail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productdetail.component.html',
  styleUrls: ['./productdetail.component.css']
})
export class ProductDetailComponent implements OnInit {
  public product: any = null;
  public quantity: number = 1;
  
  // Biến lưu ảnh đang được chọn để xem lớn
  public selectedImage: string = '';
  // Quản lý tab thông tin bên dưới (description | sizeGuide | reviews)
  public activeTab: string = 'description';

  // =================== ĐÁNH GIÁ ===================
  public reviews = [
    {
      name: 'Nguyễn Văn A',
      rating: 5,
      comment: 'Sản phẩm rất đẹp, chất lượng tốt.',
      date: '01/08/2026'
    },
    {
      name: 'Trần Thị B',
      rating: 4,
      comment: 'Giao hàng nhanh, sẽ tiếp tục ủng hộ.',
      date: '05/08/2026'
    },
    {
      name: 'Lê Văn C',
      rating: 5,
      comment: 'Đúng như mô tả, rất hài lòng.',
      date: '08/08/2026'
    }
  ];

  // =================== BẢNG SIZE GIÀY ===================
  public shoeSizeGuide = [
    { size: 38, foot: '23.5 cm' },
    { size: 39, foot: '24.0 cm' },
    { size: 40, foot: '25.0 cm' },
    { size: 41, foot: '26.0 cm' },
    { size: 42, foot: '26.5 cm' },
    { size: 43, foot: '27.0 cm' }
  ];

  // =================== BẢNG SIZE QUẦN ÁO ===================
  public clothingSizeGuide = [
    { size:'S', height:'155 - 165 cm', weight:'45 - 55 kg' },
    { size:'M', height:'165 - 170 cm', weight:'55 - 65 kg' },
    { size:'L', height:'170 - 175 cm', weight:'65 - 75 kg' },
    { size:'XL', height:'175 - 185 cm', weight:'75 - 85 kg' }
  ];

  public showCheckoutModal: boolean = false;
  public customerName: string = '';
  public customerPhone: string = '';
  public customerAddress: string = '';
  public customerNote: string = '';

  constructor(
    private route: ActivatedRoute, 
    private router: Router
  ) {}

  ngOnInit(): void {
    // Lắng nghe sự thay đổi của tham số id trên URL
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.loadProductDetail(idParam);
      }
    });
  }

  // Hàm lấy dữ liệu sản phẩm từ localStorage
  private loadProductDetail(idParam: string): void {
    const data = localStorage.getItem('shop_fbi_products');
    
    if (data) {
      try {
        const productsList = JSON.parse(data);
        const found = productsList.find((p: any) => String(p.id) === String(idParam));
        
        if (found) {
          this.product = { 
            ...found,
            chosenSize: found.sizes && found.sizes.length > 0 ? found.sizes[0] : 'Free',
            chosenColor: found.colors && found.colors.length > 0 ? found.colors[0] : 'Tiêu chuẩn'
          };
          this.selectedImage = this.product.image;
        } else {
          this.product = null;
        }
      } catch (e) {
        console.error('Lỗi đọc dữ liệu sản phẩm:', e);
        this.product = null;
      }
    }
  }

  public changeMainImage(imgUrl: string): void {
    this.selectedImage = imgUrl;
  }

  public setTab(tabName: string): void {
    this.activeTab = tabName;
  }

  public increaseQty(): void { this.quantity++; }
  public decreaseQty(): void { if (this.quantity > 1) this.quantity--; }

  private getCartFromStorage(): any[] {
    const data = localStorage.getItem('shop_fbi_cart');
    return data ? JSON.parse(data) : [];
  }

  private saveCartToStorage(cart: any[]): void {
    localStorage.setItem('shop_fbi_cart', JSON.stringify(cart));
  }

  public addToCart(): void {
    if (!this.product) return;

    let currentCart = this.getCartFromStorage();

    const chosenSize =
      this.product.chosenSize ||
      (this.product.sizes?.length ? this.product.sizes[0] : 'Free');

    const chosenColor =
      this.product.chosenColor ||
      (this.product.colors?.length ? this.product.colors[0] : 'Tiêu chuẩn');

    const existingIndex = currentCart.findIndex(
      (item: any) =>
        String(item.id) === String(this.product.id) &&
        item.finalSize === chosenSize &&
        item.finalColor === chosenColor
    );

    if (existingIndex > -1) {
      currentCart[existingIndex].quantity =
        (currentCart[existingIndex].quantity || 1) + this.quantity;
    } else {
      currentCart.push({
        id: this.product.id,
        name: this.product.name,
        price: this.product.price,
        image: this.product.image,
        category: this.product.category,
        description: this.product.description,
        sizes: this.product.sizes,
        colors: this.product.colors,
        finalSize: chosenSize,
        finalColor: chosenColor,
        quantity: this.quantity
      });
    }

    // 1. Lưu trực tiếp vào localStorage
    this.saveCartToStorage(currentCart);

    // 2. Phát sự kiện cho Header tự động cập nhật giỏ hàng
    window.dispatchEvent(new Event('cartUpdated'));

    alert(`Đã thêm ${this.quantity} x "${this.product.name}" vào giỏ hàng!`);
  }

  public buyNow(): void {
    this.addToCart();
    this.showCheckoutModal = true;
  }

  public closeCheckoutModal(): void { this.showCheckoutModal = false; }

  public confirmAndSubmitOrder(event: Event): void {
    event.preventDefault();
    if (!this.customerName || !this.customerPhone || !this.customerAddress) {
      alert('Vui lòng điền đầy đủ thông tin nhận hàng!');
      return;
    }

    let currentCart = this.getCartFromStorage();
    const total = currentCart.reduce(
      (sum, item) => sum + ((item.price || 0) * (item.quantity || 1)),
      0
    );
    const newOrder = {
      orderCode: 'DH' + Math.floor(100000 + Math.random() * 900000),
      orderDate: new Date().toLocaleString(),
      status: 'Đang chuẩn bị hàng',
      customer: {
        name: this.customerName,
        phone: this.customerPhone,
        address: this.customerAddress,
        note: this.customerNote || 'Không có ghi chú'
      },
      items: [...currentCart],
      totalPrice: total
    };

    const ordersData = localStorage.getItem('shop_fbi_orders');
    const myOrders = ordersData ? JSON.parse(ordersData) : [];
    myOrders.unshift(newOrder);
    localStorage.setItem('shop_fbi_orders', JSON.stringify(myOrders));
    
    // Xóa giỏ hàng trong localStorage
    localStorage.removeItem('shop_fbi_cart');
    window.dispatchEvent(new Event('cartUpdated'));

    this.showCheckoutModal = false;
    alert('Đặt hàng thành công!');
    this.router.navigate(['/']);
  }

  public goBack(): void { this.router.navigate(['/']); }

  
}