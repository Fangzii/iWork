from django.contrib import admin

# Register your models here.
from .models import Career, UserProfile

class CareerAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')

admin.site.register(Career, CareerAdmin)
admin.site.register(UserProfile)