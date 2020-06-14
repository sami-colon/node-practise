const express = require('express');
const app = express();
const morgan = require('morgan');
const parser = require('body-parser');
const fetch = require('node-fetch');
const fs = require('fs');

const employees = JSON.parse(fs.readFileSync('./data/employee.json').toString());
const projects = JSON.parse(fs.readFileSync('./data/project.json').toString());

app.use(morgan('dev'));
app.use(parser.json());

app.get('/employee/:id', (req, res) => {
	const id = parseInt(req.params.id, 10);
	const filtered = employees.filter(emp => emp.eid === id);
	if(filtered.length >= 1){
		res.status(200).send(filtered[0]);
	}else{
		res.status(404).send('ID Not Found');
	}
});

app.get('/project/:id', (req, res) => {
	const id = parseInt(req.params.id, 10)
	const filtered = projects.filter(project => project.pid === id);
	if(filtered.length >= 1){
		res.status(200).send(filtered[0]);
	}else{
		res.status(404).send('ID Not Found');
	}
});

app.get('/getemployeedetails', (req, res) => {
	const id = 20;
	fetch(`http://localhost:3000/employee/${id}`)
	.then(result => result.json())
	.then(result => {
		fetch(`http://localhost:3000/project/${result.pid}`)
		.then(_project => _project.json())
		.then(_project => {
			result.projectDetails = _project;
			res.send(result);
		})
		.catch(_err => {
			result.projectDetails = err;
			res.send(result);
		});
	})
	.catch(err => res.send(err));
});

app.get('/getemployeedetails/:id', (req, res) => {
	const id = parseInt(req.params.id, 10);
	fetch(`http://localhost:3000/employee/${id}`)
	.then(result => result.json())
	.then(result => {
		fetch(`http://localhost:3000/project/${result.pid}`)
		.then(_project => _project.json())
		.then(_project => {
			result.projectDetails = _project;
			res.send(result);
		})
		.catch(_err => {
			result.projectDetails = err;
			res.send(result);
		});
	})
	.catch(err => res.send(err));
});

app.listen(3000, () => {
	console.log('listening on port 3000');
})