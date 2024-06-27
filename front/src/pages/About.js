import React from 'react';

function About() {
  return (
    <div style={styles.container}>
      <h1>About Us</h1>
      <p>Welcome to the About page. This application helps you manage your rentals with ease.</p>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#f0f0f0',
    minHeight: 'calc(100vh - 70px)', // 화면 전체 높이에서 헤더와 푸터 높이 뺀 값
  },
};

export default About;
