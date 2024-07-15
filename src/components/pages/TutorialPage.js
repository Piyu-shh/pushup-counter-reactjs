// TutorialPage.js
import React from 'react';
import './TutorialPage.css';

function TutorialPage() {
  return (
    <div className="tutorial-container">
      <h1>Exercise Tutorials</h1>
      <section>
        <h2>Pushups</h2>
        <div className="video-row">
          <iframe
            src="https://www.youtube.com/embed/zkU6Ok44_CI?si=YlBEqrfaSkRY_wdO"
            title="Pushups Video 1"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
          <iframe
             src="https://www.youtube.com/embed/zkU6Ok44_CI?si=YlBEqrfaSkRY_wdO"
            title="Pushups Video 2"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </section>
      <section>
        <h2>Squats</h2>
        <div className="video-row">
          <iframe
             src="https://www.youtube.com/embed/zkU6Ok44_CI?si=YlBEqrfaSkRY_wdO"
            title="Squats Video 1"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
          <iframe
             src="https://www.youtube.com/embed/zkU6Ok44_CI?si=YlBEqrfaSkRY_wdO"
            title="Squats Video 2"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </section>
    </div>
  );
}

export default TutorialPage;
