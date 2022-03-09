var port = process.env.PORT || 3000;
const path = require('path');
const express = require('express');
let log = console;

const app = new express();
app.use(express.static('./dist'));

app.use(function(request, res, next) {
    console.log('[CALL_ROUTE] [', request.originalUrl, '] ', ' METHOD [', request.method, '] ');
    next();
});

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, './dist', 'index.html'));
});


app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, './dist', 'index.html')))

app.listen(port, () => {
    log.log('**** ->  App listening on port : ', port)
})