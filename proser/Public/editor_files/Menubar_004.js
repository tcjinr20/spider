/**
 * @author mrdoob / http://mrdoob.com/
 */

Menubar.Status = function ( editor ) {

	var container = new UI.Panel();
	container.setClass( 'menu right' );

	var autosave = new UI.THREE.Boolean( editor.config.getKey( 'autosave' ), 'autosave' );
	autosave.onChange( function () {

		var value = this.getValue();

		editor.config.setKey( 'autosave', value );

		if ( value === true ) {

			editor.signals.sceneGraphChanged.dispatch();

		}

	} );
	container.add( autosave );

	editor.signals.savingStarted.add( function () {

		autosave.text.setTextDecoration( 'underline' );

	} );

	editor.signals.savingFinished.add( function () {

		autosave.text.setTextDecoration( 'none' );

	} );



	var line = new UI.Row();

	var snap = new UI.THREE.Boolean( false, 'snap' ).onChange( update );
	line.add( snap );

	var local = new UI.THREE.Boolean( false, 'local' ).onChange( update );
	line.add( local );

	var showGrid = new UI.THREE.Boolean( true, 'show' ).onChange( update );
	line.add( showGrid );
	container.add(line);

	var line = new UI.Row();
	var grid = new UI.Number( 25 ).setWidth( '40px' ).onChange( update );
	line.add( new UI.Text( '网格: ' ) );
	line.add( grid );
	container.add(line);

	var line = new UI.Row();
	var version = new UI.Text( 'r' + THREE.REVISION );
	version.setClass( '版本' );
	version.setOpacity( 0.5 );
	line.add( version );
	container.add(line);


	function update() {

		editor.signals.snapChanged.dispatch( snap.getValue() === true ? grid.getValue() : null );
		editor.signals.spaceChanged.dispatch( local.getValue() === true ? "local" : "world" );
		editor.signals.showGridChanged.dispatch( showGrid.getValue() );

	}

	return container;

};
