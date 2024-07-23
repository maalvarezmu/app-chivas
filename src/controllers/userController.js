const controller = {};
const imagesPaths =  [
    "/images/p1.jpg",
    "/images/p2.jpg",
    "/images/p3.jpg",
    "/images/p4.jpg",
    "/images/p5.jpg",
    "/images/p6.jpg",
    "/images/p7.jpg",
    "/images/p8.jpg",
    "/images/p9.jpg"
];

controller.menu = (req, res) => {
    res.render('user-menu');
};

controller.trips = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM viajes', (err, data) => {
            if (err) {
                res.json(err);
            }
            res.render('user-trips', {
                trips: data,
                imagePaths: imagesPaths
            });
        });
    });
};

controller.show = (req, res) => {
    const { id } = req.params;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM viajes WHERE id = ?', [id], (err, trip) => {
            res.render('user-trip-show', {
                trip: trip[0],
                imagePaths: imagesPaths
            });
        });
    });
};

controller.qr = (req, res) => {
    res.render('user-qr');
};

controller.buy = (req, res) => {
    const { id } = req.params;
    const cnt = req.body.tiquetes;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM viajes WHERE id = ?', [id], (err, trip) => {
            if (trip[0].tiquetes_disponibles < cnt) {
                res.redirect('/user/trips');
            }else{
                conn.query('SELECT * FROM tiquetes WHERE viaje = ? AND usuario = ?', [id, 1], (err, ticket) => {
                    if (ticket.length == 0) {
                        conn.query('INSERT INTO tiquetes SET ?', {usuario: 1, viaje: id, cantidad: cnt}, (err, rows) => {
                            conn.query('UPDATE viajes SET tiquetes_disponibles = tiquetes_disponibles - ? WHERE id = ?', [cnt, id], (err, rows) => {});
                            res.redirect('/user/qr');
                        });
                    } else {
                        conn.query('UPDATE tiquetes SET cantidad = cantidad + ? WHERE viaje = ? AND usuario = ?', [cnt, id, 1], (err, rows) => {
                            conn.query('UPDATE viajes SET tiquetes_disponibles = tiquetes_disponibles - ? WHERE id = ?', [cnt, id], (err, rows) => {});
                            res.redirect('/user/qr');
                        });
                    }
                });
            }
        });
    });
};

controller.tickets = (req, res) => {
    const id = 1;
    req.getConnection((err, conn) => {
        conn.query('SELECT t.*, v.fecha, v.hora, v.duracion, v.origen, v.destino, v.precio,  v.id as viaje_id FROM tiquetes t INNER JOIN viajes v ON t.viaje = v.id WHERE t.usuario = ?', [id], (err, tickets) => {
            res.render('user-tickets', {tickets: tickets});
        });
    });
};

controller.ticket = (req, res) => {
    const { id } = req.params;
    const uid = 1;
    req.getConnection((err, conn) => {
        conn.query('SELECT t.*, v.fecha, v.hora, v.duracion, v.origen, v.destino, v.precio, v.id as viaje_id FROM tiquetes t INNER JOIN viajes v ON t.viaje = v.id WHERE t.usuario = ? AND t.viaje = ?', [uid, id], (err, ticket) => {
            res.render('user-ticket-show', {ticket: ticket[0], 
                imagePaths: imagesPaths
            });
        });
    });
};

controller.cancel = (req, res) => {
    const { id } = req.params;
    const cnt = req.body.cantidad;
    const uid = 1;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM tiquetes WHERE viaje = ? AND usuario = ?', [id, uid], (err, ticket) => {
            if (ticket[0].cantidad < cnt) {
                res.redirect('/user/tickets');
            } else if (ticket[0].cantidad == cnt){
                conn.query('DELETE FROM tiquetes WHERE viaje = ? AND usuario = ?', [id, uid], (err, rows) => {
                    conn.query('UPDATE viajes SET tiquetes_disponibles = tiquetes_disponibles + ? WHERE id = ?', [cnt, id], (err, rows) => {});
                    res.redirect('/user/tickets');
                });
            } else {
                conn.query('UPDATE tiquetes SET cantidad = cantidad - ? WHERE viaje = ? AND usuario = ?', [cnt, id, uid], (err, rows) => {
                    conn.query('UPDATE viajes SET tiquetes_disponibles = tiquetes_disponibles + ? WHERE id = ?', [cnt, id], (err, rows) => {});
                    res.redirect('/user/tickets');
                });
            }
        });
    });
};

controller.profile = (req, res) => {
    const uid = 1;
    const updated = req.query.updated ? true : false;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM usuarios WHERE id = ?', [uid], (err, user) => {
            res.render('user-profile', {
                user: user[0],
                updated: updated
            });
        });
    });
};

controller.editProfile = (req, res) => {
    const { id } = req.params;
    const user = req.body;
    req.getConnection((err, conn) => {
        conn.query('UPDATE usuarios set ? WHERE id = ?', [user, id], (err, rows) => {
            res.redirect('/user/profile?updated=true');
        });
    });
};

module.exports = controller;