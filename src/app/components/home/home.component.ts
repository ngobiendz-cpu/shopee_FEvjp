import { Component, OnInit, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  sizes: (string | number)[];
  colors: string[];
  description?: string;
  isPromoted?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
  finalSize: string | number;
  finalColor: string;
  selectedSize?: string | number;
  selectedColor?: string;
}

export interface Order {
  orderCode: string;
  customer: {
    name: string;
    phone: string;
    address: string;
    note: string;
  };
  items: CartItem[];
  totalPrice: number;
  createdAt: Date;
  id?: string | number;
  status?: string;
  total?: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private router = inject(Router);

  // DANH SÁCH 12 SẢN PHẨM CHUẨN (6 GIÀY DÉP + 6 QUẦN ÁO)
  defaultProductsList: Product[] = [
    {
      id: 1,
      name: 'Giày Sneaker Nike Air Force 1 Trắng Cổ Thấp',
      category: 'shoes',
      price: 2500000,
      image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500',
      sizes: [38, 39, 40, 41, 42],
      colors: ['Trắng'],
      description: 'Giày sneaker thể thao phong cách trẻ trung, chất liệu da cao cấp.',
      isPromoted: true
    },
    {
      id: 2,
      name: 'Áo Thun Local Brand BIEN FBI Unisex Form Rộng',
      category: 'clothing',
      price: 350000,
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Đen', 'Trắng'],
      description: 'Áo thun cotton 100% thoáng mát, thấm hút mồ hôi tốt.',
      isPromoted: true
    },
    {
      id: 3,
      name: 'Giày Adidas Ultraboost 22 Chạy Bộ Siêu Êm',
      category: 'shoes',
      price: 3200000,
      image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=500',
      sizes: [39, 40, 41, 42],
      colors: ['Đen', 'Xám'],
      description: 'Đế giày Boost hỗ trợ lực tối đa cho người chạy bộ.'
    },
    {
      id: 4,
      name: 'Áo Khoác Hoodie Fleece Ấm Áp Mùa Đông',
      category: 'clothing',
      price: 550000,
      image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500',
      sizes: ['M', 'L', 'XL'],
      colors: ['Xám', 'Đen'],
      description: 'Áo hoodie nỉ bông dày dặn, giữ ấm cực tốt.'
    },
    {
      id: 5,
      name: 'Giày Chạy Bộ Puma Velocity Nitro 2 Thể Thao',
      category: 'shoes',
      price: 1850000,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
      sizes: [38, 39, 40, 41],
      colors: ['Đỏ', 'Đen'],
      description: 'Thiết kế ôm chân nhẹ nhàng, độ bám sàn vượt trội.'
    },
    {
      id: 6,
      name: 'Quần Jogger Thể Thao Nam Form Ôm Co Giãn',
      category: 'clothing',
      price: 290000,
      image: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=500',
      sizes: ['M', 'L', 'XL'],
      colors: ['Đen', 'Xám Đậm'],
      description: 'Quần jogger thun co giãn 4 chiều vận động thoải mái.'
    },
    {
      id: 7,
      name: 'Giày Sneaker Jordan 1 Retro High Cổ Cao',
      category: 'shoes',
      price: 4200000,
      image: 'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=500',
      sizes: [40, 41, 42],
      colors: ['Đỏ Đen', 'Xanh Trắng'],
      description: 'Biểu tượng thời trang streetwear cổ điển đỉnh cao.'
    },
    {
      id: 8,
      name: 'Áo Sơ Mi Trắng Cổ Tàu Chất Lụa Chống Nhăn',
      category: 'clothing',
      price: 420000,
      image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=500',
      sizes: ['S', 'M', 'L'],
      colors: ['Trắng'],
      description: 'Áo sơ mi lụa chống nhăn phong cách lịch lãm, hiện đại.'
    },
    {
      id: 9,
      name: 'Giày Converse Chuck Taylor Classic Cổ Thấp',
      category: 'shoes',
      price: 1350000,
      image: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=500',
      sizes: [36, 37, 38, 39, 40],
      colors: ['Đen', 'Trắng'],
      description: 'Giày vải canvas huyền thoại dễ phối mọi outfit.'
    },
    {
      id: 10,
      name: 'Áo Polo Nam Co Giãn 4 Chiều Phong Cách',
      category: 'clothing',
      price: 280000,
      image: 'https://images.unsplash.com/photo-1625910513413-5fc282363a03?w=500',
      sizes: ['M', 'L', 'XL'],
      colors: ['Xanh Navy', 'Đen', 'Xám'],
      description: 'Áo polo thanh lịch thích hợp đi làm lẫn đi chơi.'
    },
    {
      id: 11,
      name: 'Giày Lười Leather Loafers Da Bò Thật',
      category: 'shoes',
      price: 1950000,
      image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=500',
      sizes: [39, 40, 41, 42],
      colors: ['Nâu', 'Đen'],
      description: 'Giày lười da bò nguyên tấm êm chân, bền bỉ.'
    },
    {
      id: 12,
      name: 'Quần Short Thể Thao Nam Tập Gym Siêu Nhẹ',
      category: 'clothing',
      price: 190000,
      image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500',
      sizes: ['M', 'L', 'XL'],
      colors: ['Đen', 'Xám'],
      description: 'Quần short tập gym chất liệu dù nhanh khô.'
    }
  ];

