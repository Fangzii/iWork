from django.contrib import admin

# Register your models here.
from .models import Fee

# Register your models here.
class FeeAdmin(admin.ModelAdmin):
    list_display = ('user', 'amount')

admin.site.register(Fee, FeeAdmin)