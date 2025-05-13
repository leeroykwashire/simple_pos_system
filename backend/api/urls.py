from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token
from . import views

urlpatterns = [
    
    path('login/', views.LoginView.as_view(), name='login' ),

    path('users/', views.UserList_CreateView.as_view(), name='users' ),
    path('current-user/', views.CurrentUserView.as_view(), name='current-user' ),
    path('users/<int:user_id>/', views.User_Read_Update_Delete_View.as_view(), name='user' ),
    path('users/get-by-name/<str:username>/', views.Get_User_By_Name.as_view(), name='username' ),

    path('companies/', views.CompanyList_CreateView.as_view(), name='companies' ),
    path('companies/<int:company_id>/', views.Company_Read_Update_View.as_view(), name='company' ),
    path('companies/<int:company_id>/change_logo/', views.Update_Company_Logo.as_view(), name='company-logo' ),

    path('categories/', views.CategoryList_CreateView.as_view(), name='categories'),
    path('categories/<int:category_id>/', views.Category_Read_Update_Delete_View.as_view(), name='category'),

    path('products/', views.ProductList_CreateView.as_view(), name='products'),
    path('products/<int:product_id>/', views.Product_Read_Update_Delete_View.as_view(), name='product'),

    path('customers/', views.CustomerList_CreateView.as_view(), name='customers'),
    path('customers/<int:customer_id>/', views.Customer_Read_Update_Delete_View.as_view(), name='customer'), 

    path('sales/', views.SaleList_CreateView.as_view(), name='sales'),
    path('sales/<int:sale_id>/', views.Sale_Read_Update_Delete_View.as_view(), name='sale'),
    
    path('sales-today/', views.CurrentDaySales.as_view(), name='current-day-sales'),
    path('monthly-sales/<int:year>/', views.MonthlySalesView.as_view(), name='monthly-sales'),
    path('daily-sales/', views.DailySalesView.as_view(), name='daily-sales'),
    path('highest-selling-products-monthly/', views.HighestSellingProductMonthlyView.as_view(), name='top-monthly-sales'),
    path('top-ten-products-yearly/<int:year>/', views.TopTenProducts.as_view(), name='top-ten-products'),
    path('monthly-profits/<int:year>/', views.MonthlyProfits.as_view(), name='monthly-profits'),
    
    path('sale-items/', views.SaleItemList_CreateView.as_view(), name='sale_items'),
    path('sale-item/<int:sale_item_id>/', views.SaleItem_Update_Delete_View.as_view(), name='sale-item'),
    path('sale-items/<int:sale_id>/', views.SaleItem_Read_View.as_view()),

]