const Styles = {
  SwipeStyles: {
    overlayStyles: { zIndex: 2, transition: 'transform 0.5s cubic-bezier(0.22, 0.61, 0.36, 1)' },
    baseSwipeContainerStyles: { overflow: 'hidden', position: 'relative', display: 'inline-block' },
    buttonsContainerStyles: { zIndex: 1, height: '100%' },
    rightContainerStyles: {
      transition: 'transform 0.5s cubic-bezier(0.22, 0.61, 0.36, 1)',
      height: '100%',
      alignItems: 'center',
      bottom: '0',
      display: 'flex',
      position: 'absolute',
      right: '0',
      transform: 'scale3d(0, 1, 1)',
      transformOrigin: 'right',
    },
    leftContainerStyles: {
      transition: 'transform 0.5s cubic-bezier(0.22, 0.61, 0.36, 1)',
      height: '100%',
      transform: 'scale3d(0, 1, 1)',
      alignItems: 'center',
      bottom: '0',
      display: 'flex',
      position: 'absolute',
      left: '0',
      transformOrigin: 'left',
    }
  },
  ButtonStyles: {
    container: { cursor: 'pointer', flex: '1', display: 'flex', height: '100%', alignItems: 'center', textAlign: 'center' },
    content: { flex: 1 }
  }
};

export default Styles;
export const SwipeStyles = Styles.SwipeStyles;
export const ButtonStyles = Styles.ButtonStyles;