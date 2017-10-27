/**
 * @author mrdoob / http://mrdoob.com/
 */

var Player = function ( editor ) {

	var signals = editor.signals;
	var camera = new THREE.PerspectiveCamera( 60, 1, 0.1, 1000 );
	var container = new UI.Panel();
	container.setId( 'player' );
	container.setPosition( 'absolute' );
	container.setDisplay( 'none' );

	//

	var player = new APP.Player();
	container.dom.appendChild( player.dom );

	window.addEventListener( 'resize', function () {

		player.setSize( container.dom.clientWidth, container.dom.clientHeight );

	} );

	signals.startPlayer.add( function () {

		container.setDisplay( '' );

		player.load( editor.toJSON() );
		player.setCamera(camera);
		player.setSize( container.dom.clientWidth, container.dom.clientHeight );
		player.play();
	} );

	signals.stopPlayer.add( function () {

		container.setDisplay( 'none' );

		player.stop();
		player.dispose();

	} );


	camera.name='player-sys';
	editor.execute( new AddObjectCommand( camera ));

	var geometry = new THREE.PlaneBufferGeometry( 60, 60);
	var material = new THREE.MeshStandardMaterial();
	var mesh = new THREE.Mesh( geometry, material );
	mesh.name = 'platform';
	mesh.rotation.x=-Math.PI*0.5;
	editor.execute( new AddObjectCommand( mesh ) );


	return container;

};
