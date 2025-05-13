from rest_framework.decorators import api_view
from decimal import Decimal
from calendar import month_abbr
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models.functions import ExtractMonth, TruncDay, TruncMonth, ExtractYear
from datetime import date, datetime
from django.utils import timezone
from django.db.models import Sum, F, Q, Case, When, FloatField
from .models import User, Category, Product, Customer, Sale, SaleItem, Company
from .serializers import UserSerializer, CategorySerializer, ProductSerializer, CustomerSerializer, SaleSerializer, SaleItemSerializer, CompanySerializer
from rest_framework.permissions import IsAdminUser, IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from rest_framework.authentication import TokenAuthentication, SessionAuthentication


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({'detail': 'Username and password are required'}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=username, password=password)
        if not user:
            print(f"Authentication failed for username: {username}")
            return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

        print(f"Authenticated user: {user.username}, is_active: {user.is_active}")

        token, created = Token.objects.get_or_create(user=user)
        print(f"Token created: {created}, Token: {token}")

        return Response({'token': str(token), 'user': str(user.username), 'isAdmin': bool(user.is_superuser)}, status=status.HTTP_200_OK)

class UserList_CreateView(APIView):
    
    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CurrentUserView(APIView):
    authentication_classes = (TokenAuthentication, SessionAuthentication)
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            'username': user.username,
        })
        
