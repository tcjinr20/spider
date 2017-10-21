/**
 * Created by Administrator on 2017/10/21.
 */

var KeyPanControls = function ( object) {

    this.object = object;

    var item = '\
        <div class="up" style="position: absolute;width: 50px;height: 50px;text-align: center;line-height: 50px;top: 0;left:25px">&uarr;</div>\
    <div class="right" style="position: absolute;width: 50px;height: 50px;text-align: center;line-height: 50px;top: 25px;left: 50px;">&rarr;</div>\
    <div class="down" style="position: absolute;width: 50px;height: 50px;text-align: center;line-height: 50px;top: 50px;left: 25px;">&darr;</div>\
    <div class="left" style="position: absolute;width: 50px;height: 50px;text-align: center;line-height: 50px;top: 25px;left: 0px;">&larr;</div>\
   ';
    this.domElement =document.createElement('div');
    this.domElement.style="position: absolute;background: red;width: 100px;height: 100px;border-radius: 50px;overflow: hidden;bottom:0px";
    this.domElement.innerHTML=item
    document.body.appendChild(this.domElement);

    // API

    this.movementSpeed = 1.0;
    this.rollSpeed = 0.005;

    //this.dragToLook = false;
    this.autoForward = false;

    // disable default target object behavior

    // internals

    this.tmpQuaternion = new THREE.Quaternion();

    this.moveState = { up: 0, down: 0, left: 0, right: 0, forward: 0, back: 0, pitchUp: 0, pitchDown: 0, yawLeft: 0, yawRight: 0, rollLeft: 0, rollRight: 0 };
    this.moveVector = new THREE.Vector3( 0, 0, 0 );
    this.rotationVector = new THREE.Vector3( 0, 0, 0 );
    this.enable =false;

    this.setPosition =function(){
        var arg=arguments[0]
        if(arg['left']!=null)
        this.domElement.style.left=arg['left']+"px";
        if(arg['top']!=null)
            this.domElement.style.top=arg['top']+"px";
        if(arg['bottom']!=null)
            this.domElement.style.bottom=arg['bottom']+"px";
        if(arg['right']!=null)
            this.domElement.style.right=arg['right']+"px";
    }

    this.handleEvent = function ( event ) {

        if ( typeof this[ event.type ] == 'function' ) {

            this[ event.type ]( event );

        }

    };

    this.keydown = function( keyCode ) {
        //event.preventDefault();
        this.keyup();
        switch (keyCode ) {
            case 16: /* shift */ this.movementSpeedMultiplier = .1; break;

            case 87: /*W*/ this.moveState.forward = 1; break;
            case 83: /*S*/ this.moveState.back = 1; break;

            case 65: /*A*/ this.moveState.left = 1; break;
            case 68: /*D*/ this.moveState.right = 1; break;

            case 82: /*R*/ this.moveState.up = 1; break;
            case 70: /*F*/ this.moveState.down = 1; break;

            case 38: /*up*/ this.moveState.pitchUp = 1; break;
            case 40: /*down*/ this.moveState.pitchDown = 1; break;

            case 37: /*left*/ this.moveState.yawLeft = 1; break;
            case 39: /*right*/ this.moveState.yawRight = 1; break;

            case 81: /*Q*/ this.moveState.rollLeft = 1; break;
            case 69: /*E*/ this.moveState.rollRight = 1; break;

        }
        this.updateMovementVector();
        this.updateRotationVector();

    };

    this.keyup = function() {
            /* shift */ this.movementSpeedMultiplier = 1;
            /*W*/ this.moveState.forward = 0;
            /*S*/ this.moveState.back = 0;
            /*A*/ this.moveState.left = 0;
            /*D*/ this.moveState.right = 0;
            /*R*/ this.moveState.up = 0;
            /*F*/ this.moveState.down = 0;
            /*up*/ this.moveState.pitchUp = 0;
            /*down*/ this.moveState.pitchDown = 0;
            /*left*/ this.moveState.yawLeft = 0;
            /*right*/ this.moveState.yawRight = 0;
            /*Q*/ this.moveState.rollLeft = 0;
            /*E*/ this.moveState.rollRight = 0;
    };

    this.mousedown = function( event ) {
        this.enable =true;
    };

    this.mousemove = function( event ) {
        if(!this.enable)return;

        var container = this.getContainerDimensions();
        var halfWidth  = container.size[ 0 ] / 2;
        var halfHeight = container.size[ 1 ] / 2;
        var xx =event.pageX-container.offset[ 0 ]-halfWidth;
        var yy =event.pageY - container.offset[ 1 ]- halfHeight;
        var angle=Math.atan2(yy,xx)*180/Math.PI;
        if(angle>=-135&&angle<-45){
            this.keydown(87);"W"
        }else if(angle>=45&&angle<135){
            this.keydown(83);"s"
        }else if(angle>=-45&&angle<45){
            this.keydown(68);"d"
        }else{
            this.keydown(65);"a"
        }
        this.updateRotationVector();
    };

    this.mouseup = function( event ) {
        this.enable =false;
        event.preventDefault();
        event.stopPropagation();
        this.keyup();
    };

    this.update = function( delta ) {
        var moveMult = delta * this.movementSpeed;
        var rotMult = delta * this.rollSpeed;

        this.object.translateX( this.moveVector.x * moveMult );
        this.object.translateY( this.moveVector.y * moveMult );
        this.object.translateZ( this.moveVector.z * moveMult );

        this.tmpQuaternion.set( this.rotationVector.x * rotMult, this.rotationVector.y * rotMult, this.rotationVector.z * rotMult, 1 ).normalize();
        this.object.quaternion.multiply( this.tmpQuaternion );
        // expose the rotation vector for convenience
        this.object.rotation.setFromQuaternion( this.object.quaternion, this.object.rotation.order );
    };

    this.updateMovementVector = function() {
        var forward = ( this.moveState.forward || ( this.autoForward && ! this.moveState.back ) ) ? 1 : 0;

        this.moveVector.x = ( - this.moveState.left    + this.moveState.right );
        this.moveVector.y = ( - this.moveState.down    + this.moveState.up );
        this.moveVector.z = ( - forward + this.moveState.back );
    };

    this.updateRotationVector = function() {
        this.rotationVector.x = ( - this.moveState.pitchDown + this.moveState.pitchUp );
        this.rotationVector.y = ( - this.moveState.yawRight  + this.moveState.yawLeft );
        this.rotationVector.z = ( - this.moveState.rollRight + this.moveState.rollLeft );
    };

    this.getContainerDimensions = function() {
        if ( this.domElement != document ) {
            return {
                size	: [ this.domElement.offsetWidth, this.domElement.offsetHeight ],
                offset	: [ this.domElement.offsetLeft,  this.domElement.offsetTop ]
            };
        } else {
            return {
                size	: [ window.innerWidth, window.innerHeight ],
                offset	: [ 0, 0 ]
            };
        }
    };

    function bind( scope, fn ) {

        return function () {

            fn.apply( scope, arguments );

        };

    }

    function contextmenu( event ) {
        event.preventDefault();
    }

    this.dispose = function() {
        this.enable =false;
        this.domElement.removeEventListener( 'contextmenu', contextmenu, false );
        this.domElement.removeEventListener( 'mousedown', _mousedown, false );
        this.domElement.removeEventListener( 'mousemove', _mousemove, false );
        this.domElement.removeEventListener( 'mouseup', _mouseup, false );
    };

    var _mousemove = bind( this, this.mousemove );
    var _mousedown = bind( this, this.mousedown );
    var _mouseup = bind( this, this.mouseup );
    this.domElement.addEventListener( 'contextmenu', contextmenu, false );

    this.domElement.addEventListener( 'mousemove', _mousemove, false );
    this.domElement.addEventListener( 'mousedown', _mousedown, false );
    this.domElement.addEventListener( 'mouseup',   _mouseup, false );
    this.updateMovementVector();
    this.updateRotationVector();
};
