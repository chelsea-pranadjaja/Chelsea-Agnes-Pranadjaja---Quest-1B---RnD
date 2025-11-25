const express = require('express');
const app = express();
const fs = require ('fs');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));


let feedbacks = [];

const dataFile = __dirname + '/feedback.json';
if (fs.existsSync(dataFile)) {
  const fileData = fs.readFileSync(dataFile, 'utf-8');
  feedbacks = JSON.parse(fileData);
}

function save() {
    fs.writeFileSync(dataFile, JSON.stringify(feedbacks, null, 2));
}

function valFb(data) {
  const errors = [];

    if (!data.name || data.name.trim() === "") {
    errors.push("Name is required.");
  }
    if (!data.email || data.email.trim() === "") {
      errors.push("Email is required.");
  }
    if (!data.rating) {
      errors.push("Rating is required.");
  }
    if (data.rating && (data.rating < 1 || data.rating > 5)) {
      errors.push("Rating must be between 1 and 5.");
  }
    return errors;
  }

function search(list, query) {
  if (!query) return list;
  const w = query.toLowerCase();

  return list.filter(fb =>
    fb.name.toLowerCase().includes(w) || fb.email.toLowerCase().includes(w) || fb.eventName.toLowerCase().includes(w)
  );
}

function filter(list, status) {
  if (!status) return list;
  return list.filter(fb => fb.status === status);
}

// redo this one
function pages(list, page, limit) {
  const pg = parseInt(page) || 1;
  const lim = parseInt(limit) || 10;

  const start = (pg - 1) * lim;
  const end = start + lim;

  return {
    page: pg,
    totalItems: list.length,
    totalPages: Math.ceil(list.length / lim),
    items: list.slice(start, end)
  };
} 


app.post('/api/feedback', (req, res) => {
  const data = req.body;

  const errors = valFb(data);
  if (errors.length > 0) {
    return res.status(400).json({errors});
  }

  const newFeedback = {
    id: Date.now(),
    name: data.name,
    email: data.email,
    eventName: data.eventName,
    division: data.division,
    rating: data.rating,
    comment: data.comment || "",
    suggestion: data.suggestion || "",
    createdAt: new Date().toISOString(),
    status: "open"
  };

  feedbacks.push(newFeedback);
  save();

  res.status(201).json({
    message: "Thank you for the feedback!",
    feedback: newFeedback
  });
});


app.get('/api/feedback', (req, res) => {
  
  let results = [...feedbacks];

  results = search(results, req.query.search);
  results = filter(results, req.query.status);

  const paginated = pages(
    results,
    req.query.page,
    req.query.limit
  );

  res.json(paginated);
});


app.put('/api/feedback/:id', (req, res) => {
  const {id} = req.params;
  console.log("PUT request ID:", id);

  const updates = req.body;
  console.log("Update...", updates);

  const index = feedbacks.findIndex(fb => fb.id == id);
  if (index === -1) {
    return res.status(404).json({error: "Feedback not found"});
  }

  feedbacks[index] = {...feedbacks[index], ...updates};
  save();

  res.json({
    message: "Feedback updated",
    data: feedbacks[index]
  });
});

app.delete('/api/feedback/:id', (req, res) => {
  const {id} = req.params;

  const index = feedbacks.findIndex(fb => fb.id == id);
  if (index === -1) {
    return res.status(404).json({error: "Feedback not found"});
 }

  feedbacks.splice(index, 1);
  save();

  res.json({message: "Feedback deleted successfully"});
});


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/feedback.html');
});


app.get('/admin', (req, res) => {
  res.sendFile(__dirname + '/public/admin.html');
});


app.listen(3000);
