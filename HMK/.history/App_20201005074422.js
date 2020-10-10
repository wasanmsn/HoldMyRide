import React from 'react';
import Stacks from './routes/stacks';
import {Provider} from 'react-native-paper'
import FA from 'react-native-vector-icons/FontAwesome5'


export default function App() {
  return (
    <Provider settings={{
      icon: props => <FA {...props}/>
    }}>
      <Stacks />
    </Provider>
		
  );
}


