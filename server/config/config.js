//====================================
// Puerto
//====================================

process.env.PORT = process.env.PORT || 3000

//====================================
// Entorno
//====================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//====================================
// Base de datos
//====================================
let urlDB;
if(process.env.NODE_ENV === 'dev') {
  urlDB = 'mongodb://localhost:27017/elsgallsweb'
}else {
  urlDB = 'mongodb+srv://llorens:aoTBbp0zd4DgNSeq@cluster0-2qh5y.mongodb.net/ElsGallsWeb'
}

process.env.URLDB = urlDB;

