import { useEffect } from 'react';

const ParticlesBackground = () => {
  useEffect(() => {
    if (window.particlesJS) {
      window.particlesJS('particles-js', {
        particles: {
          number: {
            value: 80,
          },
          shape: {
            type: 'star',
          },
          size: {
            value: 3,
          },
          move: {
            direction: 'bottom-left',
            speed: 1,
            random: true,
          },
        },
      });
    }
  }, []);

  return (
    <div className="min-vh-100">
      <div
        id="particles-js"
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{ zIndex: 0 }}
      />
      <div className="container text-center position-relative">
      </div>
    </div>
  );
};

export default ParticlesBackground;