  products: Product[] = [];

  selectedCategory: string = 'all';
  searchKeyword: string = '';
  searchQuery: string = '';
  selectedSort: string = '';
  sortBy: string = 'default';

  currentPage: number = 1;
  pageSize: number = 8;
  displayedProducts: Product[] = [];
  filteredProducts: Product[] = [];
  totalPages: number = 1;

  categories: string[] = ['Tất cả', 'Giày dép', 'Thời trang', 'Điện tử', 'Phụ kiện'];

  cart: CartItem[] = [];
  cartList: CartItem[] = [];
  cartItemCount: number = 0;
  cartTotalPrice: number = 0;

  showProductDetailModal: boolean = false;
  isDetailModalOpen: boolean = false;

  showAddProductModal: boolean = false;
  isAddProductModalOpen: boolean = false;

  showCheckoutModal: boolean = false;
  isCartModalOpen: boolean = false;

  showEditItemModal: boolean = false;
  isEditCartModalOpen: boolean = false;

  showMyOrdersModal: boolean = false;
  isOrderModalOpen: boolean = false;

  selectedProduct: Product | null = null;
  selectedSize: string | number = '';
  selectedColor: string = '';
  selectedQuantity: number = 1;

  newProduct: { name: string; category: string; price: number | null; image: string; description?: string } = {
    name: '',
    category: 'shoes',
    price: null,
    image: '',
    description: ''
  };

  editingCartIndex: number = -1;
  editingProduct: CartItem | null = null;
  editingCartItem: CartItem | null = null;
  editingQuantity: number = 1;

  checkoutStep: number = 1;
  cartStep: 'cart' | 'checkout' = 'cart';

  customerName: string = '';
  customerPhone: string = '';
  customerAddress: string = '';
  customerNote: string = '';

  checkoutInfo = {
    name: '',
    phone: '',
    address: '',
    paymentMethod: 'COD'
  };

  myOrders: Order[] = [];
  orderList: Order[] = [];
  trackingOrder: Order | null = null;

  get promotedProducts(): any[] {
    if (!this.products) return [];
    const promos = this.products.filter(p => p.isPromoted);
    return promos.length > 0 ? promos : this.products.slice(0, 3);
  }

  get cartItems(): CartItem[] { return this.cart; }
  get topProducts(): Product[] { return this.promotedProducts; }
  get paginatedProducts(): Product[] { return this.displayedProducts; }
  get pagesArray(): number[] { return this.getPageArray(); }
  get ordersList(): Order[] { return this.myOrders; }

  get isDetailOpen(): boolean { return this.isDetailModalOpen || this.showProductDetailModal; }
  set isDetailOpen(val: boolean) { this.isDetailModalOpen = val; this.showProductDetailModal = val; }

  get isCartOpen(): boolean { return this.isCartModalOpen; }
  set isCartOpen(val: boolean) { this.isCartModalOpen = val; }

  get isAddProductOpen(): boolean { return this.isAddProductModalOpen || this.showAddProductModal; }
  set isAddProductOpen(val: boolean) { this.isAddProductModalOpen = val; this.showAddProductModal = val; }

  get isCheckoutOpen(): boolean { return this.showCheckoutModal; }
  set isCheckoutOpen(val: boolean) { this.showCheckoutModal = val; }

  get isOrdersOpen(): boolean { return this.isOrderModalOpen || this.showMyOrdersModal; }
  set isOrdersOpen(val: boolean) { this.isOrderModalOpen = val; }

