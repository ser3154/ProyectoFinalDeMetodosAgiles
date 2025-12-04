# ProyectoFinalDeMetodosAgiles
Integrantes del equipo:
-Servando Contreras 245578
-Luis roberto 246853
-Juventino Lopez 248547
-Carlos Eduardo 247590

Ejecucion: 
- Instalar dependencias del Servicio de Autenticación:
cd ProyectoDeAgiles
npm install express mongoose bcryptjs jsonwebtoken express-validator dotenv cors

-  Instalar dependencias del Servicio de Experiencias:
cd ../servicio-experiencias
npm install express mongoose cors dotenv express-validator multer

- Crea archivo .env en ProyectoDeAgiles/:
MONGODB_URI=mongodb://localhost:27017/experiencias_turisticas
JWT_SECRET=tu_clave_secreta_aqui
JWT_EXPIRE=7d
PORT=3001

- Crea archivo .env en servicio-experiencias/:
MONGODB_URI=mongodb://localhost:27017/experiencias_turisticas
PORT=3002

Ejecucion:
- Servicio de Autenticación:
cd ProyectoDeAgiles
node src/app.js

-  Servicio de Experiencias:
cd servicio-experiencias
node app.js

- Frontend:
cd ProyectoDeAgiles/Frontend
python -m http.server 8000


Links del git y kanban:
- https://github.com/ser3154/ProyectoFinalDeMetodosAgiles
- https://kanbanflow.com/board/H2CFgTi

