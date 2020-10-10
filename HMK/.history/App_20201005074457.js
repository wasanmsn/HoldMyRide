import React from 'react';
import Stacks from './routes/stacks';
import {Provider} from 'react-native-paper'
import AwesomeIcon  from 'react-native-vector-icons/FontAwesome5'


export default function App() {
  return (
    <Provider settings={{
      icon: props => <AwesomeIcon  {...props}/>
    }}>
      <Stacks />
    </Provider>
		
  );
}


