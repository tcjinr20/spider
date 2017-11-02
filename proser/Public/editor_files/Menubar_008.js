/**
 * @author mrdoob / http://mrdoob.com/
 */

Menubar.File = function ( editor ) {
	//
	var container = new UI.Panel();
	container.setClass( 'menu' );

	var title = new UI.Panel();
	title.setClass( 'title' );
	title.setTextContent( '文件' );
	container.add( title );

	var options = new UI.Panel();
	options.setClass( 'options' );
	container.add( options );

	// New

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( '新建' );
	option.onClick( function () {
		if ( confirm( 'Any unsaved data will be lost. Are you sure?' ) ) {
			location.href='/index/editor';
		}
	} );
	options.add( option );

	//
	options.add( new UI.HorizontalRule() );

	// Import

	var form = document.createElement( 'form' );
	form.style.display = 'none';
	document.body.appendChild( form );

	var fileInput = document.createElement( 'input' );
	fileInput.type = 'file';
	fileInput.addEventListener( 'change', function ( event ) {
		editor.loader.loadFile( fileInput.files[ 0 ] );
		form.reset();

	} );
	form.appendChild( fileInput );

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( '导入' );
	option.onClick( function () {

		fileInput.click();

	} );
	options.add( option );


	options.add( new UI.HorizontalRule() );

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( '导出对象' );
	option.onClick(sender.sendByObj);
	options.add( option );

	// Export Scene

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( '导出场景' );
	option.onClick(sender.sendByScene);
	options.add( option );

	//

	options.add( new UI.HorizontalRule() );

	// Export GLTF

	//var option = new UI.Row();
	//option.setClass( 'option' );
	//option.setTextContent( '导出 GLTF' );
	//option.onClick( function () {
    //
	//	var exporter = new THREE.GLTFExporter();
    //
	//	exporter.parse( editor.scene, function ( result ) {
    //
	//		saveString( JSON.stringify( result, null, 2 ), 'scene.gltf' );
    //
	//	} );
    //
    //
	//} );
	//options.add( option );
    //
	//// Export OBJ
    //
	//var option = new UI.Row();
	//option.setClass( 'option' );
	//option.setTextContent( 'Export OBJ' );
	//option.onClick( function () {
    //
	//	var object = editor.selected;
    //
	//	if ( object === null ) {
    //
	//		alert( 'No object selected.' );
	//		return;
    //
	//	}
    //
	//	var exporter = new THREE.OBJExporter();
    //
	//	saveString( exporter.parse( object ), 'model.obj' );
    //
	//} );
	//options.add( option );

	// Export STL

	//var option = new UI.Row();
	//option.setClass( 'option' );
	//option.setTextContent( 'Export STL' );
	//option.onClick( function () {
	//
	//	var exporter = new THREE.STLExporter();
	//
	//	saveString( exporter.parse( editor.scene ), 'model.stl' );
	//
	//} );
	//options.add( option );

	//

	//options.add( new UI.HorizontalRule() );

	// Publish

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( '发布' );
	option.onClick(function(){sender.sendByPro()});
	options.add( option );
	return container;
};
