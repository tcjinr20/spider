/**
 * Created by Administrator on 2017/10/22.
 */

function Sidebar_op(editor){
    var signals = editor.signals;
    var scene = new UI.Panel().add(
        new Sidebar.Scene( editor ),
        new Sidebar.Prop( editor )
    );
    scene.setId( 'sidebar' );
    document.body.appendChild(scene.dom)

    var renderer=createRenderer('WebGLRenderer',false,false,false,false);
    signals.rendererChanged.dispatch( renderer );
}

function createRenderer( type, antialias, shadows, gammaIn, gammaOut ) {
    var rendererTypes = {
        'WebGLRenderer': THREE.WebGLRenderer,
        'CanvasRenderer': THREE.CanvasRenderer,
        'SVGRenderer': THREE.SVGRenderer,
        'SoftwareRenderer': THREE.SoftwareRenderer,
        'RaytracingRenderer': THREE.RaytracingRenderer

    };
    if ( type === 'WebGLRenderer' && System.support.webgl === false ) {

        type = 'CanvasRenderer';

    }
    var renderer = new rendererTypes[ type ]( { antialias: antialias} );
    renderer.gammaInput = gammaIn;
    renderer.gammaOutput = gammaOut;
    if ( shadows && renderer.shadowMap ) {
        renderer.shadowMap.enabled = true;
    }
    return renderer;
}

Sidebar.Prop = function ( editor ) {

    var signals = editor.signals;

    var container = new UI.Span();

    var objectTab = new UI.Text( 'OBJECT' ).onClick( onClick );
    var geometryTab = new UI.Text( 'GEOMETRY' ).onClick( onClick );
    var materialTab = new UI.Text( 'MATERIAL' ).onClick( onClick );

    var tabs = new UI.Div();
    tabs.setId( 'tabs' );
    tabs.add( objectTab, geometryTab, materialTab );
    container.add( tabs );

    function onClick( event ) {

        select( event.target.textContent );

    }

    //

    var object = new UI.Span().add(
        new Sidebar.Object( editor )
    );
    container.add( object );

    var geometry = new UI.Span().add(
        new Sidebar.Geometry( editor )
    );
    container.add( geometry );

    var material = new UI.Span().add(
        new Sidebar.Material( editor )
    );
    container.add( material );

    //

    function select( section ) {

        objectTab.setClass( '' );
        geometryTab.setClass( '' );
        materialTab.setClass( '' );

        object.setDisplay( 'none' );
        geometry.setDisplay( 'none' );
        material.setDisplay( 'none' );

        switch ( section ) {
            case 'OBJECT':
                objectTab.setClass( 'selected' );
                object.setDisplay( '' );
                break;
            case 'GEOMETRY':
                geometryTab.setClass( 'selected' );
                geometry.setDisplay( '' );
                break;
            case 'MATERIAL':
                materialTab.setClass( 'selected' );
                material.setDisplay( '' );
                break;
        }

    }

    select( 'OBJECT' );

    return container;

};