  get selectedOrderTrack(): Order | null { return this.trackingOrder; }
  set selectedOrderTrack(val: Order | null) { this.trackingOrder = val; }

  get chosenSize(): string | number { return this.selectedSize; }
  set chosenSize(val: string | number) { this.selectedSize = val; }

  get chosenColor(): string { return this.selectedColor; }
  set chosenColor(val: string) { this.selectedColor = val; }

  get detailQuantity(): number { return this.selectedQuantity; }
  set detailQuantity(val: number) { this.selectedQuantity = val; }

  resetCategory(): void { this.selectCategory('all'); }
  filterByCategory(category: string): void { this.selectCategory(category || 'all'); }
  applySort(): void { this.onSortChange(); }
  changePage(page: number): void { this.goToPage(page); }
  openDetailModal(p: Product): void { this.navigateToProductDetail(p.id); }
  decreaseDetailQty(): void { this.decreaseQuantity(); }
  increaseDetailQty(): void { this.increaseQuantity(); }

  decreaseQty(item: CartItem): void {
    const idx = this.cart.indexOf(item);
    if (idx > -1) this.updateCartQuantity(idx, -1);
  }

  increaseQty(item: CartItem): void {
    const idx = this.cart.indexOf(item);
    if (idx > -1) this.updateCartQuantity(idx, 1);
  }

  openCheckoutModal(): void { this.goToCart(); }
  openOrdersModal(): void { this.openMyOrders(); }
  closeOrdersModal(): void { this.closeMyOrders(); }
  submitNewProduct(): void { this.addNewProduct(); }
  processCheckout(): void { this.confirmAndSubmitOrder(); }

  trackOrder(orderOrCode: string | Order): void {
    if (typeof orderOrCode === 'string') {
      this.trackingOrder = this.myOrders.find(o => o.orderCode === orderOrCode || String(o.id) === orderOrCode) || null;
    } else if (orderOrCode && typeof orderOrCode === 'object') {
      this.trackingOrder = orderOrCode;
    }
  }

  ngOnInit(): void {
    this.readFilterFromStorage();
    this.loadProductsData();
    
    const cart = localStorage.getItem('shop_fbi_cart');
    const orders = localStorage.getItem('shop_fbi_orders');

    if (orders) {
      try {
        this.myOrders = JSON.parse(orders);
        this.orderList = [...this.myOrders];
      } catch (e) {
        console.error('Lỗi parse đơn hàng', e);
      }
    }

    if (cart) {
      try {
        this.cart = JSON.parse(cart);
        this.updateCartSummary();
      } catch (e) {
        console.error('Lỗi parse giỏ hàng', e);
      }
    }
  }

  // Tải danh sách sản phẩm thông minh
  private loadProductsData(): void {
    const localProds = localStorage.getItem('shop_fbi_products');
    if (localProds) {
      try {
        const parsed = JSON.parse(localProds);
        // Đảm bảo phải có đủ cả Giày dép lẫn Quần áo và số lượng >= 12
        const hasShoes = parsed.some((p: any) => p.category === 'shoes' || p.category === 'Giày dép');
        const hasClothing = parsed.some((p: any) => p.category === 'clothing' || p.category === 'Thời trang');
        
        if (parsed.length >= 12 && hasShoes && hasClothing) {
          this.products = parsed;
          this.applyFilterAndPagination();
        } else {
          this.resetToDefaultData(false);
        }
      } catch (e) {
        this.resetToDefaultData(false);
      }
    } else {
      this.resetToDefaultData(false);
    }
  }

  // Ép nạp lại 12 sản phẩm gốc + Xóa sạch bộ lọc cũ gây ẩn sản phẩm
  resetToDefaultData(showAlert = true): void {
    // 1. Reset bộ lọc tìm kiếm & danh mục về mặc định (Tất cả)
    this.selectedCategory = 'all';
    this.searchKeyword = '';
    this.searchQuery = '';
    this.sortBy = 'default';
    this.selectedSort = '';
    this.currentPage = 1;

    // 2. Xóa các filter lưu trong LocalStorage
    localStorage.removeItem('shop_fbi_category');
    localStorage.removeItem('shop_fbi_search');

    // 3. Khôi phục danh sách sản phẩm chuẩn
    this.products = JSON.parse(JSON.stringify(this.defaultProductsList));
    localStorage.setItem('shop_fbi_products', JSON.stringify(this.products));
    
    // 4. Áp dụng lại giao diện
    this.applyFilterAndPagination();

    if (showAlert) {
      alert('Đã khôi phục thành công 12 sản phẩm gốc (Gồm đầy đủ Giày dép & Thời trang)!');
    }
  }

