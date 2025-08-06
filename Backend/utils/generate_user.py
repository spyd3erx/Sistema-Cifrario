import unicodedata

# Funcion para eliminar acentos de la cadena
def remove_accents(cadena):
  return ''.join(c for c in unicodedata.normalize('NFD', cadena)
                 if unicodedata.category(c) != 'Mn')


# Funcion para generar el usuario
def generate_user(instance):
    return remove_accents(instance.primer_nombre+instance.primer_apellido+instance.identificacion[-3:])