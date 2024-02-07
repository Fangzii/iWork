from rest_framework import serializers
from .models import Template
class TemplateSerializer(serializers.ModelSerializer):
    params = serializers.SerializerMethodField()

    class Meta:
        model = Template
        fields = '__all__'

    def get_params(self, template):
        try:
            return template.get_key_words
        except Exception as e:
            return []