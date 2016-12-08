function getAutoDeg30(){
  return (Math.random() > 0.5 ? '':'-') + Math.ceil(Math.random()*30);
}

var Frontbox = React.createClass({
	render:function(){
		return (
			<figure className="front" >
		        <img src = { this.props.data.url } alt = { this.props.data.title } />
		        <figcaption> { this.props.data.title } </figcaption>
		    </figure>
		);
	}
});

var Backbox = React.createClass({
	render:function(){
		return (
			<div className="back">
        <div className="back-box" id={ this.props.data.id } >          
          { this.props.data.desc }
          <div className="close">&times;</div>
        </div>
      </div>
		);
	}
});

var Box = React.createClass({
	render:function(){
		return (
			<div className="box">
				<Frontbox data={this.props.data} />
				<Backbox data={this.props.data} />
			</div>
		);
	}
});

var Imgfigure = React.createClass({
  handleclick:function(e){
    if(!this.props.posinfo.iscenter){//非中心图片
      this.props.center();

      e.stopPropagation();
      e.preventDefault();
    }else{//中心图片
      if(!this.props.posinfo.current){//front在前面
        this.props.turn();
      }
    }
  },
  render:function(){
    var styleobj = {};
    var classname = "cellimg ";

    styleobj = this.props.posinfo.pos;
    if(this.props.posinfo.iscenter){
      styleobj['zIndex'] = '1000';//增加z-index属性
    }

    if(this.props.posinfo.rotate){
      ['Webkit','Ms','Moz'].forEach(function(value,index){
        styleobj[value+'Transform'] = 'rotate('+this.props.posinfo.rotate+'deg)';
      }.bind(this));
    }

    if(this.props.posinfo.current){
      classname += "inserve";
    }
  
    return (
		<div className={ classname } style={ styleobj } onClick = { this.handleclick } >
			<Box data={ this.props.data } />
		</div>
    );
  }
});

var Reactbox = React.createClass({
  constant:{
    winW:0,
    winH:0,
    cellW:0,
    cellH:0
  },

  turn:function(index){
    return function(){
      var data = this.state.dataarr;
      data[index].current = !data[index].current;
      data[index].pos = {
        left:0,
        top:0
      };
      this.setState({
        dataarr:data
      });
    }.bind(this);
  },

  reposition:function(index){
      var data = this.state.dataarr,
          constant = this.constant;

      for(var i=0,j = data.length;i < j;i++){
        if(i == index){
          data[i] = {
            pos : {
              left : (constant.winW - constant.cellW) / 2,
              top : (constant.winH - constant.cellH) / 2
            },
            iscenter : true,
            rotate:0,
            current:false
          };
        }else{
          data[i] = {
            pos : {
              left : Math.ceil(Math.random()*(constant.winW - constant.cellW)),
              top : Math.ceil(Math.random()*(constant.winH - constant.cellH))
            },
            iscenter : false,
            rotate: getAutoDeg30(),
            current:false
          };
        }
      }

      /*console.log(data);//如果为初始值说明在渲染时又重新置为了初始值，此时需要在渲染时判断*/
      this.setState({
        dataarr: data
      });
     
  },

  center: function(index){
    return (function(){
      this.reposition(index);
    }.bind(this));
  },

  getInitialState: function(){
  /*//返回的是对象，对象中不能以分号结束';'*/
    return {
      dataarr : [
        /*{
          pos:{
            left:0,
            top:0
          },
          iscenter:false,
          rotate:0,
          current:false
        }*/
      ]
    };
  },

  componentDidMount:function(){
    var winH = document.body.clientHeight,
        winW = document.body.clientWidth;
    
    var node = ReactDOM.findDOMNode(this.refs.cell0);
    var cellw = node.scrollWidth,
        cellh = node.scrollHeight;
    this.constant = {
      winW:winW,
      winH:winH,
      cellW:cellw,
      cellH:cellh
    }
      
    this.reposition(0);
  },

  render:function(){
    var Imgfigures = [];
    data.forEach(function(value,index){
    if(!this.state.dataarr[index]){
      this.state.dataarr[index] = {
        pos:{
          left:0,
          top:0
        },
        iscenter:false,
        rotate:0,
        current:false
      };
    }

      Imgfigures.push(<Imgfigure data={ value } key={index} ref={'cell' + index } posinfo={ this.state.dataarr[index] } center={ this.center(index) } turn={ this.turn(index) } />);
    }.bind(this));

    return (
      <div className="state" ref="state">
        { Imgfigures }
      </div>
    );
  }
});
ReactDOM.render(
  <Reactbox />,
  document.getElementById('content')
);