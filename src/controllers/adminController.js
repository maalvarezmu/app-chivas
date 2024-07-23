const controller = {};

function libre(conn, fecha, hora, chiva, duracion) {
    return new Promise((resolve, reject) => {
        let inicio = new Date(fecha+' 00:00:00');
        let fin = new Date(fecha+' 00:00:00');
        inicio.setHours(hora.slice(0, 2));
        inicio.setMinutes(hora.slice(3, 5));
        fin.setHours(hora.slice(0, 2));
        fin.setMinutes(hora.slice(3, 5));
        fin.setTime(fin.getTime() + (parseInt(duracion)+24)*60*60*1000);

        const checkChivaDisponibilidad = new Promise((resolve, reject) => {
            conn.query('SELECT estado FROM chivas WHERE id = ?', [chiva], (err, results) => {
                resolve(results[0].estado === 'disponible');
            });
        });

        const obtenerViajesChiva = new Promise((resolve, reject) => {
            conn.query('SELECT v.fecha, v.hora, v.duracion FROM chiva_has_viaje cv INNER JOIN viajes v ON cv.viaje = v.id WHERE cv.chiva = ?', [chiva], (err, rows) => {
                resolve(rows);
            });
        });

        Promise.all([checkChivaDisponibilidad, obtenerViajesChiva])
            .then(([chivaDisponible, viajes]) => {
                if (!chivaDisponible)return resolve(false);
                for (let row of viajes) {
                    let inicio2 = new Date(row.fecha);
                    let fin2 = new Date(row.fecha);
                    inicio2.setHours(row.hora.slice(0, 2));
                    inicio2.setMinutes(row.hora.slice(3, 5));
                    fin2.setHours(row.hora.slice(0, 2));
                    fin2.setMinutes(row.hora.slice(3, 5));
                    fin2.setTime(fin2.getTime() + (parseInt(row.duracion)+24)*60*60*1000);
                    if ((inicio >= inicio2 && inicio < fin2) ||
                        (fin > inicio2 && fin <= fin2) ||
                        (inicio2 >= inicio && inicio2 < fin) ||
                        (fin2 > inicio && fin2 <= fin)) {
                            return resolve(false);
                    }
                }
                resolve(true);
            });
    });
}


function libre2(conn, fecha, hora, chiva, duracion) {
    return new Promise((resolve, reject) => {
        let inicio = new Date(fecha);
        let fin = new Date(fecha);
        inicio.setHours(hora.slice(0, 2));
        inicio.setMinutes(hora.slice(3, 5));
        fin.setHours(hora.slice(0, 2));
        fin.setMinutes(hora.slice(3, 5));
        fin.setTime(fin.getTime() + (parseInt(duracion)+24)*60*60*1000);

        const checkChivaDisponibilidad = new Promise((resolve, reject) => {
            conn.query('SELECT estado FROM chivas WHERE id = ?', [chiva], (err, results) => {
                resolve(results[0].estado === 'disponible');
            });
        });

        const obtenerViajesChiva = new Promise((resolve, reject) => {
            conn.query('SELECT v.fecha, v.hora, v.duracion FROM chiva_has_viaje cv INNER JOIN viajes v ON cv.viaje = v.id WHERE cv.chiva = ?', [chiva], (err, rows) => {
                resolve(rows);
            });
        });

        Promise.all([checkChivaDisponibilidad, obtenerViajesChiva])
            .then(([chivaDisponible, viajes]) => {
                if (!chivaDisponible)return resolve(false);
                for (let row of viajes) {
                    let inicio2 = new Date(row.fecha);
                    let fin2 = new Date(row.fecha);
                    inicio2.setHours(row.hora.slice(0, 2));
                    inicio2.setMinutes(row.hora.slice(3, 5));
                    fin2.setHours(row.hora.slice(0, 2));
                    fin2.setMinutes(row.hora.slice(3, 5));
                    fin2.setTime(fin2.getTime() + (parseInt(row.duracion)+24)*60*60*1000);
                    if ((inicio >= inicio2 && inicio < fin2) ||
                        (fin > inicio2 && fin <= fin2) ||
                        (inicio2 >= inicio && inicio2 < fin) ||
                        (fin2 > inicio && fin2 <= fin)) {
                            return resolve(false);
                    }
                }
                resolve(true);
            });
    });
}