class User_Read_Update_Delete_View(APIView):
    def get(self, request, user_id):
        try:
            user = User.objects.get(pk=user_id)
            serializer = UserSerializer(user)
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
    def put(self, request, user_id):
        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  
 
    def delete(self, request, user_id):
        try:
            user = User.objects.get(pk=user_id)
            user.delete()
            return Response({'message': 'User deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
class Get_User_By_Name(APIView):
    def get(self, request, username):
        try:
            user = User.objects.get(username=username)
            serializer = UserSerializer(user)
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

class CompanyList_CreateView(APIView):
    def get(self, request):
        companies = Company.objects.all()
        serializer = CompanySerializer(companies, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CompanySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class Company_Read_Update_View(APIView):
    permission_classes = [IsAdminUser]
    def get(self, request, company_id):
        try:
            company = Company.objects.get(pk=company_id)
            serializer = CompanySerializer(company)
            return Response(serializer.data)
        except Company.DoesNotExist:
            return Response({'error': 'Company not found'}, status=status.HTTP_404_NOT_FOUND)
 
       
    def put(self, request, company_id):
        try:
            company = Company.objects.get(pk=company_id)
        except Company.DoesNotExist:
            return Response({'error': 'Company not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = CompanySerializer(company, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 

class Update_Company_Logo(APIView):
    def post(self, request, company_id):
        company = Company.objects.get(id=company_id)
        logo = next(iter(request.FILES.values()), None)
        if logo:
            company.logo = logo
            company.save()

        serializer = CompanySerializer(company)
        return Response(serializer.data, status=status.HTTP_200_OK)  

class CategoryList_CreateView(APIView):  
    def get(self, request):  
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class Category_Read_Update_Delete_View(APIView):
    def get(self, request, category_id):
        try:
            category = Category.objects.get(pk=category_id)
            serializer =CategorySerializer(category)
            return Response(serializer.data)
        except Category.DoesNotExist:
            return Response({'error': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, category_id):
        try:
            category = Category.objects.get(pk=category_id)
            category.delete()
            return Response({'message': 'Category deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except Category.DoesNotExist:
            return Response({'error': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)
        
    def put(self, request, category_id):
        try:
            category = Category.objects.get(pk=category_id)
        except Category.DoesNotExist:
            return Response({'error': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = CategorySerializer(category, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProductList_CreateView(APIView):  
    def get(self, request):  
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class Product_Read_Update_Delete_View(APIView):
    def get(self, request, product_id):
        try:
            product = Product.objects.get(pk=product_id)
            serializer =ProductSerializer(product)
            return Response(serializer.data)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)    
        
    def delete(self, request, product_id):
        try:
            product = Product.objects.get(pk=product_id)
            product.delete()
            return Response({'message': 'Product deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
        
    def put(self, request, product_id):
        try:
            product = Product.objects.get(pk=product_id)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = ProductSerializer(product, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, product_id):
        try:
            product = Product.objects.get(pk=product_id)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

        quantity = request.data.get('quantity')
        if quantity is not None:
            product.stock_quantity += int(quantity)
            product.save()
            serializer = ProductSerializer(product)
            return Response(serializer.data)
        else:
            return Response({'error': 'Quantity not provided'}, status=status.HTTP_400_BAD_REQUEST)

class CustomerList_CreateView(APIView):  
    def get(self, request):  
        customers = Customer.objects.all()
        serializer = CustomerSerializer(customers, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = CustomerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class Customer_Read_Update_Delete_View(APIView):
    def get(self, request, customer_id):
        try:
            customer = Customer.objects.get(pk=customer_id)
            serializer =CustomerSerializer(customer)
            return Response(serializer.data)
        except Customer.DoesNotExist:
            return Response({'error': 'Customer not found'}, status=status.HTTP_404_NOT_FOUND)
            
    def delete(self, request, customer_id):
        try:
            customer = Customer.objects.get(pk=customer_id)
            customer.delete()
            return Response({'message': 'Customer deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except Customer.DoesNotExist:
            return Response({'error': 'Customer not found'}, status=status.HTTP_404_NOT_FOUND)
        
    def put(self, request, customer_id):
        try:
            customer = Customer.objects.get(pk=customer_id)
        except Customer.DoesNotExist:
            return Response({'error': 'Customer not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = CustomerSerializer(customer, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SaleList_CreateView(APIView):  
    def get(self, request):  
        sales = Sale.objects.all()
        serializer = SaleSerializer(sales, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = SaleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class Sale_Read_Update_Delete_View(APIView):
    def get(self, request, sale_id):
        try:
            sale = Sale.objects.get(pk=sale_id)
            serializer =SaleSerializer(sale)
            return Response(serializer.data)
        except Sale.DoesNotExist:
            return Response({'error': 'Sale not found'}, status=status.HTTP_404_NOT_FOUND)
            
    def delete(self, request, sale_id):
        try:
            sale = Sale.objects.get(pk=sale_id)
            sale.delete()
            return Response({'message': 'Sale deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except Sale.DoesNotExist:
            return Response({'error': 'Sale not found'}, status=status.HTTP_404_NOT_FOUND)
        
    def put(self, request, sale_id):
        try:
            sale = Sale.objects.get(pk=sale_id)
        except Sale.DoesNotExist:
            return Response({'error': 'Sale not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = SaleSerializer(sale, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CurrentDaySales(APIView):
    def get(self, request):
        today_start = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)
        today_end = timezone.now().replace(hour=23, minute=59, second=59, microsecond=999999) 


        sales = Sale.objects.filter(date_time__gte=today_start, date_time__lte=today_end)
        serializer = SaleSerializer(sales, many=True)
        return Response(serializer.data)
    
class MonthlySalesView(APIView):
    def get(self, request, year):
        year = int(year)
        sales = Sale.objects.filter(date_time__year=year)
        monthly_sales = sales.values(month=ExtractMonth('date_time')).annotate(
            total_sales=Sum('sub_total')
        )

        return Response(list(monthly_sales), status=status.HTTP_200_OK)
    

class DailySalesView(APIView):
    def get(self, request):
        today = date.today()
        first_day_of_month = today.replace(day=1)

        sales = Sale.objects.filter(date_time__gte=first_day_of_month)

        daily_sales = sales.annotate(
            day=TruncDay('date_time')
        ).values('day').annotate(
            total_sales=Sum('sub_total')
        ).order_by('day')
        return Response(list(daily_sales), status=status.HTTP_200_OK)

class HighestSellingProductMonthlyView(APIView):
    def get(self, request):
        monthly_sales = SaleItem.objects.values('sale__date_time__month', 'product_id') \
            .annotate(total_quantity=Sum('quantity')) \
            .order_by('sale__date_time__month', '-total_quantity')

        # Convert queryset to a dictionary for easier access
        result = {}
        for item in monthly_sales:
            month = item['sale__date_time__month']
            if month not in result:
                result[month] = {
                    'most_sold_product_id': item['product_id'],
                    'total_quantity': item['total_quantity']
                }
        return Response(result, status=status.HTTP_200_OK)    

class TopTenProducts(APIView): 
    def get(self, request, year):
        top_products = SaleItem.objects.filter(sale__date_time__year=year) \
            .values('product_id') \
            .annotate(total_quantity=Sum('quantity')) \
            .order_by('-total_quantity')[:10]

        result = {}
        for product in top_products:
            result[product['product_id']] = product['total_quantity']

        return Response(result, status=status.HTTP_200_OK)
    
class MonthlyProfits(APIView):
    def get(self, request, year):
        monthly_data = SaleItem.objects.filter(sale__date_time__year=year) \
            .values('sale__date_time__month') \
            .annotate(
                total_revenue=Sum(F('quantity') * F('product__price')),
                total_cost=Sum(F('quantity') * F('product__cost_price'))
            ) \
            .order_by('sale__date_time__month')

        results = {}
        for item in monthly_data:
            month = item['sale__date_time__month']
            results[month] = item['total_revenue'] - item['total_cost']

        return Response(results, status=status.HTTP_200_OK)


class SaleItemList_CreateView(APIView):
    def get(self, request):  
        sale_items = SaleItem.objects.all()
        serializer = SaleItemSerializer(sale_items, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = SaleItemSerializer(data=request.data)
        if serializer.is_valid():
            # Get product object from request data
            product_id = request.data.get('product')  # Assuming product ID is in request data
            product = Product.objects.get(pk=product_id)

            # Check if quantity is sufficient
            if product.stock_quantity < request.data.get('quantity'):
                return Response({'error': 'Insufficient stock quantity'}, status=status.HTTP_400_BAD_REQUEST)

            # Reduce stock quantity and save product
            product.stock_quantity -= request.data.get('quantity')
            product.save()

            # Save SaleItem with updated product
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SaleItem_Read_View(APIView):
    def get(self, request, sale_id):
        try:
            sale_items = SaleItem.objects.filter(sale=sale_id)
            serializer = SaleItemSerializer(sale_items, many=True)
            return Response(serializer.data)
        except SaleItem.DoesNotExist:
            return Response({'error': 'Sale items not found'}, status=status.HTTP_404_NOT_FOUND)
        
class SaleItem_Update_Delete_View(APIView):
            
    def delete(self, request, sale_item_id):
        try:
            sale_item = SaleItem.objects.get(pk=sale_item_id)
            sale_item.delete()
            return Response({'message': 'Sale item deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except SaleItem.DoesNotExist:
            return Response({'error': 'Sale item not found'}, status=status.HTTP_404_NOT_FOUND)
        
    def patch(self, request, sale_item_id):
        try:
            sale_item = SaleItem.objects.get(pk=sale_item_id)
        except SaleItem.DoesNotExist:
            return Response({'error': 'Sale item not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = SaleItemSerializer(sale_item, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


