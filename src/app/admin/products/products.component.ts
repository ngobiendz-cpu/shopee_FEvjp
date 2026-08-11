import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


interface AdminProduct {

  id: number;

  name: string;

  category: string;

  price: number;

  image: string;

  description: string;

  sizes?: any[];

  colors?: string[];

  isPromoted?: boolean;

}


@Component({
  selector: 'app-admin-products',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './products.component.html',

  styleUrl: './products.component.css'
})


export class AdminProductsComponent implements OnInit {


  // =====================================================
  // DANH SÁCH SẢN PHẨM
  // =====================================================

  products: AdminProduct[] = [];



  // =====================================================
  // PHÂN TRANG
  // =====================================================

  currentPage: number = 1;

  pageSize: number = 5;



  // =====================================================
  // FORM
  // =====================================================

  showForm: boolean = false;

  isEditMode: boolean = false;

  editingProductId: number | null = null;



  // =====================================================
  // DỮ LIỆU FORM
  // =====================================================

  productForm: AdminProduct = {

    id: 0,

    name: '',

    category: 'shoes',

    price: 0,

    image: '',

    description: '',

    sizes: [],

    colors: []

  };



  // =====================================================
  // KHỞI TẠO
  // =====================================================

  ngOnInit(): void {

    this.loadProducts();

  }



  // =====================================================
  // ĐỌC SẢN PHẨM TỪ LOCAL STORAGE
  // =====================================================

  loadProducts(): void {

    const data =
      localStorage.getItem('shop_fbi_products');


    if (data) {

      try {

        const parsed =
          JSON.parse(data);


        if (Array.isArray(parsed)) {

          this.products = parsed;

        } else {

          this.products = [];

        }

      } catch (error) {

        console.error(
          'Lỗi đọc sản phẩm:',
          error
        );

        this.products = [];

      }

    } else {

      this.products = [];

    }


    // Đảm bảo trang hiện tại hợp lệ

    if (
      this.currentPage >
      this.totalPages
    ) {

      this.currentPage =
        this.totalPages;

    }

  }



  // =====================================================
  // LƯU SẢN PHẨM
  // =====================================================

  saveProducts(): void {

    localStorage.setItem(

      'shop_fbi_products',

      JSON.stringify(this.products)

    );


    // Báo cho Dashboard biết sản phẩm đã thay đổi

    window.dispatchEvent(
      new Event('productsUpdated')
    );

  }



  // =====================================================
  // MỞ FORM THÊM
  // =====================================================

  openAddForm(): void {

    this.isEditMode = false;

    this.editingProductId = null;

    this.resetForm();

    this.showForm = true;

  }



  // =====================================================
  // MỞ FORM SỬA
  // =====================================================

  openEditForm(product: AdminProduct): void {

    this.isEditMode = true;

    this.editingProductId =
      product.id;


    // Tạo bản sao để khi đang sửa
    // chưa ảnh hưởng trực tiếp danh sách

    this.productForm = {

      ...product,

      sizes: product.sizes
        ? [...product.sizes]
        : [],

      colors: product.colors
        ? [...product.colors]
        : []

    };


    this.showForm = true;

  }



  // =====================================================
  // ĐÓNG FORM
  // =====================================================

  closeForm(): void {

    this.showForm = false;

    this.isEditMode = false;

    this.editingProductId = null;

    this.resetForm();

  }



  // =====================================================
  // RESET FORM
  // =====================================================

  resetForm(): void {

    this.productForm = {

      id: 0,

      name: '',

      category: 'shoes',

      price: 0,

      image: '',

      description: '',

      sizes: [],

      colors: []

    };

  }



  // =====================================================
  // TẢI ẢNH TỪ MÁY
  // =====================================================

  onFileSelected(event: Event): void {

    const input =
      event.target as HTMLInputElement;


    const file =
      input.files?.[0];


    if (!file) {

      return;

    }


    // Kiểm tra có phải ảnh không

    if (!file.type.startsWith('image/')) {

      alert(
        'Vui lòng chọn file hình ảnh!'
      );

      return;

    }


    // Giới hạn 5MB

    if (file.size > 5 * 1024 * 1024) {

      alert(
        'Ảnh không được lớn hơn 5MB!'
      );

      return;

    }


    const reader =
      new FileReader();


    reader.onload = () => {

      this.productForm.image =
        reader.result as string;

    };


    reader.onerror = () => {

      alert(
        'Không thể đọc file ảnh!'
      );

    };


    reader.readAsDataURL(file);

  }



