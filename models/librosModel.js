//  Todas las interacciones que tengamos de la base de datos con respecto a la tabla de usuarios, la va a venir a buscar aca
var pool = require ('./bd'); // llamando datos BD



async function getLibros(){
var query = 'select * from libros';
var rows = await pool.query(query);
return rows;
}

async function insertLibro(obj){
    try{
        var query = 'insert into libros set?';
        var rows = await pool.query(query, [obj]);
        return rows ;
    } catch ( error) {
        console.log(error);
        throw error
    }
}

async function deleteLibro(id){
    var query = 'delete from libros where id=?';
    var rows = await pool.query(query, [id]);
    return rows;
    }

async function getLibrosByID(id){
    var query = 'select * from libros where id= ?' ;
    var rows = await pool.query(query,[id]);
    return rows [0];
}

async function modifyLibroById(obj,id){
    try{
        var query = 'update libros set ? where id= ?';
        var rows = await pool.query(query, [obj,id]);
        return rows;
    } catch (error) {
        throw error;
    }
}


module.exports= {getLibros, insertLibro, deleteLibro, getLibrosByID, modifyLibroById}