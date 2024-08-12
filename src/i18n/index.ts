  import i18n from 'i18next';
  import { initReactI18next } from 'react-i18next';

  const resources = {
    en: {
      translation: {
        "list": "Products",
        "home": "Home",
        "search": "Search products...",
        'category': "Category",
        'price': "Price",
        'description': "Description",
        'image': "Image",
        'cancel': "Cancel",
        'save': "Save",
        'logout': "Logout",
        'hi':'Hi!',
        'purchase': 'My Purchase',
        'login': 'Login',
        'register':'Register',
        'page': 'Page',
        'result': 'results',
        'price-range': 'Price range:',
        'select-category': 'Select category',
        'next-page': 'Next page',
        'prev-page': 'Previous page',
        'preview': 'Preview',
        'product-details': 'Product details',
        'quantity': 'Quantity',
        'pieces': 'pieces available',
        'add-to-cart': 'Add to cart',
        'buy-now': 'Buy now',
        'confirm-purchase': 'Confirm purchase',
        'confirm-password': 'Confirm password',
        "purchaseConfirmationMessage": "Are you sure you want to buy {{quantity}} of {{productName}} for ${{price}}?",
        'per-row': 'per row',
        'review':'Review',
        'product-quantity': 'Product quantity',
        'write-review': 'Write your review here',
        'purchase-details': 'Purchase details',
        'amount': 'Amount',
        'total-price': 'Total price',
        'review-note': 'Review note',
        'review-comment': 'Review comment',
        'email': 'Email',
        'ordered-at': 'Ordered at',
        'shopping-cart':'Shopping cart',
        'view-detail': 'View details',
        'gird':'Gird',
        'list-product':'List',
        'password': 'Password',
        'do-not-account':'Do not have an account? Register',
        'full-name':'Full name',
        'address':'Address',
        'delete': 'Delete',
        'my-cart':'My cart',
        'recently-viewed': 'Recently Viewed',
        'ERROR':{
          'fetch-products': 'Failed to fetch products',
          'fetch-categories': 'Failed to fetch categories',
          'fetch-product-details': 'Failed to fetch product details',
          'fetch-purchase': 'Failed to fetch purchases',
          'fetch-purchase-details': 'Failed to fetch purchase details',
          'please-login': 'Please log in to buy products.',
          'purchase': 'Failed to purchase product',
          'please-review': 'Please provide a review note',
          'update-review': 'Failed to update review',
          'login-invalid': 'Invalid email or password',
          'login': 'Login failed. Please try again later.',
          'login-email': 'Please enter a valid email!',
          'is-required': '{{name}} is required',
          'password-not-match': 'Password do not match',
          'remove-from-cart':'Removing product from cart failed'

      

        },
        'SUCCESS':{
          'update-review': 'Review updated successfully',
          'purchase': 'Successfully purchased!',
          'login': 'Login successful, welcome {{name}}!',
          'register': 'Registration successful, please login!',
          'add-to-cart': 'Product added to cart!',
          'remove-from-cart': 'The product has been removed from the cart'

        }
      }
    },
    vi: {
      translation: {
        "list": "Danh sách sản phẩm",
        "home": "Trang chủ",
        "search": "Tìm kiếm sản phẩm...",
        'category': "Phân loại",
        'price': "Giá",
        'description': "Mô tả",
        'image': "Hình ảnh",
        'cancel': "Hủy",
        'save': "Lưu",
        'logout':'Đăng xuất',
        'hi':'Xin chào!',
        'purchase': 'Đơn hàng',
        'login': 'Đăng nhập',
        'register':'Đăng ký',
        'page':'Trang',
        'result': 'kết quả',
        'price-range': 'Giá từ:',
        'select-category': 'Chọn phân loại',
        'next-page':'Trang trước',
        'prev-page':'Trang sau',
        'preview': 'Xem trước',
        'product-details': 'Chi tiết sản phẩm',
        'quantity': 'Số lượng',
        'pieces': 'sản phẩm có sẵn',
        'add-to-cart': 'Thêm vào giỏ',
        'buy-now': 'Mua ngay',
        'confirm-password': 'Xác nhận mật khẩu',
        'confirm-purchase': 'Xác nhận mua hàng',
        "purchaseConfirmationMessage": "Bạn có chắc chắn muốn mua {{quantity}} của {{productName}} với giá ${{price}} không?",
        'per-row': 'mỗi hàng',
        'review': 'Đánh giá',
        'product-quantity': 'Chất lượng sản phẩm',
        'write-review': 'Viết đánh giá của bạn ở đây',     
       'purchase-details': 'Chi tiết đơn hàng',
       'amount': 'Số lượng',
       'total-price': 'Tổng tiền',
       'review-note': 'Đánh giá',
       'review-comment': 'Bình luận',
       'email': 'Email',
       'ordered-at': 'Đặt hàng lúc',
       'shopping-cart': 'Giỏ hàng',
        'gird':'Lưới',
        'view-detail': 'Xem chi tiết',
        'list-product':'Danh sách',
        'password':'Mật khẩu',
        'do-not-account':'Không có tài khoản? Đăng ký',
        'full-name':'Họ và tên',
        'address':'Địa chỉ',
        'my-cart':'Giỏ hàng của tôi',
        'delete': 'Xóa',
        'recently-viewed': 'Đã xem gần đây',
       'ERROR':{
          'fetch-products': 'Không tìm được sản phẩm',
          'fetch-categories': 'Không tìm được phân loại',
          'fetch-product-details': 'Không tìm được chi tiết sản phẩm',
          'fetch-purchase': 'Không tìm được đơn hàng',
          'fetch-purchase-details': 'Không tìm được chi tiết đơn hàng',
          'please-login': 'Vui lòng đăng nhập để mua sản phẩm.',
          'purchase': 'Không mua được sản phẩm',
          'please-review': 'Vui lòng cung cấp đánh giá sao',
          'update-review': 'Không cập nhật được bài đánh giá',
          'login-invalid': 'Email hoặc mật khẩu không hợp lệ',
          'login': 'Đăng nhập thất bại. Vui lòng thử lại sau.',
          'login-email': 'Vui lòng nhập email hợp lệ!',
          'is-required': '{{name}} là bắt buộc',
          'password-not-match': 'Mật khẩu không trùng khớp',
          'remove-from-cart':'Xóa sản phẩm khỏi giỏ hàng thất bại'


        },
        'SUCCESS':{
          'update-review': 'Đã cập nhật đánh giá thành công',
          'purchase': 'Mua hàng thành công!',
          'login': 'Đăng nhập thành công, chào mừng {{name}}!',
          'register': 'Đăng ký thành công, vui lòng đăng nhập!',
          'add-to-cart': 'Thêm vào giỏ thành công',
          'remove-from-cart': 'Sản phẩm đã được xóa khỏi giỏ hàng'

        }
      }
    }
  };

  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: "en",
      interpolation: {
        escapeValue: false
      }
    });

  export default i18n;
