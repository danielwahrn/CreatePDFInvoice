import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import Login from './screen/Login';

import EditForm from './screen/EditForm';

export const AppContainer = createAppContainer(
  createSwitchNavigator(
    {
      Login: Login,
      EditForm: EditForm
    },
    {
      initialRouteName: 'Login'
    }
  )
);
