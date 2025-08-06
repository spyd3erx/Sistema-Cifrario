"""
ASGI config for cifrario project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/asgi/
"""

import os
from cifrario.config.env import env
from django.core.asgi import get_asgi_application
from whitenoise import WhiteNoise

os.environ.setdefault('DJANGO_SETTINGS_MODULE', env('DJANGO_SETTINGS_MODULE', default='cifrario.config.django.local'))

application = get_asgi_application()

application = WhiteNoise(application)