  // =====================================================
  // THÊM / SỬA SẢN PHẨM
  // =====================================================

  submitProduct(): void {


    // -------------------------------------------------
    // KIỂM TRA TÊN
    // -------------------------------------------------

    if (
      !this.productForm.name ||
      !this.productForm.name.trim()
    ) {

      alert(
        'Vui lòng nhập tên sản phẩm!'
      );

      return;

    }



    // -------------------------------------------------
    // KIỂM TRA GIÁ
    // -------------------------------------------------

    if (
      !this.productForm.price ||
      Number(this.productForm.price) <= 0
    ) {

      alert(
        'Vui lòng nhập giá sản phẩm hợp lệ!'
      );

      return;

    }



    // -------------------------------------------------
    // KIỂM TRA ẢNH
    // -------------------------------------------------

    if (
      !this.productForm.image ||
      !this.productForm.image.trim()
    ) {

      alert(
        'Vui lòng tải ảnh sản phẩm hoặc dán link ảnh!'
      );

      return;

    }



    // =================================================
    // CHẾ ĐỘ SỬA
    // =================================================

    if (this.isEditMode) {


      const index =
        this.products.findIndex(

          product =>
            product.id ===
            this.editingProductId

        );


      if (index !== -1) {

        this.products[index] = {

          ...this.products[index],

          name:
            this.productForm.name.trim(),

          category:
            this.productForm.category,

          price:
            Number(this.productForm.price),

          image:
            this.productForm.image,

          description:
            this.productForm.description || '',

          sizes:
            this.productForm.sizes || [],

          colors:
            this.productForm.colors || []

        };


        this.saveProducts();


        alert(
          'Cập nhật sản phẩm thành công!'
        );


        this.closeForm();

        this.loadProducts();

      }


      return;

    }



    // =================================================
    // CHẾ ĐỘ THÊM
    // =================================================

    const newProduct: AdminProduct = {

      id: Date.now(),

      name:
        this.productForm.name.trim(),

      category:
        this.productForm.category,

      price:
        Number(this.productForm.price),

      image:
        this.productForm.image,

      description:
        this.productForm.description || '',

      sizes:
        this.productForm.category === 'shoes'

          ? [38, 39, 40, 41, 42]

          : ['S', 'M', 'L', 'XL'],

      colors:
        ['Tiêu chuẩn']

    };


    // Thêm sản phẩm vào đầu danh sách

    this.products.unshift(
      newProduct
    );


    // Lưu

    this.saveProducts();


    // Về trang 1

    this.currentPage = 1;


    alert(
      'Thêm sản phẩm thành công!'
    );


    this.closeForm();

    this.loadProducts();

  }



  // =====================================================
  // XÓA SẢN PHẨM
  // =====================================================

  deleteProduct(product: AdminProduct): void {


    const confirmDelete =
      confirm(

        `Bạn có chắc muốn xóa sản phẩm "${product.name}" không?`

      );


    if (!confirmDelete) {

      return;

    }


    this.products =
      this.products.filter(

        item =>
          item.id !== product.id

      );


    this.saveProducts();


    // Nếu xóa hết sản phẩm ở trang cuối

    if (
      this.currentPage >
      this.totalPages
    ) {

      this.currentPage =
        this.totalPages;

    }


    alert(
      'Xóa sản phẩm thành công!'
    );

  }



  // =====================================================
  // PHÂN TRANG
  // =====================================================

  get totalPages(): number {

    return Math.ceil(

      this.products.length /
      this.pageSize

    ) || 1;

  }



  // =====================================================
  // SẢN PHẨM CỦA TRANG HIỆN TẠI
  // =====================================================

  get pagedProducts(): AdminProduct[] {

    const startIndex =
      (this.currentPage - 1) *
      this.pageSize;


    return this.products.slice(

      startIndex,

      startIndex + this.pageSize

    );

  }



  // =====================================================
  // DANH SÁCH SỐ TRANG
  // =====================================================

  get pageNumbers(): number[] {

    return Array.from(

      {
        length:
          this.totalPages
      },

      (_, index) =>
        index + 1

    );

  }



  // =====================================================
  // CHUYỂN TRANG
  // =====================================================

  changePage(page: number): void {

    if (
      page >= 1 &&
      page <= this.totalPages
    ) {

      this.currentPage = page;

    }

  }

}