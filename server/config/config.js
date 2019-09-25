//====================================
// Puerto
//====================================

process.env.PORT = process.env.PORT || 3000

//====================================
// Entorno
//====================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//====================================
// Vencimiento del Token
//====================================
// 60 segundos 60 minutos 24 horas 30 dias

process.env.CADUCIDAD_TOKEN = '48h';

//====================================
// SEED de autenticacion produccion/dessarollo
//====================================

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

//====================================
// Base de datos
//====================================
let urlDB;
if(process.env.NODE_ENV === 'dev') {
  urlDB = 'mongodb://localhost:27017/elsgallsweb'
}else {
  urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

//====================================
// Google Client ID
//====================================

process.env.CLIENT_ID = process.env.CLIENT_ID || '552773007315-5bs1vem54dgc8b6bcrvm4qi06lha0nk1.apps.googleusercontent.com'

