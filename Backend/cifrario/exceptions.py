from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import ObjectDoesNotExist


def custom_exception_handler(exc, context):
    # Primero, maneja las excepciones de DRF
    response = exception_handler(exc, context)
    
    if response is not None:
        # Personaliza el error de token inválido
        if response.status_code == 401:
            if response.data.get('code') == 'token_not_valid':
                response.data = {
                    'error': 'Token inválido o no corresponde a este usuario.',
                    'status': 'unauthorized'
                }
        return response
    
    # Maneja ObjectDoesNotExist (incluye RelatedObjectDoesNotExist)
    if isinstance(exc, ObjectDoesNotExist):
        return Response({
            'error': str(exc),
            'status': 'not_found',
            'message': 'El recurso solicitado no existe'
        }, status=status.HTTP_404_NOT_FOUND)
    
    # Maneja excepciones específicas de relaciones
    if 'has no' in str(exc) and 'RelatedObjectDoesNotExist' in str(type(exc)):
        return Response({
            'error': str(exc),
            'status': 'not_found',
            'message': 'El recurso relacionado no existe'
        }, status=status.HTTP_404_NOT_FOUND)
    
    # Maneja otros errores no capturados por DRF
    return Response({
        'error': 'Error interno del servidor',
        'status': 'error',
        'message': str(exc) if hasattr(exc, '__str__') else 'Error desconocido'
    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



    #maneja excepción cuando el estudiante no tiene asignación de servicio social