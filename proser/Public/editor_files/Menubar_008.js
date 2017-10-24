/**
 * @author mrdoob / http://mrdoob.com/
 */

Menubar.File = function ( editor ) {

	var NUMBER_PRECISION = 6;

	function parseNumber( key, value ) {

		return typeof value === 'number' ? parseFloat( value.toFixed( NUMBER_PRECISION ) ) : value;

	}

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

			editor.clear();

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

	//

	options.add( new UI.HorizontalRule() );

	// Export Geometry

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Export Geometry' );
	option.onClick( function () {

		var object = editor.selected;

		if ( object === null ) {

			alert( 'No object selected.' );
			return;

		}

		var geometry = object.geometry;

		if ( geometry === undefined ) {

			alert( 'The selected object doesn\'t have geometry.' );
			return;

		}

		var output = geometry.toJSON();

		try {

			output = JSON.stringify( output, parseNumber, '\t' );
			output = output.replace( /[\n\t]+([\d\.e\-\[\]]+)/g, '$1' );

		} catch ( e ) {

			output = JSON.stringify( output );

		}

		saveString( output, 'geometry.json' );

	} );
	options.add( option );

	// Export Object

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Export Object' );
	option.onClick( function () {

		var object = editor.selected;

		if ( object === null ) {

			alert( 'No object selected' );
			return;

		}

		var output = object.toJSON();

		try {

			output = JSON.stringify( output, parseNumber, '\t' );
			output = output.replace( /[\n\t]+([\d\.e\-\[\]]+)/g, '$1' );

		} catch ( e ) {

			output = JSON.stringify( output );

		}

		saveString( output, 'model.json' );

	} );
	options.add( option );

	// Export Scene

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Export Scene' );
	option.onClick( function () {

		var output = editor.scene.toJSON();

		try {

			output = JSON.stringify( output, parseNumber, '\t' );
			output = output.replace( /[\n\t]+([\d\.e\-\[\]]+)/g, '$1' );

		} catch ( e ) {

			output = JSON.stringify( output );

		}

		saveString( output, 'scene.json' );

	} );
	options.add( option );

	//

	options.add( new UI.HorizontalRule() );

	// Export GLTF

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Export GLTF' );
	option.onClick( function () {

		var exporter = new THREE.GLTFExporter();

		exporter.parse( editor.scene, function ( result ) {

			saveString( JSON.stringify( result, null, 2 ), 'scene.gltf' );

		} );


	} );
	options.add( option );

	// Export OBJ

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Export OBJ' );
	option.onClick( function () {

		var object = editor.selected;

		if ( object === null ) {

			alert( 'No object selected.' );
			return;

		}

		var exporter = new THREE.OBJExporter();

		saveString( exporter.parse( object ), 'model.obj' );

	} );
	options.add( option );

	// Export STL

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Export STL' );
	option.onClick( function () {

		var exporter = new THREE.STLExporter();

		saveString( exporter.parse( editor.scene ), 'model.stl' );

	} );
	options.add( option );

	//

	options.add( new UI.HorizontalRule() );

	// Publish

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Publish' );
	option.onClick( function () {

		var zip = new JSZip();

		//

		var output = editor.toJSON();
		output.metadata.type = 'App';
		delete output.history;

		var vr = output.project.vr;

		output = JSON.stringify( output, parseNumber, '\t' );
		output = output.replace( /[\n\t]+([\d\.e\-\[\]]+)/g, '$1' );

		zip.file( 'app.json', output );

		//

		var manager = new THREE.LoadingManager( function () {

			save( zip.generate( { type: 'blob' } ), 'download.zip','download' );

		} );

		var loader = new THREE.FileLoader( manager );
		loader.load( 'js/libs/app/index.html', function ( content ) {

			var includes = [];

			if ( vr ) {

				includes.push( '<script src="js/WebVR.js"></script>' );

			}

			content = content.replace( '<!-- includes -->', includes.join( '\n\t\t' ) );

			zip.file( 'index.html', content );

		} );
		loader.load( 'editor_files/app.js', function ( content ) {

			zip.file( 'js/app.js', content );

		} );
		loader.load( '/threejs/three.min.js', function ( content ) {

			zip.file( 'js/three.min.js', content );

		} );

		if ( vr ) {

			loader.load( '/threejs/vr/WebVR.js', function ( content ) {

				zip.file( 'js/WebVR.js', content );

			} );

		}

	} );
	options.add( option );

	/*
	// Publish (Dropbox)

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Publish (Dropbox)' );
	option.onClick( function () {

		var parameters = {
			files: [
				{ 'url': 'data:text/plain;base64,' + window.btoa( "Hello, World" ), 'filename': 'app/test.txt' }
			]
		};

		Dropbox.save( parameters );

	} );
	options.add( option );
	*/


	//

	var link = document.createElement( 'a' );
	link.style.display = 'none';
	document.body.appendChild( link ); // Firefox workaround, see #6594

	function save( blob, filename,type) {

		var con=document.getElementById('alert').innerHTML;


		type=type?type:'scene';
		layui.layer.open({
			type: 1,
			title:filename,
			content: con, //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
			btn: ['确定', '取消'],
			btn1:function(index){
				var img = editor.screenShot();
				var obj={};
				obj.name=document.getElementById('tlabel').value;
				obj.desc = document.getElementById('desc').value;

				obj.type=type;
				if(!obj.name){
					layui.layer.msg('没有标签');
					return;
				}



				new SendBold(editor).send(img,{name:filename,data:blob},obj,function(e){
					if(e.currentTarget.readyState==4){
						console.log(e.currentTarget.response)
					}
				});
				layui.layer.close(index);
			},
			btn2:function(index){
				layui.layer.close(index);
			}
		});

		document.getElementById('showimg').src=editor.toDataURL();

		//link.href = URL.createObjectURL( blob );
		//link.download = filename || 'data.json';
		//link.click();

		// URL.revokeObjectURL( url ); breaks Firefox...

	}

	function saveString( text, filename ) {
		var tt = filename.split('.')[0];
		save( new Blob( [ text ], { type: 'text/plain' } ), filename ,tt);

	}

	return container;

};