function solveReemplazo(conn, viaje, chivaId, chivas, chivaCapacidad) {
    return new Promise((resolve, reject) => {
        const verificarDisponibilidad = chiva => {
            return new Promise((resolve, reject) => {
                libre2(conn, viaje.fecha, viaje.hora, chiva.id, viaje.duracion)
                    .then(isLibre => {
                        resolve(isLibre && chiva.capacidad == chivaCapacidad);
                    })
            });
        };

        const promises = chivas.map(chiva => verificarDisponibilidad(chiva));
        Promise.all(promises)
            .then(results => {
                let idx = results.findIndex(result => result);
                if (idx == -1) {
                    resolve(null);
                } else {
                    const chivaDisponible = chivas[idx];
                    conn.query('UPDATE chiva_has_viaje SET chiva = ? WHERE viaje = ?', [chivaDisponible.id, viaje.id], (err, result) => {
                        conn.query('UPDATE viajes SET chiva = ? WHERE id = ?', [chivaDisponible.id, viaje.id], (err, result) => {
                            resolve(chivas[idx].id);
                        });
                    });
                }
            })
    });
}

function reemplazo(conn, viajes, chivaId, chivaCapacidad) {
    return new Promise((resolve, reject) => {
        conn.query('SELECT * FROM chivas WHERE id != ? AND capacidad = ?', [chivaId, chivaCapacidad], (err, chivas) => {
            const promises = viajes.map(viaje => {
                return solveReemplazo(conn, viaje, chivaId, chivas, chivaCapacidad)
                    .then(result => {
                        if (result === null) {
                            conn.query('DELETE FROM chiva_has_viaje WHERE viaje = ?', [viaje], (err, result) => {
                                conn.query('DELETE FROM viajes WHERE id = ?', [viaje.id], (err, result) => {
                                    console.log(`Viaje ${viaje.id} eliminado por falta de chiva disponible.`);
                                    return Promise.resolve();
                                });
                            });
                        } else {
                            console.log(`Viaje ${viaje.id} reemplazado con chiva ${result}.`);
                            return Promise.resolve();
                        }
                    });
            });

            Promise.all(promises).then(() => resolve());
        });
    });
}

controller.menu = (req, res) => {
    res.render('admin-menu');
};

controller.trips = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT viajes.*, chivas.matricula FROM viajes INNER JOIN chivas ON viajes.chiva = chivas.id', (err, data) => {
            if (err) {
                res.json(err);
            }
            res.render('admin-trips', {
                trips: data,
            });
        });
    });
};

controller.save = (req, res) => {
    const data = req.body;
    req.getConnection((err, conn) => {
        libre(conn, data.fecha, data.hora, data.chiva, data.duracion)
        .then((libre) => {
            if (libre) {
                conn.query('SELECT * FROM chivas WHERE id = ?', [data.chiva], (err, chiva) => {
                    data.tiquetes_disponibles = chiva[0].capacidad;
                    conn.query('INSERT INTO viajes SET ?', [data], (err, rows) => {
                        conn.query('INSERT INTO chiva_has_viaje SET ?', { chiva: data.chiva, viaje: rows.insertId});
                        res.redirect('/admin/trips');
                    });
                });
            } else {
                const query = `?message=chiva&fecha=${data.fecha}&hora=${data.hora}&duracion=${data.duracion}&origen=${data.origen}&destino=${data.destino}&precio=${data.precio}`;
                res.redirect('/admin/trips/create'+query);
            }
        })
    });
};

controller.create = (req, res) => {
    const { message, fecha, hora, chiva, duracion, origen, destino, precio } = req.query;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM chivas', (err, chivas) => {
            const data = {};
            if (message) data.message = message;
            if (fecha) data.fecha = fecha;
            if (hora) data.hora = hora;
            if (chiva) data.chiva = chiva;
            if (duracion) data.duracion = duracion;
            if (origen) data.origen = origen;
            if (destino) data.destino = destino;
            if (precio) data.precio = precio;
            res.render('admin-create-trip', {
                chivas: chivas,
                data: data  
            });
        });
    });
};


