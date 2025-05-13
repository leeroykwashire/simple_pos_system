# import serializers from the REST framework
from rest_framework import serializers
# import the data models
from .models import User, Category, Product, Customer, Sale, SaleItem, Company

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            email=validated_data['email'],
            is_staff=validated_data['is_staff'],
            is_active=validated_data['is_active']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user
    
    class Meta:
        model = User
        fields = ('id', 'last_login','is_superuser', 'username', 'first_name', 'last_name', 'email', 'is_staff',
        'date_joined','is_active','password')
        extra_kwargs = {'password': {'write_only': True}}


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'        

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product 
        fields = '__all__'
    
class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'

class SaleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sale
        fields = '__all__'

class SaleItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = SaleItem
        fields = '__all__'