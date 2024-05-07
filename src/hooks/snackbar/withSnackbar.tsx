import SnackbarContext from './SnackbarContext';

/**
 * Creates a HOC that will inject the snackbar prop into the wrapped
 * component.
 */
export const withSnackbar = () => {
  // eslint-disable-next-line react/display-name
  return (Component) => (props) =>
    (
      <SnackbarContext.Consumer>
        {(snackbar) => <Component snackbar={snackbar} {...props} />}
      </SnackbarContext.Consumer>
    );
};

withSnackbar.displayName = 'withSnackbar';