  @HostListener('window:searchUpdated')
  onHeaderSearchUpdated(): void {
    this.readFilterFromStorage();
    this.loadProductsData();
  }

  private readFilterFromStorage(): void {
    const savedSearch = localStorage.getItem('shop_fbi_search') || '';
    const savedCat = localStorage.getItem('shop_fbi_category') || 'all';

    this.searchKeyword = savedSearch;
    this.searchQuery = savedSearch;
    this.selectedCategory = savedCat;
  }

  selectCategory(cat: string): void {
    this.selectedCategory = cat;
    if (cat === 'all' || cat === '') {
      localStorage.removeItem('shop_fbi_category');
    } else {
      localStorage.setItem('shop_fbi_category', cat);
    }
    this.currentPage = 1;
    this.applyFilterAndPagination();
  }

  onSearchOrSortChange(): void {
    this.currentPage = 1;
    this.applyFilterAndPagination();
  }

  onSearch(): void {
    if (this.searchQuery) {
      this.searchKeyword = this.searchQuery;
    }
    this.onSearchOrSortChange();
  }

  onSortChange(): void {
    if (this.sortBy === 'price-asc') this.selectedSort = 'low-to-high';
    else if (this.sortBy === 'price-desc') this.selectedSort = 'high-to-low';
    else this.selectedSort = '';
    this.onSearchOrSortChange();
  }

