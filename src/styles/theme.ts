
// 90s-inspired color theme
export const theme = {
  // Light theme colors - inspired by classic Windows/Mac interfaces
  light: {
    background: "#c0c0c0", // Classic gray background
    primary: "#0000aa", // Classic blue
    secondary: "#aa0000", // Classic red
    accent: "#00aa00", // Classic green
    text: "#000000",
    border: "#808080",
    buttonBackground: "#d3d3d3",
    buttonBorder: "#808080",
    success: "#008800",
    warning: "#aa5500",
    error: "#cc0000",
    highlight: "#ffff00",
    card: "#f0f0f0",
    shadow: "rgba(0, 0, 0, 0.5)"
  },
  
  // Dark theme colors - inspired by classic terminal/DOS interfaces
  dark: {
    background: "#000080", // Classic terminal blue
    primary: "#00ff00", // Terminal green
    secondary: "#ff00ff", // Terminal magenta
    accent: "#ffff00", // Terminal yellow
    text: "#ffffff",
    border: "#808080",
    buttonBackground: "#404040",
    buttonBorder: "#606060",
    success: "#00ff00",
    warning: "#ffaa00",
    error: "#ff0000",
    highlight: "#0000ff",
    card: "#202020",
    shadow: "rgba(0, 0, 0, 0.8)"
  }
};

// 90s design tokens
export const designTokens = {
  borderRadius: '0px', // Sharp corners were common in 90s UIs
  dropShadow: '4px 4px 0px',
  fontFamily: "'VT323', 'Courier New', monospace",
  buttonStyle: {
    boxShadow: 'inset -2px -2px 0px #000, inset 2px 2px 0px #fff',
    border: '2px outset #ccc',
  },
  inputStyle: {
    border: '2px inset #ccc',
    backgroundColor: '#fff'
  },
  cardStyle: {
    border: '2px outset #ccc',
    boxShadow: '4px 4px 0px rgba(0,0,0,0.5)'
  }
};
