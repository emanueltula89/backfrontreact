# 1. Usar una imagen oficial de Python como base
FROM python:3.9-slim

# 2. Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# 3. Copiar el archivo de requisitos primero para aprovechar el cache de Docker
COPY requirements.txt requirements.txt

# 4. Instalar las dependencias
RUN pip install --no-cache-dir -r requirements.txt

# 5. Copiar el archivo de credenciales JSON al contenedor
COPY google_credentials.json google_credentials.json

# 6. Copiar el resto del código de la aplicación
COPY . .

# 7. Exponer el puerto en el que se ejecutará la aplicación
EXPOSE 8000

# 8. Comando para ejecutar la aplicación
# Se usa --host 0.0.0.0 para que la API sea accesible desde fuera del contenedor
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]