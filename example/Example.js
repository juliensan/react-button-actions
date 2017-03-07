import React from 'react';
import ButtonActions from '../src/ButtonActions';

class Example extends React.Component {
  constructor(props) {
    super(props);
    console.log('construct');
  }

  componentWillMount() {
    console.log('will mount')
  }

  generateSwipes(modifier = false) {
    const onOpen = (val) => console.log('open lol', val);
    const onClose = (val) => console.log('close lol', val);

    if (modifier === 3) return {
      onOpen,
      onClose,
      left: [
      {
        text: 'Answer',
        onPress: () => console.log('Answer'),
        style: { backgroundColor: 'red', color: 'white' }
      },
      {
        text: (<i style={{fontSize: '3em'}} className="fa fa-id-card" aria-hidden="true"></i>),
        onPress:() => console.log('Id'),
        style: { backgroundColor: '#00aaff', color: 'white' }
      },
    ],
    right: [
      {
        text: (<i style={{fontSize: '3em'}} className="fa fa-spinner fa-spin fa-3x fa-fw"></i>),
        onPress: () => console.log('loading'),
        style: { backgroundColor: '#599FFF', color: 'white' }
      },
      {
        text: (<i style={{fontSize: '3em'}} className="fa fa-ban" aria-hidden="true"></i>),
        onPress:() => console.log('Ban'),
        style: { backgroundColor: '#ff4174', color: 'white' }
      }
    ]
    };

    const left = (modifier === 2)
    ? [
      {
        text: 'Reply',
        onPress: () => console.log('Reply'),
        style: { backgroundColor: 'red', color: 'white' }
      },
      {
        text: (<i style={{fontSize: '3em'}} className="fa fa-ban" aria-hidden="true"></i>),
        onPress:() => console.log('Ban'),
        style: { backgroundColor: '#00aaff', color: 'white' }
      }
    ]
    : [{
        text: <i style={{fontSize: '3em'}} className="fa fa-arrow-circle-left" aria-hidden="true"></i>,
        onPress: () => alert('Reply'),
        style: { backgroundColor: '#ff0068', color: 'white' }
      }
    ];

      const right = (modifier === 2)
      ? [
        { text: 'Send', onPress: () => console.log('Send'), style: { backgroundColor: '#ff5371', color: 'white' }},
        { text: (<i style={{fontSize: '3em'}} className="fa fa-envelope" aria-hidden="true"></i>), onPress: () => console.log('Envelope'), style: { backgroundColor: '#7979e4', color: 'white' }}
      ]
      : [
        { text: 'Offert', onPress: () => alert('Offert'), style: { backgroundColor: '#4E4E4E', color: 'white' }},
        { text: (<i style={{fontSize: '3em'}} className="fa fa-mobile" aria-hidden="true"></i>), onPress: () => alert('Mobile'), style: { backgroundColor: '#7979e4', color: 'white' }}
      ]

    return {
      left,
      right,
      onOpen,
      onClose
    };
  }

  render() {

    const element1 = (
      <div style={{ display: 'flex', alignItems: 'center', flex: '1', textAlign: 'center', width: '300px', height: '75px', backgroundColor: '#599FFF', color: '#FFF' }} >
        <div style={{ flex: '1', fontWeight: 'bold' }} >Decorated Element 1</div>
      </div>
    );

    const element2 = (
      <div style={{ display: 'flex', alignItems: 'center', flex: '1', textAlign: 'center', width: '300px', height: '75px', backgroundColor: '#fbab56', color: '#FFF' }} >
        <div style={{ flex: '1', fontWeight: 'bold' }} >Decorated Element 1</div>
      </div>
    );

    const element3 = (
      <div style={{ display: 'flex', alignItems: 'center', flex: '1', textAlign: 'center', width: '300px', height: '75px', backgroundColor: '#ab75ff', color: '#FFF' }} >
        <div style={{ flex: '1', fontWeight: 'bold' }} >Decorated Element 3</div>
      </div>
    );


    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', backgroundColor: '#42404C', overflow: 'hidden' }}>
        <div style={{ color: '#FFF', fontWeight: 'bold', fontSize: '2.5em', margin: '2% 0'}}>react-button-actions demo : </div>

        <ButtonActions
          autoclose
          onPress={() => console.log('callback 1 on touch')}
          {...this.generateSwipes()}
        >
          {element1}
        </ButtonActions>
        <br />
         <ButtonActions
          autoclose
          onPress={() => console.log('callback 2 on touch')}
          {...this.generateSwipes(2)}
        >
        {element2}
        </ButtonActions>
        <br />
        <ButtonActions
          autoclose
          onPress={() => console.log('callback 3 on touch')}
          {...this.generateSwipes(3)}
        >
          {element3}
        </ButtonActions>
      </div>
    );
  }
}

export default Example;