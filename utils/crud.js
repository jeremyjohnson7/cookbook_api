// Ensure that all required fields in test are present and valid
const validate = (obj, test) =>
    Object.keys(test)
        .map(x => obj[x] !== undefined && (
            Array.isArray(test[x])
                ? Array.isArray(obj[x]) && obj[x]
                    .map(y => y !== undefined && y.match(test[x][0]))
                : obj[x].match(test[x])
        ) ? 1 : 0)
        .every(x => x);

// Generic create, read, update, and delete
module.exports = (app, db) => (collection, test={}) =>
    app.route(`/api/${collection._name}/:guid([0-9a-f]{8}\-[0-9a-f]{4}\-[0-9a-f]{4}\-[0-9a-f]{4}\-[0-9a-f]{12})$`)
        .get((req, res, next) => {
            collection.find({ _id: req.params.guid }).toArray((err, docs) => {
                if (err)
                    throw err;
                if (docs[0])
                    res.send(docs[0]);
                else
                    next();
            });
        })
        .post((req, res) => {
            req.body._id = req.params.guid;
            if (!validate(req.body, test))
                return res.status(400).end('Bad Request');
            collection.save(req.body, (err, id) => {
                if (err)
                    throw err;
                if (id)
                    res.send(id);
            });
        })
        .delete((req, res) => {
            collection.remove({ _id: req.params.guid }, (err, id) => {
                if (err)
                    throw err;
                if (id)
                    res.send(id);
            });
        });
