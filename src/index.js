const express = require('express');
const { v4: uuidv4, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());

const projects = [];

function logRequest(req, res, next) {
    const { method, url } = req;

    const logLabel = `[${method.toUpperCase()}]: ${url}`

    console.log(logLabel);

    next();
}

function validateProjectId(req, res, next) {
    const { id } = req.params;

    if(!isUuid(id)) {
        return res.status(400).json({ error: 'Invalid project ID' });
    }

    next();
}

app.use(logRequest);

app.get('/projects', (req, res) => {
    const { title } = req.query;

    const results = title ? projects.filter(project => project.title.includes(title)) : projects;

    return res.json(results);
});

app.post('/projects', (req, res) => {
    const { title, owner } = req.body;

    const project = {
        id: uuidv4(),
        title,
        owner
    }

    projects.push(project);

    return res.status(201).json(project);

});

app.use('/projects/:id', validateProjectId);

app.put('/projects/:id', (req, res) => {
    const { id } = req.params;
    const { title, owner } = req.body;
    
    const projectIndex = projects.findIndex(project => project.id === id);

    if(projectIndex < 0) {
        return res.status(400).json({ error: 'project not found' });
    }

    const project = {
        id,
        title,
        owner
    }

    projects[projectIndex] = project;

    return res.status(200).json(project);
});

app.delete('/projects/:id', (req, res) => {
    const { id } = req.params;

    const projectIndex = projects.findIndex(project => project.id === id);

    if (projectIndex < 0) {
        return res.status(400).json({ error: 'project not found' });
    }

    projects.splice(projectIndex, 1);

    return res.status(200).send();
})

app.listen(3333, () => {
    console.log('server on');
});