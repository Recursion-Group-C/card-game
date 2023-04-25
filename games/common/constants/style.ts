const STYLE = {
  TEXT: {
    font: '48px Arial',
    color: '#FFFFFF',
    // stroke: '#000000',
    strokeThickness: 2
  },
  LOAD_TEXT: {
    font: '18px Arial',
    color: '#FFFFFF'
  },
  NAME_TEXT: {
    font: '48px Arial',
    strokeThickness: 2,
    backgroundColor: 'rgba(39, 54, 58, 0.7)',
    padding: {
      x: 30,
      y: 10
    }
  },
  DECK_SIZE: {
    font: 'normal 24px Impact',
    color: '#FFFFFF'
  },
  TIMER: {
    font: 'normal 300px Impact',
    color: '#2051e5',
    stroke: '#000000',
    strokeThickness: 5
  },
  GUTTER_SIZE: 20
} as const;

export default STYLE;
