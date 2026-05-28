import re

with open("booking.html", "r") as f:
    content = f.read()

# Replace from <!-- HERO --> to just before <!-- FOOTER -->
new_html = """
  <!-- BOOKING CAROUSEL -->
  <section class="booking-hero">
    <div class="carousel-container">
      <div class="carousel-slide fade">
        <img src="cohort.jpeg" alt="Slide 1">
        <div class="carousel-caption">Expert 1-on-1 Consultations</div>
      </div>
      <div class="carousel-slide fade">
        <img src="industry-workshop.jpeg" alt="Slide 2">
        <div class="carousel-caption">Strategic Workshops for Growth</div>
      </div>
      <div class="carousel-slide fade">
        <img src="tech-pe-charcha.jpeg" alt="Slide 3">
        <div class="carousel-caption">Technology Deep Dives</div>
      </div>
      <div class="carousel-slide fade">
        <img src="photos/image1.JPG" alt="Slide 4">
        <div class="carousel-caption">Practical Business Adoption</div>
      </div>
      <div class="carousel-slide fade">
        <img src="photos/image2.JPG" alt="Slide 5">
        <div class="carousel-caption">Hands-on AI Workshops</div>
      </div>
      <div class="carousel-slide fade">
        <img src="photos/image3.jpg" alt="Slide 6">
        <div class="carousel-caption">Interactive Cohort Sessions</div>
      </div>
      <div class="carousel-slide fade">
        <img src="photos/image4.jpg" alt="Slide 7">
        <div class="carousel-caption">Workflow Transformation & Automation</div>
      </div>
      <div class="carousel-slide fade">
        <img src="photos/image5.JPG" alt="Slide 8">
        <div class="carousel-caption">Empowering MSMEs Across Maharashtra</div>
      </div>
      
      <a class="prev" onclick="plusSlides(-1)">&#10094;</a>
      <a class="next" onclick="plusSlides(1)">&#10095;</a>
    </div>
    <div style="text-align:center; padding-top: 15px;">
      <span class="dot" onclick="currentSlide(1)"></span> 
      <span class="dot" onclick="currentSlide(2)"></span> 
      <span class="dot" onclick="currentSlide(3)"></span> 
      <span class="dot" onclick="currentSlide(4)"></span> 
      <span class="dot" onclick="currentSlide(5)"></span> 
      <span class="dot" onclick="currentSlide(6)"></span> 
      <span class="dot" onclick="currentSlide(7)"></span> 
      <span class="dot" onclick="currentSlide(8)"></span> 
    </div>
  </section>

  <!-- BOOKING CARDS -->
  <section class="booking-cards-sec">
    <div class="wrap">
      <div class="shdr" style="text-align: center; margin-bottom: 3rem;">
        <h2 class="sh">Choose Your Consultation Path</h2>
      </div>
      <div class="booking-grid">
        <div class="b-card">
          <div class="b-card-img">
            <img src="cohort.jpeg" alt="1-on-1 Strategy">
          </div>
          <div class="b-card-content">
            <h3>1-on-1 Strategy Session</h3>
            <p>Direct consultation with industry experts to address your specific business bottlenecks and formulate a custom implementation roadmap.</p>
            <a href="#" class="btn btn-blue" style="margin-top: 1rem; width: 100%; justify-content: center;">Book Now</a>
          </div>
        </div>
        <div class="b-card">
          <div class="b-card-img">
            <img src="industry-workshop.jpeg" alt="Team Training">
          </div>
          <div class="b-card-content">
            <h3>Team Enablement</h3>
            <p>Dedicated training and workshops for your operational teams to master new workflows and adopt AI tools seamlessly into their daily tasks.</p>
            <a href="#" class="btn btn-blue" style="margin-top: 1rem; width: 100%; justify-content: center;">Book Now</a>
          </div>
        </div>
        <div class="b-card">
          <div class="b-card-img">
            <img src="tech-pe-charcha.jpeg" alt="Technical Assessment">
          </div>
          <div class="b-card-content">
            <h3>Technical Assessment</h3>
            <p>A comprehensive review of your existing digital infrastructure and processes to identify key areas for automation and optimization.</p>
            <a href="#" class="btn btn-blue" style="margin-top: 1rem; width: 100%; justify-content: center;">Book Now</a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- CAROUSEL SCRIPT -->
  <script>
    let slideIndex = 0;
    let slideTimeout;
    showSlides();

    function showSlides() {
      let i;
      let slides = document.getElementsByClassName("carousel-slide");
      let dots = document.getElementsByClassName("dot");
      for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";  
      }
      slideIndex++;
      if (slideIndex > slides.length) {slideIndex = 1}    
      if (slideIndex < 1) {slideIndex = slides.length}    
      for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active-dot", "");
      }
      if(slides[slideIndex-1]) {
        slides[slideIndex-1].style.display = "block";  
        if(dots[slideIndex-1]) dots[slideIndex-1].className += " active-dot";
      }
      if (slideTimeout) clearTimeout(slideTimeout);
      slideTimeout = setTimeout(showSlides, 4000); // Change image every 4 seconds
    }
    
    function plusSlides(n) {
      if (slideTimeout) clearTimeout(slideTimeout);
      let slides = document.getElementsByClassName("carousel-slide");
      slideIndex += n - 1;
      if (slideIndex < 0) {
        slideIndex = slides.length - 1;
      }
      showSlides();
    }
    
    function currentSlide(n) {
      if (slideTimeout) clearTimeout(slideTimeout);
      slideIndex = n - 1;
      showSlides();
    }
  </script>

"""

