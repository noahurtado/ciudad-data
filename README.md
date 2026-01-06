# Inicializar proyecto
npm init -y

# Typescript y herramientas de desarrollo
npm install --save-dev typescript ts-node ts-node-dev @types/node

# Express y middlewares
npm install express cors
npm install --save-dev @types/express @types/cors

# MongoDB
npm install mongoose

# Axios para llamadas HTTP
npm install axios

# Swagger para documentación
npm install swagger-ui-express

# Utilidades varias
npm install dotenv

# Para probarlo
node --loader ts-node/esm ./src/index.ts

# Swagger
http://localhost:3000/api-docs