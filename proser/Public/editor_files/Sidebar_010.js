/**
 * @author mrdoob / http://mrdoob.com/
 */

var Sidebar = function ( editor ) {

	var container = new UI.Panel();
	container.setId( 'sidebar' );

	//

	var sceneTab = new UI.Text( 'SCENE' ).onClick( onClick );
	var projectTab = new UI.Text( 'PROJECT' ).onClick( onClick );
	var mintab = new UI.Text( '-' );
	mintab.setColor('#000').setId("min").onClick( min );
	var tabs = new UI.Div();
	tabs.setId( 'tabs' );
	tabs.add( sceneTab, projectTab,mintab );
	container.add( tabs );

	var maxbtn = new UI.Text( '=').setId('max').onClick( max );

	document.body.appendChild( maxbtn.dom);

	function onClick( event ) {

		select( event.target.textContent );

	}

	//

	var scene = new UI.Span().add(
		new Sidebar.Scene( editor ),
		new Sidebar.Properties( editor ),
		new Sidebar.Animation( editor ),
		new Sidebar.Script( editor )
	);
	container.add( scene );

	var project = new UI.Span().add(
		new Menubar.Status( editor ),
		new Sidebar.Project( editor ),
		new Sidebar.Settings( editor ),
		new Sidebar.History( editor)

	);
	container.add( project );

	function select( section ) {

		sceneTab.setClass( '' );
		projectTab.setClass( '' );

		scene.setDisplay( 'none' );
		project.setDisplay( 'none' );

		switch ( section ) {
			case 'SCENE':
				sceneTab.setClass( 'selected' );
				scene.setDisplay( '' );
				break;
			case 'PROJECT':
				projectTab.setClass( 'selected' );
				project.setDisplay( '' );
				break;
		}
	}

	function min(){
		maxbtn.setDisplay('');
		container.dom.style.right ='-300px';
		editor.signals.hideSidebar.dispatch();
	}

	function max(){
		maxbtn.setDisplay('none');
		container.setDisplay('');
		container.dom.style.right ='0px';
		editor.signals.hideSidebar.dispatch();
	}

	select( 'SCENE' );

	return container;

};
