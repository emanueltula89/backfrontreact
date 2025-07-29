import os
import json
from fastapi import FastAPI
from pydantic import BaseModel
import gspread
from google.oauth2 import service_account
from fastapi.middleware.cors import CORSMiddleware # Importar CORSMiddleware

# --- Configuración ---
# Define los alcances (permisos) que necesitamos
SCOPE = [
    "https://www.googleapis.com/auth/spreadsheets",
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/drive'
]

# Ruta al archivo de credenciales dentro del contenedor
CREDENTIALS_FILE_PATH = "/app/google_credentials.json"

# Carga las credenciales desde el archivo JSON
if not os.path.exists(CREDENTIALS_FILE_PATH):
    raise FileNotFoundError(f"El archivo de credenciales no se encontró en: {CREDENTIALS_FILE_PATH}")

creds = service_account.Credentials.from_service_account_file(CREDENTIALS_FILE_PATH, scopes=SCOPE)

# Autoriza al cliente de gspread
client = gspread.authorize(creds)

# Abre la hoja de cálculo por su nombre
# Asegúrate de que este nombre coincida EXACTAMENTE con el nombre de tu hoja de cálculo
spreadsheet = client.open("mi-app-datos") # <--- ¡IMPORTANTE! Cambia esto al nombre de tu hoja
worksheet = spreadsheet.sheet1

# --- Modelos de Datos ---
class FormSubmission(BaseModel):
    nombre: str
    email: str
    mensaje: str

# --- API ---
app = FastAPI()

# Configuración de CORS
origins = [
    "http://localhost:3000",  # Permitir peticiones desde tu frontend de React
    "http://localhost",
    "http://localhost:8000", # Para probar la API directamente
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Permitir todos los métodos (GET, POST, etc.)
    allow_headers=["*"],  # Permitir todas las cabeceras
)

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/submit")
def submit_form(submission: FormSubmission):
    """
    Recibe los datos del formulario y los guarda en la hoja de cálculo.
    """
    new_row = [submission.nombre, submission.email, submission.mensaje]
    worksheet.append_row(new_row)
    return {"message": "Datos recibidos y guardados en Google Sheets"}

@app.get("/entries")
def get_entries():
    """
    Obtiene todas las entradas de la hoja de cálculo.
    """
    records = worksheet.get_all_records()
    return records