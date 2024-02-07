from django.contrib import admin

# Register your models here.
from .models import Template

# Register your models here.
# class TemplateAdmin(admin.ModelAdmin):
    # list_display = ('user', 'amount')

admin.site.register(Template)