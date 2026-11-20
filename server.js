const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();

const pool = new Pool();

let userGoal = 'Learn Docker!';

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <link rel="stylesheet" href="styles.css">
      </head>
      <body>
        <section>
          <h2>My Updated Course Goal</h2>
          <h3>${userGoal}</h3>
        </section>
        <form action="/store-goal" method="POST">
          <div class="form-control">
            <label>Course Goal</label>
            <input type="text" name="goal">
          </div>
          <button>Set Course Goal</button>
        </form>
      </body>
    </html>
  `);
});

app.post('/store-goal', (req, res) => {
  const enteredGoal = req.body.goal;
  console.log(enteredGoal);
  userGoal = enteredGoal;
  res.redirect('/');
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.get('/db', async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT current_database() AS database, current_user AS user'
    );
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

app.listen(80);
