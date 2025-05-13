from django.contrib import admin

# import the models
from .models import Category, Product, Customer, Sale, SaleItem, Company
 
# create a class for the admin-model integration
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('name', 'address', 'phone_number', 'logo')
admin.site.register(Company, CompanyAdmin)

class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)
admin.site.register(Category, CategoryAdmin)   

class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'price', 'category', 'cost_price', 'stock_quantity')
admin.site.register(Product, ProductAdmin)

class CustomerAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone_number', 'deleted')
admin.site.register(Customer, CustomerAdmin)

class SaleAdmin(admin.ModelAdmin):
    list_display = ('date_time', 'sub_total', 'user', 'deleted')
admin.site.register(Sale, SaleAdmin)

class SaleItemAdmin(admin.ModelAdmin):
    list_display = ('sale', 'product', 'quantity', 'deleted')
admin.site.register(SaleItem, SaleItemAdmin)