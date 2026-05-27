const weddingFilms = [
  {
    title: 'More Than a Movie - Riddhi & Dharam\'s "Hasee Toh Phasee" Inspired Pre-Wedding',
    excerpt:
      'They say school-time love is a fleeting thing, but for Riddhi and Dharam, it was just the first chapter of a ten-year-long epic. After a decade of growing up together, sharing dreams, and navigating life side-by-side, it was finally time to capture their forever against the backdrop of the city that witnessed it all: Mumbai.',
    image:
      'https://images.unsplash.com/photo-1513279922550-250c2129b13a?auto=format&fit=crop&q=85&w=1400',
  },
  {
    title: 'From Flower Markets to Pickleball Courts, A Day with Radhika & Ankur',
    excerpt:
      'If we had to describe Ankur and Radhika in one word, it would be irresistible. There is this spark between them, a kind of natural chemistry that makes our cameras absolutely love them.',
    image:
      'https://images.unsplash.com/photo-1529634597503-139d3726fed5?auto=format&fit=crop&q=85&w=1400',
  },
];

function FilmCard({ film }) {
  return (
    <article className="wedding-film-card">
      <a href="#" className="wedding-film-image-link" aria-label={`Watch ${film.title}`}>
        <img src={film.image} alt={film.title} className="wedding-film-image" loading="lazy" />
      </a>
      <div className="wedding-film-copy">
        <h2>{film.title}</h2>
        <p>{film.excerpt}</p>
      </div>
    </article>
  );
}

export default function WeddingFilms() {
  return (
    <main id="wedding-films" className="wedding-films-page">
      <header className="wedding-films-heading">
        <h1>Couple Shoot</h1>
      </header>

      <section className="wedding-films-grid" aria-label="Wedding Films-shoot">
        {weddingFilms.map((film) => (
          <FilmCard key={film.title} film={film} />
        ))}
      </section>
    </main>
  );
}