  applyFilterAndPagination(): void {
    let filtered = [...this.products];

    // Lọc theo danh mục
    if (this.selectedCategory && this.selectedCategory !== 'all' && this.selectedCategory !== 'Tất cả') {
      const selectedCatLower = this.selectedCategory.toLowerCase();
      filtered = filtered.filter(p => {
        const prodCatLower = (p.category || '').toLowerCase();
        if (selectedCatLower === 'shoes' || selectedCatLower === 'giày dép') {
          return prodCatLower === 'shoes' || prodCatLower === 'giày dép';
        }
        if (selectedCatLower === 'clothing' || selectedCatLower === 'thời trang') {
          return prodCatLower === 'clothing' || prodCatLower === 'thời trang';
        }
        return prodCatLower === selectedCatLower;
      });
    }

    // Lọc theo từ khóa tìm kiếm
    const keyword = (this.searchKeyword || this.searchQuery || '').toLowerCase().trim();
    if (keyword) {
      filtered = filtered.filter(p => 
        p.name?.toLowerCase().includes(keyword) || 
        (p.description && p.description.toLowerCase().includes(keyword))
      );
    }

    // Sắp xếp
    if (this.selectedSort === 'low-to-high') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (this.selectedSort === 'high-to-low') {
      filtered.sort((a, b) => b.price - a.price);
    }

    this.filteredProducts = filtered;
    this.totalPages = Math.ceil(filtered.length / this.pageSize) || 1;
    if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;

    const start = (this.currentPage - 1) * this.pageSize;
    this.displayedProducts = filtered.slice(start, start + this.pageSize);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.applyFilterAndPagination();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.applyFilterAndPagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.applyFilterAndPagination();
    }
  }

  getPageArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  navigateToProductDetail(productId: number): void {
    localStorage.setItem('shop_fbi_products', JSON.stringify(this.products));
    this.router.navigate(['/product', productId]);
  }

  openProductDetail(p: Product): void {
    this.navigateToProductDetail(p.id);
  }

  closeProductDetailModal(): void {
    this.showProductDetailModal = false;
    this.isDetailModalOpen = false;
    this.selectedProduct = null;
  }

  closeDetailModal(): void {
    this.closeProductDetailModal();
  }

  increaseQuantity(): void {
    this.selectedQuantity++;
  }

  decreaseQuantity(): void {
    if (this.selectedQuantity > 1) {
      this.selectedQuantity--;
    }
  }

  addToCartFromDetail(): void {
    if (!this.selectedProduct) return;

    const size = this.selectedSize || 'Free';
    const color = this.selectedColor || 'Tiêu chuẩn';
    const qty = this.selectedQuantity || 1;

    const existingIndex = this.cart.findIndex(
      item => item.id === this.selectedProduct!.id &&
              item.finalSize === size &&
              item.finalColor === color
    );

    if (existingIndex > -1) {
      this.cart[existingIndex].quantity += qty;
    } else {
      const newItem: CartItem = {
        ...this.selectedProduct,
        quantity: qty,
        finalSize: size,
        finalColor: color,
        selectedSize: size,
        selectedColor: color
      };
      this.cart.push(newItem);
    }

    this.updateCartSummary();
    alert(`Đã thêm ${qty} x "${this.selectedProduct.name}" (Size: ${size}, Màu: ${color}) vào giỏ hàng!`);
    this.closeProductDetailModal();
  }

  buyNowFromDetail(): void {
    this.addToCartFromDetail();
    this.goToCart();
  }

  addToCart(product: Product): void {
    const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Free';
    const defaultColor = product.colors && product.colors.length > 0 ? product.colors[0] : 'Tiêu chuẩn';

    const existingIndex = this.cart.findIndex(
      item => item.id === product.id &&
              item.finalSize === defaultSize &&
              item.finalColor === defaultColor
    );

    if (existingIndex > -1) {
      this.cart[existingIndex].quantity = (this.cart[existingIndex].quantity || 1) + 1;
    } else {
      const newItem: CartItem = {
        ...product,
        quantity: 1,
        finalSize: defaultSize,
        finalColor: defaultColor,
        selectedSize: defaultSize,
        selectedColor: defaultColor
      };
      this.cart.push(newItem);
    }

    this.updateCartSummary();
    alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
  }

  updateCartSummary(): void {
    this.cart.forEach(item => {
      item.selectedSize = item.selectedSize || item.finalSize;
      item.selectedColor = item.selectedColor || item.finalColor;
    });

    this.cartList = [...this.cart];

    this.cartItemCount = this.cart.reduce(
      (sum, item) => sum + (item.quantity || 1),
      0
    );

    this.cartTotalPrice = this.cart.reduce(
      (sum, item) => sum + ((item.price || 0) * (item.quantity || 1)),
      0
    );

    localStorage.setItem('shop_fbi_cart', JSON.stringify(this.cart));
    window.dispatchEvent(new Event('cartUpdated'));
  }

  getCartTotal(): number {
    return this.cartTotalPrice;
  }

  updateCartQuantity(index: number, change: number): void {
    if (this.cart[index]) {
      this.cart[index].quantity = (this.cart[index].quantity || 1) + change;
      if (this.cart[index].quantity <= 0) {
        this.removeItem(index);
      } else {
        this.updateCartSummary();
      }
    }
  }

  removeFromCart(index: number): void {
    this.removeItem(index);
  }

  openEditCartItem(itemOrIndex: CartItem | number, optionalIndex?: number): void {
    if (typeof itemOrIndex === 'number') {
      this.editingCartIndex = itemOrIndex;
      const targetItem = this.cart[itemOrIndex];
      this.editingProduct = JSON.parse(JSON.stringify(targetItem));
    } else {
      this.editingCartIndex = optionalIndex !== undefined ? optionalIndex : this.cart.indexOf(itemOrIndex);
      this.editingProduct = JSON.parse(JSON.stringify(itemOrIndex));
    }

    if (this.editingProduct) {
      this.editingCartItem = this.editingProduct;
      this.editingQuantity = this.editingProduct.quantity || 1;
      this.showEditItemModal = true;
      this.isEditCartModalOpen = true;
    }
  }

  closeEditItemModal(): void {
    this.showEditItemModal = false;
    this.isEditCartModalOpen = false;
    this.editingProduct = null;
    this.editingCartItem = null;
  }

  closeEditCartModal(): void {
    this.closeEditItemModal();
  }

  saveCartItemChanges(): void {
    if (this.editingCartIndex > -1 && this.editingProduct) {
      this.cart[this.editingCartIndex] = {
        ...this.editingProduct,
        quantity: this.editingQuantity || 1
      };
      this.updateCartSummary();
      this.closeEditItemModal();
    }
  }

  saveEditCartItem(): void {
    this.saveCartItemChanges();
  }

  removeItem(index: number): void {
    this.cart.splice(index, 1);
    this.updateCartSummary();
  }

  openAddProductModal(): void {
    this.showAddProductModal = true;
    this.isAddProductModalOpen = true;
  }

  closeAddProductModal(): void {
    this.showAddProductModal = false;
    this.isAddProductModalOpen = false;
    this.newProduct = { name: '', category: 'shoes', price: null, image: '', description: '' };
  }

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

  addNewProduct(event?: Event): void {
    if (event) event.preventDefault();
    if (!this.newProduct.name || !this.newProduct.price || !this.newProduct.image) {
      alert('Vui lòng điền đầy đủ Tên, Giá và Chọn ảnh sản phẩm!');
      return;
    }

    const createdProduct: Product = {
      id: Date.now(),
      name: this.newProduct.name,
      category: this.newProduct.category,
      price: Number(this.newProduct.price),
      image: this.newProduct.image,
      description: this.newProduct.description || '',
      sizes: this.newProduct.category === 'shoes' ? [38, 39, 40, 41, 42] : ['S', 'M', 'L', 'XL'],
      colors: ['Tiêu chuẩn']
    };

    this.products.unshift(createdProduct);
    localStorage.setItem('shop_fbi_products', JSON.stringify(this.products));
    this.applyFilterAndPagination();
    this.closeAddProductModal();
    alert('Thêm sản phẩm mới thành công!');
  }

  saveNewProduct(): void {
    this.addNewProduct();
  }

  goToCart(): void {
    this.checkoutStep = 1;
    this.cartStep = 'cart';
    this.showCheckoutModal = true;
    this.isCartModalOpen = true;
  }

  openCartModal(): void {
    this.goToCart();
  }

  closeCheckoutModal(): void {
    this.showCheckoutModal = false;
    this.isCartModalOpen = false;
  }

  closeCartModal(): void {
    this.closeCheckoutModal();
  }

  proceedToShipping(): void {
    if (this.cart.length === 0) return;
    this.checkoutStep = 2;
    this.cartStep = 'checkout';
  }

  goToCheckoutStep(): void {
    this.proceedToShipping();
  }

  backToCartReview(): void {
    this.checkoutStep = 1;
    this.cartStep = 'cart';
  }

  confirmAndSubmitOrder(event?: Event): void {
    if (event) event.preventDefault();

    const name = this.customerName || this.checkoutInfo.name;
    const phone = this.customerPhone || this.checkoutInfo.phone;
    const address = this.customerAddress || this.checkoutInfo.address;
    const note = this.customerNote;

    if (!name || !phone || !address) {
      alert('Vui lòng điền đầy đủ Họ tên, Số điện thoại và Địa chỉ!');
      return;
    }

    const orderItems: CartItem[] = this.cart.map(item => ({
      ...item,
      quantity: item.quantity || 1,
      finalSize: item.finalSize || item.selectedSize || 'Free',
      finalColor: item.finalColor || item.selectedColor || 'Tiêu chuẩn',
      selectedSize: item.selectedSize || item.finalSize || 'Free',
      selectedColor: item.selectedColor || item.finalColor || 'Tiêu chuẩn'
    }));

    const code = 'SP' + Math.floor(100000 + Math.random() * 900000);

    const newOrder: Order = {
      orderCode: code,
      id: code,
      status: 'Đang xử lý',
      total: this.cartTotalPrice,
      totalPrice: this.cartTotalPrice,
      customer: { name, phone, address, note },
      items: orderItems,
      createdAt: new Date()
    };

    this.myOrders.unshift(newOrder);
    this.orderList = [...this.myOrders];

    localStorage.setItem('shop_fbi_orders', JSON.stringify(this.myOrders));
    window.dispatchEvent(new Event('ordersUpdated'));

    this.cart = [];
    this.updateCartSummary();
    this.closeCheckoutModal();

    this.customerName = '';
    this.customerPhone = '';
    this.customerAddress = '';
    this.customerNote = '';
    this.checkoutInfo = { name: '', phone: '', address: '', paymentMethod: 'COD' };

    alert(`Đặt hàng thành công! Mã đơn hàng của bạn là: ${newOrder.orderCode}`);
  }

  confirmCheckout(): void {
    this.confirmAndSubmitOrder();
  }

  openMyOrders(): void {
    this.showMyOrdersModal = true;
    this.isOrderModalOpen = true;
  }

  openOrderModal(): void {
    this.openMyOrders();
  }

  closeMyOrders(): void {
    this.showMyOrdersModal = false;
    this.isOrderModalOpen = false;
    this.trackingOrder = null;
  }

  closeOrderModal(): void {
    this.closeMyOrders();
  }
}