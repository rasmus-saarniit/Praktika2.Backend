const express = require('express');
const app = express();
const db = require('./config/database');
const categoryRoutes = require('./routes/categoryRoutes');

// Middleware to parse JSON bodies
app.use(express.json());

// Connect category routes
app.use('/api/categories', categoryRoutes);

app.get('/', function (req, res) {
  res.send('Movies');
});

app.get('/api/films/:filmId', async (req, res) => {
  const filmId = req.params.filmId;

  try {
    const film = await db.oneOrNone('SELECT * FROM movies.film WHERE film_id = $1', [filmId]);
    if (film) {
      res.json(film);
    } else {
      res.status(404).json({ error: 'Film not found' });
    }
  } catch (error) {
    console.error('Error getting information about the film:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// New route to add actors
app.post('/api/actors', async (req, res) => {
  const { firstname, lastname, films } = req.body;

  try {
    const newActor = await db.one(
      'INSERT INTO movies.actor(first_name, last_name, last_update) VALUES($1, $2, CURRENT_TIMESTAMP) RETURNING *',
      [firstname, lastname]
    );

    // If the actor is associated with films, create associations in the film_actor table
    if (films && films.length > 0) {
      await Promise.all(films.map(async (filmId) => {
        await db.none(
          'INSERT INTO movies.film_actor(actor_id, film_id, last_update) VALUES($1, $2, CURRENT_TIMESTAMP)',
          [newActor.actor_id, filmId]
        );
      }));
    }

    res.status(201).json(newActor);
  } catch (error) {
    console.error('Error when adding an actor:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/actors/:id', async (req, res) => {
  const actorId = req.params.id;
  const { firstname, lastname } = req.body;

  try {
    // Kontrollime, kas on olemas näitleja määratud id-ga
    const existingActor = await db.oneOrNone('SELECT * FROM movies.actor WHERE actor_id = $1', [actorId]);

    if (existingActor) {
      // Kui näitleja on leitud, uuendame tema andmeid
      await db.none('UPDATE movies.actor SET first_name = $1, last_name = $2 WHERE actor_id = $3', [firstname, lastname, actorId]);
      res.status(200).json({ message: 'Data updated' });
    } else {
      // Kui näitlejat ei leitud, tagastame vea
      res.status(404).json({ error: 'Actor not found' });
    }
  } catch (error) {
    console.error('Error updating the actor\'s data:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/actors/:id', async (req, res) => { 
    const actorId = req.params.id 
 
    try { 
        // Kontrollime, kas on olemas näitleja määratud id-ga 
        const existingActor = await db.oneOrNone('SELECT * FROM movies.actor WHERE actor_id = $1', 
[actorId]) 
 
        if (existingActor) { 
            // Kontrollime, kas on seotud kirjeid tabelis film_actor 
            const relatedFilms = await db.any('SELECT * FROM movies.film_actor WHERE actor_id = $1', 
[actorId]) 
            // Kui on seotud kirjeid, kustutame neid enne näitleja kustutamist 
            if (relatedFilms.length > 0) { 
                await db.none('DELETE FROM movies.film_actor WHERE actor_id = $1', [actorId]) 
            } 
            // Kustutame näitleja andmebaasist 
            await db.none('DELETE FROM movies.actor WHERE actor_id = $1', [actorId]) 
            res.status(204).json({ message: 'Actor successfully deleted' }) 
        } else { 
            // Kui näitlejat ei leitud, tagastame vea 
            res.status(404).json({ error: 'Actor not found' }) 
        } 
    } catch (error) { 
        console.error(' Error on deleting an actor:', error) 
        res.status(500).json({ error: ' Server Error' }) 
    } 
})

// The port on which the server will run
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});