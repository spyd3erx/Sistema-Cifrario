from .base import *
from cifrario.config.env import env

DEBUG = env.bool('DJANGO_DEBUG', default=False)
ALLOWED_HOSTS += env.list('ALLOWED_HOSTS')


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': env.str('DB_NAME'),
        'USER': env.str('DB_USER'),
        'PASSWORD': env.str('DB_PASSWORD'),
        'HOST': env.str('DB_HOST'),
        'PORT': env.str('DB_PORT', default='3306'),
        'OPTIONS': {
            'charset': 'utf8mb4',
        },
    }
}