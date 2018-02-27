import React from 'react';
import ReactDOM from 'react-dom';

import ReduxProvider from './components/ReduxProvider';

const render = (Component) => {
  ReactDOM.render(
      <ReduxProvider />,
    document.getElementById('root'),
  );
};

render(ReduxProvider);

// Without Redux
/*import { AppContainer } from 'react-hot-loader';

  import App from './components/App';

  const render = (Component) => {
    ReactDOM.render(
      <AppContainer>
        <Component />
      </AppContainer>,
      document.getElementById('root'),
    );
  };

  render(App);

  if (module.hot) {
    module.hot.accept('./components/App', () => {
      const newApp = require('./components/App').default;
      render(newApp);
    });
}*/
