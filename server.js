import express from "express"
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import cors from "cors"
import eventLog from "./middleware/eventLog.js";




const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const PORT = process.env.PORT || 3500;

//custom middleware
app.use((req, res, next) => {
    eventLog(`${req.method}\t${req.url}`, 'reqLog.txt');
    console.log(`${req.method} ${req.path}`);
    next();
});

// built-in middleware (invoke the functions)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// serve static files from the `public` directory
// use the directory directly since __dirname is already the `backend` folder
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    // index.html lives in views/subdir
    res.sendFile(path.join(__dirname, 'views', 'subdir', 'index.html'));
});

app.get('/new-page', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'subdir', 'new-page.html'));
});

app.get('/old-page', (req, res) => {
    // redirect old route to the new page route
    res.redirect(301, '/new-page');
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));