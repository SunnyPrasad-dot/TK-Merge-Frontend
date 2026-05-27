const stories = [
  {
    id: 1,
    title: "Saba & Usman's Nikah in Dubai",
    category: "Destination Wedding",
    preview: "A wedding full of grace, tradition, and quiet elegance—Saba and Usman’s three-day celebration in Dubai was the perfect blend of emotion, beauty, and connection.",
    image: "https://images.unsplash.com/photo-1543881473-b541a9dd9db4?auto=format&fit=crop&q=80&w=800",
    link: "#"
  },
  {
    id: 2,
    title: "Oleander Farms, Karjat",
    category: "Nature & Rustic",
    preview: "In the serene setting of Oleander Farms, Karjat, Dhruv & Pippa celebrated their enchanting two-day wedding. The décor embraced vintage appeal and rustic elegance.",
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800",
    link: "#"
  },
  {
    id: 3,
    title: "Aneesh & Maitri, Taj Cidade De Goa",
    category: "Beach Wedding",
    preview: "There’s something undeniably magical about a wedding by the sea, especially when the setting sun casts its golden glow over the entire scene.",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800",
    link: "#"
  },
  {
    id: 4,
    title: "Yash & Shrishti, Trident Udaipur",
    category: "Palace Wedding",
    preview: "Inspired by the iconic Bollywood film 'Yeh Jawaani Hai Deewani,' Yash and Shrishti chose the majestic Trident Hotel in Udaipur to tie the knot in royal grandeur.",
    image: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=800",
    link: "#"
  },
  {
    id: 5,
    title: "Mahalaxmi Racecourse, Mumbai",
    category: "City Grandeur",
    preview: "Experience the grandeur of Akash and Shruti’s unforgettable wedding in Mumbai spanning across some of the most iconic venues in the city.",
    image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800",
    link: "#"
  },
  {
    id: 6,
    title: "Anushka & Rex, ITC Maratha",
    category: "Cross-Cultural",
    preview: "Anushka & Rex’s Hindu-Christian wedding will make you swoon on the simplicity and serenity of their beautiful wedding ceremonies proving that love conquers all!",
    image: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&q=80&w=800",
    link: "#"
  }
];

const StoriesSection = () => {
  return (
    <section id="wedding-stories" className="stories-section">
      <div className="container">
        <div className="section-header">
          <h2 className="heading-md">Tying the Knot, One Story at a Time</h2>
          <p style={{ color: "var(--text-muted)", maxWidth: "600px", margin: "1rem auto 0" }}>
            Explore our featured weddings captured all around the world.
          </p>
        </div>

        <div className="stories-grid">
          {stories.map(story => (
            <a href={story.link} key={story.id} className="story-card">
              <div className="story-img-container">
                <img src={story.image} alt={story.title} className="story-img" loading="lazy" />
              </div>
              <div className="story-content">
                <span className="story-category">{story.category}</span>
                <h3 className="story-title heading-md" style={{ fontSize: '1.4rem' }}>{story.title}</h3>
                <p className="story-preview">{story.preview}</p>
              </div>
            </a>
          ))}
        </div>
        
        <div style={{ textAlign: "center", marginTop: "4rem" }}>
          <a href="#" className="btn btn-outline">View All Weddings</a>
        </div>
      </div>
    </section>
  );
};

export default StoriesSection;
