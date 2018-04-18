import React from 'react';
import ButtonActions from '../src/ButtonActions';

class LazyElement extends React.Component {
  state = {};
  renderLate = () => {
    this.setState({ myChild: this.props.children});
  }
  componentDidMount() {
    setTimeout(this.renderLate, 1000);
  }
  renderMyChildren() {
    return (this.state.myChild) ? this.state.myChild : 'loading';
  }
  render() {
    return (
      <div>
        {this.renderMyChildren()}
      </div>
    );
  }
};



class Element2 extends React.Component {
  render() {
    return (
      <ButtonActions
      doNotReRender={true}
          onPress={() => console.log('callback 2 on touch')}
          {...this.props.swipes}
        >
        <div style={{ display: 'flex', alignItems: 'center', flex: '1', textAlign: 'center', width: '300px', height: '75px', backgroundColor: '#fbab56', color: '#FFF' }} >
          <div style={{ flex: '1', fontWeight: 'bold' }} > Component Element 2</div>
        </div>
      </ButtonActions>
    );
  }
};

class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = { toggle : false, updateKey: false, containerWidth: '800px' };
  }
  componentWillMount() {
    // console.log('will mount')
  }
  generateSwipesForFullElement() {
    const onOpen = (val) => console.log('open', val);
    const onClose = (val) => console.log('close', val);
    return {
      onOpen,
      onClose,
      left: [
        {
          text: (<i style={{fontSize: '3em'}} className="fa fa-cog fa-spin fa-3x fa-fw"></i>),
          onPress: () => console.log('not loading'),
          style: { backgroundColor: '#599FFF', color: 'white' }
        }
      ],
      right: [
        {
          text: (<i style={{fontSize: '3em'}} className="fa fa-spinner fa-spin fa-3x fa-fw"></i>),
          onPress: () => console.log('loading'),
          style: { backgroundColor: '#599FFF', color: 'white' }
        }
      ]
    };

  }
  generateSwipes(modifier = false) {
    const onOpen = (val) => console.log('open', val);
    const onClose = (val) => console.log('close', val);

    if (modifier === 3) return {
      onOpen,
      onClose,
    left: [
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
        { text: 'SomeString', onPress: () => alert('SomeString'), style: { backgroundColor: '#4E4E4E', color: 'white' }},
        { text: (<i style={{fontSize: '3em'}} className="fa fa-mobile" aria-hidden="true"></i>), onPress: () => alert('Mobile'), style: { backgroundColor: '#7979e4', color: 'white' }}
      ]

      right.push({
          text: (
            <i style={{ flex: '1' }} className="material-icons">card_giftcard</i>
            ),
          onPress: () => console.log('new one clicked'),
          style: {cursor: 'pointer', backgroundColor: 'green', color: 'white' }
        });

    return {
      left,
      right,
      onOpen,
      onClose
    };
  }

  bindFullWidthButton = (component) => {
     this.button = component;
  }

  bindFullWidthButton2 = (component) => {
    this.button2 = component;
  }

  bindFullWidthButton5 = (component) => {
    this.button5 = component;
  }

  toggleMountOfThird = () => {
    console.log('called');
    this.setState((state) => ({ toggle: !state.toggle }));
  }

  closeElementFullWidth = () => {
    this.button.close();
  }
  closeElementFour = () => {
    this.button2.close();
  }

  refreshChangedWidth = () => {
    this.setState((state) => ({ updateKey: !state.updateKey }));
    // this.button.update();
  }
  forceRerender = () => {
    this.rerenderer.forceRerender();
  }
  toggleAndRefresh = () => {
    this.setState((state) => ({ containerWidth: (state.containerWidth) === '500px' ? '800px' : '500px' }));
    // setTimeout(() => this.button5.update(), 400);
  }
  bindForRerender = (c) => {
    this.rerenderer = c;
  }
  render() {

    const element1 = (
      <div style={{ display: 'flex', alignItems: 'center', flex: '1', textAlign: 'center', width: '300px', height: '75px', backgroundColor: '#599FFF', color: '#FFF' }} >
        <div style={{ flex: '1', fontWeight: 'bold' }} >Decorated Element 1</div>
      </div>
    );

    const element3 = (
      <div style={{ display: 'flex', alignItems: 'center', flex: '1', textAlign: 'center', width: '100%', height: '75px', backgroundColor: '#ab75ff', color: '#FFF' }} >
        <div style={{ flex: '1', fontWeight: 'bold' }} >Decorated Element 3</div>
      </div>
    );

    const elementFullWidth = (
      <div style={{ display: 'flex', alignItems: 'center', flex: '1', textAlign: 'center', width: '100%', height: '75px', backgroundColor: '#76d4a5', color: '#FFF' }} >
        <div style={{ flex: '1', fontWeight: 'bold' }} >Decorated Element 4 ( Full Width Swipe with ref ) </div>
      </div>
    );

    const elementChangeWidth = (
      <div style={{ display: 'flex', alignItems: 'center', flex: '1', textAlign: 'center', width: '100%', height: '75px', backgroundColor: 'rgb(185, 0, 154)', color: '#FFF' }} >
        <div style={{ flex: '1', fontWeight: 'bold' }} >Decorated Element 4 ( Full Width Swipe with ref ) </div>
      </div>
    );

    const element4 = (
      <div style={{ display: 'flex', alignItems: 'center', flex: '1', textAlign: 'center', width: '100%', height: '75px', backgroundColor: '#d47676', color: '#FFF' }} >
        <div style={{ flex: '1', fontWeight: 'bold' }} >Decorated Element 4</div>
      </div>
    );


    return (
      <React.StrictMode>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#42404C', overflow: 'hidden' }}>
        <div style={{ color: '#FFF', fontWeight: 'bold', fontSize: '2.5em', margin: '2% 0'}}>react-button-actions demo : </div>

        <div style={{ marginBottom: '3%', display :'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <div style={{ textAlign: 'center', flex: '4', cursor: 'pointer', color: '#599FFF', backgroundColor: '#FAFAFA', padding: '1% 2%' }} onClick={this.toggleMountOfThird} >
            Mount/Dismount Element 3
          </div>
          <div style={{flex: 1}}>&nbsp;</div>
          <div style={{ textAlign: 'center', flex: '4', cursor: 'pointer', color: '#599FFF', backgroundColor: '#FAFAFA', padding: '1% 2%' }} onClick={this.closeElementFullWidth} >
            Close Button Full Width programmatically
          </div>
          <div style={{flex: 1}}>&nbsp;</div>
          <div style={{ textAlign: 'center', flex: '4', cursor: 'pointer', color: '#599FFF', backgroundColor: '#FAFAFA', padding: '1% 2%' }} onClick={this.closeElementFour} >
            Close Button 4 programmatically
          </div>

        </div>


        <ButtonActions
        doNotReRender={true}
          onPress={() => console.log('callback 1 on touch')}
          {...this.generateSwipes()}
        >
          {element1}
        </ButtonActions>
        <br />
          <Element2 swipes={{...this.generateSwipes(2)}} />
        <br />

        <div style={{ width: '50%' }}>
        {this.state.toggle !== true &&
          <ButtonActions
          doNotReRender={true}
            onPress={() => console.log('callback 3 on touch')}
            {...this.generateSwipes(3)}
          >
            {element3}
          </ButtonActions>
        }
        </div>
      <br />

        <div style={{ width: '50%' }}>
          <ButtonActions
          doNotReRender={true}
            ref={this.bindFullWidthButton}
            fullwidth
            updateKey={this.state.updateKey}
            linked={false}
            onPress={() => console.log('callback 4 on touch fullwidth element')}
            {...this.generateSwipesForFullElement()}
          >
            {elementFullWidth}
          </ButtonActions>
        </div>


        <br />
        <div style={{ width: '50%' }}>
          <ButtonActions
          doNotReRender={true}
            ref={this.bindFullWidthButton2}
            autoclose={false}
            {...this.generateSwipes(3)}
            onPress={() => console.log('callback 4 on touch fullwidth element')}
          >
            {element4}
          </ButtonActions>
          <div onClick={this.refreshChangedWidth} className="testReset" style={{ width: '200px', border: '1px dotted white', margin: '30px auto', textAlign: 'center', color: 'white', padding: '5px' }} >
            Refresh Decorated element 4 ( click after resize of window )
          </div>
        </div>


        <div style={{ margin: '40px auto', width: this.state.containerWidth }} >

          <ButtonActions
            ref={this.bindForRerender}
            doNotReRender={true}
            // updateKey={this.state.containerWidth}
            {...this.generateSwipesForFullElement()}
          >
            <LazyElement>
              {elementChangeWidth}
            </LazyElement>
          </ButtonActions>

        <div onClick={this.toggleAndRefresh} className="testReset" style={{ width: '200px', border: '1px dotted white', margin: '30px auto', textAlign: 'center', color: 'white', padding: '5px' }} >
          Update container width & Trigger update on swipe
        </div>

        <div onClick={this.forceRerender} className="testRerender" style={{ width: '200px', border: '1px dotted white', margin: '30px auto', textAlign: 'center', color: 'cadetblue', padding: '5px' }} >
          Force Update
        </div>

        </div>
      </div>
    </React.StrictMode>
    );
  }
}

export default Example;