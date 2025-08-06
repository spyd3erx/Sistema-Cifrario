from rest_framework import serializers
from .models import HorasRegistradas

class HorasRegistradasSerializer(serializers.ModelSerializer):
    evidencia_url = serializers.SerializerMethodField()

    class Meta:
        model = HorasRegistradas
        fields = '__all__'
        read_only_fields = ['estado', 'estudiante']
        extra_kwargs = {
            'servicio_social': {'required': False},
            'evidencia': {'required': False, 'allow_null': True},
        }

    def get_evidencia_url(self, obj):
        if obj.evidencia:
            return obj.evidencia.url
        return ""


class HorasSupervisorSerializer(serializers.ModelSerializer):
    class Meta:
        model = HorasRegistradas
        fields = '__all__'


