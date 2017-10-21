/**
 * Created by Administrator on 2017/10/20.
 */
layui.use('jquery',function(){
    $=layui.jquery;
    if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

    var canvas;

    var scenes = [], renderer;

    init();
    animate();

    function init() {

        canvas = document.getElementById( "c" );
        $(".scene").each(function(i,e){
            scenes.push( new EleScene(e) );
        })
        renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );
        renderer.setClearColor( 0xffffff, 1 );
        renderer.setPixelRatio( window.devicePixelRatio );
    }

    function updateSize() {

        var width = canvas.clientWidth;
        var height = canvas.clientHeight;

        if ( canvas.width !== width || canvas.height != height ) {

            renderer.setSize( width, height, false );

        }

    }

    function animate() {

        render();
        requestAnimationFrame( animate );

    }

    function render() {

        updateSize();

        renderer.setClearColor( 0xffffff );
        renderer.setScissorTest( false );
        renderer.clear();

        renderer.setClearColor( 0xe0e0e0 );
        renderer.setScissorTest( true );

        scenes.forEach( function( elescene ) {

            var element = elescene.element;
            var rect = element.getBoundingClientRect();
            if ( rect.bottom < 0 || rect.top  > renderer.domElement.clientHeight ||
                rect.right  < 0 || rect.left > renderer.domElement.clientWidth ) {
                return;
            }
            // set the viewport
            var width  = rect.right - rect.left;
            var height = rect.bottom - rect.top;
            var left   = rect.left;
            var top    = rect.top;
            renderer.setViewport( left, top, width, height );
            renderer.setScissor( left, top, width, height );

            var camera = elescene.camera;

            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            elescene.controls.update();

            renderer.render( elescene.scene, camera );

        } );
    }

    function EleScene(elem){
        var url = $(elem).data('url');
        var type= $(elem).data('type');
        this.scene = new THREE.Scene();
        this.scene.add( new THREE.HemisphereLight( 0xaaaaaa, 0x444444 ) );
        var light = new THREE.DirectionalLight( 0xffffff, 0.5 );
        light.position.set( 1, 1, 1 );
        this.scene.add( light );

        this.element=elem;
        this.camera = new THREE.PerspectiveCamera( 50, 1, 1, 10 );
        this.camera.position.z = 2;
        this.controls = new THREE.OrbitControls( this.camera, this.element );
        this.controls.minDistance = 2;
        this.controls.maxDistance = 5;
        //this.controls.enablePan = false;
        //this.controls.enableZoom = false;
        var self = this;
        if(type=='json'){
            var loader = new THREE.ObjectLoader();
            loader.load(url,
                function ( obj ) {
                    self.scene.add( obj );
                },
                function ( xhr ) {
                    console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
                },
                function ( xhr ) {
                    console.error( 'An error happened' );
                }
            );
        }else if(type=='gltf'){
            var loader = new THREE.GLTFLoader();
            loader.load( url, function ( gltf ) {
                self.scene.add( gltf.scene );
            } );
        }

    }
})

