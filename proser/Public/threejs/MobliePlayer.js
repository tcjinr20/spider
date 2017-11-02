/**
 * Created by Administrator on 2017/10/28.
 */
/**
 * @author mrdoob / http://mrdoob.com/
 */

var MobilePlayer = {

    Player: function () {

        var loader = new THREE.ObjectLoader();
        var camera, scene, renderer;

        var events = {};

        var dom = document.createElement( 'div' );
        dom.id='viewport';
        this.dom = dom;

        this.width = 500;
        this.height = 500;
        this.isplay =false;

        this.loadScene = function(json){
            renderer = new THREE.WebGLRenderer( { antialias: true } );
            renderer.setClearColor( 0x000000 );
            renderer.setPixelRatio( window.devicePixelRatio );
            dom.appendChild( renderer.domElement );
            //this.setScene(json);
            //this.setCamera(camera);


            //requestAnimationFrame( render );
        }

        this.loadProcet = function ( json ) {

            renderer = new THREE.WebGLRenderer( { antialias: true } );
            renderer.setClearColor( 0x000000 );
            renderer.setPixelRatio( window.devicePixelRatio );

            if ( json.project.gammaInput ) renderer.gammaInput = true;
            if ( json.project.gammaOutput ) renderer.gammaOutput = true;

            if ( json.project.shadows ) {
                renderer.shadowMap.enabled = true;
                 renderer.shadowMap.type = THREE.PCFSoftShadowMap;

            }

            if ( json.project.vr ) {

                renderer.vr.enabled = true;

            }

            dom.appendChild( renderer.domElement );

            this.setScene( loader.parse( json.scene ) );
            this.setCamera( loader.parse( json.camera ) );

            events = {
                init: [],
                start: [],
                stop: [],
                keydown: [],
                keyup: [],
                mousedown: [],
                mouseup: [],
                mousemove: [],
                touchstart: [],
                touchend: [],
                touchmove: [],
                update: []
            };

            var scriptWrapParams = 'player,renderer,scene,camera';
            var scriptWrapResultObj = {};

            for ( var eventKey in events ) {

                scriptWrapParams += ',' + eventKey;
                scriptWrapResultObj[ eventKey ] = eventKey;

            }

            var scriptWrapResult = JSON.stringify( scriptWrapResultObj ).replace( /\"/g, '' );

            for ( var uuid in json.scripts ) {

                var object = scene.getObjectByProperty( 'uuid', uuid, true );

                if ( object === undefined ) {

                    console.warn( 'APP.Player: Script without object.', uuid );
                    continue;

                }

                var scripts = json.scripts[ uuid ];

                for ( var i = 0; i < scripts.length; i ++ ) {

                    var script = scripts[ i ];

                    var functions = ( new Function( scriptWrapParams, script.source + '\nreturn ' + scriptWrapResult + ';' ).bind( object ) )( this, renderer, scene, camera );

                    for ( var name in functions ) {

                        if ( functions[ name ] === undefined ) continue;

                        if ( events[ name ] === undefined ) {

                            console.warn( 'APP.Player: Event type not supported (', name, ')' );
                            continue;

                        }

                        events[ name ].push( functions[ name ].bind( object ) );

                    }

                }

            }
        };

        this.setCamera = function ( value ) {

            camera = value;
            camera.aspect = this.width / this.height;
            camera.updateProjectionMatrix();

            if ( renderer.vr.enabled ) {

                WEBVR.checkAvailability().catch( function( message ) {

                    dom.appendChild( WEBVR.getMessageContainer( message ) );

                } );

                WEBVR.getVRDisplay( function ( device ) {

                    renderer.vr.setDevice( device );
                    dom.appendChild( WEBVR.getButton( device, renderer.domElement ) );

                } );

            }

        };

        this.setScene = function ( value ) {

            scene = value;

        };

        this.setSize = function ( width, height ) {

            this.width = width;
            this.height = height;

            if ( camera ) {

                camera.aspect = this.width / this.height;
                camera.updateProjectionMatrix();

            }

            if ( renderer ) {

                renderer.setSize( width, height );

            }

        };

        this.play = function () {
            this.isplay=true;
            start( gameLoop, gameViewportSize );
        };

        this.stop = function () {
            this.isplay=false;
            renderer.animate( null );

        };

        this.dispose = function () {

            while ( dom.children.length ) {

                dom.removeChild( dom.firstChild );

            }

            renderer.dispose();

            camera = undefined;
            scene = undefined;
            renderer = undefined;

        };

        // player motion parameters

        var motion = {
            airborne : false,
            position : new THREE.Vector3(), velocity : new THREE.Vector3(),
            rotation : new THREE.Vector2(), spinning : new THREE.Vector2()
        };
        // game systems code

        var resetPlayer = function() {
            if( motion.position.y < -123 ) {
                motion.position.set( -2, 7.7, 25 );
                motion.velocity.multiplyScalar( 0 );
            }
        };

        var keyboardControls = (function() {

            var keys = { SP : 32, W : 87, A : 65, S : 83, D : 68, UP : 38, LT : 37, DN : 40, RT : 39 };

            var keysPressed = {};

            (function( watchedKeyCodes ) {
                var handler = function( down ) {
                    return function( e ) {
                        var index = watchedKeyCodes.indexOf( e.keyCode );
                        if( index >= 0 ) {
                            keysPressed[watchedKeyCodes[index]] = down; e.preventDefault();
                        }
                    };
                };
                window.addEventListener( "keydown", handler( true ), false );
                window.addEventListener( "keyup", handler( false ), false );
            })([
                keys.SP, keys.W, keys.A, keys.S, keys.D, keys.UP, keys.LT, keys.DN, keys.RT
            ]);

            var forward = new THREE.Vector3();
            var sideways = new THREE.Vector3();

            return function() {
                if( !motion.airborne ) {

                    // look around
                    var sx = keysPressed[keys.UP] ? 0.03 : ( keysPressed[keys.DN] ? -0.03 : 0 );
                    var sy = keysPressed[keys.LT] ? 0.03 : ( keysPressed[keys.RT] ? -0.03 : 0 );

                    if( Math.abs( sx ) >= Math.abs( motion.spinning.x ) ) motion.spinning.x = sx;
                    if( Math.abs( sy ) >= Math.abs( motion.spinning.y ) ) motion.spinning.y = sy;

                    // move around
                    forward.set( Math.sin( motion.rotation.y ), 0, Math.cos( motion.rotation.y ) );
                    sideways.set( forward.z, 0, -forward.x );

                    forward.multiplyScalar( keysPressed[keys.W] ? -0.1 : (keysPressed[keys.S] ? 0.1 : 0));
                    sideways.multiplyScalar( keysPressed[keys.A] ? -0.1 : (keysPressed[keys.D] ? 0.1 : 0));

                    var combined = forward.add( sideways );
                    if( Math.abs( combined.x ) >= Math.abs( motion.velocity.x ) ) motion.velocity.x = combined.x;
                    if( Math.abs( combined.y ) >= Math.abs( motion.velocity.y ) ) motion.velocity.y = combined.y;
                    if( Math.abs( combined.z ) >= Math.abs( motion.velocity.z ) ) motion.velocity.z = combined.z;

                    //jump
                    //var vy = keysPressed[keys.SP] ? 0.7 : 0;
                    //motion.velocity.y += vy;
                }
            };
        })();

        var jumpPads = (function() {
            var pads = [ new THREE.Vector3( -17.5, 8, -10 ), new THREE.Vector3( 17.5, 8, -10 ), new THREE.Vector3( 0, 8, 21 ) ];
            var temp = new THREE.Vector3();

            return function() {
                if( !motion.airborne ) {
                    for( var j = 0, n = pads.length; j < n; j++ ) {
                        if ( pads[j].distanceToSquared( motion.position ) < 2.3 ) {

                            // calculate velocity towards another side of platform from jump pad position
                            temp.copy( pads[j] ); temp.y = 0; temp.setLength( -0.8 ); temp.y = 0.7;

                            motion.airborne = true; motion.velocity.copy( temp ); break;
                        }
                    }
                }
            };
        })();

        var applyPhysics = (function() {
            var timeStep = 5;
            var timeLeft = timeStep + 1;
            var kneeDeep = 0.4;
            var angles = new THREE.Vector2();
            var displacement = new THREE.Vector3();
            return function( dt ) {
                timeLeft += dt;
                dt = 5;
                while( timeLeft >= dt ) {
                    var time = 0.3, damping = 0.93, gravity = 0.01, tau = 2 * Math.PI;
                    motion.airborne = true;
                    var actualHeight = 0;
                    if( ( motion.velocity.y <= 0 ) && ( Math.abs( actualHeight ) < kneeDeep ) ) {
                        motion.position.y -= actualHeight;
                        motion.velocity.y = 0;
                        motion.airborne = false;
                    }
                    if( motion.airborne ) motion.velocity.y -= gravity;
                    angles.copy( motion.spinning ).multiplyScalar( time );
                    if( !motion.airborne ) motion.spinning.multiplyScalar( damping );
                    displacement.copy( motion.velocity ).multiplyScalar( time );
                    if( !motion.airborne ) motion.velocity.multiplyScalar( damping );
                    motion.rotation.add( angles );
                    motion.position.add( displacement );
                    motion.rotation.x = Math.max( -0.4, Math.min ( +0.4, motion.rotation.x ) );
                    motion.rotation.y += tau; motion.rotation.y %= tau;
                    timeLeft -= dt;
                }
            };
        })();

        var updateCamera = (function() {
            var euler = new THREE.Euler( 0, 0, 0, 'YXZ' );
            return function() {
                euler.x = motion.rotation.x;
                euler.y = motion.rotation.y;
                camera.quaternion.setFromEuler( euler );
                camera.position.copy( motion.position );
                camera.position.y += 3.0;
            };
        })();

        var start = function( gameLoop, gameViewportSize ) {
            scene.add(camera);
            requestAnimationFrame( render );
        };
        var lastTimeStamp;
        var render = function( timeStamp ) {
            var timeElapsed = lastTimeStamp ? timeStamp - lastTimeStamp : 0; lastTimeStamp = timeStamp;
            gameLoop( timeElapsed );
            renderer.render( scene, camera );
            requestAnimationFrame( render );
        };

        var gameLoop = function( dt ) {
            resetPlayer();
            keyboardControls();
            jumpPads();
            applyPhysics( dt );
            updateCamera();
        };

        var gameViewportSize = function() { return {
            width: window.innerWidth, height: window.innerHeight
        }};
    }
};




var $,layer;
layui.use(['jquery','layer'],function(){
    $ = layui.jquery;
    layer= layui.layer;
    var sid=parseInt($('#pvc').text());
    if(sid){
        $.post('/index/ajaxScene',{'id':sid},function(re){
            if(re.code==1){
                var loader = new THREE.FileLoader();
                loader.load(re.obj.objurl, function ( text ) {
                    init(JSON.parse(text));
                } );
            }else{
            }
        })
    }
})

function init(json){

    var player = new MobilePlayer.Player();

    document.body.appendChild(player.dom);
    player.loadScene(json)
}


