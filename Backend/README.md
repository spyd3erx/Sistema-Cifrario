# Sistema Cifrario

## Requisitos:
- python 3.13
- pip3

## Replicar ambiente:
 ```
    python -m venv .venv

    .venv\Scripts\activate

    pip install -r requirements.txt
```

## Correr Migraciones

```sh
python manage.py makemigrations
python manage.py migrate
```

## Crear Institucion
```sh
python manage.py crear_institucion --nombre "Colegio de Prueba Cifrario" --usuario admincifrario --email admin@cifrario.edu --password cifrario2025
```

## Levantar el Servidor

```sh
python manage.py runserver
```
