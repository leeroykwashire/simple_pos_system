from django.db import models
from datetime import datetime

# Create your models here.
from django.db import models
from django.contrib.auth.models import User

class Company(models.Model):
    name = models.CharField(max_length=255)
    address = models.TextField()
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    logo = models.ImageField(upload_to='company_logos/', blank=True)

    def __str__(self):
        return self.name
    
class Category(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name
    
class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, default=None)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    cost_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    stock_quantity = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name

class Customer(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(blank=True)
    phone_number = models.CharField(max_length=15, blank=True)
    deleted = models.BooleanField(default=False)

    def __str__(self):
        return self.name

class Sale(models.Model):
    date_time = models.DateTimeField(auto_now_add=True)
    sub_total = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    grand_total = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    deleted = models.BooleanField(default=False)

    def __str__(self):
        return f"Sale ID: {self.id} - Date: {self.date_time.strftime('%Y-%m-%d')}"


class SaleItem(models.Model):
    sale = models.ForeignKey(Sale, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    deleted = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.quantity}x {self.product.name} (Sale ID: {self.sale.id})"
