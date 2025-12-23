const express = require('express');
const fs = require('fs');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const DATA_FILE = './data.json';

const getData = () => {
    try {
        return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    } catch (e) {
        return { players: [], matches: [], liveLink: "" };
    }
};

const saveData = (data) => fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

app.use((req, res, next) => {
    const data = getData();
    res.locals.players = data.players || [];
    res.locals.matches = data.matches || [];
    res.locals.liveLink = data.liveLink || "";
    next();
});

app.get('/', (req, res) => res.render('index'));
app.get('/market', (req, res) => res.render('market'));
app.get('/matches', (req, res) => res.render('matches'));
app.get('/admin', (req, res) => res.render('admin'));

app.post('/register', (req, res) => {
    const data = getData();
    data.players.push({ id: Date.now(), ...req.body });
    saveData(data);
    res.redirect('/market');
});

app.post('/admin/live', (req, res) => {
    const data = getData();
    data.liveLink = req.body.link.replace("watch?v=", "embed/");
    saveData(data);
    res.redirect('/admin');
});

app.post('/admin/add-match', (req, res) => {
    const data = getData();
    data.matches.push({ id: Date.now(), ...req.body });
    saveData(data);
    res.redirect('/admin');
});

app.post('/admin/delete-player', (req, res) => {
    const data = getData();
    data.players = data.players.filter(p => p.id != req.body.playerId);
    saveData(data);
    res.redirect('/admin');
});
const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log(`Live at http://localhost:${port}`);
});
  console.log(`VIM Hub running on port ${PORT}`);
});