controller.edit = (req, res) => {
    const { id } = req.params;
    const { message } = req.query;
    var data = {};
    if (message) data.message = message;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM viajes WHERE id = ?', [id], (err, trip) => {
            conn.query('SELECT * FROM chivas', (err, chivas) => {
                res.render('admin-edit-trip', {
                    trip: trip[0],
                    chivas: chivas,
                    data: data
                });
            });
        });
    });
};

controller.update = (req, res) => {
    const { id } = req.params;
    const newTrip = req.body;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM chivas WHERE id = ?', [parseInt(newTrip.chiva)], (err, chiva) => {
            newTrip.tiquetes_disponibles = chiva[0].capacidad;
            conn.query('DELETE FROM chiva_has_viaje WHERE viaje = ?', [id]);
            conn.query('DELETE FROM tiquetes WHERE viaje = ?', [id]);
            libre(conn, newTrip.fecha, newTrip.hora, newTrip.chiva, newTrip.duracion)
            .then((libre) => {
                if (libre) {
                    conn.query('UPDATE viajes set ? WHERE id = ?', [newTrip, id], (err, rows) => {
                        res.redirect('/admin/trips');
                    });
                    conn.query('INSERT INTO chiva_has_viaje SET ?', { chiva: newTrip.chiva, viaje: id});
                } else {
                    res.redirect('/admin/trips/edit/'+id+'?message=chiva');
                }
            });
        });
    });
};

controller.delete = (req, res) => {
    const { id } = req.params;
    req.getConnection((err, conn) => {
        conn.query('DELETE FROM chiva_has_viaje WHERE viaje = ?', [id]);    
        conn.query('DELETE FROM viajes WHERE id = ?', [id], (err, rows) => {
            res.redirect('/admin/trips');
        });
    });
};

controller.chivas = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM chivas', (err, data) => {
            res.render('admin-chivas', {
                chivas: data,
            });
        });
    });
};

controller.createChiva = (req, res) => {
    res.render('admin-create-chiva');
};

controller.saveChiva = (req, res) => {
    const data = req.body;
    req.getConnection((err, conn) => {
        conn.query('INSERT INTO chivas SET ?', [data], (err, rows) => {
            res.redirect('/admin/chivas');
        });
    });
};

controller.editChiva = (req, res) => {
    const { id } = req.params;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM chivas WHERE id = ?', [id], (err, chiva) => {
            res.render('admin-edit-chiva', {
                chiva: chiva[0],
            });
        });
    });
};

controller.updateChiva = (req, res) => {    
    const { id } = req.params;
    const newChiva = req.body;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM viajes WHERE chiva=?', [id], (err, viajes) => {
            if (viajes.length == 0) {
                conn.query('UPDATE chivas set ? WHERE id = ?', [newChiva, id], (err, rows) => {
                    res.redirect('/admin/chivas');
                });
            } else {
                conn.query('SELECT * FROM chivas WHERE id=?', [id], (err, chiva) => {
                    if(chiva[0].capacidad != newChiva.capacidad || chiva[0].estado != newChiva.estado) {
                        reemplazo(conn, viajes, id, chiva[0].capacidad)
                        .then(() => {
                            conn.query('UPDATE chivas set ? WHERE id = ?', [newChiva, id], (err, rows) => {
                                res.redirect('/admin/chivas');
                            });
                        });
                    } else {
                        conn.query('UPDATE chivas set ? WHERE id = ?', [newChiva, id], (err, rows) => {
                            res.redirect('/admin/chivas');
                        });
                    }
                });
            }
        });
    });
};

controller.deleteChiva = (req, res) => {    
    const { id } = req.params;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM viajes WHERE chiva=?', [id], (err, viajes) => {
            if (viajes.length == 0) {
                conn.query('DELETE FROM chivas WHERE id = ?', [id], (err, rows) => {
                    res.redirect('/admin/chivas');
                });
            } else {
                conn.query('SELECT * FROM chivas WHERE id=?', [id], (err, chiva) => {
                    reemplazo(conn, viajes, id, chiva[0].capacidad)
                    .then(() => {
                        conn.query('DELETE FROM chivas WHERE id = ?', [id], (err, rows) => {
                            res.redirect('/admin/chivas');
                        });
                    });
                });
            }
        });
    });
};

module.exports = controller;