/**
 * @author mrdoob / http://mrdoob.com/
 */

var Toolbar = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setId( 'toolbar' );
	document.body.appendChild(container.dom);

	var buttons = new UI.Panel();
	buttons.dom.className='layui-btn-group'
	container.add( buttons );


	// translate / rotate / scale

	var translate = new UI.Button( '移动' );
	translate.dom.title = 'W';
	translate.dom.className = 'layui-btn layui-btn-normal';
	translate.onClick( function () {

		signals.transformModeChanged.dispatch( 'translate' );

	} );
	buttons.add( translate );

	var rotate = new UI.Button( '旋转' );
	rotate.dom.title = 'E';
	rotate.dom.className = 'layui-btn layui-btn-normal';
	rotate.onClick( function () {

		signals.transformModeChanged.dispatch( 'rotate' );

	} );
	buttons.add( rotate );

	var scale = new UI.Button( '缩放' );
	scale.dom.title = 'R';
	scale.dom.className = 'layui-btn layui-btn-normal';
	scale.onClick( function () {

		signals.transformModeChanged.dispatch( 'scale' );

	} );
	buttons.add( scale );

	signals.transformModeChanged.add( function ( mode ) {

		translate.dom.classList.remove( 'selected' );
		rotate.dom.classList.remove( 'selected' );
		scale.dom.classList.remove( 'selected' );

		switch ( mode ) {

			case 'translate': translate.dom.classList.add( 'selected' ); break;
			case 'rotate': rotate.dom.classList.add( 'selected' ); break;
			case 'scale': scale.dom.classList.add( 'selected' ); break;

		}

	} );
	var isPlaying = false;
	var playrow = new UI.Button();
	playrow.dom.innerHTML='&#xe652;'
	playrow.dom.className='layui-icon layui-btn layui-btn-normal';
	container.add(playrow);
	playrow.onClick(function(){
		if ( isPlaying === false ) {

			isPlaying = true;
			playrow.dom.innerHTML='&#xe651;'
			signals.startPlayer.dispatch();

		} else {

			isPlaying = false;
			playrow.dom.innerHTML='&#xe652;'
			signals.stopPlayer.dispatch();

		}
	})
};