pattern = re.compile(r'<!-- HERO -->.*?(?=<!-- FOOTER -->)', re.DOTALL)
content = pattern.sub(new_html, content)

# Now add CSS for the new sections just before </style>
new_css = """
    /* BOOKING SPECIFIC STYLES */
    .booking-hero {
      padding-top: 100px;
      padding-bottom: 30px;
      background: var(--bg);
    }
    
    .carousel-container {
      max-width: 1200px;
      position: relative;
      margin: auto;
      border-radius: var(--r-lg);
      overflow: hidden;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    }
    
    .carousel-slide {
      display: none;
      height: 450px;
    }
    
    .carousel-slide img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .carousel-caption {
      color: #f2f2f2;
      font-size: 24px;
      font-weight: 700;
      padding: 15px 30px;
      position: absolute;
      bottom: 20px;
      left: 20px;
      background: rgba(0,0,0,0.6);
      border-radius: var(--r-sm);
      backdrop-filter: blur(5px);
    }
    
    .prev, .next {
      cursor: pointer;
      position: absolute;
      top: 50%;
      width: auto;
      padding: 16px;
      margin-top: -22px;
      color: white;
      font-weight: bold;
      font-size: 18px;
      transition: 0.6s ease;
      border-radius: 0 3px 3px 0;
      user-select: none;
      background-color: rgba(0,0,0,0.3);
    }
    
    .next {
      right: 0;
      border-radius: 3px 0 0 3px;
    }
    
    .prev:hover, .next:hover {
      background-color: rgba(0,0,0,0.8);
    }
    
    .dot {
      cursor: pointer;
      height: 12px;
      width: 12px;
      margin: 0 4px;
      background-color: #bbb;
      border-radius: 50%;
      display: inline-block;
      transition: background-color 0.6s ease;
    }
    
    .active-dot, .dot:hover {
      background-color: var(--indigo);
    }
    
    .fade {
      animation-name: fade;
      animation-duration: 1.5s;
    }
    
    @keyframes fade {
      from {opacity: .4} 
      to {opacity: 1}
    }
    
    .booking-cards-sec {
      padding: 4rem 1.5rem;
      background: #f8fafc;
    }
    
    .booking-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .b-card {
      background: var(--card);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid var(--border);
      border-radius: var(--r-lg);
      transition: all 0.3s ease;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    
    .b-card:hover {
      transform: translateY(-5px);
      border-color: var(--border-hover);
      box-shadow: 0 20px 40px rgba(0, 63, 138, 0.08);
    }
    
    .b-card-img {
      width: 100%;
      height: 220px;
      overflow: hidden;
    }
    
    .b-card-img img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }
    
    .b-card:hover .b-card-img img {
      transform: scale(1.05);
    }
    
    .b-card-content {
      padding: 2rem;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }
    
    .b-card h3 {
      font-family: 'Bricolage Grotesque', sans-serif;
      font-size: 1.3rem;
      font-weight: 700;
      color: var(--text);
      margin-bottom: 1rem;
    }
    
    .b-card p {
      color: var(--text-muted);
      line-height: 1.6;
      margin-bottom: 1.5rem;
      flex-grow: 1;
    }
    
    @media(max-width: 960px) {
      .booking-grid {
        grid-template-columns: 1fr;
      }
      .carousel-slide {
        height: 300px;
      }
    }
"""

content = content.replace("  </style>", new_css + "\n  </style>")

with open("booking.html", "w") as f:
    f.write(content)

